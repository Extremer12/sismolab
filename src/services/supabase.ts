import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://lgesqffvrvahrqkntzov.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnZXNxZmZ2cnZhaHJxa250em92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NTU0NjksImV4cCI6MjA3OTUzMTQ2OX0.JgFv3e_Fa9wIMKpdBF5sB06d14H8sw3rA7wk-8HjItE';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});


