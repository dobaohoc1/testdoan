/**
 * Supabase Client Configuration
 * Khởi tạo Supabase client với authentication và storage
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jytnzvoymseduevwcuyu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5dG56dm95bXNlZHVldndjdXl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwODkyMDUsImV4cCI6MjA3MjY2NTIwNX0.uztLeA0hiioCIypW2sMh7JNGc61mqGOcP7rG85IdolU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});