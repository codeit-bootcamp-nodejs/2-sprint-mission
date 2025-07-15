/*
  Warnings:

  - You are about to drop the column `fieldname` on the `Image` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[originalname]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "fieldname",
ALTER COLUMN "encoding" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Image_originalname_key" ON "Image"("originalname");
