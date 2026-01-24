import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { Rol } from "@prisma/client"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const usuario = await prisma.usuario.findUnique({
          where: {
            email: credentials.email as string
          }
        })

        if (!usuario) {
          return null
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          usuario.password
        )

        if (!passwordMatch) {
          return null
        }

        // Solo permitir login a CONTRATISTA y CLIENTE en esta app
        if (usuario.rol !== Rol.CONTRATISTA && usuario.rol !== Rol.CLIENTE) {
          return null
        }

        return {
          id: usuario.id.toString(),
          email: usuario.email,
          name: `${usuario.nombres} ${usuario.apellidos}`,
          rol: usuario.rol
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.rol = (user as any).rol
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
        (session.user as any).rol = token.rol
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt"
  }
})
