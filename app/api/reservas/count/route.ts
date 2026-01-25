import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ count: 0 })
    }

    const userId = parseInt((session.user as any).id)

    const count = await prisma.reserva.count({
      where: {
        idcli: userId,
        estado: {
          in: ["PENDIENTE", "CONFIRMADA", "EN_USO", "ESPERANDO_CLIENTE", "ESPERANDO_PROPIETARIO"]
        }
      }
    })

    return NextResponse.json({ count })
  } catch (error) {
    return NextResponse.json({ count: 0 })
  }
}
