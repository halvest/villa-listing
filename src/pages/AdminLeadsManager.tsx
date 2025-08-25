// src/pages/AdminLeadsManager.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../utils/supabase';
import { Phone, Edit, Check, Trash2, X, Search, Filter, AlertTriangle, MessageSquare, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Tipe Data & Konstanta ---
interface Lead {
  id: string;
  created_at: string;
  nama: string;
  domisili: string;
  no_wa: string;
  status: 'Baru' | 'Dihubungi' | 'Tertarik' | 'Tidak Tertarik';
  villa_listings: {
    nama_listing: string;
  } | null;
}

const STATUS_OPTIONS: Lead['status'][] = ['Baru', 'Dihubungi', 'Tertarik', 'Tidak Tertarik'];
const STATUS_COLORS: { [key in Lead['status']]: string } = {
  'Baru': 'bg-blue-100 text-blue-700',
  'Dihubungi': 'bg-yellow-100 text-yellow-700',
  'Tertarik': 'bg-green-100 text-green-700',
  'Tidak Tertarik': 'bg-red-100 text-red-700'
};

// --- Sub-komponen ---
const StatusBadge = ({ status }: { status: Lead['status'] }) => (
  <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLORS[status]}`}>
    {status}
  </span>
);

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
            <button onClick={onConfirm} className="flex-1 px-4 py-2.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700">Hapus</button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const WhatsAppModal = ({ isOpen, onClose, selectedLeads }) => {
    const [message, setMessage] = useState('');
    const [copySuccess, setCopySuccess] = useState('');

    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return "Selamat Pagi";
        if (hour < 18) return "Selamat Siang";
        return "Selamat Malam";
    }, []);

    useEffect(() => {
        if(isOpen) {
            setMessage(
                `${greeting}, perkenalkan saya dari tim Haspro Villa.\n\n`+
                `Terima kasih atas ketertarikan Anda terhadap properti villa kami. Apakah ada informasi lebih lanjut yang Anda butuhkan atau ingin menjadwalkan survei lokasi?\n\n`+
                `Terima kasih.`
            );
            setCopySuccess('');
        }
    }, [isOpen, greeting]);

    const handleCopy = () => {
        const numbers = selectedLeads.map(lead => lead.no_wa).join(', ');
        const textToCopy = `PESAN UNTUK BROADCAST:\n------------------------\n${message}\n\nDAFTAR NOMOR TUJUAN:\n------------------------\n${numbers}`;
        navigator.clipboard.writeText(textToCopy);
        setCopySuccess('Pesan & Nomor berhasil disalin!');
        setTimeout(() => setCopySuccess(''), 3000);
    };

    if (!isOpen) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl max-w-lg w-full shadow-2xl">
                <div className="p-6 border-b">
                    <h3 className="text-lg font-bold text-slate-800">Kirim Pesan WhatsApp Massal</h3>
                    <p className="text-sm text-slate-500">Siapkan pesan untuk dikirim ke {selectedLeads.length} prospek terpilih.</p>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-slate-600">Template Pesan</label>
                        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} className="w-full mt-1 p-3 bg-slate-50 border-slate-200 border rounded-lg focus:ring-2 focus:ring-sky-500 text-sm"></textarea>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-600">Nomor Tujuan ({selectedLeads.length})</p>
                        <p className="text-xs text-slate-500 bg-slate-100 p-2 rounded-md mt-1 break-words">{selectedLeads.map(lead => lead.no_wa).join(', ')}</p>
                    </div>
                </div>
                <div className="p-6 bg-slate-50 rounded-b-2xl flex flex-col sm:flex-row items-center gap-4">
                    <button onClick={handleCopy} className="w-full sm:w-auto flex-1 bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 flex items-center justify-center gap-2">
                        <Copy size={16}/> Salin Pesan & Nomor
                    </button>
                    <div className="w-full sm:w-auto flex-1 text-center">
                        {copySuccess ? 
                            <p className="text-sm text-green-600 font-semibold">{copySuccess}</p> :
                            <p className="text-xs text-slate-500">Lalu buka WhatsApp dan buat Broadcast List untuk menempelkan pesan.</p>
                        }
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
};


// --- Komponen Utama ---
export default function AdminLeadsManager() {
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<Lead['status']>('Baru');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
  const [isWaModalOpen, setIsWaModalOpen] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select(`id, created_at, nama, domisili, no_wa, status, villa_listings ( nama_listing )`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
      alert('Gagal memuat data prospek.');
    } else {
      setAllLeads(data as Lead[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const filteredLeads = useMemo(() => {
    return allLeads
      .filter(lead => statusFilter === 'Semua' || lead.status === statusFilter)
      .filter(lead => lead.nama.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [allLeads, statusFilter, searchTerm]);

  const handleSelectLead = (leadId: string) => {
    const newSelection = new Set(selectedLeadIds);
    if (newSelection.has(leadId)) {
      newSelection.delete(leadId);
    } else {
      newSelection.add(leadId);
    }
    setSelectedLeadIds(newSelection);
  };

  const handleSelectAll = () => {
    const allFilteredIds = new Set(filteredLeads.map(l => l.id));
    if (selectedLeadIds.size === filteredLeads.length && filteredLeads.length > 0) {
      setSelectedLeadIds(new Set()); // Deselect all
    } else {
      setSelectedLeadIds(allFilteredIds); // Select all
    }
  };

  const selectedLeadsData = useMemo(() => {
    return allLeads.filter(lead => selectedLeadIds.has(lead.id));
  }, [selectedLeadIds, allLeads]);

  const handleEditStatus = (lead: Lead) => {
    setEditingLeadId(lead.id);
    setNewStatus(lead.status);
  };
  
  const handleCancelEdit = () => setEditingLeadId(null);

  const handleUpdateStatus = async (leadId: string) => {
    const originalLeads = [...allLeads];
    setAllLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    setEditingLeadId(null);

    const { error } = await supabase.from('leads').update({ status: newStatus }).eq('id', leadId);
    if (error) {
      alert(`Gagal memperbarui status: ${error.message}`);
      setAllLeads(originalLeads);
    }
  };

  const handleDelete = async () => {
    if (!leadToDelete) return;
    const originalLeads = [...allLeads];
    setAllLeads(prev => prev.filter(l => l.id !== leadToDelete.id));
    setLeadToDelete(null);

    const { error } = await supabase.from('leads').delete().eq('id', leadToDelete.id);
    if (error) {
      alert(`Error: ${error.message}`);
      setAllLeads(originalLeads);
    }
  };

  if (loading) return <div className="p-4 sm:p-6 lg:p-8">Memuat data prospek...</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <ConfirmationModal
        isOpen={!!leadToDelete}
        onClose={() => setLeadToDelete(null)}
        onConfirm={handleDelete}
        title="Hapus Prospek?"
        message={`Apakah Anda yakin ingin menghapus prospek atas nama "${leadToDelete?.nama}"? Tindakan ini tidak dapat dibatalkan.`}
      />
      <WhatsAppModal isOpen={isWaModalOpen} onClose={() => setIsWaModalOpen(false)} selectedLeads={selectedLeadsData} />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Kelola Prospek Masuk</h1>
        <p className="text-slate-500 mt-1">Lacak dan kelola semua calon investor yang telah mengirimkan permintaan.</p>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
                type="text" 
                placeholder="Cari nama prospek..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
            />
        </div>
        <div className="relative">
            <Filter size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg appearance-none"
            >
                <option value="Semua">Semua Status</option>
                {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-x-auto hidden md:block">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 w-12">
                <input 
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    checked={filteredLeads.length > 0 && selectedLeadIds.size === filteredLeads.length}
                    onChange={handleSelectAll}
                    aria-label="Pilih semua"
                />
              </th>
              <th className="p-4 font-semibold text-slate-600">Tanggal Masuk</th>
              <th className="p-4 font-semibold text-slate-600">Nama</th>
              <th className="p-4 font-semibold text-slate-600">No. WhatsApp</th>
              <th className="p-4 font-semibold text-slate-600">Villa Diminati</th>
              <th className="p-4 font-semibold text-slate-600">Status</th>
              <th className="p-4 font-semibold text-slate-600 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr><td colSpan={7} className="text-center p-8 text-slate-500">Tidak ada data yang cocok.</td></tr>
            ) : filteredLeads.map(lead => (
              <tr key={lead.id} className={`border-b border-slate-200 last:border-b-0 hover:bg-slate-50 ${selectedLeadIds.has(lead.id) ? 'bg-sky-50' : ''}`}>
                <td className="p-4">
                    <input 
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        checked={selectedLeadIds.has(lead.id)}
                        onChange={() => handleSelectLead(lead.id)}
                        aria-label={`Pilih ${lead.nama}`}
                    />
                </td>
                <td className="p-4 text-sm text-slate-600 whitespace-nowrap">{new Date(lead.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                <td className="p-4 font-semibold text-slate-800">{lead.nama}<p className="font-normal text-xs text-slate-500">{lead.domisili}</p></td>
                <td className="p-4"><a href={`https://wa.me/${lead.no_wa.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline flex items-center gap-1.5 text-sm w-fit"><Phone size={14}/> {lead.no_wa}</a></td>
                <td className="p-4 text-sm text-slate-600">{lead.villa_listings?.nama_listing || 'N/A'}</td>
                <td className="p-4">
                  {editingLeadId === lead.id ? (
                    <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as Lead['status'])} className="p-1.5 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-sky-500">
                      {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : <StatusBadge status={lead.status} />}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end items-center gap-2">
                    {editingLeadId === lead.id ? (
                      <>
                        <button onClick={() => handleUpdateStatus(lead.id)} className="text-green-600 hover:text-green-800 p-1"><Check size={18}/></button>
                        <button onClick={handleCancelEdit} className="text-slate-500 hover:text-slate-700 p-1"><X size={18}/></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditStatus(lead)} className="text-slate-500 hover:text-sky-600 p-1"><Edit size={16}/></button>
                        <button onClick={() => setLeadToDelete(lead)} className="text-slate-500 hover:text-red-600 p-1"><Trash2 size={16}/></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 md:hidden">
        {filteredLeads.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-2xl text-slate-500">Tidak ada data yang cocok.</div>
        ) : filteredLeads.map(lead => (
          <div key={lead.id} className={`bg-white rounded-2xl shadow-lg p-4 border transition-colors ${selectedLeadIds.has(lead.id) ? 'border-sky-500 ring-2 ring-sky-200' : 'border-slate-200'}`}>
            <div className="flex justify-between items-start gap-3">
              <div className="flex items-start gap-3 flex-grow">
                <input 
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 mt-1 flex-shrink-0"
                    checked={selectedLeadIds.has(lead.id)}
                    onChange={() => handleSelectLead(lead.id)}
                    aria-label={`Pilih ${lead.nama}`}
                />
                <div>
                  <p className="font-bold text-slate-800">{lead.nama}</p>
                  <p className="text-sm text-slate-500">{lead.domisili}</p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(lead.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
              {editingLeadId === lead.id ? (
                 <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as Lead['status'])} className="p-1.5 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-sky-500">
                      {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                 </select>
              ) : <StatusBadge status={lead.status} /> }
            </div>
            <div className="border-t my-3"></div>
            <div className="space-y-2 text-sm">
              <p className="text-slate-500">Diminati: <span className="font-semibold text-slate-700">{lead.villa_listings?.nama_listing || 'N/A'}</span></p>
              <a href={`https://wa.me/${lead.no_wa.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline flex items-center gap-1.5 w-fit"><Phone size={14}/> {lead.no_wa}</a>
            </div>
            <div className="border-t my-3"></div>
            <div className="flex justify-end items-center gap-2">
               {editingLeadId === lead.id ? (
                  <>
                    <button onClick={() => handleUpdateStatus(lead.id)} className="text-green-600 hover:text-green-800 p-2 bg-green-50 rounded-md"><Check size={18}/></button>
                    <button onClick={handleCancelEdit} className="text-slate-500 hover:text-slate-700 p-2 bg-slate-100 rounded-md"><X size={18}/></button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditStatus(lead)} className="text-slate-500 hover:text-sky-600 p-2"><Edit size={16}/></button>
                    <button onClick={() => setLeadToDelete(lead)} className="text-slate-500 hover:text-red-600 p-2"><Trash2 size={16}/></button>
                  </>
                )}
            </div>
          </div>
        ))}
      </div>
      
      <AnimatePresence>
        {selectedLeadIds.size > 0 && (
            <motion.div
                initial={{ y: 120, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 120, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40"
            >
                <button 
                    onClick={() => setIsWaModalOpen(true)}
                    className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold py-3 px-5 rounded-full shadow-lg flex items-center gap-3 hover:scale-105 transition-transform"
                >
                    <MessageSquare size={20} />
                    Kirim Pesan ke ({selectedLeadIds.size}) Prospek
                </button>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}