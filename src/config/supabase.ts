import { createClient } from '@supabase/supabase-js';

const getEnvUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) {
    return import.meta.env.VITE_SUPABASE_URL;
  }
  return 'https://cmhwszghtivzccdvedzj.supabase.co';
};

const getEnvKey = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    return import.meta.env.VITE_SUPABASE_ANON_KEY;
  }
  return 'sb_publishable_8o324bVMizZNPwnslDvriQ_frPiNYfd';
};

const supabaseUrl = getEnvUrl();
const supabaseAnonKey = getEnvKey();

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key. Check your .env.local file or Vercel Environment Variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
