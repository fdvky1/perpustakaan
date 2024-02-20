import { getAuthSession } from '@/lib/auth'
import prisma from '@/lib/db';
import { hash } from 'bcrypt';
import { NextResponse } from 'next/server';

interface Payload {
    name: string;
    email: string;
    address: string;
    password?: string;
}

export async function GET(request: Request) {
    try {
        const session = await getAuthSession();
        const userInfo = await prisma.user.findUnique({ where: {
            id: session!.user.id
        }, select: {
            id: true,
            name: true,
            email: true,
            address: true
        } });
        return NextResponse.json({ data: userInfo });
    }catch(e){
        return NextResponse.json({ message: "404 Not Found"}, { status: 404 });
    }
}

export async function PUT(request: Request) {
    try {
        const session = await getAuthSession();
        const { name, email, password, address } = (await request.json()) as Payload;
        let hashedPassword: string|null = null;
        if(password){
            hashedPassword = await hash(password, 10);
        }
        const response = await prisma.user.update({
            data: {
                name,
                email,
                address,
                ...(hashedPassword ? { password: hashedPassword } : {})
            },
            where: {
                id: session?.user.id
            }
        });
        return NextResponse.json({ message: "Success!" });
    }catch(e){
        return NextResponse.json({ message: "Failed to update" }, { status: 503 });
    }
}