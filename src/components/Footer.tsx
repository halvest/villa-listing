// src/components/Footer.tsx
import React from 'react';
import { Building, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const socialLinks = [
    { icon: <Facebook />, href: '#' },
    { icon: <Instagram />, href: '#' },
    { icon: <Twitter />, href: '#' },
    { icon: <Youtube />, href: '#' },
  ];

  // Sesuaikan dengan section ID yang ada di LandingPage
  const footerLinks = [
    { title: 'Beranda', id: 'home' },
    { title: 'Keunggulan', id: 'about' },
    { title: 'Pilihan Villa', id: 'listings' },
    { title: 'Simulasi Profit', id: 'contact' },
    { title: 'FAQ', id: 'faq' },
  ];

  // Fungsi untuk menangani klik pada link navigasi footer
  const handleFooterNavClick = (sectionId: string) => {
    if (location.pathname === '/') {
      // Jika sudah di halaman utama, lakukan smooth scroll
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Jika di halaman lain, kembali ke halaman utama lalu scroll
      navigate('/', { state: { scrollToSection: sectionId } });
    }
  };

  return (
    <footer id="footer" className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Kolom 1: Brand & Deskripsi */}
          <div className="lg:col-span-1">
            <a onClick={() => handleFooterNavClick('home')} className="flex items-center gap-2 mb-4 cursor-pointer">
              <Building size={28} className="text-sky-500" />
              <h2 className="text-2xl font-bold text-white">HasproVilla</h2>
            </a>
            <p className="text-slate-400 text-sm">
              Platform investasi properti terpercaya yang menghubungkan investor dengan villa premium di Yogyakarta.
            </p>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div>
            <h3 className="font-semibold text-white mb-4">Navigasi</h3>
            <ul className="space-y-3">
              {footerLinks.map(link => (
                <li key={link.title}>
                  {/* Gunakan onClick untuk memicu smooth scroll */}
                  <button onClick={() => handleFooterNavClick(link.id)} className="hover:text-sky-400 transition-colors text-left">
                    {link.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Kontak */}
          <div>
            <h3 className="font-semibold text-white mb-4">Hubungi Kami</h3>
            <ul className="space-y-3 text-slate-400">
              <li className="hover:text-white transition-colors">
                <a href="mailto:hasproagency@gmail.com">hasproagency@gmail.com</a>
              </li>
              <li className="hover:text-white transition-colors">
                <a href="tel:+622745551234">0831-4494-0611</a>
              </li>
            </ul>
          </div>
          
          {/* Kolom 4: Sosial Media */}
          <div>
             <h3 className="font-semibold text-white mb-4">Ikuti Kami</h3>
             <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a key={index} href={social.href} className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-sky-600 transition-all duration-300 hover:scale-110">
                    {social.icon}
                  </a>
                ))}
             </div>
          </div>
        </div>

        {/* Garis pemisah dan Copyright */}
        <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Haspro Villa. Semua Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}