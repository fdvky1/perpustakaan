"use client";

// import Books from "@/components/books";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function AdminDashboard(){
    const session = useSession();
    // console.log(session.data?.user)
    const [stats, setStats] = useState({
        usersTotal: 0,
        operatorTotal: 0,
        booksTotal: 0,
    })
    const fetchStats = () => fetch("/api/stats").then(async res => {
        if (res.status === 200) {
            const json = await res.json();
            setStats(json.data)
        }
    })

    useEffect(()=>{
        if (session.data && ["user", "admin"].includes(session.data?.user.role)){
            fetchStats();
        }
    }, [session])
    return (
        <main>
            <div className="container mx-auto pt-10 pb-16 px-2">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    <div className="stats shadow">
                        <div className="stat">
                            <div className="stat-figure dark:text-slate-300 text-primary">
                                <i className="ri-user-line ri-xl ri-fw"></i>
                            </div>
                            <div className="stat-title dark:text-slate-300">Pengguna</div>
                            <div className="stat-value dark:text-slate-300 text-primary">{stats.usersTotal}</div>
                        </div>
                    </div>
                    <div className="stats shadow">
                        <div className="stat">
                            <div className="stat-figure dark:text-slate-300 text-primary">
                                <i className="ri-user-settings-line ri-xl ri-fw"></i>
                            </div>
                            <div className="stat-title dark:text-slate-300">Petugas</div>
                            <div className="stat-value dark:text-slate-300 text-primary">{stats.operatorTotal}</div>
                        </div>
                    </div>
                    <div className="stats shadow">
                        <div className="stat">
                            <div className="stat-figure dark:text-slate-300 text-primary">
                                <i className="ri-book-2-line ri-xl ri-fw"></i>
                            </div>
                            <div className="stat-title dark:text-slate-300">Total Judul Buku</div>
                            <div className="stat-value dark:text-slate-300 text-primary">{stats.booksTotal}</div>
                            {/* <div className="stat-desc  font-bold text-green-700 dark:text-green-300">↗︎ 2300 (22%)</div> */}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}