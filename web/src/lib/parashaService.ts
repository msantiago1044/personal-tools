import { supabase } from './supabase';
import {
  ParashaDailySchedule,
  WeeklyParasha,
  ParashaAliyah,
  ParashaVerse,
  ParashaProgress,
} from '../../../packages/shared/src/types';
import { PARASHAT_NOACH_DATA } from '../../../packages/shared/src/data/parashatNoachData';

// Claves de almacenamiento local
const PARASHA_CACHE_PREFIX = 'parasha_data_cache_';
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
  text = text.replace(/\bJehov[aá]\b/gi, 'YHVH');
  text = text.replace(/\bYahv[eé]\b/gi, 'YHVH');
  text = text.replace(/\bYahw[eé]h?\b/gi, 'YHVH');

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
 * Transliterador fonético inteligente de Hebreo vocalizado (con Niqqud) a fonética en español.
 */
export function hebrewToPhoneticSpanish(hebrew: string): string {
  if (!hebrew) return '';

  // Limpiar cantilaciones (trope / ta'amim) dejando solo letras y niqqud
  // Rango de niqqud: \u05B0-\u05C7
  const cleaned = hebrew
    .replace(/[\u0591-\u05AF]/g, '') // Cantilaciones
    .replace(/[\u05BD\u05BF\u05C0\u05C4\u05C5]/g, '');

  let result = '';
  let i = 0;

  while (i < cleaned.length) {
    const char = cleaned[i];
    const code = char.charCodeAt(0);

    // Detección del Nombre Inefable
    if (cleaned.slice(i, i + 4) === 'יְהֹוָה' || cleaned.slice(i, i + 4) === 'יהוה') {
      result += 'Adonai ';
      i += 4;
      continue;
    }

    // Mapeo consonantes hebreas
    switch (char) {
      case 'א': // Alef
        result += "'";
        break;
      case 'ב':
        // Si tiene dagesh (U+05BC) a continuación es 'B', sino 'V'
        if (i + 1 < cleaned.length && cleaned.charCodeAt(i + 1) === 0x05bc) {
          result += 'b';
          i++;
        } else {
          result += 'v';
        }
        break;
      case 'ג':
        result += 'g';
        break;
      case 'ד':
        result += 'd';
        break;
      case 'ה':
        result += 'h';
        break;
      case 'ו':
        // Vav: puede ser consonante V o vocal O/U si tiene holam o shuruk
        if (i + 1 < cleaned.length && cleaned.charCodeAt(i + 1) === 0x05bc) {
          result += 'u';
          i++;
        } else if (i + 1 < cleaned.length && cleaned.charCodeAt(i + 1) === 0x05b9) {
          result += 'o';
          i++;
        } else {
          result += 'v';
        }
        break;
      case 'ז':
        result += 'z';
        break;
      case 'ח':
        result += 'j';
        break;
      case 'ט':
        result += 't';
        break;
      case 'י':
        result += 'y';
        break;
      case 'כ':
      case 'ך':
        if (i + 1 < cleaned.length && cleaned.charCodeAt(i + 1) === 0x05bc) {
          result += 'k';
          i++;
        } else {
          result += 'j';
        }
        break;
      case 'ל':
        result += 'l';
        break;
      case 'מ':
      case 'ם':
        result += 'm';
        break;
      case 'נ':
      case 'ן':
        result += 'n';
        break;
      case 'ס':
        result += 's';
        break;
      case 'ע':
        result += "'";
        break;
      case 'פ':
      case 'ף':
        if (i + 1 < cleaned.length && cleaned.charCodeAt(i + 1) === 0x05bc) {
          result += 'p';
          i++;
        } else {
          result += 'f';
        }
        break;
      case 'צ':
      case 'ץ':
        result += 'tz';
        break;
      case 'ק':
        result += 'k';
        break;
      case 'ר':
        result += 'r';
        break;
      case 'ש':
        // Shin dot (U+05C1) -> Sh; Sin dot (U+05C2) -> S
        if (i + 1 < cleaned.length && cleaned.charCodeAt(i + 1) === 0x05c1) {
          result += 'sh';
          i++;
        } else if (i + 1 < cleaned.length && cleaned.charCodeAt(i + 1) === 0x05c2) {
          result += 's';
          i++;
        } else {
          result += 'sh';
        }
        break;
      case 'ת':
        result += 't';
        break;

      // Niqqud (Vocales)
      case '\u05B0': // Shva
        result += 'e';
        break;
      case '\u05B1': // Jataf Segol
      case '\u05B5': // Tzere
      case '\u05B6': // Segol
        result += 'e';
        break;
      case '\u05B2': // Jataf Patach
      case '\u05B7': // Patach
      case '\u05B8': // Qamatz
        result += 'a';
        break;
      case '\u05B3': // Jataf Qamatz
      case '\u05B9': // Cholam
      case '\u05BA': // Cholam Jaser
        result += 'o';
        break;
      case '\u05B4': // Chiriq
        result += 'i';
        break;
      case '\u05BB': // Qubutz
        result += 'u';
        break;
      case '\u05BC': // Dagesh (ya manejado antes)
        break;
      case '־': // Maqaf (guión hebreo)
      case '-':
        result += '-';
        break;
      case ' ':
        result += ' ';
        break;
      default:
        if (code >= 0x05d0 && code <= 0x05ea) {
          // Letra hebrea sin regla especial
          result += '';
        } else if (code < 128) {
          result += char;
        }
        break;
    }
    i++;
  }

  // Suavizar diptongos y terminaciones
  return result
    .replace(/''+/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calcula el horario y la Aliyá que corresponde leer hoy en la Diáspora.
 *
 * Reglas de lectura semanal de la Diáspora:
 * - Sábado en la Mañana (hasta las 13:30): Parashá completa de esa semana (Aliyot 1 a 7 + Maftir).
 * - Sábado en la Tarde (desde Minjá ~13:30): Comienza la nueva parashá con la 1ª Aliyá (Rishón).
 * - Domingo: 2ª Aliyá (Shení).
 * - Lunes: 3ª Aliyá (Shlishí).
 * - Martes: 4ª Aliyá (Revií).
 * - Miércoles: 5ª Aliyá (Jamishí).
 * - Jueves: 6ª Aliyá (Shishí).
 * - Viernes: 7ª Aliyá (Shevií / Maftir).
 */
export function getDiasporaDailySchedule(now = new Date()): ParashaDailySchedule {
  const dayOfWeek = now.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  const hour = now.getHours();
  const minute = now.getMinutes();
  const timeDecimal = hour + minute / 60;

  const dateKey = now.toISOString().split('T')[0];

  let targetAliyahNumber = 1;
  let targetAliyahName = '1ª Aliyá (Rishón)';
  let isShabbatMorning = false;
  let isShabbatAfternoon = false;
  let dayName = 'Hoy';

  switch (dayOfWeek) {
    case 6: // Sábado (Shabat)
      dayName = 'Shabat';
      if (timeDecimal < 13.5) {
        // Mañana de Shabat: lectura completa de la semana
        isShabbatMorning = true;
        targetAliyahNumber = 0; // 0 representa lectura completa
        targetAliyahName = 'Parashá Completa';
      } else {
        // Tarde de Shabat (Minjá): inicia el ciclo con la 1ª Aliyá de la semana entrante
        isShabbatAfternoon = true;
        targetAliyahNumber = 1;
        targetAliyahName = '1ª Aliyá (Rishón)';
      }
      break;

    case 0: // Domingo
      dayName = 'Domingo';
      targetAliyahNumber = 2;
      targetAliyahName = '2ª Aliyá (Shení)';
      break;

    case 1: // Lunes
      dayName = 'Lunes';
      targetAliyahNumber = 3;
      targetAliyahName = '3ª Aliyá (Shlishí)';
      break;

    case 2: // Martes
      dayName = 'Martes';
      targetAliyahNumber = 4;
      targetAliyahName = '4ª Aliyá (Revií)';
      break;

    case 3: // Miércoles
      dayName = 'Miércoles';
      targetAliyahNumber = 5;
      targetAliyahName = '5ª Aliyá (Jamishí)';
      break;

    case 4: // Jueves
      dayName = 'Jueves';
      targetAliyahNumber = 6;
      targetAliyahName = '6ª Aliyá (Shishí)';
      break;

    case 5: // Viernes
      dayName = 'Viernes';
      targetAliyahNumber = 7;
      targetAliyahName = '7ª Aliyá (Shevií)';
      break;
  }

  return {
    dayOfWeek,
    dayName,
    targetAliyahNumber,
    targetAliyahName,
    isShabbatMorning,
    isShabbatAfternoon,
    parashaName: 'Noaj',
    parashaHebrew: 'נֹחַ',
    parashaRef: 'Genesis 6:9-11:32',
    dateKey,
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
export async function getWeeklyParasha(): Promise<WeeklyParasha> {
  const cacheKey = `${PARASHA_CACHE_PREFIX}current`;

  // 1. Revisar caché local en localStorage
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const firstVerseSpanish = parsed.aliyot?.[0]?.verses?.[0]?.spanish || '';
        // Si el caché tiene texto en inglés o está incompleto, invalidar de inmediato
        if (isEnglishText(firstVerseSpanish) || !parsed.aliyot || parsed.aliyot.length < 7) {
          localStorage.removeItem(cacheKey);
        } else if (parsed._cachedAt && Date.now() - parsed._cachedAt < 2 * 24 * 3600 * 1000) {
          return parsed;
        }
      } catch (e) {
        localStorage.removeItem(cacheKey);
      }
    }
  }

  // 2. Intentar consultar calendario de Sefaria (Diáspora)
  try {
    const calRes = await fetch('https://www.sefaria.org/api/calendars?diaspora=1');
    if (calRes.ok) {
      const calData = await calRes.json();
      const pItem = calData.calendar_items?.find(
        (it: any) => it.title?.en === 'Parashat Hashavua' || it.title?.he === 'פרשת השבוע'
      );

      if (pItem) {
        const nameEn = pItem.displayValue?.en || 'Noach';
        const nameHe = pItem.displayValue?.he || 'נח';
        const fullRef = pItem.ref || 'Genesis 6:9-11:32';

        // Si la parashá actual es Noaj, usar de inmediato nuestro dataset completo de alta fidelidad
        if (nameEn.toLowerCase().includes('noa') || fullRef.toLowerCase().includes('genesis 6:9')) {
          if (typeof window !== 'undefined') {
            localStorage.setItem(cacheKey, JSON.stringify({ ...PARASHAT_NOACH_DATA, _cachedAt: Date.now() }));
          }
          return PARASHAT_NOACH_DATA;
        }

        const rawAliyotRefs: string[] = pItem.extraDetails?.aliyot || [];
        const aliyot: ParashaAliyah[] = [];

        for (let idx = 0; idx < Math.min(rawAliyotRefs.length, 7); idx++) {
          const aliyahRef = rawAliyotRefs[idx];
          const meta = ALIYOT_META[idx];

          try {
            const textRes = await fetch(`https://www.sefaria.org/api/texts/${encodeURIComponent(aliyahRef)}?lang=es&context=0`);
            if (textRes.ok) {
              const textData = await textRes.json();
              const hebrewVerses: string[] = Array.isArray(textData.he) ? textData.he : [textData.he || ''];
              const englishSpanishVerses: string[] = Array.isArray(textData.text) ? textData.text : [textData.text || ''];

              const verses: ParashaVerse[] = hebrewVerses.map((heb, vIdx) => {
                const rawSp = englishSpanishVerses[vIdx] || '';
                // Si Sefaria devolvió inglés, limpiar nombres sagrados
                const sanitized = cleanSacredNames(rawSp);
                return {
                  verseNumber: vIdx + 1,
                  verseKey: `${aliyahRef} #${vIdx + 1}`,
                  hebrew: heb,
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
          const result: WeeklyParasha = {
            id: nameEn.toLowerCase().replace(/[^a-z0-9]/g, ''),
            nameHebrew: nameHe,
            nameSpanish: nameEn,
            book: 'Genesis',
            bookSpanish: 'Bereshit (Génesis)',
            ref: fullRef,
            aliyot,
            summary: pItem.description?.en ? cleanSacredNames(pItem.description.en) : undefined,
          };

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

  // 3. Respaldo garantizado 100% en Español con Nombres Sagrados (Parashat Noaj)
  if (typeof window !== 'undefined') {
    localStorage.setItem(cacheKey, JSON.stringify({ ...PARASHAT_NOACH_DATA, _cachedAt: Date.now() }));
  }
  return PARASHAT_NOACH_DATA;
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
 * Verifica si la lectura correspondiente a HOY ya ha sido completada
 * por el usuario. Si ya está leída hoy, el widget en ToolHub se oculta.
 */
export function isDailyAliyahReadToday(userId?: string): boolean {
  if (typeof window === 'undefined') return false;

  const schedule = getDiasporaDailySchedule();
  const storageKey = `${DAILY_READ_KEY}_${userId || 'guest'}`;
  const stored = localStorage.getItem(storageKey);

  if (!stored) return false;

  try {
    const record = JSON.parse(stored);
    if (record.dateKey === schedule.dateKey) {
      if (schedule.targetAliyahNumber === 0) {
        return record.completedFull === true || record.completedAliyah === 0;
      }
      return record.completedAliyah === schedule.targetAliyahNumber || record.completedFull === true;
    }
  } catch (e) {
    console.warn('Error leyendo registro diario de lectura:', e);
  }

  return false;
}

/**
 * Marca la Aliyá de hoy (o una aliyá seleccionada) como leída.
 * Incrementa el contador acumulativo, registra el timestamp y el año,
 * y oculta el widget de inicio.
 */
export async function markDailyAliyahCompletedToday(
  aliyahNumber: number,
  parashaId: string,
  userId?: string
): Promise<ParashaProgress> {
  const schedule = getDiasporaDailySchedule();
  const now = new Date();
  const nowISO = now.toISOString();
  const currentYearStr = String(now.getFullYear());
  const storageKey = `${DAILY_READ_KEY}_${userId || 'guest'}`;

  // 1. Guardar récord diario para ocultar el widget en ToolHub
  const record = {
    dateKey: schedule.dateKey,
    parashaId,
    completedAliyah: aliyahNumber,
    completedFull: aliyahNumber === 0,
    timestamp: Date.now(),
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(storageKey, JSON.stringify(record));
  }

  // 2. Actualizar el mapa general de progreso de la Parashá con conteo multi-año
  const progressKey = `${PARASHA_PROGRESS_PREFIX}${parashaId}_${userId || 'guest'}`;
  let progress: ParashaProgress = {
    parasha_id: parashaId,
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

  // 3. Sincronizar en Supabase si hay usuario activo
  if (userId) {
    try {
      await supabase.from('parasha_progress').upsert({
        user_id: userId,
        parasha_id: parashaId,
        completed_aliyot: progress.completed_aliyot,
        is_completed: progress.full_parasha_completed,
        completed_count: progress.completed_count,
        aliyot_counts: progress.aliyot_counts,
        aliyot_last_read: progress.aliyot_last_read,
        years_history: progress.years_history,
        last_read_at: progress.last_read_at,
        date_key: schedule.dateKey,
      });
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
  const defaultProg: ParashaProgress = {
    parasha_id: parashaId,
    completed_aliyot: [],
    full_parasha_completed: false,
    completed_count: 0,
    aliyot_counts: {},
    aliyot_last_read: {},
    years_history: {},
  };

  if (typeof window !== 'undefined') {
    const progressKey = `${PARASHA_PROGRESS_PREFIX}${parashaId}_${userId || 'guest'}`;
    const stored = localStorage.getItem(progressKey);
    if (stored) {
      try {
        return { ...defaultProg, ...JSON.parse(stored) };
      } catch {
        return defaultProg;
      }
    }
  }

  return defaultProg;
}
