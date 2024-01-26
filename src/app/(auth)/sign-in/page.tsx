'use client';

import Link from "next/link";
import { signIn } from "next-auth/react"
import { FormEvent } from "react";

export default function SignInPage(){
    const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        signIn('credentials', {
            email: formData.get('email'),
            password: formData.get('password'),
            redirect: true,
            callbackUrl: '/dashboard'
        })
    }

    return (
        <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body" onSubmit={handleSubmit}>
                <h1 className="text-3xl font-bold text-center">Masuk</h1>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Alamat Surel</span>
                    </label>
                    <input type="email" placeholder="name@example.com" className="input input-bordered" required name="email" />
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Kata Sandi</span>
                    </label>
                    <input type="password" className="input input-bordered" required name="password" />
                    <label className="label">
                        <a href="#" className="label-text-alt link link-hover">Lupa Kata Sandi?</a>
                    </label>
                </div>
                <div className="form-control mt-6">
                    <button className="btn btn-primary">Masuk</button>
                </div>
                <div className='mt-3 text-sm'>
                    <span className='mr-1'>Belum memiliki akun?</span>
                    <Link href="/sign-up" className='text-blue-500 hover:underline'>Daftar</Link>
                </div>
            </form>
        </div>
    )
}