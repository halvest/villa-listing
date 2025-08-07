// src/pages/LoginPage.tsx
import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../utils/supabase';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        // Cek peran setelah berhasil login
        const isAdmin = session.user.user_metadata?.user_role === 'admin';
        
        if (isAdmin) {
          // Jika admin, arahkan ke dashboard
          navigate('/admin');
        } else {
          // Jika bukan admin, logout paksa dan tetap di halaman login
          // atau arahkan ke halaman lain jika ada halaman untuk user biasa
          await supabase.auth.signOut();
          alert("Anda tidak memiliki akses admin.");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">Admin Login</h2>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]} // Kosongkan jika hanya ingin login email/password
          theme="light"
          onlyThirdPartyProviders={false}
        />
      </div>
    </div>
  );
}