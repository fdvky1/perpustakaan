"use client";

import Link from "next/link";
import Image from "next/image"
import { useEffect, useState } from "react";
import type { Book, Category } from "@prisma/client";

interface ExtCategory extends Category {
    books: Book[];
}

interface ExtBook extends Book {
    categories: {
        category: Category
    }[];
}

export default function Books(){
    const [data, setData] = useState<ExtCategory[]>([])
    useEffect(()=>{
        fetch("/api/book?include=category").then( async res => {
            if (res.status == 200){
                const json = (await res.json()).data as ExtBook[];
                const sorted: ExtCategory[] = [];

                json.forEach(book => {
                    const categories = book.categories.map(entry => entry.category);
                    const first = categories.length > 0 ? categories[0] : null;
                    const existing = sorted.find(v => v.id == (first?.id || "uncategorized"));
                    if (existing){
                        existing.books.push(book);
                    }else if (first){
                        sorted.push({
                            ...first,
                            books: [book]
                        });
                    }else{
                        sorted.push({
                            id: "uncategorized",
                            name: "Tanpa Kategori",
                            books: [book]
                        });
                    }
                });
                setData(sorted);
            }
        })
    }, []);

    return (
        <div>
            <div>
                {data.map((d, i) => (
                    <div className="w-full my-3 " key={i}>
                        <h4 className="text-base font-semibold mb-3">{d.name}</h4>
                        <div className="flex gap-2 w-full overflow-x-auto overflow-y-hidden">
                            {d.books.map((b, _i) => (
                                <Link href={"/book/" + b.id} key={`${i}-${_i}`}>
                                    <div className="card card-compact w-44 bg-base-100 shadow-xl">
                                        <figure className="relative h-44">
                                            <Image
                                                alt={b.title}
                                                src={b.cover || "https://placehold.co/200x200?text=Foto%20Sampul"}
                                                fill={true}
                                                style={{ objectFit: "cover" }}
                                            />
                                        </figure>
                                        <div className="card-body">
                                            <h2 className="card-title text-ellipsis whitespace-nowrap overflow-x-hidden">{b.title}</h2>
                                            <p className="m-0">{b.author}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}