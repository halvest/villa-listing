// src/components/VillaCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, BedDouble, Home, Maximize, Camera } from 'lucide-react';
import { formatHarga } from '../utils/idr';

interface Villa {
  id: string;
  slug: string;
  nama_listing: string;
  alamat_lengkap: string;
  harga: number;
  status: 'Tersedia' | 'Promo' | 'Sold Out';
  foto_urls: string[];
  tipe_villa: string;
  luas_bangunan?: number;
  luas_tanah?: number;
  fasilitas?: string[];
}

interface VillaCardProps {
  villa: Villa;
}

const statusStyles = {
  Tersedia: 'bg-green-100 text-green-700 ring-green-600/20',
  Promo: 'bg-amber-100 text-amber-700 ring-amber-600/20',
  'Sold Out': 'bg-red-100 text-red-700 ring-red-600/20',
};

export default function VillaCard({ villa }: VillaCardProps) {
  return (
    <Link
      to={`/listing/${villa.slug}`}
      className="bg-white border border-slate-200 rounded-2xl shadow-lg shadow-slate-200/50 overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
    >
      {/* BAGIAN GAMBAR */}
      <div className="relative">
        <div className="aspect-video">
          <img
            src={villa.foto_urls?.[0] || 'https://via.placeholder.com/600x400'}
            alt={villa.nama_listing}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute bottom-0 left-0 p-4 text-white">
          <p className="text-2xl font-bold drop-shadow">{formatHarga(villa.harga)}</p>
        </div>

        <div className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full ring-4 ${statusStyles[villa.status]}`}>
          {villa.status}
        </div>

        <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs bg-black/50 text-white px-2 py-1 rounded-md backdrop-blur-sm">
          <Camera size={14} />
          <span>{villa.foto_urls?.length || 0} Foto</span>
        </div>
      </div>

      {/* BAGIAN KONTEN */}
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-slate-900 mb-1 truncate" title={villa.nama_listing}>
          {villa.nama_listing}
        </h3>
        <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
          <MapPin size={16} className="flex-shrink-0" />
          <span className="truncate">{villa.alamat_lengkap}</span>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-200 flex items-center gap-x-4 gap-y-2 flex-wrap text-sm text-slate-700">
          <div className="flex items-center gap-2" title="Tipe Villa">
            <BedDouble size={18} className="text-slate-500" />
            <span className="font-semibold">{villa.tipe_villa}</span>
          </div>
          <div className="flex items-center gap-2" title="Luas Bangunan">
            <Home size={18} className="text-slate-500" />
            <span className="font-semibold">{villa.luas_bangunan || '-'}</span> m²
          </div>
          <div className="flex items-center gap-2" title="Luas Tanah">
            <Maximize size={18} className="text-slate-500" />
            <span className="font-semibold">{villa.luas_tanah || '-'}</span> m²
          </div>
        </div>
      </div>
    </Link>
  );
}
