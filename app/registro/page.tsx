"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"
import { authClient } from "@/lib/auth-client"

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
    const nombres = formData.get("nombres") as string
    const apellidos = formData.get("apellidos") as string
    const dni = formData.get("dni") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (!nombres || contieneNumeros(nombres)) {
      toast.error("El campo 'Nombres' no debe contener números.")
      setLoading(false)
      return
    }
    if (!apellidos || contieneNumeros(apellidos)) {
      toast.error("El campo 'Apellidos' no debe contener números.")
      setLoading(false)
      return
    }
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name: `${nombres.trim()} ${apellidos.trim()}`.trim(),
        callbackURL: "/catalogo",
        nomprop: nombres.trim(),
        apeprop: apellidos.trim(),
        dniprop: dni.trim() || undefined,
      } as { email: string; password: string; name: string; callbackURL?: string; nomprop?: string; apeprop?: string; dniprop?: string })

      if (error) {
        toast.error(error.message ?? "Error al registrarse")
        return
      }
      toast.success("¡Cuenta creada exitosamente!")
      router.push("/catalogo")
      router.refresh()
    } catch {
      toast.error("Error al procesar la solicitud")
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignUp() {
    setLoading(true)
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/catalogo",
      })
      if (error) {
        toast.error(error.message ?? "Error al registrarse con Google")
      }
    } catch {
      toast.error("Error al registrarse con Google")
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
                if (e.key.length === 1 && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]$/.test(e.key)) {
                  e.preventDefault()
                  toast.warning("Este campo solo acepta letras, espacios, guiones y apóstrofes", { duration: 2000 })
                }
              }}
              onInput={(e) => {
                const input = e.currentTarget
                const valor = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]/g, "")
                if (input.value !== valor) {
                  input.value = valor
                  toast.warning("Se han eliminado caracteres no permitidos.", { duration: 2000 })
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
                if (e.key.length === 1 && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]$/.test(e.key)) {
                  e.preventDefault()
                  toast.warning("Este campo solo acepta letras, espacios, guiones y apóstrofes", { duration: 2000 })
                }
              }}
              onInput={(e) => {
                const input = e.currentTarget
                const valor = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]/g, "")
                if (input.value !== valor) {
                  input.value = valor
                  toast.warning("Se han eliminado caracteres no permitidos.", { duration: 2000 })
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
                if (e.key.length === 1 && !/^\d$/.test(e.key) && !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) {
                  e.preventDefault()
                  toast.warning("El DNI solo acepta números (0-9)", { duration: 2000 })
                }
              }}
              onInput={(e) => {
                const input = e.currentTarget
                const valor = input.value.replace(/\D/g, "").slice(0, 8)
                if (input.value !== valor) {
                  input.value = valor
                  toast.warning("Se han eliminado caracteres no permitidos.", { duration: 2000 })
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
                minLength={8}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Mínimo 8 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                minLength={8}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Repite tu contraseña"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registrando..." : "Crear Cuenta"}
            </button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">o regístrate con</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Google</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
