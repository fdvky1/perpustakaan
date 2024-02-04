import prisma from "@/lib/db";
import { NextResponse } from "next/server";

interface Params { params: { id: string }}
interface Payload {
    cover?: string | "";
    title: string;
    author: string;
    publisher: string;
    published_at: string;
    categories: string[];
}

export async function GET(request: Request, { params } : Params){
    try {
        const book = await prisma.book.findFirst({where: {id: params.id}, include: {
            categories: {
                include: {
                    category: true
                }
            }
        }})
        return NextResponse.json({ data: book})
    } catch(e) {
        return NextResponse.json({ message: "404 not found"}, { status: 404});
    }
}

export async function DELETE(request: Request, { params }: Params){
    try {
        await prisma.book.delete({where: { id: params.id }});
        return NextResponse.json({ message: "deleted successfully" })
    }catch(e){
        return NextResponse.json({ message: "Failed to delete"}, { status: 503 });
    }
}

export async function PUT(request: Request, { params }: Params){
    try {
        const { cover, title, author, publisher, published_at, categories } = await request.json() as Payload;
        await prisma.$transaction([
            prisma.book.update({
                data: {
                    cover,
                    title,
                    author,
                    publisher,
                    published_at: new Date(published_at)
                },
                where: {
                    id: params.id
                }
            }),
            prisma.bookCategory.deleteMany({
                where: {
                    bookId: params.id
                }
            }),
            prisma.bookCategory.createMany({ data: categories.map(c => {
                return {
                    bookId: params.id,
                    categoryId: c
                }
            })})
        ]);

        return NextResponse.json({ message: "Updated successfully"})
    }catch(e){
        return NextResponse.json({ message: "Failed to update" }, { status: 503 });
    }
}