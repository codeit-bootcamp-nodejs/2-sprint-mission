/*
  Warnings:

  - A unique constraint covering the columns `[userId,articleId]` on the table `ArticleLiked` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,productId]` on the table `ProductLiked` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ArticleLiked_userId_articleId_key" ON "ArticleLiked"("userId", "articleId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductLiked_userId_productId_key" ON "ProductLiked"("userId", "productId");
