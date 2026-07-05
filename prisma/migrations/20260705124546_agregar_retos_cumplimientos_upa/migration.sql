-- CreateTable
CREATE TABLE "UpaReto" (
    "id" SERIAL NOT NULL,
    "upaId" INTEGER NOT NULL,
    "numero" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UpaReto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UpaRetoCumplimiento" (
    "id" SERIAL NOT NULL,
    "retoId" INTEGER NOT NULL,
    "estudianteId" INTEGER NOT NULL,
    "cumple" BOOLEAN NOT NULL DEFAULT false,
    "observacion" TEXT,
    "registradoPorUsuarioId" INTEGER,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UpaRetoCumplimiento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UpaReto_upaId_numero_key" ON "UpaReto"("upaId", "numero");

-- CreateIndex
CREATE UNIQUE INDEX "UpaRetoCumplimiento_retoId_estudianteId_key" ON "UpaRetoCumplimiento"("retoId", "estudianteId");

-- AddForeignKey
ALTER TABLE "UpaReto" ADD CONSTRAINT "UpaReto_upaId_fkey" FOREIGN KEY ("upaId") REFERENCES "Upa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpaRetoCumplimiento" ADD CONSTRAINT "UpaRetoCumplimiento_retoId_fkey" FOREIGN KEY ("retoId") REFERENCES "UpaReto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpaRetoCumplimiento" ADD CONSTRAINT "UpaRetoCumplimiento_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "Estudiante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
