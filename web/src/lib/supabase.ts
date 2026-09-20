import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Iniciar sesión con Google OAuth en Web
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/hub`, // Redirecciona al Tool Hub post-login
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    console.error('Error al autenticar con Google en Web:', error.message);
    throw error;
  }

  return data;
}

/**
 * Cerrar sesión
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
