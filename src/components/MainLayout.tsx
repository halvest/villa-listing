// src/components/MainLayout.tsx
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

// Definisikan tipe untuk context agar lebih aman
type OutletContextType = {
  setCurrentSection: (section: string) => void;
  handleSectionChange: (sectionId: string) => void;
};

export default function MainLayout() {
  const [currentSection, setCurrentSection] = useState('home');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Jika kita tidak di halaman utama, jangan sorot menu section manapun
    if (location.pathname !== '/') {
      setCurrentSection('');
    } else {
      // Jika kembali ke halaman utama, set default ke 'home'
      setCurrentSection('home');
    }
  }, [location.pathname]);

  const handleSectionChange = (sectionId: string) => {
    if (location.pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Kembali ke halaman utama sambil "membawa pesan" untuk scroll
      navigate('/', { state: { scrollToSection: sectionId } });
    }
  };

  return (
    <div className="bg-white">
      <Header currentSection={currentSection} onSectionChange={handleSectionChange} />
      
      {/* Konten utama dengan padding atas seukuran tinggi header */}
      <main className="pt-20">
        {/* --- PERBAIKAN DI SINI: Tambahkan handleSectionChange ke context --- */}
        <Outlet context={{ setCurrentSection, handleSectionChange }} />
      </main>

      <Footer />
    </div>
  );
}