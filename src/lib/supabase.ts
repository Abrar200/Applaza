import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with your project credentials
const supabaseUrl = 'https://rwehzuzglgghackows zo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3ZWh6dXpnbGdnaGFja293c3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NzE3MzEsImV4cCI6MjA3NzI0NzczMX0.6V12eIfyIg4euo1WL1u95XS0iYaR-N9Qym3QpuGJXYw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});