import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types';
import { isSupabaseConfigured } from './client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Creates a server-side Supabase client with anon/user scope.
 */
export function createServerClient(): SupabaseClient<Database> {
  const validUrl = isSupabaseConfigured() ? supabaseUrl : 'https://placeholder.supabase.co';
  const validKey = isSupabaseConfigured() ? supabaseAnonKey : 'placeholder-anon-key';

  return createClient<Database>(validUrl, validKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Creates a server-side Supabase admin client using the privileged service role key.
 * Only call this inside server-side actions/handlers, never in client components.
 */
export function createAdminClient(): SupabaseClient<Database> {
  const key = supabaseServiceRoleKey || supabaseAnonKey || 'placeholder-service-key';
  const validUrl = isSupabaseConfigured() ? supabaseUrl : 'https://placeholder.supabase.co';

  return createClient<Database>(validUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
