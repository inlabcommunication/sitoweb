import { createClient } from '@supabase/supabase-js';

// Le variabili VITE_* vengono lette dal browser. Sono sicure perché
// la anon key di Supabase è pubblica per design: tutto il controllo
// di sicurezza avviene tramite Row Level Security (RLS) nel database.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // Non lanciamo errore: in dev senza .env il sito funziona comunque
  // con i contenuti del file constants.ts.
  console.warn(
    '[InLab] Variabili Supabase mancanti. Il sito userà i contenuti statici. ' +
    'Configura .env per attivare dashboard, analytics e chatbot.'
  );
}

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true }
    })
  : null;

export const isSupabaseConfigured = () => supabase !== null;
