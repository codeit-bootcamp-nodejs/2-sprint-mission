/*
  Warnings:

  - A unique constraint covering the columns `[path]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `path` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "path" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Comment_path_key" ON "Comment"("path");
