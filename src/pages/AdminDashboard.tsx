// src/pages/AdminDashboard.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../utils/supabase';
import { Home, CheckCircle, XCircle, DollarSign, Users, LineChart } from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color.bg}`}>
      {React.cloneElement(icon, { className: `text-2xl ${color.text}` })}
    </div>
    <div>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

export default function AdminDashboard() {
    const [stats, setStats] = useState({ totalVillas: 0, tersedia: 0, sold: 0, totalValue: 0, totalLeads: 0, totalViews: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const [villasRes, leadsRes, viewsRes] = await Promise.all([
                supabase.from('villa_listings').select('status, harga'),
                supabase.from('leads').select('*', { count: 'exact', head: true }),
                supabase.from('page_views').select('*', { count: 'exact', head: true })
            ]);
            
            const villas = villasRes.data || [];
            const totalVillas = villas.length;
            const tersedia = villas.filter(v => v.status === 'Tersedia').length;
            const sold = villas.filter(v => v.status === 'Sold Out').length;
            const totalValue = villas.reduce((sum, v) => v.status === 'Tersedia' ? sum + v.harga : sum, 0);

            setStats({
                totalVillas,
                tersedia,
                sold,
                totalValue,
                totalLeads: leadsRes.count || 0,
                totalViews: viewsRes.count || 0
            });
            setLoading(false);
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div>Memuat data statistik...</div>
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Selamat Datang, Admin!</h1>
            <p className="text-slate-500 mb-8">Berikut adalah ringkasan dari properti dan aktivitas website Anda.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Listing Villa" value={stats.totalVillas} icon={<Home/>} color={{bg: 'bg-sky-100', text: 'text-sky-600'}}/>
                <StatCard title="Villa Tersedia" value={stats.tersedia} icon={<CheckCircle/>} color={{bg: 'bg-green-100', text: 'text-green-600'}}/>
                <StatCard title="Villa Sold Out" value={stats.sold} icon={<XCircle/>} color={{bg: 'bg-red-100', text: 'text-red-600'}}/>
                <StatCard title="Total Nilai Aset" value={`Rp ${new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(stats.totalValue)}`} icon={<DollarSign/>} color={{bg: 'bg-amber-100', text: 'text-amber-600'}}/>
                <StatCard title="Total Prospek Masuk" value={stats.totalLeads} icon={<Users/>} color={{bg: 'bg-pink-100', text: 'text-pink-600'}}/>
                <StatCard title="Total Kunjungan Halaman" value={stats.totalViews} icon={<LineChart/>} color={{bg: 'bg-indigo-100', text: 'text-indigo-600'}}/>
            </div>
            {/* Di sini Anda bisa menambahkan komponen lain seperti chart atau daftar prospek terbaru */}
        </div>
    );
}