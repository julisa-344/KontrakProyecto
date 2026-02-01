# Guía para Probar la Estructura del Dashboard

## ✅ Archivos Creados

1. **`app/(cliente)/layout.tsx`** - Layout con Header y Footer para rutas del cliente
2. **`app/(cliente)/page.tsx`** - Página principal (home) del cliente
3. **`app/(admin)/layout.tsx`** - Layout con verificación de rol admin
4. **`app/(admin)/dashboard/page.tsx`** - Página principal del dashboard admin

## 🔧 Archivos Actualizados

- **`app/layout.tsx`** - Removido Header y Footer (ahora solo Providers, AOSInit y Toaster)
- **`auth.ts`** - Permite login de ADMINISTRADOR
- **`middleware.ts`** - Protege rutas admin y redirige según el rol
- **`app/page.tsx`** - Eliminado (duplicado, ahora está en `app/(cliente)/page.tsx`)

## 🧪 Pasos para Probar

### 1. Verificar que el servidor esté corriendo

```bash
npm run dev
```

### 2. Verificar que la base de datos tenga datos

Si no has ejecutado el seed recientemente:

```bash
npx prisma db seed
```

### 3. Credenciales de Prueba

**Admin (para probar el dashboard):**
- Email: `admin@autorent.com`
- Password: `admin123`

**Cliente (para probar rutas normales):**
- Email: `juan@ejemplo.com`
- Password: `cliente123`

**Contratista:**
- Email: `contratista@ejemplo.com`
- Password: `contratista123`

### 4. Pruebas a Realizar

#### ✅ Página Principal (Cliente)
1. Ir a `http://localhost:3000/`
2. Deberías ver la página principal con Header y Footer
3. La URL sigue siendo `/` (los route groups no afectan las URLs)

#### ✅ Dashboard Admin
1. Iniciar sesión con `admin@autorent.com` / `admin123`
2. Deberías ser redirigido automáticamente a `/dashboard`
3. Deberías ver el panel de administración
4. Si intentas acceder a `/dashboard` sin ser admin, serás redirigido a `/`

#### ✅ Protección de Rutas
1. Sin estar logueado, intenta ir a `/dashboard`
   - Deberías ser redirigido a `/login`
2. Logueado como CLIENTE, intenta ir a `/dashboard`
   - Deberías ser redirigido a `/`
3. Logueado como ADMINISTRADOR, intenta ir a `/dashboard`
   - Deberías poder acceder

#### ✅ Redirecciones Post-Login
1. Logueado como ADMINISTRADOR, intenta ir a `/login` o `/registro`
   - Deberías ser redirigido a `/dashboard`
2. Logueado como CLIENTE o CONTRATISTA, intenta ir a `/login` o `/registro`
   - Deberías ser redirigido a `/catalogo`

## 📁 Estructura de Carpetas

```
app/
├── (cliente)/          # Route Group - no afecta la URL
│   ├── layout.tsx     # Layout con Header y Footer
│   └── page.tsx       # Página principal (/)
├── (admin)/           # Route Group - no afecta la URL
│   ├── layout.tsx     # Layout con verificación de rol
│   └── dashboard/
│       └── page.tsx   # Dashboard admin (/dashboard)
├── layout.tsx         # Root layout (solo Providers)
├── catalogo/          # Páginas públicas (sin Header/Footer por ahora)
├── login/
├── registro/
└── ...
```

## ⚠️ Notas Importantes

1. **Route Groups**: Las carpetas `(cliente)` y `(admin)` son "route groups" en Next.js. Los paréntesis indican que no afectan la URL. Por ejemplo:
   - `app/(cliente)/page.tsx` → URL: `/`
   - `app/(admin)/dashboard/page.tsx` → URL: `/dashboard`

2. **Layouts Anidados**: Los layouts se anidan automáticamente:
   - Root layout (`app/layout.tsx`) → Aplica a todas las rutas
   - Cliente layout (`app/(cliente)/layout.tsx`) → Aplica solo a rutas dentro de `(cliente)`
   - Admin layout (`app/(admin)/layout.tsx`) → Aplica solo a rutas dentro de `(admin)`

3. **Páginas Fuera de Route Groups**: Las páginas como `catalogo`, `login`, `registro` que están directamente en `app/` no tienen Header/Footer por ahora. Si las necesitas, muévelas dentro de `(cliente)`.

## 🐛 Solución de Problemas

### Error: "Cannot find module"
- Ejecuta `npm install` para asegurar que todas las dependencias estén instaladas

### Error: "Prisma Client not generated"
- Ejecuta `npx prisma generate`

### El dashboard no carga
- Verifica que el usuario tenga rol `ADMINISTRADOR` en la base de datos
- Verifica que `auth.ts` permita el rol `ADMINISTRADOR`
- Revisa la consola del navegador para errores

### No se ve Header/Footer en la página principal
- Verifica que `app/(cliente)/layout.tsx` esté importando correctamente `Header` y `Footer`
- Verifica que el root layout no tenga Header/Footer (debería estar solo en el layout del cliente)
