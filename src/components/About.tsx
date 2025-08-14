// src/components/About.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import aboutImage from '../assets/images/lodjisvarga-seturan.jpg';

// ====== Animation Variants ======
const fadeInStagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  viewport: { once: true, amount: 0.3 },
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
              alt="Villa Lodjisvarga Seturan Yogyakarta" 
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
              Miliki Villa Eksklusif & Raih Kebebasan Finansial 
            </motion.h2>
            <motion.p
              variants={fadeInItem}
              className="text-base md:text-lg text-slate-600 leading-relaxed mb-6"
            >
              <strong>Haspro Villa</strong> tidak hanya menjual properti—kami menghadirkan peluang 
              investasi yang bekerja untuk Anda. Dengan lokasi premium di pusat destinasi wisata, 
              villa Anda berpotensi menghasilkan <em>passive income</em> stabil tanpa repot.  
              Semua dikelola secara profesional, legal, dan transparan.
            </motion.p>
            
            <motion.ul variants={fadeInItem} className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                <span className="text-slate-700">
                  <strong>Lokasi Strategis:</strong> Berada di area bernilai tinggi dengan potensi okupansi yang terus meningkat.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                <span className="text-slate-700">
                  <strong>Manajemen Professional:</strong> Mulai dari pemasaran, reservasi, hingga perawatan, semuanya kami tangani.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                <span className="text-slate-700">
                  <strong>Legalitas Terjamin:</strong> Hak pakai 20 tahun dengan perjanjian notaris, memberi Anda rasa aman penuh.
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
