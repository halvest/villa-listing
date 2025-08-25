// src/components/Footer.tsx
import React from 'react';
import { Building, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

// --- Tipe Data & Konfigurasi ---
interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string; // Ditambahkan untuk aksesibilitas
}

interface FooterNavLink {
  title: string;
  to: string; // Menggunakan 'to' agar konsisten dengan Header
}

const socialLinks: SocialLink[] = [
  { icon: <Facebook />, href: 'https://facebook.com', label: 'Facebook' },
  { icon: <Instagram />, href: 'https://instagram.com', label: 'Instagram' },
  { icon: <Twitter />, href: 'https://twitter.com', label: 'Twitter' },
  { icon: <Youtube />, href: 'https://youtube.com', label: 'Youtube' },
];

const footerNavLinks: FooterNavLink[] = [
  { title: 'Beranda', to: '/' },
  { title: 'Tentang Kami', to: '/#about' },
  { title: 'Pilihan Villa', to: '/listings' },
  { title: 'Simulasi Profit', to: '/#contact' },
  { title: 'FAQ', to: '/#faq' },
];


export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  // Fungsi navigasi yang disederhanakan
  const handleFooterNavClick = (to: string) => {
    const [path, hash] = to.split('#');

    // Jika navigasi ke section di halaman utama
    if (path === '' && hash) { 
        // Jika sudah di halaman utama, scroll
        if (location.pathname === '/') {
            document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
        } else {
        // Jika di halaman lain, kembali ke halaman utama lalu scroll
            navigate('/', { state: { scrollToSection: hash } });
        }
    } else {
        // Navigasi ke halaman lain
        navigate(path || '/');
        window.scrollTo(0, 0); // Pastikan halaman baru mulai dari atas
    }
  };

  return (
    <footer id="footer" className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Kolom 1: Brand & Deskripsi */}
          <div className="lg:col-span-1">
            <Link to="/" onClick={() => handleFooterNavClick('/')} className="flex items-center gap-2.5 mb-4 group">
              <Building size={28} className="text-sky-500 group-hover:text-sky-400 transition-colors" />
              <span className="text-2xl font-bold text-white group-hover:text-slate-200 transition-colors">Haspro Villa</span>
            </Link>
            <p className="text-slate-400 text-sm">
              Platform investasi properti terpercaya yang menghubungkan investor dengan villa premium di Yogyakarta.
            </p>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div>
            <h3 className="font-semibold text-white tracking-wider mb-4">Navigasi</h3>
            <ul className="space-y-3">
              {footerNavLinks.map(link => (
                <li key={link.title}>
                  <button onClick={() => handleFooterNavClick(link.to)} className="hover:text-sky-400 transition-colors text-left">
                    {link.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Kontak */}
          <div>
            <h3 className="font-semibold text-white tracking-wider mb-4">Hubungi Kami</h3>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li className="hover:text-white transition-colors">
                <a href="mailto:hasproagency@gmail.com">hasproagency@gmail.com</a>
              </li>
              <li className="hover:text-white transition-colors">
                <a href="tel:+6283144940611">(+62) 831-4494-0611</a>
              </li>
               <li className="text-slate-500">
                Jl. Seturan Raya, Yogyakarta, ID
              </li>
            </ul>
          </div>
          
          {/* Kolom 4: Sosial Media */}
          <div>
              <h3 className="font-semibold text-white tracking-wider mb-4">Ikuti Kami</h3>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a 
                    key={social.label} 
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label={`Kunjungi halaman ${social.label} kami`}
                    className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-sky-600 transition-all duration-300 hover:scale-110"
                  >
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