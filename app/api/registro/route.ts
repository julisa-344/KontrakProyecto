import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    const { nombres, apellidos, dni, email, password } = await req.json()

    // Validar que el email no exista
    const existingUser = await prisma.usuario.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "El correo electrónico ya está registrado" },
        { status: 400 }
      )
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear usuario con rol CONTRATISTA
    const usuario = await prisma.usuario.create({
      data: {
        nombres,
        apellidos,
        dni,
        email,
        password: hashedPassword,
        rol: "CONTRATISTA",
        estado: true
      }
    })

    return NextResponse.json({
      message: "Usuario registrado exitosamente",
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombres: usuario.nombres
      }
    })
  } catch (error) {
    console.error("Error en registro:", error)
    return NextResponse.json(
      { error: "Error al registrar usuario" },
      { status: 500 }
    )
  }
}
