// src/components/MainLayout.tsx
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

type OutletContextType = {
  setCurrentSection: (section: string) => void;
  handleSectionChange: (sectionId: string) => void;
};

export default function MainLayout() {
  const [currentSection, setCurrentSection] = useState('home');
  const navigate = useNavigate();
  const location = useLocation();

  // Update currentSection saat berpindah halaman
  useEffect(() => {
    if (location.pathname !== '/') {
      setCurrentSection('');
    } else {
      setCurrentSection('home');
    }
  }, [location.pathname]);

  // Scroll otomatis ke section saat navigate dari halaman lain
  useEffect(() => {
    if (location.pathname === '/' && location.state?.scrollToSection) {
      const targetSection = location.state.scrollToSection;
      setTimeout(() => {
        document.getElementById(targetSection)?.scrollIntoView({ behavior: 'smooth' });
      }, 300); // Delay sedikit agar DOM siap
    }
  }, [location]);

  const handleSectionChange = (sectionId: string) => {
    if (location.pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollToSection: sectionId } });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Header glass effect */}
      <Header
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
      />

      {/* Main content (beri jarak dari header fixed) */}
      <main className="pt-20">
        <Outlet context={{ setCurrentSection, handleSectionChange } satisfies OutletContextType} />
      </main>

      <Footer />
    </div>
  );
}
