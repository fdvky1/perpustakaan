"use client";

import Link from "next/link";
import Image from "next/image"
import { useEffect, useState } from "react";
import type { Book, Category } from "@prisma/client";

interface ExtBook extends Omit<Book, "published_at"> {

}

export default function Books({ category, keyword } : { category: string, keyword: string}){
    const [data, setData] = useState<ExtBook[]>([]);
    const fetchBooks = () => fetch(`/api/book?${category.length > 0 ? "category=" + category + "&" : ""}${category.length > 0 ? "keyword=" + keyword + "&" : ""}`).then( async res => {
        if (res.status == 200){
            const json = (await res.json()).data as ExtBook[];
            setData(json);
        }
    });

    useEffect(()=>{
        fetchBooks();
    }, []);

    return (
        <div className="flex flex-wrap gap-2 w-full justify-center">
            {data.map((d, i) => (
                <Link href={"/book/" + d.id} key={i}>
                    <div className="card card-compact w-44 bg-base-100 shadow-xl h-64">
                        <figure className="relative h-44">
                            <Image
                                alt={d.title}
                                src={d.cover || "https://placehold.co/200x200?text=Foto%20Sampul"}
                                fill={true}
                                style={{ objectFit: "cover" }}
                            />
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title text-ellipsis whitespace-nowrap overflow-x-hidden">{d.title}</h2>
                            <p className="m-0">{d.author}</p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}