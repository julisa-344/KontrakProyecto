# Dashboard Admin – Sprint 2 (Preparación)

Este documento describe los cambios de modelo, la Server Action para actualizar el estado del vehículo y la estructura de carpetas recomendada para separar el Dashboard del Admin del front del Cliente.

---

## 1. Cambios en Prisma (realizados)

### Vehículo: imagen externa y estado tipado

- **`fotoveh`**: tipo `@db.Text` para soportar URLs largas (rutas locales o URLs externas).
- **`imagenUrl`**: campo nuevo opcional `String? @db.Text` para URL de imagen externa. En la UI se usa `imagenUrl ?? fotoveh`.
- **`estveh`**: pasa de `String?` a **`EstadoVehiculo?`** con valores:
  - `DISPONIBLE`
  - `OCUPADO`
  - `EN_MANTENIMIENTO`
  - `FUERA_SERVICIO`

### Reserva: enum de estado

- **`estado`**: pasa de `String?` a **`EstadoReserva?`** con valores:
  - `PENDING`
  - `CONFIRMED`
  - `COMPLETED`
  - `CANCELED`

---

## 2. Cómo crear una Server Action para que el Admin actualice el estado del vehículo (DISPONIBLE → MANTENIMIENTO)

Una **Server Action** en Next.js es una función async que se ejecuta solo en el servidor y se puede invocar desde el cliente (formularios o `onClick`). Para el Admin que pone un vehículo en mantenimiento:

### 2.1 Requisitos de seguridad

1. **Comprobar sesión y rol**: solo usuarios con rol `ADMINISTRADOR` (o el rol que uses para admin) pueden ejecutar la acción.
2. **Validar entrada**: recibir `idveh` y el nuevo estado (por ejemplo `EN_MANTENIMIENTO`).
3. **Transacciones**: si en el futuro guardas log o mantenimiento en la misma operación, usar `prisma.$transaction`.

### 2.2 Ejemplo de Server Action

Debe vivir en un archivo con `"use server"` al inicio (o en un módulo que lo marque), por ejemplo `app/(admin)/dashboard/actions/vehiculos.ts` o `lib/actions/admin-vehiculo.ts`:

```ts
"use server"

import { EstadoVehiculo } from "@prisma/client"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

type Result = { ok: true } | { ok: false; error: string }

export async function ponerVehiculoEnMantenimiento(idveh: number): Promise<Result> {
  const session = await auth()
  if (!session?.user) {
    return { ok: false, error: "No autenticado" }
  }

  const rol = (session.user as { rol?: string }).rol
  if (rol !== "ADMINISTRADOR") {
    return { ok: false, error: "Sin permiso: solo administradores" }
  }

  const vehiculo = await prisma.vehiculo.findUnique({ where: { idveh } })
  if (!vehiculo) {
    return { ok: false, error: "Vehículo no encontrado" }
  }
  if (vehiculo.estveh !== EstadoVehiculo.DISPONIBLE) {
    return { ok: false, error: "Solo se puede enviar a mantenimiento un vehículo DISPONIBLE" }
  }

  await prisma.vehiculo.update({
    where: { idveh },
    data: { estveh: EstadoVehiculo.EN_MANTENIMIENTO },
  })

  revalidatePath("/dashboard/vehiculos") // o la ruta que liste vehículos
  return { ok: true }
}
```

### 2.3 Uso desde un componente del Dashboard

```tsx
"use client"

import { ponerVehiculoEnMantenimiento } from "@/lib/actions/admin-vehiculo"

export function BotonMantenimiento({ idveh }: { idveh: number }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleClick() {
    setLoading(true)
    setMessage(null)
    const r = await ponerVehiculoEnMantenimiento(idveh)
    setLoading(false)
    if (r.ok) {
      setMessage("Enviado a mantenimiento")
    } else {
      setMessage(r.error)
    }
  }

  return (
    <div>
      <button onClick={handleClick} disabled={loading}>
        {loading ? "..." : "Enviar a mantenimiento"}
      </button>
      {message && <p>{message}</p>}
    </div>
  )
}
```

### 2.4 Resumen

- **`"use server"`** en el archivo (o en la función) indica que es Server Action.
- **`auth()`** + chequeo de rol aseguran que solo el admin pueda cambiar el estado.
- **`EstadoVehiculo.EN_MANTENIMIENTO`** es el valor que corresponde a “mantenimiento” en tu enum.
- **`revalidatePath`** refresca la ruta indicada después de actualizar para que la lista de vehículos se vea actualizada.

---

## 3. Estructura de carpetas recomendada (Dashboard vs Cliente)

Objetivo: separar rutas y componentes del **Dashboard Admin** de los del **Cliente** dentro de `app/`.

### 3.1 Uso de Route Groups

Next.js permite **Route Groups** con `(nombre)`: la carpeta no forma parte de la URL. Así puedes tener:

```
app/
├── (cliente)/                    # Rutas públicas/cientes (sin prefijo en la URL)
│   ├── layout.tsx                 # Layout del cliente (Header público, etc.)
│   ├── page.tsx                  # → "/"
│   ├── catalogo/
│   │   ├── page.tsx              # → "/catalogo"
│   │   └── [id]/page.tsx         # → "/catalogo/123"
│   ├── cart/
│   ├── login/
│   ├── registro/
│   ├── mis-reservas/
│   ├── historial/
│   └── mi-cuenta/
│
├── (admin)/                      # Rutas del dashboard (prefijo /dashboard o similar)
│   ├── layout.tsx                # Layout admin: sidebar, verificación de rol ADMIN
│   └── dashboard/                # Opción A: todo bajo /dashboard
│       ├── page.tsx              # → "/dashboard"
│       ├── vehiculos/
│       │   ├── page.tsx          # → "/dashboard/vehiculos"
│       │   └── [id]/page.tsx
│       ├── reservas/
│       └── usuarios/
│
├── api/                          # APIs compartidas (o mover las de admin a (admin)/api si quieres)
├── globals.css
└── layout.tsx                    # Root layout (providers, fuentes, etc.)
```

Las rutas del cliente siguen siendo `/`, `/catalogo`, `/login`, etc. Las del admin, por ejemplo `/dashboard`, `/dashboard/vehiculos`, etc.

### 3.2 Alternativa con prefijo explícito

Si prefieres que “admin” aparezca en la ruta desde la raíz:

```
app/
├── (cliente)/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── catalogo/
│   ├── ...
│
├── admin/                        # Rutas bajo /admin (sin route group)
│   ├── layout.tsx                # Solo para rol ADMIN, redirigir si no
│   ├── page.tsx                  # → "/admin"
│   ├── vehiculos/
│   └── reservas/
│
├── api/
├── layout.tsx
└── globals.css
```

En ambos casos:

- **Layout admin**: en `layout.tsx` del árbol admin verificas sesión y rol; si no es admin, `redirect("/login")` o `redirect("/")`.
- **Componentes**: separar en carpeta específica para no mezclar con el cliente:
  - `components/` → componentes compartidos (Header, Footer, StatusBadge, etc.).
  - `components/admin/` o `app/(admin)/dashboard/_components/` → solo para el dashboard (tablas, formularios admin, etc.).

### 3.3 Resumen de estructura sugerida

| Ubicación                         | Contenido                                      |
|-----------------------------------|-------------------------------------------------|
| `app/(cliente)/` o actual `app/` | Páginas del cliente (catálogo, reservas, etc.) |
| `app/(admin)/dashboard/` o `app/admin/` | Páginas del dashboard (vehículos, reservas, usuarios) |
| `app/*/layout.tsx`                | Layout por “zona” (cliente vs admin)           |
| `components/`                     | Componentes compartidos                         |
| `components/admin/` o `app/.../dashboard/_components/` | Componentes solo del dashboard        |
| `lib/actions/admin-vehiculo.ts`    | Server Actions de admin (ej. cambiar estado vehículo) |

Cuando traslades el dashboard “a otra carpeta” o repositorio, esta separación te permite mover solo `(admin)/` (o `admin/`) y las acciones/componentes asociados, manteniendo el resto del cliente intacto.

---

## 4. Migración de base de datos

Después de cambiar el schema:

```bash
npx prisma generate
npx prisma migrate dev --name vehiculo_imagen_enum_reserva_estado
```

Si ya tienes datos con `estado` o `estveh` en formato texto, puede hacer falta una migración SQL personal que mapee los valores antiguos a los nuevos enums antes de aplicar el cambio de tipo de columna.
