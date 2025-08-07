// src/components/Hero.tsx
import React, { useState, useEffect } from 'react';
import { ArrowRight, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const heroImages = [
  'https://images.pexels.com/photos/259580/pexels-photo-259580.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/221540/pexels-photo-221540.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/5997993/pexels-photo-5997993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
];

interface HeroProps {
  onSectionChange: (section: string) => void;
}

const BackgroundImage = ({ src, isActive }: { src: string, isActive: boolean }) => {
  useEffect(() => {
    const img = new Image();
    img.src = src;
  }, [src]);
  
  return (
    <div
      className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 animate-kenburns' : 'opacity-0'}`}
      style={{ backgroundImage: `url(${src})` }}
    />
  );
};


export default function Hero({ onSectionChange }: HeroProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  const handleWhatsApp = () => {
    window.open('https://wa.me/6283144940611?text=Halo,%20saya%20tertarik%20dengan%20investasi%20villa%20di%20Jogja', '_blank');
  };

  return (
    <section id="home" className="relative h-screen w-full flex items-center justify-center text-white overflow-hidden">
      <AnimatePresence>
        <BackgroundImage
          key={currentImageIndex}
          src={heroImages[currentImageIndex]}
          isActive={true}
        />
      </AnimatePresence>
      
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-slate-900/20 z-10"></div>
      
      <div className="relative z-20 flex flex-col items-center text-center px-4">
        <motion.h1 
          key={`h1-${currentImageIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 text-shadow-lg"
        >
          Passive Income dari Villa Eksklusif<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-100">
            Tanpa Repot, Dikelola Profesional
          </span>
        </motion.h1>
        
        <motion.p 
          key={`p-${currentImageIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="text-lg md:text-xl max-w-2xl text-slate-200 mb-10 text-shadow"
        >
           Jaminan balik modal dalam 5 tahun melalui notaris. Legalitas hak pakai & kontrak investasi 20 tahun.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row gap-4"
        >
          {/* --- TOMBOL UTAMA (PRIMARY) --- */}
          <button
            onClick={() => onSectionChange('listings')}
            className="bg-sky-500 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-sky-600 border-2 border-sky-500 hover:border-sky-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <span>Jelajahi Properti</span>
            <ArrowRight size={20} />
          </button>
          
          {/* --- TOMBOL SEKUNDER (SECONDARY) --- */}
          <button
            onClick={handleWhatsApp}
            className="bg-white/10 backdrop-blur-sm text-white font-semibold py-3 px-8 rounded-lg border-2 border-white/80 hover:bg-white hover:text-slate-900 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <Phone size={18} />
            <span>Hubungi Konsultan</span>
          </button>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroImages.map((_, index) => (
          <button key={index} onClick={() => setCurrentImageIndex(index)} className="w-8 h-1 rounded-full transition-colors duration-300 bg-white/40 hover:bg-white/70">
             <div className={`h-full rounded-full bg-white transition-all duration-500 ${currentImageIndex === index ? 'w-full' : 'w-0'}`}></div>
          </button>
        ))}
      </div>
    </section>
  );
}