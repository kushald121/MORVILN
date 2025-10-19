import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error('❌ ERROR: Missing Supabase credentials in .env file');
  console.error('   Required: SUPABASE_URL, SUPABASE_ANON_KEY');
  console.error('   Get them from: https://supabase.com/dashboard/project/_/settings/api');
}

const isSupabaseConfigured = !!(
  process.env.SUPABASE_URL && 
  process.env.SUPABASE_ANON_KEY &&
  process.env.SUPABASE_URL !== 'https://dummy.supabase.co'
);

if (isSupabaseConfigured) {
  console.log('✅ Supabase configured:', process.env.SUPABASE_URL);
} else {
  console.warn('⚠️  Supabase not configured - using dummy instance');
}

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://dummy.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'dummy-key'
);

export const isSupabaseEnabled = isSupabaseConfigured;
export default supabase;