// src/pages/LoginPage.tsx
import React, { useEffect, useState } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../utils/supabase';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  // 1. Cek sesi saat komponen pertama kali dimuat
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.user_metadata?.user_role === 'admin') {
        navigate('/admin', { replace: true }); // Langsung arahkan jika sudah login sebagai admin
      } else {
        setSessionChecked(true); // Izinkan form login ditampilkan jika belum login atau bukan admin
      }
    };
    checkSession();
  }, [navigate]);

  // 2. Dengarkan perubahan status otentikasi (saat pengguna mencoba login)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        if (session.user.user_metadata?.user_role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          // 3. Tampilkan pesan error di UI, jangan logout paksa
          setError("Akses ditolak. Akun Anda tidak memiliki hak sebagai admin.");
          // Otomatis logout setelah beberapa saat agar tidak meninggalkan sesi non-admin aktif
          setTimeout(() => {
            supabase.auth.signOut();
          }, 3000);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Tampilkan loading state sampai sesi selesai diperiksa
  if (!sessionChecked) {
    return <div className="flex justify-center items-center min-h-screen bg-slate-50">Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-200/80">
        <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-sky-100 text-sky-600 flex items-center justify-center rounded-full mb-4 border-4 border-white shadow-sm">
              <Building size={32} />
            </div>
            <h2 className="text-3xl font-bold text-slate-800">Admin Login</h2>
            <p className="text-slate-500 mt-1">Halaman khusus untuk administrator.</p>
        </div>
        
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          theme="light"
          onlyThirdPartyProviders={false}
        />
        
        {/* 4. Tampilkan pesan error di dalam UI */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-3"
            >
              <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5"/>
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}