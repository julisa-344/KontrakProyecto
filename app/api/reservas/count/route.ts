import { EstadoReserva } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionAndUsuario } from "@/lib/auth-helpers"

export async function GET(req: NextRequest) {
  try {
    const { usuario } = await getSessionAndUsuario()

    if (!usuario) {
      return NextResponse.json({ count: 0 })
    }

    const userId = usuario.idprop

    const count = await prisma.reserva.count({
      where: {
        idcli: userId,
        estado: {
          in: [EstadoReserva.PENDIENTE, EstadoReserva.CONFIRMADA]
        }
      }
    })

    return NextResponse.json({ count })
  } catch (error) {
    return NextResponse.json({ count: 0 })
  }
}
