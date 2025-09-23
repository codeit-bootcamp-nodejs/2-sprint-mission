-- DropForeignKey
ALTER TABLE "ArtiComment" DROP CONSTRAINT "ArtiComment_articleId_fkey";

-- DropForeignKey
ALTER TABLE "ProdComment" DROP CONSTRAINT "ProdComment_productId_fkey";

-- AddForeignKey
ALTER TABLE "ProdComment" ADD CONSTRAINT "ProdComment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtiComment" ADD CONSTRAINT "ArtiComment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
