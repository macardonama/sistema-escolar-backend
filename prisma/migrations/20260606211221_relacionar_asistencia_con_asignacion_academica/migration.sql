-- AlterTable
ALTER TABLE "Asistencia" ADD COLUMN     "asignacionAcademicaId" INTEGER;

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_asignacionAcademicaId_fkey" FOREIGN KEY ("asignacionAcademicaId") REFERENCES "AsignacionAcademica"("id") ON DELETE SET NULL ON UPDATE CASCADE;
