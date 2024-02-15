"use client";

import { FormEvent, useEffect, useState } from "react";
import { Borrow } from "@prisma/client";
import useToastStore from "@/store/useToastStore";
import { useSession } from "next-auth/react";

interface ExtBorrow extends Omit<Borrow, "borrowed_at" | "returned_at" | "return_schedule"> {
    borrowed_at: string;
    returned_at: string;
    return_schedule: string;
    book: {
        id: string;
        title: string;
    }
}
export default function Borrow(){
    const session = useSession();
    const [borrows, setBorrows] = useState<ExtBorrow[]>([]);
    const [modal, setModal] = useState<{action: "return" | "confirmed_borrow" | "confirmed_return" | "confirmed_lost" | "", status: boolean, selected?: string, input?: string}>({
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

    const updateStatus = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetch("/api/borrow/"+modal.selected, {
            method: "PUT",
            body: JSON.stringify({ type: modal.action, ...(modal.input ? { fine: parseInt(modal.input) } : {}) })
        }).then(async res => {
            if (res.status == 200){
                resetModal();
                fetchBook();
                if(modal.action == "confirmed_lost") {
                    setMessage("Berhasil menetapkan status hilang", "success")
                }else{
                    setMessage(`Berhasil ${modal.action == "return" ? "mengembalikan" : modal.action == "confirmed_borrow" ? "mengonfirmasi peminjaman" : "mengonfirmasi pengembalian" } buku`, "success");
                }
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
                    <h3 className="font-bold text-lg mb-3">Anda yakin?</h3>
                    <form className="w-full" onSubmit={updateStatus} id="create-form">
                        {modal.action == "return" ? (
                            <p>Anda akan mengembalikan buku {borrows.find(v => v.id == modal.selected)?.book.title}</p>
                        ):(
                            <>
                                <p className="my-2">{modal.action == "confirmed_borrow" ? "Anda akan mengonfirmasi peminjaman ini" : "Buku akan ditetapkan hilang"}</p>
                                {
                                    modal.action == "confirmed_lost" ? (
                                    <label className="form-control w-full">
                                        <div className="label">
                                            <span className="label-text mb-1">Denda(Rp)</span>
                                        </div>
                                        <input type="number" name="fine" value={modal.input} onChange={((e: FormEvent<HTMLInputElement>) => setModal({...modal, input: e.currentTarget.value}))} className="input input-bordered w-full" />
                                    </label>
                                    ) : null
                                }
                            </>
                        )}
                    </form>
                    <div className="modal-action">
                        <button className="btn" onClick={resetModal}>Batalkan</button>
                        <button className={"btn "+ (["return", "confirmed_lost"].includes(modal.action) ? "btn-error" : "btn-primary")} type="submit" form="create-form">{modal.action == "return" ? "Kembalikan" : "Konfirmasi"}</button>
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr className="text-center">
                                <th>Tanggal Peminjaman</th>
                                <th>Judul Buku</th>
                                <th>Jumlah dipinjam</th>
                                <th>Status</th>
                                <th>Jadwal pengembalian</th>
                                <th>Tanggal dikembalikan</th>
                                <th>Denda</th>
                                <th>{session.data && ["admin", "operator"].includes(session.data?.user.role) ? "Konfirmasi" : "Aksi"}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrows.map((b, i) => (
                                <tr className="bg-base-200 text-center" key={i}>
                                    <th>{new Date(b.borrowed_at).toLocaleDateString()}</th>
                                    <td>{b.book.title}</td>
                                    <td>{b.amount} Buku</td>
                                    <td>{b.status == "pending_borrow" ? "Menunggu konfirmasi peminjaman" : b.status == "pending_return" ? "Menunggu konfirmasi pengembalian" : b.status == "confirmed_borrow" ? "Sedang dipinjam" : b.status == "confirmed_lost" ? "Buku Hilang" : "Telah dikembalikan" }</td>
                                    <td>{new Date(b.return_schedule).toLocaleDateString()}</td>
                                    <td>{b.returned_at ? new Date(b.returned_at).toLocaleDateString() : "-"}</td>
                                    <td>{b.fine}</td>
                                    <td className="flex gap-1.5">
                                        {session.data && ["admin", "operator"].includes(session.data?.user.role) ? (
                                            <>
                                            <button type="button" className="btn btn-primary" disabled={b.status != "pending_borrow"} onClick={(()=> setModal({ action: b.returned_at ? "confirmed_return" : "confirmed_borrow", status: true, selected: b.id}))}>
                                                {b.returned_at ? "Kembali" : "Pinjam"}
                                            </button>
                                            <button type="button" className="btn btn-error" disabled={["confirmed_lost", "pending_borrow"].includes(b.status)} onClick={(()=> setModal({ action: "confirmed_lost", status: true, selected: b.id}))}>
                                                Hilang
                                            </button>
                                            </>
                                        ) : (
                                            <button type="button" className="btn btn-primary" onClick={(()=> setModal({ action: "return", status: true, selected: b.id}))}>
                                                {/* <i className="ri-information-line ri-xl ri-fw"></i> */}
                                                Kembalikan
                                            </button>
                                        )}
                                    </td>
                                    {/* <td><button type="button" disabled={!!b.returned_at} className="btn btn-primary py-0.5" onClick={(()=> setModal({ action: "return", status: true, selected: b.id}))}><i className="ri-check-line ri-xl text-white"></i></button></td> */}
                                </tr> 
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}