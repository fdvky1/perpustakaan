import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface Payload {
    cover?: string | "";
    title: string;
    author: string;
    publisher: string;
    published_at: string;
    categories: string[];
}

export async function GET(request: NextRequest){
    const books = await (!!request.nextUrl.searchParams.get("include") ? prisma.book.findMany({
        include: {
            categories: {
                include: {
                    category: true
                }
            }
        }
    }) : prisma.book.findMany());
    return NextResponse.json({ data: books })
}

export async function POST(request: Request){
    try {
        const { cover, title, author, publisher, published_at, categories } = await request.json() as Payload;
        const transaction = await prisma.$transaction(async()=>{
            const book = await prisma.book.create({
                data: {
                    cover,
                    title,
                    author,
                    publisher,
                    published_at: new Date(published_at)
                }
            });
            const bookCategory = await prisma.bookCategory.createMany({ data: categories.map(c => {
                return {
                    bookId: book.id,
                    categoryId: c
                }
            })});

            return {
                book,
                bookCategory
            }
        })

        return NextResponse.json({ message: "created", detail: transaction.book})
    } catch (e){
        NextResponse.json({ message: "Failed to create"}, { status: 503 })
    }
}