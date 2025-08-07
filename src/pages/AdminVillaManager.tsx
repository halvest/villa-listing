// src/pages/AdminVillaManager.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import VillaFormModal from '../components/VillaFormModal';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { formatHarga } from '../utils/idr';

export default function AdminVillaManager() {
    const [villas, setVillas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingVilla, setEditingVilla] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchVillas = useCallback(async () => {
        setLoading(true);
        let query = supabase.from('villa_listings').select('*').order('created_at', { ascending: false });
        
        if (searchTerm) {
            query = query.or(`nama_listing.ilike.%${searchTerm}%,alamat_lengkap.ilike.%${searchTerm}%`);
        }
        
        const { data, error } = await query;
        if (error) {
            console.error('Error fetching villas:', error);
            alert('Gagal memuat data villa.');
        } else {
            setVillas(data || []);
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
    const handleEdit = (villa) => { setEditingVilla(villa); setIsModalOpen(true); };
    const handleSave = () => { setIsModalOpen(false); fetchVillas(); };

    const handleDelete = async (villaId) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus villa ini? Aksi ini tidak dapat dibatalkan.')) {
            const { error } = await supabase.from('villa_listings').delete().eq('id', villaId);
            if (error) {
                alert(`Error: ${error.message}`);
            } else {
                alert('Villa berhasil dihapus.');
                fetchVillas();
            }
        }
    };

    return (
        // --- PERBAIKAN: Tambahkan Fragment Pembungkus ---
        <>
            <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Kelola Listing Villa</h1>
                        <p className="text-slate-500 mt-1">Tambah, edit, atau hapus properti dari daftar.</p>
                    </div>
                    <button onClick={handleAddNew} className="w-full mt-4 sm:mt-0 sm:w-auto bg-sky-600 text-white font-semibold py-2.5 px-5 rounded-lg hover:bg-sky-700 flex items-center justify-center gap-2">
                        <Plus size={18}/> Tambah Villa Baru
                    </button>
                </div>
            
                <div className="relative w-full sm:max-w-xs mb-6">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input 
                        type="text" 
                        placeholder="Cari villa..." 
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="p-4 font-semibold text-slate-600">Gambar</th>
                                <th className="p-4 font-semibold text-slate-600">Nama Villa</th>
                                <th className="p-4 font-semibold text-slate-600">Status</th>
                                <th className="p-4 font-semibold text-slate-600">Harga</th>
                                <th className="p-4 font-semibold text-slate-600">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="text-center p-8 text-slate-500">Memuat data...</td></tr>
                            ) : villas.map(villa => (
                                <tr key={villa.id} className="border-b border-slate-200 hover:bg-slate-50">
                                    <td className="p-2">
                                        <img src={villa.foto_urls?.[0]} alt={villa.nama_listing} className="w-24 h-16 object-cover rounded-md bg-slate-100"/>
                                    </td>
                                    <td className="p-4 font-semibold text-slate-800">{villa.nama_listing}</td>
                                    <td className="p-4">
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${villa.status === 'Tersedia' ? 'bg-green-100 text-green-700' : (villa.status === 'Promo' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700')}`}>
                                            {villa.status}
                                        </span>
                                    </td>
                                    <td className="p-4">{formatHarga(villa.harga)}</td>
                                    <td className="p-4 space-x-4">
                                        <button onClick={() => handleEdit(villa)} className="text-slate-500 hover:text-sky-600"><Edit size={18}/></button>
                                        <button onClick={() => handleDelete(villa.id)} className="text-slate-500 hover:text-red-600"><Trash2 size={18}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Paginasi bisa ditambahkan di sini jika perlu */}
            </div>
            
            {isModalOpen && <VillaFormModal villa={editingVilla} onClose={() => setIsModalOpen(false)} onSave={handleSave} />}
        </> // <-- PERBAIKAN: Tambahkan Fragment Penutup
    );
}