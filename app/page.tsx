import Link from "next/link"
import { ArrowRight, CheckCircle, Truck, Clock, Shield } from "lucide-react"

export default function Home() {
  return (
    <div className="bg-[#f8f9fb]">
      {/* HERO VISUAL */}
      <section className="relative bg-gradient-to-br from-[#f3f6fa] to-[#e9eef5] py-20" data-aos="fade-up">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 z-10">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 text-secondary">
              <span className="block text-primary">Alquila</span>
              Maquinaria de Construcción
              <span className="block text-primary">al Instante</span>
            </h1>
            <p className="text-xl mb-8 text-gray-700 max-w-lg">
              Democratizamos el acceso a equipos profesionales para contratistas y pequeñas empresas constructoras en Lima.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/catalogo"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center justify-center gap-2 transition shadow-lg"
              >
                Ver Catálogo
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/registro"
                className="bg-white hover:bg-gray-100 text-primary px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center justify-center transition border border-primary shadow"
              >
                Registrarse Gratis
              </Link>
            </div>
          </div>
          <div className="flex-1 hidden md:flex justify-end z-0">
            <img
              src="/hero.png"
              alt="Maquinaria de construcción"
              className="w-[1000px] h-auto object-contain drop-shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* SLIDER DE MARCAS */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8" data-aos="fade-up">
            {["caterpillar", "komatsu", "jcb", "volvo", "bobcat", "hyundai"].map((marca, idx) => (
              <div key={marca} className="grayscale hover:grayscale-0 transition-all" data-aos="zoom-in" data-aos-delay={idx * 100}>
                <img src={`/marcas/${marca}.png`} alt={marca} className="h-12 w-auto object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MÉTRICAS DESTACADAS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="p-8 rounded-2xl shadow bg-[#f3f6fa]" data-aos="fade-up" data-aos-delay="0">
              <span className="text-4xl font-extrabold text-primary block mb-2">+500</span>
              <span className="text-gray-700 font-semibold">Equipos disponibles</span>
            </div>
            <div className="p-8 rounded-2xl shadow bg-[#f3f6fa]" data-aos="fade-up" data-aos-delay="100">
              <span className="text-4xl font-extrabold text-primary block mb-2">+1000</span>
              <span className="text-gray-700 font-semibold">Clientes satisfechos</span>
            </div>
            <div className="p-8 rounded-2xl shadow bg-[#f3f6fa]" data-aos="fade-up" data-aos-delay="200">
              <span className="text-4xl font-extrabold text-primary block mb-2">24/7</span>
              <span className="text-gray-700 font-semibold">Soporte y reservas</span>
            </div>
            <div className="p-8 rounded-2xl shadow bg-[#f3f6fa]" data-aos="fade-up" data-aos-delay="300">
              <span className="text-4xl font-extrabold text-primary block mb-2">+10</span>
              <span className="text-gray-700 font-semibold">Años de experiencia</span>
            </div>
          </div>
        </div>
      </section>

      {/* NUESTRAS FORTALEZAS */}
      <section className="py-20 bg-[#f8f9fb]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-secondary text-center mb-12 tracking-tight" data-aos="fade-up">Nuestras Fortalezas</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-2xl shadow flex flex-col items-center text-center border border-gray-100" data-aos="fade-up" data-aos-delay="0">
              <Shield className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2 text-secondary">Seguridad y Confianza</h3>
              <p className="text-gray-600 text-sm">Todos nuestros equipos pasan por rigurosos controles de calidad y mantenimiento para garantizar tu seguridad en cada proyecto.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow flex flex-col items-center text-center border border-gray-100" data-aos="fade-up" data-aos-delay="150">
              <Truck className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2 text-secondary">Cobertura y Variedad</h3>
              <p className="text-gray-600 text-sm">Contamos con una amplia gama de maquinaria para cubrir todas las necesidades de la construcción, desde pequeñas obras hasta grandes proyectos.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow flex flex-col items-center text-center border border-gray-100" data-aos="fade-up" data-aos-delay="300">
              <CheckCircle className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2 text-secondary">Atención Personalizada</h3>
              <p className="text-gray-600 text-sm">Nuestro equipo de expertos te asesora en todo momento para que elijas el equipo ideal y aproveches al máximo tu alquiler.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="py-20 bg-[#f8f9fb]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-secondary text-center mb-12 tracking-tight" data-aos="fade-up">Categorías de Equipos</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {["Excavación", "Mezcla", "Compactación", "Elevación"].map((categoria, idx) => (
              <Link
                key={categoria}
                href={`/catalogo?categoria=${categoria}`}
                className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition flex flex-col items-center text-center group border border-gray-100"
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                <span className="w-12 h-12 mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  {/* Aquí podrías poner un icono diferente por categoría si lo deseas */}
                  <Truck className="w-6 h-6 text-primary" />
                </span>
                <h3 className="text-lg font-bold text-secondary group-hover:text-primary transition">
                  {categoria}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="py-20 bg-[#f8f9fb]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-secondary text-center mb-12 tracking-tight" data-aos="fade-up">Testimonios</h2>
          <div className="max-w-3xl mx-auto">
            <div className="relative overflow-hidden">
              {/* Slider simple, puedes reemplazar por SwiperJS si quieres más interactividad */}
              <div className="flex gap-8 animate-[slideTesti_16s_linear_infinite]">
                {[
                  {
                    nombre: "Juan Pérez",
                    empresa: "Constructora Lima",
                    texto: "El proceso de alquiler fue rápido y sencillo. Los equipos estaban en excelente estado y el soporte fue muy profesional.",
                  },
                  {
                    nombre: "María Torres",
                    empresa: "Obras Modernas",
                    texto: "Excelente variedad de maquinaria y atención personalizada. Sin duda volveré a alquilar aquí.",
                  },
                  {
                    nombre: "Carlos Gómez",
                    empresa: "Proyectos Perú",
                    texto: "La plataforma es muy intuitiva y el servicio al cliente resolvió todas mis dudas al instante.",
                  },
                ].map((testi, idx) => (
                  <div key={idx} className="bg-white rounded-2xl shadow p-8 min-w-[320px] max-w-[340px] mx-auto" data-aos="fade-up" data-aos-delay={idx * 150}>
                    <p className="text-gray-700 text-lg mb-4">“{testi.texto}”</p>
                    <div className="font-bold text-primary">{testi.nombre}</div>
                    <div className="text-sm text-gray-500">{testi.empresa}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-secondary text-center mb-12 tracking-tight" data-aos="fade-up">Preguntas Frecuentes</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                pregunta: "¿Cómo reservo una máquina?",
                respuesta: "Solo debes registrarte, buscar el equipo que necesitas y hacer clic en 'Reservar' o 'Agregar al carrito'. Sigue los pasos y listo.",
              },
              {
                pregunta: "¿Qué métodos de pago aceptan?",
                respuesta: "Aceptamos transferencias bancarias, tarjetas de crédito y pagos en efectivo al momento de la entrega.",
              },
              {
                pregunta: "¿Puedo alquilar sin ser empresa?",
                respuesta: "Sí, tanto empresas como personas naturales pueden alquilar maquinaria en nuestra plataforma.",
              },
              {
                pregunta: "¿El precio incluye transporte?",
                respuesta: "El precio mostrado es solo por el alquiler. El transporte se cotiza aparte según la ubicación del proyecto.",
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-[#f8f9fb] rounded-xl shadow p-6" data-aos="fade-up" data-aos-delay={idx * 100}>
                <div className="font-bold text-secondary mb-2 text-lg">{faq.pregunta}</div>
                <div className="text-gray-700 text-base">{faq.respuesta}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
        

      {/* CTA FINAL */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 text-center" data-aos="fade-up">
          <h2 className="text-4xl font-extrabold text-white mb-6 tracking-tight">
            ¿Listo para empezar tu proyecto?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Regístrate ahora y accede al catálogo completo de maquinaria disponible
          </p>
          <Link
            href="/registro"
            className="bg-white hover:bg-gray-100 text-primary px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center gap-2 transition shadow-lg"
          >
            Crear Cuenta Gratis
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
