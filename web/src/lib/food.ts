import { supabase } from './supabase';
import { getLocalDateString } from './sleep';

export interface FoodQualityOption {
  score: number;
  label: string;
  emoji: string;
  description: string;
}

export const FOOD_QUALITY_CONFIG: Record<number, FoodQualityOption> = {
  1: {
    score: 1,
    label: 'Desbalanceado',
    emoji: '🍔',
    description: 'Comida rápida, exceso de ultraprocesados o azúcares',
  },
  2: {
    score: 2,
    label: 'Mejorable',
    emoji: '🍕',
    description: 'Pocos vegetales o raciones muy pesadas',
  },
  3: {
    score: 3,
    label: 'Aceptable',
    emoji: '🥪',
    description: 'Comida práctica y suficiente para la jornada',
  },
  4: {
    score: 4,
    label: 'Balanceado',
    emoji: '🥗',
    description: 'Buena porción de vegetales, proteína y carbohidratos sanos',
  },
  5: {
    score: 5,
    label: 'Nutritivo & Óptimo',
    emoji: '🥑',
    description: 'Ingredientes frescos, hidratación adecuada y balance total',
  },
};

export const COMMON_FOOD_TAGS = [
  'Casero',
  'Saludable',
  'Proteína',
  'Verduras',
  'Frutas',
  'Bajo en grasa',
  'Restaurante',
  'Rápido',
  'Postre / Dulce',
  'Vegetariano',
];

export interface FoodRecord {
  id: string;
  user_id: string;
  record_date: string; // YYYY-MM-DD
  breakfast?: string;
  lunch?: string;
  dinner?: string;
  snacks?: string;
  quality_score?: number;
  tags?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

const LOCAL_STORAGE_FOOD_KEY = 'user_food_history';

function getCachedFood(userId: string): FoodRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_FOOD_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((r) => r.user_id === userId) : [];
  } catch {
    return [];
  }
}

function setCachedFood(userId: string, records: FoodRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_FOOD_KEY);
    const existing: FoodRecord[] = raw ? JSON.parse(raw) : [];
    const otherUsers = existing.filter((r) => r.user_id !== userId);
    localStorage.setItem(LOCAL_STORAGE_FOOD_KEY, JSON.stringify([...records, ...otherUsers]));
  } catch (err) {
    console.warn('[Food] Error guardando en local storage:', err);
  }
}

export async function fetchFoodRecords(userId: string): Promise<FoodRecord[]> {
  const cached = getCachedFood(userId);

  try {
    const { data, error } = await supabase
      .from('user_food_records')
      .select('*')
      .eq('user_id', userId)
      .order('record_date', { ascending: false });

    if (!error && data) {
      setCachedFood(userId, data as FoodRecord[]);
      return data as FoodRecord[];
    }
  } catch (err) {
    console.warn('[Food] Fallback local para registros de comidas:', err);
  }

  return cached;
}

export async function hasFoodRecordedForDate(userId: string, dateStr: string): Promise<boolean> {
  const cached = getCachedFood(userId);
  const found = cached.find((r) => r.record_date === dateStr);
  if (found && (found.breakfast || found.lunch || found.dinner || found.snacks)) {
    return true;
  }

  try {
    const { data, error } = await supabase
      .from('user_food_records')
      .select('id, breakfast, lunch, dinner, snacks')
      .eq('user_id', userId)
      .eq('record_date', dateStr)
      .maybeSingle();

    if (!error && data) {
      return Boolean(data.breakfast || data.lunch || data.dinner || data.snacks);
    }
  } catch {}

  return false;
}

export async function saveFoodRecord(
  userId: string,
  data: {
    record_date?: string;
    breakfast?: string;
    lunch?: string;
    dinner?: string;
    snacks?: string;
    quality_score?: number;
    tags?: string[];
    notes?: string;
  }
): Promise<FoodRecord> {
  const record_date = data.record_date || getLocalDateString();
  const nowIso = new Date().toISOString();
  const cached = getCachedFood(userId);
  const existingIdx = cached.findIndex((r) => r.record_date === record_date);

  const newRecord: FoodRecord = {
    id: existingIdx >= 0 ? cached[existingIdx].id : (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `food_${Date.now()}`),
    user_id: userId,
    record_date,
    breakfast: data.breakfast?.trim() || undefined,
    lunch: data.lunch?.trim() || undefined,
    dinner: data.dinner?.trim() || undefined,
    snacks: data.snacks?.trim() || undefined,
    quality_score: data.quality_score || 3,
    tags: data.tags || [],
    notes: data.notes?.trim() || undefined,
    created_at: existingIdx >= 0 ? cached[existingIdx].created_at : nowIso,
    updated_at: nowIso,
  };

  if (existingIdx >= 0) {
    cached[existingIdx] = newRecord;
  } else {
    cached.unshift(newRecord);
  }
  setCachedFood(userId, cached);

  try {
    const { data: dbData, error } = await supabase
      .from('user_food_records')
      .upsert(
        {
          id: newRecord.id,
          user_id: userId,
          record_date,
          breakfast: newRecord.breakfast || null,
          lunch: newRecord.lunch || null,
          dinner: newRecord.dinner || null,
          snacks: newRecord.snacks || null,
          quality_score: newRecord.quality_score || 3,
          tags: newRecord.tags || null,
          notes: newRecord.notes || null,
          updated_at: nowIso,
        },
        { onConflict: 'user_id,record_date' }
      )
      .select()
      .single();

    if (!error && dbData) {
      return dbData as FoodRecord;
    }
  } catch (err) {
    console.warn('[Food] Nota: Supabase no disponible o tabla en proceso, guardado local exitoso:', err);
  }

  return newRecord;
}

export async function deleteFoodRecord(id: string, userId: string): Promise<void> {
  const cached = getCachedFood(userId);
  const filtered = cached.filter((r) => r.id !== id);
  setCachedFood(userId, filtered);

  try {
    await supabase.from('user_food_records').delete().eq('id', id).eq('user_id', userId);
  } catch (err) {
    console.warn('[Food] Error al eliminar comida en Supabase:', err);
  }
}

