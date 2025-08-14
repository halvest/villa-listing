// src/components/FeaturedListings.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import VillaCard from './VillaCard';
import { ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

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
}

const VillaCardSkeleton = () => (
  <div className="bg-white border border-slate-200 rounded-xl p-3 animate-pulse">
    <div className="aspect-video bg-slate-200 rounded-lg mb-3"></div>
    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
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
          .select('id, slug, nama_listing, alamat_lengkap, harga, status, foto_urls, tipe_villa')
          .in('status', ['Tersedia', 'Promo'])
          .order('created_at', { ascending: false })
          .limit(6); // Lebih ringan untuk mobile

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
    <section className="py-16 bg-slate-50">
      <div className="px-4 text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-2xl md:text-4xl font-extrabold mb-2 text-slate-800">
          Properti Pilihan Kami
        </h2>
        <p className="text-sm md:text-lg text-slate-600">
          Beberapa properti investasi unggulan yang kami pilih khusus untuk Anda.
        </p>
      </div>

      <Swiper
        modules={[Pagination, A11y]}
        pagination={{ clickable: true }}
        grabCursor
        speed={500}
        breakpoints={{
          320: { slidesPerView: 1.05, spaceBetween: 10 },
          640: { slidesPerView: 1.5, spaceBetween: 15 },
          768: { slidesPerView: 2.5, spaceBetween: 20 },
          1024: { slidesPerView: 3.5, spaceBetween: 25 }
        }}
        className="!px-4 pb-10"
      >
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <SwiperSlide key={i}>
                <VillaCardSkeleton />
              </SwiperSlide>
            ))
          : villas.map((villa) => (
              <SwiperSlide key={villa.id}>
                <VillaCard
                  villa={{
                    ...villa,
                    // Optimisasi gambar untuk mobile
                    foto_urls: villa.foto_urls.map((url) => `${url}?w=500&auto=format`)
                  }}
                />
              </SwiperSlide>
            ))}
      </Swiper>

      <div className="text-center mt-4">
        <Link
          to="/listings"
          className="inline-flex items-center gap-2 px-6 py-3 bg-sky-500 text-white font-semibold rounded-full shadow-md hover:bg-sky-600 focus:ring-4 focus:ring-sky-300 transition"
        >
          Lihat Semua Properti <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
