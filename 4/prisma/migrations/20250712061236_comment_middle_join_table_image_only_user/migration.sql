/*
  Warnings:

  - You are about to drop the column `articleId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `articleId` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `commentId` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `destination` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `encoding` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `originalname` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `User` table. All the data in the column will be lost.
  - Made the column `userId` on table `Image` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_articleId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_productId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_articleId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_commentId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "articleId",
DROP COLUMN "productId",
DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "articleId",
DROP COLUMN "commentId",
DROP COLUMN "destination",
DROP COLUMN "encoding",
DROP COLUMN "originalname",
DROP COLUMN "size",
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "imageUrl";

-- CreateTable
CREATE TABLE "CommentToProduct" (
    "productId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,

    CONSTRAINT "CommentToProduct_pkey" PRIMARY KEY ("productId","commentId")
);

-- CreateTable
CREATE TABLE "CommentToArticle" (
    "articleId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,

    CONSTRAINT "CommentToArticle_pkey" PRIMARY KEY ("articleId","commentId")
);
