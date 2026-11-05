import { supabase } from './supabase';
import { getLocalDateString } from './sleep';

export interface WaterRecord {
  id: string;
  user_id: string;
  record_date: string; // YYYY-MM-DD
  glasses: number;
  milliliters: number;
  goal_ml: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

const LOCAL_STORAGE_WATER_KEY = 'user_water_history';
export const DEFAULT_WATER_GOAL_ML = 2000;
export const ML_PER_GLASS = 250;

/**
 * Obtiene el registro de agua de la caché local para un usuario
 */
function getCachedWater(userId: string): WaterRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_WATER_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((r) => r.user_id === userId) : [];
  } catch {
    return [];
  }
}

/**
 * Guarda el array de registros en la caché local
 */
function setCachedWater(userId: string, records: WaterRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_WATER_KEY);
    const existing: WaterRecord[] = raw ? JSON.parse(raw) : [];
    const otherUsers = existing.filter((r) => r.user_id !== userId);
    localStorage.setItem(LOCAL_STORAGE_WATER_KEY, JSON.stringify([...records, ...otherUsers]));
  } catch (err) {
    console.warn('[Water] Error guardando en local storage:', err);
  }
}

/**
 * Obtiene todos los registros de consumo de agua del usuario
 */
export async function fetchWaterRecords(userId: string): Promise<WaterRecord[]> {
  const cached = getCachedWater(userId);

  try {
    const { data, error } = await supabase
      .from('user_water_records')
      .select('*')
      .eq('user_id', userId)
      .order('record_date', { ascending: false });

    if (!error && data) {
      setCachedWater(userId, data as WaterRecord[]);
      return data as WaterRecord[];
    }
  } catch (err) {
    console.warn('[Water] Usando fallback local para registros de agua:', err);
  }

  return cached;
}

/**
 * Comprueba si ya existe un registro de agua para una fecha dada
 */
export async function hasWaterRecordedForDate(userId: string, dateStr: string): Promise<boolean> {
  const cached = getCachedWater(userId);
  const found = cached.find((r) => r.record_date === dateStr);
  if (found && (found.glasses > 0 || found.milliliters > 0)) return true;

  try {
    const { data, error } = await supabase
      .from('user_water_records')
      .select('id, glasses, milliliters')
      .eq('user_id', userId)
      .eq('record_date', dateStr)
      .maybeSingle();

    if (!error && data) {
      return (data.glasses > 0 || data.milliliters > 0);
    }
  } catch {}

  return false;
}

/**
 * Guarda o actualiza el registro de agua para una fecha
 */
export async function saveWaterRecord(
  userId: string,
  data: {
    record_date?: string;
    glasses: number;
    milliliters?: number;
    goal_ml?: number;
    notes?: string;
  }
): Promise<WaterRecord> {
  const record_date = data.record_date || getLocalDateString();
  const glasses = Math.max(0, data.glasses);
  const milliliters = data.milliliters !== undefined ? data.milliliters : glasses * ML_PER_GLASS;
  const goal_ml = data.goal_ml || DEFAULT_WATER_GOAL_ML;
  const nowIso = new Date().toISOString();

  const cached = getCachedWater(userId);
  const existingIdx = cached.findIndex((r) => r.record_date === record_date);

  const newRecord: WaterRecord = {
    id: existingIdx >= 0 ? cached[existingIdx].id : (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `water_${Date.now()}`),
    user_id: userId,
    record_date,
    glasses,
    milliliters,
    goal_ml,
    notes: data.notes?.trim() || undefined,
    created_at: existingIdx >= 0 ? cached[existingIdx].created_at : nowIso,
    updated_at: nowIso,
  };

  // 1. Guardar en local storage inmediatamente
  if (existingIdx >= 0) {
    cached[existingIdx] = newRecord;
  } else {
    cached.unshift(newRecord);
  }
  setCachedWater(userId, cached);

  // 2. Persistir en Supabase
  try {
    const { data: dbData, error } = await supabase
      .from('user_water_records')
      .upsert(
        {
          id: newRecord.id,
          user_id: userId,
          record_date,
          glasses,
          milliliters,
          goal_ml,
          notes: newRecord.notes || null,
          updated_at: nowIso,
        },
        { onConflict: 'user_id,record_date' }
      )
      .select()
      .single();

    if (!error && dbData) {
      return dbData as WaterRecord;
    }
  } catch (err) {
    console.warn('[Water] Nota: Supabase no disponible o tabla en proceso, guardado local exitoso:', err);
  }

  return newRecord;
}

/**
 * Incrementa rápidamente el consumo de agua del día
 */
export async function addWaterMl(userId: string, amountMl: number, dateStr?: string): Promise<WaterRecord> {
  const targetDate = dateStr || getLocalDateString();
  const cached = getCachedWater(userId);
  const current = cached.find((r) => r.record_date === targetDate);

  const currentMl = current?.milliliters || 0;
  const newMl = Math.max(0, currentMl + amountMl);
  const newGlasses = Math.round(newMl / ML_PER_GLASS);

  return saveWaterRecord(userId, {
    record_date: targetDate,
    glasses: newGlasses,
    milliliters: newMl,
    goal_ml: current?.goal_ml || DEFAULT_WATER_GOAL_ML,
    notes: current?.notes,
  });
}

/**
 * Elimina un registro de agua
 */
export async function deleteWaterRecord(id: string, userId: string): Promise<void> {
  const cached = getCachedWater(userId);
  const filtered = cached.filter((r) => r.id !== id);
  setCachedWater(userId, filtered);

  try {
    await supabase.from('user_water_records').delete().eq('id', id).eq('user_id', userId);
  } catch (err) {
    console.warn('[Water] Error al eliminar en Supabase:', err);
  }
}

