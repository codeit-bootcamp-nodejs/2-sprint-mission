/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email,provider]` on the table `OAuthAccount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `OAuthAccount` table without a default value. This is not possible if the table is not empty.
  - Made the column `provider` on table `OAuthAccount` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "OAuthAccount" ADD COLUMN     "email" TEXT NOT NULL,
ALTER COLUMN "provider" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email";

-- CreateIndex
CREATE UNIQUE INDEX "OAuthAccount_email_provider_key" ON "OAuthAccount"("email", "provider");
