/*
  Warnings:

  - Added the required column `originalname` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Image_userId_key";

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "originalname" TEXT NOT NULL;
