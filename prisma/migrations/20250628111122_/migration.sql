/*
  Warnings:

  - You are about to drop the column `imageURL` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "imageURL",
ADD COLUMN     "image" TEXT;
