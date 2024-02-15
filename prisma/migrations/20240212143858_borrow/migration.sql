-- CreateEnum
CREATE TYPE "Borrow_Status" AS ENUM ('pending_borrow', 'confirmed_borrow', 'confirmed_return', 'confirmed_lost');

-- AlterTable
ALTER TABLE "Borrow" ADD COLUMN     "confirmed_borrow_by" TEXT,
ADD COLUMN     "confirmed_return_by" TEXT,
ADD COLUMN     "status" "Borrow_Status" NOT NULL DEFAULT 'pending_borrow';

-- AddForeignKey
ALTER TABLE "Borrow" ADD CONSTRAINT "Borrow_confirmed_borrow_by_fkey" FOREIGN KEY ("confirmed_borrow_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Borrow" ADD CONSTRAINT "Borrow_confirmed_return_by_fkey" FOREIGN KEY ("confirmed_return_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
