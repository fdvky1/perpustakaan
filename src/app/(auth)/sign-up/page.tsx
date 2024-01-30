'use client';

import Link from 'next/link';
import { FormEvent } from 'react';
import useToastStore from '@/store/useToastStore';
import { useRouter } from 'next/navigation';

export default function SignUpPage(){
    const router = useRouter();
    const { setMessage } = useToastStore();

    const register = async (e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        if(formData.get('password') != formData.get('confirm_password')) return setMessage("Konfirmasi kata sandi tidak sama!", "error");

        fetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password'),
                address: formData.get('address'),
            })
        }).then((res)=>{
            if (res.status == 200) return router.push('/sign-in')
            setMessage(res.status == 409 ? "Alamat surel telah digunakan" : "Terjadi kesalahan, mohon hubungi Admin!", "error");
        })
    }
    return (
        <div className="card shrink-0 w-full max-w-sm lg:max-w-md shadow-2xl bg-base-100">
            <form className="card-body" onSubmit={register}>
                <h1 className="text-3xl font-bold text-center">Daftar</h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Nama Anda</span>
                        </label>
                        <input type="text" placeholder="John Doe" className="input input-bordered" required name="name" />
                    </div>
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
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Konfirmasi Kata Sandi</span>
                        </label>
                        <input type="password" className="input input-bordered" required name="confirm_password" />
                    </div>
                    <div className="form-control lg:col-span-2">
                        <label className="label">
                            <span className="label-text">Alamat Anda</span>
                        </label>
                        <textarea className="textarea textarea-bordered" name="address"></textarea>
                    </div>
                </div>
                <div className="form-control mt-6">
                    <button className="btn btn-primary">Daftar</button>
                </div>
                <div className='mt-3 text-sm'>
                    <span className='mr-1'>Sudah memiliki akun?</span>
                    <Link href="/sign-in" className='text-blue-500 hover:underline'>Masuk</Link>
                </div>
            </form>
        </div>
    )
}