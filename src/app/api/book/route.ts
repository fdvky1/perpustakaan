import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Book } from "@prisma/client";
interface Payload extends Omit<Book, "published_at"> {
    published_at: string;
    categories: string[];
}

type SearchCondition = {
    contains: string;
    mode?: 'insensitive';
};

interface Query {
    skip: number;
    take: number;
    where?: {
        categories?:{
            some?: {
                categoryId: string;
            }
        }
        OR?: {
            title?: SearchCondition;
            author?: SearchCondition;
            publisher?: SearchCondition;
        }[];
    }
    include?:{
        categories?:{
            where?: {
                categoryId?: string;
            }
            include?:{
                category?: boolean
            }
        }
    }
}

export async function GET(request: NextRequest){
    const include = request.nextUrl.searchParams.get("include");
    const keyword = request.nextUrl.searchParams.get("keyword");
    const category = request.nextUrl.searchParams.get("category");
    const limit = parseInt(request.nextUrl.searchParams.get("limit")?? "10");
    const page = parseInt(request.nextUrl.searchParams.get("page")?? "1");

    const query: Query = {
        skip: limit * (page - 1),
        take: limit
    };
    if(!!keyword){
        query.where = {
            OR: [
                { title: { contains: keyword, mode: 'insensitive'}},
                { author: { contains: keyword, mode: 'insensitive'}},
                { publisher: { contains: keyword, mode: 'insensitive'}},
            ]
        }
    }

    if(!!category){
        query.where = {
            ...query.where,
            categories: {
                some: {
                    categoryId: category
                }
            }
        }
    }

    if(include == "category"){
        query.include = {
            categories: {
                include: {
                    category: true
                }
            }
        }
        if(!!category){
            query.include.categories!.where = {
                categoryId: category
            }
        }
    }
    
    const [books, count] = await prisma.$transaction([prisma.book.findMany(query), ...(!!request.nextUrl.searchParams.get("count") ? [prisma.book.count()] : []) ]);
    return NextResponse.json({ data: books, count })
}

export async function POST(request: Request){
    try {
        const { cover, title, author, publisher, stock, published_at, categories } = await request.json() as Payload;
        const transaction = await prisma.$transaction(async(tx)=>{
            const book = await tx.book.create({
                data: {
                    cover,
                    title,
                    author,
                    publisher,
                    stock,
                    published_at: new Date(published_at)
                }
            });
            const bookCategory = await tx.bookCategory.createMany({ data: categories.map(c => {
                return {
                    bookId: book.id,
                    categoryId: c
                }
            })});

            return {
                book,
                bookCategory
            }
        })

        return NextResponse.json({ message: "created", detail: transaction.book})
    } catch (e){
        NextResponse.json({ message: "Failed to create"}, { status: 503 })
    }
}