"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"

export default function RegistroPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  function contieneNumeros(texto: string) {
    return /\d/.test(texto)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      nombres: formData.get("nombres") as string,
      apellidos: formData.get("apellidos") as string,
      dni: formData.get("dni") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }

    // Validación de nombres y apellidos
    if (!data.nombres || contieneNumeros(data.nombres)) {
      toast.error("El campo 'Nombres' no debe contener números.")
      setLoading(false)
      return
    }
    if (!data.apellidos || contieneNumeros(data.apellidos)) {
      toast.error("El campo 'Apellidos' no debe contener números.")
      setLoading(false)
      return
    }

    const confirmPassword = formData.get("confirmPassword") as string
    if (data.password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        toast.error(result.error || "Error al registrarse")
      } else {
        toast.success("¡Cuenta creada exitosamente!")
        router.push("/login")
      }
    } catch (error) {
      toast.error("Error al procesar la solicitud")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-secondary">
            Crear Cuenta de Contratista
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-primary hover:underline font-semibold">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nombres" className="block text-sm font-medium text-gray-700 mb-1">
              Nombres
            </label>
            <input
              id="nombres"
              name="nombres"
              type="text"
              required
              onKeyDown={(e) => {
                // Prevenir números y caracteres especiales no permitidos
                if (e.key.length === 1 && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]$/.test(e.key)) {
                  e.preventDefault()
                  toast.warning("Este campo solo acepta letras, espacios, guiones y apóstrofes", {
                    duration: 2000,
                  })
                }
              }}
              onInput={(e) => {
                // Filtrar números si se pegan o ingresan de otra manera
                const input = e.currentTarget
                const valor = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]/g, "")
                if (input.value !== valor) {
                  input.value = valor
                  toast.warning("Se han eliminado caracteres no permitidos. Solo se aceptan letras, espacios, guiones y apóstrofes", {
                    duration: 2000,
                  })
                }
              }}
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Ej: Juan Carlos"
            />
          </div>

          <div>
            <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700 mb-1">
              Apellidos
            </label>
            <input
              id="apellidos"
              name="apellidos"
              type="text"
              required
              onKeyDown={(e) => {
                // Prevenir números y caracteres especiales no permitidos
                if (e.key.length === 1 && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]$/.test(e.key)) {
                  e.preventDefault()
                  toast.warning("Este campo solo acepta letras, espacios, guiones y apóstrofes", {
                    duration: 2000,
                  })
                }
              }}
              onInput={(e) => {
                // Filtrar números si se pegan o ingresan de otra manera
                const input = e.currentTarget
                const valor = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]/g, "")
                if (input.value !== valor) {
                  input.value = valor
                  toast.warning("Se han eliminado caracteres no permitidos. Solo se aceptan letras, espacios, guiones y apóstrofes", {
                    duration: 2000,
                  })
                }
              }}
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Ej: Pérez García"
            />
          </div>

          <div>
            <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-1">
              DNI
            </label>
            <input
              id="dni"
              name="dni"
              type="text"
              inputMode="numeric"
              required
              maxLength={8}
              pattern="[0-9]{8}"
              onKeyDown={(e) => {
                // Prevenir letras y caracteres especiales, permitir solo números y teclas de control
                if (e.key.length === 1 && !/^\d$/.test(e.key) && !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) {
                  e.preventDefault()
                  toast.warning("El DNI solo acepta números (0-9)", {
                    duration: 2000,
                  })
                }
              }}
              onInput={(e) => {
                // Filtrar letras si se pegan o ingresan de otra manera
                const input = e.currentTarget
                const valor = input.value.replace(/\D/g, "").slice(0, 8)
                if (input.value !== valor) {
                  input.value = valor
                  toast.warning("Se han eliminado caracteres no permitidos. El DNI solo acepta números", {
                    duration: 2000,
                  })
                }
              }}
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="12345678"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                minLength={6}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Repite tu contraseña"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registrando..." : "Crear Cuenta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
