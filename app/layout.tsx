import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/Providers"
import { AOSInit } from "@/app/aos-init"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "KontraK - Alquiler de Maquinaria de Construcción",
  description: "Plataforma de alquiler de maquinaria y equipos de construcción para contratistas",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Providers>
          <AOSInit />
          {children}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  )
}
