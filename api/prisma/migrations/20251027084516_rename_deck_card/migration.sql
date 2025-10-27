/*
  Warnings:

  - You are about to drop the `Card` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Deck` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Card" DROP CONSTRAINT "Card_deckId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Deck" DROP CONSTRAINT "Deck_userId_fkey";

-- DropTable
DROP TABLE "public"."Card";

-- DropTable
DROP TABLE "public"."Deck";

-- CreateTable
CREATE TABLE "Koleksi" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Koleksi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kartu" (
    "id" TEXT NOT NULL,
    "koleksiId" TEXT NOT NULL,
    "front" TEXT NOT NULL,
    "back" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL DEFAULT 0,
    "reviewDueAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kartu_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Koleksi" ADD CONSTRAINT "Koleksi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kartu" ADD CONSTRAINT "Kartu_koleksiId_fkey" FOREIGN KEY ("koleksiId") REFERENCES "Koleksi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
