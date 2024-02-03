"use client";

import Link from "next/link";
import Image from "next/image"
import { useEffect, useState } from "react";
import type { Book, Category } from "@prisma/client";

interface ExtCategory extends Category {
    books: {
        book: Book
    }[];
}

export default function Books(){
    const [data, setData] = useState<ExtCategory[]>([])
    useEffect(()=>{
        fetch("/api/category?include=book").then( async res => {
            if (res.status == 200){
                const json = await res.json();
                setData(json.data as ExtCategory[]);
            }
        })
    }, []);

    return (
        <div>
            <div>
                {data.map((d, i) => (
                    <div className={"w-full my-3 " + (d.books.length == 0 ? "hidden" : "")} key={i}>
                        <h4 className="text-base font-semibold mb-3">{d.name}</h4>
                        <div className="flex gap-2 w-full overflow-x-auto overflow-y-hidden">
                            {d.books.map((b, _i) => (
                                <Link href={"/book/" + b.book.id} key={i}>
                                    <div className="card card-compact w-44 bg-base-100 shadow-xl">
                                        <figure className="relative h-44">
                                            <Image
                                                alt={b.book.title}
                                                src={b.book.cover || "https://placehold.co/200x200?text=Foto%20Sampul"}
                                                fill={true}
                                                style={{ objectFit: "cover" }}
                                            />
                                        </figure>
                                        <div className="card-body">
                                            <h2 className="card-title text-ellipsis whitespace-nowrap overflow-x-hidden">{b.book.title}</h2>
                                            <p className="m-0">{b.book.author}</p>
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