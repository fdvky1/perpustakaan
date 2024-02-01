import prisma from "@/lib/db";
import { NextResponse } from "next/server";

interface Params {
    params: {
        id: string;
    }
}

export async function DELETE(request: Request, { params }: Params){
    try {
        const response = await prisma.category.delete({ where: { id: params.id } });
        return NextResponse.json({ message: "Success", detail: response })
    }catch(e){
        return NextResponse.json({ message: "Failed to delete category"}, { status: 503})
    }
}