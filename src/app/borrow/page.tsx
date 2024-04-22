"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import useToastStore from "@/store/useToastStore";
import Search from "@/components/search";
import type { Borrow } from "@prisma/client";
import Link from "next/link";
import DatePicker from "@/components/datePicker";

interface ExtBorrow extends Omit<Borrow, "borrowed_at" | "returned_at" | "return_schedule"> {
    borrowed_at: string;
    returned_at: string;
    return_schedule: string;
    book: {
        id: string;
        title: string;
    }
    user?: {
        id: string;
        name: string;
    }
}
export default function Borrow({
    searchParams
}: {
    searchParams?: {
        keyword?: string;
        from?: string;
        to?: string;
    }
}){
    let now = new Date();
    const session = useSession();
    const keyword = searchParams?.keyword || "";
    const from = searchParams?.from || new Date(now.getFullYear(), now.getMonth(), 2).toISOString().split('T')[0];
    const to = searchParams?.to || new Date(now.getFullYear(), now.getMonth()+1).toISOString().split('T')[0];

    const [borrows, setBorrows] = useState<ExtBorrow[]>([]);
    const [isLoading, setLoading] = useState(true)
    const [modal, setModal] = useState<{action: "return" | "confirmed_borrow" | "confirmed_return" | "confirmed_lost" | "", status: boolean, selected?: string, input?: string}>({
        action: "",
        status: false,
        selected: "",
        input: "",
    });

    const { setMessage } = useToastStore();

    const fetchBook = () => {
        setLoading(true);
        fetch(`/api/borrow?${keyword.length > 0 ? "keyword=" + keyword + "&" : "from=" + from + "&to=" + to}`).then(async res => {
            setLoading(false)
            if (res.status == 200){
                const json = await res.json();;
                setBorrows(json.data  as ExtBorrow[])
            }
        })
    }

    useEffect(()=> {
        fetchBook();    
    }, [keyword, from, to]);
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
                                <p className="mt-2 mb-1">{modal.action == "confirmed_borrow" ? "Anda akan mengonfirmasi peminjaman buku ini" : modal.action == "confirmed_return" ? "Anda akan mengonfirmasi pengembalian buku ini" : "Buku akan ditetapkan hilang"}</p>
                                {
                                    modal.action == "confirmed_lost" ? (
                                    <label className="form-control w-full">
                                        <div className="label">
                                            <span className="label-text mb-1 text-base">Denda(Rp)</span>
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
                <div className="mb-3 flex flex-wrap justify-between gap-2">
                    <div className="flex gap-0.5 w-full">
                        <Search/>
                        <div className="hidden lg:block mr-auto">
                            <DatePicker/>
                        </div>
                        {["admin", "operator"].includes(session.data?.user.role || "user") ? (
                            <Link href={`/api/borrow?from=${from}&to=${to}&download=1`} className="btn btn-primary">Unduh Laporan</Link>
                        ) : null}
                    </div>
                    <div className="lg:hidden">
                        <DatePicker/>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr className="text-center">
                                <th>Kode Peminjaman</th>
                                {session.data && ["admin", "operator"].includes(session.data?.user.role) ? (
                                    <th>Nama Peminjam</th>
                                ): (
                                    <></>
                                )}
                                <th>Tanggal Peminjaman</th>
                                <th>Judul Buku</th>
                                <th>Jumlah dipinjam</th>
                                <th>Keterangan</th>
                                <th>Jadwal pengembalian</th>
                                <th>Tanggal dikembalikan</th>
                                <th>Denda</th>
                                <th>{session.data && ["admin", "operator"].includes(session.data?.user.role) ? "Konfirmasi" : "Aksi"}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!isLoading ? borrows.map((b, i) => (
                                <tr className="bg-base-200 text-center" key={i}>
                                    <th>{b.code}</th>
                                    {session.data && ["admin", "operator"].includes(session.data?.user.role) ? (
                                        <td>{b.user?.name || "-"}</td>
                                    ): (
                                        <></>
                                    )}
                                    <td>{new Date(b.borrowed_at).toLocaleDateString()}</td>
                                    <td>{b.book.title}</td>
                                    <td>{b.amount} Buku</td>
                                    <td>{b.status == "pending_borrow" ? "Menunggu konfirmasi peminjaman" : b.status == "pending_return" ? "Menunggu konfirmasi pengembalian" : b.status == "confirmed_borrow" ? "Sedang dipinjam" : b.status == "confirmed_lost" ? "Buku Hilang" : "Telah dikembalikan" }</td>
                                    <td>{new Date(b.return_schedule).toLocaleDateString()}</td>
                                    <td>{b.returned_at ? new Date(b.returned_at).toLocaleDateString() : "-"}</td>
                                    <td>{b.fine || "-"}</td>
                                    <td className="flex gap-1.5">
                                        {session.data && ["admin", "operator"].includes(session.data?.user.role) ? (
                                            <>
                                            <button type="button" className="btn btn-primary" disabled={["confirmed_lost"].includes(b.status) || !!b.returned_at} onClick={(()=> setModal({ action: b.status != "pending_borrow" ? "confirmed_return" : "confirmed_borrow", status: true, selected: b.id}))}>
                                                {b.status != "pending_borrow" ? "Kembali" : "Pinjam"}
                                            </button>
                                            <button type="button" className="btn btn-error" disabled={["confirmed_lost", "pending_borrow"].includes(b.status) || !!b.returned_at} onClick={(()=> setModal({ action: "confirmed_lost", status: true, selected: b.id}))}>
                                                Hilang
                                            </button>
                                            </>
                                        ) : (
                                            <button type="button" className="btn btn-primary" onClick={(()=> setModal({ action: "return", status: true, selected: b.id}))} disabled={ b.status != "confirmed_borrow"}>
                                                {/* <i className="ri-information-line ri-xl ri-fw"></i> */}
                                                Kembalikan
                                            </button>
                                        )}
                                    </td>
                                    {/* <td><button type="button" disabled={!!b.returned_at} className="btn btn-primary py-0.5" onClick={(()=> setModal({ action: "return", status: true, selected: b.id}))}><i className="ri-check-line ri-xl text-white"></i></button></td> */}
                                </tr> 
                            )) : <></>}
                            {isLoading ? (
                                <tr className="w-full text-center">
                                    <td colSpan={session.data?.user.role == "user" ? 9 : 10}>
                                        <span className="loading loading-dots loading-sm"></span>
                                    </td>
                                </tr>
                                ) : borrows.length == 0 ? (
                                <tr className="w-full text-center">
                                    <td colSpan={session.data?.user.role == "user" ? 9 : 10}>
                                        Tidak ada data
                                    </td>
                                </tr>
                            ): null}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}