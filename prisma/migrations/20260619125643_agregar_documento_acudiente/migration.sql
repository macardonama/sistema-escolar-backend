/*
  Warnings:

  - A unique constraint covering the columns `[documento]` on the table `Acudiente` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Acudiente" ADD COLUMN     "documento" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Acudiente_documento_key" ON "Acudiente"("documento");
