"use client"
import Link from "next/link"
import Image from "next/image"
import Books from "@/components/books"
import { debounce } from "lodash";
import { FormEvent, useCallback, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import type { Book, Category } from "@prisma/client";

interface ExtBook extends Omit<Book, "published_at"> {

}

export default function Book(){
    const session = useSession();
    const [keyword, setKeyword] = useState("")
    const [category, setCategory] = useState("")

    const [book, setBook] = useState<ExtBook[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const fetchBooks = () => fetch(`/api/book?${category.length > 0 ? "category=" + category + "&" : ""}${keyword.length > 0 ? "keyword=" + keyword + "&" : ""}`).then( async res => {
        if (res.status == 200){
            const json = (await res.json()).data as ExtBook[];
            setBook(json);
        }
    });

    const fetchCategories = () => fetch("/api/category").then(async(res)=>{
        if (res.status == 200){
            const json = (await res.json()).data as Category[];
            setCategories(json)
        }
    })

    useEffect(()=>{
        fetchCategories();
    }, []);
    
    useEffect(()=>{
        fetchBooks();
    }, [keyword, category]);

    const debouncedHandleSearch = useCallback(debounce(setKeyword, 1000), []);
    return (
        <div className="container mx-auto pt-10 pb-16 px-2">
            <div className="flex w full justify-between mb-5">
                <div className="flex items-center gap-1">
                    <div className="form-control">
                        <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" onChange={(e: FormEvent<HTMLInputElement>)=>debouncedHandleSearch(e.currentTarget.value)}/>
                    </div>
                    <div className="">
                        <div className="dropdown">
                            <div className="dropdown">
                                <div tabIndex={0} role="button" className="btn m-1">{category.length > 0 ? categories.find(v => v.id == category)!.name : "Pilih Kategori" }</div>
                                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                    <li>
                                        <button onClick={()=>setCategory("")}>Pilih Kategori</button>
                                    </li>
                                    {categories.map((category, index) => (
                                        <li key={"c-"+index}>
                                            <button onClick={()=>setCategory(category.id)}>{category.name}</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {session.data && ["admin", "operator"].includes(session.data?.user.role) ? (
                    <Link href="/book/add" className="btn btn-primary">Tambahkan buku</Link>
                ) : (<></>)}
            </div>
            <div className="flex flex-wrap gap-2 w-full">
                {book.map((d, i) => (
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
                {book.length == 0 ? (
                    <p className="text-center text-lg">Tidak ada buku</p>
                ) : (<></>)}
            </div>
        </div>
    )
}