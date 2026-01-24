import Link from "next/link"
import { ArrowRight, CheckCircle, Truck, Clock, Shield } from "lucide-react"

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary to-gray-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Alquila Maquinaria de Construcción
              <span className="text-primary"> al Instante</span>
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              Democratizamos el acceso a equipos profesionales para contratistas
              emergentes y pequeñas empresas constructoras en Lima.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/catalogo"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center justify-center gap-2 transition"
              >
                Ver Catálogo
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/registro"
                className="bg-white hover:bg-gray-100 text-secondary px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center justify-center transition"
              >
                Registrarse Gratis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-secondary">
            ¿Por qué elegirnos?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-secondary">Reserva Rápida</h3>
              <p className="text-gray-600">
                Consulta disponibilidad en tiempo real y reserva en minutos.
                Sin llamadas ni visitas presenciales.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-secondary">Equipos Certificados</h3>
              <p className="text-gray-600">
                Toda nuestra maquinaria cuenta con mantenimiento preventivo
                y certificaciones vigentes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-secondary">Variedad de Equipos</h3>
              <p className="text-gray-600">
                Excavadoras, mezcladoras, compactadoras y más. Encuentra el
                equipo perfecto para tu proyecto.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-secondary">
            Categorías de Equipos
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {["Excavación", "Mezcla", "Compactación", "Elevación"].map((categoria) => (
              <Link
                key={categoria}
                href={`/catalogo?categoria=${categoria}`}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition text-center group"
              >
                <h3 className="text-lg font-bold text-secondary group-hover:text-primary transition">
                  {categoria}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            ¿Listo para empezar tu proyecto?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Regístrate ahora y accede al catálogo completo de maquinaria disponible
          </p>
          <Link
            href="/registro"
            className="bg-white hover:bg-gray-100 text-primary px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center gap-2 transition"
          >
            Crear Cuenta Gratis
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
