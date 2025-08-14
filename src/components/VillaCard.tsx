// src/components/VillaCard.tsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, BedDouble, Camera, ArrowRight, Waves, TrendingUp, PercentCircle, Building } from 'lucide-react';
import { formatHarga } from '../utils/idr';

// Interface diperbarui untuk mencakup semua data baru
interface Villa {
  id: string;
  slug: string;
  nama_listing: string;
  alamat_lengkap: string;
  harga: number;
  harga_promo?: number;
  status: 'Tersedia' | 'Promo' | 'Sold Out';
  foto_urls: string[];
  tipe_villa: string;
  memiliki_private_pool?: boolean;
  perkiraan_passive_income?: number;
}

interface VillaCardProps {
  villa: Villa;
}

const statusStyles = {
  Tersedia: 'bg-green-600 text-white shadow shadow-green-900/30',
  Promo: 'bg-amber-500 text-white shadow shadow-amber-900/30',
  'Sold Out': 'bg-slate-700 text-slate-200 shadow shadow-slate-900/30',
};

// ✨ Komponen DetailItem di-memo-kan untuk optimasi performa
const DetailItem = React.memo(({ icon, value, label, isHighlighted = false }: { icon: React.ReactNode; value: string; label: string; isHighlighted?: boolean; }) => (
  <div className="text-center">
    <div className={`inline-block p-1.5 rounded-full ${isHighlighted ? 'bg-amber-100 text-amber-600' : 'bg-sky-100/70 text-sky-600'}`}>
      {icon}
    </div>
    <p className="mt-1 font-bold text-slate-800 text-sm truncate" title={value}>{value}</p>
    <p className="text-xs text-slate-500">{label}</p>
  </div>
));
// Menambahkan display name untuk mempermudah debugging
DetailItem.displayName = 'DetailItem';

export default function VillaCard({ villa }: VillaCardProps) {
  // ✨ Logika promo dan detail dioptimalkan dengan `useMemo`
  // Kalkulasi ini hanya akan berjalan jika data `villa` berubah.
  const { isPromo, discountPercent, details } = useMemo(() => {
    const promo = villa.harga_promo && villa.harga_promo > 0 && villa.harga_promo < villa.harga;
    const discount = promo ? Math.round(((villa.harga - villa.harga_promo!) / villa.harga) * 100) : 0;
    
    // Logika diperbaiki untuk memastikan selalu ada 3 item untuk grid yang konsisten
    const detailItems = [
      { icon: <Building size={18} />, value: villa.tipe_villa, label: 'Tipe Villa' },
      { icon: <Waves size={18} className={villa.memiliki_private_pool ? 'text-sky-600' : 'text-slate-300'} />, value: villa.memiliki_private_pool ? 'Ada' : 'Tidak', label: 'Private Pool' },
      { icon: <TrendingUp size={18} />, value: villa.perkiraan_passive_income ? `~${formatHarga(villa.perkiraan_passive_income).replace('Rp ', '')}/bln` : 'N/A', label: 'Potensi Income', isHighlighted: true }
    ];

    return { isPromo: promo, discountPercent: discount, details: detailItems };
  }, [villa]);

  const imageUrl = villa.foto_urls?.[0] || 'https://via.placeholder.com/600x400?text=Haspro+Villa';

  return (
    <Link
      to={`/listing/${villa.slug}`}
      className="bg-white h-full border border-slate-200/80 rounded-2xl shadow-lg shadow-slate-300/40 overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
    >
      <div className="relative overflow-hidden">
        {/* ✨ Diberi background agar tidak ada 'lompatan' saat gambar dimuat */}
        <div className="aspect-video bg-slate-100">
          <img
            src={`${imageUrl}?w=500&auto=format`}
            alt={`Foto utama untuk ${villa.nama_listing}`}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            loading="lazy"
            // ✨ Atribut width & height untuk mencegah layout shift (CLS)
            width="500"
            height="281"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {isPromo && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 text-xs bg-red-600 text-white px-3 py-1.5 rounded-full font-bold shadow-lg">
            <PercentCircle size={14} />
            <span>Diskon {discountPercent}%</span>
          </div>
        )}
        
        <div className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1.5 rounded-full ${statusStyles[villa.status]}`}>
          {villa.status}
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 text-xs bg-black/60 text-white px-2 py-1 rounded-lg backdrop-blur-sm">
          <Camera size={14} />
          <span>{villa.foto_urls?.length || 0}</span>
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-base md:text-lg font-bold text-slate-800 mb-1 truncate group-hover:text-sky-600 transition-colors" title={villa.nama_listing}>
          {villa.nama_listing}
        </h3>
        <div className="flex items-center gap-1 text-slate-500 text-xs md:text-sm mb-4">
          <MapPin size={14} className="flex-shrink-0" />
          <span className="truncate">{villa.alamat_lengkap}</span>
        </div>
        
        <div className="mb-4 h-12">
          {isPromo ? (
            <div>
              <p className="text-xl md:text-2xl font-extrabold text-red-600">
                {formatHarga(villa.harga_promo!)}
              </p>
              <p className="text-sm text-slate-400 line-through">
                {formatHarga(villa.harga)}
              </p>
            </div>
          ) : (
            <div>
               <p className="text-xs text-slate-500">Harga Mulai</p>
               <p className="text-xl md:text-2xl font-extrabold text-sky-600">
                {formatHarga(villa.harga)}
              </p>
            </div>
          )}
        </div>
        
        {/* ✨ Grid kolom sekarang permanen 3 kolom */}
        <div className="grid grid-cols-3 gap-3 my-2 border-t border-slate-200 py-4">
          {details.map((detail) => ( <DetailItem key={detail.label} {...detail} /> ))}
        </div>
        
        <div className="mt-auto pt-2">
          <div className="flex items-center justify-center gap-2 w-full text-center bg-sky-50 text-sky-700 font-bold py-3 rounded-lg group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
            <span>Lihat Detail</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}