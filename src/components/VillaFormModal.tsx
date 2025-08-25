// src/components/VillaFormModal.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { supabase } from '../utils/supabase';
import { X, ArrowLeft, ArrowRight, Save, Check, FileText, DollarSign, Sparkles, MapPin, Camera, UploadCloud, Trash2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const slugify = (text: string) => text?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') || '';

// --- Tipe Data ---
type FormFields = {
  id?: string;
  created_at?: string;
  nama_listing: string;
  slug: string;
  deskripsi_singkat: string;
  deskripsi_panjang?: string;
  harga: number;
  harga_promo?: number;
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
const StepIndicator = ({ currentStep, setStep, steps }) => (
    <div className="flex items-start justify-center mb-8">
        {steps.map((step, index) => (
            <React.Fragment key={step.number}>
                <div className="flex flex-col items-center cursor-pointer group" onClick={() => setStep(step.number)}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${currentStep >= step.number ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-slate-500 border-slate-300 group-hover:border-sky-500'}`}>
                        {currentStep > step.number ? <Check /> : step.icon}
                    </div>
                    <p className={`mt-2 text-xs font-medium text-center w-20 transition-colors ${currentStep === step.number ? 'text-sky-600' : 'text-slate-500 group-hover:text-slate-800'}`}>{step.title}</p>
                </div>
                {index < steps.length - 1 && <div className={`flex-1 h-1 mt-5 mx-2 transition-all duration-300 ${currentStep > step.number ? 'bg-sky-600' : 'bg-slate-200'}`}></div>}
            </React.Fragment>
        ))}
    </div>
);

const PhotoUploader = ({ existingPhotos, setValue, videoUrl, register }) => {
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = useCallback(async (files: FileList) => {
        if (!files || files.length === 0) return;
        setIsUploading(true);
        const uploadPromises = Array.from(files).map(file => {
            const fileName = `${Date.now()}-${slugify(file.name)}`;
            return supabase.storage.from('villa-images').upload(fileName, file);
        });

        toast.promise(
            Promise.all(uploadPromises).then(results => {
                const newUrls: string[] = [];
                results.forEach(result => {
                    if (result.error) throw result.error;
                    if (result.data) {
                        const { data: { publicUrl } } = supabase.storage.from('villa-images').getPublicUrl(result.data.path);
                        newUrls.push(publicUrl);
                    }
                });
                setValue('foto_urls', [...(existingPhotos || []), ...newUrls], { shouldValidate: true });
            }),
            {
                loading: `Mengunggah ${files.length} foto...`,
                success: 'Foto berhasil diunggah!',
                error: 'Gagal mengunggah foto.',
            }
        ).finally(() => setIsUploading(false));
    }, [existingPhotos, setValue]);

    const removePhoto = (urlToRemove: string) => {
        setValue('foto_urls', (existingPhotos || []).filter(url => url !== urlToRemove), { shouldValidate: true });
    };

    return (
        <div>
            <h3 className="text-xl font-bold text-slate-700 mb-4">Foto Listing & Video</h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 min-h-[250px]">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-4">
                    {(existingPhotos || []).map(url => (
                        <div key={url} className="relative group aspect-square">
                            <img src={url} alt="Foto Villa" className="w-full h-full object-cover rounded-md"/>
                            <button type="button" onClick={() => removePhoto(url)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12}/></button>
                        </div>
                    ))}
                    <label htmlFor="file-upload" className="cursor-pointer aspect-square border-2 border-dashed rounded-lg text-slate-400 hover:text-sky-600 hover:border-sky-400 flex flex-col items-center justify-center transition-colors">
                        {isUploading ? <Loader2 className="h-8 w-8 animate-spin"/> : <UploadCloud className="h-8 w-8"/>}
                        <span className="mt-1 text-xs text-center">{isUploading ? 'Mengunggah...' : 'Tambah Foto'}</span>
                    </label>
                </div>
                <input id="file-upload" type="file" className="sr-only" multiple onChange={(e) => e.target.files && handleFileUpload(e.target.files)} accept="image/png, image/jpeg, image/webp"/>
            </div>
            <div className="mt-4">
                 <label className="font-semibold text-sm text-slate-700 block mb-1.5">URL Video Tour (Opsional)</label>
                 <input {...register("video_tour_url")} defaultValue={videoUrl} className="w-full p-3 bg-slate-100 border-slate-200 border rounded-lg focus:ring-2 focus:ring-sky-500" />
            </div>
        </div>
    );
};

// --- Komponen Utama ---
export default function VillaFormModal({ villa, onClose, onSave }: VillaFormModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const { register, handleSubmit, setValue, control, watch, formState: { errors }, trigger } = useForm<FormFields>({
    defaultValues: villa || { status: 'Tersedia', tipe_villa: '1BR', fasilitas: [], foto_urls: [], memiliki_private_pool: false },
    mode: 'onChange'
  });
  
  const watchedValues = watch();

  useEffect(() => {
    if (villa) {
      Object.keys(villa).forEach(key => {
        setValue(key as keyof FormFields, villa[key as keyof FormFields]);
      });
    }
  }, [villa, setValue]);
  
  const STEPS = [
    { number: 1, title: 'Informasi', icon: <FileText/>, fields: ['nama_listing', 'deskripsi_singkat', 'tipe_villa', 'status'] },
    { number: 2, title: 'Detail Harga', icon: <DollarSign/>, fields: ['harga'] },
    { number: 3, title: 'Fasilitas', icon: <Sparkles/>, fields: [] },
    { number: 4, title: 'Lokasi', icon: <MapPin/>, fields: ['alamat_lengkap', 'kontak_marketing'] },
    { number: 5, title: 'Media', icon: <Camera/>, fields: [] }, // foto_urls tidak divalidasi di sini
  ];

  const onSubmit = async (formData: FormFields) => {
    setIsProcessing(true);
    const promise = new Promise(async (resolve, reject) => {
        try {
            const finalData: Partial<FormFields> = { ...formData, slug: slugify(formData.nama_listing) };
            delete finalData.created_at;
            delete finalData.id;

            if (villa?.id) {
                await supabase.from('villa_listings').update(finalData).eq('id', villa.id).throwOnError();
            } else {
                await supabase.from('villa_listings').insert([finalData]).throwOnError();
            }
            resolve('Data berhasil disimpan!');
        } catch (error) {
            reject(error);
        }
    });

    toast.promise(promise, {
        loading: 'Menyimpan data villa...',
        success: (message) => {
            onSave();
            return `${message}`;
        },
        error: (error) => `Terjadi kesalahan: ${error.message}`,
    }).finally(() => setIsProcessing(false));
  };

  const onFormError = (formErrors: any) => {
    const firstErrorField = Object.keys(formErrors)[0];
    const errorStep = STEPS.find(step => step.fields.includes(firstErrorField));
    if (errorStep) {
        toast.error(`Periksa isian di langkah '${errorStep.title}'.`);
        setCurrentStep(errorStep.number);
    } else {
        toast.error('Ada isian yang belum lengkap atau tidak valid.');
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = STEPS[currentStep - 1].fields;
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid && currentStep < 5) setCurrentStep(prev => prev + 1);
  };
  const prevStep = () => { if (currentStep > 1) setCurrentStep(prev => prev - 1) };

  const renderStepContent = () => {
      switch(currentStep) {
          case 1: return (
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-700 mb-4">Informasi Listing</h3>
                <div><label className="font-semibold text-sm text-slate-700 block mb-1.5">Nama Listing / Judul Iklan</label><input {...register("nama_listing", { required: "Nama listing wajib diisi" })} className="w-full p-3 bg-slate-100 border-slate-200 border rounded-lg focus:ring-2 focus:ring-sky-500" />{errors.nama_listing && <p className="text-sm text-red-500 mt-1">{errors.nama_listing.message}</p>}</div>
                <div><label className="font-semibold text-sm text-slate-700 block mb-1.5">Deskripsi Singkat</label><textarea {...register("deskripsi_singkat", { required: "Deskripsi singkat wajib diisi" })} rows={3} className="w-full p-3 bg-slate-100 border-slate-200 border rounded-lg focus:ring-2 focus:ring-sky-500"></textarea>{errors.deskripsi_singkat && <p className="text-sm text-red-500 mt-1">{errors.deskripsi_singkat.message}</p>}</div>
                <div><label className="font-semibold text-sm text-slate-700 block mb-1.5">Deskripsi Panjang (Opsional)</label><textarea {...register("deskripsi_panjang")} rows={5} className="w-full p-3 bg-slate-100 border-slate-200 border rounded-lg focus:ring-2 focus:ring-sky-500"></textarea></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="font-semibold text-sm">Tipe Villa</label><select {...register("tipe_villa")} className="w-full p-3 bg-slate-100 border-slate-200 border rounded-lg mt-1.5">{TIPE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
                  <div><label className="font-semibold text-sm">Status Properti</label><select {...register("status")} className="w-full p-3 bg-slate-100 border-slate-200 border rounded-lg mt-1.5">{STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
                </div>
            </div>
          );
          case 2: return (
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-700 mb-4">Detail Listing & Harga</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="font-semibold text-sm text-slate-700 block mb-1.5">Harga Normal</label><input type="number" {...register("harga", { required: "Harga wajib diisi", valueAsNumber: true, min: 1 })} className="w-full p-3 bg-slate-100 border-slate-200 border rounded-lg focus:ring-2 focus:ring-sky-500" />{errors.harga && <p className="text-sm text-red-500 mt-1">{errors.harga.message}</p>}</div>
                    <div><label className="font-semibold text-sm text-slate-700 block mb-1.5">Harga Promo (Opsional)</label><input type="number" {...register("harga_promo", { valueAsNumber: true })} className="w-full p-3 bg-slate-100 border-slate-200 border rounded-lg focus:ring-2 focus:ring-sky-500" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="font-semibold text-sm text-slate-700 block mb-1.5">Passive Income / Bulan (Est.)</label><input type="number" {...register("perkiraan_passive_income", { valueAsNumber: true })} className="w-full p-3 bg-slate-100 border-slate-200 border rounded-lg focus:ring-2 focus:ring-sky-500" /></div>
                    <div><label className="font-semibold text-sm text-slate-700 block mb-1.5">ROI Perkiraan (%)</label><input type="number" {...register("roi_perkiraan", { valueAsNumber: true })} className="w-full p-3 bg-slate-100 border-slate-200 border rounded-lg focus:ring-2 focus:ring-sky-500" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="font-semibold text-sm text-slate-700 block mb-1.5">Jaminan BEP</label><input {...register("jaminan_bep")} placeholder="Contoh: 5 Tahun" className="w-full p-3 bg-slate-100 border-slate-200 border rounded-lg focus:ring-2 focus:ring-sky-500" /></div>
                    <div><label className="font-semibold text-sm text-slate-700 block mb-1.5">Free Stay</label><input {...register("free_stay")} placeholder="Contoh: 12x per Tahun" className="w-full p-3 bg-slate-100 border-slate-200 border rounded-lg focus:ring-2 focus:ring-sky-500" /></div>
                </div>
            </div>
          );
          case 3: return (
             <div>
                <h3 className="text-xl font-bold text-slate-700 mb-4">Fasilitas</h3>
                <Controller name="fasilitas" control={control} render={({ field }) => (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 min-h-[200px]">
                    <div className="flex flex-wrap gap-2">
                        {(field.value || []).map(tag => (<span key={tag} className="bg-sky-200 text-sky-800 px-2.5 py-1 rounded-md text-sm flex items-center gap-1.5">{tag}<button type="button" onClick={() => field.onChange((field.value || []).filter(t => t !== tag))}><X size={14}/></button></span>))}
                        <input type="text" placeholder="Tambah fasilitas + Enter" className="bg-transparent flex-grow p-1 focus:outline-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value) {
                              e.preventDefault();
                              const newTag = e.currentTarget.value.trim();
                              if(newTag && !(field.value || []).includes(newTag)) { field.onChange([...(field.value || []), newTag]); }
                              e.currentTarget.value = '';
                            }}}/>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <div className="flex items-center">
                          <input id="private-pool" type="checkbox" {...register("memiliki_private_pool")} className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500" />
                          <label htmlFor="private-pool" className="ml-2 text-sm font-medium text-slate-700">Memiliki Private Pool</label>
                      </div>
                    </div>
                  </div>
                )}/>
            </div>
          );
          case 4: return (
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-700 mb-4">Lokasi & Kontak</h3>
                <div><label className="font-semibold text-sm text-slate-700 block mb-1.5">Alamat Lengkap</label><textarea {...register("alamat_lengkap", { required: "Alamat wajib diisi" })} rows={3} className="w-full p-3 bg-slate-100 border-slate-200 border rounded-lg focus:ring-2 focus:ring-sky-500"></textarea>{errors.alamat_lengkap && <p className="text-sm text-red-500 mt-1">{errors.alamat_lengkap.message}</p>}</div>
                <div><label className="font-semibold text-sm text-slate-700 block mb-1.5">URL Embed Peta Google Maps</label><textarea {...register("lokasi_maps_iframe_url")} placeholder="<iframe src=... >" rows={3} className="w-full p-3 bg-slate-100 border-slate-200 border rounded-lg focus:ring-2 focus:ring-sky-500"></textarea></div>
                <div><label className="font-semibold text-sm text-slate-700 block mb-1.5">Kontak Marketing (No. WA)</label><input {...register("kontak_marketing", { required: "Kontak wajib diisi", pattern: { value: /^62\d{8,12}$/, message: "Format: 62..." } })} placeholder="Contoh: 628123456789" className="w-full p-3 bg-slate-100 border-slate-200 border rounded-lg focus:ring-2 focus:ring-sky-500" />{errors.kontak_marketing && <p className="text-sm text-red-500 mt-1">{errors.kontak_marketing.message}</p>}</div>
            </div>
          );
          case 5: return <PhotoUploader existingPhotos={watchedValues.foto_urls} setValue={setValue} videoUrl={watchedValues.video_tour_url} register={register} />;
          default: return null;
      }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] flex flex-col shadow-2xl">
        <div className="p-4 flex justify-between items-center border-b flex-shrink-0"><h2 className="text-xl font-bold text-slate-800">{villa ? `Mengedit: ${villa.nama_listing}` : 'Tambah Properti Baru'}</h2><button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-slate-100"><X /></button></div>
        
        <div className="p-6 md:p-8 flex-grow overflow-y-auto">
          <StepIndicator currentStep={currentStep} setStep={setCurrentStep} steps={STEPS} />
          <AnimatePresence mode="wait">
            <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="p-4 flex justify-between items-center border-t bg-slate-50 rounded-b-2xl flex-shrink-0">
            <button type="button" onClick={prevStep} disabled={currentStep === 1 || isProcessing} className="py-2 px-5 bg-slate-200 rounded-lg font-semibold hover:bg-slate-300 disabled:opacity-50 flex items-center gap-2"><ArrowLeft size={16}/> Kembali</button>
            {currentStep < 5 ? (
                <button type="button" onClick={nextStep} disabled={isProcessing} className="py-2 px-5 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 flex items-center gap-2">Lanjut <ArrowRight size={16}/></button>
            ) : (
                <button type="button" onClick={handleSubmit(onSubmit, onFormError)} disabled={isProcessing} className="py-2 px-5 bg-green-600 text-white rounded-lg font-semibold disabled:bg-slate-400 hover:bg-green-700 flex items-center gap-2">
                    {isProcessing ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>}
                    {isProcessing ? 'Menyimpan...' : 'Simpan Villa'}
                </button>
            )}
        </div>
      </motion.div>
    </div>
  );
}