// src/pages/VillaDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { Helmet } from 'react-helmet-async';
import { formatHarga } from '../utils/idr';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard } from 'swiper/modules';

// Impor Ikon
import { MapPin, BedDouble, Home, Maximize, TrendingUp, CheckCircle, Phone, Award, ChevronLeft, Image as ImageIcon } from 'lucide-react';

// Impor CSS Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Tipe data Villa yang lengkap
interface Villa {
  id: string;
  nama_listing: string;
  deskripsi_singkat: string;
  deskripsi_panjang?: string;
  alamat_lengkap: string;
  harga: number;
  status: 'Tersedia' | 'Promo' | 'Sold Out';
  foto_urls: string[];
  roi_perkiraan?: number;
  tipe_villa: string;
  luas_bangunan?: number;
  luas_tanah?: number;
  fasilitas?: string[];
  kontak_marketing: string;
  jaminan_bep?: string;
  free_stay?: string;
  lokasi_maps_iframe_url?: string;
  slug: string;
}

// Sub-komponen
const SpecCard = ({ icon, value, label }: { icon: React.ReactNode, value: string | number, label: string }) => (
    <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-xl shadow-lg border text-center">
        <div className="mx-auto text-sky-600 mb-2 w-fit bg-sky-100 p-3 rounded-full">{icon}</div>
        <p className="text-xl font-bold text-slate-800">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
    </motion.div>
);

const HighlightItem = ({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle: string }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 text-green-500 mt-1">{icon}</div>
        <div>
            <h4 className="font-semibold text-slate-800">{title}</h4>
            <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
    </div>
);

// --- Komponen Halaman Utama ---
export default function VillaDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [villa, setVilla] = useState<Villa | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVilla = async () => {
      if (!slug) return;
      window.scrollTo(0, 0);
      setLoading(true);
      const { data, error } = await supabase
        .from('villa_listings')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) {
        console.error('Error fetching villa:', error);
        setVilla(null);
      } else {
        setVilla(data as Villa);
      }
      setLoading(false);
    };
    fetchVilla();
  }, [slug]);

  // Efek untuk mencatat page view
  useEffect(() => {
    if (villa) {
      supabase.from('page_views').insert([{ villa_id: villa.id, slug: villa.slug }]).then();
    }
  }, [villa]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-28 animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
        <div className="h-10 bg-slate-300 rounded w-3/4 mb-2"></div>
        <div className="h-6 bg-slate-200 rounded w-1/2 mb-8"></div>
        <div className="h-[500px] bg-slate-200 rounded-2xl"></div>
      </div>
    );
  }

  if (!villa) {
    return (
      <div className="text-center py-40">
        <h2 className="text-2xl font-bold">Villa tidak ditemukan.</h2>
        <Link to="/" className="text-sky-600 hover:underline mt-4 inline-block">Kembali ke Beranda</Link>
      </div>
    );
  }
  
  const mainImage = villa.foto_urls?.[0];

  return (
    <>
      <Helmet>
        <title>{villa.nama_listing} | Investasi Villa Jogja</title>
        <meta name="description" content={villa.deskripsi_singkat} />
        <meta property="og:image" content={mainImage} />
        <meta property="og:url" content={window.location.href} />
      </Helmet>
      
      <main className="bg-white">
        <div className="container mx-auto px-4 lg:px-8 py-10">
          
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/" className="text-sm text-sky-600 hover:underline flex items-center gap-1 mb-4">
              <ChevronLeft size={16}/> Kembali ke Semua Listing
            </Link>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">{villa.nama_listing}</h1>
            <p className="text-slate-500 mt-2 flex items-center gap-2"><MapPin size={16}/> {villa.alamat_lengkap}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="my-8">
            {villa.foto_urls && villa.foto_urls.length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination, Keyboard]}
                navigation
                pagination={{ type: 'fraction' }}
                keyboard={{ enabled: true }}
                loop={true}
                className="w-full h-[300px] md:h-[550px] rounded-2xl shadow-xl border bg-slate-100"
              >
                {villa.foto_urls.map((url, index) => (
                  <SwiperSlide key={index}>
                    <img src={url} alt={`${villa.nama_listing} foto ${index + 1}`} className="w-full h-full object-cover" />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="aspect-video bg-slate-100 rounded-2xl flex items-center justify-center">
                <span className="text-slate-400">Gambar tidak tersedia</span>
              </div>
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-8">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2 space-y-10">
              <div className="border-b pb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Tentang Properti Ini</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <SpecCard icon={<BedDouble size={28}/>} value={villa.tipe_villa} label="Tipe"/>
                  <SpecCard icon={<Home size={28}/>} value={`${villa.luas_bangunan || '-'} m²`} label="Bangunan"/>
                  <SpecCard icon={<Maximize size={28}/>} value={`${villa.luas_tanah || '-'} m²`} label="Tanah"/>
                  <SpecCard icon={<TrendingUp size={28}/>} value={`${villa.roi_perkiraan || '-'} %`} label="ROI/Tahun"/>
                </div>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{villa.deskripsi_panjang || villa.deskripsi_singkat}</p>
              </div>
              
              {villa.fasilitas && villa.fasilitas.length > 0 && (
                <div className="pb-6">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Fasilitas yang Ditawarkan</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
                      {villa.fasilitas.map(item => (
                        <div key={item} className="flex items-center gap-3">
                            <CheckCircle size={20} className="text-green-500" />
                            <span className="text-slate-700">{item}</span>
                        </div>
                      ))}
                    </div>
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-1">
                <div className="sticky top-28 p-6 bg-white border rounded-2xl shadow-2xl">
                    <p className="text-slate-500 text-sm">Harga Mulai</p>
                    <p className="text-4xl font-extrabold text-slate-900 mb-6">{formatHarga(villa.harga)}</p>
                    
                    <div className="space-y-4 border-t pt-6">
                        <h3 className="text-lg font-bold text-slate-800">Keuntungan Utama Investasi</h3>
                        <HighlightItem icon={<TrendingUp/>} title={`Passive Income ${formatHarga(6000000).replace('Rp ','')}/Bulan`} subtitle="Dikelola oleh tim profesional kami."/>
                        <HighlightItem icon={<Award/>} title={`Jaminan BEP ${villa.jaminan_bep || '5 Tahun'}`} subtitle="Diaktakan resmi di depan notaris."/>
                        <HighlightItem icon={<CheckCircle/>} title="Hak Pakai Selama 20 Tahun" subtitle="Aset investasi aman jangka panjang."/>
                    </div>
                     <a href={`https://wa.me/${villa.kontak_marketing}?text=Halo,%20saya%20tertarik%20dengan%20properti%20"${villa.nama_listing}"`} target="_blank" rel="noopener noreferrer"
                        className="w-full mt-6 bg-green-500 text-white font-bold py-3.5 px-6 rounded-lg shadow-lg hover:bg-green-600 transition-all text-center block"
                    >
                        Hubungi Marketing
                    </a>
                </div>
            </motion.div>
          </div>

           {villa.lokasi_maps_iframe_url && (
             <section className="mt-20">
               <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Lokasi Properti</h2>
               <div className="h-[450px] w-full rounded-2xl overflow-hidden shadow-lg border">
                <iframe
                   src={villa.lokasi_maps_iframe_url}
                   width="100%" height="450" style={{ border: 0 }}
                   allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                 ></iframe>
               </div>
             </section>
           )}
        </div>
      </main>
    </>
  );
}