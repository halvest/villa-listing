// src/components/FeaturedListings.tsx
import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import VillaCard from './VillaCard';
import { ArrowRight } from 'lucide-react';

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

const VillaCardSkeleton = () => (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-4 animate-pulse">
        <div className="aspect-video bg-slate-200 rounded-lg mb-4"></div>
        <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
        <div className="h-10 bg-slate-200 rounded-lg w-full"></div>
    </div>
);

export default function FeaturedListings() {
  const [villas, setVillas] = useState<Villa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedVillas = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('villa_listings')
          .select('id, slug, nama_listing, alamat_lengkap, harga, harga_promo, status, foto_urls, tipe_villa, memiliki_private_pool, perkiraan_passive_income')
          .in('status', ['Tersedia', 'Promo'])
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        setVillas(data as Villa[]);
      } catch (error) {
        console.error('Error fetching featured villas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedVillas();
  }, []);

  return (
    <section id="listings" className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-sky-700">
            Villa Unggulan untuk Investasi Anda
          </h2>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed">
            Berikut adalah pilihan <strong>properti villa</strong> terbaik yang tersedia saat ini. Setiap unit telah kami pilih berdasarkan <strong>lokasi strategis</strong>, desain premium, dan <strong>potensi keuntungan</strong> yang menjanjikan sebagai aset <strong>investasi villa</strong> Anda di Yogyakarta.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {loading
            ? Array.from({ length: 3 }).map((_, i) => ( <VillaCardSkeleton key={i} /> ))
            : villas.map((villa) => ( <VillaCard key={villa.id} villa={villa} /> ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 px-8 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-lg shadow-sky-500/30 hover:bg-sky-700 focus:ring-4 focus:ring-sky-300 transition-transform transform hover:scale-105"
          >
            Lihat Semua Unit Villa <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}