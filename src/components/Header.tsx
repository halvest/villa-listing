// src/components/Header.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Building, Menu, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Tipe Data & Konfigurasi Menu ---
interface MenuItem {
  id: string;
  label: string;
  to?: string; // Opsional: untuk link navigasi antar halaman
}

const menuItems: MenuItem[] = [
  { id: 'home', label: 'Beranda' },
  { id: 'about', label: 'Tentang Kami' },
  { id: 'listings', label: 'Pilihan Villa', to: '/listings' },
  { id: 'contact', label: 'Simulasi Profit' },
  { id: 'faq', label: 'FAQ' },
];

// --- Varian Animasi ---
const mobileMenuVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
  exit: { opacity: 0 }
};

const mobileMenuItemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

// --- Props Komponen ---
interface HeaderProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

// --- Komponen Utama Header ---
export default function Header({ currentSection, onSectionChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (item: MenuItem) => {
    setIsMenuOpen(false);
    if (item.to) {
      navigate(item.to);
    } else {
      onSectionChange(item.id);
    }
  };

  const handleWhatsApp = () => {
    window.open(
      'https://wa.me/6283144940611?text=Halo,%20saya%20tertarik%20dengan%20investasi%20villa%20di%20Jogja',
      '_blank'
    );
  };

  const NavItem = ({ item, isMobile = false }: { item: MenuItem, isMobile?: boolean }) => {
    const isActive = 
      (location.pathname === '/' && currentSection === item.id) || 
      (item.to && location.pathname.startsWith(item.to));

    const mobileClasses = `text-2xl font-medium py-2 ${isActive ? 'text-sky-400' : 'text-slate-200 hover:text-white'}`;
    
    const desktopClasses = `relative px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
      isActive
        ? (hasScrolled ? 'text-sky-600' : 'text-white')
        : (hasScrolled ? 'text-slate-700 hover:text-sky-600' : 'text-slate-300 hover:text-white')
    }`;
    
    const navElement = (
      <button onClick={() => handleNavClick(item)} className={isMobile ? mobileClasses : desktopClasses}>
        {item.label}
        {isActive && !isMobile && (
          <motion.div
            className={`absolute bottom-0 left-1 right-1 h-0.5 ${hasScrolled ? 'bg-sky-600' : 'bg-white'}`}
            layoutId="underline"
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
      </button>
    );

    return isMobile ? (
      <motion.div key={item.id} variants={mobileMenuItemVariants}>
        {navElement}
      </motion.div>
    ) : (
      navElement
    );
  };
  
  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          hasScrolled 
            ? 'h-16 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm' 
            : 'h-20 bg-slate-900/20 backdrop-blur-sm border-b border-white/10'
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between h-full">
          {/* Logo */}
          <button onClick={() => handleNavClick({id: 'home', label: 'Beranda'})} className="flex items-center gap-2.5">
            <Building size={28} className={`${hasScrolled ? 'text-sky-600' : 'text-white'} transition-colors`} />
            <div>
              <h1 className={`text-xl font-extrabold bg-clip-text text-transparent transition-colors ${hasScrolled ? 'from-slate-800 to-sky-700 bg-gradient-to-r' : 'from-white to-slate-200 bg-gradient-to-r'}`}>
                Haspro Villa
              </h1>
              <p className={`text-xs -mt-1 ${hasScrolled ? 'text-slate-500' : 'text-slate-300'}`}>
                Villa Investasi
              </p>
            </div>
          </button>

          {/* Menu desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {menuItems.map(item => <NavItem key={item.id} item={item} />)}
          </nav>

          {/* Tombol WhatsApp desktop */}
          <div className="hidden md:flex items-center">
            <button
              onClick={handleWhatsApp}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all transform hover:scale-105 shadow-lg ${
                hasScrolled
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white hover:shadow-sky-300/50'
                  : 'bg-white/20 text-white border border-white/40 hover:bg-white/30'
              }`}
            >
              <Phone size={16} />
              <span>Hubungi Kami</span>
            </button>
          </div>

          {/* Tombol menu mobile */}
          <button onClick={() => setIsMenuOpen(true)} className={`md:hidden p-2 ${hasScrolled ? 'text-slate-800' : 'text-white'}`}>
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Menu overlay mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={mobileMenuVariants} initial="hidden" animate="visible" exit="exit"
            className="fixed inset-0 bg-slate-900/95 backdrop-blur-lg z-50 flex flex-col items-center justify-center p-4 md:hidden"
          >
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-5 p-2 text-slate-300">
              <X size={28} />
            </button>
            <motion.nav className="flex flex-col items-center gap-4 text-center" variants={mobileMenuVariants}>
              {menuItems.map(item => <NavItem key={item.id} item={item} isMobile />)}
            </motion.nav>
            <motion.div variants={mobileMenuItemVariants} className="mt-12 w-full px-4">
               <button
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-6 py-3.5 rounded-lg text-lg font-semibold shadow-lg shadow-sky-500/30"
              >
                <Phone size={20} />
                <span>Konsultasi WhatsApp</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}