// src/components/VillaListings.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Search, ListFilter, ArrowDownUp, ArrowLeft, ArrowRight, X } from 'lucide-react';
import VillaCard from './VillaCard';
import { supabase } from '../utils/supabase';
import { motion, AnimatePresence } from 'framer-motion';

// Tipe data Villa yang lengkap
interface Villa {
  id: string;
  slug: string;
  nama_listing: string;
  alamat_lengkap: string;
  harga: number;
  status: 'Tersedia' | 'Promo' | 'Sold Out';
  foto_urls: string[];
  roi_perkiraan?: number;
  tipe_villa: string;
  luas_bangunan?: number;
  luas_tanah?: number;
  fasilitas?: string[];
}

const ITEMS_PER_PAGE = 9;

// Komponen Skeleton Card untuk Loading
const VillaCardSkeleton = () => (
  <div className="bg-white border border-slate-200 rounded-2xl shadow p-5 animate-pulse">
    <div className="aspect-video bg-slate-200 rounded-lg mb-4"></div>
    <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
    <div className="h-9 bg-slate-200 rounded w-full"></div>
  </div>
);

export default function VillaListings() {
  const [villas, setVillas] = useState<Villa[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk filter dan sort
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('created_at-desc');
  
  // State untuk paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const [totalVillas, setTotalVillas] = useState(0);

  // State untuk UI
  const [showFilters, setShowFilters] = useState(false);

  const fetchVillas = useCallback(async () => {
    setLoading(true);
    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    let query = supabase.from('villa_listings').select('*', { count: 'exact' });

    if (searchTerm) query = query.or(`nama_listing.ilike.%${searchTerm}%,alamat_lengkap.ilike.%${searchTerm}%`);
    if (selectedStatus !== 'All') query = query.eq('status', selectedStatus);

    const [sortField, sortOrder] = sortBy.split('-');
    query = query.order(sortField, { ascending: sortOrder === 'asc' });
    query = query.range(from, to);

    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching villas:', error);
      setVillas([]);
      setTotalVillas(0);
    } else {
      setVillas(data as Villa[]);
      setTotalVillas(count || 0);
    }
    setLoading(false);
  }, [currentPage, searchTerm, selectedStatus, sortBy]);

  // useEffect untuk memicu fetch saat filter berubah (dengan debounce)
  useEffect(() => {
    const handler = setTimeout(() => {
      // Selalu reset ke halaman 1 saat filter berubah, lalu fetch data
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchVillas();
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm, selectedStatus, sortBy]);

  // useEffect untuk memicu fetch saat HANYA halaman berubah
  useEffect(() => {
    fetchVillas();
  }, [currentPage]);

  const totalPages = Math.ceil(totalVillas / ITEMS_PER_PAGE);
  const isFilterActive = searchTerm !== '' || selectedStatus !== 'All' || sortBy !== 'created_at-desc';

  return (
    <section id="listings" className="py-24 bg-slate-50 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-sky-700">
            Temukan Investasi Anda
          </h2>
          <p className="text-lg text-slate-600">
            Jelajahi pilihan properti yang telah kami kurasi, dirancang untuk memberikan keuntungan dan ketenangan pikiran.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <p className="text-slate-600 text-sm md:text-base w-full">
                {!loading && (
                    <>
                        Menampilkan <span className="font-bold text-slate-800">{(currentPage - 1) * ITEMS_PER_PAGE + 1} - {(currentPage - 1) * ITEMS_PER_PAGE + villas.length}</span> dari <span className="font-bold text-slate-800">{totalVillas}</span> properti
                    </>
                )}
            </p>
            <button
                onClick={() => setShowFilters(true)}
                className="relative w-full md:w-auto flex-shrink-0 flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-100 shadow-sm"
            >
                <ListFilter size={18} />
                Filter & Cari
                {isFilterActive && <div className="absolute -top-1 -right-1 w-3 h-3 bg-sky-500 rounded-full border-2 border-white"></div>}
            </button>
        </div>
        
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowFilters(false)}
            >
              <motion.div
                initial={{ x: '100%' }} animate={{ x: '0%' }} exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-sm h-full ml-auto p-6 overflow-y-auto relative shadow-xl"
              >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800">Filter & Pencarian</h3>
                    <button onClick={() => setShowFilters(false)} className="p-2 rounded-full hover:bg-slate-100"><X size={24} /></button>
                </div>
                
                <div className="space-y-6">
                    <div>
                      <label className="block mb-1.5 text-sm font-medium text-slate-600">Cari Villa</label>
                      <div className="relative"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="Nama villa atau lokasi..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:bg-white"/></div>
                    </div>
                    <div>
                      <label className="block mb-1.5 text-sm font-medium text-slate-600">Status</label>
                      <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-4 py-2.5 bg-slate-100 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500">
                        <option value="All">Semua Status</option><option value="Tersedia">Tersedia</option><option value="Promo">Promo</option><option value="Sold Out">Sold Out</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1.5 text-sm font-medium text-slate-600">Urutkan</label>
                      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full px-4 py-2.5 bg-slate-100 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500">
                        <option value="created_at-desc">Terbaru</option><option value="harga-asc">Harga Terendah</option><option value="harga-desc">Harga Tertinggi</option><option value="roi_perkiraan-desc">ROI Tertinggi</option>
                      </select>
                    </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 min-h-[500px]">
            {loading ? (
                Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => <VillaCardSkeleton key={index} />)
            ) : villas.length > 0 ? (
                villas.map((villa) => ( <VillaCard key={villa.id} villa={villa} /> ))
            ) : (
                <div className="col-span-1 md:col-span-2 xl:col-span-3 text-center py-20 bg-white rounded-2xl border border-slate-200">
                    <Search size={40} className="text-slate-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-slate-700">Properti Tidak Ditemukan</h3>
                    <p className="text-slate-500 mt-2">Silakan ubah kata kunci pencarian atau filter Anda.</p>
                </div>
            )}
        </div>

        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center mt-12">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg shadow-sm p-1.5">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-2 rounded-md hover:bg-slate-100 disabled:opacity-50 flex items-center gap-2"><ArrowLeft size={16} /> Sebelumnya</button>
              <span className="text-slate-700 font-semibold text-sm px-4"> Halaman {currentPage} dari {totalPages} </span>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-2 rounded-md hover:bg-slate-100 disabled:opacity-50 flex items-center gap-2">Berikutnya <ArrowRight size={16} /></button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}