import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface Payload {
    name: string;
}

export async function GET(request: NextRequest){
    try {
        const keyword = request.nextUrl.searchParams.get("keyword");
        const limit = parseInt(request.nextUrl.searchParams.get("limit")?? "10");
        const page = parseInt(request.nextUrl.searchParams.get("page")?? "1");

        const [categories, count] = await prisma.$transaction([(!!request.nextUrl.searchParams.get("include") ? prisma.category.findMany({
            skip: limit * (page - 1),
            take: limit,
            include: {
                books: {
                    include: {
                        book: true
                    }
                }
            }
        }) : prisma.category.findMany({
            skip: limit * (page - 1),
            take: limit,
            ...(!!keyword ? {
                where: {
                    OR: [
                        { name: { contains: keyword, mode: 'insensitive'}},
                    ]
                },
            } : {}),
        })),
        ...(!!request.nextUrl.searchParams.get("count") ? [prisma.category.count()] : [])
        ]);
        return NextResponse.json({ data: categories, count });
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