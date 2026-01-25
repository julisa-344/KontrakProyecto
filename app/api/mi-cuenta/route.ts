import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    const id = parseInt((session.user as any).id)
    const u = await prisma.usuario.findUnique({
      where: { idprop: id },
      select: { nomprop: true, apeprop: true, dniprop: true, emailprop: true, telefonoprop: true, rol: true },
    })
    if (!u) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    return NextResponse.json(u)
  } catch {
    return NextResponse.json({ error: "Error al obtener datos" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    const id = parseInt((session.user as any).id)
    const body = await req.json()
    const { nomprop, apeprop, dniprop, emailprop, telefonoprop } = body

    const update: Record<string, unknown> = {}
    if (typeof nomprop === "string" && nomprop.trim()) update.nomprop = nomprop.trim()
    if (typeof apeprop === "string") update.apeprop = apeprop.trim() || null
    if (typeof dniprop === "string") update.dniprop = dniprop.trim() || null
    if (typeof emailprop === "string" && emailprop.trim()) {
      const exist = await prisma.usuario.findFirst({
        where: { emailprop: emailprop.trim(), NOT: { idprop: id } },
      })
      if (exist) return NextResponse.json({ error: "Ese correo ya está en uso por otra cuenta" }, { status: 400 })
      update.emailprop = emailprop.trim()
    }
    if (typeof telefonoprop === "string") update.telefonoprop = telefonoprop.trim() || null

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "No hay datos válidos para actualizar" }, { status: 400 })
    }

    const u = await prisma.usuario.update({
      where: { idprop: id },
      data: update as any,
      select: { nomprop: true, apeprop: true, dniprop: true, emailprop: true, telefonoprop: true },
    })
    return NextResponse.json(u)
  } catch (e) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 })
  }
}
