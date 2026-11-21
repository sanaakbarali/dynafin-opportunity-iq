import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  '';

let browserClient: SupabaseClient<any> | null = null;

/**
 * Checks whether Supabase credentials have been configured in the environment.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project-id.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key-here'
  );
}

/**
 * Returns a typed browser client singleton for Supabase.
 * Gracefully handles missing keys by falling back to a dummy placeholder in offline demo mode.
 */
export function getSupabaseBrowserClient(): SupabaseClient<any> {
  if (browserClient) return browserClient;

  const validUrl = isSupabaseConfigured() ? supabaseUrl : 'https://placeholder.supabase.co';
  const validKey = isSupabaseConfigured() ? supabaseAnonKey : 'placeholder-anon-key';

  browserClient = createClient<any>(validUrl, validKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
  });

  return browserClient;
}

/**
 * Default Supabase client instance for client-side queries.
 */
export const supabase = getSupabaseBrowserClient();
