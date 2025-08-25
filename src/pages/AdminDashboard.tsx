// src/pages/AdminDashboard.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../utils/supabase';
import { Home, CheckCircle, XCircle, DollarSign, Users, LineChart, BarChart2 } from 'lucide-react';
import { formatHarga } from '../utils/idr';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// --- Tipe Data ---
interface Lead {
  created_at: string;
  id: string;
  nama: string;
  domisili: string;
}

// ==== Komponen Bantuan ====
const StatCard = ({ title, value, icon, color, loading }) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-4 animate-pulse">
        <div className="w-12 h-12 rounded-lg bg-slate-200"></div>
        <div className="flex-1">
          <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
          <div className="h-7 bg-slate-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color.bg}`}>
        {React.cloneElement(icon, { className: `w-6 h-6 ${color.text}` })}
      </div>
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
};

// ==== Komponen Grafik Leads ====
const LeadsChart = ({ data, loading }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200">
    <h2 className="text-lg font-bold text-slate-800 mb-4">Grafik Prospek (7 Hari Terakhir)</h2>
    {loading ? (
      <div className="animate-pulse">
        <div className="h-64 bg-slate-200 rounded-lg flex items-center justify-center">
            <BarChart2 className="w-12 h-12 text-slate-400" />
        </div>
      </div>
    ) : data.some(d => d.Prospek > 0) ? (
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip cursor={{fill: 'rgba(241, 245, 249, 0.5)'}} contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}/>
            <Legend verticalAlign="top" align="right" height={36}/>
            <Bar dataKey="Prospek" fill="#ec4899" barSize={30} radius={[4, 4, 0, 0]} name="Prospek Baru" />
        </BarChart>
      </ResponsiveContainer>
    ) : (
      <div className="h-[320px] flex flex-col items-center justify-center text-center text-slate-500">
        <BarChart2 className="w-12 h-12 text-slate-300 mb-4"/>
        <p className="font-semibold">Belum Ada Prospek Baru</p>
        <p className="text-sm">Data prospek yang masuk dalam 7 hari terakhir akan muncul di sini.</p>
      </div>
    )}
  </div>
);

const RecentActivity = ({ loading, leads }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Prospek Terbaru</h2>
        <div className="space-y-4">
            {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                        <div className="flex-1">
                            <div className="h-4 bg-slate-200 rounded w-3/4 mb-1.5"></div>
                            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                        </div>
                    </div>
                ))
            ) : (
                leads.length > 0 ? leads.map(lead => (
                    <div key={lead.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                            {lead.nama.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-semibold text-sm text-slate-700">{lead.nama}</p>
                            <p className="text-xs text-slate-500">{lead.domisili}</p>
                        </div>
                    </div>
                )) : <p className="text-sm text-slate-500">Belum ada prospek yang masuk.</p>
            )}
        </div>
    </div>
);


// ==== Komponen Utama Halaman ====
export default function AdminDashboard() {
    const [stats, setStats] = useState({ totalVillas: 0, tersedia: 0, sold: 0, totalValue: 0, totalLeads: 0 });
    const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
    const [dailyLeads, setDailyLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return "Selamat Pagi";
        if (hour < 18) return "Selamat Siang";
        return "Selamat Malam";
    }, []);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
            
            const [villasRes, leadsCountRes, recentLeadsRes, dailyLeadsRes] = await Promise.all([
                supabase.from('villa_listings').select('status, harga'),
                supabase.from('leads').select('*', { count: 'exact', head: true }),
                supabase.from('leads').select('id, nama, domisili').order('created_at', { ascending: false }).limit(5),
                supabase.from('leads').select('created_at').gte('created_at', sevenDaysAgo)
            ]);
            
            const villas = villasRes.data || [];
            setStats({
                totalVillas: villas.length,
                tersedia: villas.filter(v => v.status === 'Tersedia' || v.status === 'Promo').length,
                sold: villas.filter(v => v.status === 'Sold Out').length,
                totalValue: villas.reduce((sum, v) => (v.status === 'Tersedia' || v.status === 'Promo') ? sum + v.harga : sum, 0),
                totalLeads: leadsCountRes.count || 0,
            });

            setRecentLeads(recentLeadsRes.data as Lead[] || []);
            setDailyLeads(dailyLeadsRes.data as Lead[] || []);
            setLoading(false);
        };
        fetchDashboardData();
    }, []);
    
    const leadsChartData = useMemo(() => {
        const dailyCounts = new Map<string, number>();
        const dateLabels = new Map<string, string>();

        for (let i = 6; i >= 0; i--) {
            const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
            const key = d.toISOString().slice(0, 10);
            const label = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });
            dailyCounts.set(key, 0);
            dateLabels.set(key, label);
        }

        dailyLeads.forEach(lead => {
            const key = lead.created_at.slice(0, 10);
            if (dailyCounts.has(key)) {
                dailyCounts.set(key, (dailyCounts.get(key) || 0) + 1);
            }
        });

        return Array.from(dailyCounts.entries()).map(([key, Prospek]) => ({
            name: dateLabels.get(key) || '',
            Prospek,
        }));
    }, [dailyLeads]);
    
    const statCards = [
        { title: "Total Listing Villa", value: stats.totalVillas, icon: <Home/>, color: {bg: 'bg-sky-100', text: 'text-sky-600'}},
        { title: "Villa Tersedia", value: stats.tersedia, icon: <CheckCircle/>, color: {bg: 'bg-green-100', text: 'text-green-600'}},
        { title: "Villa Sold Out", value: stats.sold, icon: <XCircle/>, color: {bg: 'bg-red-100', text: 'text-red-600'}},
        { title: "Total Prospek Masuk", value: stats.totalLeads, icon: <Users/>, color: {bg: 'bg-pink-100', text: 'text-pink-600'}},
        { title: "Total Nilai Aset", value: `Rp ${new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(stats.totalValue)}`, icon: <DollarSign/>, color: {bg: 'bg-amber-100', text: 'text-amber-600'}},
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">{greeting}, Admin!</h1>
            <p className="text-slate-500 mb-8">Berikut adalah ringkasan dari properti dan aktivitas website Anda.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {statCards.map((card, index) => <StatCard key={index} {...card} loading={loading} />)}
                    </div>
                    
                    <LeadsChart data={leadsChartData} loading={loading} />
                </div>

                <div className="lg:col-span-1">
                    <RecentActivity leads={recentLeads} loading={loading} />
                </div>
            </div>
        </div>
    );
}