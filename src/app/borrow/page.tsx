"use client";

import { FormEvent, useEffect, useState } from "react";
import { Borrow } from "@prisma/client";
import useToastStore from "@/store/useToastStore";

interface ExtBorrow extends Omit<Borrow, "borrowed_at" | "returned_at"> {
    borrowed_at: string;
    returned_at: string;
    book: {
        id: string;
        title: string;
    }
}
export default function Borrow(){
    const [borrows, setBorrows] = useState<ExtBorrow[]>([]);
    const [modal, setModal] = useState<{action: "return" | "", status: boolean, selected?: string, input?: string}>({
        action: "",
        status: false,
        selected: "",
        input: "",
    });
    
    const { setMessage } = useToastStore();

    const fetchBook = () => fetch("/api/borrow").then(async res => {
        if (res.status == 200){
            const json = await res.json();;
            setBorrows(json.data  as ExtBorrow[])
        }
    });

    useEffect(()=> {
        fetchBook();    
    }, []);
    const resetModal = ()=> setModal({ action: "", status: false, input: "", selected: ""});

    const returnBook = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetch("/api/borrow/"+modal.selected, {
            method: "PUT"
        }).then(async res => {
            if (res.status == 200){
                resetModal();
                fetchBook();
                setMessage("Berhasil mengembalikan buku", "success");
            } else {
                setMessage("Terjadi kesalahan saat mengembalikan buku", "error");
            }
        })
    }
    return (
        <div className="container mx-auto px-2 pt-10 pb-16">
            <input type="checkbox" id="my_modal_1" className="modal-toggle" checked={modal.status} readOnly />
            <div id="my_modal_1" className="modal" role="dialog">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-3">{modal.action == "return" ? "Anda yakin?" : ""}</h3>
                    <form className="w-full" onSubmit={modal.action == "return" ? returnBook : (()=>{}) } id="create-form">
                        {modal.action == "return" ? (
                            <p>Anda akan mengembalikan buku {borrows.find(v => v.id == modal.selected)?.book.title}</p>
                        ):(
                            <></>
                            // <label className="form-control w-full">
                            //     <div className="label">
                            //         <span className="label-text mb-1">Nama kategori</span>
                            //     </div>
                            //     <input type="text" name="name" value={modal.input} onChange={((e: FormEvent<HTMLInputElement>) => setModal({...modal, input: e.currentTarget.value}))} className="input input-bordered w-full" />
                            // </label>
                        )}
                    </form>
                    <div className="modal-action">
                        <button className="btn" onClick={resetModal}>Batalkan</button>
                        <button className={"btn "+ (modal.action == "return" ? "btn-error" : "btn-primary")} type="submit" form="create-form">{modal.action == "return" ? "Kembalikan" : ""}</button>
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Tanggal Peminjaman</th>
                                <th>Judul Buku</th>
                                <th>Jumlah dipinjam</th>
                                <th>Tanggal dikembalikan</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrows.map((b, i) => (
                                <tr className="bg-base-200" key={i}>
                                    <th>{new Date(b.borrowed_at).toLocaleDateString()}</th>
                                    <td>{b.book.title}</td>
                                    <td>{b.amount} Buku</td>
                                    <td>{b.returned_at ? new Date(b.returned_at).toLocaleDateString() : "-"}</td>
                                    {!b.returned_at ? (
                                        <td><button type="button" className="btn btn-primary py-0.5" onClick={(()=> setModal({ action: "return", status: true, selected: b.id}))}><i className="ri-check-line ri-xl text-white"></i></button></td>
                                    ) : null}
                                </tr> 
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}