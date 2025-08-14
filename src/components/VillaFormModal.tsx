// src/components/VillaFormModal.tsx
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { supabase } from '../utils/supabase';
import { X, ArrowLeft, ArrowRight, Save, Check, FileText, DollarSign, Sparkles, MapPin, Camera, UploadCloud, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const slugify = (text: string) => text?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') || '';

// --- Tipe Data Diperbarui ---
type FormFields = {
  id?: string;
  created_at?: string;
  nama_listing: string;
  slug: string;
  deskripsi_singkat: string;
  deskripsi_panjang?: string;
  harga: number;
  harga_promo?: number; // Ditambahkan
  perkiraan_passive_income?: number; 
  memiliki_private_pool: boolean; 
  roi_perkiraan?: number;
  alamat_lengkap: string;
  tipe_villa: '1BR' | '2BR' | '3BR' | 'Investasi';
  fasilitas: string[];
  foto_urls: string[];
  video_tour_url?: string;
  kontak_marketing: string;
  status: 'Tersedia' | 'Promo' | 'Sold Out';
  jaminan_bep?: string;
  free_stay?: string;
  lokasi_maps_iframe_url?: string;
};

interface VillaFormModalProps {
  villa?: Partial<FormFields>;
  onClose: () => void;
  onSave: () => void;
}

const STATUS_OPTIONS: FormFields['status'][] = ['Tersedia', 'Promo', 'Sold Out'];
const TIPE_OPTIONS: FormFields['tipe_villa'][] = ['1BR', '2BR', '3BR', 'Investasi'];

// --- Sub-Komponen ---
const FormInput = ({ label, name, register, validation = {}, ...props }: any) => (
    <div>
      <label className="font-semibold text-sm text-slate-700 block mb-1.5">{label}</label>
      <input {...register(name, validation)} className="w-full p-3 bg-slate-100 border-slate-200 border rounded-lg focus:ring-2 focus:ring-sky-500" {...props} />
      {props.error && <p className="text-sm text-red-500 mt-1">{props.error.message || 'Isian ini wajib diisi.'}</p>}
    </div>
  );
const FormTextarea = ({ label, name, register, validation = {}, ...props }: any) => (
  <div>
    <label className="font-semibold text-sm text-slate-700 block mb-1.5">{label}</label>
    <textarea {...register(name, validation)} rows={4} className="w-full p-3 bg-slate-100 border-slate-200 border rounded-lg focus:ring-2 focus:ring-sky-500" {...props}></textarea>
    {props.error && <p className="text-sm text-red-500 mt-1">Isian ini wajib diisi.</p>}
  </div>
);
const StepIndicator = ({ currentStep, setStep, steps }: any) => (
    <div className="flex items-start justify-center mb-8">
      {steps.map((step: any, index: number) => (
        <React.Fragment key={step.number}>
          <div className="flex flex-col items-center cursor-pointer group" onClick={() => setStep(step.number)}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${currentStep >= step.number ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-slate-500 border-slate-300 group-hover:border-sky-500'}`}>
              {currentStep > step.number ? <Check /> : step.icon}
            </div>
            <p className={`mt-2 text-xs text-center w-20 transition-colors ${currentStep === step.number ? 'font-bold text-sky-600' : 'text-slate-500 group-hover:text-slate-800'}`}>{step.title}</p>
          </div>
          {index < steps.length - 1 && <div className={`flex-1 h-1 mt-5 mx-2 transition-all duration-300 ${currentStep > step.number ? 'bg-sky-600' : 'bg-slate-200'}`}></div>}
        </React.Fragment>
      ))}
    </div>
);


// --- Komponen Utama ---
export default function VillaFormModal({ villa, onClose, onSave }: VillaFormModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);

  const { register, handleSubmit, setValue, getValues, control, watch, formState: { errors }, trigger } = useForm<FormFields>({
    defaultValues: villa || { status: 'Tersedia', tipe_villa: '1BR', fasilitas: [], foto_urls: [], memiliki_private_pool: false },
    mode: 'onChange'
  });

  const STEPS = [
    { number: 1, title: 'Informasi', icon: <FileText/>, fields: ['nama_listing', 'deskripsi_singkat', 'tipe_villa', 'status'] },
    { number: 2, title: 'Detail', icon: <DollarSign/>, fields: ['harga'] },
    { number: 3, title: 'Fasilitas', icon: <Sparkles/>, fields: [] },
    { number: 4, title: 'Lokasi', icon: <MapPin/>, fields: ['alamat_lengkap', 'kontak_marketing'] },
    { number: 5, title: 'Foto', icon: <Camera/>, fields: [] },
  ];

  const existingPhotos = watch('foto_urls', []);

  useEffect(() => {
    if (villa) {
      Object.keys(villa).forEach((key) => {
        const villaKey = key as keyof FormFields;
        if (villa[villaKey] !== null) {
          setValue(villaKey, villa[villaKey]);
        }
      });
    }
  }, [villa, setValue]);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files) setFilesToUpload(prev => [...prev, ...Array.from(e.target.files)]) };
  const removePhoto = (photo: File | string) => {
    if (typeof photo === 'string') setValue('foto_urls', existingPhotos.filter((url) => url !== photo));
    else setFilesToUpload(prev => prev.filter((f) => f !== photo));
  };

  const onSubmit = async (formData: FormFields) => {
    setIsProcessing(true);
    try {
      let finalImageUrls = getValues('foto_urls') || [];
      if (filesToUpload.length > 0) {
        const uploadPromises = filesToUpload.map(file => {
          const fileName = `${Date.now()}-${slugify(file.name)}`;
          return supabase.storage.from('villa-images').upload(fileName, file);
        });
        const uploadResults = await Promise.all(uploadPromises);
        for(const result of uploadResults) {
            if(result.error) throw result.error;
            if(result.data) {
                const { data: { publicUrl } } = supabase.storage.from('villa-images').getPublicUrl(result.data.path);
                finalImageUrls.push(publicUrl);
            }
        }
      }

      const finalData: Partial<FormFields> = { ...formData, slug: slugify(formData.nama_listing), foto_urls: finalImageUrls };
      delete finalData.created_at;
      delete finalData.id;

      if (villa?.id) {
        await supabase.from('villa_listings').update(finalData).eq('id', villa.id).throwOnError();
      } else {
        await supabase.from('villa_listings').insert([finalData]).throwOnError();
      }
      
      alert('Data villa berhasil disimpan!');
      onSave();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const onFormError = (formErrors: any) => {
    const firstErrorField = Object.keys(formErrors)[0];
    if (firstErrorField) {
      const errorStep = STEPS.find(step => step.fields.includes(firstErrorField));
      if (errorStep) {
        alert(`Ada isian yang belum lengkap atau tidak valid di langkah '${errorStep.title}'. Silakan periksa kembali.`);
        setCurrentStep(errorStep.number);
      } else {
        alert('Ada isian yang belum lengkap atau tidak valid. Silakan periksa kembali semua langkah.');
      }
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = STEPS[currentStep - 1].fields;
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid && currentStep < 5) setCurrentStep(prev => prev + 1);
  };
  const prevStep = () => { if (currentStep > 1) setCurrentStep(prev => prev - 1) };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] flex flex-col shadow-2xl">
        <div className="p-4 flex justify-between items-center border-b"><h2 className="text-xl font-bold text-slate-800">{villa ? `Mengedit Properti` : 'Tambah Properti Baru'}</h2><button type="button" onClick={onClose}><X /></button></div>
        
        <div className="p-6 md:p-8 flex-grow overflow-y-auto">
          <StepIndicator currentStep={currentStep} setStep={setCurrentStep} steps={STEPS} />
          <AnimatePresence mode="wait">
            <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-700 mb-4">Informasi Listing</h3>
                  <FormInput label="Nama Listing / Judul Iklan" name="nama_listing" register={register} validation={{ required: true }} error={errors.nama_listing} />
                  <FormTextarea label="Deskripsi Singkat" name="deskripsi_singkat" register={register} validation={{ required: true }} error={errors.deskripsi_singkat} />
                  <FormTextarea label="Deskripsi Panjang (Opsional)" name="deskripsi_panjang" register={register} />
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="font-semibold text-sm">Tipe Villa</label><select {...register("tipe_villa")} className="w-full p-3 bg-slate-100 border-slate-200 border rounded-lg mt-1.5">{TIPE_OPTIONS.map(o => <option key={o}>{o}</option>)}</select></div>
                    <div><label className="font-semibold text-sm">Status Properti</label><select {...register("status")} className="w-full p-3 bg-slate-100 border-slate-200 border rounded-lg mt-1.5">{STATUS_OPTIONS.map(o => <option key={o}>{o}</option>)}</select></div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-700 mb-4">Detail Listing & Harga</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput label="Harga Normal" name="harga" type="number" register={register} validation={{ required: true, min: 1 }} error={errors.harga} />
                    <FormInput label="Harga Promo (Opsional)" name="harga_promo" type="number" register={register} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput label="Perkiraan Passive Income / Bulan" name="perkiraan_passive_income" type="number" register={register} />
                    <FormInput label="ROI Perkiraan (%)" name="roi_perkiraan" type="number" register={register} />
                  </div>
                   <div className="grid grid-cols-2 gap-4">
                    <FormInput label="Jaminan BEP" name="jaminan_bep" register={register} placeholder="Contoh: 5 Tahun"/>
                    <FormInput label="Free Stay" name="free_stay" register={register} placeholder="Contoh: 12x per Tahun"/>
                  </div>
                   <div className="pt-4">
                        <input id="private-pool" type="checkbox" {...register("memiliki_private_pool")} className="h-5 w-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500" />
                        <label htmlFor="private-pool" className="ml-2 text-sm font-semibold text-slate-700">
                            Memiliki Private Pool
                        </label>
                    </div>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <h3 className="text-xl font-bold text-slate-700 mb-4">Fasilitas</h3>
                  <Controller name="fasilitas" control={control} render={({ field }) => (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 min-h-[200px]">
                      <div className="flex flex-wrap gap-2">
                        {(field.value || []).map(tag => (<span key={tag} className="bg-sky-200 text-sky-800 px-2.5 py-1 rounded-md text-sm flex items-center gap-1.5">{tag}<button type="button" onClick={() => field.onChange(field.value.filter(t => t !== tag))}><X size={14}/></button></span>))}
                        <input type="text" placeholder="Tambah fasilitas + Enter" className="bg-transparent flex-grow p-1 focus:outline-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value) {
                              e.preventDefault();
                              const newTag = e.currentTarget.value.trim();
                              if(newTag && !(field.value || []).includes(newTag)) { field.onChange([...(field.value || []), newTag]); }
                              e.currentTarget.value = '';
                            }}}/>
                      </div>
                    </div>
                  )}/>
                </div>
              )}

              {currentStep === 4 && (
                 <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-700 mb-4">Lokasi & Kontak</h3>
                    <FormTextarea label="Alamat Lengkap" name="alamat_lengkap" register={register} validation={{ required: true }} error={errors.alamat_lengkap} />
                    <FormTextarea label="URL Embed Peta Google Maps" name="lokasi_maps_iframe_url" register={register} rows={3}/>
                    <FormInput label="Kontak Marketing (No. WA)" name="kontak_marketing" register={register} validation={{ required: true, pattern: {value: /^62\d{8,12}$/, message: "Format No. WA tidak valid"} }} error={errors.kontak_marketing} />
                 </div>
              )}

              {currentStep === 5 && (
                <div>
                  <h3 className="text-xl font-bold text-slate-700 mb-4">Foto Listing & Video</h3>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 min-h-[250px]">
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-3 mb-4">
                      {existingPhotos.map(url => (<div key={url} className="relative group aspect-square"><img src={url} className="w-full h-full object-cover rounded-md"/><button type="button" onClick={() => removePhoto(url)} className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"><Trash2 size={12}/></button></div>))}
                      {filesToUpload.map((file, i) => (<div key={i} className="relative group aspect-square"><img src={URL.createObjectURL(file)} className="w-full h-full object-cover rounded-md"/><button type="button" onClick={() => removePhoto(file)} className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"><Trash2 size={12}/></button></div>))}
                      <label htmlFor="file-upload" className="cursor-pointer aspect-square border-2 border-dashed rounded-lg text-slate-400 hover:text-sky-600 hover:border-sky-400 flex flex-col items-center justify-center"><UploadCloud className="h-8 w-8"/><span className="mt-1 text-xs">Tambah Foto</span></label>
                    </div>
                    <input id="file-upload" type="file" className="sr-only" multiple onChange={handleFileSelect} accept="image/png, image/jpeg"/>
                  </div>
                   <div className="mt-4">
                     <FormInput label="URL Video Tour (Opsional)" name="video_tour_url" register={register} />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="p-4 flex justify-between items-center border-t bg-slate-100 rounded-b-2xl">
            <button type="button" onClick={prevStep} disabled={currentStep === 1 || isProcessing} className="py-2 px-5 bg-slate-200 rounded-lg font-semibold hover:bg-slate-300 disabled:opacity-50 flex items-center gap-2"><ArrowLeft size={16}/> Kembali</button>
            {currentStep < 5 ? (
                <button type="button" onClick={nextStep} disabled={isProcessing} className="py-2 px-5 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 flex items-center gap-2">Lanjut <ArrowRight size={16}/></button>
            ) : (
                <button type="button" onClick={handleSubmit(onSubmit, onFormError)} disabled={isProcessing} className="py-2 px-5 bg-green-600 text-white rounded-lg font-semibold disabled:bg-green-300 hover:bg-green-700 flex items-center gap-2">
                    <Save size={16}/> {isProcessing ? 'Menyimpan...' : 'Simpan Villa'}
                </button>
            )}
        </div>
      </motion.div>
    </div>
  );
}