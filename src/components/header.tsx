"use client";

import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FormEvent, useEffect } from 'react';
import useThemeStore from '@/store/useThemeStore';

export default function Header(){
    const pathname = usePathname();
    const session = useSession();
    const { theme, setTheme } = useThemeStore();
    
    useEffect(() => {
        window.localStorage.setItem('theme', theme);
        document.querySelector('html')?.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(()=>{
        const local = window.localStorage.getItem('theme');
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        setTheme(local ? (isDark? "dark" : "light") : (local as "light"|"dark"));
    }, [])
    return ["/sign-in", "/sign-up"].includes(pathname) ? (<></>) : (
        <>
            {/* Put this part before </body> tag */}
            <input type="checkbox" id="modal_logout" className="modal-toggle" readOnly/>
            <div className="modal" role="dialog">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Peringatan!</h3>
                    <p className="py-4">Apakah Anda yakin akan keluar?</p>
                    <div className="modal-action">
                        <label htmlFor="modal_logout" className="btn">Batalkan</label>
                        <button type="button" className="btn btn-error" onClick={(()=> signOut({redirect: true, callbackUrl: "/login"}))}>Keluar</button>
                    </div>
                </div>
            </div>
            <div className="navbar bg-base-100 gap-1.5">
                <div className="flex-none">
                    <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </label>
                </div>
                <div className="flex-1">
                    <a className="btn btn-ghost text-xl">Perpustakaan</a>
                </div>
                <div>
                    <label className="swap swap-rotate">
            
                        {/* this hidden checkbox controls the state */}
                        <input type="checkbox" onChange={() => setTheme(theme == "light" ? "dark" : "light")} checked={theme == "dark"}/>
                        
                        {/* sun icon */}
                        <svg className="swap-on fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>
                        
                        {/* moon icon */}
                        <svg className="swap-off fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/></svg>
                        
                    </label>
                </div>
                {session.data?.user ?
                    (
                    <div className="flex-none">
                        <div className="flex gap-1">
                            <div className="flex flex-col">
                                <span className="">{session.data?.user.name}</span>
                                <span className="text-xs ml-auto">{session.data?.user.role == "admin" ? "Administrator" : session.data?.user.role == "operator" ? "Petugas" : "Pengguna"}</span>
                            </div>
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                    <div className="avatar placeholder">
                                        <div className="bg-neutral text-neutral-content rounded-full w-8">
                                            <span className="text-xs">{session.data?.user.name?.split(" ").map(v => v.charAt(0)).join("").toUpperCase()}</span>
                                        </div>
                                    </div>
                                </div>
                                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                                    {/* <li>
                                        <Link href="/profile" className="justify-between">
                                            Profile
                                            <span className="badge">New</span>
                                        </Link>
                                    </li> */}
                                    <li>
                                        <Link href="/profile">Profil</Link>
                                    </li>
                                    <li>
                                        <label htmlFor="modal_logout">Keluar</label>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    ) : (<></>)
                }
                </div>
            {session.data?.user ? (
                <div className="drawer">
                    <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-side z-[999]">
                        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                        <ul className="menu pt-[5rem] px-4 w-[calc(90dvw-5rem)] sm:w-full max-w-80 min-h-full bg-base-200 text-base-content space-y-2">
                        {/* Sidebar content here */}
                            <li><Link href="/dashboard">Dashboard</Link></li>
                            {session.data ? session.data.user.role == "user" ? (
                                <li>
                                    <Link href="/borrow">Peminjaman</Link>
                                </li>
                                ) : (
                                <li>
                                    <span>Kelola</span>
                                    <ul className="menu px-4 min-h-full bg-base-200 text-base-content space-y-1">
                                        <li><Link href="/category">Kategori</Link></li>
                                        <li><Link href="/book">Buku</Link></li>
                                        <li><Link href="/borrow">Peminjaman</Link></li>
                                        { session.data.user.role == "admin" ? (
                                            <li><Link href="/user">Pengguna</Link></li>
                                        ) : (<></>)}
                                    </ul>
                                </li> 
                                )
                            : null}
                        </ul>
                    </div>
                </div>
            ) : (<></>)}
        </>
    )
}