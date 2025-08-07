// src/components/Header.tsx
import React, { useState, useEffect } from 'react';
import { Building, Menu, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

// Didefinisikan di luar agar tidak dibuat ulang pada setiap render
const menuItems = [
  { id: 'home', label: 'Beranda' },
  { id: 'about', label: 'Keunggulan' },
  { id: 'listings', label: 'Pilihan Villa' },
  { id: 'contact', label: 'Simulasi Profit' },
  { id: 'faq', label: 'FAQ' },
];

export default function Header({ currentSection, onSectionChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Efek untuk mendeteksi scroll dan mengubah tampilan header
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Cek posisi awal saat mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efek untuk mencegah scrolling body saat menu mobile terbuka
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMenuOpen]);

  const handleNavClick = (sectionId: string) => {
    onSectionChange(sectionId);
    setIsMenuOpen(false); // Selalu tutup menu setelah link diklik
  };
  
  const handleWhatsApp = () => {
    window.open('https://wa.me/6283144940611?text=Halo,%20saya%20tertarik%20dengan%20investasi%20villa%20di%20Jogja', '_blank');
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${hasScrolled ? 'bg-white/90 backdrop-blur-sm border-b border-slate-200/80 shadow-sm' : 'bg-transparent'}`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <a href="#home" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }} className="flex items-center gap-2">
              <Building size={28} className="text-sky-600" />
              <div>
                 <h1 className={`text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r transition-colors ${hasScrolled ? 'from-slate-800 to-sky-700' : 'from-white to-slate-200'}`}>
                   HasproVilla
                 </h1>
                 <p className={`text-xs -mt-1 transition-colors ${hasScrolled ? 'text-slate-500' : 'text-slate-300'}`}>Villa Investasi</p>
              </div>
            </a>

            {/* Menu Desktop */}
            <nav className="hidden md:flex items-center gap-8">
              {menuItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => { e.preventDefault(); handleNavClick(item.id); }}
                  className={`text-sm font-medium transition-colors duration-300 relative pb-1 ${
                    currentSection === item.id
                      ? (hasScrolled ? 'text-sky-600' : 'text-white')
                      : (hasScrolled ? 'text-slate-600 hover:text-sky-600' : 'text-slate-300 hover:text-white')
                  }`}
                >
                  {item.label}
                  {currentSection === item.id && (
                    <motion.div 
                      className={`absolute bottom-0 left-0 right-0 h-0.5 ${hasScrolled ? 'bg-sky-600' : 'bg-white'}`} 
                      layoutId="underline" 
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </a>
              ))}
            </nav>

            {/* Tombol CTA Desktop */}
            <button
              onClick={handleWhatsApp}
              className={`hidden md:flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-md ${hasScrolled ? 'bg-slate-900 text-white hover:bg-slate-700' : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'}`}
            >
              <Phone size={16} />
              <span>Hubungi Kami</span>
            </button>

            {/* Tombol Menu Mobile */}
            <button onClick={() => setIsMenuOpen(true)} className={`md:hidden p-2 transition-colors ${hasScrolled ? 'text-slate-800' : 'text-white'}`} aria-label="Buka menu">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Menu Overlay Mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4 md:hidden"
          >
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-5 p-2 text-slate-300" aria-label="Tutup menu">
              <X size={28} />
            </button>
            
            <nav className="flex flex-col items-center gap-8 text-center">
              {menuItems.map((item) => (
                <a key={item.id} href={`#${item.id}`} onClick={() => handleNavClick(item.id)}
                  className="text-2xl font-medium text-slate-200 hover:text-sky-400 transition-colors">
                  {item.label}
                </a>
              ))}
            </nav>

            <button onClick={handleWhatsApp}
              className="flex items-center gap-2 border-2 border-green-500 text-green-400 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-500 hover:text-white transition-colors mt-12">
              <Phone size={20} />
              <span>Konsultasi WhatsApp</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}