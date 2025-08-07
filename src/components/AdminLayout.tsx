// src/components/AdminLayout.tsx
import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { LayoutDashboard, Home, Users, BarChart, LogOut, Building } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { href: '/admin/villas', label: 'Kelola Villa', icon: <Home size={20} /> },
  { href: '/admin/leads', label: 'Kelola Prospek', icon: <Users size={20} /> },
  { href: '/admin/analytics', label: 'Analitik Web', icon: <BarChart size={20} /> },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };
  
  const activeLinkClass = 'bg-sky-100 text-sky-700';
  const inactiveLinkClass = 'text-slate-600 hover:bg-slate-100 hover:text-slate-900';

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar Navigasi */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-slate-200">
          <a href="/admin" className="flex items-center gap-2">
            <Building size={28} className="text-sky-600" />
            <span className="text-xl font-bold text-slate-800">Admin Panel</span>
          </a>
        </div>
        <nav className="flex-grow p-4">
          {menuItems.map(item => (
            <NavLink
              key={item.label}
              to={item.href}
              end={item.href === '/admin'}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isActive ? activeLinkClass : inactiveLinkClass}`}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-200 p-4">
            <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
                <LogOut size={20} />
                Logout
            </button>
        </div>
      </aside>

      {/* Konten Utama & Header */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 p-4 flex justify-end items-center">
            <div className="text-right">
                <p className="text-sm font-semibold text-slate-800">{user?.email}</p>
                <p className="text-xs text-slate-500">Admin</p>
            </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
            <Outlet /> {/* Di sinilah konten halaman admin akan dirender */}
        </main>
      </div>
    </div>
  );
}