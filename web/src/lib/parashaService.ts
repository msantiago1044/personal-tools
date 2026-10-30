import { supabase } from './supabase';
import {
  ParashaDailySchedule,
  WeeklyParasha,
  ParashaAliyah,
  ParashaVerse,
  ParashaProgress,
  WeekdayReading,
  WeekdayAliyahType,
} from '../../../packages/shared/src/types';
import { PARASHAT_NOACH_DATA } from '../../../packages/shared/src/data/parashatNoachData';
import { PARASHAT_LECH_LECHA_DATA } from '../../../packages/shared/src/data/parashatLechLechaData';
import { PARASHAT_VAYERA_DATA } from '../../../packages/shared/src/data/parashatVayeraData';
import { getParashaEntryForDate } from './parashotCalendar';
import {
  getWeekdayReadingForParasha,
  annotateParashaWithWeekdayReading as baseAnnotateParashaWithWeekdayReading,
} from '../../../packages/shared/src/data/weekdayTorahReadings';
import {
  transliterateHebrewToSpanish,
  stripCantillation,
  SacredNameOption,
} from './hebrewPhonetics';

export { getWeekdayReadingForParasha, transliterateHebrewToSpanish, stripCantillation };
export type { WeekdayReading, WeekdayAliyahType, SacredNameOption };

// Claves de almacenamiento local
const PARASHA_CACHE_PREFIX = 'parasha_data_cache_v6_';
const PARASHA_PROGRESS_PREFIX = 'parasha_progress_';
const DAILY_READ_KEY = 'parasha_daily_read_record';

/**
 * Nombres y metadatos de las 7 Aliyot tradicionales
 */
export const ALIYOT_META = [
  { aliyahNumber: 1, nameHebrew: 'רִאשׁוֹן', nameSpanish: '1ª Aliyá (Rishón)', code: 'rishon' },
  { aliyahNumber: 2, nameHebrew: 'שֵׁנִי', nameSpanish: '2ª Aliyá (Shení)', code: 'sheni' },
  { aliyahNumber: 3, nameHebrew: 'שְׁלִישִׁי', nameSpanish: '3ª Aliyá (Shlishí)', code: 'shlishi' },
  { aliyahNumber: 4, nameHebrew: 'רְבִיעִי', nameSpanish: '4ª Aliyá (Revií)', code: 'revii' },
  { aliyahNumber: 5, nameHebrew: 'חֲמִישִׁי', nameSpanish: '5ª Aliyá (Jamishí)', code: 'jamishi' },
  { aliyahNumber: 6, nameHebrew: 'שִׁשִּׁי', nameSpanish: '6ª Aliyá (Shishí)', code: 'shishi' },
  { aliyahNumber: 7, nameHebrew: 'שְׁבִיעִי', nameSpanish: '7ª Aliyá (Shevií)', code: 'shevii' },
  { aliyahNumber: 8, nameHebrew: 'מַפְטִיר', nameSpanish: 'Maftir', code: 'maftir' },
];

/**
 * Sanitiza y purifica el texto en español para respetar con reverencia los Nombres Sagrados
 * y términos tradicionales judíos (Torá, Shabat, Mitzvot, Kohanim, etc.).
 */
export function cleanSacredNames(rawText: string): string {
  if (!rawText) return '';

  let text = rawText;

  // 1. Eliminar etiquetas HTML sucias (pies de página, marcas masoréticas de salto {פ} {ס})
  text = text.replace(/<sup[^>]*>.*?<\/sup>/gi, '');
  text = text.replace(/<i\s+class="footnote"[^>]*>.*?<\/i>/gi, '');
  text = text.replace(/<span\s+class="mam-spi-[^"]*"[^>]*>.*?<\/span>/gi, '');
  text = text.replace(/<small>/gi, '').replace(/<\/small>/gi, '');
  text = text.replace(/\{[פס]\}/gi, '');
  text = text.replace(/<[^>]+>/g, ' '); // Eliminar cualquier otra etiqueta HTML

  // 2. Preservación del Nombre Inefable (Tetragrámaton יהוה):
  // Reemplazar traducciones inadecuadas por "YHVH" o "HaShem"
  text = text.replace(/\b(el\s+)?SEÑOR\b/g, 'YHVH');
  text = text.replace(/\bel\s+Señor\b/g, 'HaShem');
  text = text.replace(/\bdel\s+Señor\b/g, 'de HaShem');
  text = text.replace(/\bal\s+Señor\b/g, 'a HaShem');
  text = text.replace(/\bSeñor\b/g, 'HaShem');
  text = text.replace(/Jehov[aá]/gi, 'YHVH');
  text = text.replace(/Yahv[eé]/gi, 'YHVH');
  text = text.replace(/Yahw[eé]h?/gi, 'YHVH');

  // 3. Nombres Divinos y términos sagrados
  // Reemplazar Dios cuando refiere al Creador por Elohim si está junto a HaShem/YHVH
  text = text.replace(/\bYHVH\s+Dios\b/gi, 'YHVH Elohim');
  text = text.replace(/\bHaShem\s+Dios\b/gi, 'HaShem Elohim');
  text = text.replace(/\bDios\b/g, 'Elohim');

  // 4. Preservación de conceptos clave de la Torá
  text = text.replace(/\bla\s+ley\b/gi, 'la Torá');
  text = text.replace(/\blas\s+leyes\b/gi, 'la Torá y sus preceptos');
  text = text.replace(/\bmandamientos\b/gi, 'mitzvot');
  text = text.replace(/\bmandamiento\b/gi, 'mitzvá');
  text = text.replace(/\bdía\s+de\s+reposo\b/gi, 'Shabat');
  text = text.replace(/\bsábado\b/gi, 'Shabat');
  text = text.replace(/\bsacerdotes\b/gi, 'Kohanim');
  text = text.replace(/\bsacerdote\b/gi, 'Kohén');
  text = text.replace(/\blevitas\b/gi, 'Leviim');
  text = text.replace(/\btabernáculo\b/gi, 'Mishkán');
  text = text.replace(/\bholocausto\b/gi, 'ofrenda Olá');
  text = text.replace(/\bholocaustos\b/gi, 'ofrendas Olá');
  text = text.replace(/\barca\b/gi, 'Tevá');

  // 5. Normalizar espacios duplicados
  text = text.replace(/\s{2,}/g, ' ').trim();

  return text;
}

/**
 * Sanitiza y purifica el texto en hebreo eliminando entidades HTML, etiquetas Masoréticas y artefactos bidi.
 */
export function cleanHebrewText(rawText: string): string {
  if (!rawText) return '';
  let text = rawText;

  // 1. Normalizar Paseq Masorético (׀)
  text = text.replace(/&thinsp;<(?:b|small)>׀<\/(?:b|small)>&thinsp;/gi, ' ׀ ');
  text = text.replace(/&thinsp;<(?:b|small)>׀<\/(?:b|small)>/gi, ' ׀ ');
  text = text.replace(/<(?:b|small)>׀<\/(?:b|small)>/gi, ' ׀ ');
  text = text.replace(/&thinsp;/gi, ' ');
  text = text.replace(/&nbsp;/gi, ' ');

  // 2. Qere / Ketiv: preservar la lectura vocalizada Qere
  text = text.replace(/<span\s+class="mam-kq"[^>]*>.*?<span\s+class="mam-kq-q"[^>]*>(\[[^\]]+\])<\/span><\/span>/gi, '$1');
  text = text.replace(/<span\s+class="mam-kq-trivial"[^>]*>(.*?)<\/span>/gi, '$1');

  // 3. Eliminar marcas masoréticas de división {ס} {פ} y etiquetas mam-spi
  text = text.replace(/<span\s+class="mam-spi-[^"]*"[^>]*>.*?<\/span>/gi, '');
  text = text.replace(/<br\s*\/?>/gi, ' ');
  text = text.replace(/\{[פס]\}/gi, '');

  // 4. Eliminar cualquier otra etiqueta HTML residual
  text = text.replace(/<[^>]+>/g, '');

  // 5. Normalizar espacios
  text = text.replace(/\s{2,}/g, ' ').trim();
  return text;
}

/**
 * Sanitiza y purifica el texto fonético transliterado eliminando entidades HTML y artefactos.
 */
export function cleanTransliterationText(rawText: string): string {
  if (!rawText) return '';
  let text = rawText;

  text = text.replace(/&thinsp;<(?:b|small)><\/(?:b|small)>&thinsp;/gi, ' ');
  text = text.replace(/&thinsp;/gi, ' ');
  text = text.replace(/&nbsp;/gi, ' ');
  text = text.replace(/<span\s+class="mam-kq"[^>]*>.*?<span\s+class="mam-kq-q"[^>]*>(\[[^\]]+\])<\/span><\/span>/gi, '$1');
  text = text.replace(/<span\s+class="mam-kq-trivial"[^>]*>(.*?)<\/span>/gi, '$1');
  text = text.replace(/<span\s+class="mam-spi-[^"]*"[^>]*>.*?<\/span>/gi, '');
  text = text.replace(/<br\s*\/?>/gi, ' ');
  text = text.replace(/\{[sfp]\}/gi, '');
  text = text.replace(/<[^>]+>/g, '');
  text = text.replace(/\s{2,}/g, ' ').trim();
  return text;
}

/**
 * Sanitiza todos los versículos de una Parashá garantizando hebreo, fonética y español limpios.
 * Si detecta transliteraciones ausentes o con artefactos defectuosos (como "yehovah" o corrupciones de Shuruq),
 * las regenera al vuelo con el nuevo motor de fonética sefardí con YHVH.
 */
export function sanitizeParashaVerses(parasha: WeeklyParasha, sacredName: SacredNameOption = 'YHVH'): WeeklyParasha {
  if (!parasha) return parasha;
  return {
    ...parasha,
    aliyot: (parasha.aliyot || []).map((aliyah) => ({
      ...aliyah,
      verses: (aliyah.verses || []).map((v) => {
        const cleanHeb = cleanHebrewText(v.hebrew);
        let cleanTrans = cleanTransliterationText(v.transliteration || '');

        // Regeneración proactiva si la transliteración contiene errores conocidos o nombres que no sean YHVH
        if (
          !cleanTrans ||
          cleanTrans.includes('yehovah') ||
          cleanTrans.includes('bmim') ||
          cleanTrans.includes('rejb') ||
          cleanTrans.includes('gadvol') ||
          cleanTrans.includes('lvot') ||
          cleanTrans.includes('itvo') ||
          cleanTrans.includes('Adonai') ||
          cleanTrans.includes('Adonái') ||
          cleanTrans.includes('HaShem')
        ) {
          cleanTrans = transliterateHebrewToSpanish(cleanHeb, { sacredName: 'YHVH' });
        }

        // Normalización garantizada de Nombres Sagrados a YHVH en la fonética
        cleanTrans = cleanTrans
          .replace(/\bVa-Adon[aá]i\b/gi, 'Ve-YHVH')
          .replace(/\bVe-HaShem\b/gi, 'Ve-YHVH')
          .replace(/\bBa-Adon[aá]i\b/gi, 'Ba-YHVH')
          .replace(/\bBa-HaShem\b/gi, 'Ba-YHVH')
          .replace(/\bLa-Adon[aá]i\b/gi, 'La-YHVH')
          .replace(/\bLa-HaShem\b/gi, 'La-YHVH')
          .replace(/\bMe-Adon[aá]i\b/gi, 'Me-YHVH')
          .replace(/\bMe-HaShem\b/gi, 'Me-YHVH')
          .replace(/\bKa-Adon[aá]i\b/gi, 'Ka-YHVH')
          .replace(/\bKa-HaShem\b/gi, 'Ka-YHVH')
          .replace(/\bAdon[aá]i\b/gi, 'YHVH')
          .replace(/\bHaShem\b/gi, 'YHVH');

        return {
          ...v,
          hebrew: cleanHeb,
          transliteration: cleanTrans,
          spanish: cleanSacredNames(v.spanish),
        };
      }),
    })),
  };
}

/**
 * Anota la Parashá con lecturas de días de semana y sanitiza todos sus versículos.
 */
export function annotateParashaWithWeekdayReading(parasha: WeeklyParasha): WeeklyParasha {
  const annotated = baseAnnotateParashaWithWeekdayReading(parasha);
  return sanitizeParashaVerses(annotated);
}

/**
 * Transliterador fonético inteligente de Hebreo vocalizado (con Niqqud) a fonética en español sefardí.
 * Preserva y reverencia el Tetragrámaton (YHVH) y todos los Nombres Sagrados.
 */
export function hebrewToPhoneticSpanish(hebrew: string, sacredName: SacredNameOption = 'YHVH'): string {
  return transliterateHebrewToSpanish(hebrew, { sacredName });
}

/**
 * Calcula el horario y la Aliyá que corresponde leer hoy en la Diáspora.
 *
 * Reglas de lectura semanal de la Diáspora con cambio en Minjá y caída del sol:
 * - Sábado desde Minjá (~13:30) hasta Domingo en la caída del sol (~18:00):
 *   Entra la nueva parashá con la 1ª Aliyá (Rishón).
 * - Domingo en la caída del sol (~18:00) hasta Lunes en la caída del sol (~18:00):
 *   2ª Aliyá (Shení).
 * - Lunes en la caída del sol hasta Martes en la caída del sol:
 *   3ª Aliyá (Shlishí).
 * - Martes en la caída del sol hasta Miércoles en la caída del sol:
 *   4ª Aliyá (Revií).
 * - Miércoles en la caída del sol hasta Jueves en la caída del sol:
 *   5ª Aliyá (Jamishí).
 * - Jueves en la caída del sol hasta Viernes en la caída del sol:
 *   6ª Aliyá (Shishí).
 * - Viernes en la caída del sol (entra Shabat) hasta Sábado en Minjá (~13:30):
 *   7ª Aliyá (Shevií / Maftir) y lectura completa de Shabat.
 */
export function getDiasporaDailySchedule(now = new Date()): ParashaDailySchedule {
  const dayOfWeek = now.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  const hour = now.getHours();
  const minute = now.getMinutes();
  const timeDecimal = hour + minute / 60;

  const SUNSET_HOUR = 18.0; // 18:00 (caída del sol / Shkiá aproximada)
  const MINCHA_HOUR = 13.5; // 13:30 (Minjá de Shabat)

  let targetAliyahNumber = 1;
  let targetAliyahName = '1ª Aliyá (Rishón)';
  let isShabbatMorning = false;
  let isShabbatAfternoon = false;
  let dayName = 'Hoy';
  let daysUntilTargetShabbat = 0;

  switch (dayOfWeek) {
    case 6: // Sábado (Shabat)
      if (timeDecimal < MINCHA_HOUR) {
        // Mañana de Shabat (hasta las 13:30): Culmina la parashá de la semana que cierra
        isShabbatMorning = true;
        dayName = 'Shabat (Shajarit)';
        targetAliyahNumber = 7; // 7ª Aliyá / Completa
        targetAliyahName = '7ª Aliyá (Shevií)';
        daysUntilTargetShabbat = 0; // Sábado de hoy
      } else {
        // Tarde de Shabat (desde Minjá ~13:30): Inicia la nueva parashá con la 1ª Aliyá
        isShabbatAfternoon = true;
        dayName = 'Shabat (Minjá)';
        targetAliyahNumber = 1;
        targetAliyahName = '1ª Aliyá (Rishón)';
        daysUntilTargetShabbat = 7; // Próximo sábado
      }
      break;

    case 0: // Domingo
      if (timeDecimal < SUNSET_HOUR) {
        dayName = 'Domingo';
        targetAliyahNumber = 1;
        targetAliyahName = '1ª Aliyá (Rishón)';
      } else {
        dayName = 'Domingo (noche) / Lunes';
        targetAliyahNumber = 2;
        targetAliyahName = '2ª Aliyá (Shení)';
      }
      daysUntilTargetShabbat = 6;
      break;

    case 1: // Lunes
      if (timeDecimal < SUNSET_HOUR) {
        dayName = 'Lunes';
        targetAliyahNumber = 2;
        targetAliyahName = '2ª Aliyá (Shení)';
      } else {
        dayName = 'Lunes (noche) / Martes';
        targetAliyahNumber = 3;
        targetAliyahName = '3ª Aliyá (Shlishí)';
      }
      daysUntilTargetShabbat = 5;
      break;

    case 2: // Martes
      if (timeDecimal < SUNSET_HOUR) {
        dayName = 'Martes';
        targetAliyahNumber = 3;
        targetAliyahName = '3ª Aliyá (Shlishí)';
      } else {
        dayName = 'Martes (noche) / Miércoles';
        targetAliyahNumber = 4;
        targetAliyahName = '4ª Aliyá (Revií)';
      }
      daysUntilTargetShabbat = 4;
      break;

    case 3: // Miércoles
      if (timeDecimal < SUNSET_HOUR) {
        dayName = 'Miércoles';
        targetAliyahNumber = 4;
        targetAliyahName = '4ª Aliyá (Revií)';
      } else {
        dayName = 'Miércoles (noche) / Jueves';
        targetAliyahNumber = 5;
        targetAliyahName = '5ª Aliyá (Jamishí)';
      }
      daysUntilTargetShabbat = 3;
      break;

    case 4: // Jueves
      if (timeDecimal < SUNSET_HOUR) {
        dayName = 'Jueves';
        targetAliyahNumber = 5;
        targetAliyahName = '5ª Aliyá (Jamishí)';
      } else {
        dayName = 'Jueves (noche) / Viernes';
        targetAliyahNumber = 6;
        targetAliyahName = '6ª Aliyá (Shishí)';
      }
      daysUntilTargetShabbat = 2;
      break;

    case 5: // Viernes
      if (timeDecimal < SUNSET_HOUR) {
        dayName = 'Viernes';
        targetAliyahNumber = 6;
        targetAliyahName = '6ª Aliyá (Shishí)';
      } else {
        dayName = 'Viernes (noche / Shabat)';
        targetAliyahNumber = 7;
        targetAliyahName = '7ª Aliyá (Shevií)';
      }
      daysUntilTargetShabbat = 1;
      break;
  }

  const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilTargetShabbat);
  const targetDateKey = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`;
  const dateKey = now.toISOString().split('T')[0];

  // Determinar la parashá activa consultando el calendario perpetuo de la Diáspora
  const calEntry = getParashaEntryForDate(targetDateKey);

  const parashaName = calEntry?.parashaName || (targetDateKey >= '2026-10-25' ? 'Vayerá' : (targetDateKey >= '2026-10-18' ? 'Lej-Lejá' : 'Noaj'));
  const parashaHebrew = calEntry?.parashaHebrew || (targetDateKey >= '2026-10-25' ? 'וַיֵּרָא' : (targetDateKey >= '2026-10-18' ? 'לֶךְ־לְךָ' : 'נֹחַ'));
  const parashaRef = calEntry?.parashaRef || (targetDateKey >= '2026-10-25' ? 'Génesis 18:1–22:24' : (targetDateKey >= '2026-10-18' ? 'Génesis 12:1–17:27' : 'Génesis 6:9–11:32'));
  const parashaId = calEntry?.parashaId || (targetDateKey >= '2026-10-25' ? 'vayera' : (targetDateKey >= '2026-10-18' ? 'lechlecha' : 'noach'));

  return {
    dayOfWeek,
    dayName,
    targetAliyahNumber,
    targetAliyahName,
    isShabbatMorning,
    isShabbatAfternoon,
    parashaName,
    parashaHebrew,
    parashaRef,
    dateKey,
    parashaId,
  };
}

/**
 * Verifica si un texto está en inglés (para evitar mostrar traducciones JPS por error)
 */
function isEnglishText(text: string): boolean {
  if (!text) return false;
  return /\b(the|and|was|were|in|with|of|unto|said|he|his|sons|begot|earth|blameless|walked|became|corrupt|lawlessness|flood|ark|covenant)\b/i.test(text);
}

/**
 * Obtiene la Parashá activa de la Diáspora y sus Aliyot.
 * Garantiza 100% texto en Español con Niqqud en hebreo y fonética, nunca en inglés.
 */
export async function getWeeklyParasha(targetDate?: Date): Promise<WeeklyParasha> {
  const schedule = getDiasporaDailySchedule(targetDate || new Date());
  const now = targetDate || new Date();
  const dayOfWeek = now.getDay();
  const timeDecimal = now.getHours() + now.getMinutes() / 60;
  
  let daysUntilTargetShabbat = 0;
  if (dayOfWeek === 6) {
    daysUntilTargetShabbat = timeDecimal < 13.5 ? 0 : 7;
  } else {
    daysUntilTargetShabbat = 6 - dayOfWeek;
  }
  const targetShabbat = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilTargetShabbat);
  const targetDateKey = `${targetShabbat.getFullYear()}-${String(targetShabbat.getMonth() + 1).padStart(2, '0')}-${String(targetShabbat.getDate()).padStart(2, '0')}`;
  const cacheKey = `${PARASHA_CACHE_PREFIX}${targetDateKey}`;

  // 1. Revisar caché local en localStorage
  if (typeof window !== 'undefined') {
    // Purgar proactivamente cualquier clave de caché de versiones anteriores
    try {
      const staleKeys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('parasha_data_cache_') && !k.startsWith(PARASHA_CACHE_PREFIX)) {
          staleKeys.push(k);
        }
      }
      staleKeys.forEach((k) => localStorage.removeItem(k));
    } catch (e) {}

    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const firstVerseSpanish = parsed.aliyot?.[0]?.verses?.[0]?.spanish || '';
        // Si el caché tiene texto en inglés, está incompleto, tiene marcas HTML sucias, o no coincide con la parashá activa
        if (
          isEnglishText(firstVerseSpanish) ||
          !parsed.aliyot ||
          parsed.aliyot.length < 7 ||
          cached.includes('mam-spi') ||
          cached.includes('&thinsp;') ||
          cached.includes('mam-kq') ||
          (parsed.id && schedule.parashaId && parsed.id !== schedule.parashaId) ||
          (parsed.nameSpanish && schedule.parashaName && parsed.nameSpanish !== schedule.parashaName)
        ) {
          localStorage.removeItem(cacheKey);
        } else if (parsed._cachedAt && Date.now() - parsed._cachedAt < 2 * 24 * 3600 * 1000) {
          return annotateParashaWithWeekdayReading(parsed);
        }
      } catch (e) {
        localStorage.removeItem(cacheKey);
      }
    }
  }

  // 2. Comprobar datasets de alta fidelidad precompilados en Español y Hebreo con Niqqud
  if (schedule.parashaId === 'vayera' || schedule.parashaName === 'Vayerá' || targetDateKey === '2026-10-31') {
    const data = annotateParashaWithWeekdayReading(PARASHAT_VAYERA_DATA);
    if (typeof window !== 'undefined') {
      localStorage.setItem(cacheKey, JSON.stringify({ ...data, _cachedAt: Date.now() }));
    }
    return data;
  }

  if (schedule.parashaId === 'lechlecha' || schedule.parashaName === 'Lej-Lejá' || targetDateKey === '2026-10-24') {
    const data = annotateParashaWithWeekdayReading(PARASHAT_LECH_LECHA_DATA);
    if (typeof window !== 'undefined') {
      localStorage.setItem(cacheKey, JSON.stringify({ ...data, _cachedAt: Date.now() }));
    }
    return data;
  }

  if (schedule.parashaId === 'noach' || schedule.parashaName === 'Noaj' || targetDateKey === '2026-10-17') {
    const data = annotateParashaWithWeekdayReading(PARASHAT_NOACH_DATA);
    if (typeof window !== 'undefined') {
      localStorage.setItem(cacheKey, JSON.stringify({ ...data, _cachedAt: Date.now() }));
    }
    return data;
  }

  // 3. Intentar consultar calendario de Sefaria con la fecha objetivo de Shabat (Diáspora)
  try {
    const sefariaUrl = `https://www.sefaria.org/api/calendars?diaspora=1&year=${targetShabbat.getFullYear()}&month=${targetShabbat.getMonth() + 1}&day=${targetShabbat.getDate()}`;
    const calRes = await fetch(sefariaUrl);
    if (calRes.ok) {
      const calData = await calRes.json();
      const pItem = calData.calendar_items?.find(
        (it: any) => it.title?.en === 'Parashat Hashavua' || it.title?.he === 'פרשת השבוע'
      );

      if (pItem) {
        const nameEn = pItem.displayValue?.en || '';
        const nameHe = pItem.displayValue?.he || '';
        const fullRef = pItem.ref || '';

        // Si la parashá devuelta coincide con nuestros datasets precompilados, usarlos de inmediato
        if (nameEn.toLowerCase().includes('vaye') || fullRef.toLowerCase().includes('genesis 18:1')) {
          const data = annotateParashaWithWeekdayReading(PARASHAT_VAYERA_DATA);
          if (typeof window !== 'undefined') {
            localStorage.setItem(cacheKey, JSON.stringify({ ...data, _cachedAt: Date.now() }));
          }
          return data;
        }

        if (nameEn.toLowerCase().includes('lech') || nameEn.toLowerCase().includes('lej') || fullRef.toLowerCase().includes('genesis 12:1')) {
          const data = annotateParashaWithWeekdayReading(PARASHAT_LECH_LECHA_DATA);
          if (typeof window !== 'undefined') {
            localStorage.setItem(cacheKey, JSON.stringify({ ...data, _cachedAt: Date.now() }));
          }
          return data;
        }

        if (nameEn.toLowerCase().includes('noa') || fullRef.toLowerCase().includes('genesis 6:9')) {
          const data = annotateParashaWithWeekdayReading(PARASHAT_NOACH_DATA);
          if (typeof window !== 'undefined') {
            localStorage.setItem(cacheKey, JSON.stringify({ ...data, _cachedAt: Date.now() }));
          }
          return data;
        }

        const rawAliyotRefs: string[] = pItem.extraDetails?.aliyot || [];
        const aliyot: ParashaAliyah[] = [];
        const spanishVersionTitle = 'Tanaj Español, trans. Rav Yehuda Ribco, 2026 [es]';

        for (let idx = 0; idx < Math.min(rawAliyotRefs.length, 7); idx++) {
          const aliyahRef = rawAliyotRefs[idx];
          const meta = ALIYOT_META[idx];

          try {
            const textRes = await fetch(`https://www.sefaria.org/api/texts/${encodeURIComponent(aliyahRef)}?context=0&ven=${encodeURIComponent(spanishVersionTitle)}`);
            if (textRes.ok) {
              const textData = await textRes.json();
              let hebrewVerses: string[] = [];
              if (Array.isArray(textData.he)) {
                hebrewVerses = Array.isArray(textData.he[0]) ? textData.he.flat(Infinity) : textData.he;
              } else {
                hebrewVerses = [textData.he || ''];
              }

              let englishSpanishVerses: string[] = [];
              if (Array.isArray(textData.text)) {
                englishSpanishVerses = Array.isArray(textData.text[0]) ? textData.text.flat(Infinity) : textData.text;
              } else {
                englishSpanishVerses = [textData.text || ''];
              }

              const verses: ParashaVerse[] = hebrewVerses.map((heb, vIdx) => {
                const rawSp = englishSpanishVerses[vIdx] || '';
                const sanitized = cleanSacredNames(rawSp);
                return {
                  verseNumber: vIdx + 1,
                  verseKey: `${aliyahRef} #${vIdx + 1}`,
                  hebrew: cleanHebrewText(heb),
                  transliteration: hebrewToPhoneticSpanish(heb),
                  spanish: sanitized,
                };
              });

              aliyot.push({
                aliyahNumber: meta.aliyahNumber,
                nameHebrew: meta.nameHebrew,
                nameSpanish: meta.nameSpanish,
                refRange: aliyahRef,
                verses,
              });
            }
          } catch (err) {
            console.warn(`Error descargando aliyá ${idx + 1}:`, err);
          }
        }

        // Si todas las aliyot se descargaron y la primera no está en inglés
        if (aliyot.length >= 7 && !isEnglishText(aliyot[0]?.verses?.[0]?.spanish || '')) {
          const rawResult: WeeklyParasha = {
            id: nameEn.toLowerCase().replace(/[^a-z0-9]/g, ''),
            nameHebrew: nameHe,
            nameSpanish: nameEn,
            book: 'Genesis',
            bookSpanish: 'Bereshit (Génesis)',
            ref: fullRef,
            aliyot,
            summary: pItem.description?.en ? cleanSacredNames(pItem.description.en) : undefined,
          };
          const result = annotateParashaWithWeekdayReading(rawResult);

          if (typeof window !== 'undefined') {
            localStorage.setItem(cacheKey, JSON.stringify({ ...result, _cachedAt: Date.now() }));
          }
          return result;
        }
      }
    }
  } catch (err) {
    console.warn('Error conectando a Sefaria para Parashá:', err);
  }

  // 4. Respaldo garantizado según la fecha objetivo
  const fallbackRaw =
    schedule.parashaId === 'vayera' || schedule.parashaName === 'Vayerá'
      ? PARASHAT_VAYERA_DATA
      : schedule.parashaName === 'Lej-Lejá'
      ? PARASHAT_LECH_LECHA_DATA
      : PARASHAT_NOACH_DATA;
  const fallbackData = annotateParashaWithWeekdayReading(fallbackRaw);
  if (typeof window !== 'undefined') {
    localStorage.setItem(cacheKey, JSON.stringify({ ...fallbackData, _cachedAt: Date.now() }));
  }
  return fallbackData;
}

/**
 * Estadísticas completas de lectura para una Aliyá (incluyendo años pasados y ciclo)
 */
export interface AliyahReadingStats {
  count: number;
  lastReadAt?: string;
  isReadToday: boolean;
  isReadThisYear: boolean;
  wasReadLastYear: boolean;
  lastReadYear?: number;
  yearsHistory: string[];
}

/**
 * Obtiene las estadísticas de lectura de una aliyá específica
 */
export function getAliyahStats(progress: ParashaProgress | undefined, aliyahNumber: number): AliyahReadingStats {
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  if (!progress) {
    return {
      count: 0,
      isReadToday: false,
      isReadThisYear: false,
      wasReadLastYear: false,
      yearsHistory: [],
    };
  }

  // Número de veces leída (si aliyahNumber === 0, lectura completa)
  let count = 0;
  if (aliyahNumber === 0) {
    count = progress.completed_count || (progress.full_parasha_completed ? 1 : 0);
  } else {
    count = progress.aliyot_counts?.[aliyahNumber] || (progress.completed_aliyot?.includes(aliyahNumber) ? 1 : 0);
  }

  const lastReadAt = aliyahNumber === 0
    ? progress.last_read_at
    : progress.aliyot_last_read?.[aliyahNumber] || (count > 0 ? progress.last_read_at : undefined);

  let lastReadYear: number | undefined = undefined;
  if (lastReadAt) {
    try {
      lastReadYear = new Date(lastReadAt).getFullYear();
    } catch {}
  }

  // Años en los que se ha leído esta aliyá
  const yearsHistory = Object.keys(progress.years_history || {}).filter(
    (yr) => aliyahNumber === 0
      ? (progress.years_history?.[yr]?.length || 0) >= 7
      : progress.years_history?.[yr]?.includes(aliyahNumber)
  );

  const isReadThisYear = yearsHistory.includes(String(currentYear)) || lastReadYear === currentYear;
  const wasReadLastYear = yearsHistory.includes(String(lastYear)) || lastReadYear === lastYear;

  // Revisar si fue leída hoy
  const schedule = getDiasporaDailySchedule();
  let isReadToday = false;
  if (lastReadAt && lastReadAt.startsWith(schedule.dateKey)) {
    isReadToday = true;
  }

  return {
    count,
    lastReadAt,
    isReadToday,
    isReadThisYear,
    wasReadLastYear,
    lastReadYear,
    yearsHistory,
  };
}

/**
 * Normaliza y obtiene el identificador canónico de la Parashá (ej: 'vayera', 'lechlecha', 'noach')
 * para garantizar 100% consistencia entre la base de datos, el celular y la web.
 */
export function getCanonicalParashaId(input?: string): string {
  if (!input) {
    const sched = getDiasporaDailySchedule();
    return sched.parashaId || 'vayera';
  }
  const clean = input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');

  if (clean.includes('vayera') || clean.includes('wayera') || clean === 'vaye' || clean === 'parashatvayera') return 'vayera';
  if (clean.includes('lech') || clean.includes('leja') || clean.includes('lej')) return 'lechlecha';
  if (clean.includes('noa') || clean.includes('noah')) return 'noach';
  if (clean.includes('bereshit')) return 'bereshit';
  if (clean.includes('chayeisara') || clean.includes('jayeisara') || clean.includes('hayesarah')) return 'chayeisara';
  if (clean.includes('toledot') || clean.includes('toldot')) return 'toledot';
  if (clean.includes('vayetzei') || clean.includes('vayece')) return 'vayetzei';
  if (clean.includes('vayishlach') || clean.includes('vayislaj')) return 'vayishlach';
  if (clean.includes('vayeshev')) return 'vayeshev';
  if (clean.includes('miketz') || clean.includes('mikez')) return 'miketz';
  if (clean.includes('vayigash') || clean.includes('vayigas')) return 'vayigash';
  if (clean.includes('vayechi') || clean.includes('vayeji')) return 'vayechi';
  return clean;
}

function isUuid(str?: string): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

async function getCanonicalAuthUserId(userId?: string): Promise<string | undefined> {
  if (userId && isUuid(userId)) {
    return userId;
  }
  try {
    const { data } = await supabase.auth.getUser();
    if (data?.user?.id && isUuid(data.user.id)) {
      return data.user.id;
    }
  } catch {}
  return undefined;
}

/**
 * Verifica si la lectura correspondiente a HOY ya ha sido completada
 * por el usuario. Si ya está leída hoy, el widget en ToolHub se oculta.
 * Comprueba tanto la clave diaria local como el progreso acumulado de aliyot.
 */
export function isDailyAliyahReadToday(userId?: string): boolean {
  if (typeof window === 'undefined') return false;

  const schedule = getDiasporaDailySchedule();
  const canonicalId = schedule.parashaId || getCanonicalParashaId(schedule.parashaName);
  const targetNum = schedule.targetAliyahNumber;

  // 1. Comprobar registros de lectura diaria guardados en localStorage
  const candidateKeys = new Set<string>();
  if (userId) candidateKeys.add(`${DAILY_READ_KEY}_${userId}`);
  candidateKeys.add(`${DAILY_READ_KEY}_guest`);
  candidateKeys.add(`${DAILY_READ_KEY}_default`);

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(DAILY_READ_KEY)) {
        candidateKeys.add(k);
      }
    }
  } catch {}

  for (const key of candidateKeys) {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const record = JSON.parse(stored);
        if (record && record.dateKey === schedule.dateKey) {
          // Validar que el registro pertenezca estrictamente a la parashá actual
          const recordParasha = record.parashaId ? getCanonicalParashaId(record.parashaId) : canonicalId;
          if (recordParasha !== canonicalId) {
            continue;
          }
          // Detectar si fue un falso positivo heredado en Vayerá
          if (canonicalId === 'vayera' && !localStorage.getItem('parasha_vayera_verified_v1')) {
            localStorage.removeItem(key);
            continue;
          }
          if (targetNum === 0) {
            if (record.completedFull === true || record.completedAliyah === 0) return true;
          } else {
            if (record.completedAliyah === targetNum || record.completedFull === true) return true;
          }
        }
      }
    } catch {}
  }

  // 2. Comprobar si en el progreso guardado de la parashá actual ya figura leída hoy
  const prog = getParashaProgress(canonicalId, userId);
  if (prog && prog.parasha_id === canonicalId) {
    // Si es Vayerá y no ha sido verificado como leído por el usuario, evitar falsos positivos heredados
    if (canonicalId === 'vayera' && !localStorage.getItem('parasha_vayera_verified_v1')) {
      if (prog.completed_count >= 2 || (prog.completed_aliyot && prog.completed_aliyot.length >= 7)) {
        return false;
      }
    }
    if (prog.full_parasha_completed) {
      if (prog.last_read_at) {
        try {
          const readDateKey = new Date(prog.last_read_at).toISOString().split('T')[0];
          if (readDateKey === schedule.dateKey) return true;
        } catch {}
      }
    }
    if (targetNum > 0 && prog.completed_aliyot?.includes(targetNum)) {
      const aliyahLastRead = prog.aliyot_last_read?.[targetNum] || prog.last_read_at;
      if (aliyahLastRead) {
        try {
          const readDateKey = new Date(aliyahLastRead).toISOString().split('T')[0];
          if (readDateKey === schedule.dateKey) return true;
        } catch {}
      }
    }
  }

  return false;
}

/**
 * Sincroniza bidireccionalmente el progreso y lectura de Parashá con Supabase.
 * Actualiza y fusiona (merge) inmediatamente para que celular y web (PC/Laptop)
 * compartan exactamente la misma información en tiempo real sin discrepancias.
 */
export async function syncParashaWithCloud(userId?: string): Promise<{
  isReadToday: boolean;
  progress: ParashaProgress | null;
}> {
  const schedule = getDiasporaDailySchedule();
  const canonicalId = schedule.parashaId || getCanonicalParashaId(schedule.parashaName);
  const defaultRes = {
    isReadToday: isDailyAliyahReadToday(userId),
    progress: getParashaProgress(canonicalId, userId),
  };

  if (typeof window === 'undefined') return defaultRes;

  try {
    const cloudUid = await getCanonicalAuthUserId(userId);
    const { data: authData } = await supabase.auth.getUser();

    // 1. Respaldo rápido en user_metadata (sincronización instantánea entre pestañas/dispositivos)
    const metaDailyRead = authData?.user?.user_metadata?.parasha_daily_read;
    if (metaDailyRead && metaDailyRead.dateKey === schedule.dateKey) {
      const metaParashaId = metaDailyRead.parashaId ? getCanonicalParashaId(metaDailyRead.parashaId) : canonicalId;
      if (metaParashaId === canonicalId) {
        const isVayeraFp = canonicalId === 'vayera' && !localStorage.getItem('parasha_vayera_verified_v1');
        if (!isVayeraFp) {
          if (
            metaDailyRead.completedFull ||
            metaDailyRead.completedAliyah === schedule.targetAliyahNumber ||
            schedule.targetAliyahNumber === 0
          ) {
            const storageKey = `${DAILY_READ_KEY}_${userId || 'guest'}`;
            localStorage.setItem(storageKey, JSON.stringify(metaDailyRead));
            if (cloudUid && cloudUid !== userId) {
              localStorage.setItem(`${DAILY_READ_KEY}_${cloudUid}`, JSON.stringify(metaDailyRead));
            }
          }
        }
      }
    }

    // 1b. Progreso completo de Aliyot sincronizado a través de user_metadata (estrictamente por ID de parashá)
    const metaProgress = authData?.user?.user_metadata?.[`parasha_progress_${canonicalId}`];

    if (metaProgress && typeof metaProgress === 'object' && Array.isArray(metaProgress.completed_aliyot)) {
      const metaCanonical = getCanonicalParashaId(metaProgress.parasha_id);
      let isMetaContaminated = false;
      if (metaProgress.parasha_id && metaCanonical !== canonicalId) {
        isMetaContaminated = true;
      }
      if (canonicalId === 'vayera' && !localStorage.getItem('parasha_vayera_verified_v1')) {
        if (
          metaProgress.completed_count >= 2 ||
          metaProgress.completed_aliyot.length >= 7 ||
          metaProgress.aliyot_counts?.[7] === 2
        ) {
          isMetaContaminated = true;
        }
      }

      if (!isMetaContaminated) {
        const localProg = getParashaProgress(canonicalId, userId);
        const combinedAliyot = Array.from(
          new Set([...(localProg.completed_aliyot || []), ...(metaProgress.completed_aliyot || [])])
        ).sort((a, b) => a - b);

        // Combinar conteos tomando siempre el máximo por cada Aliyá (nunca sobrescribir con un valor menor)
        const mergedCounts: Record<number, number> = { ...(metaProgress.aliyot_counts || {}) };
        for (const [k, v] of Object.entries(localProg.aliyot_counts || {})) {
          const numKey = Number(k);
          mergedCounts[numKey] = Math.max(mergedCounts[numKey] || 0, Number(v) || 0);
        }

        // Combinar fechas de última lectura conservando la más reciente por cada Aliyá
        const mergedLastRead: Record<number, string> = { ...(metaProgress.aliyot_last_read || {}) };
        for (const [k, v] of Object.entries(localProg.aliyot_last_read || {})) {
          const numKey = Number(k);
          const existing = mergedLastRead[numKey];
          if (!existing || String(v) > String(existing)) {
            mergedLastRead[numKey] = String(v);
          }
        }

        // Combinar historial por años sin perder aliyot registradas localmente
        const mergedYearsHistory: Record<string, number[]> = { ...(metaProgress.years_history || {}) };
        for (const [yr, alList] of Object.entries(localProg.years_history || {})) {
          const existingList = Array.isArray(mergedYearsHistory[yr]) ? mergedYearsHistory[yr] : [];
          const nextList = Array.isArray(alList) ? alList : [];
          mergedYearsHistory[yr] = Array.from(new Set([...existingList, ...nextList])).sort((a, b) => a - b);
        }

        const latestReadAt =
          localProg.last_read_at && metaProgress.last_read_at
            ? localProg.last_read_at > metaProgress.last_read_at
              ? localProg.last_read_at
              : metaProgress.last_read_at
            : localProg.last_read_at || metaProgress.last_read_at;

        const mergedMetaProg: ParashaProgress = {
          parasha_id: canonicalId,
          completed_aliyot: combinedAliyot,
          full_parasha_completed: metaProgress.full_parasha_completed || localProg.full_parasha_completed,
          completed_count: Math.max(metaProgress.completed_count || 0, localProg.completed_count || 0),
          last_read_at: latestReadAt,
          aliyot_counts: mergedCounts,
          aliyot_last_read: mergedLastRead,
          years_history: mergedYearsHistory,
        };

        const progressKey = `${PARASHA_PROGRESS_PREFIX}${canonicalId}_${userId || 'guest'}`;
        localStorage.setItem(progressKey, JSON.stringify(mergedMetaProg));
        if (cloudUid && cloudUid !== userId) {
          localStorage.setItem(`${PARASHA_PROGRESS_PREFIX}${canonicalId}_${cloudUid}`, JSON.stringify(mergedMetaProg));
        }
      }
    }

    if (!cloudUid) return defaultRes;

    // 2. Consultar tabla parasha_progress en Supabase
    const { data: remoteRows, error } = await supabase
      .from('parasha_progress')
      .select('*')
      .eq('user_id', cloudUid);

    if (!error && remoteRows && remoteRows.length > 0) {
      // Buscar ÚNICAMENTE la fila correspondiente a la parashá actual (nunca heredar de otra parashá)
      const matchingRow = remoteRows.find((r: any) => getCanonicalParashaId(r.parasha_id) === canonicalId);

      if (matchingRow) {
        // Si es Vayerá y tiene datos contaminados en Supabase, eliminarlos para sanear
        if (canonicalId === 'vayera' && !localStorage.getItem('parasha_vayera_verified_v1')) {
          if (matchingRow.is_completed || (matchingRow.completed_aliyot && matchingRow.completed_aliyot.length >= 7)) {
            try {
              await supabase.from('parasha_progress').delete().eq('user_id', cloudUid).eq('parasha_id', canonicalId);
            } catch {}
            const emptyProg: ParashaProgress = {
              parasha_id: canonicalId,
              completed_aliyot: [],
              full_parasha_completed: false,
              completed_count: 0,
              aliyot_counts: {},
              aliyot_last_read: {},
              years_history: {},
            };
            const progressKey = `${PARASHA_PROGRESS_PREFIX}${canonicalId}_${userId || 'guest'}`;
            localStorage.setItem(progressKey, JSON.stringify(emptyProg));
            return {
              isReadToday: false,
              progress: emptyProg,
            };
          }
        }

        const localProg = getParashaProgress(canonicalId, userId);
        const combinedAliyot = Array.from(
          new Set([...(localProg.completed_aliyot || []), ...(matchingRow.completed_aliyot || [])])
        ).sort((a, b) => a - b);

        const alCounts = { ...(localProg.aliyot_counts || {}) };
        combinedAliyot.forEach((al) => {
          if (!alCounts[al] || alCounts[al] === 0) {
            alCounts[al] = 1;
          }
        });

        const currentYearStr = String(new Date().getFullYear());
        const yHistory = { ...(localProg.years_history || {}) };
        yHistory[currentYearStr] = Array.from(
          new Set([...(yHistory[currentYearStr] || []), ...combinedAliyot])
        ).sort((a, b) => a - b);

        const mergedProg: ParashaProgress = {
          parasha_id: canonicalId,
          completed_aliyot: combinedAliyot,
          full_parasha_completed: matchingRow.is_completed || localProg.full_parasha_completed || combinedAliyot.length >= 7,
          completed_count: Math.max(matchingRow.is_completed ? 1 : 0, localProg.completed_count || 0),
          last_read_at: matchingRow.last_read_at || localProg.last_read_at,
          aliyot_counts: alCounts,
          aliyot_last_read: localProg.aliyot_last_read || {},
          years_history: yHistory,
        };

        // Guardar progreso combinado localmente
        const progressKey = `${PARASHA_PROGRESS_PREFIX}${canonicalId}_${userId || 'guest'}`;
        localStorage.setItem(progressKey, JSON.stringify(mergedProg));
        if (cloudUid && cloudUid !== userId) {
          localStorage.setItem(`${PARASHA_PROGRESS_PREFIX}${canonicalId}_${cloudUid}`, JSON.stringify(mergedProg));
        }

        // Evaluar si la aliyá de hoy fue leída hoy en el celular u otro dispositivo
        let readToday = false;
        if (matchingRow.date_key === schedule.dateKey) {
          if (schedule.targetAliyahNumber === 0) {
            readToday = mergedProg.full_parasha_completed;
          } else {
            readToday =
              mergedProg.completed_aliyot.includes(schedule.targetAliyahNumber) ||
              mergedProg.full_parasha_completed;
          }
        }

        if (!readToday && schedule.targetAliyahNumber > 0) {
          const aliyahTime = mergedProg.aliyot_last_read?.[schedule.targetAliyahNumber];
          if (aliyahTime) {
            try {
              if (new Date(aliyahTime).toISOString().split('T')[0] === schedule.dateKey) {
                readToday = true;
              }
            } catch {}
          }
        }

        if (!readToday && mergedProg.last_read_at && mergedProg.completed_aliyot.includes(schedule.targetAliyahNumber)) {
          try {
            if (new Date(mergedProg.last_read_at).toISOString().split('T')[0] === schedule.dateKey) {
              readToday = true;
            }
          } catch {}
        }

        if (readToday) {
          const record = {
            dateKey: schedule.dateKey,
            parashaId: canonicalId,
            completedAliyah: schedule.targetAliyahNumber,
            completedFull: mergedProg.full_parasha_completed,
            timestamp: Date.now(),
          };
          const storageKey = `${DAILY_READ_KEY}_${userId || 'guest'}`;
          localStorage.setItem(storageKey, JSON.stringify(record));
          if (cloudUid && cloudUid !== userId) {
            localStorage.setItem(`${DAILY_READ_KEY}_${cloudUid}`, JSON.stringify(record));
          }
        }

        window.dispatchEvent(new CustomEvent('parasha_progress_updated'));

        return {
          isReadToday: readToday || isDailyAliyahReadToday(userId),
          progress: mergedProg,
        };
      } else {
        // No hay fila en Supabase para esta parashá: si es Vayerá y no está verificada, purgar contaminación local previa
        if (canonicalId === 'vayera' && !localStorage.getItem('parasha_vayera_verified_v1')) {
          for (let i = localStorage.length - 1; i >= 0; i--) {
            const k = localStorage.key(i);
            if (k && (k.includes('parasha_progress_vayera') || k.includes('parasha_daily_read'))) {
              try {
                const raw = localStorage.getItem(k);
                if (raw) {
                  const val = JSON.parse(raw);
                  if (val.completed_count >= 2 || (val.completed_aliyot && val.completed_aliyot.length >= 7) || val.completedFull) {
                    localStorage.removeItem(k);
                  }
                }
              } catch {}
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn('[Parashá] Error sincronizando con la nube:', err);
  }

  return {
    isReadToday: isDailyAliyahReadToday(userId),
    progress: getParashaProgress(canonicalId, userId),
  };
}

/**
 * Marca la Aliyá de hoy (o una aliyá seleccionada) como leída.
 * Incrementa el contador acumulativo, registra el timestamp y el año,
 * guarda tanto en local como en la nube de Supabase y user_metadata,
 * y oculta el widget de inicio en todos los dispositivos conectados.
 */
export async function markDailyAliyahCompletedToday(
  aliyahNumber: number,
  parashaId: string,
  userId?: string
): Promise<ParashaProgress> {
  const schedule = getDiasporaDailySchedule();
  const canonicalId = getCanonicalParashaId(parashaId || schedule.parashaId);
  const now = new Date();
  const nowISO = now.toISOString();
  const currentYearStr = String(now.getFullYear());
  const storageKey = `${DAILY_READ_KEY}_${userId || 'guest'}`;

  if (canonicalId === 'vayera') {
    localStorage.setItem('parasha_vayera_verified_v1', 'true');
  }

  // 1. Guardar récord diario para ocultar el widget en ToolHub
  const record = {
    dateKey: schedule.dateKey,
    parashaId: canonicalId,
    completedAliyah: aliyahNumber,
    completedFull: aliyahNumber === 0,
    timestamp: Date.now(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(storageKey, JSON.stringify(record));
    localStorage.setItem(`${DAILY_READ_KEY}_guest`, JSON.stringify(record));
  }

  // 2. Actualizar el mapa general de progreso de la Parashá con conteo multi-año
  const progressKey = `${PARASHA_PROGRESS_PREFIX}${canonicalId}_${userId || 'guest'}`;
  let progress: ParashaProgress = {
    parasha_id: canonicalId,
    completed_aliyot: [],
    full_parasha_completed: false,
    completed_count: 0,
    last_read_at: nowISO,
    aliyot_counts: {},
    aliyot_last_read: {},
    years_history: {},
  };

  if (typeof window !== 'undefined') {
    const cachedProg = localStorage.getItem(progressKey);
    if (cachedProg) {
      try {
        progress = { ...progress, ...JSON.parse(cachedProg) };
      } catch {}
    }
  }

  const aliyotCounts = { ...(progress.aliyot_counts || {}) };
  const aliyotLastRead = { ...(progress.aliyot_last_read || {}) };
  const yearsHistory = { ...(progress.years_history || {}) };
  const currentYearAliyot = new Set(yearsHistory[currentYearStr] || []);

  if (aliyahNumber === 0) {
    // Parashá completa
    progress.full_parasha_completed = true;
    progress.completed_count = (progress.completed_count || 0) + 1;
    progress.completed_aliyot = [1, 2, 3, 4, 5, 6, 7];
    for (let a = 1; a <= 7; a++) {
      aliyotCounts[a] = (aliyotCounts[a] || 0) + 1;
      aliyotLastRead[a] = nowISO;
      currentYearAliyot.add(a);
    }
  } else {
    // Aliyá específica (1 a 7)
    if (!progress.completed_aliyot.includes(aliyahNumber)) {
      progress.completed_aliyot.push(aliyahNumber);
      progress.completed_aliyot.sort((a, b) => a - b);
    }
    aliyotCounts[aliyahNumber] = (aliyotCounts[aliyahNumber] || 0) + 1;
    aliyotLastRead[aliyahNumber] = nowISO;
    currentYearAliyot.add(aliyahNumber);

    if (progress.completed_aliyot.length >= 7) {
      progress.full_parasha_completed = true;
      progress.completed_count = (progress.completed_count || 0) + 1;
    }
  }

  yearsHistory[currentYearStr] = Array.from(currentYearAliyot).sort((a, b) => a - b);
  progress.aliyot_counts = aliyotCounts;
  progress.aliyot_last_read = aliyotLastRead;
  progress.years_history = yearsHistory;
  progress.last_read_at = nowISO;

  if (typeof window !== 'undefined') {
    localStorage.setItem(progressKey, JSON.stringify(progress));
  }

  // 3. Sincronizar en Supabase (Base de datos y metadata de Auth para disponibilidad inmediata)
  const cloudUid = await getCanonicalAuthUserId(userId);
  if (cloudUid) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${DAILY_READ_KEY}_${cloudUid}`, JSON.stringify(record));
      localStorage.setItem(`${PARASHA_PROGRESS_PREFIX}${canonicalId}_${cloudUid}`, JSON.stringify(progress));
    }

    try {
      await supabase.from('parasha_progress').upsert(
        {
          user_id: cloudUid,
          parasha_id: canonicalId,
          completed_aliyot: progress.completed_aliyot,
          is_completed: progress.full_parasha_completed,
          last_read_at: progress.last_read_at,
          date_key: schedule.dateKey,
        },
        { onConflict: 'user_id,parasha_id' }
      );

      // Respaldo inmediato en user_metadata para replicación en caliente a todos los clientes (móvil y web)
      await supabase.auth.updateUser({
        data: {
          parasha_daily_read: record,
          [`parasha_progress_${canonicalId}`]: progress,
        },
      }).catch(() => {});
    } catch (err) {
      console.warn('Nota: Progreso de Parashá guardado localmente (Supabase:', err, ')');
    }
  }

  // Notificar al sistema para actualizar el widget de inicio en tiempo real
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('parasha_progress_updated'));
  }

  return progress;
}

/**
 * Obtiene el progreso general de la parashá actual
 */
export function getParashaProgress(parashaId: string, userId?: string): ParashaProgress {
  const canonicalId = getCanonicalParashaId(parashaId);
  const defaultProg: ParashaProgress = {
    parasha_id: canonicalId,
    completed_aliyot: [],
    full_parasha_completed: false,
    completed_count: 0,
    aliyot_counts: {},
    aliyot_last_read: {},
    years_history: {},
  };

  if (typeof window !== 'undefined') {
    const candidateKeys = [
      `${PARASHA_PROGRESS_PREFIX}${canonicalId}_${userId || 'guest'}`,
      `${PARASHA_PROGRESS_PREFIX}${parashaId}_${userId || 'guest'}`,
      `${PARASHA_PROGRESS_PREFIX}${canonicalId}_guest`,
    ];

    for (const key of candidateKeys) {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed) {
            // Verificar que no sea un registro de otra parashá copiado
            if (parsed.parasha_id && getCanonicalParashaId(parsed.parasha_id) !== canonicalId) {
              continue;
            }
            // DETECTAR Y CORREGIR CONTAMINACIÓN CRUZADA DE PARASHOT:
            // Si Vayerá tiene progreso copiado de Lej-Lejá (7 aliyot completas o 10 lecturas previas):
            if (canonicalId === 'vayera' && !localStorage.getItem('parasha_vayera_verified_v1')) {
              const hasInheritedLechLecha =
                parsed.completed_count >= 2 ||
                (parsed.completed_aliyot && parsed.completed_aliyot.length >= 7) ||
                parsed.aliyot_counts?.[7] === 2;
              if (hasInheritedLechLecha) {
                console.warn('[Parashá] Purgando progreso contaminado heredado en Vayerá');
                localStorage.removeItem(key);
                continue;
              }
            }
            return { ...defaultProg, ...parsed, parasha_id: canonicalId };
          }
        } catch {}
      }
    }
  }

  return defaultProg;
}

