import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL || import.meta.env['supabase-dating-appSUPABASE_URL'] || 'https://cmhwszghtivzccdvedzj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || import.meta.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_8o324bVMizZNPwnslDvriQ_frPiNYfd';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key. Check your .env.local file or Vercel Environment Variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
