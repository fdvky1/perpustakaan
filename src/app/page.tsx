import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <div>
      <div className="hero min-h-screen bg-no-repeat" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1669421629091-46de0bd2ab7b?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)'}}>
        <div className="hero-overlay bg-opacity-70"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-lg">
            <h1 className="mb-5 text-5xl font-bold">Perpustakaan Digital</h1>
            <p className="mb-5">Dapatkan kemudahan dalam mengelola peminjaman buku</p>
            <Link className="btn btn-primary" href="/dashboard">Mulai</Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-2 py-4 my-10">
        <h2 className="text-5xl font-bold text-center capitalize mb-5">Fitur</h2>
        <div className="grid lg:grid-cols-2 w-full gap-2">
          <div className="card w-full bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl capitalize">
                <i className="ri-edit-2-line"></i> Lorem ipsum dolor sit.</h2>
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea minima illo facilis, ut error nesciunt.</p>
            </div>
          </div>
          <div className="card w-full bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl capitalize">
                <i className="ri-edit-2-line"></i> Lorem ipsum dolor sit.</h2>
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea minima illo facilis, ut error nesciunt.</p>
            </div>
          </div>
          <div className="card w-full bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl capitalize">
                <i className="ri-edit-2-line"></i> Lorem ipsum dolor sit.</h2>
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea minima illo facilis, ut error nesciunt.</p>
            </div>
          </div>
          <div className="card w-full bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl capitalize">
                <i className="ri-edit-2-line"></i> Lorem ipsum dolor sit.</h2>
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea minima illo facilis, ut error nesciunt.</p>
            </div>
          </div>
          </div>
        </div>
    </div>
  );
}
