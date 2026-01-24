import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const reservaId = parseInt(params.id)
    const userId = parseInt((session.user as any).id)

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
      reserva.estado !== "PENDIENTE" &&
      reserva.estado !== "CONFIRMADA"
    ) {
      return NextResponse.json(
        { error: "No se puede cancelar una reserva que ya está en uso o finalizada" },
        { status: 400 }
      )
    }

    // Cancelar reserva y liberar equipo en una transacción
    await prisma.$transaction([
      // Actualizar reserva
      prisma.reserva.update({
        where: { idres: reservaId },
        data: {
          estado: "CANCELADA",
          fechafinalizacion: new Date()
        }
      }),
      // Liberar equipo
      prisma.vehiculo.update({
        where: { idveh: reserva.idveh },
        data: {
          estveh: "DISPONIBLE"
        }
      })
    ])

    return NextResponse.redirect(new URL("/mis-reservas", req.url))
  } catch (error) {
    console.error("Error al cancelar reserva:", error)
    return NextResponse.json(
      { error: "Error al cancelar la reserva" },
      { status: 500 }
    )
  }
}
