"use client";

import Image from 'next/image'
import useToastStore from "@/store/useToastStore";
import { UploadButton } from "@/utils/uploadthing";
import { useRouter } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";
import type { Book, Category } from "@prisma/client";

interface ExtBook extends Omit<Book, "published_at"> {
    published_at: string;
    categories: {
        category: Category
    }[]
}

export default function AddBook({ params} : { params: { id: string }}){
    const router = useRouter();
    const { setMessage } = useToastStore();
    const [categories, setCateories] = useState<{ id: String, name: string}[]>([]);
    const [isReady, setReady] = useState<boolean>(true);
    const [book, setBook] = useState<ExtBook>({
        id: "",
        title: "",
        cover: "",
        author: "",
        stock: 0,
        publisher: "",
        published_at: "",
        categories: []
    });

    useEffect(()=> {
        fetch("/api/category").then(async res => {
            if (res.status == 200) {
                const json = await res.json();
                setCateories(json.data)
            }
        }).then(()=>{
            fetch("/api/book/"+params.id).then(async res => {
                if (res.status == 200){
                    const data = (await res.json()).data as ExtBook;
                    setBook({
                        ...data,
                        published_at: new Date(data.published_at).toISOString().split('T')[0]
                    });
                }
            })
        })
    }, [params]);

    const updateBook = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        fetch("/api/book/"+params.id, {
            method: "PUT",
            body: JSON.stringify({
                ...book,
                categories: book.categories.map(v => v.category.id)
            })
        }).then(res => {
            if (res.status == 200){
                // e.currentTarget.reset();
                router.push("/book")
            } else {
                setMessage("Gagal menambahkan buku, pastikan judul buku belum tersedia!", "error")
            }
        })
    }

    
    return (
        <div className="container md:mx-auto flex justify-center pt-10 pb-16 px-1.5 md:px-2">
            <div className="w-full">
                <h1 className="text-2xl font-semibold mt-2 mb-6">Perbarui Buku</h1>
                <form className="md:flex gap-2 w-full" onSubmit={updateBook}>
                    <div className="md:max-w-[16rem]">
                        <div className="mb-2">
                            <div className="w-full rounded-lg overflow-hidden h-[16rem] md:w-[16rem] mb-1.5 relative bg-neutral-200">
                                <Image
                                    src={book?.cover || "https://placehold.co/200x200/e5e5e5/fff?text=Foto%20Sampul"}
                                    fill={true}
                                    alt="Foto sampul buku"
                                    style={{objectFit:"contain"}}
                                />
                            </div>
                            <UploadButton
                                endpoint="imageUploader"
                                config={{appendOnPaste: true, mode: "auto"}}
                                appearance={{allowedContent: "hidden" ,button: "w-full content-['Pilih\_Sampul'] btn btn-primary bg-primary outline-none border-none"}}
                                onUploadBegin={()=> {
                                    setReady(false);
                                    setMessage("Mulai mengunggah foto sampul buku", "info");
                                }}
                                onClientUploadComplete={(res) => {
                                    // Do something with the response
                                    // console.log("Files: ", res);
                                    // alert("Upload Completed");
                                    setBook({...book, cover: res[0].url});
                                    setMessage("Sampul buku telah diunggah", "success");
                                    setReady(true);
                                }}
                                onUploadError={(error: Error) => {
                                    // Do something with the error.
                                    // alert(`ERROR! ${error.message}`);
                                    setMessage("Terjadi kesalahan saat mengunggah sampul buku", "error")
                                }}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-1.5 w-full">
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Judul buku</span>
                            </div>
                            <input type="text" name="title" value={book.title} onChange={((e: FormEvent<HTMLInputElement>) => setBook({...book, title: e.currentTarget.value}))} className="input input-bordered w-full" />
                        </label>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Penulis</span>
                            </div>
                            <input type="text" name="author" className="input input-bordered w-full" value={book.author} onChange={((e: FormEvent<HTMLInputElement>) => setBook({...book, author: e.currentTarget.value}))}/>
                        </label>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Kategori</span>
                            </div>
                            <select className="select select-bordered" defaultValue="" onChange={((e: FormEvent<HTMLSelectElement>)=> {
                                if(!book.categories.find(c => c.category.id == e.currentTarget.value)) setBook({...book, categories: [...book.categories, { category: { id: e.currentTarget.value, name: ""}}]});
                                return e.currentTarget.value = "";
                            })}>
                                <option disabled value="">Pilih kategori</option>
                                {categories.map((c, i) => (
                                    <option value={c.id as string} key={i}>{c.name}</option>
                                ))}
                            </select>
                        </label>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Jumlah Ketersediaan</span>
                            </div>
                            <input type="number" name="stock" className="input input-bordered w-full" value={book.stock} onChange={((e: FormEvent<HTMLInputElement>) => setBook({...book, stock: parseInt(e.currentTarget.value)}))}/>
                        </label>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Penerbit</span>
                            </div>
                            <input type="text" name="publisher" className="input input-bordered w-full" value={book.publisher} onChange={((e: FormEvent<HTMLInputElement>) => setBook({...book, publisher: e.currentTarget.value}))} />
                        </label>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Tanggal Terbit</span>
                            </div>
                            <input type="date" name="published_at" className="input input-bordered w-full" value={book.published_at} onChange={((e: FormEvent<HTMLInputElement>) => setBook({...book, published_at: e.currentTarget.value}))}/>
                        </label>
                        <div className="md:col-span-2 mt-1.5 w-full flex justify-end">
                            <button type="submit" className="btn btn-primary " disabled={!isReady}>Simpan</button>
                        </div>
                    </div>
                </form>
                <div className="flex flex-wrap w-full gap-1">{book.categories.map((c, i) => (
                    <div className="badge badge-info gap-2" key={i}>
                        <div onClick={(()=>setBook({...book, categories: [...book.categories.filter(v => v.category.id != c.category.id)]}))} className="text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </div>
                        <span className="text-white">{categories.find(v => v.id == c.category.id)!.name}</span>
                    </div>
                ))}</div>
            </div>
        </div>
    )
}
