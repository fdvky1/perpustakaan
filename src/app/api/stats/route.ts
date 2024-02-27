import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(){

    const [usersTotal, operatorTotal, booksTotal] = await Promise.all([prisma.user.count({where: { role: "user"}}), prisma.user.count({ where: { role: "operator"}}), prisma.book.count()])
    try {
        return NextResponse.json({ data: {
            usersTotal,
            operatorTotal,
            booksTotal
        }})
    }catch(e){
        return NextResponse.json({ message: "Fialed to get stats"}, { status: 503});
    }
}