import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Limpiar datos existentes (opcional)
  await prisma.reserva.deleteMany()
  await prisma.vehiculo.deleteMany()
  await prisma.usuario.deleteMany()

  // Crear usuarios
  const adminPassword = await bcrypt.hash('admin123', 10)
  const clientePassword = await bcrypt.hash('cliente123', 10)
  const contratistaPassword = await bcrypt.hash('contratista123', 10)

  const admin = await prisma.usuario.create({
    data: {
      nomprop: 'Admin',
      apeprop: 'Sistema',
      dniprop: '12345678',
      emailprop: 'admin@autorent.com',
      password: adminPassword,
      rol: 'ADMINISTRADOR',
      estprop: true
    }
  })

  const cliente1 = await prisma.usuario.create({
    data: {
      nomprop: 'Juan',
      apeprop: 'Pérez',
      dniprop: '87654321',
      emailprop: 'juan@ejemplo.com',
      password: clientePassword,
      rol: 'CLIENTE',
      estprop: true
    }
  })

  const contratista1 = await prisma.usuario.create({
    data: {
      nomprop: 'Carlos',
      apeprop: 'López',
      dniprop: '11223344',
      emailprop: 'contratista@ejemplo.com',
      password: contratistaPassword,
      rol: 'CONTRATISTA',
      estprop: true
    }
  })

  const propietario1 = await prisma.usuario.create({
    data: {
      nomprop: 'María',
      apeprop: 'González',
      dniprop: '45678912',
      emailprop: 'maria@ejemplo.com',
      password: await bcrypt.hash('propietario123', 10),
      rol: 'PROPIETARIO',
      estprop: true
    }
  })

  console.log('✅ Usuarios creados')

  // Crear maquinaria de construcción
  const equipos = [
    {
      plaveh: 'EXC-001',
      marveh: 'Caterpillar',
      modveh: '320D',
      anioveh: 2020,
      categoria: 'Excavadoras',
      potencia: 158,
      capacidad: '1.2 m³',
      dimensiones: '9.5m x 2.8m x 3.1m',
      peso: 20500,
      accesorios: 'GPS, Aire acondicionado, Martillo hidráulico',
      requiere_certificacion: true,
      horas_uso: 1250.5,
      precioalquilo: 450,
      estveh: 'DISPONIBLE',
      fotoveh: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800',
      idprop: propietario1.idprop
    },
    {
      plaveh: 'RET-002',
      marveh: 'JCB',
      modveh: '3CX',
      anioveh: 2021,
      categoria: 'Retroexcavadoras',
      potencia: 100,
      capacidad: '0.8 m³',
      dimensiones: '7.2m x 2.3m x 3.7m',
      peso: 8500,
      accesorios: 'Martillo neumático, Cabina cerrada',
      requiere_certificacion: true,
      horas_uso: 850.0,
      precioalquilo: 320,
      estveh: 'DISPONIBLE',
      fotoveh: 'https://images.unsplash.com/photo-1590856029826-c7a73a4c7b89?w=800',
      idprop: propietario1.idprop
    },
    {
      plaveh: 'MNP-003',
      marveh: 'Volvo',
      modveh: 'EC210',
      anioveh: 2019,
      categoria: 'Minicargadoras',
      potencia: 65,
      capacidad: '0.5 m³',
      dimensiones: '3.5m x 1.8m x 2m',
      peso: 3200,
      accesorios: 'Horquillas, Cucharón multiuso',
      requiere_certificacion: false,
      horas_uso: 2100.5,
      precioalquilo: 180,
      estveh: 'DISPONIBLE',
      fotoveh: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800',
      idprop: admin.idprop
    },
    {
      plaveh: 'GRU-004',
      marveh: 'Liebherr',
      modveh: 'LTM 1050',
      anioveh: 2022,
      categoria: 'Grúas',
      potencia: 350,
      capacidad: '50 Ton',
      dimensiones: '12m x 2.5m x 3.8m',
      peso: 36000,
      accesorios: 'Control remoto, Sistema de seguridad avanzado',
      requiere_certificacion: true,
      horas_uso: 450.0,
      precioalquilo: 850,
      estveh: 'DISPONIBLE',
      fotoveh: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
      idprop: admin.idprop
    },
    {
      plaveh: 'ROD-005',
      marveh: 'HAMM',
      modveh: 'HD 12',
      anioveh: 2020,
      categoria: 'Rodillos',
      potencia: 95,
      capacidad: '3.5 Ton',
      dimensiones: '4.2m x 1.7m x 2.8m',
      peso: 3500,
      accesorios: 'Sistema de riego, Luces LED',
      requiere_certificacion: false,
      horas_uso: 1800.0,
      precioalquilo: 250,
      estveh: 'DISPONIBLE',
      fotoveh: 'https://images.unsplash.com/photo-1581093458791-9f3c3250e8d2?w=800',
      idprop: propietario1.idprop
    },
    {
      plaveh: 'MON-006',
      marveh: 'Komatsu',
      modveh: 'D65PX',
      anioveh: 2021,
      categoria: 'Motoniveladoras',
      potencia: 190,
      capacidad: 'N/A',
      dimensiones: '8.7m x 2.6m x 3.4m',
      peso: 16500,
      accesorios: 'GPS de nivelación, Cabina climatizada',
      requiere_certificacion: true,
      horas_uso: 950.0,
      precioalquilo: 520,
      estveh: 'OCUPADO',
      fotoveh: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800',
      idprop: admin.idprop
    },
    {
      plaveh: 'COM-007',
      marveh: 'Ingersoll Rand',
      modveh: 'DD-110',
      anioveh: 2023,
      categoria: 'Compactadoras',
      potencia: 74,
      capacidad: '2 Ton',
      dimensiones: '3.1m x 1.5m x 2.5m',
      peso: 2100,
      accesorios: 'Tanque de agua integrado',
      requiere_certificacion: false,
      horas_uso: 120.0,
      precioalquilo: 200,
      estveh: 'DISPONIBLE',
      fotoveh: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=800',
      idprop: propietario1.idprop
    },
    {
      plaveh: 'TRA-008',
      marveh: 'Doosan',
      modveh: 'DL250',
      anioveh: 2020,
      categoria: 'Tractores',
      potencia: 175,
      capacidad: '20 Ton',
      dimensiones: '9m x 3m x 3.5m',
      peso: 18000,
      accesorios: 'Tracción 4x4, Enganche trasero',
      requiere_certificacion: true,
      horas_uso: 1650.0,
      precioalquilo: 400,
      estveh: 'EN_MANTENIMIENTO',
      fotoveh: 'https://images.unsplash.com/photo-1625231334168-35067f8853ed?w=800',
      idprop: admin.idprop
    }
  ]

  for (const equipo of equipos) {
    await prisma.vehiculo.create({ data: equipo })
  }

  console.log('✅ Maquinaria creada (8 equipos)')

  console.log('\n📋 Credenciales de acceso (solo CLIENTE y CONTRATISTA pueden iniciar sesión en esta app):')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('👤 CLIENTE:')
  console.log('   Email: juan@ejemplo.com')
  console.log('   Password: cliente123')
  console.log('\n🔧 CONTRATISTA:')
  console.log('   Email: contratista@ejemplo.com')
  console.log('   Password: contratista123')
  console.log('\n👨‍💼 ADMINISTRADOR (solo backend): admin@autorent.com / admin123')
  console.log('🏢 PROPIETARIO (solo backend): maria@ejemplo.com / propietario123')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
