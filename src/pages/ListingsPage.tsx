import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, ListFilter, ArrowLeft, X, RotateCcw } from 'lucide-react';
import VillaCard from '../components/VillaCard'; // Pastikan path ini benar
import Pagination from '../components/Pagination'; // Pastikan path ini benar
import { supabase } from '../utils/supabase'; // Pastikan path ini benar
import { motion, AnimatePresence } from 'framer-motion';

// ==== Tipe Data & Konstanta ====
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

// ==== Hook Debounce ====
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// ==== Komponen Skeleton ====
const VillaCardSkeleton = () => (
  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 animate-pulse">
    <div className="aspect-video bg-slate-200 rounded-lg mb-4"></div>
    <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
    <div className="h-9 bg-slate-200 rounded w-full"></div>
  </div>
);

// ==== Komponen Filter Panel ====
interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: { term: string; status: string; sort: string };
  onFilterChange: (key: keyof FilterPanelProps['filters'], value: string) => void;
  onReset: () => void;
  resultCount: number;
}

const FilterPanel: React.FC<FilterPanelProps> = React.memo(({ isOpen, onClose, filters, onFilterChange, onReset, resultCount }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "100%" }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white w-full max-h-[85vh] rounded-t-2xl p-6 overflow-y-auto 
                       md:bottom-auto md:top-0 md:right-0 md:h-full md:max-w-sm md:rounded-t-none md:rounded-l-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Filter & Urutkan</h3>
              <button onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-100"><X size={24} /></button>
            </div>
            <div className="space-y-6 pb-24 md:pb-6">
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-600">Cari Villa</label>
                <div className="relative">
                  <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Nama villa atau lokasi..." value={filters.term} onChange={(e) => onFilterChange('term', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:bg-white" />
                </div>
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-600">Status</label>
                <select value={filters.status} onChange={(e) => onFilterChange('status', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500">
                  <option value="All">Semua Status</option><option value="Tersedia">Tersedia</option><option value="Promo">Promo</option><option value="Sold Out">Sold Out</option>
                </select>
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-600">Urutkan</label>
                <select value={filters.sort} onChange={(e) => onFilterChange('sort', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500">
                  <option value="created_at-desc">Terbaru</option><option value="harga-asc">Harga Terendah</option><option value="harga-desc">Harga Tertinggi</option><option value="roi_perkiraan-desc">ROI Tertinggi</option>
                </select>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t border-slate-200 flex gap-3">
              <button onClick={onReset} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-100"><RotateCcw size={16} /> Reset</button>
              <button onClick={onClose} className="flex-[2] px-4 py-3 bg-sky-500 text-white font-bold rounded-lg hover:bg-sky-600">Tampilkan ({resultCount}) Villa</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// ==== Komponen Utama Halaman ====
export default function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    term: searchParams.get('search') || '',
    status: searchParams.get('status') || 'All',
    sort: searchParams.get('sort') || 'created_at-desc',
  });
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [villas, setVillas] = useState<Villa[]>([]);
  const [totalVillas, setTotalVillas] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const debouncedSearchTerm = useDebounce(filters.term, 500);

  useEffect(() => {
    const fetchVillas = async () => {
      setLoading(true);
      
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      const [sortField, sortOrder] = filters.sort.split('-');

      let query = supabase
        .from('villa_listings')
        .select('*', { count: 'exact' });

      if (debouncedSearchTerm) {
        query = query.or(`nama_listing.ilike.%${debouncedSearchTerm}%,alamat_lengkap.ilike.%${debouncedSearchTerm}%`);
      }
      if (filters.status !== 'All') {
        query = query.eq('status', filters.status);
      }
      
      query = query
        .order(sortField, { ascending: sortOrder === 'asc' })
        .range(from, to);

      try {
        const { data, error, count } = await query;
        if (error) throw error;

        setVillas(data as Villa[]);
        setTotalVillas(count || 0);
      } catch (error) {
        console.error('Error fetching villas:', error);
        setVillas([]);
        setTotalVillas(0);
      } finally {
        setLoading(false);
      }
    };

    fetchVillas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, debouncedSearchTerm, filters.status, filters.sort]);
  
  useEffect(() => {
    const newParams = new URLSearchParams();
    if (debouncedSearchTerm) newParams.set('search', debouncedSearchTerm);
    if (filters.status !== 'All') newParams.set('status', filters.status);
    if (filters.sort !== 'created_at-desc') newParams.set('sort', filters.sort);
    if (currentPage > 1) newParams.set('page', currentPage.toString());
    setSearchParams(newParams);
  }, [debouncedSearchTerm, filters.status, filters.sort, currentPage, setSearchParams]);
  
  const handleFilterChange = useCallback((key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({ term: '', status: 'All', sort: 'created_at-desc' });
    setCurrentPage(1);
  }, []);

  const isFilterActive = useMemo(() => 
    filters.term !== '' || filters.status !== 'All' || filters.sort !== 'created_at-desc',
    [filters]
  );

  return (
    <div className="pt-20">
      <section id="listings" className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          
          {/* ✨ JARAK DIPERBAIKI PADA BLOK INI */}
          <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
            <div className="mb-4 md:mb-6">
              <Link to="/" className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-800 transition-colors text-sm font-semibold">
                <ArrowLeft size={16} /> Kembali ke Beranda
              </Link>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-3 md:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-sky-700">
              Temukan Investasi Anda
            </h2>
            <p className="text-base md:text-lg text-slate-600">
              Jelajahi pilihan properti yang telah kami kurasi, dirancang untuk memberikan keuntungan dan ketenangan pikiran.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <p className="text-slate-600 text-sm md:text-base w-full order-2 md:order-1 text-center md:text-left">
              {loading ? <span className="inline-block h-5 w-48 bg-slate-200 rounded-md animate-pulse"></span> :
                totalVillas > 0 ? `Menampilkan ${(currentPage - 1) * ITEMS_PER_PAGE + 1}-${(currentPage - 1) * ITEMS_PER_PAGE + villas.length} dari ${totalVillas} properti` : 'Tidak ada properti yang ditemukan.'
              }
            </p>
            <button onClick={() => setShowFilters(true)} className="relative w-full md:w-auto flex-shrink-0 flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-100 shadow-sm order-1 md:order-2">
              <ListFilter size={18} /> Filter & Cari
              {isFilterActive && <div className="absolute -top-1 -right-1 w-3 h-3 bg-sky-500 rounded-full border-2 border-white"></div>}
            </button>
          </div>

          <FilterPanel isOpen={showFilters} onClose={() => setShowFilters(false)} filters={filters} onFilterChange={handleFilterChange} onReset={handleResetFilters} resultCount={totalVillas} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 min-h-[500px]">
            {loading ? (
              Array.from({ length: 9 }).map((_, index) => <VillaCardSkeleton key={index} />)
            ) : villas.length > 0 ? (
              villas.map((villa) => <VillaCard key={villa.id} villa={villa} />)
            ) : (
              <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-slate-200"><Search size={40} className="text-slate-300 mx-auto mb-4" /><h3 className="text-2xl font-semibold text-slate-700">Properti Tidak Ditemukan</h3><p className="text-slate-500 mt-2">Silakan ubah kata kunci pencarian atau reset filter Anda.</p></div>
            )}
          </div>

          {!loading && totalVillas > ITEMS_PER_PAGE && (
            <Pagination currentPage={currentPage} totalCount={totalVillas} pageSize={ITEMS_PER_PAGE} onPageChange={page => setCurrentPage(page)} />
          )}
        </div>
      </section>
    </div>
  );
}