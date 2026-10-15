import { supabase } from './supabase';

export interface SleepRecord {
  id: string;
  user_id: string;
  sleep_date: string; // Formato YYYY-MM-DD
  start_time: string; // ISO 8601
  end_time: string;   // ISO 8601
  duration_minutes: number;
  quality_score: number; // 1 a 5
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface SleepQualityOption {
  score: number;
  label: string;
  emoji: string;
  colorClass: string;
  bgLightClass: string;
  borderClass: string;
  description: string;
}

export const SLEEP_QUALITY_CONFIG: Record<number, SleepQualityOption> = {
  1: {
    score: 1,
    label: 'Muy mal',
    emoji: '😫',
    colorClass: 'text-rose-600 dark:text-rose-400',
    bgLightClass: 'bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50',
    borderClass: 'border-rose-200 dark:border-rose-800/60',
    description: 'Insomnio, pesadillas o agotamiento total',
  },
  2: {
    score: 2,
    label: 'Inquieto',
    emoji: '🥱',
    colorClass: 'text-amber-600 dark:text-amber-400',
    bgLightClass: 'bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50',
    borderClass: 'border-amber-200 dark:border-amber-800/60',
    description: 'Sueño interrumpido o insuficiente',
  },
  3: {
    score: 3,
    label: 'Normal',
    emoji: '😐',
    colorClass: 'text-sky-600 dark:text-sky-400',
    bgLightClass: 'bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/50',
    borderClass: 'border-sky-200 dark:border-sky-800/60',
    description: 'Descanso aceptable, energía estándar',
  },
  4: {
    score: 4,
    label: 'Bien',
    emoji: '😊',
    colorClass: 'text-teal-600 dark:text-teal-400',
    bgLightClass: 'bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/50',
    borderClass: 'border-teal-200 dark:border-teal-800/60',
    description: 'Buen descanso, desperté con energía',
  },
  5: {
    score: 5,
    label: 'Excelente',
    emoji: '⚡',
    colorClass: 'text-emerald-600 dark:text-emerald-400',
    bgLightClass: 'bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50',
    borderClass: 'border-emerald-200 dark:border-emerald-800/60',
    description: 'Profundo, revitalizante y reparador',
  },
};

const LOCAL_STORAGE_SLEEP_KEY = 'user_sleep_history';

/**
 * Retorna la fecha local en formato YYYY-MM-DD
 */
export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calcula la duración en minutos entre dos marcas de tiempo ISO
 */
export function calculateDurationMinutes(startTimeIso: string, endTimeIso: string): number {
  const start = new Date(startTimeIso).getTime();
  const end = new Date(endTimeIso).getTime();
  if (isNaN(start) || isNaN(end) || end <= start) {
    return 0;
  }
  return Math.round((end - start) / (1000 * 60));
}

/**
 * Formatea minutos a formato legible "7h 30m"
 */
export function formatSleepDuration(minutes: number): string {
  if (minutes <= 0) return '0h';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/**
 * Comprueba si el usuario ya registró su sueño para una fecha determinada (por defecto hoy)
 */
export async function hasSleepRecordedForDate(userId: string, dateStr?: string): Promise<boolean> {
  const targetDate = dateStr || getLocalDateString();
  const cached = getCachedSleepRecords(userId);
  const existsInCache = cached.some((r) => r.sleep_date === targetDate);
  if (existsInCache) return true;

  try {
    const { data, error } = await supabase
      .from('user_sleep_records')
      .select('id')
      .eq('user_id', userId)
      .eq('sleep_date', targetDate)
      .limit(1);

    if (!error && data && data.length > 0) {
      return true;
    }
  } catch (err) {
    // Si Supabase falla o no está disponible, confiamos en la caché local
  }

  return false;
}

/**
 * Guarda o actualiza un registro de sueño tanto en Supabase como en localStorage
 */
export async function saveSleepRecord(
  userId: string,
  payload: {
    sleep_date?: string;
    start_time: string;
    end_time: string;
    quality_score: number;
    notes?: string;
  }
): Promise<SleepRecord> {
  const sleepDate = payload.sleep_date || getLocalDateString();
  const durationMinutes = calculateDurationMinutes(payload.start_time, payload.end_time);
  const quality = Math.min(Math.max(Math.round(payload.quality_score), 1), 5);

  const existingCache = getCachedSleepRecords(userId);
  const existingRecord = existingCache.find((r) => r.sleep_date === sleepDate);

  const newRecord: SleepRecord = {
    id: existingRecord ? existingRecord.id : (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `sl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`),
    user_id: userId,
    sleep_date: sleepDate,
    start_time: payload.start_time,
    end_time: payload.end_time,
    duration_minutes: durationMinutes,
    quality_score: quality,
    notes: payload.notes?.trim() || undefined,
    created_at: existingRecord ? existingRecord.created_at : new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // 1. Guardar en caché local
  try {
    const filtered = existingCache.filter((r) => r.sleep_date !== sleepDate);
    const updated = [newRecord, ...filtered].sort(
      (a, b) => new Date(b.sleep_date).getTime() - new Date(a.sleep_date).getTime()
    );
    localStorage.setItem(LOCAL_STORAGE_SLEEP_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('[Sleep] Error guardando en local storage:', err);
  }

  // 2. Sincronizar en Supabase
  try {
    const { data, error } = await supabase
      .from('user_sleep_records')
      .upsert(
        {
          id: newRecord.id,
          user_id: userId,
          sleep_date: newRecord.sleep_date,
          start_time: newRecord.start_time,
          end_time: newRecord.end_time,
          duration_minutes: newRecord.duration_minutes,
          quality_score: newRecord.quality_score,
          notes: newRecord.notes || null,
          created_at: newRecord.created_at,
          updated_at: newRecord.updated_at,
        },
        { onConflict: 'user_id,sleep_date' }
      )
      .select()
      .single();

    if (!error && data) {
      return data as SleepRecord;
    }
  } catch (err) {
    console.warn('[Sleep] Supabase no disponible o tabla en proceso, usando guardado local:', err);
  }

  return newRecord;
}

/**
 * Obtiene el historial de registros de sueño del usuario
 */
export async function fetchSleepRecords(userId: string): Promise<SleepRecord[]> {
  const cached = getCachedSleepRecords(userId);

  try {
    const { data, error } = await supabase
      .from('user_sleep_records')
      .select('*')
      .eq('user_id', userId)
      .order('sleep_date', { ascending: false });

    if (!error && data && data.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_SLEEP_KEY, JSON.stringify(data));
      return data as SleepRecord[];
    }
  } catch (err) {
    console.warn('[Sleep] Usando registros locales en fallback:', err);
  }

  return cached;
}

/**
 * Elimina un registro de sueño
 */
export async function deleteSleepRecord(id: string, userId: string): Promise<void> {
  // 1. Quitar de caché local
  try {
    const cached = getCachedSleepRecords(userId);
    const filtered = cached.filter((item) => item.id !== id);
    localStorage.setItem(LOCAL_STORAGE_SLEEP_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.warn('[Sleep] Error al eliminar de local storage:', err);
  }

  // 2. Eliminar en Supabase
  try {
    await supabase.from('user_sleep_records').delete().eq('id', id).eq('user_id', userId);
  } catch (err) {
    console.warn('[Sleep] Error al eliminar en Supabase:', err);
  }
}

/**
 * Lee los registros cacheados en localStorage
 */
export function getCachedSleepRecords(userId: string): SleepRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SLEEP_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((r) => r.user_id === userId) : [];
  } catch {
    return [];
  }
}
