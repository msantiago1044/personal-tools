import { createClient, Session } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] Advertencia: VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY no están configuradas.');
}

export const SESSION_BACKUP_KEY = 'personal_tools_session_backup';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});

/**
 * Persistencia segura de sesión manejada nativamente por Supabase (persistSession: true).
 * Mantenemos la función para compatibilidad hacia atrás eliminando copias en texto plano.
 */
export function saveSessionBackup(session: Session | null) {
  if (typeof window === 'undefined') return;
  if (!session) {
    try {
      localStorage.removeItem(SESSION_BACKUP_KEY);
    } catch {}
  }
}

/**
 * Restauración delegada al SDK de Supabase con auto-refresco
 */
export async function tryRestoreSessionBackup(): Promise<Session | null> {
  try {
    const { data } = await supabase.auth.getSession();
    return data?.session || null;
  } catch (e) {
    console.warn('[Session] Error verificando sesión de Supabase:', e);
    return null;
  }
}

/**
 * Iniciar sesión con Google OAuth en Web
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}`,
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
 * Cerrar sesión y limpiar respaldos
 */
export async function signOut() {
  try {
    localStorage.removeItem(SESSION_BACKUP_KEY);
    localStorage.removeItem('app_current_view');
  } catch (e) {
    // ignore
  }
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
