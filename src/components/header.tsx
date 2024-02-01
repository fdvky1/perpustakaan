"use client";
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Header(){
    const pathname = usePathname()
    return ["/sign-in", "/sign-up"].includes(pathname) ? (<></>) : (
        <>
            <div className="navbar bg-base-100">
                <div className="flex-none">
                    <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </label>
                </div>
                <div className="flex-1">
                    <a className="btn btn-ghost text-xl">Perpustakaan</a>
                </div>
                {/* <div className="flex-none">
                    <button className="btn btn-square btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
                    </button>
                </div> */}
            </div>
            <div className="drawer">
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-side z-[999]">
                    <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu pt-[5rem] px-4 w-80 min-h-full bg-base-200 text-base-content space-y-2">
                    {/* Sidebar content here */}
                        <li><Link href="/dashboard">Dashboard</Link></li>
                        <li>
                            <span>Kelola</span>
                            <ul className="menu px-4 min-h-full bg-base-200 text-base-content space-y-1">
                                <li><Link href="/category">Kategori</Link></li>
                                <li><Link href="/book">Buku</Link></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}