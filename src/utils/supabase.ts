// src/utils/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Memastikan variabel environment ada sebelum membuat klien
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key are required in your .env file.");
}

// Membuat dan mengekspor klien Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);