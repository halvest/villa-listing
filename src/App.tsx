// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './components/MainLayout';
import AdminLayout from './components/AdminLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import VillaDetailPage from './pages/VillaDetailPage';
import LoginPage from './pages/LoginPage';

// Admin Pages
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import AdminVillaManager from './pages/AdminVillaManager';
import AdminLeadsManager from './pages/AdminLeadsManager';   // <-- 1. Impor halaman baru
import AdminAnalytics from './pages/AdminAnalytics';     // <-- 2. Impor halaman baru

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- RUTE PUBLIK (Untuk Pengunjung) --- */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/listing/:slug" element={<VillaDetailPage />} />
        </Route>

        {/* --- RUTE LOGIN --- */}
        <Route path="/login" element={<LoginPage />} />

        {/* --- RUTE ADMIN (Untuk Pengelola) --- */}
        <Route 
          path="/admin" 
          element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="villas" element={<AdminVillaManager />} />
          <Route path="leads" element={<AdminLeadsManager />} />       {/* <-- 3. Aktifkan rute ini */}
          <Route path="analytics" element={<AdminAnalytics />} />   {/* <-- 4. Aktifkan rute ini */}
        </Route>

      </Routes>
    </BrowserRouter>
  );
}