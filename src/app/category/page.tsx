"use client"
import useToastStore from "@/store/useToastStore";
import { FormEvent, useEffect, useState } from "react"
import type { Category } from "@prisma/client";

export default function CategoryPage(){
    const [isOpen, setModal] = useState<boolean>(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [input, setInput] = useState<string>("");
    const { setMessage } = useToastStore();

    const fetchCategory = () => fetch("/api/category").then(async res => {
        const json = await res.json();
        setCategories(json.data);
    })

    useEffect(()=>{
        fetchCategory();    
    }, []);

    const create = async (e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        fetch('/api/category', {
            method: 'POST',
            body: JSON.stringify({
                name: input
            })
        }).then((res)=>{
            if (res.status === 200) {
                fetchCategory();
                setInput("");
                setModal(false)
                setMessage("Berhasil menambahkan kategori", "success");
            } else setMessage("Terjadi kesalahan, pastikan kategori belum ada!", "error");
        })
    }

    return (
        <div className="container mx-auto pt-10 pb-16">
            <input type="checkbox" id="my_modal_1" className="modal-toggle" checked={isOpen} onChange={(()=> setModal(!isOpen))} />
            <div id="my_modal_1" className="modal" role="dialog">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-3">Buat kategori baru</h3>
                    <form className="w-full" onSubmit={create} id="create-form">
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text mb-1">Nama kategori</span>
                            </div>
                            <input type="text" name="name" value={input} onChange={((e: FormEvent<HTMLInputElement>) => setInput(e.currentTarget.value))} className="input input-bordered w-full" />
                        </label>
                    </form>
                    <div className="modal-action">
                        <label htmlFor="my_modal_1" className="btn">Batalkan</label>
                        <button className="btn btn-primary" type="submit" form="create-form">Simpan</button>
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                <div className="w-full flex justify-end">
                    <label htmlFor="my_modal_1" className="btn">Tambahkan kategori</label>
                </div>
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Nama Kategori</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((c, i) => (
                                <tr className="bg-base-200" key={i}>
                                    <th>{i+1}</th>
                                    <td>{c.name}</td>
                                    <td>
                                        <button className="btn btn-error py-0.5">
                                            <i className="ri-delete-bin-7-line ri-xl text-white"></i>
                                        </button>
                                    </td>
                                </tr> 
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}