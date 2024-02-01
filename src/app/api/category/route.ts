import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface Payload {
    name: string;
}

export async function GET(request: NextRequest){
    const categories = await (!!request.nextUrl.searchParams.get("include") ? prisma.category.findMany({
        include: {
            books: {
                include: {
                    book: true
                }
            }
        }
    }) : prisma.category.findMany());
    return NextResponse.json({ data: categories });
}

export async function POST(request: Request){
    try {
        const { name } = await request.json() as Payload;
        const response = await prisma.category.create({data: { name }});
        return NextResponse.json({ detail: response })
    } catch(e) {
        return NextResponse.json({ message: "Failed to create"}, { status: 503 })
    }
}