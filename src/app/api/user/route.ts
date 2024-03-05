import { NextRequest, NextResponse } from 'next/server';
import type { Role, User } from '@prisma/client';
import { getAuthSession } from '@/lib/auth'
import prisma from "@/lib/db";
import { hash } from 'bcrypt';

interface Payload {
    role: Role
    name: string;
    email: string;
    password: string;
    address: string;
}

export async function GET(request: NextRequest){
    const keyword = request.nextUrl.searchParams.get("keyword");
    const session = await getAuthSession();
    const limit = parseInt(request.nextUrl.searchParams.get("limit")?? "10");
    const page = parseInt(request.nextUrl.searchParams.get("page")?? "1");

    const [users, count] = await prisma.$transaction([
        prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                role: true
            },
            where: {
                id: {
                    not: session?.user.id
                },
                role: {
                    not: "admin"
                },
                ...(keyword ? {
                        OR: [
                            { name: { contains: keyword, mode: 'insensitive'}},
                            { email: { contains: keyword, mode: 'insensitive'}},
                            { address: { contains: keyword, mode: 'insensitive'}},
                        ]
                    }
                : {})
            },
            skip: limit * (page - 1),
            take: limit 
        }),
        ...(!!request.nextUrl.searchParams.get("count") ? [prisma.user.count()] : []) 
    ]);

    return NextResponse.json({ data: users, count})
}


export async function POST(request: Request){
    try {
        const { role, name, email, password, address } = (await request.json()) as Payload;
        if(await prisma.user.findFirst({where: { email }})) return NextResponse.json({ message: "Email already used"}, { status: 409});
        const hashedPassword = await hash(password, 10);
        const response = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                address,
                role
            }
        });
        return NextResponse.json({ message: "Success", detail: response });
    } catch (e){
        return NextResponse.json({ message: "Failed to create"}, {  status: 503 })
    }
}