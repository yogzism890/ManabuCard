-- AlterTable
ALTER TABLE "Kartu" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Koleksi" ADD COLUMN     "deskripsi" TEXT;

-- CreateIndex
CREATE INDEX "Kartu_koleksiId_reviewDueAt_idx" ON "Kartu"("koleksiId", "reviewDueAt");
