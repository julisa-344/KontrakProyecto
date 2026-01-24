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
    const { equipoId, fechainicio, fechafin } = await req.json()

    // Validar que el equipo existe y está disponible
    const equipo = await prisma.vehiculo.findUnique({
      where: { idveh: parseInt(equipoId) }
    })

    if (!equipo) {
      return NextResponse.json({ error: "Equipo no encontrado" }, { status: 404 })
    }

    if (equipo.estveh !== "DISPONIBLE") {
      return NextResponse.json({ error: "El equipo no está disponible" }, { status: 400 })
    }

    // Calcular días y costo
    const inicio = new Date(fechainicio)
    const fin = new Date(fechafin)
    const dias = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24))

    if (dias < 1) {
      return NextResponse.json({ error: "La fecha de fin debe ser posterior a la fecha de inicio" }, { status: 400 })
    }

    const costo = Math.round((equipo.precioalquilo || 0) * dias)

    // Crear reserva y actualizar estado del equipo en transacción
    const reserva = await prisma.$transaction(async (tx) => {
      // Crear la reserva
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

      // Actualizar estado del equipo a OCUPADO
      await tx.vehiculo.update({
        where: { idveh: equipo.idveh },
        data: { estveh: "OCUPADO" }
      })

      return nuevaReserva
    })

    return NextResponse.json({
      success: true,
      message: "Reserva creada exitosamente",
      reserva: {
        id: reserva.idres,
        costo: reserva.costo,
        dias: dias
      }
    })

  } catch (error) {
    console.error("Error al crear reserva:", error)
    return NextResponse.json(
      { error: "Error al procesar la reserva" },
      { status: 500 }
    )
  }
}
