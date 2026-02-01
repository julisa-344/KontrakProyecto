import { EstadoReserva, EstadoVehiculo } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { getSessionAndUsuario } from "@/lib/auth-helpers"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { usuario } = await getSessionAndUsuario()

    if (!usuario) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const reservaId = parseInt(params.id)
    const userId = usuario.idprop

    // Buscar la reserva
    const reserva = await prisma.reserva.findUnique({
      where: { idres: reservaId },
      include: { vehiculo: true }
    })

    if (!reserva) {
      return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 })
    }

    // Validación de seguridad: ¿La reserva es mía?
    if (reserva.idcli !== userId) {
      return NextResponse.json(
        { error: "No tienes permiso para cancelar esta reserva" },
        { status: 403 }
      )
    }

    // Validación de estado: ¿Se puede cancelar?
    if (
      reserva.estado !== EstadoReserva.PENDIENTE &&
      reserva.estado !== EstadoReserva.CONFIRMADA
    ) {
      return NextResponse.json(
        { error: "No se puede cancelar una reserva que ya está en uso o finalizada" },
        { status: 400 }
      )
    }

    if (!reserva.idveh) {
      return NextResponse.json({ error: "Reserva inválida" }, { status: 400 })
    }

    // Cancelar reserva y liberar equipo en una transacción
    await prisma.$transaction([
      // Actualizar reserva
      prisma.reserva.update({
        where: { idres: reservaId },
        data: {
          estado: EstadoReserva.CANCELADA,
          fechafinalizacion: new Date()
        }
      }),
      // Liberar equipo
      prisma.vehiculo.update({
        where: { idveh: reserva.idveh },
        data: {
          estveh: EstadoVehiculo.DISPONIBLE
        }
      })
    ])

    return NextResponse.redirect(new URL("/mis-reservas", req.url))
  } catch (error) {
    return NextResponse.json(
      { error: "Error al cancelar la reserva" },
      { status: 500 }
    )
  }
}
