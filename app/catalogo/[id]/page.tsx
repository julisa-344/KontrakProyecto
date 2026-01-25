"use client"

import { useEffect, useState } from "react"
import { useCart } from "@/components/CartContext"
import { useSession } from "next-auth/react"
import { notFound, useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle, Truck, Clock, Shield, Weight, Ruler, Box } from "lucide-react"
import { ReservaForm } from "@/components/ReservaForm"

export default function EquipoDetallePage() {
  const { data: session, status } = useSession()
  const { addToCart, items: cartItems } = useCart()
  const params = useParams()
  const [equipo, setEquipo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEquipo() {
      try {
        const res = await fetch(`/api/vehiculos/${params.id}`)
        if (!res.ok) {
          setEquipo(null)
          return
        }
        const data = await res.json()
        setEquipo(data)
      } catch (error) {
        setEquipo(null)
      } finally {
        setLoading(false)
      }
    }
    fetchEquipo()
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!equipo) {
    notFound()
  }

  const disponible = equipo.estveh === "DISPONIBLE"

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Botón volver */}
      <Link
        href="/catalogo"
        className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
      >
        <ArrowRight className="w-4 h-4" />
        Volver al catálogo
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Imagen */}
        <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
          {equipo.fotoveh ? (
            <Image
              src={equipo.fotoveh}
              alt={`${equipo.marveh} ${equipo.modveh}`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 18.5C18 19.8807 16.8807 21 15.5 21C14.1193 21 13 19.8807 13 18.5C13 17.1193 14.1193 16 15.5 16C16.8807 16 18 17.1193 18 18.5Z" />
                <path d="M8.5 21C9.88071 21 11 19.8807 11 18.5C11 17.1193 9.88071 16 8.5 16C7.11929 16 6 17.1193 6 18.5C6 19.8807 7.11929 21 8.5 21Z" />
                <path d="M5 16H7V13H17V16H19V12C19 11.4477 18.5523 11 18 11H6C5.44772 11 5 11.4477 5 12V16Z" />
              </svg>
            </div>
          )}
        </div>

        {/* Información */}
        <div>
          {/* Categoría */}
          {equipo.categoria && (
            <span className="inline-block bg-accent text-secondary text-sm font-semibold px-4 py-2 rounded-full mb-4">
              {equipo.categoria}
            </span>
          )}

          {/* Título */}
          <h1 className="text-4xl font-bold text-secondary mb-2">
            {equipo.marveh} {equipo.modveh}
          </h1>
          <p className="text-xl text-gray-600 mb-4">Código: {equipo.plaveh}</p>

          {/* Estado */}
          <div className="mb-6">
            {disponible ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Disponible para alquiler</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-orange-600">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">No disponible actualmente</span>
              </div>
            )}
          </div>

          {/* Precio */}
          <div className="bg-primary/10 border-l-4 border-primary p-6 mb-8">
            <p className="text-sm text-gray-600 mb-1">Precio de alquiler</p>
            <p className="text-4xl font-bold text-primary">
              S/. {equipo.precioalquilo?.toFixed(2) || '0.00'}
              <span className="text-lg text-gray-600 font-normal"> / día</span>
            </p>
          </div>

          {/* Especificaciones Técnicas */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">Especificaciones Técnicas</h2>
            <div className="grid grid-cols-2 gap-4">
              {equipo.potencia && (
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Potencia</p>
                    <p className="font-semibold">{equipo.potencia} HP</p>
                  </div>
                </div>
              )}
              {equipo.capacidad && (
                <div className="flex items-start gap-3">
                  <Weight className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Capacidad</p>
                    <p className="font-semibold">{equipo.capacidad}</p>
                  </div>
                </div>
              )}
              {equipo.dimensiones && (
                <div className="flex items-start gap-3">
                  <Ruler className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Dimensiones</p>
                    <p className="font-semibold">{equipo.dimensiones}</p>
                  </div>
                </div>
              )}
              {equipo.peso && (
                <div className="flex items-start gap-3">
                  <Box className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Peso</p>
                    <p className="font-semibold">{equipo.peso} kg</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Información Adicional */}
          {equipo.accesorios && (
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">Accesorios Incluidos</h3>
              <p className="text-gray-600">{equipo.accesorios}</p>
            </div>
          )}

          {equipo.requiere_certificacion && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">
                  Este equipo requiere certificación especial para operar
                </span>
              </p>
            </div>
          )}

          {equipo.horas_uso && (
            <p className="text-sm text-gray-600 mb-6">
              Horas de uso: {equipo.horas_uso} hrs
            </p>
          )}

          {/* Botón Agregar al Carrito o Formulario de Reserva */}
          <div className="mt-8">
            <button
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition mb-4 w-full"
              disabled={cartItems.some((i) => i.id === equipo.idveh)}
              onClick={() => addToCart({
                id: equipo.idveh,
                nombre: `${equipo.marveh} ${equipo.modveh}`,
                precio: equipo.precioalquilo || 0,
                imagen: equipo.fotoveh || undefined
              })}
            >
              {cartItems.some((i) => i.id === equipo.idveh) ? "Ya en el carrito" : "Agregar al carrito"}
            </button>
            {status === "authenticated" && session?.user && (
              <ReservaForm 
                equipoId={equipo.idveh} 
                precioAlquilo={equipo.precioalquilo || 0}
                disponible={disponible}
              />
            )}
          </div>

          {status === "loading" && (
            <div className="mt-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
