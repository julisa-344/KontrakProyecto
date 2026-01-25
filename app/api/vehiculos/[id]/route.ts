import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const equipo = await prisma.vehiculo.findUnique({
      where: {
        idveh: parseInt(params.id)
      }
    })

    if (!equipo) {
      return NextResponse.json(
        { error: "Equipo no encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(equipo)
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener el equipo" },
      { status: 500 }
    )
  }
}
