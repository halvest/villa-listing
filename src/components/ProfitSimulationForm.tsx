// src/components/ProfitSimulationForm.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../utils/supabase';
import { Send, Loader, CheckCircle, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VillaOption {
  id: string;
  nama_listing: string;
}

interface FormData {
  nama: string;
  domisili: string;
  villa_id: string;
  no_wa: string;
}

export default function ProfitSimulationForm() {
  const [villas, setVillas] = useState<VillaOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

  useEffect(() => {
    const fetchVillas = async () => {
      const { data, error } = await supabase
        .from('villa_listings')
        .select('id, nama_listing')
        .in('status', ['Tersedia', 'Promo']); // Hanya tampilkan villa yang bisa dibeli
      
      if (error) console.error("Error fetching villa options:", error);
      else setVillas(data as VillaOption[]);
    };
    fetchVillas();
  }, []);

  const onSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    
    const { error } = await supabase.from('leads').insert([{
      nama: formData.nama,
      domisili: formData.domisili,
      no_wa: formData.no_wa,
      villa_id: formData.villa_id,
    }]);

    if (error) {
      alert("Terjadi kesalahan. Silakan coba lagi.");
      console.error("Error submitting lead:", error);
      setIsSubmitting(false);
    } else {
      setIsSuccess(true);
      reset(); // Mengosongkan form setelah berhasil
    }
  };

  return (
    <section id="profit-simulation" className="py-24 bg-slate-50 scroll-mt-20">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl mx-auto"
        >
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center p-12 flex flex-col justify-center items-center h-[550px]"
              >
                <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-slate-800">Permintaan Terkirim!</h3>
                <p className="text-slate-600 mt-2">
                  Terima kasih. Tim kami akan segera menghubungi Anda melalui WhatsApp dengan simulasi profit yang diminta.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit(onSubmit)} 
                className="p-8 md:p-12 space-y-6"
              >
                <div className="text-center">
                    <div className="mx-auto w-14 h-14 bg-sky-100 text-sky-600 flex items-center justify-center rounded-full mb-4">
                        <Calculator size={28} />
                    </div>
                  <h2 className="text-3xl font-extrabold text-slate-800">Kalkulasi Potensi Profit Anda</h2>
                  <p className="text-slate-500 mt-2">
                    Isi data di bawah, dan tim kami akan mengirimkan simulasi keuntungan lengkap untuk villa pilihan Anda via WhatsApp.
                  </p>
                </div>
                
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <label htmlFor="nama" className="font-semibold text-sm text-slate-700">Nama Lengkap</label>
                    <input id="nama" type="text" {...register("nama", { required: "Nama wajib diisi" })} className="w-full mt-1 p-3 bg-slate-100 border-slate-200 border rounded-lg focus:ring-2 focus:ring-sky-500" />
                    {errors.nama && <p className="text-sm text-red-500 mt-1">{errors.nama.message}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="domisili" className="font-semibold text-sm text-slate-700">Domisili (Kota)</label>
                    <input id="domisili" type="text" {...register("domisili", { required: "Domisili wajib diisi" })} className="w-full mt-1 p-3 bg-slate-100 border-slate-200 border rounded-lg focus:ring-2 focus:ring-sky-500" />
                    {errors.domisili && <p className="text-sm text-red-500 mt-1">{errors.domisili.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="villa_id" className="font-semibold text-sm text-slate-700">Villa yang Diminati</label>
                    <select id="villa_id" {...register("villa_id", { required: "Silakan pilih villa" })} className="w-full mt-1 p-3 bg-slate-100 border-slate-200 border rounded-lg appearance-none">
                      <option value="">-- Pilih Villa --</option>
                      {villas.map(villa => (
                        <option key={villa.id} value={villa.id}>{villa.nama_listing}</option>
                      ))}
                    </select>
                    {errors.villa_id && <p className="text-sm text-red-500 mt-1">{errors.villa_id.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="no_wa" className="font-semibold text-sm text-slate-700">No. WhatsApp</label>
                    <input id="no_wa" type="tel" {...register("no_wa", { required: "No. WhatsApp wajib diisi", pattern: { value: /^08\d{8,12}$/, message: "Format tidak valid (contoh: 0812...)" } })} className="w-full mt-1 p-3 bg-slate-100 border-slate-200 border rounded-lg" placeholder="Contoh: 081234567890" />
                    {errors.no_wa && <p className="text-sm text-red-500 mt-1">{errors.no_wa.message}</p>}
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-slate-800 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:bg-slate-700 transition-all flex items-center justify-center gap-2 text-base disabled:bg-slate-400"
                >
                  {isSubmitting ? <Loader className="animate-spin" /> : <Send />}
                  {isSubmitting ? 'Mengirim...' : 'Kirim & Dapatkan Simulasi'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}