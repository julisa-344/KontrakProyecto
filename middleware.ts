import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

export function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)
  const pathname = request.nextUrl.pathname
  const isLoggedIn = !!sessionCookie

  const protectedRoutes = ["/mis-reservas", "/historial", "/mi-cuenta"]
  const authRoutes = ["/login", "/registro"]

  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (authRoutes.some((route) => pathname.startsWith(route)) && isLoggedIn) {
    return NextResponse.redirect(new URL("/catalogo", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth).*)"],
}
