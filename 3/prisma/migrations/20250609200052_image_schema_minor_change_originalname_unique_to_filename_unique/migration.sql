/*
  Warnings:

  - A unique constraint covering the columns `[filename]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - Made the column `encoding` on table `Image` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Image_originalname_key";

-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "encoding" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Image_filename_key" ON "Image"("filename");
