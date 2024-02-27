import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface Payload {
    name: string;
}

export async function GET(request: NextRequest){
    try {
        const keyword = request.nextUrl.searchParams.get("keyword");
        const categories = await (!!request.nextUrl.searchParams.get("include") ? prisma.category.findMany({
            include: {
                books: {
                    include: {
                        book: true
                    }
                }
            }
        }) : prisma.category.findMany({
            ...(!!keyword ? {
                where: {
                    OR: [
                        { name: { contains: keyword, mode: 'insensitive'}},
                    ]
                }
            } : {})
        }));
        return NextResponse.json({ data: categories });
    }catch(e){
        return NextResponse.json({ message: "Failed to get categories"}, { status: 503})
    }
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