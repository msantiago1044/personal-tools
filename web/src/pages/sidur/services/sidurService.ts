import {
  SidurTefila,
  SidurTefilaId,
  SidurSegment,
  SidurProgress,
} from '../../../../../packages/shared/src/types';
import { SIDUR_MOROCCO_TEFILOT } from '../../../../../packages/shared/src/data/sidurMoroccoData';
import {
  transliterateHebrewToSpanish,
  SacredNameOption,
} from '../../../lib/hebrewPhonetics';
import { supabase } from '../../../lib/supabase';

const STORAGE_PREFIX = 'sidur_progress_';

/**
 * Devuelve todas las tefilot disponibles en el rito marroquí.
 */
export function getSidurTefilot(): SidurTefila[] {
  return SIDUR_MOROCCO_TEFILOT;
}

/**
 * Obtiene una tefilá específica por su ID.
 */
export function getSidurTefila(id: SidurTefilaId): SidurTefila | undefined {
  return SIDUR_MOROCCO_TEFILOT.find((t) => t.id === id);
}

/**
 * Determina el rezo sugerido según la hora local actual.
 * - Mañana (04:00 - 12:59) -> Shajarit
 * - Tarde (13:00 - 18:29) -> Minjá
 * - Noche (18:30 - 03:59) -> Arvit
 */
export function getSuggestedTefilaId(): SidurTefilaId {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const decimalHour = hours + minutes / 60;

  if (decimalHour >= 4 && decimalHour < 13) {
    return 'shajarit';
  } else if (decimalHour >= 13 && decimalHour < 18.5) {
    return 'minja';
  } else {
    return 'arvit';
  }
}

/**
 * Obtiene la fecha actual en formato ISO local YYYY-MM-DD.
 */
export function getTodayDateKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Genera la transliteración fonética masorética aplicando la opción de Nombre Sagrado.
 */
export function getRenderedTransliteration(
  segment: SidurSegment,
  sacredNameMode: SacredNameOption
): string {
  if (!segment) return '';

  // Si ya tiene transliteración y el modo es Adonai (estándar), la devolvemos adaptando los nombres
  if (segment.transliteration) {
    let text = segment.transliteration;
    if (sacredNameMode === 'YHVH') {
      text = text
        .replace(/\bAdonái\b/g, 'YHVH')
        .replace(/\bAdonai\b/g, 'YHVH')
        .replace(/\bHaShem\b/g, 'YHVH')
        .replace(/\bVa-Adonái\b/g, 'Ve-YHVH');
    } else if (sacredNameMode === 'HaShem') {
      text = text
        .replace(/\bAdonái\b/g, 'HaShem')
        .replace(/\bAdonai\b/g, 'HaShem')
        .replace(/\bYHVH\b/g, 'HaShem')
        .replace(/\bVa-Adonái\b/g, 'Ve-HaShem');
    } else {
      text = text
        .replace(/\bYHVH\b/g, 'Adonái')
        .replace(/\bHaShem\b/g, 'Adonái')
        .replace(/\bVe-YHVH\b/g, 'Va-Adonái');
    }
    return text;
  }

  // Si no estuviese precomputada, se genera con el motor hebrewPhonetics
  return transliterateHebrewToSpanish(segment.hebrew, {
    sacredName: sacredNameMode,
  });
}

/**
 * Aplica el Nombre Sagrado seleccionado en la traducción al español.
 */
export function getRenderedSpanish(
  segment: SidurSegment,
  sacredNameMode: SacredNameOption
): string {
  if (!segment || !segment.spanish) return '';
  let text = segment.spanish;

  if (sacredNameMode === 'Adonai') {
    text = text.replace(/\bYHVH\b/g, 'Adonái').replace(/\bHaShem\b/g, 'Adonái');
  } else if (sacredNameMode === 'HaShem') {
    text = text.replace(/\bYHVH\b/g, 'HaShem').replace(/\bAdonái\b/g, 'HaShem').replace(/\bAdonai\b/g, 'HaShem');
  } else {
    text = text.replace(/\bAdonái\b/g, 'YHVH').replace(/\bAdonai\b/g, 'YHVH').replace(/\bHaShem\b/g, 'YHVH');
  }

  return text;
}

/**
 * Obtiene el progreso del usuario del día actual.
 */
export function getStoredSidurProgress(userId?: string): SidurProgress {
  const today = getTodayDateKey();
  const defaultProgress: SidurProgress = {
    date: today,
    shajaritCompleted: false,
    minjaCompleted: false,
    arvitCompleted: false,
    completedAt: {},
    streakDays: 0,
    history: {},
  };

  if (typeof window === 'undefined') return defaultProgress;

  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${userId || 'guest'}`);
    if (!raw) return defaultProgress;
    const parsed: SidurProgress = JSON.parse(raw);

    // Si el registro guardado es de hoy, devolvemos tal cual
    if (parsed.date === today) {
      return parsed;
    }

    // Si es de un día anterior, reseteamos el estado de hoy manteniendo el historial y racha
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().slice(0, 10);
    const wasYesterdayCompleted =
      Boolean(parsed.history[yesterdayKey]?.length) ||
      (parsed.date === yesterdayKey &&
        (parsed.shajaritCompleted || parsed.minjaCompleted || parsed.arvitCompleted));

    return {
      date: today,
      shajaritCompleted: false,
      minjaCompleted: false,
      arvitCompleted: false,
      completedAt: {},
      streakDays: wasYesterdayCompleted ? parsed.streakDays : 0,
      history: {
        ...parsed.history,
        ...(parsed.shajaritCompleted || parsed.minjaCompleted || parsed.arvitCompleted
          ? {
              [parsed.date]: [
                ...(parsed.shajaritCompleted ? ['shajarit'] : []),
                ...(parsed.minjaCompleted ? ['minja'] : []),
                ...(parsed.arvitCompleted ? ['arvit'] : []),
              ],
            }
          : {}),
      },
    };
  } catch (e) {
    console.error('Error cargando progreso de sidur:', e);
    return defaultProgress;
  }
}

/**
 * Alterna el estado de cumplimiento de una tefilá para hoy y sincroniza en local y Supabase.
 */
export async function toggleTefilaCompletedToday(
  tefilaId: SidurTefilaId,
  userId?: string
): Promise<SidurProgress> {
  const current = getStoredSidurProgress(userId);
  const today = getTodayDateKey();
  const nowIso = new Date().toISOString();

  let shajarit = current.shajaritCompleted;
  let minja = current.minjaCompleted;
  let arvit = current.arvitCompleted;
  const completedAt = { ...current.completedAt };

  if (tefilaId === 'shajarit') {
    shajarit = !shajarit;
    if (shajarit) completedAt.shajarit = nowIso;
    else delete completedAt.shajarit;
  } else if (tefilaId === 'minja') {
    minja = !minja;
    if (minja) completedAt.minja = nowIso;
    else delete completedAt.minja;
  } else if (tefilaId === 'arvit') {
    arvit = !arvit;
    if (arvit) completedAt.arvit = nowIso;
    else delete completedAt.arvit;
  }

  const todayList: string[] = [
    ...(shajarit ? ['shajarit'] : []),
    ...(minja ? ['minja'] : []),
    ...(arvit ? ['arvit'] : []),
  ];

  const updated: SidurProgress = {
    ...current,
    date: today,
    shajaritCompleted: shajarit,
    minjaCompleted: minja,
    arvitCompleted: arvit,
    completedAt,
    streakDays: todayList.length > 0 ? Math.max(current.streakDays, 1) : current.streakDays,
    history: {
      ...current.history,
      [today]: todayList,
    },
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(
      `${STORAGE_PREFIX}${userId || 'guest'}`,
      JSON.stringify(updated)
    );
  }

  // Sincronización transparente con Supabase si hay sesión activa
  if (userId) {
    try {
      await supabase.from('sidur_progress').upsert({
        user_id: userId,
        date_key: today,
        shajarit_completed: shajarit,
        minja_completed: minja,
        arvit_completed: arvit,
        completed_at: completedAt,
        updated_at: nowIso,
      });
    } catch (err) {
      // Si la tabla aún no existe o falla la red, no bloqueamos la experiencia
      console.warn('Nota: Sincronización en la nube de sidur diferida.', err);
    }
  }

  return updated;
}
