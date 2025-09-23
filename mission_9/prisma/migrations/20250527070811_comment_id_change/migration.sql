/*
  Warnings:

  - The primary key for the `ArtiComment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ArtiComment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ProdComment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ProdComment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ArtiComment" DROP CONSTRAINT "ArtiComment_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "ArtiComment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ProdComment" DROP CONSTRAINT "ProdComment_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "ProdComment_pkey" PRIMARY KEY ("id");
