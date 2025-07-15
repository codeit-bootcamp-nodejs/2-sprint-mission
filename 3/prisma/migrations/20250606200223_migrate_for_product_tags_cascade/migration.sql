-- DropForeignKey
ALTER TABLE "ProductTags" DROP CONSTRAINT "ProductTags_productId_fkey";

-- AddForeignKey
ALTER TABLE "ProductTags" ADD CONSTRAINT "ProductTags_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
