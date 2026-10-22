import {
  SidurTefila,
  SidurTefilaId,
  SidurSegment,
  SidurSection,
  SidurProgress,
  SidurPrayerMode,
} from '../../../../../packages/shared/src/types';
import { SIDUR_MOROCCO_TEFILOT } from '../../../../../packages/shared/src/data/sidurMoroccoData';
import {
  transliterateHebrewToSpanish,
  SacredNameOption,
} from '../../../lib/hebrewPhonetics';
import { supabase } from '../../../lib/supabase';

const STORAGE_PREFIX = 'sidur_progress_';

/**
 * Segmentos que requieren quórum de 10 varones (Minián) según la Halajá y el Minhag Marroquí.
 * En rezo individual (Tefilat Yajid / Sin Minián) se omiten.
 */
export const MINIAN_ONLY_SEGMENTS = new Set<string>([
  'bareju',
  'shelosh_esreh_midot',
  'minja_tajanun',
  'vehu_rajum',
]);

/**
 * Segmentos del núcleo litúrgico halájico esencial para el "Modo Rápido"
 * (cuando hay poco tiempo antes del fin del horario del rezo / zman tefilá).
 */
export const ESSENTIAL_SEGMENTS = new Set<string>([
  'netilat_yadayim',
  'asher_yatzar',
  'birjot_hatora',
  'baruj_sheamar',
  'ashrei',
  'yishtabaj',
  'shema_yisrael',
  'emet_veyatziv',
  'amida_intro',
  'amida_1_avot',
  'amida_2_gevurot',
  'amida_3_kedusha',
  'amida_4_daat',
  'amida_5_teshuva',
  'amida_6_selija',
  'amida_7_geula',
  'amida_8_refua',
  'amida_9_shanim',
  'amida_10_galuyot',
  'amida_11_din',
  'amida_12_minim',
  'amida_13_tzadikim',
  'amida_14_yerushalayim',
  'amida_15_david',
  'amida_16_shema_kolenu',
  'amida_17_avoda',
  'amida_18_modim',
  'amida_19_shalom',
  'amida_cierre',
  'alenu_leshabeaj',
  'minja_ashrei',
  'minja_amida_prompt',
  'minja_alenu',
  'arvit_shema',
  'arvit_amida',
  'arvit_alenu',
  'beraja_1_hazan',
  'beraja_2_aretz',
  'beraja_3_yerushalayim',
  'beraja_4_hatov',
  'tefilat_haderej_seg',
  'hamapil',
  'shema_al_hamita_verse',
]);

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
 * Determina si un segmento requiere minián.
 */
export function isSegmentRequiringMinian(segment: SidurSegment): boolean {
  return Boolean(segment.requiresMinian || MINIAN_ONLY_SEGMENTS.has(segment.id));
}

/**
 * Determina si un segmento pertenece al núcleo esencial.
 */
export function isSegmentEssential(segment: SidurSegment, section?: SidurSection): boolean {
  return Boolean(
    segment.isEssential ||
    ESSENTIAL_SEGMENTS.has(segment.id) ||
    section?.isEssential ||
    section?.id === 'amida_jol' ||
    section?.id === 'minja_amida_section' ||
    section?.id === 'arvit_amida_section'
  );
}

/**
 * Filtra las secciones y segmentos según el modo litúrgico seleccionado:
 * - 'completo': Muestra todo íntegro.
 * - 'minian': Muestra todo (con las oraciones y respuestas que requieren minián).
 * - 'sin_minian': Omite las oraciones que requieren quórum (Barejú, 13 Midot comunitaria, etc.).
 * - 'rapido': Filtra exclusivamente al núcleo halájico esencial.
 */
export function getFilteredSections(
  sections: SidurSection[],
  prayerMode: SidurPrayerMode = 'completo'
): SidurSection[] {
  if (prayerMode === 'completo') {
    return sections;
  }

  return sections
    .map((sec) => {
      let filtered = sec.segments;

      if (prayerMode === 'sin_minian') {
        filtered = filtered.filter((seg) => !isSegmentRequiringMinian(seg));
      } else if (prayerMode === 'rapido') {
        filtered = filtered.filter((seg) => isSegmentEssential(seg, sec));
      }

      return {
        ...sec,
        segments: filtered,
      };
    })
    .filter((sec) => sec.segments.length > 0);
}

/**
 * Determina el rezo sugerido según la hora local actual.
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
 * Genera la transliteración fonética masorética aplicando la opción de Nombre Sagrado (por defecto 'YHVH').
 */
export function getRenderedTransliteration(
  segment: SidurSegment,
  sacredNameMode: SacredNameOption = 'YHVH'
): string {
  if (!segment) return '';

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

  return transliterateHebrewToSpanish(segment.hebrew, {
    sacredName: sacredNameMode,
  });
}

/**
 * Aplica el Nombre Sagrado en la traducción al español (por defecto 'YHVH').
 */
export function getRenderedSpanish(
  segment: SidurSegment,
  sacredNameMode: SacredNameOption = 'YHVH'
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
