"use client"

import { useCart } from "@/components/CartContext"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { MessageCircle, CheckCircle, Package, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"

export default function CartPage() {
  const { items, removeFromCart, clearCart } = useCart()
  const { data: session } = useSession()
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [fechaError, setFechaError] = useState("")
  const [telefono, setTelefono] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [urlWhatsApp, setUrlWhatsApp] = useState<string | null>(null)
  const [totalGeneral, setTotalGeneral] = useState(0)

  // Prellenar teléfono desde Mi Cuenta si el usuario está logueado
  useEffect(() => {
    if (session?.user) {
      fetch("/api/mi-cuenta")
        .then((r) => r.json())
        .then((d) => { if (d.telefonoprop) setTelefono(d.telefonoprop) })
        .catch(() => {})
    }
  }, [session?.user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setFechaError("")
    // Validaciones de fechas
    const hoy = new Date()
    hoy.setHours(0,0,0,0)
    const inicio = fechaInicio ? new Date(fechaInicio) : null
    const fin = fechaFin ? new Date(fechaFin) : null
    if (!inicio || !fin) {
      setFechaError("Debes seleccionar ambas fechas.")
      setLoading(false)
      return
    }
    if (inicio < hoy) {
      setFechaError("La fecha de inicio no puede ser anterior a hoy.")
      setLoading(false)
      return
    }
    if (fin < inicio) {
      setFechaError("La fecha de fin no puede ser anterior a la de inicio.")
      setLoading(false)
      return
    }
    try {
      const res = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equipos: items,
          fechaInicio,
          fechaFin,
          telefono: telefono.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
        setUrlWhatsApp(data.urlWhatsApp || null)
        setTotalGeneral(data.totalGeneral || 0)
        clearCart()
      } else {
        if (res.status === 401) {
          setError("Inicia sesión para poder solicitar el alquiler.")
        } else {
          setError(data.error || "Error al enviar la solicitud")
        }
      }
    } catch {
      setError("Error de red")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto mt-16 px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-secondary mb-2">¡Solicitud registrada!</h2>
          <p className="text-gray-600 mb-6">
            Tus reservas han sido guardadas. Envía los datos al asesor por WhatsApp para coordinar el pago y la entrega.
          </p>
          {urlWhatsApp ? (
            <a
              href={urlWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#20bd5a] transition shadow-md"
            >
              <MessageCircle className="w-5 h-5" />
              Enviar al asesor por WhatsApp
            </a>
          ) : null}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Total solicitado: <span className="font-semibold text-secondary">S/ {totalGeneral.toFixed(2)}</span></p>
            <Link
              href="/mis-reservas"
              className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
            >
              <Package className="w-4 h-4" />
              Ver mis reservas
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-secondary mb-8">Carrito de Alquiler</h1>
      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500 mb-4">Tu carrito está vacío</p>
          <Link
            href="/catalogo"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition"
          >
            Explorar Catálogo
          </Link>
        </div>
      ) : (
        <form className="space-y-4 max-w-2xl mx-auto" onSubmit={handleSubmit}>
          {!session && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm flex flex-wrap items-center justify-between gap-2">
              <span>Inicia sesión para poder solicitar el alquiler.</span>
              <Link href="/login" className="text-primary font-semibold hover:underline">Iniciar sesión →</Link>
            </div>
          )}
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-6 flex items-center gap-4">
              {item.imagen && (
                <Image src={item.imagen} alt={item.nombre} width={80} height={60} className="rounded object-cover" />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-secondary">{item.nombre}</h3>
                <p className="text-primary font-semibold">S/. {item.precio.toFixed(2)} / día</p>
              </div>
              <button
                type="button"
                onClick={() => removeFromCart(item.id)}
                className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-full transition flex items-center justify-center"
                title="Quitar del carrito"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de inicio</label>
                  <input
                    type="date"
                    required
                    value={fechaInicio}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de fin</label>
                  <input
                    type="date"
                    required
                    value={fechaFin}
                    min={fechaInicio || new Date().toISOString().split("T")[0]}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              {fechaError && (
                <div className="text-red-600 text-sm font-medium mt-1">{fechaError}</div>
              )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tu teléfono / WhatsApp</label>
              <input
                type="tel"
                required
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="ej. 989 123 456"
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Para que el asesor pueda contactarte y coordinar pago y entrega.</p>
            </div>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span>{error}</span>
              {error.includes("sesión") && (
                <Link href="/login" className="text-primary font-semibold hover:underline shrink-0">
                  Ir a Iniciar sesión →
                </Link>
              )}
            </div>
          )}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={clearCart}
              className="bg-gray-200 hover:bg-gray-300 text-secondary px-6 py-2.5 rounded-lg font-semibold flex-1 transition"
            >
              Vaciar Carrito
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold flex-1 hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Solicitar alquiler"}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
