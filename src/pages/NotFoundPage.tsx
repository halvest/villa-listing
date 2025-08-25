// src/pages/NotFoundPage.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SearchX, Home, Building } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function NotFoundPage() {
  const navigate = useNavigate();

  // Fungsi untuk menangani scroll ke section 'contact'
  const handleScrollToContact = () => {
    navigate('/', { state: { scrollToSection: 'contact' } });
  };

  return (
    <>
      <Helmet>
        <title>404: Halaman Tidak Ditemukan | Haspro Villa</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-slate-50 text-center px-4">
        <div className="py-20">
          <SearchX className="text-sky-300 mb-6" size={80} strokeWidth={1.5} />
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-800">404</h1>
          <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-slate-700">Halaman Tidak Ditemukan</h2>
          <p className="mt-4 max-w-md text-slate-500">
            Maaf, halaman yang Anda cari tidak ada atau mungkin telah dipindahkan.
          </p>
          <Link
            to="/"
            className="mt-8 inline-block px-8 py-3 bg-sky-600 text-white font-bold rounded-lg shadow-lg hover:bg-sky-700 transition-transform transform hover:scale-105"
          >
            Kembali ke Beranda
          </Link>

          <div className="mt-12 text-center">
            <p className="text-sm text-slate-500 mb-4">Atau, mungkin Anda mencari:</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/listings" className="text-sky-600 font-semibold hover:underline flex items-center justify-center gap-2">
                    <Building size={16} /> Lihat Semua Villa
                </Link>
                <button onClick={handleScrollToContact} className="text-sky-600 font-semibold hover:underline flex items-center justify-center gap-2">
                    <Home size={16} /> Simulasi Profit
                </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}