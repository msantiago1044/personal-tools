import { createClient, Session } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://phczdxbtquxwfqnrakcz.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ThVP291edlMvGoeLw2182w_sb7hmslN';

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
 * Guarda un respaldo persistente de la sesión en localStorage para garantizar
 * que al cerrar y abrir el navegador o el acceso directo (PWA / Home Screen),
 * la sesión se mantenga siempre activa.
 */
export function saveSessionBackup(session: Session | null) {
  if (typeof window === 'undefined') return;
  if (!session) {
    localStorage.removeItem(SESSION_BACKUP_KEY);
    return;
  }
  try {
    const backupData = {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at,
      user_id: session.user?.id,
      user_email: session.user?.email,
      timestamp: Date.now(),
    };
    localStorage.setItem(SESSION_BACKUP_KEY, JSON.stringify(backupData));
  } catch (err) {
    console.warn('[Session] No se pudo guardar respaldo de sesión:', err);
  }
}

/**
 * Intenta restaurar la sesión usando el respaldo si getSession() devolvió null
 */
export async function tryRestoreSessionBackup(): Promise<Session | null> {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(SESSION_BACKUP_KEY);
  if (!raw) return null;

  try {
    const backup = JSON.parse(raw);
    if (!backup?.refresh_token) return null;

    // 1. Probar recuperar mediante refreshSession con el refresh_token
    const { data: refData, error: refError } = await supabase.auth.refreshSession({
      refresh_token: backup.refresh_token,
    });

    if (!refError && refData?.session) {
      saveSessionBackup(refData.session);
      return refData.session;
    }

    // 2. Si falló el refresh directo, probar con setSession
    if (backup.access_token) {
      const { data: setData, error: setError } = await supabase.auth.setSession({
        access_token: backup.access_token,
        refresh_token: backup.refresh_token,
      });

      if (!setError && setData?.session) {
        saveSessionBackup(setData.session);
        return setData.session;
      }
    }
  } catch (e) {
    console.warn('[Session] Error restaurando sesión desde respaldo:', e);
  }

  return null;
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
