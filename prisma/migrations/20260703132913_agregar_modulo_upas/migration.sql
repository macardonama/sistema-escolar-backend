-- CreateEnum
CREATE TYPE "EstadoUpa" AS ENUM ('BORRADOR', 'ENVIADA', 'EN_REVISION', 'REQUIERE_AJUSTES', 'APROBADA');

-- AlterEnum
ALTER TYPE "RolUsuario" ADD VALUE 'COORDINADOR';

-- CreateTable
CREATE TABLE "Upa" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "mision" TEXT NOT NULL,
    "salidaPedagogicaTexto" TEXT,
    "semanasNumero" INTEGER NOT NULL,
    "estado" "EstadoUpa" NOT NULL DEFAULT 'BORRADOR',
    "docenteId" INTEGER NOT NULL,
    "grupoId" INTEGER,
    "areaId" INTEGER,
    "asignacionAcademicaId" INTEGER,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Upa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UpaSemana" (
    "id" SERIAL NOT NULL,
    "upaId" INTEGER NOT NULL,
    "numeroSemana" INTEGER NOT NULL,
    "detalle" TEXT NOT NULL,

    CONSTRAINT "UpaSemana_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UpaRetroalimentacion" (
    "id" SERIAL NOT NULL,
    "upaId" INTEGER NOT NULL,
    "coordinadorUsuarioId" INTEGER NOT NULL,
    "comentario" TEXT NOT NULL,
    "estadoSugerido" "EstadoUpa",
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UpaRetroalimentacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UpaSemana_upaId_numeroSemana_key" ON "UpaSemana"("upaId", "numeroSemana");

-- AddForeignKey
ALTER TABLE "Upa" ADD CONSTRAINT "Upa_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "Docente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upa" ADD CONSTRAINT "Upa_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "Grupo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upa" ADD CONSTRAINT "Upa_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upa" ADD CONSTRAINT "Upa_asignacionAcademicaId_fkey" FOREIGN KEY ("asignacionAcademicaId") REFERENCES "AsignacionAcademica"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpaSemana" ADD CONSTRAINT "UpaSemana_upaId_fkey" FOREIGN KEY ("upaId") REFERENCES "Upa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpaRetroalimentacion" ADD CONSTRAINT "UpaRetroalimentacion_upaId_fkey" FOREIGN KEY ("upaId") REFERENCES "Upa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpaRetroalimentacion" ADD CONSTRAINT "UpaRetroalimentacion_coordinadorUsuarioId_fkey" FOREIGN KEY ("coordinadorUsuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
