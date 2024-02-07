"use client";

import { useEffect, useState } from "react";
import { Borrow } from "@prisma/client";

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
    useEffect(()=> {
        fetch("/api/borrow").then(async res => {
            if (res.status == 200){
                const json = await res.json();;
                setBorrows(json.data  as ExtBorrow[])
            }
        })
    }, [])
    return (
        <div className="container mx-auto">
            <div className="space-y-2">
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Tanggal Peminjaman</th>
                                <th>Judul Buku</th>
                                <th>Jumlah dipinjam</th>
                                <th>Tanggal dikembalikan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrows.map((c, i) => (
                                <tr className="bg-base-200" key={i}>
                                    <th>{new Date(c.borrowed_at).toLocaleDateString()}</th>
                                    <td>{c.book.title}</td>
                                    <td>{c.amount} Buku</td>
                                    <td>{c.returned_at ? new Date(c.returned_at).toLocaleDateString() : "-"}</td>
                                </tr> 
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}