// src/components/Header.tsx
import React, { useState, useEffect } from 'react';
import { Building, Menu, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { id: 'home', label: 'Beranda' },
  { id: 'about', label: 'Keunggulan' },
  { id: 'listings', label: 'Pilihan Villa' },
  { id: 'contact', label: 'Simulasi Profit' },
  { id: 'faq', label: 'FAQ' },
];

const mobileMenuVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
  exit: { opacity: 0 }
};

const mobileMenuItemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

interface HeaderProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export default function Header({ currentSection, onSectionChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    onSectionChange(sectionId);
    setIsMenuOpen(false);
  };

  const handleWhatsApp = () => {
    window.open(
      'https://wa.me/6283144940611?text=Halo,%20saya%20tertarik%20dengan%20investasi%20villa%20di%20Jogja',
      '_blank'
    );
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300
          bg-white/20 backdrop-blur-lg border-b
          ${hasScrolled ? 'border-white/30 shadow-sm' : 'border-white/10'}
        `}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="flex items-center gap-2.5">
              <Building
                size={28}
                className={`${hasScrolled ? 'text-sky-600' : 'text-white'} transition-colors`}
              />
              <div>
                <h1
                  className={`text-xl font-extrabold bg-clip-text text-transparent transition-colors
                    ${hasScrolled ? 'from-slate-800 to-sky-700 bg-gradient-to-r' : 'from-white to-slate-200 bg-gradient-to-r'}
                  `}
                >
                  Haspro Villa
                </h1>
                <p className={`text-xs -mt-1 ${hasScrolled ? 'text-slate-500' : 'text-slate-300'}`}>
                  Villa Investasi
                </p>
              </div>
            </a>

            {/* Menu desktop */}
            <nav className="hidden md:flex items-center gap-1">
              {menuItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-md
                    ${currentSection === item.id
                      ? (hasScrolled ? 'text-sky-600' : 'text-white')
                      : (hasScrolled ? 'text-slate-700 hover:text-sky-600' : 'text-slate-300 hover:text-white')}
                  `}
                >
                  {item.label}
                  {currentSection === item.id && (
                    <motion.div
                      className={`absolute bottom-[-9px] left-0 right-0 h-0.5 ${hasScrolled ? 'bg-sky-600' : 'bg-white'}`}
                      layoutId="underline"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </a>
              ))}
            </nav>

            {/* Tombol WhatsApp desktop */}
            <div className="hidden md:flex items-center">
              <button
                onClick={handleWhatsApp}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all transform hover:scale-105 shadow-lg
                  ${hasScrolled
                    ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white hover:shadow-sky-300/50'
                    : 'bg-white/20 text-white border border-white/40 hover:bg-white/30'}
                `}
              >
                <Phone size={16} />
                <span>Hubungi Kami</span>
              </button>
            </div>

            {/* Tombol menu mobile */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className={`md:hidden p-2 ${hasScrolled ? 'text-slate-800' : 'text-white'}`}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Menu overlay mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-slate-900/95 backdrop-blur-lg z-50 flex flex-col items-center justify-center p-4 md:hidden"
          >
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-5 p-2 text-slate-300">
              <X size={28} />
            </button>

            <motion.nav className="flex flex-col items-center gap-4 text-center" variants={mobileMenuVariants}>
              {menuItems.map((item) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  variants={mobileMenuItemVariants}
                  className={`text-2xl font-medium py-2 ${currentSection === item.id ? 'text-sky-400' : 'text-slate-200 hover:text-white'}`}
                >
                  {item.label}
                </motion.a>
              ))}
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
