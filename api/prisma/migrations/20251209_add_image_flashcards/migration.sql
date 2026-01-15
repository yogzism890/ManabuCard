-- Migration: Add image flashcard support to Kartu table
-- Created for ManabuCard Image Flashcards Feature

-- Add new columns for image flashcards
ALTER TABLE "Kartu" ADD COLUMN "type" TEXT DEFAULT 'TEXT';
ALTER TABLE "Kartu" ADD COLUMN "frontText" TEXT;
ALTER TABLE "Kartu" ADD COLUMN "backText" TEXT;
ALTER TABLE "Kartu" ADD COLUMN "frontImageUrl" TEXT;
ALTER TABLE "Kartu" ADD COLUMN "backImageUrl" TEXT;

-- Update existing records to have proper type
-- Cards with front/back content become TEXT type
UPDATE "Kartu" SET "type" = 'TEXT' WHERE "type" IS NULL OR "type" = '';

-- Add constraints
ALTER TABLE "Kartu" ALTER COLUMN "type" SET NOT NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS "idx_kartu_type" ON "Kartu"("type");
CREATE INDEX IF NOT EXISTS "idx_kartu_koleksiId_type" ON "Kartu"("koleksiId", "type");

