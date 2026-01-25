import type { NextAuthConfig } from "next-auth"

/**
 * Configuración base de Auth.js para Edge (middleware).
 * NO importar Prisma, bcrypt ni otras dependencias de servidor.
 */
export const authConfig: NextAuthConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [],
  callbacks: {
    session({ session, token }) {
      if (session?.user) {
        session.user.id = typeof token.id === "string" ? token.id : ""
        session.user.rol = typeof token.rol === "string" ? token.rol : null
      }
      return session
    },
  },
}
