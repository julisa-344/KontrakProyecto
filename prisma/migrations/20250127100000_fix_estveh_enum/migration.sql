-- Asegurar que el tipo enum exista (por si la BD se creó con otro esquema)
DO $$ BEGIN
  CREATE TYPE "EstadoVehiculo" AS ENUM ('DISPONIBLE', 'OCUPADO', 'EN_MANTENIMIENTO', 'FUERA_SERVICIO');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Convertir columna estveh de character varying a enum EstadoVehiculo
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'vehiculo' AND column_name = 'estveh'
    AND data_type = 'character varying'
  ) THEN
    ALTER TABLE "vehiculo"
    ALTER COLUMN "estveh" TYPE "EstadoVehiculo"
    USING (
      CASE
        WHEN estveh IS NULL THEN NULL::"EstadoVehiculo"
        WHEN estveh::text IN ('DISPONIBLE','OCUPADO','EN_MANTENIMIENTO','FUERA_SERVICIO') THEN estveh::text::"EstadoVehiculo"
        ELSE 'DISPONIBLE'::"EstadoVehiculo"
      END
    );
  END IF;
END $$;
