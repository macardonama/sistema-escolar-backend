/*
  Warnings:

  - A unique constraint covering the columns `[estudianteId,asignacionAcademicaId,fecha]` on the table `Asistencia` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Asistencia_estudianteId_asignacionAcademicaId_fecha_key" ON "Asistencia"("estudianteId", "asignacionAcademicaId", "fecha");
