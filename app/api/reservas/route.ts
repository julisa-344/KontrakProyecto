import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

const ADMIN_WHATSAPP = "51989312330"

function buildWhatsAppUrl(
  tipo: "carrito" | "unidad",
  datos: {
    cliente: string
    telefono: string
    equipos: { nombre: string; costo: number }[]
    fechaInicio: string
    fechaFin: string
    total: number
  }
) {
  const lineas = [
    "*Nueva solicitud de alquiler - KontraK*",
    "",
    `*Cliente:* ${datos.cliente}`,
    `*Teléfono:* ${datos.telefono}`,
    "",
    "*Equipos:*",
    ...datos.equipos.map((e) => `• ${e.nombre} — S/ ${e.costo}`),
    "",
    `*Período:* ${datos.fechaInicio} a ${datos.fechaFin}`,
    `*Total:* S/ ${datos.total}`,
    "",
    "Gracias.",
  ]
  const text = encodeURIComponent(lineas.join("\n"))
  return `https://wa.me/${ADMIN_WHATSAPP}?text=${text}`
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }
    const userId = parseInt((session.user as any).id)
    const body = await req.json()

    // ——— Flujo: un solo equipo (detalle) ———
    if (body.equipoId != null) {
      const { equipoId, fechainicio, fechafin, telefono } = body
      if (!equipoId || !fechainicio || !fechafin) {
        return NextResponse.json({ error: "Fechas y equipo son requeridos" }, { status: 400 })
      }
      const inicio = new Date(fechainicio)
      const fin = new Date(fechafin)
      const dias = Math.max(1, Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)))

      const equipo = await prisma.vehiculo.findUnique({ where: { idveh: parseInt(String(equipoId)) } })
      if (!equipo) return NextResponse.json({ error: "Equipo no encontrado" }, { status: 404 })
      if (equipo.estveh !== "DISPONIBLE") {
        return NextResponse.json({ error: "El equipo no está disponible" }, { status: 400 })
      }

      const costo = Math.round((equipo.precioalquilo || 0) * dias)
      const nombreEquipo = `${equipo.marveh || ""} ${equipo.modveh || ""}`.trim() || equipo.plaveh || "Equipo"

      const reserva = await prisma.$transaction(async (tx) => {
        const r = await tx.reserva.create({
          data: {
            idcli: userId,
            idveh: equipo.idveh,
            fechainicio: inicio,
            fechafin: fin,
            costo,
            estado: "PENDIENTE",
            fechares: new Date(),
          },
        })
        await tx.vehiculo.update({
          where: { idveh: equipo.idveh },
          data: { estveh: "OCUPADO" },
        })
        return r
      })

      const cliente = session.user.name || session.user.email || "Cliente"
      const tel = telefono || "No indicado"
      const fIni = inicio.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" })
      const fFin = fin.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" })
      const urlWhatsApp = buildWhatsAppUrl("unidad", {
        cliente,
        telefono: tel,
        equipos: [{ nombre: nombreEquipo, costo }],
        fechaInicio: fIni,
        fechaFin: fFin,
        total: costo,
      })

      return NextResponse.json({
        success: true,
        reserva: { idres: reserva.idres, costo },
        equipo: { marveh: equipo.marveh, modveh: equipo.modveh },
        fechaInicio: fIni,
        fechaFin: fFin,
        dias,
        urlWhatsApp,
      })
    }

    // ——— Flujo: carrito (varios equipos) ———
    const { equipos, fechaInicio, fechaFin, telefono } = body
    if (!equipos?.length || !fechaInicio || !fechaFin) {
      return NextResponse.json({ error: "Datos incompletos: equipos y fechas requeridos" }, { status: 400 })
    }

    const inicio = new Date(fechaInicio)
    const fin = new Date(fechaFin)
    const dias = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24))
    if (dias < 1) {
      return NextResponse.json({ error: "La fecha de fin debe ser posterior a la fecha de inicio" }, { status: 400 })
    }

    const resultados: { id: number; reservaId?: number; costo?: number; dias?: number; nombre?: string; error?: string }[] = []
    let totalGeneral = 0

    for (const item of equipos) {
      const equipo = await prisma.vehiculo.findUnique({ where: { idveh: parseInt(item.id) } })
      if (!equipo) {
        resultados.push({ id: item.id, error: "Equipo no encontrado" })
        continue
      }
      if (equipo.estveh !== "DISPONIBLE") {
        resultados.push({ id: item.id, error: "El equipo no está disponible" })
        continue
      }
      const costo = Math.round((equipo.precioalquilo || 0) * dias)
      const nombre = `${equipo.marveh || ""} ${equipo.modveh || ""}`.trim() || equipo.plaveh || "Equipo"

      try {
        const reserva = await prisma.$transaction(async (tx) => {
          const r = await tx.reserva.create({
            data: {
              idcli: userId,
              idveh: equipo.idveh,
              fechainicio: inicio,
              fechafin: fin,
              costo,
              estado: "PENDIENTE",
              fechares: new Date(),
            },
          })
          await tx.vehiculo.update({
            where: { idveh: equipo.idveh },
            data: { estveh: "OCUPADO" },
          })
          return r
        })
        totalGeneral += costo
        resultados.push({ id: equipo.idveh, reservaId: reserva.idres, costo, dias, nombre })
      } catch {
        resultados.push({ id: item.id, error: "Error al crear reserva" })
      }
    }

    const cliente = session.user.name || session.user.email || "Cliente"
    const tel = telefono || "No indicado"
    const fIni = inicio.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" })
    const fFin = fin.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" })
    const equiposParaWs = resultados.filter((r) => r.nombre && r.costo != null).map((r) => ({ nombre: r.nombre!, costo: r.costo! }))
    const urlWhatsApp = buildWhatsAppUrl("carrito", {
      cliente,
      telefono: tel,
      equipos: equiposParaWs,
      fechaInicio: fIni,
      fechaFin: fFin,
      total: totalGeneral,
    })

    return NextResponse.json({
      success: true,
      resultados,
      totalGeneral,
      fechaInicio: fIni,
      fechaFin: fFin,
      urlWhatsApp,
    })
  } catch (error) {
    return NextResponse.json({ error: "Error al procesar la reserva" }, { status: 500 })
  }
}
