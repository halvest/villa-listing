// src/components/About.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShieldCheck, Home, MapPin } from 'lucide-react';
import aboutImage from '../assets/images/lodjisvarga-seturan.jpg';

// ====== Animation Variants ======
const fadeInStagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  viewport: { once: true, amount: 0.2 },
};

const fadeInItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

// ====== Main Component ======
const About = React.memo(() => {
  return (
    <section id="about" className="relative py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-x-16 gap-y-12 items-center">
          
          {/* Kolom Kiri: Gambar */}
          <motion.div 
            className="w-full h-full"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <img 
              src={aboutImage} 
              alt="Suasana villa premium di Yogyakarta yang cocok untuk investasi properti dan liburan keluarga." 
              className="rounded-2xl object-cover w-full h-full shadow-2xl shadow-slate-300/60" 
            />
          </motion.div>

          {/* Kolom Kanan: Teks Deskripsi */}
          <motion.div
            className="text-left"
            variants={fadeInStagger}
            initial="initial"
            whileInView="whileInView"
          >
            <motion.span
              variants={fadeInItem}
              className="font-semibold text-sky-600 uppercase tracking-wider text-sm md:text-base"
            >
              Investasi Villa Yogyakarta
            </motion.span>
            <motion.h2
              variants={fadeInItem}
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold mt-3 mb-5 text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-sky-700"
            >
              Kenapa Harus Berinvestasi Villa?
            </motion.h2>
            <motion.p
              variants={fadeInItem}
              className="text-base md:text-lg text-slate-600 leading-relaxed mb-8"
            >
              Yogyakarta tidak hanya menawarkan pesona budaya, tapi juga peluang emas untuk <strong>investasi properti</strong>. Kami hadir untuk membantu Anda mengubah peluang tersebut menjadi aset nyata. Kami mengembangkan dan mengelola <strong>properti villa</strong> premium yang dirancang sebagai <strong>bentuk investasi jangka panjang</strong>, memberikan Anda <em>passive income</em> dari penyewaan sekaligus tempat istimewa <strong>untuk liburan keluarga</strong>.
            </motion.p>
            
            <motion.ul variants={fadeInItem} className="space-y-4 text-base">
              <li className="flex items-start gap-3">
                <MapPin className="text-green-500 mt-1 flex-shrink-0" size={20} />
                <span className="text-slate-700">
                  <strong>Lokasi Prima & Prospektif:</strong> Kami cermat dalam <strong>memilih villa</strong> di area-area strategis Yogyakarta dengan potensi pertumbuhan nilai properti yang tinggi, memastikan investasi Anda terus berkembang.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Home className="text-green-500 mt-1 flex-shrink-0" size={20} />
                <span className="text-slate-700">
                  <strong>Desain Unggul & Fasilitas Lengkap:</strong> Setiap <strong>villa dengan konsep</strong> modern dirancang untuk kenyamanan maksimal. Fasilitas seperti <strong>kolam renang pribadi</strong> dan <strong>ruang keluarga</strong> yang luas membuatnya sangat diminati di pasar sewa.
                </span>
              </li>
               <li className="flex items-start gap-3">
                <TrendingUp className="text-green-500 mt-1 flex-shrink-0" size={20} />
                <span className="text-slate-700">
                  <strong>Manajemen Profesional & ROI Optimal:</strong> Tim kami menangani semuanya, mulai dari pemasaran hingga perawatan, sehingga Anda bisa menikmati <strong>keuntungan investasi</strong> tanpa repot. Kami fokus memaksimalkan <strong>potensi keuntungan</strong> untuk Anda.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="text-green-500 mt-1 flex-shrink-0" size={20} />
                <span className="text-slate-700">
                  <strong>Legalitas Aman & Transparan:</strong> Keamanan investasi Anda adalah prioritas kami. Semua properti memiliki legalitas yang jelas dan proses yang transparan di hadapan notaris.
                </span>
              </li>
            </motion.ul>

          </motion.div>
        </div>
      </div>
    </section>
  );
});

export default About;