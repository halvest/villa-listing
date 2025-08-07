// src/pages/AdminAnalytics.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../utils/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Home, Users, LineChart, CheckCircle } from 'lucide-react';

// Tipe data untuk konsistensi
interface PageView {
  created_at: string;
  slug: string;
}
interface Lead {
  villa_listings: {
    nama_listing: string;
  } | null;
}
interface Villa {
    status: string;
    harga: number;
}

// Sub-komponen StatCard
const StatCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: React.ReactNode, color: { bg: string, text: string } }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color.bg}`}>
      {React.cloneElement(icon as React.ReactElement, { className: `text-2xl ${color.text}` })}
    </div>
    <div>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

export default function AdminAnalytics() {
  const [views, setViews] = useState<PageView[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [villas, setVillas] = useState<Villa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      
      const [viewsRes, leadsRes, villasRes] = await Promise.all([
        supabase.from('page_views').select('created_at, slug').gte('created_at', sevenDaysAgo),
        supabase.from('leads').select('villa_listings(nama_listing)'),
        supabase.from('villa_listings').select('status, harga')
      ]);

      if (viewsRes.data) setViews(viewsRes.data);
      if (leadsRes.data) setLeads(leadsRes.data);
      if (villasRes.data) setVillas(villasRes.data);
      
      setLoading(false);
    };
    fetchData();
  }, []);

  // Memproses data untuk grafik trafik 7 hari terakhir
  const trafficData = useMemo(() => {
    const dailyCounts: { [key: string]: number } = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });
      dailyCounts[key] = 0;
    }
    views.forEach(view => {
      const d = new Date(view.created_at);
      const key = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });
      if (dailyCounts[key] !== undefined) {
        dailyCounts[key]++;
      }
    });
    return Object.entries(dailyCounts).map(([name, Kunjungan]) => ({ name, Kunjungan }));
  }, [views]);

  // Memproses data untuk properti paling diminati (berdasarkan leads)
  const popularVillasData = useMemo(() => {
    const villaCounts: { [key: string]: number } = {};
    leads.forEach(lead => {
      const villaName = lead.villa_listings?.nama_listing;
      if (villaName) {
        villaCounts[villaName] = (villaCounts[villaName] || 0) + 1;
      }
    });
    return Object.entries(villaCounts)
        .map(([name, value]) => ({ name, Prospek: value }))
        .sort((a, b) => b.Prospek - a.Prospek)
        .slice(0, 5); // Ambil 5 teratas
  }, [leads]);

  const COLORS = ['#0ea5e9', '#6366f1', '#ec4899', '#f97316', '#10b981'];
  
  if (loading) {
    return (
        <div className="p-8">
            <div className="h-8 bg-slate-200 rounded w-1/3 mb-8 animate-pulse"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="h-24 bg-slate-200 rounded-2xl animate-pulse"></div>
                <div className="h-24 bg-slate-200 rounded-2xl animate-pulse"></div>
                <div className="h-24 bg-slate-200 rounded-2xl animate-pulse"></div>
                <div className="h-24 bg-slate-200 rounded-2xl animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-80 bg-slate-200 rounded-2xl animate-pulse"></div>
                <div className="h-80 bg-slate-200 rounded-2xl animate-pulse"></div>
            </div>
        </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Analitik Website</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Kunjungan (7 Hari)" value={views.length} icon={<LineChart/>} color={{bg: 'bg-indigo-100', text: 'text-indigo-600'}}/>
        <StatCard title="Total Prospek (Semua)" value={leads.length} icon={<Users/>} color={{bg: 'bg-pink-100', text: 'text-pink-600'}}/>
        <StatCard title="Total Listing" value={villas.length} icon={<Home/>} color={{bg: 'bg-sky-100', text: 'text-sky-600'}}/>
        <StatCard title="Villa Tersedia" value={villas.filter(v => v.status === 'Tersedia').length} icon={<CheckCircle/>} color={{bg: 'bg-green-100', text: 'text-green-600'}}/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-lg border">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Trafik Kunjungan (7 Hari Terakhir)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trafficData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false}/>
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{fill: 'rgba(241, 245, 249, 0.5)'}} contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}/>
              <Bar dataKey="Kunjungan" fill="#0ea5e9" barSize={30} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Properti Paling Diminati</h3>
          {popularVillasData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={popularVillasData}
                    cx="50%" cy="50%" labelLine={false} outerRadius={110} fill="#8884d8"
                    dataKey="Prospek"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    fontSize={12}
                  >
                    {popularVillasData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}/>
                </PieChart>
            </ResponsiveContainer>
           ) : (
            <div className="flex items-center justify-center h-[300px] text-center text-slate-500">
                <p>Belum ada data prospek yang masuk.</p>
            </div>
           )}
        </div>
      </div>
    </div>
  );
}