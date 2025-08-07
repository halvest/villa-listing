// src/pages/AdminLeadsManager.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import { Phone, Edit, Check, Trash2, X } from 'lucide-react';

// Tipe data untuk setiap lead
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

export default function AdminLeadsManager() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<Lead['status']>('Baru');

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select(`
        id, created_at, nama, domisili, no_wa, status,
        villa_listings ( nama_listing )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
      alert('Gagal memuat data prospek.');
    } else {
      setLeads(data as Lead[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleEditStatus = (lead: Lead) => {
    setEditingLeadId(lead.id);
    setNewStatus(lead.status);
  };
  
  const handleCancelEdit = () => {
    setEditingLeadId(null);
  };

  const handleUpdateStatus = async (leadId: string) => {
    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', leadId);
    
    if (error) {
      alert(`Gagal memperbarui status: ${error.message}`);
    } else {
      setEditingLeadId(null);
      fetchLeads(); // Refresh data
    }
  };

  const handleDelete = async (leadId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus prospek ini?')) {
      const { error } = await supabase.from('leads').delete().eq('id', leadId);
      if (error) {
        alert(`Error: ${error.message}`);
      } else {
        alert('Prospek berhasil dihapus.');
        fetchLeads();
      }
    }
  };


  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Kelola Prospek Masuk</h1>
        <p className="text-slate-500 mt-1">Lacak dan kelola semua calon investor yang telah mengirimkan permintaan.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 font-semibold text-slate-600">Tanggal Masuk</th>
              <th className="p-4 font-semibold text-slate-600">Nama</th>
              <th className="p-4 font-semibold text-slate-600">No. WhatsApp</th>
              <th className="p-4 font-semibold text-slate-600">Villa yang Diminati</th>
              <th className="p-4 font-semibold text-slate-600">Status</th>
              <th className="p-4 font-semibold text-slate-600 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center p-8 text-slate-500">Memuat data prospek...</td></tr>
            ) : leads.length === 0 ? (
              <tr><td colSpan={6} className="text-center p-8 text-slate-500">Belum ada prospek yang masuk.</td></tr>
            ) : leads.map(lead => (
              <tr key={lead.id} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="p-4 text-sm text-slate-600">{new Date(lead.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                <td className="p-4 font-semibold text-slate-800">{lead.nama}</td>
                <td className="p-4">
                  <a href={`https://wa.me/${lead.no_wa}`} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline flex items-center gap-1.5 text-sm">
                    <Phone size={14}/> {lead.no_wa}
                  </a>
                </td>
                <td className="p-4 text-sm text-slate-600">{lead.villa_listings?.nama_listing || 'Tidak spesifik'}</td>
                <td className="p-4">
                  {editingLeadId === lead.id ? (
                    <select 
                      value={newStatus} 
                      onChange={(e) => setNewStatus(e.target.value as Lead['status'])}
                      className="p-1.5 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-sky-500"
                    >
                      {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      lead.status === 'Baru' ? 'bg-blue-100 text-blue-700' :
                      lead.status === 'Dihubungi' ? 'bg-yellow-100 text-yellow-700' :
                      lead.status === 'Tertarik' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {lead.status}
                    </span>
                  )}
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
                        <button onClick={() => handleDelete(lead.id)} className="text-slate-500 hover:text-red-600 p-1"><Trash2 size={16}/></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}