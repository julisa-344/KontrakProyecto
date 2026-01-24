import { EstadoReserva } from "@prisma/client"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  estado: EstadoReserva
  className?: string
}

const estadoConfig = {
  PENDIENTE: {
    label: "Pendiente",
    className: "bg-yellow-100 text-yellow-800 border-yellow-300"
  },
  CONFIRMADA: {
    label: "Confirmada",
    className: "bg-blue-100 text-blue-800 border-blue-300"
  },
  RECHAZADA: {
    label: "Rechazada",
    className: "bg-red-100 text-red-800 border-red-300"
  },
  ESPERANDO_CLIENTE: {
    label: "Esperando Cliente",
    className: "bg-purple-100 text-purple-800 border-purple-300"
  },
  EN_USO: {
    label: "En Uso",
    className: "bg-green-100 text-green-800 border-green-300"
  },
  ESPERANDO_PROPIETARIO: {
    label: "Esperando Devolución",
    className: "bg-indigo-100 text-indigo-800 border-indigo-300"
  },
  FINALIZADA: {
    label: "Finalizada",
    className: "bg-gray-100 text-gray-800 border-gray-300"
  },
  CANCELADA: {
    label: "Cancelada",
    className: "bg-orange-100 text-orange-800 border-orange-300"
  }
}

export function StatusBadge({ estado, className }: StatusBadgeProps) {
  const config = estadoConfig[estado]
  
  return (
    <span className={cn(
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border",
      config.className,
      className
    )}>
      {config.label}
    </span>
  )
}
