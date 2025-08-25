// src/components/Header.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Building, Menu, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Tipe Data & Konfigurasi Menu ---
interface MenuItem {
  id: string;
  label: string;
  to: string; // Selalu gunakan 'to' untuk konsistensi
}

const menuItems: MenuItem[] = [
  { id: 'home', label: 'Beranda', to: '/' },
  { id: 'about', label: 'Tentang Kami', to: '/#about' },
  { id: 'listings', label: 'Pilihan Villa', to: '/listings' },
  { id: 'contact', label: 'Simulasi Profit', to: '/#contact' },
  { id: 'faq', label: 'FAQ', to: '/#faq' },
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

  // Efek untuk menutup menu saat navigasi
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleNavClick = (to: string) => {
    const [path, hash] = to.split('#');
    
    // Jika path-nya sama dengan halaman saat ini DAN ada hash-nya (contoh: dari / ke /#about)
    if (path === location.pathname && hash) {
      onSectionChange(hash);
    } 
    // Jika hanya path (contoh: ke /listings) atau path-nya beda (contoh: dari /listings ke /#about)
    else {
      if (path === '' && hash) { // Khusus untuk navigasi ke section di homepage dari halaman lain
        navigate('/', { state: { scrollToSection: hash } });
      } else {
        navigate(path || '/');
      }
    }
  };

  const handleWhatsApp = () => {
    window.open(
      'https://wa.me/6283144940611?text=Halo,%20saya%20tertarik%20dengan%20investasi%20villa%20di%20Jogja',
      '_blank'
    );
  };

  // Sub-komponen NavItem yang sudah dioptimalkan
  const NavItem = ({ item, isMobile = false }: { item: MenuItem, isMobile?: boolean }) => {
    const { id, label, to } = item;
    const [path, hash] = to.split('#');

    const isActive = 
      (location.pathname === '/' && hash && currentSection === hash) || // Aktif berdasarkan scroll di homepage
      (location.pathname === '/' && !hash && currentSection === 'home') || // Aktif untuk link 'Beranda'
      (path && path !== '/' && location.pathname.startsWith(path)); // Aktif berdasarkan path halaman

    const commonProps = {
      'aria-current': isActive ? ('page' as const) : undefined,
    };

    const mobileClasses = `text-2xl font-medium py-2 ${isActive ? 'text-sky-400' : 'text-slate-200 hover:text-white'}`;
    const desktopClasses = `relative px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
      isActive
        ? (hasScrolled ? 'text-sky-600' : 'text-white')
        : (hasScrolled ? 'text-slate-700 hover:text-sky-600' : 'text-slate-300 hover:text-white')
    }`;

    // Gunakan Link untuk navigasi internal, atau button untuk scroll di halaman yang sama
    const NavElement = () => (
      <button onClick={() => handleNavClick(to)} className={isMobile ? mobileClasses : desktopClasses} {...commonProps}>
        {label}
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
      <motion.div key={id} variants={mobileMenuItemVariants}>
        <NavElement />
      </motion.div>
    ) : <NavElement />;
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
          {/* Logo dibungkus dengan Link ke homepage */}
          <Link to="/" aria-label="Beranda Haspro Villa" className="flex items-center gap-2.5">
            <Building size={28} className={`${hasScrolled ? 'text-sky-600' : 'text-white'} transition-colors`} />
            <div>
              {/* Pastikan hanya ada SATU H1 per halaman (di Hero). Ganti ini menjadi div/p */}
              <p className={`text-xl font-extrabold bg-clip-text text-transparent transition-colors ${hasScrolled ? 'from-slate-800 to-sky-700 bg-gradient-to-r' : 'from-white to-slate-200 bg-gradient-to-r'}`}>
                Haspro Villa
              </p>
              <p className={`text-xs -mt-1 ${hasScrolled ? 'text-slate-500' : 'text-slate-300'}`}>
                Investasi Properti Villa
              </p>
            </div>
          </Link>

          {/* Navigasi Desktop menggunakan tag <nav> */}
          <nav aria-label="Navigasi Utama" className="hidden md:flex items-center gap-1">
            {menuItems.map(item => <NavItem key={item.id} item={item} />)}
          </nav>

          <div className="hidden md:flex items-center">
            <button
              onClick={handleWhatsApp}
              aria-label="Hubungi kami melalui WhatsApp"
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

          <button onClick={() => setIsMenuOpen(true)} aria-label="Buka menu navigasi" className={`md:hidden p-2 ${hasScrolled ? 'text-slate-800' : 'text-white'}`}>
            <Menu size={24} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={mobileMenuVariants} initial="hidden" animate="visible" exit="exit"
            className="fixed inset-0 bg-slate-900/95 backdrop-blur-lg z-50 flex flex-col items-center justify-center p-4 md:hidden"
          >
            <button onClick={() => setIsMenuOpen(false)} aria-label="Tutup menu navigasi" className="absolute top-6 right-5 p-2 text-slate-300">
              <X size={28} />
            </button>
            <nav aria-label="Navigasi Mobile" className="flex flex-col items-center gap-4 text-center">
              {menuItems.map(item => <NavItem key={item.id} item={item} isMobile />)}
            </nav>
            <motion.div variants={mobileMenuItemVariants} className="mt-12 w-full px-4">
               <button
                 onClick={handleWhatsApp}
                 aria-label="Konsultasi gratis melalui WhatsApp"
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