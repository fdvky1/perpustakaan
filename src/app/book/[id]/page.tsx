"use client";

import Link from "next/link";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import useToastStore from "@/store/useToastStore";
import type { Book, Borrow, Category } from "@prisma/client";
import "yet-another-react-lightbox/styles.css";

interface ExtBook extends Omit<Book, "published_at"> {
    published_at: string;
    categories: {
        category: Category
    }[]
}

export default function BookDetail({ params }: { params: { id: string }}){
    const router = useRouter();
    const session = useSession();

    const { setMessage } = useToastStore();
    const [book, setBook] = useState<ExtBook>();
    const [open, setOpen] = useState<boolean>(false);
    const [modal, setModal] = useState<{ action: "borrow" | "success_borrow", status: boolean, code?: string, input: { amount: number, returnSchedule: string }}>({ action: "borrow", status: false, input: { amount: 1, returnSchedule: new Date().toISOString().split('T')[0] }});
    // const resetModal = ()=> setModal({ action: "borrow", status: false, code: "", input: { amount: 1, returnSchedule: new Date().toISOString().split('T')[0]}});

    useEffect(()=> {
        fetch("/api/book/"+params.id).then(async res => {
            if (res.status == 200){
                const json = await res.json();
                setBook(json.data);
            }
        })
    }, [params]);

    const deleteBook = () => {
        fetch("/api/book/" + book?.id, {
            method: "DELETE",
        }).then(res => {
            if (res.status != 200) return setMessage("Gagal menghapus buku", "error");
            router.push("/book");
        })
    }

    const borrowBook = () => fetch("/api/borrow/", {
        method: "POST",
        body: JSON.stringify({
            bookId: params.id,
            amount: modal.input.amount,
            return_schedule: modal.input.returnSchedule
        })
    }).then(async(res) => {
        if (res.status != 200) return setMessage("Terjadi kesalahaan saat meminjam buku", "error");
        const json = (await res.json()).detail as Borrow;
        setMessage("Buku berhasil dipinjam", "success");
        setModal({ action: "success_borrow", status: true, code: json.code, input: { amount: 1, returnSchedule: new Date().toISOString().split('T')[0]}});
        // router.push("/borrow")
    })
    return (
        <div className="container mx-auto pt-10 pb-16 px-2">
            {session.data?.user.role == "user" ? (
                <>
                <input type="checkbox" id="borrowModal" className="modal-toggle" checked={modal.status} onChange={((e: FormEvent<HTMLInputElement>) => setModal({...modal, status: e.currentTarget.checked}))}/>
                <div className="modal" role="dialog">.
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">{modal.action == "borrow" ? "Anda yakin?" : "Pemberitahuan!"}</h3>
                        <p className="mt-2 mb-1 text-sm">{modal.action == "borrow" ? `Anda akan meminjam buku ini sebanyak ${modal.input.amount} Buku!` : `Peminjaman Anda sedang diproses! Anda dapat menunjukan kode ${modal.code} kepada petugas`}</p>
                        {modal.action == "borrow" ? (
                            <label className="form-control w-full">
                                <div className="label">
                                    <span className="label-text mb-1">Tentukan tanggal pengembalian</span>
                                </div>
                                <input type="date" name="return_schedule" min={new Date().toISOString().split('T')[0]} max={new Date((new Date()).getTime() + (1000 * 60 * 60 * 24 * 7)).toISOString().split('T')[0]} value={modal.input.returnSchedule} onChange={((e: FormEvent<HTMLDataElement>) => setModal({...modal, input:{ ...modal.input, returnSchedule: e.currentTarget.value}}))} className="input input-bordered w-full" />
                            </label>
                        ):(<></>)}
                        <div className="modal-action">
                            <label htmlFor="borrowModal" className="btn">Batalkan</label>
                            {modal.action == "borrow" ? (
                                <button className="btn btn-primary" onClick={borrowBook}>Pinjam</button>
                            ): (
                                <Link href={"/borrow?keyword=" + modal.code} className="btn btn-primary">Lihat status</Link>
                            )}
                        </div>
                    </div>
                </div>
                </>
            ) : (
                <>
                <input type="checkbox" id="deleteModal" className="modal-toggle" readOnly/>
                <div className="modal" role="dialog">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Anda yakin?</h3>
                        <p className="py-4">Buku akan dihapus secara permanen!</p>
                        <div className="modal-action">
                            <label htmlFor="deleteModal" className="btn">Batalkan</label>
                            <button className="btn btn-error" onClick={deleteBook}>Hapus</button>
                        </div>
                    </div>
                </div>
                </>
            )}
            { book && book.cover ? (
                <Lightbox
                    open={open}
                    close={() => setOpen(false)}
                    slides={[
                        { src: book.cover },
                    ]}
                    controller={{closeOnBackdropClick: true, closeOnPullDown: true}}
                    render={{
                        buttonNext: ()=> null,
                        buttonPrev: ()=> null,
                    }}
                    plugins={[Zoom]}
                    zoom={{
                        scrollToZoom: true,
                    }}
                />
            ) : null }

            
            <h1 className="font-bold text-2xl mb-5">Informasi Buku</h1>
            <div className="w-full space-y-3 md:space-y-0 md:flex gap-2 justify-center bg-base-100 rounded-lg overflow-hidden pb-4 md:pb-0">
                <div className="w-full h-[16rem] md:h-[24rem] 2xl:h-[28rem] md:max-w-[24rem] 2xl:max-w-[28rem] mb-1.5 md:mb-0 relative bg-neutral-200">
                    {book ? (
                        <Image
                            src={book.cover || "https://placehold.co/200x200?text=Foto%20Sampul"}
                            fill={true}
                            alt="Foto sampul buku"
                            style={{objectFit:"contain"}}
                            onClick={(() => book.cover ? setOpen(true) : null)}
                        />
                        ) : (
                        <div className="skeleton rounded-none w-full h-full"></div>
                    )}
                </div>
                <div className="w-full p-4 flex flex-col justify-between gap-7">
                    <div>
                        { book ? (
                            <h2 className="text-3xl font-semibold">{book.title}</h2>
                        ):(
                            <div className="skeleton h-10 w-full"></div>
                        )}
                        <div className="w-full overflow-x-auto mt-3 md:mt-6">
                            <table>
                                <tbody>
                                    <tr>
                                        <th className="text-left pr-4">Penulis</th>
                                        <td>{book ? book.author : (<div className="skeleton h-4 w-28"></div>)}</td>
                                    </tr>
                                    <tr>
                                        <th className="text-left pr-4">Penerbit</th>
                                        <td>{book ? book.publisher : (<div className="skeleton h-4 w-28"></div>)}</td>
                                    </tr>
                                    <tr>
                                        <th className="text-left pr-4">Tanggal terbit</th>
                                        <td>{book ? new Date(book.published_at as string).toLocaleDateString() : (<div className="skeleton h-4 w-28"></div>)}</td>
                                    </tr>
                                    <tr>
                                        <th className="text-left pr-4">Jumlah ketersediaan</th>
                                        <td>{book ? book.stock + " Buku" : (<div className="skeleton h-4 w-28"></div>)}</td>
                                    </tr>
                                    <tr>
                                        <th className="text-left pr-4">Kategori</th>
                                        <td>
                                            <div className="flex flex-wrap gap-1">
                                                { book ? book.categories.map((c, i) => (
                                                    <div className="badge badge-info gap-2" key={i}>
                                                        <span className="text-white">{c.category.name}</span>
                                                    </div>
                                                ))
                                                : (
                                                    <>
                                                    <div className="skeleton h-4 w-16"></div>
                                                    <div className="skeleton h-4 w-16"></div>
                                                    </>   
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="flex gap-1.5 w-full flex-wrap">
                        {session.data && session.data.user.role != "user" ? (
                            <>
                            <Link href={book?.id + "/edit"} className="btn btn-neutral">Perbarui Buku</Link>
                            <label htmlFor="deleteModal" className="btn btn-error">Hapus Buku</label>
                            </>
                        ) : (
                            <div className="flex gap-1">
                                 {/* <input type="number" name="amount" id="amount" min={1} max={book?.stock||0} className="input input-bordered max-w-[6rem]" value={modal.input.amount} onChange={((e: FormEvent<HTMLInputElement>) => setModal({...modal, input: {...modal.input, amount: parseInt(e.currentTarget.value)}}))}/> */}
                                 <label htmlFor="borrowModal" className="btn btn-primary">Pinjam Buku</label>
                             </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}