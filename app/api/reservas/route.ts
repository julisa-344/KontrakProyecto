import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }
    const userId = parseInt((session.user as any).id)
    const { equipos, fechaInicio, fechaFin } = await req.json()
    if (!equipos?.length || !fechaInicio || !fechaFin) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }
    const inicio = new Date(fechaInicio)
    const fin = new Date(fechaFin)
    const dias = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24))
    if (dias < 1) {
      return NextResponse.json({ error: "La fecha de fin debe ser posterior a la fecha de inicio" }, { status: 400 })
    }
    // Procesar reservas para cada equipo
    const resultados = []
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
      try {
        const reserva = await prisma.$transaction(async (tx) => {
          const nuevaReserva = await tx.reserva.create({
            data: {
              idcli: userId,
              idveh: equipo.idveh,
              fechainicio: inicio,
              fechafin: fin,
              costo: costo,
              estado: "PENDIENTE",
              fechares: new Date()
            }
          })
          await tx.vehiculo.update({
            where: { idveh: equipo.idveh },
            data: { estveh: "OCUPADO" }
          })
          return nuevaReserva
        })
        resultados.push({ id: equipo.idveh, reservaId: reserva.idres, costo, dias })
      } catch (err) {
        resultados.push({ id: item.id, error: "Error al crear reserva" })
      }
    }
    return NextResponse.json({ success: true, resultados })
  } catch (error) {
    return NextResponse.json(
      { error: "Error al procesar la reserva" },
      { status: 500 }
    )
  }
}
