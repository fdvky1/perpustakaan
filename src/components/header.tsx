"use client";

import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Header(){
    const pathname = usePathname();
    const session = useSession();
    // const [logoutModal, setLogoutModal] = useState<boolean>(false);

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
            <div className="navbar bg-base-100">
                <div className="flex-none">
                    <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </label>
                </div>
                <div className="flex-1">
                    <a className="btn btn-ghost text-xl">Perpustakaan</a>
                </div>
                <div className="flex-none">
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
                                <label htmlFor="modal_logout">Keluar</label>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
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
        </>
    )
}