import { supabase } from './supabase';
import { getLocalDateString } from './sleep';
import { hasWaterRecordedForDate } from './water';
import { hasWeatherRecordedForDate } from './weather';
import { hasFoodRecordedForDate } from './food';

const LAST_EVENING_PROMPT_KEY = 'last_evening_prompt_time';
const LAST_EVENING_COMPLETED_DATE_KEY = 'last_evening_completed_date';
const NINETY_MINUTES_MS = 90 * 60 * 1000;

/**
 * Comprueba de forma síncrona si corresponde preguntar el chequeo de las 7:00 PM (19:00 hrs)
 */
export function shouldPromptEveningCheck(): boolean {
  if (typeof window === 'undefined') return false;

  const now = new Date();
  const currentHour = now.getHours();

  // Solo se activa a partir de las 7 de la tarde (19:00) hasta la medianoche (23:59)
  if (currentHour < 19) {
    return false;
  }

  const todayStr = getLocalDateString(now);

  // Si ya se completó el chequeo para el día de hoy, no volver a preguntar
  const completedDate = localStorage.getItem(LAST_EVENING_COMPLETED_DATE_KEY);
  if (completedDate === todayStr) {
    return false;
  }

  // Si se descartó recientemente (menos de 90 minutos), no molestar
  const lastPrompt = localStorage.getItem(LAST_EVENING_PROMPT_KEY);
  if (lastPrompt) {
    const lastTime = parseInt(lastPrompt, 10);
    if (!isNaN(lastTime) && Date.now() - lastTime < NINETY_MINUTES_MS) {
      return false;
    }
  }

  return true;
}

/**
 * Comprueba asincrónicamente consultando Supabase si ya se registraron los 3 aspectos hoy
 * o si se completó en otro dispositivo (móvil / web).
 */
export async function shouldPromptEveningCheckAsync(userId: string): Promise<boolean> {
  if (!shouldPromptEveningCheck()) {
    return false;
  }

  const todayStr = getLocalDateString();

  try {
    // 1. Verificar si en user_metadata ya se registró completado hoy
    const { data: authData } = await supabase.auth.getUser();
    const metaCompleted = authData?.user?.user_metadata?.last_evening_completed_date;
    if (metaCompleted === todayStr) {
      localStorage.setItem(LAST_EVENING_COMPLETED_DATE_KEY, todayStr);
      return false;
    }

    // 2. Verificar si ya se registraron los tres módulos hoy en la nube
    const [hasWater, hasWeather, hasFood] = await Promise.all([
      hasWaterRecordedForDate(userId, todayStr),
      hasWeatherRecordedForDate(userId, todayStr),
      hasFoodRecordedForDate(userId, todayStr),
    ]);

    // Si ya completó los tres registros de hoy, marcar como completado y no preguntar
    if (hasWater && hasWeather && hasFood) {
      markEveningCheckCompleted(userId);
      return false;
    }
  } catch (err) {
    console.warn('[EveningCheck] Error evaluando estado de chequeo nocturno:', err);
  }

  return true;
}

/**
 * Marca el chequeo de la tarde como descartado temporalmente (posponer)
 */
export function markEveningCheckDismissed(userId?: string): void {
  if (typeof window === 'undefined') return;
  const now = Date.now();
  localStorage.setItem(LAST_EVENING_PROMPT_KEY, now.toString());

  if (userId) {
    try {
      supabase.auth.updateUser({
        data: {
          last_evening_prompt_time: now,
        },
      }).catch(() => {});
    } catch {}
  }
}

/**
 * Marca el chequeo de la tarde como completado definitivamente por el día de hoy
 */
export function markEveningCheckCompleted(userId?: string): void {
  if (typeof window === 'undefined') return;
  const todayStr = getLocalDateString();
  localStorage.setItem(LAST_EVENING_COMPLETED_DATE_KEY, todayStr);

  if (userId) {
    try {
      supabase.auth.updateUser({
        data: {
          last_evening_completed_date: todayStr,
        },
      }).catch(() => {});
    } catch {}
  }
}

