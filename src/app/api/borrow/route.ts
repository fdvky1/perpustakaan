import prisma from "@/lib/db";
import xlsx, { IJsonSheet } from "json-as-xlsx";
import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { Borrow_Status } from "@prisma/client";

interface Payload {
    bookId: string;
    amount: number;
    return_schedule: string;
}

export async function GET(request: NextRequest){
    try {
        const keyword = request.nextUrl.searchParams.get("keyword");
        const from = request.nextUrl.searchParams.get("from");
        const to = request.nextUrl.searchParams.get("to");

        const isDownload = request.nextUrl.searchParams.get("download");
        const session = await getAuthSession();
        const borrows = await prisma.borrow.findMany({
            ...(session!.user.role == "user" ? {
                where: {
                    userId: session!.user.id
                }
            } : {}),
            include: {
                book: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                ...(session!.user.role != "user" ? {
                    user: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                } : {})
            },
            orderBy: {
                borrowed_at: 'desc'
            },
            where: {
                ...(from && to ? {
                    borrowed_at: {
                        lte: new Date(to?? ""),
                        gte: new Date(from?? "")
                    },
                } : {}),
                ...(keyword ? {
                    OR: [
                        { code: { contains: keyword, mode: 'insensitive'}},
                    ]
                }: {})
            }
        });
        if (!isDownload || session!.user.role == "user") return NextResponse.json({ data: borrows });
        const buffer = await xlsx([
            {
                sheet: `Laporan peminjaman buku`,
                columns: [
                    { label: "Kode Peminjaman", value: "code" },
                    { label: "Peminjam", value: "user.name" },
                    { label: "Tanggal peminjaman", value: "borrowed_at"},
                    { label: "Judul Buku", value: "book.title" },
                    { label: "Jumlah dipinjam", value: "amount" },
                    { label: "Keterangan", value: (row: any) => row.status == "pending_borrow" ? "Menunggu konfirmasi peminjaman" : row.status == "pending_return" ? "Menunggu konfirmasi pengembalian" : row.status == "confirmed_borrow" ? "Sedang dipinjam" : row.status == "confirmed_lost" ? "Buku Hilang" : "Telah dikembalikan" },
                    { label: "Jadwal pengembalian", value: "return_schedule" },
                    { label: "Tanggal dikembalikan", value: "returned_at" },
                    { label: "Denda", value: "fine"}
                ],
                content: borrows
            }
        ], {
            RTL: false,
            writeOptions: {
                type: 'buffer',
                bookType: 'xlsx'
            }
        })
        return new NextResponse(buffer, {
            status: 200,
            headers: new Headers({
                "content-disposition": `attachment; filename=Laporan ${new Date().getMonth()}/${new Date().getFullYear()}.xlsx`,
                "content-type": "application/octet-stream"
            })
        })
    }catch(e){
        console.log(e)
        return NextResponse.json({ message: "404 not found"}, { status: 404})
    }
}

export async function POST(request: Request) {
    try {
        const session = await getAuthSession();
        const { amount, bookId, return_schedule } = await request.json() as Payload;
        const transaction = await prisma.$transaction(async(tx)=>{
            const selectedBook = await tx.book.findUnique({
                where: {
                    id: bookId
                },
                select: {
                    stock: true
                }
            });
            if(!selectedBook) throw new Error("Book not found");
            const borrow = await tx.borrow.create({
                data: {
                    userId: session!.user.id,
                    bookId: bookId,
                    borrowed_at: new Date(),
                    amount,
                    return_schedule: new Date(return_schedule),
                    code: randomBytes(4).toString("hex")
                }
            })
            return {
                borrow,
                // book
            }
        });

        return NextResponse.json({
            message: "Success",
            detail: transaction.borrow
        })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "Failed to borrow a book"}, { status: 503 })
    }
}
