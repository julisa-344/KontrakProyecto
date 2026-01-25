"use client"


import { useCart } from "@/components/CartContext"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function CartPage() {
  const { items, removeFromCart, clearCart } = useCart()
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ equipos: items, fechaInicio, fechaFin }),
      })
      if (res.ok) {
        setSuccess(true)
        clearCart()
      } else {
        const data = await res.json()
        setError(data.error || "Error al enviar la solicitud")
      }
    } catch (err) {
      setError("Error de red")
    } finally {
      setLoading(false)
    }
  }

  if (success)
    return (
      <div className="max-w-xl mx-auto mt-20 text-center">
        <h2 className="text-2xl font-bold mb-4">¡Solicitud enviada!</h2>
        <p>Un asesor se pondrá en contacto contigo para coordinar el pago y la entrega.</p>
        <Link href="/mis-reservas" className="mt-6 inline-block text-primary underline">Ver mis reservas</Link>
      </div>
    )

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
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-6 flex items-center gap-4">
              {item.imagen && (
                <Image src={item.imagen} alt={item.nombre} width={80} height={60} className="rounded" />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-secondary">{item.nombre}</h3>
                <p className="text-primary font-semibold">S/. {item.precio.toFixed(2)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeFromCart(item.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                Quitar
              </button>
            </div>
          ))}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1">Fecha de inicio</label>
              <input type="date" required value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} className="border rounded px-3 py-2 w-full" />
            </div>
            <div className="flex-1">
              <label className="block mb-1">Fecha de fin</label>
              <input type="date" required value={fechaFin} onChange={e => setFechaFin(e.target.value)} className="border rounded px-3 py-2 w-full" />
            </div>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={clearCart}
              className="bg-gray-200 hover:bg-gray-300 text-secondary px-6 py-2 rounded-lg font-semibold flex-1"
            >
              Vaciar Carrito
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-lg font-semibold flex-1"
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
