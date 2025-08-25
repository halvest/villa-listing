// src/components/FAQ.tsx
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Data FAQ — Diperbanyak dan dioptimalkan dengan keyword SEO
const faqData = [
  {
    question: 'Apa bentuk legalitas dari investasi villa ini?',
    answer: 'Setiap unit dilindungi oleh Perjanjian Hak Pakai selama 20 tahun yang sah di hadapan notaris. Ini adalah bentuk investasi properti jangka panjang yang memberikan Anda kepastian hukum penuh atas aset properti villa Anda.'
  },
  {
    question: 'Bagaimana perhitungan potensi keuntungan (ROI) dari investasi villa ini?',
    answer: 'Potensi keuntungan didapat dari pendapatan sewa harian yang dikelola tim kami. Setelah dikurangi biaya operasional, keuntungan akan didistribusikan kepada Anda. Proyeksi ROI detail akan kami presentasikan, menunjukkan bagaimana villa Jogja ini bisa menjadi sumber passive income yang solid.'
  },
  {
    question: 'Siapa yang akan mengelola properti villa saya sehari-hari?',
    answer: 'Tim manajemen profesional kami yang akan menangani semuanya. Mulai dari pemasaran digital, mengurus reservasi, hingga perawatan rutin seperti kebersihan kolam renang pribadi dan taman. Anda tidak perlu repot, cukup terima laporan performa investasi Anda.'
  },
  {
    question: 'Apakah villa ini cocok untuk liburan keluarga pribadi?',
    answer: 'Tentu saja. Sebagai pemilik, Anda mendapatkan jatah menginap gratis setiap tahunnya. Ini adalah salah satu keuntungan investasi terbaik: memiliki aset yang menghasilkan uang sekaligus tempat liburan premium untuk keluarga Anda.'
  },
  {
    question: 'Apa saja yang termasuk dalam harga villa yang ditawarkan?',
    answer: 'Harga villa yang kami tawarkan bersifat turnkey (siap huni dan beroperasi). Ini sudah mencakup bangunan fisik, perabotan lengkap (fully furnished), semua perizinan (IMB/PBG), dan biaya notaris. Tidak ada biaya tersembunyi.'
  },
    {
    question: 'Apa yang terjadi setelah masa hak pakai 20 tahun berakhir?',
    answer: 'Setelah 20 tahun, Anda memiliki hak prioritas untuk memperpanjang masa hak pakai sesuai dengan peraturan yang berlaku saat itu. Ini memastikan keberlanjutan investasi jangka panjang Anda.'
  }
];

// Sub-komponen FAQ item (Tidak ada perubahan, fungsionalitas sudah bagus)
interface FAQItemProps {
  item: { question: string; answer: string };
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem = ({ item, isOpen, onClick }: FAQItemProps) => (
  <div className="border-b border-slate-200 py-6">
    <button
      onClick={onClick}
      className="w-full flex justify-between items-center text-left gap-4"
    >
      <h3 className="text-lg font-semibold text-slate-800">{item.question}</h3>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <ChevronDown className="text-slate-500 flex-shrink-0" />
      </motion.div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0, marginTop: 0 }}
          animate={{ height: 'auto', opacity: 1, marginTop: '16px' }}
          exit={{ height: 0, opacity: 0, marginTop: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <p className="text-slate-600 leading-relaxed">{item.answer}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// Komponen Utama FAQ
export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0); // Default buka pertanyaan pertama

  const handleItemClick = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-slate-50 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-sky-700">
            Pertanyaan Umum Seputar Investasi Villa
          </h2>
          <p className="text-lg text-slate-600">
            Temukan jawaban atas pertanyaan umum seputar <strong>investasi properti villa di Jogja</strong>. Kami merangkum semua yang perlu Anda ketahui untuk memulai <strong>investasi villa</strong> Anda dengan percaya diri.
          </p>
        </div>
        <div className="max-w-3xl mx-auto bg-white p-4 sm:p-8 rounded-2xl shadow-xl border">
          {faqData.map((item, index) => (
            <FAQItem
              key={index}
              item={item}
              isOpen={activeIndex === index}
              onClick={() => handleItemClick(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}