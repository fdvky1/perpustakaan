import prisma from "@/lib/db";
import { NextResponse } from "next/server";

interface Params {
    params: {
        id: string;
    }
}

interface Payload {
    name: string;
}

export async function DELETE(request: Request, { params }: Params){
    try {
        const response = await prisma.category.delete({
            where:{
                id: params.id
            } 
        });
        return NextResponse.json({ message: "Successfully deleted" })
    }catch(e){
        return NextResponse.json({ message: "Failed to delete category"}, { status: 503})
    }
}

export async function PUT(request: Request, { params }: Params){
    try {
        const { name } = await request.json() as Payload;
        const response = await prisma.category.update({
            where: {
                id: params.id
            },
            data: {
                name
            }
        });
        return NextResponse.json({ message: "Updated successfully",  detail: response });
    } catch(e){
        return NextResponse.json({ message: "Failed to update category"}, { status: 503 })
    }
}