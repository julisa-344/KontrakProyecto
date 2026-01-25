import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const pathname = req.nextUrl.pathname

  // Rutas protegidas que requieren autenticación
  const protectedRoutes = ['/mis-reservas', '/historial', '/mi-cuenta']
  
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Si está en login/registro y ya está autenticado, redirigir al catálogo
  if ((pathname === '/login' || pathname === '/registro') && isLoggedIn) {
    return NextResponse.redirect(new URL('/catalogo', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
