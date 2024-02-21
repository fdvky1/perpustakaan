"use client";

import useToastStore from "@/store/useToastStore";
import React, { FormEvent, useEffect, useState } from "react";

interface UserInfo {
    name: string;
    email: string;
    address: string;
    password: string;
    confirmPassword: string;
}

export default function Profile(){

    const [data, setData] = useState<UserInfo>({
        name: "",
        email: "",
        address: "",
        password: "",
        confirmPassword: "",
    });

    const { setMessage } = useToastStore();
    const fetchProfile = () => fetch("/api/auth/profile").then(async res => {
        if (res.status == 200){
            setData({...data, ...((await res.json()).data)})
        }
    })

    useEffect(()=> {
        fetchProfile();
    }, []);

    const updateProfile = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(data.password.length > 0 && data.password != data.confirmPassword) return setMessage("Konfirmasi Sandi tidak sama", "error")
        fetch('/api/auth/profile', {
            method: 'PUT',
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                address: data.address,
                ...(data.password.length > 0 ? { password: data.password } : {})
            }),
        }).then((res)=>{
            if(res.status == 200){
                fetchProfile()
                setMessage("Data Anda telah diperbarui", "success")
            } else {
                setMessage("Gagal memperbarui data Anda", "success")
            }
        })
    }
    return (
        <div className="container mx-auto px-2 pt-16 pb-10">
            <div className="w-full min-h-[calc(100dvh-6.5ren)] grid place-items-center">
                <div className="card bg-base-100 shadow-xl">
                    <form className="card-body" onSubmit={updateProfile}>
                        <h1 className="text-3xl font-bold text-center mb-2">Profil</h1>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Nama Anda</span>
                                </label>
                                <input type="text" className="input input-bordered" required name="name" value={data.name} onChange={(e: FormEvent<HTMLInputElement>) => setData({...data, name: e.currentTarget.value})} />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Alamat Surel</span>
                                </label>
                                <input type="email" className="input input-bordered" required name="email" value={data.email} onChange={(e: FormEvent<HTMLInputElement>) => setData({...data, email: e.currentTarget.value})}/>
                            </div>
                            <div className="form-control lg:col-span-2">
                                <label className="label">
                                    <span className="label-text">Alamat Anda</span>
                                </label>
                                <textarea className="textarea textarea-bordered" name="address" value={data.address} onChange={(e: FormEvent<HTMLTextAreaElement>) => setData({...data, address: e.currentTarget.value})}></textarea>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Kata Sandi <span className="">*Isi jika ingin mengubah sandi</span></span>
                                </label>
                                <input type="password" className="input input-bordered" placeholder="*****" name="password" value={data.password} onChange={(e: FormEvent<HTMLInputElement>) => setData({...data, password: e.currentTarget.value})} />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Konfirmasi Kata Sandi</span>
                                </label>
                                <input type="password" className="input input-bordered" required={data.password.length > 0} placeholder="*****" name="confirm_password" value={data.confirmPassword} onChange={(e: FormEvent<HTMLInputElement>) => setData({...data, confirmPassword: e.currentTarget.value})} />
                            </div>
                        </div>
                        <div className="w-full flex justify-end">
                            <button className="btn btn-primary" type="submit">Simpan</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}