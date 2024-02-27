"use client";

import { debounce } from "lodash";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useCallback } from "react";

export default function Search(){

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const handleSearch = (keyword: string) => {
        const params = new URLSearchParams(searchParams)
        if (keyword.length > 0){
            params.set("keyword", keyword)
        }else{
            params.delete("keyword")
        }
        replace(`${pathname}?${params.toString()}`);
    }

    const debouncedHandleSearch = useCallback(debounce(handleSearch, 1000), []);

    return (
        <div className="form-control w-[67%] sm:max-w-[15rem] sm:w-full">
            <input type="text" placeholder="Search" className="input input-bordered md:w-auto" onChange={(e: FormEvent<HTMLInputElement>)=>debouncedHandleSearch(e.currentTarget.value)} defaultValue={searchParams.get('keyword')?.toString()}/>
        </div>
    )
}