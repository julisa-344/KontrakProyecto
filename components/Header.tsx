"use client"

import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { useCart } from "@/components/CartContext"
import { LogOut, User, Menu, X, ShoppingCart, LayoutDashboard } from "lucide-react"
import { useState, useEffect } from "react"

export function Header() {
  const { data: session } = authClient.useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [reservasCount, setReservasCount] = useState(0)
  const { items: cartItems } = useCart()

  // Obtener el conteo de reservas activas
  useEffect(() => {
    if (session?.user) {
      fetch('/api/reservas/count')
        .then(res => res.json())
        .then(data => setReservasCount(data.count || 0))
        .catch(() => setReservasCount(0))
    } else {
      setReservasCount(0)
    }
  }, [session])

  return (
    <header className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary rounded-lg p-2">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 18.5C18 19.8807 16.8807 21 15.5 21C14.1193 21 13 19.8807 13 18.5C13 17.1193 14.1193 16 15.5 16C16.8807 16 18 17.1193 18 18.5Z" />
                <path d="M8.5 21C9.88071 21 11 19.8807 11 18.5C11 17.1193 9.88071 16 8.5 16C7.11929 16 6 17.1193 6 18.5C6 19.8807 7.11929 21 8.5 21Z" />
                <path d="M5 16H7V13H17V16H19V12C19 11.4477 18.5523 11 18 11H6C5.44772 11 5 11.4477 5 12V16Z" />
                <path d="M17 10H7L5 6H19L17 10Z" />
              </svg>
            </div>
            <span className="text-2xl font-bold">KontraK</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/catalogo" className="hover:bg-white/20 hover:rounded px-2 py-1 -mx-2 transition">
              Catálogo
            </Link>
            {(session?.user as { rol?: string } | undefined)?.rol?.toUpperCase() === "ADMINISTRADOR" &&
              process.env.NEXT_PUBLIC_ADMIN_URL && (
                <a
                  href={process.env.NEXT_PUBLIC_ADMIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:bg-white/20 hover:rounded px-2 py-1 -mx-2 transition"
                  title="Panel de administración (abre en nueva pestaña)"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Panel Admin</span>
                </a>
              )}
            {/* Carrito siempre visible */}
            <Link 
              href="/cart"
              className="relative hover:bg-white/20 hover:rounded px-2 py-1 -mx-2 transition flex items-center gap-2"
              title="Carrito"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </div>
              <span>Carrito</span>
            </Link>
            {session ? (
              <>
                <Link href="/historial" className="hover:bg-white/20 hover:rounded px-2 py-1 -mx-2 transition">
                  Historial
                </Link>
                <div className="flex items-center space-x-3 border-l border-white/30 pl-6">
                  <Link 
                    href="/mi-cuenta"
                    className="flex items-center space-x-2 hover:bg-white/20 hover:rounded-lg px-2 py-1.5 -mx-2 transition"
                    title="Mi Cuenta"
                  >
                    <div className="bg-white/20 rounded-full p-2 border-2 border-white/50">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-semibold">Cuenta</span>
                  </Link>
                  <button
                    onClick={() => authClient.signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/" } } })}
                    className="flex items-center space-x-1 bg-white text-primary hover:bg-white/90 px-4 py-2 rounded-lg font-semibold transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Salir</span>
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-primary hover:bg-primary/90 px-6 py-2 rounded-lg transition"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            <Link
              href="/catalogo"
              className="block py-2 hover:bg-white/20 hover:rounded px-2 -mx-2 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Catálogo
            </Link>
            {(session?.user as { rol?: string } | undefined)?.rol?.toUpperCase() === "ADMINISTRADOR" &&
              process.env.NEXT_PUBLIC_ADMIN_URL && (
                <a
                  href={process.env.NEXT_PUBLIC_ADMIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 py-2 hover:bg-white/20 hover:rounded px-2 -mx-2 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Panel Admin
                </a>
              )}
            <Link
              href="/cart"
              className="block py-2 hover:bg-white/20 hover:rounded px-2 -mx-2 transition flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Carrito {cartItems.length > 0 && <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 inline-flex items-center justify-center">{cartItems.length}</span>}
            </Link>
            {session ? (
              <>
                <Link
                  href="/mis-reservas"
                  className="block py-2 hover:bg-white/20 hover:rounded px-2 -mx-2 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Mis Reservas
                </Link>
                <Link
                  href="/historial"
                  className="block py-2 hover:bg-white/20 hover:rounded px-2 -mx-2 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Historial
                </Link>
                <Link
                  href="/mi-cuenta"
                  className="block py-2 hover:bg-white/20 hover:rounded px-2 -mx-2 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Mi Cuenta
                </Link>
                <div className="pt-2 border-t border-white/30">
                  <p className="text-sm mb-2">{session.user?.name}</p>
                  <button
                    onClick={() => authClient.signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/" } } })}
                    className="w-full bg-white text-primary hover:bg-white/90 px-4 py-2 rounded-lg font-semibold transition"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="block bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg text-center transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}
