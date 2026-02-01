import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"

/**
 * Obtiene la sesión de better-auth y el usuario de la tabla usuario (idprop).
 * Usa session.user.email para buscar en usuario.emailprop o usuario.authUserId.
 */
export async function getSessionAndUsuario() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session?.user) return { session: null, usuario: null }

  const usuario = await prisma.usuario.findFirst({
    where: {
      OR: [
        { emailprop: session.user.email ?? undefined },
        { authUserId: session.user.id },
      ],
    },
  })
  return { session, usuario }
}
