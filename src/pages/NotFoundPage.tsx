// src/pages/NotFoundPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center px-4 pt-20">
      <SearchX className="text-sky-300 mb-6" size={80} strokeWidth={1.5} />
      <h1 className="text-5xl md:text-6xl font-extrabold text-slate-800">404</h1>
      <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-slate-700">Halaman Tidak Ditemukan</h2>
      <p className="mt-4 max-w-md text-slate-500">
        Maaf, halaman yang Anda cari tidak ada atau mungkin telah dipindahkan.
      </p>
      <Link
        to="/"
        className="mt-8 inline-block px-8 py-3 bg-sky-500 text-white font-bold rounded-lg shadow-lg hover:bg-sky-600 transition-colors"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}