import { supabase } from './supabase';
import { getLocalDateString } from './sleep';

export type WeatherConditionKey =
  | 'soleado'
  | 'parcial'
  | 'nublado'
  | 'lluvia'
  | 'tormenta'
  | 'viento'
  | 'calor'
  | 'frio';

export type ThermalSensationKey = 'muy_frio' | 'fresco' | 'agradable' | 'caluroso' | 'sofocante';

export interface WeatherConditionOption {
  key: WeatherConditionKey;
  label: string;
  emoji: string;
  colorClass: string;
  bgLightClass: string;
  borderClass: string;
  description: string;
}

export const WEATHER_CONDITIONS_CONFIG: Record<WeatherConditionKey, WeatherConditionOption> = {
  soleado: {
    key: 'soleado',
    label: 'Soleado',
    emoji: '☀️',
    colorClass: 'text-amber-500 dark:text-amber-400',
    bgLightClass: 'bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50',
    borderClass: 'border-amber-200 dark:border-amber-800/60',
    description: 'Cielo despejado con sol radiante',
  },
  parcial: {
    key: 'parcial',
    label: 'Parcial',
    emoji: '⛅',
    colorClass: 'text-sky-500 dark:text-sky-400',
    bgLightClass: 'bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/50',
    borderClass: 'border-sky-200 dark:border-sky-800/60',
    description: 'Intervalos de sol y nubes',
  },
  nublado: {
    key: 'nublado',
    label: 'Nublado',
    emoji: '☁️',
    colorClass: 'text-slate-500 dark:text-slate-400',
    bgLightClass: 'bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800',
    borderClass: 'border-slate-300 dark:border-slate-700',
    description: 'Cielo cubierto de nubes sin lluvia',
  },
  lluvia: {
    key: 'lluvia',
    label: 'Lluvioso',
    emoji: '🌧️',
    colorClass: 'text-blue-600 dark:text-blue-400',
    bgLightClass: 'bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50',
    borderClass: 'border-blue-200 dark:border-blue-800/60',
    description: 'Precipitaciones o llovizna constante',
  },
  tormenta: {
    key: 'tormenta',
    label: 'Tormenta',
    emoji: '⛈️',
    colorClass: 'text-purple-600 dark:text-purple-400',
    bgLightClass: 'bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50',
    borderClass: 'border-purple-200 dark:border-purple-800/60',
    description: 'Actividad eléctrica o lluvia fuerte',
  },
  viento: {
    key: 'viento',
    label: 'Ventoso',
    emoji: '🍃',
    colorClass: 'text-teal-600 dark:text-teal-400',
    bgLightClass: 'bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/50',
    borderClass: 'border-teal-200 dark:border-teal-800/60',
    description: 'Brisa marcada o ráfagas de viento fresco',
  },
  calor: {
    key: 'calor',
    label: 'Caluroso',
    emoji: '🌡️',
    colorClass: 'text-orange-600 dark:text-orange-400',
    bgLightClass: 'bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 dark:hover:bg-orange-900/50',
    borderClass: 'border-orange-200 dark:border-orange-800/60',
    description: 'Temperaturas elevadas o sensación de bochorno',
  },
  frio: {
    key: 'frio',
    label: 'Frío',
    emoji: '❄️',
    colorClass: 'text-cyan-600 dark:text-cyan-400',
    bgLightClass: 'bg-cyan-50 dark:bg-cyan-950/40 hover:bg-cyan-100 dark:hover:bg-cyan-900/50',
    borderClass: 'border-cyan-200 dark:border-cyan-800/60',
    description: 'Bajas temperaturas o sensación helada',
  },
};

export const THERMAL_SENSATION_CONFIG: Record<
  ThermalSensationKey,
  { label: string; emoji: string; badgeClass: string }
> = {
  muy_frio: {
    label: 'Muy frío',
    emoji: '🥶',
    badgeClass: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/70 dark:text-cyan-300',
  },
  fresco: {
    label: 'Fresco',
    emoji: '🧥',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300',
  },
  agradable: {
    label: 'Agradable / Templado',
    emoji: '😊',
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300',
  },
  caluroso: {
    label: 'Cálido',
    emoji: '☀️',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300',
  },
  sofocante: {
    label: 'Sofocante',
    emoji: '🥵',
    badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300',
  },
};

export interface WeatherRecord {
  id: string;
  user_id: string;
  record_date: string; // YYYY-MM-DD
  condition: WeatherConditionKey;
  temperature_c?: number;
  thermal_sensation?: ThermalSensationKey;
  notes?: string;
  created_at: string;
}

const LOCAL_STORAGE_WEATHER_KEY = 'user_weather_history';

function getCachedWeather(userId: string): WeatherRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_WEATHER_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((r) => r.user_id === userId) : [];
  } catch {
    return [];
  }
}

function setCachedWeather(userId: string, records: WeatherRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_WEATHER_KEY);
    const existing: WeatherRecord[] = raw ? JSON.parse(raw) : [];
    const otherUsers = existing.filter((r) => r.user_id !== userId);
    localStorage.setItem(LOCAL_STORAGE_WEATHER_KEY, JSON.stringify([...records, ...otherUsers]));
  } catch (err) {
    console.warn('[Weather] Error guardando en local storage:', err);
  }
}

export async function fetchWeatherRecords(userId: string): Promise<WeatherRecord[]> {
  const cached = getCachedWeather(userId);

  try {
    const { data, error } = await supabase
      .from('user_weather_records')
      .select('*')
      .eq('user_id', userId)
      .order('record_date', { ascending: false });

    if (!error && data) {
      setCachedWeather(userId, data as WeatherRecord[]);
      return data as WeatherRecord[];
    }
  } catch (err) {
    console.warn('[Weather] Fallback local para registros del clima:', err);
  }

  return cached;
}

export async function hasWeatherRecordedForDate(userId: string, dateStr: string): Promise<boolean> {
  const cached = getCachedWeather(userId);
  if (cached.some((r) => r.record_date === dateStr)) return true;

  try {
    const { data, error } = await supabase
      .from('user_weather_records')
      .select('id')
      .eq('user_id', userId)
      .eq('record_date', dateStr)
      .maybeSingle();

    if (!error && data) return true;
  } catch {}

  return false;
}

export async function saveWeatherRecord(
  userId: string,
  data: {
    record_date?: string;
    condition: WeatherConditionKey;
    temperature_c?: number;
    thermal_sensation?: ThermalSensationKey;
    notes?: string;
  }
): Promise<WeatherRecord> {
  const record_date = data.record_date || getLocalDateString();
  const nowIso = new Date().toISOString();
  const cached = getCachedWeather(userId);
  const existingIdx = cached.findIndex((r) => r.record_date === record_date);

  const newRecord: WeatherRecord = {
    id: existingIdx >= 0 ? cached[existingIdx].id : (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `weather_${Date.now()}`),
    user_id: userId,
    record_date,
    condition: data.condition,
    temperature_c: data.temperature_c,
    thermal_sensation: data.thermal_sensation,
    notes: data.notes?.trim() || undefined,
    created_at: existingIdx >= 0 ? cached[existingIdx].created_at : nowIso,
  };

  if (existingIdx >= 0) {
    cached[existingIdx] = newRecord;
  } else {
    cached.unshift(newRecord);
  }
  setCachedWeather(userId, cached);

  try {
    const { data: dbData, error } = await supabase
      .from('user_weather_records')
      .upsert(
        {
          id: newRecord.id,
          user_id: userId,
          record_date,
          condition: data.condition,
          temperature_c: data.temperature_c || null,
          thermal_sensation: data.thermal_sensation || null,
          notes: newRecord.notes || null,
        },
        { onConflict: 'user_id,record_date' }
      )
      .select()
      .single();

    if (!error && dbData) {
      return dbData as WeatherRecord;
    }
  } catch (err) {
    console.warn('[Weather] Nota: Supabase no disponible o tabla en proceso, guardado local exitoso:', err);
  }

  return newRecord;
}

export async function deleteWeatherRecord(id: string, userId: string): Promise<void> {
  const cached = getCachedWeather(userId);
  const filtered = cached.filter((r) => r.id !== id);
  setCachedWeather(userId, filtered);

  try {
    await supabase.from('user_weather_records').delete().eq('id', id).eq('user_id', userId);
  } catch (err) {
    console.warn('[Weather] Error al eliminar clima en Supabase:', err);
  }
}

