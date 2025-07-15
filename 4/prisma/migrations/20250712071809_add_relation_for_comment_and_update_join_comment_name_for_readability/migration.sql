/*
  Warnings:

  - You are about to drop the `CommentToArticle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CommentToProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "CommentToArticle";

-- DropTable
DROP TABLE "CommentToProduct";

-- CreateTable
CREATE TABLE "RootCommentToProduct" (
    "productId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,

    CONSTRAINT "RootCommentToProduct_pkey" PRIMARY KEY ("productId","commentId")
);

-- CreateTable
CREATE TABLE "RootCommentToArticle" (
    "articleId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,

    CONSTRAINT "RootCommentToArticle_pkey" PRIMARY KEY ("articleId","commentId")
);

-- AddForeignKey
ALTER TABLE "RootCommentToProduct" ADD CONSTRAINT "RootCommentToProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RootCommentToProduct" ADD CONSTRAINT "RootCommentToProduct_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RootCommentToArticle" ADD CONSTRAINT "RootCommentToArticle_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RootCommentToArticle" ADD CONSTRAINT "RootCommentToArticle_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
