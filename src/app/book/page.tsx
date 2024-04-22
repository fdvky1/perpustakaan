"use client"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import type { Book, Category } from "@prisma/client";
import Search from "@/components/search";
import Pagination from "@/components/pagination";

interface ExtBook extends Omit<Book, "published_at"> {

}

export default function Book({
    searchParams
}: {
    searchParams?: {
        keyword?: string;
        page?: string;
    }
}){
    const keyword = searchParams?.keyword || ""
    const session = useSession();
    const [category, setCategory] = useState("")

    const page = searchParams?.page || "1"
    const [count, setCount] = useState<number|null>(null);
    const [book, setBook] = useState<ExtBook[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setLoading] = useState(true);

    const fetchBooks = () => {
        setLoading(true)
        fetch(`/api/book?limit=20&${page.length > 0 ? "page=" + page + "&" : ""}${!count ? "count=true&" : ""}${category.length > 0 ? "category=" + category + "&" : ""}${keyword.length > 0 ? "keyword=" + keyword + "&" : ""}`).then( async res => {
            setLoading(false)
           if (res.status == 200){
               const json = (await res.json());
               setBook(json.data as ExtBook[]);
               if(!count && json.count){
                   setCount(json.count)
               }
           }
       });
    }

    const fetchCategories = () => {
        fetch("/api/category").then(async(res)=>{
            if (res.status == 200){
                const json = (await res.json()).data as Category[];
                setCategories(json)
            }
        })
    }

    useEffect(()=>{
        fetchCategories();
    }, []);
    
    useEffect(()=>{
        fetchBooks();
    }, [keyword, category, page]);

    return (
        <div className="container mx-auto pt-10 pb-16 px-2">
            <div className="flex flex-col-reverse md:flex-row w-full gap-2 justify-between mb-5">
                <div className="w-full flex items-center gap-1">
                    <Search/>
                    <div className="dropdown w-1/3 sm:max-w-[15rem] sm:w-full">
                        <div className="dropdown w-full">
                            <div tabIndex={0} role="button" className="btn m-1 w-full">{category.length > 0 ? categories.find(v => v.id == category)!.name : "Pilih Kategori" }</div>
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
                {session.data && ["admin", "operator"].includes(session.data?.user.role) ? (
                    <Link href="/book/add" className="btn btn-primary max-w-44 ml-auto">Tambahkan buku</Link>
                ) : (<></>)}
            </div>
            <div className="flex flex-wrap gap-2 w-full justify-center">
                {!isLoading ?
                    book.map((d, i) => (
                    <Link href={"/book/" + d.id} key={i}>
                        <div className="card card-compact w-40 md:w-44 bg-base-100 shadow-xl h-64">
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
                    ))
                : <></>}
                {isLoading ? <span className="loading loading-dots loading-sm"></span> : book.length == 0 ? <p className="text-center text-lg">Tidak ada buku</p> : <Pagination pages={(count?? 20)/20}/>}
            </div>
        </div>
    )
}