import React, { useState, useEffect, Suspense, lazy, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../utils/supabase'; // Sesuaikan path ke file supabase Anda
import { Helmet } from 'react-helmet-async';
import { formatHarga } from '../utils/idr'; // Sesuaikan path ke file helper Anda
import { motion, AnimatePresence, animate } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// --- Impor Ikon ---
import { MapPin, BedDouble, Home, Maximize, TrendingUp, CheckCircle, Phone, Award, ChevronLeft, Image as ImageIcon, X, ChevronDown, ChevronUp } from 'lucide-react';

// --- Impor Komponen & Gaya Swiper ---
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// --- TIPE DATA ---
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
  perkiraan_passive_income?: number;
  jaminan_bep?: string;
  hak_pakai?: string;
  lokasi_maps_iframe_url?: string;
  slug: string;
}

// ===================================
// === HOOK & KOMPONEN PENINGKATAN ===
// ===================================

// ✨ Hook untuk animasi angka
function useAnimatedCounter(to: number, isCurrency: boolean = false) {  
  const nodeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const controls = animate(0, to, {
      duration: 1.5,
      ease: "circOut",
      onUpdate(value) {
        if (isCurrency) {
            node.textContent = formatHarga(value);
        } else if (to % 1 !== 0) {
            node.textContent = value.toFixed(1);
        } else {
            node.textContent = Math.round(value).toLocaleString('id-ID');
        }
      }
    });
    return () => controls.stop();
  }, [to, isCurrency]);

  return nodeRef;
}

// ✨ Komponen untuk Staggered Animation
const StaggeredFadeIn = ({ children }: { children: React.ReactNode }) => {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={itemVariants}>{child}</motion.div>
      ))}
    </motion.div>
  );
};


// ===============================================
// === SUB-KOMPONEN LENGKAP (HELPER COMPONENTS) ===
// ===============================================

const PageLoader = () => (
    <div className="container mx-auto px-4 py-28 animate-pulse">
        <div className="w-1/3 h-5 bg-slate-200 rounded-lg mb-4"></div>
        <div className="w-full h-10 bg-slate-300 rounded-lg mb-2"></div>
        <div className="w-1/2 h-6 bg-slate-200 rounded-lg mb-8"></div>
        <div className="w-full aspect-video bg-slate-200 rounded-2xl"></div>
    </div>
);

const NotFound = () => (
    <div className="text-center py-40">
        <h2 className="text-2xl font-bold">Villa tidak ditemukan.</h2>
        <Link to="/listings" className="text-sky-600 hover:underline mt-4 inline-block">Kembali ke Daftar Listing</Link>
    </div>
);

const SpecCard = React.memo(({ icon, value, label }: { icon: React.ReactNode, value: string | number, label: string }) => (
    <div className="flex flex-col items-center text-center p-3 bg-slate-100/60 rounded-xl border border-slate-200/80 transition-transform duration-300 hover:scale-105 hover:shadow-md">
        <div className="text-sky-600 mb-1.5">{icon}</div>
        <p className="text-base font-bold text-slate-800">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
    </div>
));

const HighlightItem = React.memo(({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle?: string }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 text-green-600 bg-green-100 p-3 rounded-full mt-1">{icon}</div>
        <div>
            <h4 className="font-semibold text-slate-800">{title}</h4>
            {subtitle && <p className="text-sm text-slate-500 leading-tight">{subtitle}</p>}
        </div>
    </div>
));

const VillaDescription = React.memo(({ content }: { content: string }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasLongText = content.length > 250;

    if (!hasLongText) {
         return (
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Deskripsi Properti</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{content}</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Deskripsi Properti</h2>
            <AnimatePresence initial={false}>
              <motion.div
                key="content"
                initial={{ height: '8rem' }}
                animate={{ height: isExpanded ? 'auto' : '8rem' }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="relative overflow-hidden"
              >
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line pb-4">{content}</p>
                  {!isExpanded && <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-slate-50 to-transparent"></div>}
              </motion.div>
            </AnimatePresence>
            <button onClick={() => setIsExpanded(!isExpanded)} className="mt-3 text-sky-600 font-semibold text-sm flex items-center gap-1 hover:text-sky-800">
                {isExpanded ? 'Tampilkan Lebih Sedikit' : 'Baca Selengkapnya'}
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
        </div>
    );
});


// --- Komponen untuk Lazy Loading ---

const PhotoLightbox = ({ images, initialIndex, onClose }: { images: string[], initialIndex: number, onClose: () => void }) => (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={onClose}
    >
        <button onClick={onClose} className="absolute top-4 right-4 text-white z-50 bg-black/50 p-2 rounded-full hover:bg-black/80"><X size={24} /></button>
        <Swiper modules={[Navigation, Pagination, Keyboard, A11y]} navigation pagination={{ type: 'fraction' }} keyboard={{ enabled: true }} loop={images.length > 1} initialSlide={initialIndex} className="w-full h-full">
            {images.map((url, index) => (
                <SwiperSlide key={index} className="flex items-center justify-center p-4">
                    <img src={url} alt={`Foto galeri ${index + 1}`} className="max-w-full max-h-full object-contain" onClick={(e) => e.stopPropagation()}/>
                </SwiperSlide>
            ))}
        </Swiper>
    </motion.div>
);

const ImageGalleryComponent = ({ photos, villaName }: { photos: string[], villaName: string }) => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [initialIndex, setInitialIndex] = useState(0);

    const openLightbox = (index: number) => { setInitialIndex(index); setLightboxOpen(true); };
    
    return (
        <>
            <div className="md:hidden relative"> {/* Mobile View */}
                <Swiper modules={[Pagination, A11y]} pagination={{ clickable: true }} loop={photos.length > 1} className="rounded-2xl shadow-lg shadow-slate-300/40">
                    {photos.map((url, index) => (
                        <SwiperSlide key={index} onClick={() => openLightbox(index)}>
                            <div className="aspect-[4/3] bg-slate-200"><img src={url} alt={`Foto ${index + 1} dari ${villaName}`} className="w-full h-full object-cover"/></div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div className="hidden md:grid md:grid-cols-4 md:grid-rows-2 md:gap-2 h-[450px] rounded-2xl overflow-hidden relative bg-slate-200 shadow-lg shadow-slate-300/40"> {/* Desktop View */}
                <div className="md:col-span-2 md:row-span-2 cursor-pointer group" onClick={() => openLightbox(0)}><img src={photos[0]} alt={`Foto utama ${villaName}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"/></div>
                {photos.slice(1, 5).map((url, index) => (
                    <div key={index} className="cursor-pointer group" onClick={() => openLightbox(index + 1)}><img src={url} alt={`Foto ${index + 2} dari ${villaName}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"/></div>
                ))}
                <button onClick={() => openLightbox(0)} className="absolute bottom-4 right-4 bg-white text-slate-800 text-sm font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-slate-100 flex items-center gap-2"><ImageIcon size={16} /> Lihat Semua Foto</button>
            </div>
            <AnimatePresence>{lightboxOpen && <PhotoLightbox images={photos} initialIndex={initialIndex} onClose={() => setLightboxOpen(false)} />}</AnimatePresence>
        </>
    );
};

const MapComponent = ({ src, title }: { src: string, title: string }) => {
    const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '200px 0px' });
    return (
        <div ref={ref} className="h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-lg border bg-slate-200">
            {inView ? <iframe title={title} src={src} className="w-full h-full" style={{ border: 0 }} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe> : <div className="w-full h-full flex items-center justify-center text-slate-400">Memuat Peta...</div>}
        </div>
    );
};

// ✨ LAZY LOAD COMPONENTS
const LazyImageGallery = lazy(() => Promise.resolve({ default: ImageGalleryComponent }));
const LazyMap = lazy(() => Promise.resolve({ default: MapComponent }));


// =============================
// === HALAMAN UTAMA (FINAL) ===
// =============================
export default function VillaDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const [villa, setVilla] = useState<Villa | null>(null);
    const [loading, setLoading] = useState(true);

    const animatedPriceRef = useAnimatedCounter(villa?.harga || 0, true);

    useEffect(() => {
        const fetchVilla = async () => {
            if (!slug) { setLoading(false); return; }
            window.scrollTo(0, 0);
            setLoading(true);
            try {
                const { data, error } = await supabase.from('villa_listings').select('*').eq('slug', slug).single();
                if (error) throw error;
                setVilla(data as Villa);
            } catch (error) { console.error('Error fetching villa:', error); setVilla(null); } 
            finally { setLoading(false); }
        };
        fetchVilla();
    }, [slug]);

    useEffect(() => {
        if (villa?.id) { supabase.from('page_views').insert([{ villa_id: villa.id, slug: villa.slug }]).then(({ error }) => { if (error) console.warn('Error logging page view:', error.message); }); }
    }, [villa]);

    if (loading) return <PageLoader />;
    if (!villa) return <NotFound />;
    
    const whatsappLink = `https://wa.me/${villa.kontak_marketing}?text=Halo,%20saya%20tertarik%20dengan%20properti%20"${villa.nama_listing}"`;

    return (
        <>
            <Helmet>
                <title>{`${villa.nama_listing} | Investasi Villa Properti`}</title>
                <meta name="description" content={villa.deskripsi_singkat} />
            </Helmet>
            
            <main className="bg-slate-50">
                <div className="container mx-auto px-4 lg:px-8 pt-6 md:pt-8">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                        <Link to="/listings" className="text-sm text-sky-600 hover:text-sky-800 flex items-center gap-1 w-fit"><ChevronLeft size={16}/> Kembali ke Semua Listing</Link>
                        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 mt-2">{villa.nama_listing}</h1>
                        <p className="text-slate-500 mt-2 flex items-center gap-2 text-sm md:text-base"><MapPin size={16}/> {villa.alamat_lengkap}</p>
                    </motion.div>

                    <Suspense fallback={<div className="aspect-video w-full bg-slate-200 rounded-2xl animate-pulse"></div>}>
                        <LazyImageGallery photos={villa.foto_urls} villaName={villa.nama_listing} />
                    </Suspense>
                </div>

                <div className="container mx-auto px-4 lg:px-8 mt-8 pb-28 lg:pb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-8">
                        
                        <div className="lg:col-span-2 space-y-8">
                            <StaggeredFadeIn>
                                <section className="bg-white/70 backdrop-blur-lg p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                                    <h2 className="text-xl font-bold text-slate-800 mb-4">Spesifikasi Properti</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                                        <SpecCard icon={<BedDouble size={24}/>} value={villa.tipe_villa} label="Tipe"/>
                                        <SpecCard icon={<Home size={24}/>} value={`${villa.luas_bangunan || 'N/A'} m²`} label="Bangunan"/>
                                        <SpecCard icon={<Maximize size={24}/>} value={`${villa.luas_tanah || 'N/A'} m²`} label="Tanah"/>
                                        <SpecCard icon={<TrendingUp size={24}/>} value={`${villa.roi_perkiraan || 'N/A'} %`} label="ROI/Tahun"/>
                                    </div>
                                </section>

                                {(villa.perkiraan_passive_income || villa.jaminan_bep || villa.hak_pakai) && (
                                    <section className="bg-white/70 backdrop-blur-lg p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                                         <h2 className="text-xl font-bold text-slate-800 mb-6">Keuntungan Utama Investasi</h2>
                                         <div className="space-y-5">
                                             {villa.perkiraan_passive_income && <HighlightItem icon={<TrendingUp size={20}/>} title={`Estimasi Passive Income`} subtitle={`${formatHarga(villa.perkiraan_passive_income)} / Bulan`} />}
                                             {villa.jaminan_bep && <HighlightItem icon={<Award size={20}/>} title={`Jaminan BEP ${villa.jaminan_bep}`} subtitle="Diaktakan resmi di depan notaris."/>}
                                             {villa.hak_pakai && <HighlightItem icon={<CheckCircle size={20}/>} title={`Hak Pakai ${villa.hak_pakai}`} subtitle="Aset investasi aman jangka panjang."/>}
                                         </div>
                                    </section>
                                )}
                                
                                <VillaDescription content={villa.deskripsi_panjang || villa.deskripsi_singkat} />

                                {villa.fasilitas && villa.fasilitas.length > 0 && (
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-800 mb-4">Fasilitas</h2>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
                                            {villa.fasilitas.map(item => (<div key={item} className="flex items-center gap-3"><CheckCircle size={18} className="text-green-500 flex-shrink-0" /><span className="text-slate-700">{item}</span></div>))}
                                        </div>
                                    </div>
                                )}
                            </StaggeredFadeIn>
                        </div>
                        
                        <aside className="hidden lg:block">
                            <div className="sticky top-28">
                                <div className="p-6 bg-white/70 backdrop-blur-lg border border-slate-200/80 rounded-2xl shadow-lg shadow-slate-300/20">
                                    <p className="text-slate-500 text-sm">Harga Mulai</p>
                                    <p ref={animatedPriceRef as any} className="text-3xl font-extrabold text-slate-900 mb-6"></p>
                                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-green-600 transition-all text-center block flex items-center justify-center gap-2 transform hover:-translate-y-1">
                                        <Phone size={18} /> Hubungi Marketing
                                    </a>
                                    <p className="text-xs text-slate-400 text-center mt-4">Tanyakan detail & jadwal survei.</p>
                                </div>
                            </div>
                        </aside>
                    </div>

                    {villa.lokasi_maps_iframe_url && (
                        <section className="mt-12">
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 md:mb-8 text-center">Lokasi Properti</h2>
                            <Suspense fallback={<div className="h-[400px] w-full bg-slate-200 rounded-2xl animate-pulse"></div>}>
                                <LazyMap src={villa.lokasi_maps_iframe_url} title={`Lokasi ${villa.nama_listing}`} />
                            </Suspense>
                        </section>
                    )}
                </div>
            </main>

            <div className="block lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-lg border-t border-slate-200/50 p-3">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div>
                        <p className="text-xs text-slate-500">Harga</p>
                        <p className="font-bold text-lg text-slate-800">{formatHarga(villa.harga)}</p>
                    </div>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white font-bold py-2.5 px-4 rounded-lg shadow-lg hover:bg-green-600 transition-all text-sm flex items-center gap-2">
                        <Phone size={16} /> Hubungi
                    </a>
                </div>
            </div>
        </>
    );
}