// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react'; // <-- 1. IMPORT DI SINI

// Layouts
import MainLayout from './components/MainLayout';
import AdminLayout from './components/AdminLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import ListingsPage from './pages/ListingsPage';
import VillaDetailPage from './pages/VillaDetailPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

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
          <Route path="listings" element={<ListingsPage />} />
          <Route path="listing/:slug" element={<VillaDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
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
      
      <Analytics /> {/* <-- 2. TAMBAHKAN KOMPONEN DI SINI */}
    </BrowserRouter>
  );
}