// src/components/About.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, TrendingUp } from 'lucide-react';
import type { Icon } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// ====== Reusable Pillar Card Component ======
interface PillarCardProps {
  icon: React.ReactElement<Icon>;
  title: string;
  description: string;
}

const PillarCard: React.FC<PillarCardProps> = ({ icon, title, description }) => (
  <div className="flex flex-col bg-white p-6 md:p-8 rounded-2xl border border-slate-200 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
    <div className="inline-flex items-center justify-center p-4 bg-sky-50 rounded-full mb-5 border border-sky-100 mx-auto">
      {React.cloneElement(icon, { "aria-hidden": true })}
    </div>
    <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-3">{title}</h3>
    <p className="text-sm md:text-base text-slate-600 leading-relaxed">{description}</p>
  </div>
);

// ====== Data for Pillars ======
const PILLARS_DATA = [
  {
    icon: <Award size={28} className="text-sky-500" />,
    title: 'Aset Terpilih',
    description: 'Properti yang dipilih melalui seleksi ketat untuk memastikan kualitas dan potensi nilai di masa depan.',
  },
  {
    icon: <ShieldCheck size={28} className="text-sky-500" />,
    title: 'Pengelolaan Profesional',
    description: 'Dari legalitas, pemasaran, hingga perawatan—dikelola oleh tim berpengalaman.',
  },
  {
    icon: <TrendingUp size={28} className="text-sky-500" />,
    title: 'Potensi Keuntungan',
    description: 'Lokasi strategis dengan peluang pendapatan optimal jika dikelola dengan baik.',
  },
];

// ====== Animation Variants ======
const fadeInStagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  viewport: { once: true, amount: 0.3 },
};

const fadeInItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

// ====== Main Component ======
const About = React.memo(() => {
  return (
    <section id="about" className="relative py-16 md:py-24 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4">
        
        {/* ===== Heading ===== */}
        <motion.div
          className="max-w-2xl md:max-w-3xl mx-auto text-center mb-12 md:mb-16"
          variants={fadeInStagger}
          initial="initial"
          whileInView="whileInView"
        >
          <motion.span
            variants={fadeInItem}
            className="font-semibold text-sky-600 uppercase tracking-wider text-sm md:text-base"
          >
            Tentang Kami
          </motion.span>
          <motion.h2
            variants={fadeInItem}
            className="text-3xl md:text-5xl font-extrabold mt-3 mb-4 text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-sky-700"
          >
            Platform Listing Villa Investasi
          </motion.h2>
          <motion.p
            variants={fadeInItem}
            className="text-base md:text-lg text-slate-600 leading-relaxed"
          >
            Haspro Villa menghadirkan properti pilihan untuk investasi strategis, 
            dikelola dengan profesional dan transparan, demi kenyamanan dan hasil optimal.
          </motion.p>
        </motion.div>

        {/* ===== Swiper for Pillars ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Swiper
            modules={[Pagination, A11y]}
            pagination={{ clickable: true }}
            grabCursor={true}
            className="!pb-12"
            slidesPerView={1.05}
            spaceBetween={12}
            centeredSlides={true}
            breakpoints={{
              640: { slidesPerView: 1.5, spaceBetween: 16 },
              768: { slidesPerView: 2.5, spaceBetween: 24, centeredSlides: false },
              1024: { slidesPerView: 3, spaceBetween: 28, centeredSlides: false },
            }}
          >
            {PILLARS_DATA.map((pillar) => (
              <SwiperSlide key={pillar.title} className="pb-4">
                <PillarCard {...pillar} />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* ===== Disclaimer ===== */}
        <p className="text-xs text-slate-500 text-center mt-8 max-w-xl mx-auto leading-relaxed">
          <strong>Disclaimer:</strong> Informasi ini bersifat umum, bukan jaminan keuntungan. 
          Hasil investasi dapat bervariasi tergantung pasar, lokasi, dan faktor operasional.
        </p>
      </div>

      {/* Swiper Custom Pagination Style */}
      <style>{`
        .swiper-pagination-bullet {
          background-color: #cbd5e1;
          opacity: 1;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          background-color: #0ea5e9;
          width: 20px;
          border-radius: 6px;
        }
      `}</style>
    </section>
  );
});

export default About;
