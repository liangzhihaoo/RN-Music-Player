import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = "https://fslqpgpsdfjrfvqumflg.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzbHFwZ3BzZGZqcmZ2cXVtZmxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNTY4MjMsImV4cCI6MjA3OTkzMjgyM30.Iq_cKjcWKaX-FpqxwnxFvWH8PX4YAsHaS8yIRQEbLsc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
