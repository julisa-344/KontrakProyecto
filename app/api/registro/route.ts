import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    const { nombres, apellidos, dni, email, password } = await req.json()

    // Validar que el email no exista
    const existingUser = await prisma.usuario.findUnique({
      where: { emailprop: email }
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
        nomprop: nombres,
        apeprop: apellidos,
        dniprop: dni,
        emailprop: email,
        password: hashedPassword,
        rol: "CONTRATISTA",
        estprop: true
      }
    })

    return NextResponse.json({
      message: "Usuario registrado exitosamente",
      usuario: {
        id: usuario.idprop,
        email: usuario.emailprop,
        nombres: usuario.nomprop
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Error al registrar usuario" },
      { status: 500 }
    )
  }
}
