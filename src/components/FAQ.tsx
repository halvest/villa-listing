// src/components/FAQ.tsx
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Data dipindahkan ke luar agar tidak dibuat ulang pada setiap render
const faqData = [
  {
    question: 'Apa status legalitas dari villa yang ditawarkan?',
    answer: 'Semua villa kami memiliki dasar hukum berupa Perjanjian Hak Pakai selama 20 tahun yang dibuat dan disahkan di hadapan notaris. Ini memberikan Anda kepastian hukum penuh atas penggunaan dan hasil dari properti tersebut.'
  },
  {
    question: 'Bagaimana perhitungan ROI dan pembagian hasilnya?',
    answer: 'ROI dihitung dari total pendapatan sewa tahunan dikurangi biaya operasional, lalu dibagi modal investasi Anda. Pembagian hasil dilakukan secara transparan sesuai kontrak, biasanya per kuartal atau semester, lengkap dengan laporan keuangan.'
  },
  {
    question: 'Siapa yang akan mengelola villa saya sehari-hari?',
    answer: 'Kami memiliki tim manajemen properti profesional yang akan menangani semuanya, mulai dari pemasaran, booking, check-in/check-out tamu, kebersihan, hingga perawatan rutin. Anda tidak perlu repot sama sekali.'
  },
  {
    question: 'Apakah saya bisa menggunakan villa tersebut untuk pribadi?',
    answer: 'Tentu saja. Sebagai pemilik hak pakai, Anda memiliki jatah beberapa hari dalam setahun untuk menggunakan villa untuk keperluan pribadi. Ketentuannya akan dijelaskan secara rinci dalam kontrak investasi.'
  }
];

// Tipe data untuk item FAQ
interface FAQItemProps {
    item: { question: string; answer: string };
    isOpen: boolean;
    onClick: () => void;
}

// Sub-komponen untuk setiap item FAQ
const FAQItem = ({ item, isOpen, onClick }: FAQItemProps) => {
  return (
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
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-slate-600 leading-relaxed">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default function FAQ() {
  // State untuk melacak item mana yang sedang terbuka
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleItemClick = (index: number) => {
    // Jika item yang sama diklik lagi, tutup. Jika beda, buka yang baru.
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-slate-50 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-sky-700">
            Pertanyaan Umum
          </h2>
          <p className="text-lg text-slate-600">
            Jawaban untuk pertanyaan-pertanyaan yang paling sering ditanyakan oleh calon investor kami.
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