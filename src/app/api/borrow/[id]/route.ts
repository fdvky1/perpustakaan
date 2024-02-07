import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: {id: string}}){
    try {
        const transaction = await prisma.$transaction(async(tx) => {
            const findBorrow = await tx.borrow.findUnique({
                where: {
                    id: params.id
                }
            });
            const findBook = await tx.book.findUnique({
                where: {
                    id: findBorrow!.bookId
                },
                select: {
                    stock: true
                }
            });
            const book = await tx.book.update({
                data: {
                    stock: findBook!.stock + findBorrow!.amount
                },
                where: {
                    id: findBorrow!.bookId
                }
            });
            const borrow = await tx.borrow.update({
                data: {
                    returned_at: new Date()
                },
                where: {
                    id: params.id
                }
            });
            return {
                book,
                borrow
            }
        })
        return NextResponse.json({ message: "Success", detail: transaction.borrow})
    }catch(e){
        return NextResponse.json({ message: "Failed to return a book"}, { status: 503})
    }
}