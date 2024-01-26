import { NextResponse } from "next/server";
import { hash } from 'bcrypt'
import prisma from '@/lib/db';

interface Payload {
    name: string;
    email: string;
    password: string;
    address: string;
}

export async function POST(request: Request){
    try {
        const { name, email, password, address } = (await request.json()) as Payload;
        if(await prisma.user.findFirst({where: { email }})) return NextResponse.json({ message: "Email already used"}, { status: 409});
        const hashedPassword = await hash(password, 10);
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                address
            }
        });
        return NextResponse.json({ message: 'User registed successfully'});   
    }catch(e){
        return NextResponse.json({ message: 'Failed to register' }, { status: 503 })
    }
}