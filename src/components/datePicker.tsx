"use client"
import { debounce } from "lodash";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";

export default function DatePicker(){
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    let now = new Date();
    const [firstDay, setFirstDay] = useState((new Date(now.getFullYear(), now.getMonth(), 2).toISOString().split('T')[0]));
    const [lastDay, setLastDay] = useState((new Date(now.getFullYear(), now.getMonth()+1).toISOString().split('T')[0]));


    useEffect(()=>{
        const params = new URLSearchParams(searchParams)
        params.set("from", firstDay);
        params.set("to", lastDay);
        replace(`${pathname}?${params.toString()}`);
    }, [firstDay, lastDay])
    return (
        <div className="flex gap-1 items-center">
            <input className="input input-bordered join-item" id="date-start" placeholder="Pilih rentang wakty" type="date" value={firstDay} onChange={(e: FormEvent<HTMLDataElement>) => setFirstDay(e.currentTarget.value)}/>
            <span className="text-gray-600">Sampai</span>
            <input className="input input-bordered join-item" id="date-end" placeholder="Pilih rentang wakty" type="date" value={lastDay} onChange={(e: FormEvent<HTMLDataElement>) => setLastDay(e.currentTarget.value)}/>
        </div>
    )
}