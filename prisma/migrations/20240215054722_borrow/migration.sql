/*
  Warnings:

  - Added the required column `return_schedule` to the `Borrow` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Borrow" ADD COLUMN     "fine" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "return_schedule" TIMESTAMP(3) NOT NULL;
