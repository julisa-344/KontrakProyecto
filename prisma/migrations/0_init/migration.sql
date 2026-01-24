-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('PROPIETARIO', 'CLIENTE', 'ADMINISTRADOR', 'CONTRATISTA');

-- CreateEnum
CREATE TYPE "EstadoVehiculo" AS ENUM ('DISPONIBLE', 'OCUPADO', 'EN_MANTENIMIENTO', 'FUERA_SERVICIO');

-- CreateEnum
CREATE TYPE "EstadoReserva" AS ENUM ('PENDIENTE', 'CONFIRMADA', 'RECHAZADA', 'ESPERANDO_CLIENTE', 'EN_USO', 'ESPERANDO_PROPIETARIO', 'FINALIZADA', 'CANCELADA');

-- CreateTable
CREATE TABLE IF NOT EXISTS "usuario" (
    "idprop" SERIAL NOT NULL,
    "nomprop" TEXT NOT NULL,
    "apeprop" TEXT NOT NULL,
    "dniprop" TEXT NOT NULL,
    "emailprop" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "estprop" BOOLEAN NOT NULL DEFAULT true,
    "rol" "Rol" NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("idprop")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "vehiculo" (
    "idveh" SERIAL NOT NULL,
    "plaveh" TEXT NOT NULL,
    "marveh" TEXT NOT NULL,
    "modveh" TEXT NOT NULL,
    "anioveh" INTEGER,
    "categoria" TEXT,
    "potencia" DOUBLE PRECISION,
    "capacidad" TEXT,
    "dimensiones" TEXT,
    "peso" DOUBLE PRECISION,
    "accesorios" TEXT,
    "requiere_certificacion" BOOLEAN NOT NULL DEFAULT false,
    "horas_uso" DOUBLE PRECISION,
    "precioalquilo" DOUBLE PRECISION NOT NULL,
    "estveh" "EstadoVehiculo" NOT NULL,
    "fecharegistro" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "fotoveh" TEXT,
    "idprop" INTEGER NOT NULL,

    CONSTRAINT "vehiculo_pkey" PRIMARY KEY ("idveh")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "reserva" (
    "idres" SERIAL NOT NULL,
    "fechares" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechainicio" TIMESTAMP(3) NOT NULL,
    "fechafin" TIMESTAMP(3) NOT NULL,
    "costo" INTEGER NOT NULL,
    "estado" "EstadoReserva" NOT NULL,
    "fechafinalizacion" TIMESTAMP(3),
    "idcli" INTEGER NOT NULL,
    "idveh" INTEGER NOT NULL,

    CONSTRAINT "reserva_pkey" PRIMARY KEY ("idres")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "usuario_emailprop_key" ON "usuario"("emailprop");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "vehiculo_plaveh_key" ON "vehiculo"("plaveh");

-- AddForeignKey
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'vehiculo_idprop_fkey'
    ) THEN
        ALTER TABLE "vehiculo" ADD CONSTRAINT "vehiculo_idprop_fkey" FOREIGN KEY ("idprop") REFERENCES "usuario"("idprop") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'reserva_idcli_fkey'
    ) THEN
        ALTER TABLE "reserva" ADD CONSTRAINT "reserva_idcli_fkey" FOREIGN KEY ("idcli") REFERENCES "usuario"("idprop") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'reserva_idveh_fkey'
    ) THEN
        ALTER TABLE "reserva" ADD CONSTRAINT "reserva_idveh_fkey" FOREIGN KEY ("idveh") REFERENCES "vehiculo"("idveh") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;
