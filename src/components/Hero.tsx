// src/components/Hero.tsx
import React, { useState, useEffect } from 'react';
import { ArrowRight, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import gambar lokal dan buat struktur data yang lebih baik untuk SEO
import heroImage1 from '../assets/images/gate-lodjisvarga-seturan.jpg';
import heroImage2 from '../assets/images/lodjisvarga-seturan.jpg';
import heroImage3 from '../assets/images/valeeqa-villa.jpg';
import heroImage4 from '../assets/images/valeqaa-villa-row.jpg';

// Mengubah array gambar menjadi array objek untuk alt text yang dinamis
const heroData = [
  { src: heroImage1, alt: 'Gerbang utama Lodjisvarga Seturan, pilihan investasi villa di Yogyakarta.' },
  { src: heroImage2, alt: 'Tampak depan villa Lodjisvarga Seturan dengan kolam renang pribadi.' },
  { src: heroImage3, alt: 'Valeeqa Villa, alternatif investasi properti premium di Jogja.' },
  { src: heroImage4, alt: 'Deretan unit Valeeqa Villa, cocok untuk investasi jangka panjang.' },
];

interface HeroProps {
  onSectionChange: (section: string) => void;
}

const BackgroundImage = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <motion.div
      role="img"
      aria-label={alt}
      initial={{ scale: 1.1, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 1.05, opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
      className="absolute inset-0 w-full h-full bg-cover bg-center animate-kenburns"
      style={{ backgroundImage: `url(${src})` }}
    />
  );
};

export default function Hero({ onSectionChange }: HeroProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFirstLoaded, setIsFirstLoaded] = useState(false);

  useEffect(() => {
    heroData.forEach((item, idx) => {
      const img = new Image();
      img.src = item.src;
      img.onload = () => {
        if (idx === 0) {
          setIsFirstLoaded(true);
        }
      };
    });
  }, []);

  useEffect(() => {
    if (!isFirstLoaded) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroData.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isFirstLoaded]);

  const handleWhatsApp = () => {
    window.open(
      'https://wa.me/6283144940611?text=Halo,%20saya%20tertarik%20dengan%20investasi%20villa%20di%20Jogja',
      '_blank'
    );
  };

  return (
    <section
      id="home"
      className="relative min-h-[90vh] sm:min-h-screen w-full flex items-center justify-center text-white overflow-hidden"
    >
      {isFirstLoaded && (
        <AnimatePresence mode="wait">
          <BackgroundImage
            key={currentImageIndex}
            src={heroData[currentImageIndex].src}
            alt={heroData[currentImageIndex].alt}
          />
        </AnimatePresence>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20 z-10"></div>

      <div className="relative z-20 flex flex-col items-center text-center px-4 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <span className="text-sm md:text-base font-semibold text-sky-300 uppercase tracking-widest">
            Investasi Villa Premium di Yogyakarta
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter my-4 text-white">
            Investasi Villa di Jogja: Aset Produktif,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-sky-500 drop-shadow-lg">
              Raih Kebebasan Finansial Anda.
            </span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-slate-300 mb-10">
            Wujudkan impian memiliki <strong>properti villa</strong> di lokasi strategis Yogyakarta. Sebuah <strong>bentuk investasi jangka panjang</strong> yang dikelola secara profesional, dengan legalitas aman dan potensi keuntungan menjanjikan.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row gap-4 group"
        >
          <button
            onClick={() => onSectionChange('listings')}
            className="group font-semibold py-3 px-8 rounded-full shadow-lg flex items-center justify-center gap-2 text-white bg-sky-600 border-2 border-sky-600 hover:bg-sky-500 hover:border-sky-500 transition-all duration-300 transform hover:scale-105"
          >
            <span>Lihat Unit Tersedia</span>
            <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <button
            onClick={handleWhatsApp}
            className="font-semibold py-3 px-8 rounded-full flex items-center justify-center gap-2 text-white bg-white/5 border-2 border-white/20 backdrop-blur-sm hover:bg-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-105"
          >
            <Phone size={18} />
            <span>Hubungi Konsultan</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}