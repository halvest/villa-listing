// src/components/ProtectedRoute.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { Navigate } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChange adalah cara terbaik untuk mendapatkan status sesi.
    // Listener ini akan langsung berjalan saat komponen dimuat (dengan event INITIAL_SESSION)
    // dan juga akan memantau event SIGNED_IN atau SIGNED_OUT.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false); // Hentikan loading SETELAH sesi berhasil diperiksa.
    });

    // Membersihkan listener saat komponen tidak lagi digunakan.
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Selama pemeriksaan, tampilkan layar loading.
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <p>Memverifikasi akses...</p>
      </div>
    );
  }

  // Setelah loading selesai, periksa apakah pengguna adalah admin.
  const isAdmin = session?.user?.user_metadata?.user_role === 'admin';

  if (isAdmin) {
    // Jika admin, tampilkan konten dashboard.
    return <>{children}</>;
  } else {
    // Jika bukan admin (termasuk jika tidak ada sesi), alihkan ke halaman login.
    return <Navigate to="/login" replace />;
  }
}