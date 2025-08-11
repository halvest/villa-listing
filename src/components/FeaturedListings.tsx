// src/components/FeaturedListings.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import VillaCard from './VillaCard';
import { ArrowRight } from 'lucide-react';

// 1. Impor komponen dan style dari Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Tipe data Villa (tidak berubah)
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

// Skeleton loading (tidak berubah)
const VillaCardSkeleton = () => (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 animate-pulse w-full">
      <div className="aspect-video bg-slate-200 rounded-lg mb-4"></div>
      <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
      <div className="h-9 bg-slate-200 rounded w-full"></div>
    </div>
  );

export default function FeaturedListings() {
  const [villas, setVillas] = useState<Villa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedVillas = async () => {
      setLoading(true);
      try {
        // 2. Ambil lebih banyak data agar slider lebih berisi
        const { data, error } = await supabase
          .from('villa_listings')
          .select('*')
          .in('status', ['Tersedia', 'Promo'])
          .order('created_at', { ascending: false })
          .limit(8); // Ambil 8 villa untuk slider

        if (error) throw error;
        setVillas(data as Villa[]);
      } catch (error) {
        console.error("Error fetching featured villas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedVillas();
  }, []);

  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-sky-700">
            Properti Pilihan Kami
          </h2>
          <p className="text-lg text-slate-600">
            Berikut adalah beberapa properti investasi unggulan yang telah kami seleksi khusus untuk Anda.
          </p>
        </div>
      </div>

      {/* 3. Ganti Grid dengan Swiper */}
      <div className="w-full">
        <Swiper
            modules={[Navigation, Pagination, A11y]}
            navigation // Menampilkan tombol navigasi (panah)
            pagination={{ clickable: true }} // Menampilkan titik-titik paginasi
            grabCursor={true}
            loop={false}
            className="!px-4 md:!px-8 !pb-12" // Tambahan padding untuk Swiper
            // Konfigurasi responsif untuk jumlah slide
            breakpoints={{
                // Tampilan mobile (default)
                320: {
                    slidesPerView: 1.2,
                    spaceBetween: 15,
                    centeredSlides: true,
                },
                // Tampilan tablet
                768: {
                    slidesPerView: 2.5,
                    spaceBetween: 20,
                    centeredSlides: false,
                },
                // Tampilan desktop
                1024: {
                    slidesPerView: 3.5,
                    spaceBetween: 30,
                    centeredSlides: false,
                },
                 // Tampilan desktop besar
                 1280: {
                    slidesPerView: 4.2,
                    spaceBetween: 30,
                    centeredSlides: false,
                }
            }}
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
                <SwiperSlide key={index}>
                    <VillaCardSkeleton />
                </SwiperSlide>
            ))
          ) : (
            villas.map(villa => (
                <SwiperSlide key={villa.id}>
                    <VillaCard villa={villa} />
                </SwiperSlide>
            ))
          )}
        </Swiper>
      </div>
      
      <div className="text-center mt-4">
            <Link 
                to="/listings"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-sky-500 text-white font-bold text-lg rounded-full shadow-lg shadow-sky-500/30 hover:bg-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-300 transition-all duration-300 transform hover:scale-105"
            >
                Lihat Semua Properti
                <ArrowRight />
            </Link>
      </div>
    </section>
  );
}