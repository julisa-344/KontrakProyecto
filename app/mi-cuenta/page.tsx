import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { MiCuentaContent } from "./MiCuentaContent"

export default async function MiCuentaPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  return <MiCuentaContent />
}
