import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { getAuthSession } from '@/lib/auth'
import { Borrow_Status } from "@prisma/client";

interface Payload {
    type: "return" | "confirmed_borrow" | "confirmed_return" | "confirmed_lost"
    fine?: number
}

export async function PUT(request: Request, { params }: { params: {id: string}}){
    try {
        const session = await getAuthSession();
        const { type, fine } = (await request.json()) as Payload;
        const transaction = await prisma.$transaction(async(tx) => {
            const findBorrow = await tx.borrow.findUnique({
                where: {
                    id: params.id,
                    ...(session!.user.role == "user" ? { userId: session!.user.id } : {})
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
            let book;
            if (["confirmed_borrow", "confirmed_return"].includes(type)){
                book = await tx.book.update({
                    data: {
                        stock: type == "confirmed_borrow" ? findBook!.stock - findBorrow!.amount : findBook!.stock + findBorrow!.amount
                    },
                    where: {
                        id: findBorrow!.bookId
                    }
                });
            }
            const borrow = await tx.borrow.update({
                data: {
                    status: type == "return" ? "pending_return" : type,
                    ...(type == "confirmed_return" ? {
                        returned_at: new Date()
                    } : type == "confirmed_lost" ? {
                        fine
                    } : {})
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