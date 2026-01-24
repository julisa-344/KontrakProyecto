import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { StatusBadge } from "@/components/StatusBadge"
import Link from "next/link"

export default async function MisReservasPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const userId = parseInt((session.user as any).id)

  // Replicar la lógica de Spring: mostrar reservas "vivas" (no finalizadas hace más de 1 día)
  const haceUnDia = new Date()
  haceUnDia.setDate(haceUnDia.getDate() - 1)

  const reservas = await prisma.reserva.findMany({
    where: {
      idcli: userId,
      OR: [
        {
          estado: {
            notIn: ["FINALIZADA", "CANCELADA", "RECHAZADA"]
          }
        },
        {
          AND: [
            {
              estado: {
                in: ["FINALIZADA", "CANCELADA", "RECHAZADA"]
              }
            },
            {
              fechafinalizacion: {
                gte: haceUnDia
              }
            }
          ]
        }
      ]
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
      <h1 className="text-4xl font-bold text-secondary mb-8">Mis Reservas</h1>

      {reservas.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500 mb-4">No tienes reservas activas</p>
          <Link
            href="/catalogo"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition"
          >
            Explorar Catálogo
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reservas.map((reserva) => {
            const puedeCancelar = 
              reserva.estado === "PENDIENTE" || 
              reserva.estado === "CONFIRMADA"

            return (
              <div key={reserva.idres} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-secondary">
                        {reserva.vehiculo?.marveh} {reserva.vehiculo?.modveh}
                      </h3>
                      <StatusBadge estado={reserva.estado} />
                    </div>
                    <p className="text-gray-600 mb-2">Código: {reserva.vehiculo?.plaveh}</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-semibold">Inicio:</span>{" "}
                        {format(new Date(reserva.fechainicio), "PPP 'a las' p", { locale: es })}
                      </p>
                      <p>
                        <span className="font-semibold">Fin:</span>{" "}
                        {format(new Date(reserva.fechafin), "PPP 'a las' p", { locale: es })}
                      </p>
                      <p>
                        <span className="font-semibold">Reservado el:</span>{" "}
                        {format(new Date(reserva.fechares), "PPP", { locale: es })}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary mb-2">
                      S/. {reserva.costo.toFixed(2)}
                    </p>
                    {puedeCancelar && (
                      <form action={`/api/reservas/${reserva.idres}/cancelar`} method="POST">
                        <button
                          type="submit"
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
                        >
                          Cancelar Reserva
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
