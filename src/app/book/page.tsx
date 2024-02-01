import Link from "next/link"
import Books from "@/components/books"

export default function Book(){
    return (
        <div className="container mx-auto pt-10 pb-16 px-2">
            <div className="flex w full justify-between mb-5">
                <div className="form-control">
                    <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
                </div>
                <Link href="/book/add" className="btn btn-primary">Tambahkan buku</Link>
            </div>
            <Books/>
        </div>
    )
}