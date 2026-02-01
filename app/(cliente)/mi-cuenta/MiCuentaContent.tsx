"use client"

import { authClient } from "@/lib/auth-client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { User, History, LogOut, Pencil, X, Check, Loader2 } from "lucide-react"
import { toast } from "sonner"

type Usuario = {
  nomprop: string | null
  apeprop: string | null
  dniprop: string | null
  emailprop: string | null
  telefonoprop: string | null
  rol?: string | null
}

export function MiCuentaContent() {
  const { data: session } = authClient.useSession()
  const [user, setUser] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)
  const [edit, setEdit] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Usuario>({
    nomprop: "",
    apeprop: "",
    dniprop: "",
    emailprop: "",
    telefonoprop: "",
  })

  useEffect(() => {
    fetch("/api/mi-cuenta")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setUser(data)
        setForm({
          nomprop: data.nomprop || "",
          apeprop: data.apeprop || "",
          dniprop: data.dniprop || "",
          emailprop: data.emailprop || "",
          telefonoprop: data.telefonoprop || "",
        })
      })
      .catch(() => toast.error("Error al cargar tus datos"))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/mi-cuenta", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al guardar")
      setUser(data)
      setForm({ ...form, ...data })
      setEdit(false)
      toast.success("Datos actualizados correctamente")
    } catch (e: any) {
      toast.error(e.message || "Error al actualizar")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (user) setForm({ ...user, rol: user.rol })
    setEdit(false)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-secondary mb-8">Mi Cuenta</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar al estilo e‑commerce */}
        <aside className="lg:w-64 flex-shrink-0">
          <nav className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <Link
              href="/mi-cuenta"
              className="flex items-center gap-3 px-5 py-4 bg-primary/10 text-primary font-semibold border-l-4 border-primary"
            >
              <User className="w-5 h-5" />
              Datos de cuenta
            </Link>
            <Link
              href="/historial"
              className="flex items-center gap-3 px-5 py-4 text-gray-700 hover:bg-gray-50 transition"
            >
              <History className="w-5 h-5" />
              Historial de pedidos
            </Link>
            <button
              onClick={() => authClient.signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/" } } })}
              className="w-full flex items-center gap-3 px-5 py-4 text-left text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="w-5 h-5" />
              Cerrar sesión
            </button>
          </nav>
        </aside>

        {/* Contenido principal: ver / editar datos */}
        <main className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-secondary">Mis datos</h2>
              {!edit ? (
                <button
                  onClick={() => setEdit(true)}
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
                >
                  <Pencil className="w-4 h-4" />
                  Editar
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Guardar
                  </button>
                </div>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombres</label>
                {edit ? (
                  <input
                    value={form.nomprop ?? ""}
                    onChange={(e) => setForm({ ...form, nomprop: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                ) : (
                  <p className="text-gray-900 py-2">{user?.nomprop || "—"}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                {edit ? (
                  <input
                    value={form.apeprop ?? ""}
                    onChange={(e) => setForm({ ...form, apeprop: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{user?.apeprop || "—"}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DNI</label>
                {edit ? (
                  <input
                    value={form.dniprop ?? ""}
                    onChange={(e) => setForm({ ...form, dniprop: e.target.value })}
                    placeholder="8 dígitos"
                    maxLength={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{user?.dniprop || "—"}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                {edit ? (
                  <input
                    type="email"
                    value={form.emailprop ?? ""}
                    onChange={(e) => setForm({ ...form, emailprop: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                ) : (
                  <p className="text-gray-900 py-2">{user?.emailprop || "—"}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono / WhatsApp</label>
                {edit ? (
                  <input
                    type="tel"
                    value={form.telefonoprop ?? ""}
                    onChange={(e) => setForm({ ...form, telefonoprop: e.target.value })}
                    placeholder="ej. 989 123 456"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{user?.telefonoprop || "—"}</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
