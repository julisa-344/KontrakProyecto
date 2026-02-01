import { redirect } from "next/navigation"
import { MiCuentaContent } from "./MiCuentaContent"
import { getSessionAndUsuario } from "@/lib/auth-helpers"

export default async function MiCuentaPage() {
  const { usuario } = await getSessionAndUsuario()
  if (!usuario) redirect("/login")
  return <MiCuentaContent />
}
