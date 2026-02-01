import { EstadoVehiculo, PrismaClient } from '@prisma/client'
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
      plaveh: 'EXC-20T',
      marveh: 'Caterpillar',
      modveh: 'Excavadora hidráulica 20T',
      anioveh: 2023,
      categoria: 'Maquinaria Pesada',
      potencia: 158,
      capacidad: '1.2 m³',
      dimensiones: '9.5m x 2.8m',
      peso: 20000,
      accesorios: null,
      requiere_certificacion: true,
      horas_uso: 0,
      precioalquilo: 450,
      estveh: EstadoVehiculo.DISPONIBLE,
      fotoveh: '/products/excavadorahidraulica.png',
      idprop: propietario1.idprop
    },
    {
      plaveh: 'MAR-HYD',
      marveh: 'Indeco',
      modveh: 'Martillo hidráulico para excavadora',
      anioveh: 2023,
      categoria: 'Accesorios',
      potencia: 0,
      capacidad: 'N/A',
      dimensiones: 'N/A',
      peso: 800,
      accesorios: null,
      requiere_certificacion: false,
      horas_uso: 0,
      precioalquilo: 120,
      estveh: EstadoVehiculo.DISPONIBLE,
      fotoveh: '/products/martillohidraulico.png',
      idprop: propietario1.idprop
    },
    {
      plaveh: 'BOB-S70',
      marveh: 'Bobcat',
      modveh: 'Minicargador Bobcat S70',
      anioveh: 2022,
      categoria: 'Maquinaria Ligera',
      potencia: 23,
      capacidad: '300 kg',
      dimensiones: '2.5m x 0.9m',
      peso: 1200,
      accesorios: null,
      requiere_certificacion: false,
      horas_uso: 150,
      precioalquilo: 180,
      estveh: EstadoVehiculo.DISPONIBLE,
      fotoveh: '/products/MinicargadorBobcat.png',
      idprop: admin.idprop
    },
    {
      plaveh: 'PAL-BOB',
      marveh: 'Bobcat',
      modveh: 'Paleta incluida para minicargador',
      anioveh: 2023,
      categoria: 'Accesorios',
      potencia: 0,
      capacidad: 'N/A',
      dimensiones: 'Standard',
      peso: 60,
      accesorios: null,
      requiere_certificacion: false,
      horas_uso: 0,
      precioalquilo: 40,
      estveh: EstadoVehiculo.DISPONIBLE,
      fotoveh: '/products/Paletaincluidaparaminicargador.png',
      idprop: admin.idprop
    },
    {
      plaveh: 'MEZ-200L',
      marveh: 'Strong',
      modveh: 'Mezcladora de concreto 200L',
      anioveh: 2024,
      categoria: 'Construcción',
      potencia: 2,
      capacidad: '200 Litros',
      dimensiones: 'N/A',
      peso: 130,
      accesorios: null,
      requiere_certificacion: false,
      horas_uso: 0,
      precioalquilo: 70,
      estveh: EstadoVehiculo.DISPONIBLE,
      fotoveh: '/products/mezcladoradeconcreto.png',
      idprop: propietario1.idprop
    },
    {
      plaveh: 'COM-450',
      marveh: 'Mikasa',
      modveh: 'Compactadora de placa vibratoria 450mm',
      anioveh: 2023,
      categoria: 'Compactación',
      potencia: 5,
      capacidad: '450mm',
      dimensiones: 'N/A',
      peso: 90,
      accesorios: null,
      requiere_certificacion: false,
      horas_uso: 0,
      precioalquilo: 95,
      estveh: EstadoVehiculo.DISPONIBLE,
      fotoveh: '/products/compactadora450mm.png',
      idprop: admin.idprop
    },
    {
      plaveh: 'PLA-REV',
      marveh: 'Wacker',
      modveh: 'Placa reversible para compactadora',
      anioveh: 2023,
      categoria: 'Compactación',
      potencia: 6,
      capacidad: 'N/A',
      dimensiones: 'N/A',
      peso: 150,
      accesorios: null,
      requiere_certificacion: false,
      horas_uso: 0,
      precioalquilo: 110,
      estveh: EstadoVehiculo.DISPONIBLE,
      fotoveh: '/products/placareversibleparacompactadora.png',
      idprop: admin.idprop
    },
    {
      plaveh: 'GEN-10K',
      marveh: 'Honda',
      modveh: 'Generador eléctrico 10kVA',
      anioveh: 2024,
      categoria: 'Energía',
      potencia: 10,
      capacidad: '10 kVA',
      dimensiones: 'N/A',
      peso: 110,
      accesorios: null,
      requiere_certificacion: false,
      horas_uso: 0,
      precioalquilo: 130,
      estveh: EstadoVehiculo.DISPONIBLE,
      fotoveh: '/products/generadorelectrico.png',
      idprop: propietario1.idprop
    },
    {
      plaveh: 'EXT-IND',
      marveh: 'Genérico',
      modveh: 'Extensión eléctrica industrial',
      anioveh: 2024,
      categoria: 'Accesorios',
      potencia: 0,
      capacidad: '50m',
      dimensiones: 'N/A',
      peso: 15,
      accesorios: null,
      requiere_certificacion: false,
      horas_uso: 0,
      precioalquilo: 25,
      estveh: EstadoVehiculo.DISPONIBLE,
      fotoveh: '/products/extencionelectricaindutrial.png',
      idprop: admin.idprop
    },
    {
      plaveh: 'TIJ-010',
      marveh: 'Genie',
      modveh: 'Plataforma elevadora tipo tijera',
      anioveh: 2022,
      categoria: 'Elevación',
      potencia: 0,
      capacidad: '230 kg',
      dimensiones: '10m Altura',
      peso: 2400,
      accesorios: null,
      requiere_certificacion: true,
      horas_uso: 400,
      precioalquilo: 320,
      estveh: EstadoVehiculo.DISPONIBLE,
      fotoveh: '/products/plataformaelevadoradetijera.png',
      idprop: admin.idprop
    },
    {
      plaveh: 'BAR-SEG',
      marveh: 'N/A',
      modveh: 'Barandas de seguridad para plataforma',
      anioveh: 2023,
      categoria: 'Accesorios',
      potencia: 0,
      capacidad: 'N/A',
      dimensiones: 'N/A',
      peso: 40,
      accesorios: null,
      requiere_certificacion: false,
      horas_uso: 0,
      precioalquilo: 30,
      estveh: EstadoVehiculo.DISPONIBLE,
      fotoveh: '/products/barandilladeseguridaddeplataforma.png',
      idprop: admin.idprop
    },
    {
      plaveh: 'ROD-1.5',
      marveh: 'Hamm',
      modveh: 'Rodillo vibratorio doble 1.5T',
      anioveh: 2021,
      categoria: 'Compactación',
      potencia: 25,
      capacidad: '1.5 Ton',
      dimensiones: 'N/A',
      peso: 1550,
      accesorios: null,
      requiere_certificacion: true,
      horas_uso: 600,
      precioalquilo: 280,
      estveh: EstadoVehiculo.DISPONIBLE,
      fotoveh: '/products/rodillovibratorio.png',
      idprop: propietario1.idprop
    },
    {
      plaveh: 'BAR-ROD',
      marveh: 'N/A',
      modveh: 'Barandas y alarmas para rodillo',
      anioveh: 2023,
      categoria: 'Accesorios',
      potencia: 0,
      capacidad: 'N/A',
      dimensiones: 'N/A',
      peso: 25,
      accesorios: null,
      requiere_certificacion: false,
      horas_uso: 0,
      precioalquilo: 20,
      estveh: EstadoVehiculo.DISPONIBLE,
      fotoveh: '/products/barandasderodillo.png',
      idprop: propietario1.idprop
    },
    {
      plaveh: 'VOL-6M3',
      marveh: 'Hino',
      modveh: 'Camión volquete 6m³',
      anioveh: 2021,
      categoria: 'Transporte',
      potencia: 210,
      capacidad: '6 m³',
      dimensiones: 'N/A',
      peso: 10000,
      accesorios: null,
      requiere_certificacion: true,
      horas_uso: 3200,
      precioalquilo: 500,
      estveh: EstadoVehiculo.DISPONIBLE,
      fotoveh: '/products/camionvolquete.png',
      idprop: admin.idprop
    },
    {
      plaveh: 'CUC-RET',
      marveh: 'N/A',
      modveh: 'Cucharon estándar para retroexcavadora',
      anioveh: 2023,
      categoria: 'Accesorios',
      potencia: 0,
      capacidad: '0.8 m³',
      dimensiones: 'N/A',
      peso: 200,
      accesorios: null,
      requiere_certificacion: false,
      horas_uso: 0,
      precioalquilo: 45,
      estveh: EstadoVehiculo.DISPONIBLE,
      fotoveh: '/products/cucharondeexcavadora.png',
      idprop: admin.idprop
    },
    {
      plaveh: 'DEM-ELE',
      marveh: 'DeWalt',
      modveh: 'Martillo demoledor eléctrico',
      anioveh: 2024,
      categoria: 'Herramientas',
      potencia: 2100,
      capacidad: 'N/A',
      dimensiones: 'N/A',
      peso: 25,
      accesorios: null,
      requiere_certificacion: false,
      horas_uso: 0,
      precioalquilo: 85,
      estveh: EstadoVehiculo.DISPONIBLE,
      fotoveh: '/products/martillodemoledor.png',
      idprop: propietario1.idprop
    },
    {
      plaveh: 'CIN-CAS',
      marveh: 'N/A',
      modveh: 'Cinceles y maletín para martillo demoledor',
      anioveh: 2024,
      categoria: 'Accesorios',
      potencia: 0,
      capacidad: 'N/A',
      dimensiones: 'N/A',
      peso: 8,
      accesorios: null,
      requiere_certificacion: false,
      horas_uso: 0,
      precioalquilo: 15,
      estveh: EstadoVehiculo.DISPONIBLE,
      fotoveh: '/products/cincelesymaletindemartillodemoledor.png',
      idprop: propietario1.idprop
    },
    {
      plaveh: 'TOR-LED',
      marveh: 'Wacker',
      modveh: 'Torre de iluminación LED',
      anioveh: 2023,
      categoria: 'Iluminación',
      potencia: 0,
      capacidad: 'N/A',
      dimensiones: '8m',
      peso: 750,
      accesorios: null,
      requiere_certificacion: false,
      horas_uso: 0,
      precioalquilo: 150,
      estveh: EstadoVehiculo.DISPONIBLE,
      fotoveh: '/products/torredeiluminacionLED.png',
      idprop: admin.idprop
    },
    {
      plaveh: 'VIB-CON',
      marveh: 'Bosch',
      modveh: 'Vibrador de concreto portátil',
      anioveh: 2024,
      categoria: 'Construcción',
      potencia: 2,
      capacidad: 'N/A',
      dimensiones: '4m manguera',
      peso: 12,
      accesorios: null,
      requiere_certificacion: false,
      horas_uso: 0,
      precioalquilo: 50,
      estveh: EstadoVehiculo.DISPONIBLE,
      fotoveh: '/products/vibradordeconcreto.png',
      idprop: admin.idprop
    },
    {
      plaveh: 'DIS-DIA',
      marveh: 'Husqvarna',
      modveh: 'Disco diamantado para cortadora de concreto',
      anioveh: 2024,
      categoria: 'Consumibles',
      potencia: 0,
      capacidad: '14"',
      dimensiones: 'N/A',
      peso: 2,
      accesorios: null,
      requiere_certificacion: false,
      horas_uso: 0,
      precioalquilo: 35,
      estveh: EstadoVehiculo.DISPONIBLE,
      fotoveh: '/products/discodiamantado.png',
      idprop: admin.idprop
    }
  ];

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
