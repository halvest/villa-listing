// src/components/AdminLayout.tsx
import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { LayoutDashboard, Home, Users, BarChart, LogOut, Building, Menu } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { href: '/admin/villas', label: 'Kelola Villa', icon: <Home size={20} /> },
  { href: '/admin/leads', label: 'Kelola Prospek', icon: <Users size={20} /> },
  { href: '/admin/analytics', label: 'Analitik Web', icon: <BarChart size={20} /> },
];

// Sub-komponen Sidebar untuk kebersihan kode
const Sidebar = ({ onLogout, user }) => {
    const activeLinkClass = 'bg-sky-100 text-sky-700';
    const inactiveLinkClass = 'text-slate-600 hover:bg-slate-100 hover:text-slate-900';
    return (
        <>
            <div className="p-6 border-b border-slate-200">
                <Link to="/admin" className="flex items-center gap-2">
                    <Building size={28} className="text-sky-600" />
                    <span className="text-xl font-bold text-slate-800">Admin Panel</span>
                </Link>
            </div>
            <nav className="flex-grow p-4 space-y-1">
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
                 <div className="mb-4 px-2">
                    <p className="text-sm font-semibold text-slate-800 truncate">{user?.email}</p>
                    <p className="text-xs text-slate-500">Administrator</p>
                </div>
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </>
    );
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  return (
    <div className="relative min-h-screen bg-slate-50 font-sans lg:flex">
        <Toaster 
            position="top-center"
            reverseOrder={false}
            toastOptions={{
                duration: 3000,
            }}
        />

        {/* Sidebar untuk Desktop (selalu terlihat) */}
        <aside className="w-64 bg-white border-r border-slate-200 flex-col flex-shrink-0 hidden lg:flex">
            <Sidebar onLogout={handleLogout} user={user}/>
        </aside>

        {/* Sidebar untuk Mobile (slide-in) */}
        <AnimatePresence>
            {isSidebarOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                    <motion.aside
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed top-0 left-0 h-full w-64 bg-white z-50 flex flex-col lg:hidden"
                    >
                        <Sidebar onLogout={handleLogout} user={user}/>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>

        {/* Konten Utama & Header */}
        <div className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center lg:justify-end">
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100"
                    aria-label="Buka menu"
                >
                    <Menu size={24} />
                </button>
                
                <div className="hidden lg:flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-slate-800">{user?.email}</p>
                        <p className="text-xs text-slate-500">Admin</p>
                    </div>
                     <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                        {/* --- PERBAIKAN DI SINI --- */}
                        {user?.email?.charAt(0)?.toUpperCase()}
                     </div>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    </div>
  );
}