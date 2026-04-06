import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with your project credentials
const supabaseUrl = 'https://bwyikomcuipkxxhbwhwr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3eWlrb21jdWlwa3h4aGJ3aHdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MDI0ODksImV4cCI6MjA4NjQ3ODQ4OX0.-7T62QHOeW4SaKG5Af978_FLdSyBYPQHTmXY7RTxTSk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});