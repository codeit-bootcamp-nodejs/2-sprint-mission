/*
  Warnings:

  - You are about to drop the column `uesrId` on the `Comment` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "uesrId",
ADD COLUMN     "userId" TEXT NOT NULL;
