import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cbvqwdrbwogsmcglsvzg.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNidnF3ZHJid29nc21jZ2xzdnpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MzUxNDUsImV4cCI6MjA5ODMxMTE0NX0.QE6mClBS9UTQTlIgmhVB2mZAv0CihdMne0o5vfk-_CU';

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
