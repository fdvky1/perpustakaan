import prisma from "@/lib/db";
import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
interface Payload {
    bookId: string;
    amount: number;
    return_schedule: string;
}

export async function GET(request: NextRequest){
    try {
        const keyword = request.nextUrl.searchParams.get("keyword");
        const session = await getAuthSession();
        const borrows = await prisma.borrow.findMany({
            ...(session!.user.role == "user" ? {
                where: {
                    userId: session!.user.id
                }
            } : {}),
            include: {
                book: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                ...(session!.user.role != "user" ? {
                    user: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                } : {})
            },
            orderBy: {
                borrowed_at: 'desc'
            },
            ...(keyword ? {
                where: {
                    OR: [
                        { code: { contains: keyword, mode: 'insensitive'}},
                    ]
                }
            }: {})
        });
        return NextResponse.json({ data: borrows });
    }catch(e){
        return NextResponse.json({ message: "404 not found"}, { status: 404})
    }
}

export async function POST(request: Request) {
    try {
        const session = await getAuthSession();
        const { amount, bookId, return_schedule } = await request.json() as Payload;
        const transaction = await prisma.$transaction(async(tx)=>{
            const selectedBook = await tx.book.findUnique({
                where: {
                    id: bookId
                },
                select: {
                    stock: true
                }
            });
            if(!selectedBook) throw new Error("Book not found");
            const borrow = await tx.borrow.create({
                data: {
                    userId: session!.user.id,
                    bookId: bookId,
                    borrowed_at: new Date(),
                    amount,
                    return_schedule: new Date(return_schedule),
                    code: randomBytes(4).toString("hex")
                }
            })
            return {
                borrow,
                // book
            }
        });

        return NextResponse.json({
            message: "Success",
            detail: transaction.borrow
        })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "Failed to borrow a book"}, { status: 503 })
    }
}
