-- Migration: Agregar campos de auditoría y simplificar EstadoReserva
-- Esta migración sincroniza el cliente con el admin

-- 1. Agregar campos de auditoría a reserva (si no existen)
ALTER TABLE reserva ADD COLUMN IF NOT EXISTS created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE reserva ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE reserva ADD COLUMN IF NOT EXISTS created_by INTEGER;
ALTER TABLE reserva ADD COLUMN IF NOT EXISTS updated_by INTEGER;
ALTER TABLE reserva ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP(3);
ALTER TABLE reserva ADD COLUMN IF NOT EXISTS deleted_by INTEGER;

-- 2. Agregar campos de auditoría a usuario (si no existen)
ALTER TABLE usuario ADD COLUMN IF NOT EXISTS created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE usuario ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE usuario ADD COLUMN IF NOT EXISTS created_by INTEGER;
ALTER TABLE usuario ADD COLUMN IF NOT EXISTS updated_by INTEGER;
ALTER TABLE usuario ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP(3);
ALTER TABLE usuario ADD COLUMN IF NOT EXISTS deleted_by INTEGER;

-- 3. Agregar campos de auditoría a vehiculo (si no existen)
ALTER TABLE vehiculo ADD COLUMN IF NOT EXISTS created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE vehiculo ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE vehiculo ADD COLUMN IF NOT EXISTS created_by INTEGER;
ALTER TABLE vehiculo ADD COLUMN IF NOT EXISTS updated_by INTEGER;
ALTER TABLE vehiculo ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP(3);
ALTER TABLE vehiculo ADD COLUMN IF NOT EXISTS deleted_by INTEGER;
ALTER TABLE vehiculo ADD COLUMN IF NOT EXISTS marca_id INTEGER;

-- 4. Convertir estados de reserva existentes antes de modificar el enum
UPDATE reserva SET estado = 'CANCELADA' WHERE estado = 'RECHAZADA';
UPDATE reserva SET estado = 'CONFIRMADA' WHERE estado = 'ESPERANDO_CLIENTE';
UPDATE reserva SET estado = 'CONFIRMADA' WHERE estado = 'EN_USO';
UPDATE reserva SET estado = 'CONFIRMADA' WHERE estado = 'ESPERANDO_PROPIETARIO';

-- 5. Simplificar el enum EstadoReserva
-- Verificar si necesitamos hacer el cambio del enum
DO $$
BEGIN
    -- Solo ejecutar si el enum tiene más de 4 valores
    IF EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel IN ('RECHAZADA', 'ESPERANDO_CLIENTE', 'EN_USO', 'ESPERANDO_PROPIETARIO')
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'EstadoReserva')
    ) THEN
        -- Crear nuevo enum
        CREATE TYPE "EstadoReserva_new" AS ENUM ('PENDIENTE', 'CONFIRMADA', 'FINALIZADA', 'CANCELADA');
        
        -- Cambiar columna
        ALTER TABLE reserva 
            ALTER COLUMN estado DROP DEFAULT,
            ALTER COLUMN estado TYPE "EstadoReserva_new" USING (estado::text::"EstadoReserva_new"),
            ALTER COLUMN estado SET DEFAULT 'PENDIENTE';
        
        -- Eliminar enum antiguo y renombrar
        DROP TYPE "EstadoReserva";
        ALTER TYPE "EstadoReserva_new" RENAME TO "EstadoReserva";
    END IF;
END $$;
