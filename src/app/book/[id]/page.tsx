"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Book, Category } from "@prisma/client";

interface ExtBook extends Book {
    categories: {
        category: Category
    }[]
}

export default function BookDetail(){
    const params = useParams();
    const [book, setBook] = useState<ExtBook>();
    useEffect(()=> {
        fetch("/api/book/"+params.id).then(async res => {
            if (res.status == 200){
                const json = await res.json();
                setBook(json.data);
            }
        })
    }, [params])
    return (
        <div className="container mx-auto pt-10 pb-16 px-2">
            <h1 className="font-bold text-2xl mb-5 md:hidden">Informasi Buku</h1>
            <div className="w-full space-y-3 md:space-y-0 md:flex gap-2 justify-center">
                <div className="w-full rounded-lg overflow-hidden h-[16rem] md:w-[16rem] mb-1.5 relative">
                    <Image
                        src={book?.cover || "https://placehold.co/200x200?text=Foto%20Sampul"}
                        fill={true}
                        alt="Foto sampul buku"
                        style={{objectFit:"cover"}}
                    />
                </div>
                <div>
                    <h2 className="text-2xl font-semibold">{book?.title}</h2>
                    <div className="mt-3 md:mt-6">
                        <p className="text-lg ">Penulis: {book?.author}</p>
                        <p className="text-lg ">Penerbit: {book?.publisher}</p>
                        <div>
                            <p className="text-lg mb-1">Kategori:</p>
                            <div>
                                {book?.categories.map((c, i) => (
                                    <div className="badge badge-info gap-2" key={i}>
                                        <span className="text-white">{c.category.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}