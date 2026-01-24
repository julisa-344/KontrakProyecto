import { prisma } from "@/lib/prisma"
import { EquipmentCard } from "@/components/EquipmentCard"

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: { categoria?: string }
}) {
  // Obtener solo vehículos DISPONIBLES (igual que Spring Boot)
  const vehiculos = await prisma.vehiculo.findMany({
    where: {
      estveh: "DISPONIBLE",
      ...(searchParams.categoria && {
        categoria: searchParams.categoria
      })
    },
    orderBy: {
      categoria: 'asc'
    }
  })

  const categorias = await prisma.vehiculo.findMany({
    where: {
      estveh: "DISPONIBLE"
    },
    select: {
      categoria: true
    },
    distinct: ['categoria']
  })

  const categoriasUnicas = categorias
    .map(v => v.categoria)
    .filter(Boolean) as string[]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-secondary mb-4">
          Catálogo de Maquinaria
        </h1>
        <p className="text-gray-600 text-lg">
          Explora nuestra selección de equipos disponibles
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3">
          <a
            href="/catalogo"
            className={`px-4 py-2 rounded-lg transition ${
              !searchParams.categoria
                ? 'bg-primary text-white'
                : 'bg-white border border-gray-300 hover:border-primary'
            }`}
          >
            Todas
          </a>
          {categoriasUnicas.map((cat) => (
            <a
              key={cat}
              href={`/catalogo?categoria=${cat}`}
              className={`px-4 py-2 rounded-lg transition ${
                searchParams.categoria === cat
                  ? 'bg-primary text-white'
                  : 'bg-white border border-gray-300 hover:border-primary'
              }`}
            >
              {cat}
            </a>
          ))}
        </div>
      </div>

      {/* Resultados */}
      {vehiculos.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500">
            No hay equipos disponibles en esta categoría
          </p>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-6">
            {vehiculos.length} {vehiculos.length === 1 ? 'equipo disponible' : 'equipos disponibles'}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vehiculos.map((equipo) => (
              <EquipmentCard key={equipo.idveh} equipo={equipo} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
