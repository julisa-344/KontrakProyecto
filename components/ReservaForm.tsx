"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar } from "lucide-react"
import { toast } from "sonner"

interface ReservaFormProps {
  equipoId: number
  precioAlquilo: number
  disponible: boolean
}

export function ReservaForm({ equipoId, precioAlquilo, disponible }: ReservaFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [dias, setDias] = useState(1)

  const hoy = new Date().toISOString().split('T')[0]
  const mañana = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  const [fechainicio, setFechaInicio] = useState(mañana)
  const [fechafin, setFechaFin] = useState(mañana)

  const calcularDias = (inicio: string, fin: string) => {
    const inicioDate = new Date(inicio)
    const finDate = new Date(fin)
    const diferencia = Math.ceil((finDate.getTime() - inicioDate.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(1, diferencia)
  }

  const handleFechaInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevaFechaInicio = e.target.value
    setFechaInicio(nuevaFechaInicio)
    
    // Si la fecha fin es anterior, ajustarla
    if (nuevaFechaInicio > fechafin) {
      setFechaFin(nuevaFechaInicio)
      setDias(1)
    } else {
      setDias(calcularDias(nuevaFechaInicio, fechafin))
    }
  }

  const handleFechaFinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevaFechaFin = e.target.value
    setFechaFin(nuevaFechaFin)
    setDias(calcularDias(fechainicio, nuevaFechaFin))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          equipoId,
          fechainicio,
          fechafin
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al crear la reserva")
      }

      toast.success(`¡Reserva creada! Total: S/. ${data.reserva.costo.toFixed(2)}`)
      
      // Redirigir a mis reservas
      router.push("/mis-reservas")
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
        <p className="text-gray-600 text-center">
          Este equipo no está disponible actualmente
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border-2 border-primary rounded-lg p-6">
      <h3 className="text-2xl font-bold text-secondary mb-4">Realizar Alquiler</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
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

      <p className="text-xs text-gray-500 mt-3 text-center">
        Al confirmar, la reserva quedará pendiente de aprobación
      </p>
    </form>
  )
}
