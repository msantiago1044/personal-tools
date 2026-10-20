import { supabase } from './supabase';

export type EmotionKey = 'excelente' | 'bien' | 'calma' | 'cansado' | 'triste' | 'estresado';

export interface EmotionOption {
  key: EmotionKey;
  label: string;
  emoji: string;
  score: number;
  colorClass: string;
  bgLightClass: string;
  borderClass: string;
  description: string;
}

export const EMOTIONS_CONFIG: Record<EmotionKey, EmotionOption> = {
  excelente: {
    key: 'excelente',
    label: 'Excelente',
    emoji: '😄',
    score: 5,
    colorClass: 'text-emerald-600 dark:text-emerald-400',
    bgLightClass: 'bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50',
    borderClass: 'border-emerald-200 dark:border-emerald-800/60',
    description: 'Con mucha energía y motivación',
  },
  bien: {
    key: 'bien',
    label: 'Bien',
    emoji: '😊',
    score: 4,
    colorClass: 'text-teal-600 dark:text-teal-400',
    bgLightClass: 'bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/50',
    borderClass: 'border-teal-200 dark:border-teal-800/60',
    description: 'Contento y en equilibrio',
  },
  calma: {
    key: 'calma',
    label: 'En calma',
    emoji: '😌',
    score: 3,
    colorClass: 'text-sky-600 dark:text-sky-400',
    bgLightClass: 'bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/50',
    borderClass: 'border-sky-200 dark:border-sky-800/60',
    description: 'Tranquilo y relajado',
  },
  cansado: {
    key: 'cansado',
    label: 'Cansado',
    emoji: '🥱',
    score: 2,
    colorClass: 'text-amber-600 dark:text-amber-400',
    bgLightClass: 'bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50',
    borderClass: 'border-amber-200 dark:border-amber-800/60',
    description: 'Con poca energía o agotamiento físico',
  },
  triste: {
    key: 'triste',
    label: 'Desanimado',
    emoji: '😔',
    score: 1,
    colorClass: 'text-indigo-600 dark:text-indigo-400',
    bgLightClass: 'bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50',
    borderClass: 'border-indigo-200 dark:border-indigo-800/60',
    description: 'Triste, nostálgico o apagado',
  },
  estresado: {
    key: 'estresado',
    label: 'Estresado',
    emoji: '😤',
    score: 1,
    colorClass: 'text-rose-600 dark:text-rose-400',
    bgLightClass: 'bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50',
    borderClass: 'border-rose-200 dark:border-rose-800/60',
    description: 'Bajo tensión, molestia o presión',
  },
};

export interface EmotionRecord {
  id: string;
  user_id: string;
  emotion: EmotionKey;
  score: number;
  note?: string;
  tags?: string[];
  created_at: string;
}

const LOCAL_STORAGE_EMOTIONS_KEY = 'user_emotions_history';
const LAST_PROMPT_KEY = 'last_mood_prompt_time';
const ONE_HOUR_MS = 60 * 60 * 1000;

/**
 * Comprueba si debe mostrar la ventana flotante de chequeo de emoción (versión síncrona local):
 * Solo si nunca se ha preguntado o si han pasado más de 60 minutos desde la última vez en este navegador.
 */
export function shouldPromptMoodCheck(): boolean {
  if (typeof window === 'undefined') return false;
  const lastPrompt = localStorage.getItem(LAST_PROMPT_KEY);
  if (!lastPrompt) return true;

  const lastTime = parseInt(lastPrompt, 10);
  if (isNaN(lastTime)) return true;

  const diff = Date.now() - lastTime;
  return diff >= ONE_HOUR_MS;
}

/**
 * Evalúa asincrónicamente con previa sincronización en la nube si se debe preguntar la emoción.
 * Garantiza que si el usuario respondió o descartó en su móvil, el computador (web/PC)
 * reconozca inmediatamente el tiempo transcurrido y no vuelva a preguntar antes de 1 hora.
 */
export async function shouldPromptMoodCheckAsync(userId?: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // 1. Verificación local rápida en este dispositivo
  const localPrompt = localStorage.getItem(LAST_PROMPT_KEY);
  if (localPrompt) {
    const localTime = parseInt(localPrompt, 10);
    if (!isNaN(localTime) && Date.now() - localTime < ONE_HOUR_MS) {
      return false;
    }
  }

  if (!userId) {
    return shouldPromptMoodCheck();
  }

  // 2. Sincronizar con la nube (última emoción registrada en user_emotions y/o último descarte en user_metadata)
  try {
    let latestCloudTimestamp = 0;

    // A. Consultar la última emoción registrada por el usuario en cualquier dispositivo
    const { data: latestEmotion } = await supabase
      .from('user_emotions')
      .select('created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestEmotion?.created_at) {
      const emotionTime = new Date(latestEmotion.created_at).getTime();
      if (!isNaN(emotionTime) && emotionTime > latestCloudTimestamp) {
        latestCloudTimestamp = emotionTime;
      }
    }

    // B. Consultar el timestamp de último descarte/prompt guardado en user_metadata
    try {
      const { data: authData } = await supabase.auth.getUser();
      const metaTime = authData?.user?.user_metadata?.last_mood_prompt_time;
      if (metaTime) {
        const parsedMeta = typeof metaTime === 'number' ? metaTime : parseInt(metaTime, 10);
        if (!isNaN(parsedMeta) && parsedMeta > latestCloudTimestamp) {
          latestCloudTimestamp = parsedMeta;
        }
      }
    } catch {}

    // Si hubo alguna interacción en la nube hace menos de 1 hora
    if (latestCloudTimestamp > 0) {
      const diff = Date.now() - latestCloudTimestamp;
      if (diff < ONE_HOUR_MS) {
        // Actualizar la caché local de este navegador para no tener que consultar continuamente
        localStorage.setItem(LAST_PROMPT_KEY, latestCloudTimestamp.toString());
        return false;
      }
    }
  } catch (err) {
    console.warn('[Emociones] Error consultando sincronización de ánimo en la nube:', err);
    return shouldPromptMoodCheck();
  }

  return true;
}

/**
 * Marca el timestamp del último chequeo para no volver a preguntar antes de 1 hora
 * y lo propaga a user_metadata en Supabase para sincronizar con otros dispositivos.
 */
export function markMoodPromptDismissed(userId?: string): void {
  if (typeof window === 'undefined') return;
  const now = Date.now();
  localStorage.setItem(LAST_PROMPT_KEY, now.toString());

  // Propagación silenciosa a Supabase user_metadata para mobile y PC
  try {
    supabase.auth.updateUser({
      data: {
        last_mood_prompt_time: now,
      },
    }).catch(() => {});
  } catch {}
}

/**
 * Guarda una nueva emoción en Supabase y en la caché local
 */
export async function saveEmotionRecord(
  userId: string,
  emotion: EmotionKey,
  note?: string,
  tags?: string[]
): Promise<EmotionRecord> {
  const config = EMOTIONS_CONFIG[emotion];
  const newRecord: EmotionRecord = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `em_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    user_id: userId,
    emotion,
    score: config.score,
    note: note?.trim() || undefined,
    tags: tags || [],
    created_at: new Date().toISOString(),
  };

  // 1. Guardar en caché local inmediatamente
  try {
    const cached = getCachedEmotions(userId);
    const updated = [newRecord, ...cached];
    localStorage.setItem(LOCAL_STORAGE_EMOTIONS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('[Emociones] Error guardando en local storage:', err);
  }

  // 2. Marcar timestamp en local y nube para que ningún dispositivo vuelva a preguntar antes de 1 hora
  markMoodPromptDismissed(userId);

  // 3. Sincronizar con Supabase
  try {
    const { data, error } = await supabase
      .from('user_emotions')
      .insert({
        id: newRecord.id,
        user_id: userId,
        emotion,
        score: config.score,
        note: newRecord.note || null,
        tags: newRecord.tags || null,
        created_at: newRecord.created_at,
      })
      .select()
      .single();

    if (!error && data) {
      return data as EmotionRecord;
    }
  } catch (err) {
    console.warn('[Emociones] Nota: Supabase no disponible o tabla en proceso, usando guardado local:', err);
  }

  return newRecord;
}

/**
 * Obtiene el historial de emociones
 */
export async function fetchEmotionRecords(userId: string): Promise<EmotionRecord[]> {
  const cached = getCachedEmotions(userId);

  try {
    const { data, error } = await supabase
      .from('user_emotions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      // Sincronizar caché local
      localStorage.setItem(LOCAL_STORAGE_EMOTIONS_KEY, JSON.stringify(data));
      const latestTime = new Date(data[0].created_at).getTime();
      if (!isNaN(latestTime)) {
        const currentLocal = parseInt(localStorage.getItem(LAST_PROMPT_KEY) || '0', 10);
        if (latestTime > currentLocal) {
          localStorage.setItem(LAST_PROMPT_KEY, latestTime.toString());
        }
      }
      return data as EmotionRecord[];
    }
  } catch (err) {
    console.warn('[Emociones] Usando registros locales en fallback:', err);
  }

  return cached;
}

/**
 * Elimina un registro de emoción
 */
export async function deleteEmotionRecord(id: string, userId: string): Promise<void> {
  // 1. Quitar de caché local
  try {
    const cached = getCachedEmotions(userId);
    const filtered = cached.filter((item) => item.id !== id);
    localStorage.setItem(LOCAL_STORAGE_EMOTIONS_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.warn('[Emociones] Error al eliminar de local storage:', err);
  }

  // 2. Eliminar en Supabase
  try {
    await supabase.from('user_emotions').delete().eq('id', id).eq('user_id', userId);
  } catch (err) {
    console.warn('[Emociones] Error al eliminar en Supabase:', err);
  }
}

function getCachedEmotions(userId: string): EmotionRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_EMOTIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((r) => r.user_id === userId) : [];
  } catch (e) {
    return [];
  }
}
