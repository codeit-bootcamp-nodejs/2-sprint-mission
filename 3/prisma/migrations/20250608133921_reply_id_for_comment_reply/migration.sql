/*
  Warnings:

  - You are about to drop the column `path` on the `Comment` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Comment_path_key";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "path",
ADD COLUMN     "replyId" TEXT;
