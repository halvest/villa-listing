// src/pages/VillaDetailPage.tsx
import React, { useState, useEffect, Suspense, lazy, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { Helmet } from 'react-helmet-async';
import { formatHarga } from '../utils/idr';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// --- Impor Ikon ---
import { MapPin, TrendingUp, CheckCircle, Phone, Award, ChevronLeft, Image as ImageIcon, X, ChevronDown, ChevronUp, Sparkles, Gift } from 'lucide-react';

// --- Impor Komponen & Gaya Swiper ---
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, A11y, Autoplay } from 'swiper/modules';
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
  harga_promo?: number;
  status: 'Tersedia' | 'Promo' | 'Sold Out';
  foto_urls: string[];
  roi_perkiraan?: number;
  tipe_villa: string;
  memiliki_private_pool?: boolean;
  fasilitas?: string[];
  kontak_marketing: string;
  perkiraan_passive_income?: number;
  jaminan_bep?: string;
  free_stay?: string;
  lokasi_maps_iframe_url?: string;
  slug: string;
}

// ===================================
// === KOMPONEN BANTUAN & BARU ===
// ===================================

const HighlightItem = React.memo(({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle?: string }) => (
    <div className="flex items-start gap-4"><div className="flex-shrink-0 text-sky-600 bg-sky-100 p-3 rounded-full mt-1">{icon}</div><div><h4 className="font-semibold text-slate-800">{title}</h4>{subtitle && <p className="text-sm text-slate-500 leading-tight">{subtitle}</p>}</div></div>
));
HighlightItem.displayName = 'HighlightItem';

const VillaDescription = React.memo(({ content }: { content: string }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    if (!content) return null;
    const hasLongText = content.length > 250;
    if (!hasLongText) {
        return (
            <section>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Deskripsi Properti</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{content}</p>
            </section>
        );
    }
    return (
        <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Deskripsi Properti</h2>
            <AnimatePresence initial={false}>
              <motion.div
                key="content" initial={{ height: '8rem' }} animate={{ height: isExpanded ? 'auto' : '8rem' }} transition={{ duration: 0.4, ease: 'easeInOut' }} className="relative overflow-hidden"
              >
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line pb-4">{content}</p>
                  {!isExpanded && <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent"></div>}
              </motion.div>
            </AnimatePresence>
            <button onClick={() => setIsExpanded(!isExpanded)} className="mt-3 text-sky-600 font-semibold text-sm flex items-center gap-1 hover:text-sky-800">
                {isExpanded ? 'Tampilkan Lebih Sedikit' : 'Baca Selengkapnya'}
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
        </section>
    );
});
VillaDescription.displayName = 'VillaDescription';

// --- Komponen Baru: PromoPopup Cerdas ---
const PromoPopup = ({ villa, onClose, whatsappLink }: { villa: Villa, onClose: () => void, whatsappLink: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-md w-full overflow-hidden text-center relative shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-2 right-2 p-2 text-slate-400 hover:text-slate-800 z-10">
          <X size={20} />
        </button>
        <div className="p-6 bg-gradient-to-br from-sky-500 to-cyan-500 text-white">
          <Gift size={40} className="mx-auto" />
          <h3 className="text-2xl font-bold mt-2">Penawaran Spesial!</h3>
          <p className="text-sm opacity-90">Hanya untuk Anda yang tertarik dengan {villa.nama_listing}</p>
        </div>
        <div className="p-6 md:p-8">
          <p className="text-slate-600">Dapatkan diskon spesial dan bonus furnitur senilai jutaan rupiah jika Anda menghubungi konsultan kami dalam **24 jam** ke depan.</p>
          <a
            href={whatsappLink} target="_blank" rel="noopener noreferrer"
            className="mt-6 w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-green-600 transition-all text-center block flex items-center justify-center gap-2 transform hover:-translate-y-1"
          >
            <Phone size={18} /> Klaim Promo Sekarang
          </a>
          <p className="text-xs text-slate-400 text-center mt-3">Penawaran terbatas & syarat berlaku.</p>
        </div>
      </motion.div>
    </motion.div>
  );
};


// ==========================================
// === KOMPONEN-KOMPONEN YANG DI-LAZY LOAD ===
// ==========================================

const ImageGalleryComponent = ({ photos, villaName }: { photos: string[], villaName: string }) => {
    // ... (Isi komponen ini sama persis, tidak perlu diubah, sudah bagus)
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [initialIndex, setInitialIndex] = useState(0);
    const openLightbox = (index: number) => { setInitialIndex(index); setLightboxOpen(true); };
    if (!photos || photos.length === 0) {
        return <div className="aspect-video w-full bg-slate-200 rounded-2xl flex items-center justify-center text-slate-500">Tidak ada foto tersedia</div>;
    }
    const optimizedSrc = (url: string, size: number) => `${url}?w=${size}&auto=format&q=75`;
    const placeholderSrc = (url: string) => `${url}?w=20&auto=format&q=10&blur=100`; // Placeholder super ringan
    return (
        <>
            <div className="hidden md:grid md:grid-cols-4 md:grid-rows-2 md:gap-2 h-[450px] rounded-2xl overflow-hidden relative bg-slate-200 shadow-lg shadow-slate-300/40">
                <div className="md:col-span-2 md:row-span-2 cursor-pointer group" style={{ backgroundImage: `url(${placeholderSrc(photos[0])})`, backgroundSize: 'cover' }} onClick={() => openLightbox(0)}>
                    <img src={optimizedSrc(photos[0], 800)} srcSet={`${optimizedSrc(photos[0], 400)} 400w, ${optimizedSrc(photos[0], 800)} 800w, ${optimizedSrc(photos[0], 1200)} 1200w`} alt={`Foto utama ${villaName}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" width="800" height="450" />
                </div>
                {photos.slice(1, 5).map((url, index) => (
                    <div key={index} className="cursor-pointer group bg-slate-200" style={{ backgroundImage: `url(${placeholderSrc(url)})`, backgroundSize: 'cover' }} onClick={() => openLightbox(index + 1)}>
                        <img src={optimizedSrc(url, 400)} alt={`Foto ${index + 2} dari ${villaName}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" width="400" height="225"/>
                    </div>
                ))}
                <button onClick={() => openLightbox(0)} className="absolute bottom-4 right-4 bg-white text-slate-800 text-sm font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-slate-100 flex items-center gap-2"><ImageIcon size={16} /> Lihat Semua Foto</button>
            </div>
            <div className="md:hidden">
                <Swiper modules={[Pagination, A11y, Autoplay]} pagination={{ clickable: true }} loop={photos.length > 1} autoplay={{delay: 5000, disableOnInteraction: false}} className="rounded-2xl shadow-lg shadow-slate-300/40">
                    {photos.map((url, index) => (
                        <SwiperSlide key={index} onClick={() => openLightbox(index)}>
                            <div className="aspect-[4/3] bg-slate-200" style={{ backgroundImage: `url(${placeholderSrc(url)})`, backgroundSize: 'cover' }}>
                                <img src={optimizedSrc(url, 500)} alt={`Foto ${index + 1} dari ${villaName}`} className="w-full h-full object-cover" loading="lazy" width="500" height="375" />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <AnimatePresence>{lightboxOpen && <PhotoLightbox images={photos} initialIndex={initialIndex} onClose={() => setLightboxOpen(false)} />}</AnimatePresence>
        </>
    );
};

const PhotoLightbox = ({ images, initialIndex, onClose }: { images: string[], initialIndex: number, onClose: () => void }) => (
    // ... (Isi komponen ini sama persis, tidak perlu diubah, sudah bagus)
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center" onClick={onClose}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white z-50 bg-black/50 p-2 rounded-full hover:bg-black/80"><X size={24} /></button>
        <Swiper modules={[Navigation, Pagination, Keyboard, A11y]} navigation pagination={{ type: 'fraction' }} keyboard={{ enabled: true }} loop={images.length > 1} initialSlide={initialIndex} className="w-full h-full">
            {images.map((url, index) => (<SwiperSlide key={index} className="flex items-center justify-center p-4"><img src={url} alt={`Foto galeri ${index + 1}`} className="max-w-full max-h-full object-contain" onClick={(e) => e.stopPropagation()}/></SwiperSlide>))}
        </Swiper>
    </motion.div>
);

const MapComponent = ({ src, title }: { src: string, title: string }) => {
    // ... (Isi komponen ini sama persis, tidak perlu diubah, sudah bagus)
    const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '200px 0px' });
    return <div ref={ref} className="h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-lg border bg-slate-200">{inView ? <iframe title={`Lokasi Peta untuk ${title}`} src={src} className="w-full h-full" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe> : <div className="w-full h-full flex items-center justify-center text-slate-400">Memuat Peta...</div>}</div>;
};

const LazyImageGallery = lazy(() => Promise.resolve({ default: ImageGalleryComponent }));
const LazyMap = lazy(() => Promise.resolve({ default: MapComponent }));


// =============================
// === HALAMAN UTAMA (FINAL) ===
// =============================
export default function VillaDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const [villa, setVilla] = useState<Villa | null>(null);
    const [loading, setLoading] = useState(true);
    const [showPromo, setShowPromo] = useState(false);

    // ... (useMemo untuk harga tetap sama)
    const { isPromo, finalPrice, discountPercent } = useMemo(() => {
        if (!villa) return { isPromo: false, finalPrice: 0, discountPercent: 0 };
        const promo = villa.harga_promo && villa.harga_promo > 0 && villa.harga_promo < villa.harga;
        const price = promo ? villa.harga_promo! : villa.harga;
        const discount = promo ? Math.round(((villa.harga - villa.harga_promo!) / villa.harga) * 100) : 0;
        return { isPromo: promo, finalPrice: price, discountPercent: discount };
    }, [villa]);
    
    // ... (useMemo untuk structured data tetap sama)
    const structuredData = useMemo(() => {
        if (!villa) return null;
        const availability = villa.status === 'Sold Out' ? "https://schema.org/SoldOut" : "https://schema.org/InStock";
        const schema = { "@context": "https://schema.org", "@type": "RealEstateListing", "name": villa.nama_listing, "description": villa.deskripsi_singkat, "image": villa.foto_urls && villa.foto_urls.length > 0 ? villa.foto_urls[0] : '', "url": `https://URL-WEBSITE-ANDA.com/listing/${villa.slug}`, "address": { "@type": "PostalAddress", "streetAddress": villa.alamat_lengkap }, "offers": { "@type": "Offer", "price": finalPrice, "priceCurrency": "IDR", "availability": availability }, "additionalProperty": [ { "@type": "PropertyValue", "name": "Tipe Villa", "value": villa.tipe_villa }, { "@type": "PropertyValue", "name": "Private Pool", "value": villa.memiliki_private_pool ? "Ya" : "Tidak" } ] };
        return JSON.stringify(schema);
    }, [villa, finalPrice]);

    // --- Efek untuk Fetch Data & Popup Promo ---
    useEffect(() => {
        const fetchVilla = async () => {
            if (!slug) { setLoading(false); return; }
            window.scrollTo(0, 0);
            const { data, error } = await supabase.from('villa_listings').select('*').eq('slug', slug).single();
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

    useEffect(() => {
        if (!villa || loading) return;

        // Trigger Popup di Desktop (Exit Intent)
        const handleMouseOut = (e: MouseEvent) => {
            if (e.clientY <= 0) {
                setShowPromo(true);
                document.removeEventListener('mouseout', handleMouseOut);
            }
        };
        // Trigger Popup di Mobile (Setelah 10 detik)
        const mobileTimer = setTimeout(() => {
            setShowPromo(true);
        }, 10000); // 10 detik

        document.addEventListener('mouseout', handleMouseOut);

        return () => {
            document.removeEventListener('mouseout', handleMouseOut);
            clearTimeout(mobileTimer);
        };
    }, [villa, loading]);


    if (loading) return <div className="flex items-center justify-center h-screen bg-white text-slate-600">Memuat Detail Villa...</div>;
    if (!villa) return <div className="text-center py-40 bg-white"><h2 className="text-2xl font-bold">Villa tidak ditemukan.</h2><Link to="/listings" className="text-sky-600 hover:underline mt-4 inline-block">Kembali ke Semua Listing</Link></div>;
    
    const whatsappLink = `https://wa.me/${villa.kontak_marketing}?text=Halo,%20saya%20tertarik%20dengan%20properti%20"${villa.nama_listing}"%20dan%20ingin%20mengklaim%20promo%20spesial.`;
    const metaDescription = `Cari tahu detail investasi properti villa ${villa.nama_listing} di ${villa.alamat_lengkap}. Lihat fasilitas, potensi keuntungan, dan harga promo terbaru. Hubungi kami untuk survei lokasi.`;
    
    // Komponen Kartu Harga & CTA (untuk mobile & desktop)
    const PriceCard = ({ isSticky = false }: { isSticky?: boolean}) => (
        <div className={`p-6 bg-white border border-slate-200/80 rounded-2xl shadow-lg ${isSticky ? 'sticky top-24' : ''}`}>
            {isPromo && <div className="mb-2 flex items-center gap-2"><span className="text-sm text-slate-400 line-through">{formatHarga(villa.harga)}</span><span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-md">DISKON {discountPercent}%</span></div>}
            <p className={`text-3xl font-extrabold mb-6 ${isPromo ? 'text-red-600' : 'text-slate-900'}`}>{formatHarga(finalPrice)}</p>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-green-600 transition-all text-center block flex items-center justify-center gap-2 transform hover:-translate-y-1"><Phone size={18} /> Hubungi Konsultan</a>
            <p className="text-xs text-slate-400 text-center mt-4">Tanyakan detail & jadwal survei.</p>
        </div>
    );

    return (
        <>
            <Helmet>
                <title>{`Investasi Villa ${villa.nama_listing} di Yogyakarta | Harga & Detail`}</title>
                <meta name="description" content={metaDescription} />
                <link rel="canonical" href={`https://URL-WEBSITE-ANDA.com/listing/${villa.slug}`} />
                <meta property="og:title" content={`Investasi Villa ${villa.nama_listing} di Yogyakarta`} />
                <meta property="og:description" content={metaDescription} />
                <meta property="og:image" content={villa.foto_urls && villa.foto_urls.length > 0 ? villa.foto_urls[0] : ''} />
                <meta property="og:url" content={`https://URL-WEBSITE-ANDA.com/listing/${villa.slug}`} />
                <meta property="og:type" content="product" />
                {structuredData && <script type="application/ld+json">{structuredData}</script>}
            </Helmet>
            
            <AnimatePresence>
                {isPromo && showPromo && <PromoPopup villa={villa} onClose={() => setShowPromo(false)} whatsappLink={whatsappLink} />}
            </AnimatePresence>
            
            <main className="bg-white">
                <div className="container mx-auto px-4 lg:px-8 pt-6 md:pt-8">
                    <Link to="/listings" className="text-sm text-sky-600 hover:text-sky-800 flex items-center gap-1 w-fit mb-4"><ChevronLeft size={16}/> Kembali ke Semua Listing</Link>
                    <div className="py-2">
                        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900">{villa.nama_listing}</h1>
                        <p className="text-slate-500 mt-2 flex items-center gap-2 text-sm md:text-base"><MapPin size={16}/> {villa.alamat_lengkap}</p>
                    </div>
                </div>
                
                <Suspense fallback={<div className="container mx-auto px-4 lg:px-8 mt-4"><div className="aspect-video w-full bg-slate-200 rounded-2xl animate-pulse"></div></div>}>
                    <div className="container mx-auto px-4 lg:px-8 mt-4">
                        <LazyImageGallery photos={villa.foto_urls} villaName={villa.nama_listing} />
                    </div>
                </Suspense>

                {/* --- STRUKTUR KONTEN BARU (MOBILE-FIRST) --- */}
                <div className="container mx-auto px-4 lg:px-8 mt-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-8">
                        
                        {/* Kolom Kiri: Informasi Utama (Tampil di atas pada mobile) */}
                        <div className="lg:col-span-2 space-y-8">
                           {/* Kartu Harga & CTA untuk Mobile */}
                           <div className="lg:hidden">
                               <PriceCard />
                           </div>
                           
                           {/* Ringkasan Investasi */}
                           <section>
                                <h2 className="text-xl font-bold text-slate-800 mb-4">Ringkasan Investasi</h2>
                                <div className="bg-slate-50 p-5 md:p-6 rounded-2xl border border-slate-200/80 space-y-5">
                                    {villa.perkiraan_passive_income && <HighlightItem icon={<TrendingUp size={20}/>} title={`Estimasi Passive Income`} subtitle={`${formatHarga(villa.perkiraan_passive_income)} / Bulan`} />}
                                    {villa.jaminan_bep && <HighlightItem icon={<Award size={20}/>} title={`Jaminan BEP ${villa.jaminan_bep}`} subtitle="Diaktakan resmi di depan notaris."/>}
                                    {villa.free_stay && <HighlightItem icon={<CheckCircle size={20}/>} title={`Gratis Menginap ${villa.free_stay}`} subtitle="Nikmati hasil investasi Anda."/>}
                                </div>
                            </section>
                            
                            {/* Deskripsi & Fasilitas */}
                            <VillaDescription content={villa.deskripsi_panjang || villa.deskripsi_singkat} />
                            {villa.fasilitas && villa.fasilitas.length > 0 && (
                                <section>
                                    <h2 className="text-xl font-bold text-slate-800 mb-4">Fasilitas Lengkap</h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
                                        {villa.fasilitas.map(item => (<div key={item} className="flex items-center gap-3"><CheckCircle size={18} className="text-green-500 flex-shrink-0" /><span className="text-slate-700">{item}</span></div>))}
                                    </div>
                                </section>
                            )}
                        </div>
                        
                        {/* Kolom Kanan: CTA sticky untuk Desktop */}
                        <aside className="hidden lg:block">
                            <PriceCard isSticky={true} />
                        </aside>

                    </div>
                </div>

                {villa.lokasi_maps_iframe_url && (
                    <section className="py-12 md:py-16">
                         <div className="container mx-auto px-4 lg:px-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 md:mb-8 text-center">Lokasi Properti</h2>
                            <Suspense fallback={<div className="h-[400px] w-full bg-slate-200 rounded-2xl animate-pulse"></div>}>
                                <LazyMap src={villa.lokasi_maps_iframe_url} title={villa.nama_listing} />
                            </Suspense>
                         </div>
                    </section>
                )}
            </main>
        </>
    );
}