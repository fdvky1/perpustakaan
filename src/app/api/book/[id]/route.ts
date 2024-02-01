import prisma from "@/lib/db";
import { NextResponse } from "next/server";

interface Params { params: { id: string }}

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
        return NextResponse.json({ message: "404 not found"}, { status: 404})
    }
}

export async function DELETE(request: Request, { params }: Params){
    try {
        const response = await prisma.book.delete({where: { id: params.id }})
    }catch(e){
        return NextResponse.json({ message: "Failed to delete"}, { status: 503 })
    }
}

export async function PUT(request: Request, { params }: Params){

}