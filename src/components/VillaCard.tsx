// src/components/VillaCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, BedDouble, Home, Maximize, Camera, ArrowRight } from 'lucide-react';
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
  Tersedia: 'bg-green-600 text-white shadow shadow-green-900/30',
  Promo: 'bg-amber-500 text-white shadow shadow-amber-900/30',
  'Sold Out': 'bg-slate-700 text-slate-200 shadow shadow-slate-900/30',
};

const DetailItem = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) => (
  <div className="text-center">
    <div className="inline-block text-sky-600 bg-sky-100 p-1.5 rounded-full">
      {icon}
    </div>
    <p className="mt-1 font-bold text-slate-800 text-sm">{value}</p>
    <p className="text-xs text-slate-500">{label}</p>
  </div>
);

export default function VillaCard({ villa }: VillaCardProps) {
  const details = [
    { icon: <BedDouble size={18} />, value: villa.tipe_villa, label: 'Tipe Villa' },
    { icon: <Home size={18} />, value: villa.luas_bangunan ? `${villa.luas_bangunan} m²` : 'N/A', label: 'Bangunan' },
    { icon: <Maximize size={18} />, value: villa.luas_tanah ? `${villa.luas_tanah} m²` : 'N/A', label: 'Tanah' },
  ];

  const imageUrl =
    villa.foto_urls?.[0] ||
    'https://via.placeholder.com/600x400?text=Haspro+Villa';

  return (
    <Link
      to={`/listing/${villa.slug}`}
      className="bg-white border border-slate-200/80 rounded-2xl shadow-md shadow-slate-300/30 overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      {/* Gambar */}
      <div className="relative overflow-hidden">
        <div className="aspect-video">
          <img
            src={`${imageUrl}?w=500&auto=format`}
            srcSet={`${imageUrl}?w=500&auto=format 500w, ${imageUrl}?w=800&auto=format 800w`}
            sizes="(max-width: 640px) 500px, 800px"
            alt={`Foto utama untuk ${villa.nama_listing}`}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            loading="lazy"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Status */}
        <div
          className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1.5 rounded-full ${statusStyles[villa.status]}`}
        >
          {villa.status}
        </div>

        {/* Jumlah Foto */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 text-xs bg-black/60 text-white px-2 py-1 rounded-lg backdrop-blur-sm">
          <Camera size={14} />
          <span>{villa.foto_urls?.length || 0}</span>
        </div>
      </div>

      {/* Konten */}
      <div className="p-4 flex-grow flex flex-col">
        <div>
          <h3
            className="text-base md:text-lg font-bold text-slate-800 mb-1 truncate group-hover:text-sky-600 transition-colors"
            title={villa.nama_listing}
          >
            {villa.nama_listing}
          </h3>
          <div className="flex items-center gap-1 text-slate-500 text-xs md:text-sm mb-3">
            <MapPin size={14} className="flex-shrink-0" />
            <span className="truncate">{villa.alamat_lengkap}</span>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-xs text-slate-500">Harga Mulai</p>
          <p className="text-lg md:text-xl font-extrabold text-sky-600">
            {formatHarga(villa.harga)}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 my-2 border-t border-b border-slate-200 py-3">
          {details.map((detail) => (
            <DetailItem key={detail.label} {...detail} />
          ))}
        </div>

        <div className="mt-auto pt-3">
          <div className="flex items-center justify-center gap-2 w-full text-center bg-sky-50 text-sky-700 font-bold py-2.5 rounded-lg group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
            <span>Lihat Detail</span>
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
