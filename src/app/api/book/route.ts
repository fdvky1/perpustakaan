import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
interface Payload {
    cover?: string | "";
    title: string;
    author: string;
    publisher: string;
    published_at: string;
    categories: string[];
}

type SearchCondition = {
    contains: string;
    mode?: 'insensitive';
};

interface Query {
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


    const query: Query = {};
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
    
    const books = await prisma.book.findMany(query);
    return NextResponse.json({ data: books })
}

export async function POST(request: Request){
    try {
        const { cover, title, author, publisher, published_at, categories } = await request.json() as Payload;
        const transaction = await prisma.$transaction(async()=>{
            const book = await prisma.book.create({
                data: {
                    cover,
                    title,
                    author,
                    publisher,
                    published_at: new Date(published_at)
                }
            });
            const bookCategory = await prisma.bookCategory.createMany({ data: categories.map(c => {
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