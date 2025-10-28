import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://oaxkgoxciiymzhsbkmli.supabase.co';
const supabaseKey = 'sb_publishable_3qLio_pp9RGGcaaspKvZ3g_HBtwc8wM';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };