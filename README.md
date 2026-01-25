# AutoRent Client - Aplicación de Contratistas

Aplicación Next.js 14 para contratistas que necesitan alquilar maquinaria de construcción. Esta es la migración del proyecto Spring Boot original.

## 🚀 Inicio Rápido

### 1. Instalar dependencias
```bash
cd autorent-client
npm install
```

### 2. Configurar variables de entorno (Neon DB)

1. Crea un proyecto en [Neon](https://console.neon.tech) y obtén las URLs en "Connection details".
2. Copia `.env.example` a `.env` y rellena:
   - **DATABASE_URL**: Pooled connection + `?sslmode=require&pgbouncer=true`
   - **DIRECT_URL**: Direct connection + `?sslmode=require`
   - **AUTH_SECRET**: `openssl rand -base64 32`
   - **NEXTAUTH_URL**: `http://localhost:3000` (en producción, tu dominio)

### 3. Prisma y base de datos

```bash
npx prisma generate
```

**Base de datos nueva (solo Neon, sin Spring Boot):**
```bash
npx prisma migrate deploy   # o: npx prisma migrate dev
npm run seed                # Usuarios y maquinaria de prueba
```

**Base de datos existente (compartida con Spring):** no ejecutes `migrate`; usa `npx prisma db pull` si cambió el esquema.

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
autorent-client/
├── app/                      # Next.js App Router
│   ├── api/                 # API Routes
│   │   ├── auth/           # NextAuth endpoints
│   │   ├── registro/       # Registro de usuarios
│   │   └── reservas/       # Cancelar reservas
│   ├── catalogo/           # Catálogo de maquinaria
│   ├── login/              # Iniciar sesión
│   ├── registro/           # Crear cuenta
│   ├── mis-reservas/       # Reservas activas
│   ├── historial/          # Historial
│   └── page.tsx            # Landing page
├── components/              # Componentes reutilizables
├── lib/                     # Utilidades
├── prisma/                  # Schema de BD
└── README.md
```

## ✨ Funcionalidades

### Público (sin login)
- ✅ Landing page informativa
- ✅ Ver catálogo de maquinaria
- ✅ Ver detalles de equipos
- ✅ Filtrar por categoría

### Contratistas (con login)
- ✅ Registro e inicio de sesión
- ✅ Ver mis reservas activas
- ✅ Ver historial de alquileres
- ✅ Cancelar reservas (validaciones aplicadas)

## 🗄️ Base de Datos

Usa la **misma PostgreSQL de NeonDB** que el proyecto Spring Boot.

**NO ejecutar migraciones:**
```bash
# ❌ NO HACER ESTO (rompe compatibilidad con Spring)
npx prisma migrate dev

# ✅ SOLO HACER ESTO
npx prisma generate
npx prisma db pull  # Para actualizar schema si cambió
```

## 🔧 Scripts Disponibles

```bash
npm run dev      # Desarrollo
npm run build    # Build producción
npm start        # Ejecutar build
npm run lint     # Linter
```

## 📦 Tecnologías

- **Next.js 14** - Framework React
- **Prisma** - ORM
- **NextAuth v5** - Autenticación
- **Tailwind CSS** - Estilos
- **TypeScript** - Tipado

## 🎯 Próximos Pasos

1. Poblar la BD con datos de prueba
2. Crear Sprint 2 (App Administración)
3. Crear Sprint 3 (App Reservas)
4. Deploy en Vercel

---

**¿Dudas?** Revisa el proyecto Spring Boot original en `../AutoRent-Sprint-4`
