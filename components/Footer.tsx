import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-secondary text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sobre Nosotros */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary">KontraK</h3>
            <p className="text-gray-300">
              Facilitamos el acceso a maquinaria y equipos de construcción para
              contratistas emergentes y pequeñas empresas constructoras.
            </p>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="text-xl font-bold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/catalogo" className="text-gray-300 hover:text-primary transition">
                  Catálogo de Equipos
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-300 hover:text-primary transition">
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link href="/registro" className="text-gray-300 hover:text-primary transition">
                  Registrarse
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contacto</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Lima Metropolitana, Perú</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span>+51 999 888 777</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span>contacto@kontrak.pe</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} KontraK. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
