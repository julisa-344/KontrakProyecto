import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { nextCookies } from "better-auth/next-js"
import { prisma } from "@/lib/prisma"

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectURI: `${process.env.BETTER_AUTH_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/api/auth/callback/google`,
      mapProfileToUser: (profile) => ({
        name: ([profile.given_name, profile.family_name].filter(Boolean).join(" ").trim() || profile.name) ?? profile.name,
        nomprop: profile.given_name ?? undefined,
        apeprop: profile.family_name ?? undefined,
      }),
    },
  },
  user: {
    additionalFields: {
      rol: {
        type: "string",
        required: false,
        defaultValue: "CLIENTE",
        input: false,
      },
      nomprop: { type: "string", required: false, input: true },
      apeprop: { type: "string", required: false, input: true },
      dniprop: { type: "string", required: false, input: true },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const u = user as { rol?: string; nomprop?: string; apeprop?: string; dniprop?: string }
          const existingUsuario = await prisma.usuario.findUnique({
            where: { emailprop: user.email },
          })
          if (!existingUsuario) {
            const nameParts = (user.name || "").trim().split(" ")
            const nomprop = u.nomprop ?? nameParts[0] ?? ""
            const apeprop = u.apeprop ?? (nameParts.slice(1).join(" ") || null)
            await prisma.usuario.create({
              data: {
                authUserId: user.id,
                emailprop: user.email,
                nomprop: nomprop,
                apeprop: apeprop,
                dniprop: u.dniprop ?? null,
                rol: u.rol ?? "CLIENTE",
                estprop: true,
              },
            })
          } else {
            await prisma.usuario.update({
              where: { idprop: existingUsuario.idprop },
              data: { authUserId: user.id },
            })
          }
        },
      },
    },
  },
  plugins: [nextCookies()],
})
