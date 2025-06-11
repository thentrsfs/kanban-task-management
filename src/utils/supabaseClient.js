/* import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey); */


import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://isgymcfobjqqhqvanlid.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzZ3ltY2ZvYmpxcWhxdmFubGlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMzkwMjYsImV4cCI6MjA2MjgxNTAyNn0.cvUktDR7TWCCraIEUNJ6IbENgP2RolhgBge8VvvONuQ'
export const supabase = createClient(supabaseUrl, supabaseKey)