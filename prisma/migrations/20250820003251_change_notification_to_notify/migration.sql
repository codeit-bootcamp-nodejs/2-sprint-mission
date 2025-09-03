/*
  Warnings:

  - You are about to drop the `Notifications` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "NotifyType" AS ENUM ('PRICE_CHANGE', 'ARTICLE_COMMENT', 'PRODUCT_COMMENT');

-- DropForeignKey
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_userId_fkey";

-- DropTable
DROP TABLE "Notifications";

-- DropEnum
DROP TYPE "NotificationType";

-- CreateTable
CREATE TABLE "Notify" (
    "id" SERIAL NOT NULL,
    "type" "NotifyType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT,
    "meta" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Notify_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notify_userId_isRead_createdAt_idx" ON "Notify"("userId", "isRead", "createdAt");

-- AddForeignKey
ALTER TABLE "Notify" ADD CONSTRAINT "Notify_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
