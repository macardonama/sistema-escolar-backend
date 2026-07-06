-- CreateEnum
CREATE TYPE "EstadoPlanLector" AS ENUM ('LEYENDO', 'FINALIZADO', 'ABANDONADO');

-- CreateTable
CREATE TABLE "PlanLectorLibro" (
    "id" SERIAL NOT NULL,
    "estudianteId" INTEGER NOT NULL,
    "creadoPorUsuarioId" INTEGER,
    "nombre" TEXT NOT NULL,
    "autor" TEXT,
    "progreso" INTEGER NOT NULL DEFAULT 0,
    "estado" "EstadoPlanLector" NOT NULL DEFAULT 'LEYENDO',
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaFinalizacion" TIMESTAMP(3),
    "resena" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanLectorLibro_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlanLectorLibro" ADD CONSTRAINT "PlanLectorLibro_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "Estudiante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
