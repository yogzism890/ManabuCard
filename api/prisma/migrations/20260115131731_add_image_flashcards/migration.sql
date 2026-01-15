-- DropIndex
DROP INDEX "public"."idx_kartu_koleksiId_type";

-- DropIndex
DROP INDEX "public"."idx_kartu_type";

-- AlterTable
ALTER TABLE "Kartu" ALTER COLUMN "front" DROP NOT NULL,
ALTER COLUMN "back" DROP NOT NULL;
