import { supabase } from './supabase';
import { PirkeiAvotBookmark, PirkeiAvotProgress } from '../../../packages/shared/src/types';
import { PIRKEI_AVOT_DATA } from '../../../packages/shared/src/data/pirkeiAvotData';

const LAST_PROMPT_KEY = 'last_pirkei_avot_prompt_time';
const BOOKMARK_KEY_PREFIX = 'pirkei_avot_bookmark_';
const PROGRESS_KEY_PREFIX = 'pirkei_avot_progress_';
const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

/**
 * Obtiene el marcador actual de lectura (dónde quedó el usuario).
 * Si no existe marcador previo, retorna por defecto Capítulo 1, Mishná 1.
 */
export function getStoredPirkeiAvotBookmark(userId?: string): PirkeiAvotBookmark {
  const defaultBookmark: PirkeiAvotBookmark = {
    chapter: 1,
    mishna: 1,
    updated_at: new Date().toISOString(),
    completed: false,
  };

  if (typeof window === 'undefined') return defaultBookmark;

  const key = `${BOOKMARK_KEY_PREFIX}${userId || 'guest'}`;
  const stored = localStorage.getItem(key);
  if (!stored) return defaultBookmark;

  try {
    const parsed = JSON.parse(stored) as PirkeiAvotBookmark;
    if (parsed.chapter && parsed.mishna) {
      return parsed;
    }
  } catch (e) {
    console.warn('Error leyendo marcador de Pirkei Avot:', e);
  }

  return defaultBookmark;
}

/**
 * Guarda la posición de lectura (capítulo y mishná) tanto localmente como en Supabase.
 */
export async function savePirkeiAvotBookmark(
  bookmark: PirkeiAvotBookmark,
  userId?: string
): Promise<void> {
  if (typeof window === 'undefined') return;

  const key = `${BOOKMARK_KEY_PREFIX}${userId || 'guest'}`;
  localStorage.setItem(key, JSON.stringify(bookmark));

  if (userId) {
    try {
      await supabase.from('pirkei_avot_bookmarks').upsert({
        user_id: userId,
        chapter: bookmark.chapter,
        mishna: bookmark.mishna,
        completed: bookmark.completed || false,
        updated_at: bookmark.updated_at || new Date().toISOString(),
      });
    } catch (err) {
      // Si la tabla remota no existe aún, la persistencia local en localStorage garantiza continuidad
      console.warn('Nota: bookmark guardado localmente (Supabase:', err, ')');
    }
  }
}

/**
 * Obtiene el mapa de progreso de capítulos leídos
 */
export function getStoredPirkeiAvotProgress(userId?: string): Record<number, PirkeiAvotProgress> {
  if (typeof window === 'undefined') return {};
  const key = `${PROGRESS_KEY_PREFIX}${userId || 'guest'}`;
  const stored = localStorage.getItem(key);
  if (!stored) return {};
  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

/**
 * Guarda el progreso de una mishná o capítulo
 */
export async function savePirkeiAvotProgress(
  chapterNum: number,
  completedMishnayot: number[],
  userId?: string
): Promise<Record<number, PirkeiAvotProgress>> {
  const currentMap = getStoredPirkeiAvotProgress(userId);
  const chapterData = PIRKEI_AVOT_DATA.find((c) => c.chapter === chapterNum);
  const totalMishnayot = chapterData ? chapterData.mishnayot.length : 1;
  const isCompleted = completedMishnayot.length >= totalMishnayot;
  const now = new Date().toISOString();

  const prev = currentMap[chapterNum] || {
    chapter_number: chapterNum,
    completed_mishnayot: [],
    completed_count: 0,
    is_completed: false,
  };

  const updated: PirkeiAvotProgress = {
    chapter_number: chapterNum,
    completed_mishnayot: Array.from(new Set(completedMishnayot)).sort((a, b) => a - b),
    completed_count: isCompleted && !prev.is_completed ? prev.completed_count + 1 : prev.completed_count,
    is_completed: isCompleted,
    last_read_at: now,
  };

  const newMap = { ...currentMap, [chapterNum]: updated };
  if (typeof window !== 'undefined') {
    const key = `${PROGRESS_KEY_PREFIX}${userId || 'guest'}`;
    localStorage.setItem(key, JSON.stringify(newMap));
  }

  if (userId) {
    try {
      await supabase.from('pirkei_avot_progress').upsert({
        user_id: userId,
        chapter_number: chapterNum,
        completed_mishnayot: updated.completed_mishnayot,
        completed_count: updated.completed_count,
        is_completed: updated.is_completed,
        last_read_at: now,
      });
    } catch (e) {
      console.warn('Nota: Progreso de Pirkei Avot guardado localmente');
    }
  }

  return newMap;
}

/**
 * Verifica si la hora actual corresponde a Mediodía o Tarde (12:00 a 19:30).
 */
export function isMiddayOrAfternoon(): { inWindow: boolean; greeting: string } {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 12 && hour < 14) {
    return { inWindow: true, greeting: 'Pausa de Mediodía' };
  } else if (hour >= 14 && hour < 20) {
    return { inWindow: true, greeting: 'Reflexión de la Tarde' };
  }

  return { inWindow: false, greeting: '' };
}

/**
 * Evalúa si se debe sugerir la lectura de Pirkei Avot:
 * 1. La hora local debe estar en la ventana de mediodía o tarde (12:00 a 19:59).
 * 2. No se ha mostrado ni descartado en las últimas 4 horas.
 */
export function shouldPromptPirkeiAvot(userId?: string): {
  shouldPrompt: boolean;
  bookmark: PirkeiAvotBookmark;
  greeting: string;
} {
  const defaultRes = {
    shouldPrompt: false,
    bookmark: getStoredPirkeiAvotBookmark(userId),
    greeting: '',
  };

  if (typeof window === 'undefined') return defaultRes;

  const { inWindow, greeting } = isMiddayOrAfternoon();
  if (!inWindow) return defaultRes;

  const lastPrompt = localStorage.getItem(LAST_PROMPT_KEY);
  if (lastPrompt) {
    const lastTime = parseInt(lastPrompt, 10);
    if (!isNaN(lastTime)) {
      const diff = Date.now() - lastTime;
      if (diff < FOUR_HOURS_MS) {
        return defaultRes; // Ya se sugirió recientemente en esta tarde
      }
    }
  }

  return {
    shouldPrompt: true,
    bookmark: getStoredPirkeiAvotBookmark(userId),
    greeting,
  };
}

/**
 * Marca que el usuario cerró o aceptó la sugerencia para no insistir en 4 horas.
 */
export function markPirkeiAvotPromptDismissed(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LAST_PROMPT_KEY, Date.now().toString());
}
