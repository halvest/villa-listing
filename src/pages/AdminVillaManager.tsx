// src/pages/AdminVillaManager.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import VillaFormModal from '../components/VillaFormModal';
import { Plus, Search, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { formatHarga } from '../utils/idr';
import { motion, AnimatePresence } from 'framer-motion';

// --- Tipe Data & Konstanta ---
interface Villa {
  id: string;
  created_at: string;
  nama_listing: string;
  alamat_lengkap: string;
  harga: number;
  status: 'Tersedia' | 'Promo' | 'Sold Out';
  foto_urls: string[];
}
const STATUS_COLORS = {
  'Tersedia': 'bg-green-100 text-green-700',
  'Promo': 'bg-amber-100 text-amber-700',
  'Sold Out': 'bg-red-100 text-red-700',
};

// --- Sub-komponen ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-500 mt-2 mb-6">{message}</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200">Batal</button>
            <button onClick={onConfirm} className="flex-1 px-4 py-2.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700">Ya, Hapus</button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const VillaRowSkeleton = () => (
    <tr className="border-b border-slate-200">
        <td className="p-2"><div className="w-24 h-16 rounded-md bg-slate-200 animate-pulse"></div></td>
        <td className="p-4"><div className="h-5 w-3/4 rounded bg-slate-200 animate-pulse"></div></td>
        <td className="p-4"><div className="h-6 w-20 rounded-full bg-slate-200 animate-pulse"></div></td>
        <td className="p-4"><div className="h-5 w-24 rounded bg-slate-200 animate-pulse"></div></td>
        <td className="p-4"><div className="h-8 w-16 rounded bg-slate-200 animate-pulse"></div></td>
    </tr>
);

// --- Komponen Utama ---
export default function AdminVillaManager() {
    const [villas, setVillas] = useState<Villa[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingVilla, setEditingVilla] = useState<Villa | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [villaToDelete, setVillaToDelete] = useState<Villa | null>(null);

    const fetchVillas = useCallback(async () => {
        setLoading(true);
        let query = supabase.from('villa_listings').select('*').order('created_at', { ascending: false });
        
        if (searchTerm) {
            query = query.or(`nama_listing.ilike.%${searchTerm}%,alamat_lengkap.ilike.%${searchTerm}%`);
        }
        
        const { data, error } = await query;
        if (error) {
            console.error('Error fetching villas:', error);
        } else {
            setVillas((data as Villa[]) || []);
        }
        setLoading(false);
    }, [searchTerm]);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchVillas();
        }, 300); // Debounce
        return () => clearTimeout(handler);
    }, [searchTerm, fetchVillas]);

    const handleAddNew = () => { setEditingVilla(null); setIsModalOpen(true); };
    const handleEdit = (villa: Villa) => { setEditingVilla(villa); setIsModalOpen(true); };
    const handleSave = () => { setIsModalOpen(false); fetchVillas(); };

    const confirmDelete = async () => {
        if (!villaToDelete) return;
        const { error } = await supabase.from('villa_listings').delete().eq('id', villaToDelete.id);
        if (error) {
            console.error("Delete Error:", error);
            alert(`Error: ${error.message}`);
        } else {
            fetchVillas();
        }
        setVillaToDelete(null);
    };

    const StatusBadge = ({ status }: { status: Villa['status'] }) => (
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLORS[status] || 'bg-slate-100 text-slate-700'}`}>
            {status}
        </span>
    );

    return (
        <>
            <ConfirmationModal
                isOpen={!!villaToDelete}
                onClose={() => setVillaToDelete(null)}
                onConfirm={confirmDelete}
                title="Hapus Villa?"
                message={`Apakah Anda yakin ingin menghapus "${villaToDelete?.nama_listing}"? Aksi ini tidak dapat dibatalkan.`}
            />
            {isModalOpen && <VillaFormModal villa={editingVilla} onClose={() => setIsModalOpen(false)} onSave={handleSave} />}
            
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Kelola Listing Villa</h1>
                        <p className="text-slate-500 mt-1">Tambah, edit, atau hapus properti dari daftar.</p>
                    </div>
                    <button onClick={handleAddNew} className="w-full mt-4 sm:mt-0 sm:w-auto bg-sky-600 text-white font-semibold py-2.5 px-5 rounded-lg hover:bg-sky-700 flex items-center justify-center gap-2 shadow-sm hover:shadow-lg transition-shadow">
                        <Plus size={18}/> Tambah Villa Baru
                    </button>
                </div>
            
                <div className="relative w-full sm:max-w-xs mb-6">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input 
                        type="text" 
                        placeholder="Cari nama villa..." 
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* --- Tampilan Tabel untuk Desktop --- */}
                <div className="bg-white rounded-2xl shadow-lg overflow-x-auto hidden md:block">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="p-4 font-semibold text-slate-600">Gambar</th>
                                <th className="p-4 font-semibold text-slate-600">Nama Villa</th>
                                <th className="p-4 font-semibold text-slate-600">Status</th>
                                <th className="p-4 font-semibold text-slate-600">Harga</th>
                                <th className="p-4 font-semibold text-slate-600 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => <VillaRowSkeleton key={i} />)
                            ) : villas.map(villa => (
                                <tr key={villa.id} className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50">
                                    <td className="p-2">
                                        <img src={`${villa.foto_urls?.[0]}?width=96&height=64`} alt={villa.nama_listing} className="w-24 h-16 object-cover rounded-md bg-slate-100"/>
                                    </td>
                                    <td className="p-4 font-semibold text-slate-800">{villa.nama_listing}</td>
                                    <td className="p-4"><StatusBadge status={villa.status} /></td>
                                    <td className="p-4 text-slate-600 font-medium">{formatHarga(villa.harga)}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-4">
                                            <button onClick={() => handleEdit(villa)} className="text-slate-500 hover:text-sky-600 flex items-center gap-1.5 text-sm"><Edit size={16}/> Edit</button>
                                            <button onClick={() => setVillaToDelete(villa)} className="text-slate-500 hover:text-red-600 flex items-center gap-1.5 text-sm"><Trash2 size={16}/> Hapus</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* --- Tampilan Kartu untuk Mobile --- */}
                <div className="space-y-4 md:hidden">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                           <div key={i} className="bg-white rounded-2xl shadow-lg p-4 border animate-pulse">
                             <div className="flex gap-4">
                               <div className="w-24 h-24 bg-slate-200 rounded-lg"></div>
                               <div className="flex-1 space-y-3">
                                 <div className="h-5 bg-slate-200 rounded w-full"></div>
                                 <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                 <div className="h-6 bg-slate-200 rounded w-1/2"></div>
                               </div>
                             </div>
                           </div>
                        ))
                    ) : villas.map(villa => (
                        <div key={villa.id} className="bg-white rounded-2xl shadow-lg p-4 border border-slate-200">
                            <div className="flex gap-4">
                                <img src={`${villa.foto_urls?.[0]}?width=96&height=96`} alt={villa.nama_listing} className="w-24 h-24 object-cover rounded-lg bg-slate-100 flex-shrink-0"/>
                                <div className="flex-grow">
                                    <p className="font-bold text-slate-800 leading-tight">{villa.nama_listing}</p>
                                    <div className="my-2"><StatusBadge status={villa.status} /></div>
                                    <p className="text-slate-600 font-semibold">{formatHarga(villa.harga)}</p>
                                </div>
                            </div>
                            <div className="border-t my-3"></div>
                            <div className="flex justify-end gap-2">
                                <button onClick={() => handleEdit(villa)} className="text-slate-600 hover:text-sky-700 bg-slate-100 hover:bg-sky-100 text-sm font-semibold py-2 px-4 rounded-lg flex items-center gap-1.5"><Edit size={14}/> Edit</button>
                                <button onClick={() => setVillaToDelete(villa)} className="text-slate-600 hover:text-red-700 bg-slate-100 hover:bg-red-100 text-sm font-semibold py-2 px-4 rounded-lg flex items-center gap-1.5"><Trash2 size={14}/> Hapus</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}