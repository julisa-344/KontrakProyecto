"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Calendar, MessageCircle, CheckCircle, Package } from "lucide-react"
import { toast } from "sonner"

interface ReservaFormProps {
  equipoId: number
  precioAlquilo: number
  disponible: boolean
}

export function ReservaForm({ equipoId, precioAlquilo, disponible }: ReservaFormProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [dias, setDias] = useState(1)
  const [telefono, setTelefono] = useState("")
  const [success, setSuccess] = useState<{ urlWhatsApp: string; costo: number } | null>(null)

  useEffect(() => {
    if (session?.user) {
      fetch("/api/mi-cuenta")
        .then((r) => r.json())
        .then((d) => { if (d?.telefonoprop) setTelefono(d.telefonoprop) })
        .catch(() => {})
    }
  }, [session?.user])

  const mañana = new Date(Date.now() + 86400000).toISOString().split("T")[0]
  const [fechainicio, setFechaInicio] = useState(mañana)
  const [fechafin, setFechaFin] = useState(mañana)

  const calcularDias = (inicio: string, fin: string) => {
    const inicioDate = new Date(inicio)
    const finDate = new Date(fin)
    const diferencia = Math.ceil((finDate.getTime() - inicioDate.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(1, diferencia)
  }

  const handleFechaInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setFechaInicio(v)
    if (v > fechafin) {
      setFechaFin(v)
      setDias(1)
    } else {
      setDias(calcularDias(v, fechafin))
    }
  }

  const handleFechaFinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFechaFin(e.target.value)
    setDias(calcularDias(fechainicio, e.target.value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equipoId,
          fechainicio,
          fechafin,
          telefono: telefono.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al crear la reserva")
      setSuccess({ urlWhatsApp: data.urlWhatsApp, costo: data.reserva?.costo ?? 0 })
      toast.success("Reserva creada. Envía los datos al asesor por WhatsApp.")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const costoTotal = precioAlquilo * dias

  if (!disponible) {
    return (
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-6">
        <p className="text-gray-600 text-center">Este equipo no está disponible actualmente</p>
      </div>
    )
  }

  if (success) {
    return (
      <div className="bg-white border-2 border-green-200 rounded-lg p-6">
        <div className="flex items-center gap-2 text-green-700 mb-4">
          <CheckCircle className="w-6 h-6" />
          <span className="font-semibold">Reserva registrada — Total: S/ {success.costo.toFixed(2)}</span>
        </div>
        <p className="text-gray-600 mb-4">
          Envía los datos al asesor por WhatsApp para coordinar el pago y la entrega.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={success.urlWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-[#20bd5a] transition"
          >
            <MessageCircle className="w-5 h-5" />
            Enviar al asesor por WhatsApp
          </a>
          <a
            href="/mis-reservas"
            className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary px-4 py-2.5 rounded-lg font-semibold hover:bg-primary/5 transition"
          >
            <Package className="w-5 h-5" />
            Ver mis reservas
          </a>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border-2 border-primary rounded-lg p-6">
      <h3 className="text-2xl font-bold text-secondary mb-4">Realizar Alquiler</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">{error}</div>
      )}

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Fecha de inicio
          </label>
          <input
            type="date"
            value={fechainicio}
            onChange={handleFechaInicioChange}
            min={mañana}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Fecha de fin
          </label>
          <input
            type="date"
            value={fechafin}
            onChange={handleFechaFinChange}
            min={fechainicio}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tu teléfono / WhatsApp</label>
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="ej. 989 123 456"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Para que el asesor pueda contactarte.</p>
        </div>
      </div>

      <div className="bg-accent/20 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700">Precio por día:</span>
          <span className="font-semibold">S/. {precioAlquilo.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700">Días:</span>
          <span className="font-semibold">{dias}</span>
        </div>
        <div className="border-t border-gray-300 pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">Total:</span>
            <span className="text-2xl font-bold text-primary">S/. {costoTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Procesando..." : "Confirmar Alquiler"}
      </button>

      <p className="text-xs text-gray-500 mt-3 text-center">Al confirmar, la reserva quedará pendiente de aprobación.</p>
    </form>
  )
}
