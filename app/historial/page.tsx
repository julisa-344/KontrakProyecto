import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { StatusBadge } from "@/components/StatusBadge"

export default async function HistorialPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const userId = parseInt((session.user as any).id)

  // Replicar lógica de Spring: solo reservas "muertas" (finalizadas hace más de 1 día)
  const haceUnDia = new Date()
  haceUnDia.setDate(haceUnDia.getDate() - 1)

  const reservas = await prisma.reserva.findMany({
    where: {
      idcli: userId,
      estado: {
        in: ["FINALIZADA", "CANCELADA", "RECHAZADA"]
      },
      fechafinalizacion: {
        lt: haceUnDia
      }
    },
    include: {
      vehiculo: true
    },
    orderBy: {
      fechares: 'desc'
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-secondary mb-8">Historial de Alquileres</h1>

      {reservas.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500">No tienes historial de reservas</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-secondary text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Equipo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Fechas</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Costo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reservas.map((reserva) => (
                <tr key={reserva.idres} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-semibold">{reserva.vehiculo?.marveh} {reserva.vehiculo?.modveh}</p>
                    <p className="text-sm text-gray-600">Código: {reserva.vehiculo?.plaveh}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <p>{format(new Date(reserva.fechainicio), "dd/MM/yyyy", { locale: es })}</p>
                    <p>{format(new Date(reserva.fechafin), "dd/MM/yyyy", { locale: es })}</p>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge estado={reserva.estado} />
                  </td>
                  <td className="px-6 py-4 font-bold text-primary">
                    S/. {reserva.costo.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
