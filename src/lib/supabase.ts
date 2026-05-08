import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Singleton verhindert mehrere Instanzen bei Vite HMR.
// Custom lock-Funktion umgeht den Navigator Web Locks API,
// der bei mehreren Tabs / HMR-Reloads NavigatorLockAcquireTimeoutError wirft.
declare global {
  interface Window { __supabase?: SupabaseClient }
}

if (!window.__supabase) {
  window.__supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      lock: (_name, _timeout, fn) => fn(),
    },
  });
}

export const supabase = window.__supabase;
