// src/pages/LandingPage.tsx
import React, { useRef, useEffect } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Import semua komponen section Anda
import Hero from '../components/Hero';
import About from '../components/About';
import VillaListings from '../components/FeaturedListings';
import ProfitSimulationForm from '../components/ProfitSimulationForm';
import FAQ from '../components/FAQ';

type OutletContextType = {
  setCurrentSection: (section: string) => void;
  handleSectionChange: (sectionId: string) => void;
};

export default function LandingPage() {
  const { setCurrentSection, handleSectionChange } = useOutletContext<OutletContextType>();
  const location = useLocation();

  const sectionRefs = {
    home: useRef<HTMLDivElement>(null),
    about: useRef<HTMLDivElement>(null),
    listings: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
    faq: useRef<HTMLDivElement>(null),
  };

   useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-30% 0px -70% 0px' }
    );

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [setCurrentSection]);
  
  useEffect(() => {
    if (location.state?.scrollToSection) {
      const sectionId = location.state.scrollToSection;
      const element = document.getElementById(sectionId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <>
      {/* ===== BLOK METADATA SEO UNTUK HALAMAN INI ===== */}
      <Helmet>
        <title>Investasi Villa di Jogja | Lodjisvarga Seturan & Valeeqa Villa</title>
        <meta 
          name="description" 
          content="Temukan peluang investasi properti villa premium di Yogyakarta. Dikelola profesional, legalitas terjamin, dengan potensi keuntungan jangka panjang. Lihat unit tersedia!" 
        />
        <link rel="canonical" href="https://URL-WEBSITE-ANDA.com/" />
      </Helmet>
      {/* =================================================== */}

      <div id="home" ref={sectionRefs.home}>
        <Hero onSectionChange={handleSectionChange} />
      </div>
      <div id="about" ref={sectionRefs.about}>
        <About />
      </div>
      <div id="listings" ref={sectionRefs.listings}>
        <VillaListings />
      </div>
      <div id="contact" ref={sectionRefs.contact}>
        <ProfitSimulationForm />
      </div>
      <div id="faq" ref={sectionRefs.faq}>
        <FAQ />
      </div>
    </>
  );
}