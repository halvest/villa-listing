// src/components/About.tsx
import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

import {
  FileText,
  MapPin,
  TrendingUp,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

// Konten + copywriting perbaikan
const investmentPillars = [
  {
    icon: <FileText size={32} />,
    title: 'Legalitas Hak Pakai & Investasi 20 Tahun',
    description:
      'Aset Anda dilindungi akta notaris dan perjanjian resmi. Kepemilikan jelas, aman, dan sah secara hukum.',
    color: 'sky',
  },
  {
    icon: <MapPin size={32} />,
    title: 'Lokasi Premium, Dekat Destinasi Wisata',
    description:
      'Berada di jantung pariwisata Yogyakarta. Menjamin okupansi tinggi dan nilai sewa yang optimal.',
    color: 'amber',
  },
  {
    icon: <TrendingUp size={32} />,
    title: 'Dikelola Profesional, Tanpa Ribet',
    description:
      'Tim berpengalaman menangani semua operasional—dari pemasaran, reservasi, hingga perawatan properti.',
    color: 'green',
  },
  {
    icon: <ShieldCheck size={32} />,
    title: 'Balik Modal Cepat, ROI Hingga 18%',
    description:
      'Properti produktif dengan potensi Return on Investment hingga 18% dan jaminan balik modal dalam 5 tahun.',
    color: 'blue',
  },
];

const lightColorVariants = {
  sky: { bg: 'bg-sky-100', text: 'text-sky-600' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
  green: { bg: 'bg-green-100', text: 'text-green-600' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
};

export default function About() {
  useEffect(() => {
    const swiper = document.querySelector('.swiper')?.swiper;
    if (swiper) swiper.update();
  }, []);

  return (
    <section id="about" className="py-24 md:py-32 bg-slate-50 scroll-mt-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-center md:text-left max-w-xl">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-sky-700">
              Mengapa Berinvestasi Villa di Yogyakarta? 
            </h2>
            <p className="text-lg text-slate-600">
              Yogyakarta sebagai pusat wisata menciptakan tingkat okupansi tinggi—membuka peluang investasi dengan keuntungan berkelanjutan dan potensi pertumbuhan nilai aset.
            </p>
          </div>

          {/* Navigasi */}
          <div className="flex gap-3">
            <button className="swiper-button-prev-custom w-14 h-14 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
              <ArrowLeft />
            </button>
            <button className="swiper-button-next-custom w-14 h-14 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
              <ArrowRight />
            </button>
          </div>
        </div>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Navigation, Scrollbar]}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          scrollbar={{
            draggable: true,
          }}
          spaceBetween={30}
          slidesPerView={'auto'}
          grabCursor={true}
          className="!pb-8"
        >
          {investmentPillars.map((pillar) => (
            <SwiperSlide
              key={pillar.title}
              className="!w-[340px] md:!w-[380px] !h-auto"
            >
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg h-full flex flex-col">
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 flex-shrink-0 ${lightColorVariants[pillar.color].bg}`}
                >
                  <div className={lightColorVariants[pillar.color].text}>
                    {pillar.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {pillar.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
