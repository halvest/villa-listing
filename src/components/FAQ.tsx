// src/components/FAQ.tsx
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Data FAQ — copywriting sudah dipoles
const faqData = [
  {
    question: 'Apa legalitas villa ini?',
    answer: 'Setiap villa dilindungi dengan Perjanjian Hak Pakai selama 20 tahun yang dibuat dan disahkan di hadapan notaris resmi. Hal ini memastikan kepastian hukum penuh dan rasa aman bagi investasi Anda.'
  },
  {
    question: 'Siapa yang akan mengelola villa saya?',
    answer: 'Tim manajemen properti profesional kami menangani semua aspek operasional: pemasaran, reservasi, check-in/check-out, kebersihan, dan perawatan. Anda tinggal menerima laporan dan hasilnya—tanpa repot sama sekali.'
  },
  {
    question: 'Apakah saya bisa memakai villa untuk pribadi?',
    answer: 'Ya, Anda mendapat jatah penggunaan pribadi beberapa hari per tahun. Detail jadwal dan ketentuan penggunaan akan dijelaskan jelas dalam kontrak investasi.'
  }
];

// Sub-komponen FAQ item
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

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleItemClick = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-slate-50 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-sky-700">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-lg text-slate-600">
            Kumpulan jawaban untuk membantu Anda memahami setiap detail investasi Haspro Villa.
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
