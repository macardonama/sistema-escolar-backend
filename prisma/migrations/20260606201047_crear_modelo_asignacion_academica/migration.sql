-- CreateTable
CREATE TABLE "AsignacionAcademica" (
    "id" SERIAL NOT NULL,
    "docenteId" INTEGER NOT NULL,
    "grupoId" INTEGER NOT NULL,
    "areaId" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AsignacionAcademica_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AsignacionAcademica_docenteId_grupoId_areaId_key" ON "AsignacionAcademica"("docenteId", "grupoId", "areaId");

-- AddForeignKey
ALTER TABLE "AsignacionAcademica" ADD CONSTRAINT "AsignacionAcademica_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "Docente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionAcademica" ADD CONSTRAINT "AsignacionAcademica_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "Grupo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionAcademica" ADD CONSTRAINT "AsignacionAcademica_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
