/*
  Warnings:

  - You are about to drop the column `return_at` on the `Borrow` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Borrow" DROP COLUMN "return_at",
ADD COLUMN     "returned_at" TIMESTAMP(3);
