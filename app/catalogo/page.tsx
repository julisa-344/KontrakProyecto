import { prisma } from "@/lib/prisma"
import { EquipmentCard } from "@/components/EquipmentCard"
import Link from "next/link";
import dynamic from "next/dynamic";
import { FaTractor, FaCogs, FaTools, FaCubes, FaIndustry } from "react-icons/fa";
const OrdenarSelect = dynamic(() => import("@/components/OrdenarSelect"), { ssr: false });

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: { categoria?: string; ordenar?: string }
}) {
  // Obtener solo vehículos DISPONIBLES (igual que Spring Boot)
  let orderBy = {};
  if (searchParams.ordenar === "precio-desc") {
    orderBy = { precioalquilo: "desc" };
  } else if (searchParams.ordenar === "precio-asc") {
    orderBy = { precioalquilo: "asc" };
  } else if (searchParams.ordenar === "alfabetico") {
    orderBy = { modveh: "asc" };
  } else {
    orderBy = { categoria: "asc" };
  }

  const vehiculos = await prisma.vehiculo.findMany({
    where: {
      estveh: "DISPONIBLE",
      ...(searchParams.categoria && {
        categoria: searchParams.categoria
      })
    },
    orderBy
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
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold text-blue-900 mb-3 drop-shadow-sm tracking-tight">
          Catálogo de Maquinaria
        </h1>
        <p className="text-gray-600 text-lg mb-2">
          Explora nuestra selección de equipos disponibles
        </p>
        <div className="h-1 w-24 bg-orange-400 rounded-full mx-auto mb-2"></div>
      </div>

      {/* Filtros y Ordenar */}
      <div className="mb-10">
        <div className="relative w-full bg-white rounded-2xl shadow px-4 py-4 mb-4">
          <div className="flex items-center gap-4 overflow-x-auto whitespace-nowrap hide-scrollbar w-full">
            <Link
              href="/catalogo"
              className={`flex-shrink-0 flex items-center gap-2 px-6 py-2 rounded-full border transition font-medium text-base ${
                !searchParams.categoria
                  ? 'bg-orange-100 border-orange-400 text-orange-700 shadow-sm'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-orange-400'
              }`}
            >
              <FaTractor className="text-lg" /> Todas
            </Link>
            {categoriasUnicas.map((cat, idx) => {
              let Icon = FaCogs;
              if (cat.toLowerCase().includes("retro")) Icon = FaTractor;
              else if (cat.toLowerCase().includes("excava")) Icon = FaTools;
              else if (cat.toLowerCase().includes("cargador")) Icon = FaCubes;
              else if (cat.toLowerCase().includes("industrial")) Icon = FaIndustry;
              return (
                <Link
                  key={cat}
                  href={`/catalogo?categoria=${encodeURIComponent(cat)}${searchParams.ordenar ? `&ordenar=${searchParams.ordenar}` : ''}`}
                  className={`flex-shrink-0 flex items-center gap-2 px-6 py-2 rounded-full border transition font-medium text-base ${
                    searchParams.categoria === cat
                      ? 'bg-orange-100 border-orange-400 text-orange-700 shadow-sm'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-orange-400'
                  }`}
                >
                  <Icon className="text-lg" /> {cat}
                </Link>
              );
            })}
          </div>
        </div>
        {/* Fila de resultados y select de ordenamiento */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <p className="text-gray-700 text-lg font-medium mb-0">
            {vehiculos.length} {vehiculos.length === 1 ? 'equipo disponible' : 'equipos disponibles'}
          </p>
          <div className="flex items-center gap-2 min-w-[220px]">
            
            <div className="relative">
              <OrdenarSelect />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 text-lg bg-white">
                
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Resultados */}
      {vehiculos.length === 0 ? (
        <div className="text-center py-20 bg-orange-50 rounded-xl shadow-inner">
          <p className="text-2xl text-gray-400 font-semibold">
            No hay equipos disponibles en esta categoría
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {vehiculos.map((equipo) => (
            <EquipmentCard key={equipo.idveh} equipo={equipo} />
          ))}
        </div>
      )}
    </div>
  )
}
