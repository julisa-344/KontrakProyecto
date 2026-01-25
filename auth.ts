import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email y contraseña son requeridos")
          }

          const usuario = await prisma.usuario.findUnique({
            where: {
              emailprop: credentials.email as string
            }
          })

          if (!usuario) {
            throw new Error("Usuario no encontrado")
          }

          if (!usuario.password) {
            throw new Error("Contraseña no configurada")
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password as string,
            usuario.password
          )

          if (!passwordMatch) {
            throw new Error("Contraseña incorrecta")
          }

          // Solo permitir login a CONTRATISTA y CLIENTE en esta app
          const rolUpper = usuario.rol?.toUpperCase()
          if (rolUpper !== "CONTRATISTA" && rolUpper !== "CLIENTE") {
            throw new Error("Rol no autorizado")
          }

          return {
            id: usuario.idprop.toString(),
            email: usuario.emailprop || "",
            name: `${usuario.nomprop || ""} ${usuario.apeprop || ""}`.trim(),
            rol: usuario.rol
          }
        } catch (error) {
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.rol = user.rol
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : ""
        session.user.rol = typeof token.rol === "string" ? token.rol : null
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt"
  },
  trustHost: true
})
