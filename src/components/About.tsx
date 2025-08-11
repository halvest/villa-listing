// src/components/About.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, TrendingUp } from 'lucide-react';
import type { Icon } from 'lucide-react';

// Swiper Components & Styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// --- Komponen Kartu Pilar yang Disesuaikan Temanya ---
interface PillarCardProps {
  icon: React.ReactElement<Icon>;
  title: string;
  description: string;
}

const PillarCard: React.FC<PillarCardProps> = ({ icon, title, description }) => (
  <div className="flex flex-col bg-white p-8 rounded-2xl border border-slate-200 text-center shadow-md h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div className="inline-block p-4 bg-sky-100 rounded-full mb-6 border border-sky-200 mx-auto">
      {/* Ikon dengan warna aksen yang lebih kuat & aksesibilitas */}
      {React.cloneElement(icon, { "aria-hidden": true })}
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </div>
);

// --- Data Pilar dengan Ikon yang Telah Disesuaikan Warnanya ---
const PILLARS_DATA = [
  {
    icon: <Award size={28} className="text-sky-500" />, // Warna disesuaikan
    title: 'Aset Terpilih',
    description: 'Setiap properti telah melalui proses seleksi ketat untuk memastikan kualitas bangunan dan potensi pengembangan di masa depan.',
  },
  {
    icon: <ShieldCheck size={28} className="text-sky-500" />, // Warna disesuaikan
    title: 'Pengelolaan Profesional',
    description: 'Mulai dari legalitas, pemasaran, hingga pemeliharaan, seluruh proses dikelola oleh tim yang berpengalaman.',
  },
  {
    icon: <TrendingUp size={28} className="text-sky-500" />, // Warna disesuaikan
    title: 'Potensi Keuntungan',
    description: 'Dengan lokasi strategis dan operasional yang tepat, setiap unit berpeluang menghasilkan pendapatan optimal.',
  },
];

// Varian animasi Framer Motion
const fadeInStagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.2 } },
  viewport: { once: true, amount: 0.3 },
};

const fadeInAnimation = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

// Komponen About utama
const About = React.memo(() => {
  return (
    // --- PENYESUAIAN TEMA: Latar Belakang & Padding ---
    // Menggunakan bg-slate-50 agar konsisten dengan VillaListings
    <section id="about" className="relative scroll-mt-20 py-24 md:py-32 overflow-hidden bg-slate-50">
      <div className="container relative z-10 mx-auto px-4">
        {/* --- PENYESUAIAN TEMA: Judul & Tipografi --- */}
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16 md:mb-20"
          variants={fadeInStagger}
          initial="initial"
          whileInView="whileInView"
        >
          <motion.span
            variants={fadeInAnimation}
            className="font-semibold text-sky-600 uppercase tracking-wider"
          >
            Tentang Kami Haspro Villa
          </motion.span>
          <motion.h2
            variants={fadeInAnimation}
            // Mengadopsi gaya judul gradien dari VillaListings
            className="text-4xl md:text-5xl font-extrabold my-4 text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-sky-700"
          >
            Platform Listing <br></br> Villa Investasi
          </motion.h2>
          <motion.p
            variants={fadeInAnimation}
            // Menggunakan warna teks slate-600
            className="text-lg text-slate-600 leading-relaxed"
          >
            Haspro Villa menghadirkan pilihan properti bagi Anda yang mencari peluang investasi di sektor villa. Kami memadukan lokasi potensial, manajemen berpengalaman, dan proses transparan untuk investasi yang lebih nyaman dan terencana.
          </motion.p>
        </motion.div>

        {/* Pilar Investasi dengan Swiper */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <Swiper
            modules={[Pagination, A11y]}
            pagination={{ clickable: true }}
            grabCursor={true}
            className="!pb-16"
            slidesPerView={1.2}
            spaceBetween={15}
            centeredSlides={true}
            breakpoints={{
              768: { slidesPerView: 2.5, spaceBetween: 30, centeredSlides: false },
              1024: { slidesPerView: 3, spaceBetween: 30, centeredSlides: false },
            }}
          >
            {PILLARS_DATA.map((pillar) => (
              <SwiperSlide key={pillar.title} className="h-auto pb-4">
                <PillarCard
                  icon={pillar.icon}
                  title={pillar.title}
                  description={pillar.description}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* --- PENYESUAIAN TEMA: Teks Disclaimer --- */}
        <p className="text-xs text-slate-500 text-center mt-10 max-w-2xl mx-auto leading-relaxed">
          <strong>Disclaimer:</strong> Informasi pada halaman ini disajikan untuk tujuan umum dan bukan merupakan janji keuntungan atau jaminan hasil investasi. Potensi pendapatan dapat berbeda-beda tergantung pada kondisi pasar, lokasi properti, dan faktor operasional lainnya.
        </p>
      </div>

      {/* --- PENYESUAIAN TEMA: Pagination Swiper --- */}
      <style>{`
        .swiper-pagination-bullet {
          background-color: #e2e8f0; /* slate-200 */
          width: 10px;
          height: 10px;
          transition: all 0.3s ease;
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background-color: #0ea5e9; /* sky-500 */
          width: 24px;
          border-radius: 5px;
        }
      `}</style>
    </section>
  );
});

export default About;