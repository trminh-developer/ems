import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || ''; // Use service_role key for backend bypass RLS

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Missing Supabase URL or Service Key in .env');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
