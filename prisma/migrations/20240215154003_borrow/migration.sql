/*
  Warnings:

  - Made the column `code` on table `Borrow` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Borrow" ALTER COLUMN "code" SET NOT NULL;
