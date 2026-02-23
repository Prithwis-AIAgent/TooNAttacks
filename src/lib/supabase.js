import { createClient } from '@supabase/supabase-js';

// These should be in .env in a production app
// YOU MUST REPLACE THESE WITH YOUR ACTUAL SUPABASE SECRETS
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
