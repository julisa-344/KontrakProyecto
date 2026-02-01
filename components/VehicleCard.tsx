import Image from "next/image"
import Link from "next/link"
import { Gauge, Weight } from "lucide-react"
import type { vehiculo } from "@prisma/client"

interface VehicleCardProps {
  vehiculo: vehiculo
}

export function VehicleCard({ vehiculo }: VehicleCardProps) {
  return (
    <Link href={`/catalogo/${vehiculo.idveh}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
        {/* Imagen */}
        <div className="relative h-48 bg-gray-200">
          {(vehiculo.imagenUrl ?? vehiculo.fotoveh) ? (
            <Image
              src={(vehiculo.imagenUrl ?? vehiculo.fotoveh)!}
              alt={`${vehiculo.marveh} ${vehiculo.modveh}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 18.5C18 19.8807 16.8807 21 15.5 21C14.1193 21 13 19.8807 13 18.5C13 17.1193 14.1193 16 15.5 16C16.8807 16 18 17.1193 18 18.5Z" />
                <path d="M8.5 21C9.88071 21 11 19.8807 11 18.5C11 17.1193 9.88071 16 8.5 16C7.11929 16 6 17.1193 6 18.5C6 19.8807 7.11929 21 8.5 21Z" />
                <path d="M5 16H7V13H17V16H19V12C19 11.4477 18.5523 11 18 11H6C5.44772 11 5 11.4477 5 12V16Z" />
                <path d="M17 10H7L5 6H19L17 10Z" />
              </svg>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-4">
          {/* Categoría */}
          {vehiculo.categoria && (
            <span className="inline-block bg-accent text-secondary text-xs font-semibold px-3 py-1 rounded-full mb-2">
              {vehiculo.categoria}
            </span>
          )}

          {/* Título */}
          <h3 className="text-lg font-bold text-secondary mb-1">
            {vehiculo.marveh} {vehiculo.modveh}
          </h3>
          <p className="text-sm text-gray-600 mb-3">{vehiculo.plaveh}</p>

          {/* Especificaciones */}
          <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
            {vehiculo.potencia && (
              <div className="flex items-center space-x-1">
                <Gauge className="w-4 h-4 text-primary" />
                <span>{vehiculo.potencia} HP</span>
              </div>
            )}
            {vehiculo.capacidad && (
              <div className="flex items-center space-x-1">
                <Weight className="w-4 h-4 text-primary" />
                <span>{vehiculo.capacidad}</span>
              </div>
            )}
          </div>

          {/* Precio */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">
                S/. {(vehiculo.precioalquilo ?? 0).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">por día</p>
            </div>
            <div className="bg-primary text-white px-4 py-2 rounded-lg group-hover:bg-primary/90 transition">
              Ver detalles
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
