"use client"
import useToastStore from "@/store/useToastStore";
import { Role, User } from "@prisma/client"
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react"

interface ExtUser extends Omit<User, "password"|"id"|"deleted_at">{
    id?: string;
    password?: string
}

export default function User(){
    const router = useRouter();
    const [user, setUser] = useState<ExtUser[]>([]);
    const [modal, setModal] = useState<{action: "create" | "delete" | "update", status: boolean, selected?: string, input?: ExtUser}>({
        action: "create",
        status: false,
        selected: "",
        input: {
            id: "",
            name: "",
            role: "user",
            email: "",
            address: "",
            password: "",
        },
    });
    const { setMessage } = useToastStore();
    const resetModal = ()=> setModal({ action: "create", status: false, selected: "", input: { id: "", name: "", role: "user", email: "", address: "", password: ""}});

    const fetchUsers = () => fetch("/api/user").then(async res => {
        // if(res.status !== 200) return router.push("/dashboard");
        setUser((await res.json()).data as ExtUser[]);
    });

    useEffect(()=> {
        fetchUsers()
    }, []);

    const createUser = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetch("/api/user", {
            method: "POST",
            body: JSON.stringify(modal.input)
        }).then(res => {
            resetModal();
            if (res.status == 200){
                setMessage("Berhasil menambahkan pengguna baru", "success")
            } else {
                setMessage("Gagal menambahkan pengguna baru", "error")
            }
            fetchUsers();
        })
    }

    const deleteUser = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetch("/api/user/"+modal.selected!, {
            method: "DELETE"
        }).then(res => {
            resetModal();
            if (res.status == 200){
                setMessage("Berhasil menghapus data pengguna", "success")
            } else {
                setMessage("Gagal menghapus data pengguna", "error")
            }
            fetchUsers();
        })
    }

    const updateUser = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetch("/api/user/"+modal.selected!, {
            method: "PUT",
            body: JSON.stringify(modal.input)
        }).then(res => {
            resetModal();
            if (res.status == 200){
                setMessage("Berhasil memperbarui data pengguna", "success")
            } else {
                setMessage("Gagal memperbarui data pengguna", "error")
            }
            fetchUsers();
        })
    }

    return (
        <div className="container mx-auto px-2 pt-10 pb-16">
            <input type="checkbox" id="my_modal_1" className="modal-toggle" checked={modal.status} readOnly />
            <div id="my_modal_1" className="modal" role="dialog">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-3">{modal.action == "delete" ? "Anda yakin?" : modal.action == "create" ? "Daftarkan pengguna baru" : "Perbarui data pengguna"}</h3>
                    <form className="w-full" onSubmit={modal.action == "delete" ? deleteUser : modal.action == "create" ? createUser : updateUser } id="create-form">
                        {modal.action == "delete" ? (
                            <p>Anda akan menghapus pengguna {user.find(v => v.id == modal.selected)?.name}</p>
                        ):(
                            // <></>
                            <div className="w-full grid lg:grid-cols-2 gap-2">
                                <label className="form-control w-full">
                                    <div className="label">
                                        <span className="label-text mb-1">Nama Pengguna</span>
                                    </div>
                                    <input type="text" name="name" value={modal.input?.name} onChange={((e: FormEvent<HTMLInputElement>) => setModal({...modal, input: { ...modal.input!, name: e.currentTarget.value}}))} className="input input-bordered w-full" />
                                </label>
                                <label className="form-control w-full">
                                    <div className="label">
                                        <span className="label-text mb-1">Alamat surel</span>
                                    </div>
                                    <input type="email" name="email" value={modal.input?.email} onChange={((e: FormEvent<HTMLInputElement>) => setModal({...modal, input: { ...modal.input!, email: e.currentTarget.value}}))} className="input input-bordered w-full" />
                                </label>
                                <label className="form-control w-full">
                                    <div className="label">
                                        <span className="label-text mb-1">Peran</span>
                                    </div>
                                    <select className="select select-bordered w-full" name="role" id="role" value={modal.input?.role} onChange={((e: FormEvent<HTMLSelectElement>)=> setModal({...modal, input: { ...modal.input!, role: e.currentTarget.value as Role}}))}>
                                        <option value="user">Pengguna</option>
                                        <option value="operator">Petugas</option>
                                        <option value="admin">Administrator</option>
                                    </select>
                                </label>
                                <label className="form-control w-full">
                                    <div className="label">
                                        <span className="label-text mb-1">Kata Sandi</span>
                                    </div>
                                    <input type="password" name="password" value={modal.input?.password} onChange={((e: FormEvent<HTMLInputElement>) => setModal({...modal, input: { ...modal.input!, password: e.currentTarget.value}}))} className="input input-bordered w-full" />
                                </label>
                                <label className="form-control w-full lg:col-span-2">
                                    <div className="label">
                                        <span className="label-text mb-1">Alamat</span>
                                    </div>
                                    <textarea name="password" value={modal.input?.address} onChange={((e: FormEvent<HTMLTextAreaElement>) => setModal({...modal, input: { ...modal.input!, address: e.currentTarget.value}}))} className="textarea textarea-bordered w-full" ></textarea>
                                </label>
                            </div>
                        )}
                    </form>
                    <div className="modal-action">
                        <button className="btn" onClick={resetModal}>Batalkan</button>
                        <button className={"btn "+ (modal.action == "delete" ? "btn-error" : "btn-primary")} type="submit" form="create-form">{modal.action == "delete" ? "Hapus" : modal.action == "create" ? "Simpan" : "Perbarui"}</button>
                    </div>
                </div>
            </div>
            <div className="w-full flex justify-end">
                <button onClick={(()=>setModal({ action: "create", status: true, selected: "", input: { id: "", name: "", role: "user", email: "", address: "", password: ""}}))} className="btn">Tambahkan pengguna</button>
            </div>
            <div className="space-y-2">
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr className="text-center">
                                <th>Nama</th>
                                <th>Peran</th>
                                <th>Surel</th>
                                <th>Alamat</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user.map((b, i) => (
                                <tr className="bg-base-200 text-center" key={i}>
                                    <th>{b.name}</th>
                                    <td className="capitalize">{b.role}</td>
                                    <td>{b.email}</td>
                                    <td>{b.address}</td>
                                    <td className="flex gap-1.5 w-full justify-center">
                                        <button type="button" className="btn btn-primary" onClick={()=> setModal({ action: "update", status: true, selected: b.id, input: { ...b, password: ""}})}>
                                            <i className="ri-pencil-line ri-xl ri-fw"></i>
                                        </button>
                                        <button type="button" className="btn btn-error" onClick={()=> setModal({ action: "delete", status: true, selected: b.id, input: { ...b, password: ""}})}>
                                            <i className="ri-delete-bin-2-line ri-xl ri-fw"></i>
                                        </button>
                                    </td>
                                </tr> 
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}