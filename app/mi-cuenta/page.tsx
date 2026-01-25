import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { StatusBadge } from "@/components/StatusBadge"

export default async function MiCuentaPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  const userId = parseInt((session.user as any).id)

  // Obtener datos del usuario
  const usuario = await prisma.usuario.findUnique({
    where: { idprop: userId },
    select: {
      nomprop: true,
      apeprop: true,
      emailprop: true,
      rol: true
    }
  })

  // Obtener reservas activas y recientes
  const reservas = await prisma.reserva.findMany({
    where: { idcli: userId },
    include: { vehiculo: true },
    orderBy: { fechares: "desc" },
    take: 5
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-4xl font-bold text-secondary mb-8">Mi Cuenta</h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Datos del Usuario</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="mb-2"><span className="font-semibold">Nombre:</span> {usuario?.nomprop} {usuario?.apeprop}</p>
            <p className="mb-2"><span className="font-semibold">Email:</span> {usuario?.emailprop}</p>
            <p className="mb-2"><span className="font-semibold">Rol:</span> {usuario?.rol}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/mis-reservas" className="bg-primary text-white px-4 py-2 rounded-lg font-semibold text-center hover:bg-primary/90 transition">Ver Mis Reservas</Link>
            <Link href="/historial" className="bg-gray-200 text-secondary px-4 py-2 rounded-lg font-semibold text-center hover:bg-gray-300 transition">Ver Historial</Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Reservas Recientes</h2>
        {reservas.length === 0 ? (
          <p className="text-gray-500">No tienes reservas recientes.</p>
        ) : (
          <div className="space-y-4">
            {reservas.map((reserva) => (
              <div key={reserva.idres} className="border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-bold text-secondary">{reserva.vehiculo?.marveh} {reserva.vehiculo?.modveh}</span>
                  <StatusBadge estado={reserva.estado} />
                </div>
                <div className="text-sm text-gray-600 flex flex-wrap gap-4">
                  <span><span className="font-semibold">Inicio:</span> {format(new Date(reserva.fechainicio), "PPP", { locale: es })}</span>
                  <span><span className="font-semibold">Fin:</span> {format(new Date(reserva.fechafin), "PPP", { locale: es })}</span>
                  <span><span className="font-semibold">Costo:</span> S/. {reserva.costo.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
