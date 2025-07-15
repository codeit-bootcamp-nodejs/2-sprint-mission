/*
  Warnings:

  - You are about to drop the column `accessToken` on the `OAuthAccount` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `OAuthAccount` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OAuthAccount" DROP COLUMN "accessToken",
DROP COLUMN "refreshToken";
