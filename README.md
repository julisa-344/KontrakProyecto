# AutoRent Client - Aplicación de Contratistas

Aplicación Next.js 14 para contratistas que necesitan alquilar maquinaria de construcción. Esta es la migración del proyecto Spring Boot original.

## 🚀 Inicio Rápido

### 1. Instalar dependencias
```bash
cd autorent-client
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` basado en `.env.example`:

```env
DATABASE_URL="postgresql://neondb_owner:npg_LNorYx4Tz6fO@ep-divine-block-ah3b0tyj-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="genera-un-secret-con-openssl-rand-base64-32"
```

### 3. Generar cliente de Prisma

```bash
npx prisma generate
```

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
