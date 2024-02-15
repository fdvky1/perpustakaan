import prisma from "@/lib/db";
import { Role } from "@prisma/client";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

interface Payload {
    role: Role
    name: string;
    email: string;
    password: string;
    address: string;
}

interface Params {
    params: {
        id: string;
    }
}


export async function GET(request: Request, { params } : Params){
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: params.id
            },
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                role: true
            }
        })
        return NextResponse.json({ data: user })
    }catch(e){
        return NextResponse.json({ message: "404 Not Found"}, { status: 404 })
    }
}

export async function DELETE(request: Request, { params } : Params){
    try {
        const response = await prisma.user.update({
            where: {
                id: params.id
            },
            data: {
                deleted_at: new Date()
            }
        })
        return NextResponse.json({ message: "Success delete" })
    }catch(e){
        return NextResponse.json({ message: "Failed to update" }, { status: 503 })
    }
}

export async function PUT(request: Request, { params }: Params){
    try {
        const { role, name, email, password, address } = (await request.json()) as Payload;
        let hashedPassword: string|null = null;
        if(password?.length > 0){
            hashedPassword = await hash(password, 10);
        }
        const response = await prisma.user.update({
            data: {
                name,
                email,
                address,
                role,
                ...(hashedPassword ? { password: hashedPassword } : {})
            },
            where: {
                id: params.id
            }
        });
        return NextResponse.json({ message: "Success!" });
    }catch(e){
        return NextResponse.json({ message: "Failed to update" }, { status: 503 });
    }
}