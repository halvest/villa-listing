import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ListFilter, ArrowLeft, ArrowRight, X, RotateCcw } from 'lucide-react';
import VillaCard from '../components/VillaCard';
import Pagination from '../components/Pagination';
import { supabase } from '../utils/supabase';
import { motion, AnimatePresence } from 'framer-motion';

// Tipe Data Villa
interface Villa {
  id: string;
  slug: string;
  nama_listing: string;
  alamat_lengkap: string;
  harga: number;
  status: 'Tersedia' | 'Promo' | 'Sold Out';
  foto_urls: string[];
  tipe_villa: string;
  luas_bangunan?: number;
  luas_tanah?: number;
}

const ITEMS_PER_PAGE = 9;

// Custom hook untuk debounce input
const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
      const handler = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};
  
// Komponen untuk tampilan loading
const VillaCardSkeleton = () => (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 animate-pulse">
      <div className="aspect-video bg-slate-200 rounded-lg mb-4"></div>
      <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
      <div className="h-9 bg-slate-200 rounded w-full"></div>
    </div>
);
  
// Tipe props untuk FilterPanel
interface FilterPanelProps {
    isOpen: boolean;
    onClose: () => void;
    filters: { term: string; status: string; sort: string };
    setFilters: React.Dispatch<React.SetStateAction<{ term: string; status: string; sort: string }>>;
    onReset: () => void;
    resultCount: number;
}
  
// Komponen Panel Filter
const FilterPanel: React.FC<FilterPanelProps> = ({ isOpen, onClose, filters, setFilters, onReset, resultCount }) => {
  const handleFilterChange = (key: 'term' | 'status' | 'sort', value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white w-full max-h-[85vh] rounded-t-2xl p-6 overflow-y-auto 
                       md:bottom-auto md:top-0 md:right-0 md:h-full md:max-w-sm md:rounded-t-none md:rounded-l-2xl md:initial-x-100 md:exit-x-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Filter & Pencarian</h3>
              <button onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-100"><X size={24} /></button>
            </div>
            
            <div className="space-y-6 pb-24 md:pb-6">
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-600">Cari Villa</label>
                <div className="relative">
                  <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Nama villa atau lokasi..." value={filters.term} onChange={(e) => handleFilterChange('term', e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:bg-white"/>
                </div>
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-600">Status</label>
                <select value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 appearance-none">
                  <option value="All">Semua Status</option>
                  <option value="Tersedia">Tersedia</option>
                  <option value="Promo">Promo</option>
                  <option value="Sold Out">Sold Out</option>
                </select>
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-600">Urutkan</label>
                <select value={filters.sort} onChange={(e) => handleFilterChange('sort', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 appearance-none">
                  <option value="created_at-desc">Terbaru</option>
                  <option value="harga-asc">Harga Terendah</option>
                  <option value="harga-desc">Harga Tertinggi</option>
                  <option value="roi_perkiraan-desc">ROI Tertinggi</option>
                </select>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t border-slate-200 flex gap-3">
              <button onClick={onReset} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-100">
                <RotateCcw size={16} /> Reset
              </button>
              <button onClick={onClose} className="flex-[2] px-4 py-3 bg-sky-500 text-white font-bold rounded-lg hover:bg-sky-600">
                Tampilkan ({resultCount}) Villa
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


// Komponen Utama ListingsPage
export default function ListingsPage() {
    const [filters, setFilters] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return {
          term: params.get('search') || '',
          status: params.get('status') || 'All',
          sort: params.get('sort') || 'created_at-desc',
        };
    });
    
    const [currentPage, setCurrentPage] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return parseInt(params.get('page') || '1', 10);
    });
      
    const [villas, setVillas] = useState<Villa[]>([]);
    const [loading, setLoading] = useState(true);
    const debouncedSearchTerm = useDebounce(filters.term, 500);
    const [totalVillas, setTotalVillas] = useState(0);
    const [showFilters, setShowFilters] = useState(false);
    
    useEffect(() => {
        const params = new URLSearchParams();
        if (debouncedSearchTerm) params.set('search', debouncedSearchTerm);
        if (filters.status !== 'All') params.set('status', filters.status);
        if (filters.sort !== 'created_at-desc') params.set('sort', filters.sort);
        if (currentPage > 1) params.set('page', currentPage.toString());
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
    }, [debouncedSearchTerm, filters.status, filters.sort, currentPage]);
      
    useEffect(() => {
        if (currentPage !== 1) {
          setCurrentPage(1);
        }
    }, [debouncedSearchTerm, filters.status, filters.sort]);
      
    useEffect(() => {
        const fetchVillas = async () => {
          setLoading(true);
          
          const { data: count, error: countError } = await supabase.rpc('get_villas_count', {
              search_term: debouncedSearchTerm,
              status_filter: filters.status,
          });

          if(countError) {
              console.error("Error fetching count:", countError);
              setTotalVillas(0);
          } else {
              setTotalVillas(count);
          }

          const from = (currentPage - 1) * ITEMS_PER_PAGE;
          let query = supabase.from('villa_listings').select('*');
    
          if (debouncedSearchTerm) query = query.or(`nama_listing.ilike.%${debouncedSearchTerm}%,alamat_lengkap.ilike.%${debouncedSearchTerm}%`);
          if (filters.status !== 'All') query = query.eq('status', filters.status);
          
          const [sortField, sortOrder] = filters.sort.split('-');
          query = query.order(sortField, { ascending: sortOrder === 'asc' }).range(from, from + ITEMS_PER_PAGE - 1);
    
          try {
            const { data, error } = await query;
            if (error) throw error;
            setVillas(data as Villa[]);
          } catch (error) {
            console.error('Error fetching villas:', error);
            setVillas([]);
          } finally {
            setLoading(false);
          }
        };
    
        fetchVillas();
    }, [currentPage, debouncedSearchTerm, filters.status, filters.sort]);

    const handleResetFilters = () => {
        setFilters({ term: '', status: 'All', sort: 'created_at-desc' });
    };

    const isFilterActive = filters.term !== '' || filters.status !== 'All' || filters.sort !== 'created_at-desc';

    return (
        <div className="pt-20">
            <section id="listings" className="py-16 md:py-24 bg-slate-50">
              <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-12">
                  
                  {/* Tombol Kembali ke Beranda */}
                  <div className="mb-6">
                    <Link 
                      to="/" 
                      className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-800 transition-colors text-sm font-semibold"
                    >
                      <ArrowLeft size={16} />
                      Kembali ke Beranda
                    </Link>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-sky-700">
                    Temukan Investasi Anda
                  </h2>
                  <p className="text-lg text-slate-600">
                    Jelajahi pilihan properti yang telah kami kurasi, dirancang untuk memberikan keuntungan dan ketenangan pikiran.
                  </p>
                </div>
        
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <p className="text-slate-600 text-sm md:text-base w-full order-2 md:order-1 text-center md:text-left">
                      {!loading && totalVillas > 0 ? (
                        <>
                          Menampilkan <span className="font-bold text-slate-800">{(currentPage - 1) * ITEMS_PER_PAGE + 1}-{(currentPage - 1) * ITEMS_PER_PAGE + villas.length}</span> dari <span className="font-bold text-slate-800">{totalVillas}</span> properti
                        </>
                      ) : !loading && totalVillas === 0 ? 'Tidak ada properti yang ditemukan.' : <>&nbsp;</>}
                    </p>
                    <button
                      onClick={() => setShowFilters(true)}
                      className="relative w-full md:w-auto flex-shrink-0 flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-100 shadow-sm order-1 md:order-2"
                    >
                      <ListFilter size={18} />
                      Filter & Cari
                      {isFilterActive && <div className="absolute -top-1 -right-1 w-3 h-3 bg-sky-500 rounded-full border-2 border-white"></div>}
                    </button>
                </div>
                
                <FilterPanel 
                  isOpen={showFilters} 
                  onClose={() => setShowFilters(false)} 
                  filters={filters}
                  setFilters={setFilters}
                  onReset={handleResetFilters}
                  resultCount={totalVillas}
                />
        
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 min-h-[500px]">
                  {loading ? (
                    Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => <VillaCardSkeleton key={index} />)
                  ) : villas.length > 0 ? (
                    villas.map((villa) => ( <VillaCard key={villa.id} villa={villa} /> ))
                  ) : (
                    <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-slate-200">
                      <Search size={40} className="text-slate-300 mx-auto mb-4" />
                      <h3 className="text-2xl font-semibold text-slate-700">Properti Tidak Ditemukan</h3>
                      <p className="text-slate-500 mt-2">Silakan ubah kata kunci pencarian atau reset filter Anda.</p>
                    </div>
                  )}
                </div>
        
                {!loading && totalVillas > ITEMS_PER_PAGE && (
                    <Pagination
                        currentPage={currentPage}
                        totalCount={totalVillas}
                        pageSize={ITEMS_PER_PAGE}
                        onPageChange={page => setCurrentPage(page)}
                        disabled={loading}
                    />
                )}
              </div>
            </section>
        </div>
    );
}