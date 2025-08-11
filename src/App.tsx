// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './components/MainLayout';
import AdminLayout from './components/AdminLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import ListingsPage from './pages/ListingsPage'; // <-- Impor halaman baru
import VillaDetailPage from './pages/VillaDetailPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage'; // <-- Impor halaman 404

// Admin Pages
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import AdminVillaManager from './pages/AdminVillaManager';
import AdminLeadsManager from './pages/AdminLeadsManager';
import AdminAnalytics from './pages/AdminAnalytics';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- RUTE PUBLIK (Untuk Pengunjung) --- */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="listings" element={<ListingsPage />} /> {/* <-- Rute untuk semua listing */}
          <Route path="listing/:slug" element={<VillaDetailPage />} />
          <Route path="*" element={<NotFoundPage />} /> {/* <-- Rute untuk halaman tidak ditemukan */}
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
          <Route path="leads" element={<AdminLeadsManager />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}