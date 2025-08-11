// src/pages/VillaDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { Helmet } from 'react-helmet-async';
import { formatHarga } from '../utils/idr';
import { motion, AnimatePresence } from 'framer-motion';

// Impor Ikon
import { MapPin, BedDouble, Home, Maximize, TrendingUp, CheckCircle, Phone, Award, ChevronLeft, Image as ImageIcon, X, ArrowLeft, ArrowRight } from 'lucide-react';

// Impor Komponen Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// --- INTERFACE & TIPE DATA ---
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
  // Menambahkan field baru untuk keuntungan agar dinamis
  perkiraan_passive_income?: number;
  jaminan_bep?: string;
  hak_pakai?: string;
  lokasi_maps_iframe_url?: string;
  slug: string;
}

// --- SUB-KOMPONEN YANG DIPERBAIKI & BARU ---

// Komponen untuk setiap bagian halaman
const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <section className="py-8 border-b border-slate-200">
    <h2 className="text-2xl font-bold text-slate-800 mb-6">{title}</h2>
    {children}
  </section>
);

// Kartu Spesifikasi dengan gaya yang lebih halus
const SpecCard = ({ icon, value, label }: { icon: React.ReactNode, value: string | number, label: string }) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 text-center transition-all hover:border-sky-500 hover:shadow-lg">
    <div className="mx-auto text-sky-600 mb-2 w-fit">{icon}</div>
    <p className="text-lg font-bold text-slate-800">{value}</p>
    <p className="text-xs text-slate-500">{label}</p>
  </div>
);

// Item Highlight Keuntungan dengan gaya yang lebih rapi
const HighlightItem = ({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle?: string }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 text-green-500 bg-green-100 p-2 rounded-full mt-1">{icon}</div>
    <div>
      <h4 className="font-semibold text-slate-800">{title}</h4>
      {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
    </div>
  </div>
);

// Galeri Foto Lightbox
const PhotoLightbox = ({ images, initialIndex, onClose }: { images: string[], initialIndex: number, onClose: () => void }) => (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
        <button onClick={onClose} className="absolute top-4 right-4 text-white z-50 bg-black/50 p-2 rounded-full hover:bg-black/80">
            <X size={24} />
        </button>
        <Swiper
            modules={[Navigation, Pagination, Keyboard, A11y]}
            navigation
            pagination={{ type: 'fraction' }}
            keyboard={{ enabled: true }}
            loop={true}
            initialSlide={initialIndex}
            className="w-full h-full"
        >
            {images.map((url, index) => (
                <SwiperSlide key={index} className="flex items-center justify-center">
                    <img src={url} alt={`Foto galeri ${index + 1}`} className="max-w-full max-h-full object-contain" onClick={(e) => e.stopPropagation()}/>
                </SwiperSlide>
            ))}
        </Swiper>
    </motion.div>
);

// Galeri Foto Grid
const ImageGallery = ({ photos, villaName }: { photos: string[], villaName: string }) => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [initialIndex, setInitialIndex] = useState(0);

    if (!photos || photos.length === 0) {
        return <div className="aspect-video bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">Gambar tidak tersedia</div>;
    }

    const openLightbox = (index: number) => {
        setInitialIndex(index);
        setLightboxOpen(true);
    };

    return (
        <>
            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[250px] md:h-[450px] rounded-2xl overflow-hidden">
                {/* Main Image */}
                <div className="col-span-4 sm:col-span-2 row-span-2 cursor-pointer" onClick={() => openLightbox(0)}>
                    <img src={photos[0]} alt={`Foto utama ${villaName}`} className="w-full h-full object-cover transition-all duration-300 hover:brightness-110"/>
                </div>
                {/* Other Images */}
                {photos.slice(1, 5).map((url, index) => (
                    <div key={index} className={`cursor-pointer ${index > 1 ? 'hidden sm:block' : ''}`} onClick={() => openLightbox(index + 1)}>
                        <img src={url} alt={`Foto ${index + 2} dari ${villaName}`} className="w-full h-full object-cover transition-all duration-300 hover:brightness-110"/>
                    </div>
                ))}
                <button 
                    onClick={() => openLightbox(0)}
                    className="absolute bottom-4 right-4 bg-white text-slate-800 text-sm font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-slate-100 flex items-center gap-2">
                    <ImageIcon size={16} /> Lihat Semua Foto
                </button>
            </div>

            <AnimatePresence>
                {lightboxOpen && <PhotoLightbox images={photos} initialIndex={initialIndex} onClose={() => setLightboxOpen(false)} />}
            </AnimatePresence>
        </>
    );
};

// Sidebar Sticky untuk Desktop
const StickySidebar = ({ villa }: { villa: Villa }) => (
  <aside className="hidden lg:block lg:col-span-1">
    <div className="sticky top-28 p-6 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-300/30">
        <p className="text-slate-500 text-sm">Harga Mulai</p>
        <p className="text-4xl font-extrabold text-slate-900 mb-6">{formatHarga(villa.harga)}</p>
        
        <div className="space-y-4 border-t pt-6 mb-6">
            <h3 className="text-lg font-bold text-slate-800">Keuntungan Utama Investasi</h3>
            {villa.perkiraan_passive_income && <HighlightItem icon={<TrendingUp size={20}/>} title={`Estimasi Passive Income`} subtitle={`${formatHarga(villa.perkiraan_passive_income)} / Bulan`} />}
            {villa.jaminan_bep && <HighlightItem icon={<Award size={20}/>} title={`Jaminan BEP ${villa.jaminan_bep}`} subtitle="Diaktakan resmi di depan notaris."/>}
            {villa.hak_pakai && <HighlightItem icon={<CheckCircle size={20}/>} title={`Hak Pakai ${villa.hak_pakai}`} subtitle="Aset investasi aman jangka panjang."/>}
        </div>
        
        <a href={`https://wa.me/${villa.kontak_marketing}?text=Halo,%20saya%20tertarik%20dengan%20properti%20"${villa.nama_listing}"`} target="_blank" rel="noopener noreferrer"
            className="w-full bg-green-500 text-white font-bold py-3.5 px-6 rounded-lg shadow-lg hover:bg-green-600 transition-all text-center block flex items-center justify-center gap-2"
        >
            <Phone size={18} /> Hubungi Marketing
        </a>
    </div>
  </aside>
);

// CTA Bar Sticky untuk Mobile
const MobileCtaBar = ({ villa }: { villa: Villa }) => (
    <div className="block lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 p-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto px-4 flex justify-between items-center">
            <div>
                <p className="text-xs text-slate-500">Harga</p>
                <p className="font-bold text-lg text-slate-800">{formatHarga(villa.harga)}</p>
            </div>
            <a href={`https://wa.me/${villa.kontak_marketing}?text=Halo,%20saya%20tertarik%20dengan%20properti%20"${villa.nama_listing}"`} target="_blank" rel="noopener noreferrer"
               className="bg-green-500 text-white font-bold py-2.5 px-4 rounded-lg shadow-lg hover:bg-green-600 transition-all text-sm flex items-center gap-2">
                <Phone size={16} /> Hubungi
            </a>
        </div>
    </div>
);

// --- KOMPONEN HALAMAN UTAMA ---
export default function VillaDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [villa, setVilla] = useState<Villa | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVilla = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }
      window.scrollTo(0, 0);
      setLoading(true);
      try {
        const { data, error } = await supabase.from('villa_listings').select('*').eq('slug', slug).single();
        if (error) throw error;
        setVilla(data as Villa);
      } catch (error) {
        console.error('Error fetching villa:', error);
        setVilla(null);
      } finally {
        setLoading(false);
      }
    };
    fetchVilla();
  }, [slug]);

  // Efek untuk mencatat page view (opsional, bisa dihapus jika tidak perlu)
  useEffect(() => {
    if (villa?.id) {
      supabase.from('page_views').insert([{ villa_id: villa.id, slug: villa.slug }]).then(({ error }) => {
        if (error) console.warn('Error logging page view:', error.message);
      });
    }
  }, [villa]);

  if (loading) {
    // Skeleton loader yang lebih baik
    return <div className="container mx-auto px-4 py-28 animate-pulse space-y-8">
        <div className="w-1/3 h-5 bg-slate-200 rounded-lg"></div>
        <div className="w-full h-10 bg-slate-300 rounded-lg"></div>
        <div className="w-1/2 h-6 bg-slate-200 rounded-lg"></div>
        <div className="w-full h-[450px] bg-slate-200 rounded-2xl"></div>
    </div>;
  }

  if (!villa) {
    return <div className="text-center py-40">
        <h2 className="text-2xl font-bold">Villa tidak ditemukan.</h2>
        <Link to="/listings" className="text-sky-600 hover:underline mt-4 inline-block">Kembali ke Daftar Listing</Link>
    </div>;
  }

  return (
    <>
      <Helmet>
        <title>{`${villa.nama_listing} | Investasi Villa Properti`}</title>
        <meta name="description" content={villa.deskripsi_singkat} />
        <meta property="og:image" content={villa.foto_urls?.[0]} />
        <meta property="og:title" content={villa.nama_listing} />
        <meta property="og:description" content={villa.deskripsi_singkat} />
        <meta property="og:url" content={window.location.href} />
      </Helmet>
      
      <main className="bg-slate-50 pb-24 lg:pb-16">
        <div className="container mx-auto px-4 lg:px-8 pt-8">
          
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Link to="/listings" className="text-sm text-sky-600 hover:text-sky-800 flex items-center gap-1 mb-4 w-fit">
              <ChevronLeft size={16}/> Kembali ke Semua Listing
            </Link>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">{villa.nama_listing}</h1>
            <p className="text-slate-500 mt-2 flex items-center gap-2"><MapPin size={16}/> {villa.alamat_lengkap}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <ImageGallery photos={villa.foto_urls} villaName={villa.nama_listing} />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-8 mt-10">
            <div className="lg:col-span-2 space-y-2">
              <Section title="Spesifikasi Properti">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <SpecCard icon={<BedDouble size={28}/>} value={villa.tipe_villa} label="Tipe"/>
                      <SpecCard icon={<Home size={28}/>} value={`${villa.luas_bangunan || 'N/A'} m²`} label="Bangunan"/>
                      <SpecCard icon={<Maximize size={28}/>} value={`${villa.luas_tanah || 'N/A'} m²`} label="Tanah"/>
                      <SpecCard icon={<TrendingUp size={28}/>} value={`${villa.roi_perkiraan || 'N/A'} %`} label="ROI/Tahun"/>
                  </div>
              </Section>
              
              <Section title="Deskripsi">
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{villa.deskripsi_panjang || villa.deskripsi_singkat}</p>
              </Section>
              
              {villa.fasilitas && villa.fasilitas.length > 0 && (
                <Section title="Fasilitas yang Ditawarkan">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
                      {villa.fasilitas.map(item => (
                        <div key={item} className="flex items-center gap-3">
                            <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                            <span className="text-slate-700">{item}</span>
                        </div>
                      ))}
                    </div>
                </Section>
              )}
            </div>
            
            <StickySidebar villa={villa} />
          </div>

          {villa.lokasi_maps_iframe_url && (
            <section className="mt-12">
               <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Lokasi Properti</h2>
               <div className="h-[450px] w-full rounded-2xl overflow-hidden shadow-lg border">
                <iframe
                  title={`Lokasi ${villa.nama_listing}`}
                  src={villa.lokasi_maps_iframe_url}
                  width="100%" height="450" style={{ border: 0 }}
                  allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
               </div>
            </section>
           )}
        </div>
      </main>
      <MobileCtaBar villa={villa} />
    </>
  );
}