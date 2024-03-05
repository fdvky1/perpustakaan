"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Pagination({pages}: { pages?: number; }){
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { replace } = useRouter();
    return (
        <div className="w-full flex justify-center py-3">
            <div className="join">
                <button className="join-item btn" disabled={parseInt(searchParams.get("page")?? "1") == 1} onClick={()=> {
                    const params = new URLSearchParams(searchParams)
                    params.set("page", (parseInt(searchParams.get("page")?? "2") - 1).toString())
                    replace(`${pathname}?${params.toString()}`)
                }}>«</button>
                <button className="join-item btn">Page {parseInt(searchParams.get("page")?? "1")}</button>
                <button className="join-item btn" onClick={()=> {
                    const params = new URLSearchParams(searchParams)
                    params.set("page", (parseInt(searchParams.get("page")?? "1") + 1).toString())
                    replace(`${pathname}?${params.toString()}`)
                }} disabled={parseInt(searchParams.get("page")?? "1") >= (pages?? 1)}>»</button>
            </div>
        </div>
    )
}