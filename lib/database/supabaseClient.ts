import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let clientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (clientInstance) return clientInstance;
  if (!supabaseUrl || !supabaseKey) return null;

  try {
    const isNode = typeof window === 'undefined';
    let wsTransport: any = undefined;
    if (typeof window === 'undefined') {
      try {
        wsTransport = require('ws');
      } catch (e) {
        // ws not available
      }
    }

    clientInstance = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
      realtime: wsTransport ? { transport: wsTransport } : undefined,
    });
    return clientInstance;
  } catch (err) {
    console.warn('[Supabase Client] Failed to initialize:', err);
    return null;
  }
}

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseKey);
};

export const supabase = getSupabaseClient();
