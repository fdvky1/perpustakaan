-- DropForeignKey
ALTER TABLE "BookCategory" DROP CONSTRAINT "BookCategory_bookId_fkey";

-- AddForeignKey
ALTER TABLE "BookCategory" ADD CONSTRAINT "BookCategory_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
