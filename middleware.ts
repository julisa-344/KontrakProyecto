import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const pathname = req.nextUrl.pathname

  const protectedRoutes = ["/mis-reservas", "/historial", "/mi-cuenta"]

  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if ((pathname === "/login" || pathname === "/registro") && isLoggedIn) {
    return NextResponse.redirect(new URL("/catalogo", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
