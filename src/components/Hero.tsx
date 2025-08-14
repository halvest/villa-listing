// src/components/Hero.tsx
import React, { useState, useEffect } from 'react';
import { ArrowRight, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import gambar lokal
import heroImage1 from '../assets/images/gate-lodjisvarga-seturan.jpg';
import heroImage2 from '../assets/images/lodjisvarga-seturan.jpg';
import heroImage3 from '../assets/images/valeeqa-villa.jpg';
import heroImage4 from '../assets/images/valeqaa-villa-row.jpg';

const heroImages = [heroImage1, heroImage2, heroImage3, heroImage4];

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

  // Preload semua gambar saat komponen mount
  useEffect(() => {
    let loadedCount = 0;
    heroImages.forEach((src, idx) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        // Kalau gambar pertama sudah load, tampilkan hero
        if (idx === 0) {
          setIsFirstLoaded(true);
        }
      };
    });
  }, []);

  // Slideshow otomatis
  useEffect(() => {
    if (!isFirstLoaded) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
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
      {/* Background hanya muncul jika gambar pertama sudah load */}
      {isFirstLoaded && (
        <AnimatePresence mode="wait">
          <BackgroundImage
            key={currentImageIndex}
            src={heroImages[currentImageIndex]}
            alt="Pemandangan villa Haspro di Yogyakarta"
          />
        </AnimatePresence>
      )}

      {/* Overlay gradasi */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20 z-10"></div>

      {/* Konten */}
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
            Miliki Aset Produktif, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-sky-500 drop-shadow-lg">
              Nikmati Kebebasan Finansial.
            </span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-slate-300 mb-10">
            Aset properti di destinasi terbaik, dikelola profesional, dengan legalitas terjamin dan potensi ROI yang terukur.
          </p>
        </motion.div>

        {/* Tombol aksi */}
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
            <span>Lihat Properti</span>
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
