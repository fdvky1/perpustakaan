"use client"
import { FormEvent, useEffect, useState } from "react"
import type { Category } from "@prisma/client";
import useToastStore from "@/store/useToastStore";
import Search from "@/components/search";
import Pagination from "@/components/pagination";

export default function CategoryPage({
    searchParams
}: {
    searchParams?: {
        keyword?: string;
        page?: string;
    }
}){
    const keyword = searchParams?.keyword || ""
    const page = searchParams?.page || "1"
    const [count, setCount] = useState<number|null>(null);
    const [modal, setModal] = useState<{action: "create" | "update" | "delete" | "", status: boolean, selected?: string, input?: string}>({
        action: "",
        status: false,
        input: "",
        selected: ""
    });

    const [categories, setCategories] = useState<Category[]>([]);
    const { setMessage } = useToastStore();

    const resetModal = ()=> setModal({ action: "", status: false, input: "", selected: ""});

    const fetchCategory = () => fetch(`/api/category?limit=10&${page.length > 0 ? "page=" + page + "&" : ""}${!count ? "count=true&" : ""}${keyword.length > 0 ? "keyword=" + keyword + "&" : ""}`).then(async res => {
        const json = await res.json();
        setCategories(json.data);
        if(!count && json.count){
            setCount(json.count)
        }
    })

    useEffect(()=>{
        fetchCategory();    
    }, [keyword, page]);

    const create = async (e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        fetch('/api/category', {
            method: 'POST',
            body: JSON.stringify({
                name: modal.input
            })
        }).then((res)=>{
            if (res.status === 200) {
                fetchCategory();
                resetModal();
                setMessage("Berhasil menambahkan kategori", "success");
            } else setMessage("Terjadi kesalahan, pastikan kategori belum ada!", "error");
        })
    }

    const update = async (e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        fetch('/api/category/' + modal.selected, {
            method: 'PUT',
            body: JSON.stringify({
                name: modal.input
            })
        }).then((res)=>{
            if (res.status === 200) {
                fetchCategory();
                resetModal();
                setMessage("Berhasil mengubah nama kategori", "success");
            } else setMessage("Terjadi kesalahan saat mengubah kategori!", "error");
        })
    }

    const deleteCategory = async (e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        fetch('/api/category/'+modal.selected, {
            method: 'DELETE'
        }).then((res)=>{
            if (res.status === 200) {
                fetchCategory();
                resetModal();
                setMessage("Kategori berhasil dihapus!", "success");
            } else setMessage("Terjadi kesalahan saat menghapus kategori!", "error");
        })
    }

    return (
        <div className="container mx-auto px-2 pt-10 pb-16">
            <input type="checkbox" id="my_modal_1" className="modal-toggle" checked={modal.status} readOnly />
            <div id="my_modal_1" className="modal" role="dialog">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-3">{modal.action == "create" ? "Buat kategori baru" : modal.action == "delete" ? "Hapus kategori" : modal.action == "update" ? "Perbarui kategori" : ""}</h3>
                    <form className="w-full" onSubmit={modal.action == "delete" ? deleteCategory : modal.action == "update" ? update : create} id="create-form">
                        {modal.action == "delete" ? (
                            <p>Kategori akan dihapus secara permanen</p>
                        ):(
                            <label className="form-control w-full">
                                <div className="label">
                                    <span className="label-text mb-1">Nama kategori</span>
                                </div>
                                <input type="text" name="name" value={modal.input} onChange={((e: FormEvent<HTMLInputElement>) => setModal({...modal, input: e.currentTarget.value}))} className="input input-bordered w-full" />
                            </label>
                        )}
                    </form>
                    <div className="modal-action">
                        <button className="btn" onClick={resetModal}>Batalkan</button>
                        <button className={"btn "+ (modal.action == "delete" ? "btn-error" : "btn-primary")} type="submit" form="create-form">{modal.action == "delete" ? "Hapus" : "Simpan"}</button>
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                <div className="w-full flex justify-between">
                    <Search/>
                    <button onClick={(()=>setModal({ action: "create", status: true, input: "", selected: ""}))} className="btn">Tambahkan kategori</button>
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
                                    <td className="flex gap-1">
                                        <button className="btn btn-error py-0.5" onClick={(()=> setModal({ action: "delete", status: true, selected: c.id, input: "" }))}>
                                            <i className="ri-delete-bin-7-line ri-xl text-white"></i>
                                        </button>
                                        <button className="btn btn-primary py-0.5" onClick={(()=> setModal({ action: "update", status: true, selected: c.id, input: c.name }))}>
                                            <i className="ri-pencil-line ri-xl text-white"></i>
                                        </button>
                                    </td>
                                </tr> 
                            ))}
                            {categories.length == 0 ? (
                                <tr className="w-full text-center">
                                    <td colSpan={3}>
                                        Tidak ada data
                                    </td>
                                </tr>
                            ): null}
                        </tbody>
                    </table>
                    {categories.length > 0 ? (
                        <Pagination pages={(count?? 10)/10}/>
                    ): null}
                </div>
            </div>
        </div>
    )
}