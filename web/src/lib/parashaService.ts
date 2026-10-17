import { supabase } from './supabase';
import {
  ParashaDailySchedule,
  WeeklyParasha,
  ParashaAliyah,
  ParashaVerse,
  ParashaProgress,
} from '../../../packages/shared/src/types';

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
 * Obtiene la Parashá activa de la Diáspora y sus Aliyot.
 * Descarga de Sefaria API y almacena en caché local para lectura offline inmediata.
 */
export async function getWeeklyParasha(): Promise<WeeklyParasha> {
  const cacheKey = `${PARASHA_CACHE_PREFIX}current`;

  // 1. Revisar caché local en localStorage
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.aliyot && parsed.aliyot.length >= 7) {
          // Si el caché tiene menos de 2 días, retornarlo de inmediato
          if (parsed._cachedAt && Date.now() - parsed._cachedAt < 2 * 24 * 3600 * 1000) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Error leyendo caché de parashá:', e);
      }
    }
  }

  // 2. Intentar descargar calendario de Sefaria (Diáspora)
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
        const rawAliyotRefs: string[] = pItem.extraDetails?.aliyot || [];

        // Descargar texto de cada aliyá
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
                return {
                  verseNumber: vIdx + 1,
                  verseKey: `${aliyahRef} #${vIdx + 1}`,
                  hebrew: heb,
                  transliteration: hebrewToPhoneticSpanish(heb),
                  spanish: cleanSacredNames(rawSp),
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

        if (aliyot.length > 0) {
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
            localStorage.setItem(
              cacheKey,
              JSON.stringify({ ...result, _cachedAt: Date.now() })
            );
          }
          return result;
        }
      }
    }
  } catch (err) {
    console.warn('Error conectando a Sefaria para Parashá:', err);
  }

  // 3. Respaldo garantizado (Fallback offline de alta calidad)
  return getFallbackParasha();
}

/**
 * Respaldo precargado de la Parashá activa para funcionamiento 100% offline
 */
function getFallbackParasha(): WeeklyParasha {
  return {
    id: 'noach',
    nameHebrew: 'נֹחַ',
    nameSpanish: 'Noaj',
    book: 'Genesis',
    bookSpanish: 'Bereshit (Génesis)',
    ref: 'Genesis 6:9-11:32',
    summary: 'La generación del diluvio, la construcción de la Tevá (Arca) por orden de HaShem, y el pacto del arcoíris.',
    aliyot: [
      {
        aliyahNumber: 1,
        nameHebrew: 'רִאשׁוֹן',
        nameSpanish: '1ª Aliyá (Rishón)',
        refRange: 'Génesis 6:9–6:22',
        verses: [
          {
            verseNumber: 9,
            verseKey: 'Génesis 6:9',
            hebrew: 'אֵ֚לֶּה תּוֹלְדֹ֣ת נֹ֔חַ נֹ֗חַ אִ֥ישׁ צַדִּ֛יק תָּמִ֥ים הָיָ֖ה בְּדֹֽרֹתָ֑יו אֶת־הָֽאֱלֹהִ֖ים הִֽתְהַלֶּךְ־נֹֽחַ׃',
            transliteration: "Ele toldot Noaj, Noaj ish tzadik tamim hayá bedorotav, et HaElohim hithalej Noaj.",
            spanish: 'Estas son las generaciones de Noaj: Noaj fue un hombre justo e íntegro en sus generaciones; con Elohim caminó Noaj.'
          },
          {
            verseNumber: 10,
            verseKey: 'Génesis 6:10',
            hebrew: 'וַיּ֥וֹלֶד נֹ֖חַ שְׁלֹשָׁ֣ה בָנִ֑ים אֶת־שֵׁ֖ם אֶת־חָ֥ם וְאֶת־יָֽפֶת׃',
            transliteration: "Vayoled Noaj shloshá vanim: et Shem, et Jam ve'et Yáfet.",
            spanish: 'Y engendró Noaj tres hijos: a Shem, a Jam y a Yáfet.'
          },
          {
            verseNumber: 11,
            verseKey: 'Génesis 6:11',
            hebrew: 'וַתִּשָּׁחֵ֥ת הָאָ֖רֶץ לִפְנֵ֣י הָֽאֱלֹהִ֑ים וַתִּמָּלֵ֥א הָאָ֖רֶץ חָמָֽס׃',
            transliteration: "Vatishajet ha'aretz lifnei HaElohim, vatimalé ha'aretz jamas.",
            spanish: 'Y se corrompió la tierra delante de Elohim, y se llenó la tierra de violencia.'
          },
          {
            verseNumber: 12,
            verseKey: 'Génesis 6:12',
            hebrew: 'וַיַּ֧רְא אֱלֹהִ֛ים אֶת־הָאָ֖רֶץ וְהִנֵּ֣ה נִשְׁחָ֑תָה כִּֽי־הִשְׁחִ֧ית כׇּל־בָּשָׂ֛ר אֶת־דַּרְכּ֖וֹ עַל־הָאָֽרֶץ׃',
            transliteration: "Vayar Elohim et ha'aretz vehiné nishjata, ki hishjit kol basar et darko al ha'aretz.",
            spanish: 'Y miró Elohim a la tierra, y he aquí que estaba corrompida; porque toda carne había corrompido su camino sobre la tierra.'
          },
          {
            verseNumber: 13,
            verseKey: 'Génesis 6:13',
            hebrew: 'וַיֹּ֨אמֶר אֱלֹהִ֜ים לְנֹ֗חַ קֵ֤ץ כׇּל־בָּשָׂר֙ בָּ֣א לְפָנַ֔י כִּֽי־מָלְאָ֥ה הָאָ֛רֶץ חָמָ֖ס מִפְּנֵיהֶ֑ם וְהִנְנִ֥י מַשְׁחִיתָ֖ם אֶת־הָאָֽרֶץ׃',
            transliteration: "Vayomer Elohim leNoaj: ketz kol basar ba lefanai, ki mal'a ha'aretz jamas mipneihem; vehineni mashjitam et ha'aretz.",
            spanish: 'Y dijo Elohim a Noaj: El fin de toda carne ha llegado delante de Mí, porque la tierra está llena de violencia a causa de ellos; y he aquí que Yo los destruiré con la tierra.'
          },
          {
            verseNumber: 14,
            verseKey: 'Génesis 6:14',
            hebrew: 'עֲשֵׂ֤ה לְךָ֙ תֵּבַ֣ת עֲצֵי־גֹ֔פֶר קִנִּ֖ים תַּֽעֲשֶׂ֣ה אֶת־הַתֵּבָ֑ה וְכָֽפַרְתָּ֥ אֹתָ֛הּ מִבַּ֥יִת וּמִח֖וּץ בַּכֹּֽפֶר׃',
            transliteration: "Asé lejá tevat atzei gófer, kinim ta'asé et hatevá, vejafartá otah mibáyit umijutz bakofer.",
            spanish: 'Hazte una Tevá (Arca) de madera de gófer; harás compartimentos en la Tevá y la calafatearás con brea por dentro y por fuera.'
          }
        ]
      },
      {
        aliyahNumber: 2,
        nameHebrew: 'שֵׁנִי',
        nameSpanish: '2ª Aliyá (Shení)',
        refRange: 'Génesis 7:1–7:16',
        verses: [
          {
            verseNumber: 1,
            verseKey: 'Génesis 7:1',
            hebrew: 'וַיֹּ֤אמֶר יְהֹוָה֙ לְנֹ֔חַ בֹּֽא־אַתָּ֥ה וְכׇל־בֵּיתְךָ֖ אֶל־הַתֵּבָ֑ה כִּֽי־אֹתְךָ֥ רָאִ֛יתִי צַדִּ֥יק לְפָנַ֖י בַּדּ֥וֹר הַזֶּֽה׃',
            transliteration: "Vayomer YHVH leNoaj: bo atá vejol beitjá el hatevá, ki otjá ra'iti tzadik lefanai bador hazé.",
            spanish: 'Y dijo YHVH a Noaj: Entra tú y toda tu casa en la Tevá, porque a ti te he visto justo delante de Mí en esta generación.'
          },
          {
            verseNumber: 2,
            verseKey: 'Génesis 7:2',
            hebrew: 'מִכֹּ֣ל ׀ הַבְּהֵמָ֣ה הַטְּהוֹרָ֗ה תִּֽקַּח־לְךָ֛ שִׁבְעָ֥ה שִׁבְעָ֖ה אִ֣ישׁ וְאִשְׁתּ֑וֹ וּמִן־הַבְּהֵמָ֡ה אֲ֠שֶׁ֠ר לֹ֣א טְהֹרָ֥ה הִ֛וא שְׁנַ֖יִם אִ֥ישׁ וְאִשְׁתּֽוֹ׃',
            transliteration: "Mikol habehemá hatehorá tikaj lejá shiv'á shiv'á, ish ve'ishto; umin habehemá asher lo tehorá hi, shnáyim ish ve'ishto.",
            spanish: 'De todo animal puro tomarás siete parejas, macho y su hembra; y de los animales que no son puros, dos, macho y su hembra.'
          }
        ]
      },
      {
        aliyahNumber: 3,
        nameHebrew: 'שְׁלִישִׁי',
        nameSpanish: '3ª Aliyá (Shlishí)',
        refRange: 'Génesis 7:17–8:14',
        verses: [
          {
            verseNumber: 17,
            verseKey: 'Génesis 7:17',
            hebrew: 'וַיְהִ֥י הַמַּבּ֛וּל אַרְבָּעִ֥ים י֖וֹם עַל־הָאָ֑רֶץ וַיִּרְבּ֣וּ הַמַּ֗יִם וַיִּשְׂאUnit אֶת־הַתֵּבָ֔ה וַתָּ֖רׇם מֵעַ֥ל הָאָֽרֶץ׃',
            transliteration: "Vayehí hamabul arba'im yom al ha'aretz, vayirbú hamáyim vayis'ú et hatevá, vatárom me'al ha'aretz.",
            spanish: 'Y vino el diluvio cuarenta días sobre la tierra; y las aguas crecieron y alzaron la Tevá, y se elevó por encima de la tierra.'
          }
        ]
      },
      {
        aliyahNumber: 4,
        nameHebrew: 'רְבִיעִי',
        nameSpanish: '4ª Aliyá (Revií)',
        refRange: 'Génesis 8:15–9:7',
        verses: [
          {
            verseNumber: 15,
            verseKey: 'Génesis 8:15',
            hebrew: 'וַיְדַבֵּ֥ר אֱלֹהִ֖ים אֶל־נֹ֥חַ לֵאמֹֽר׃',
            transliteration: "Vayedaber Elohim el Noaj lemor:",
            spanish: 'Y habló Elohim a Noaj, diciendo:'
          },
          {
            verseNumber: 16,
            verseKey: 'Génesis 8:16',
            hebrew: 'צֵ֖א מִן־הַתֵּבָ֑ה אַתָּ֕ה וְאִשְׁתְּךָ֛ וּבָנֶ֥יךָ וּנְשֵֽׁי־בָנֶ֖יךָ אִתָּֽךְ׃',
            transliteration: "Tzé min hatevá, atá ve'ishtejá uvanéija unshei vanéija itaj.",
            spanish: 'Sal de la Tevá, tú, tu esposa, tus hijos y las esposas de tus hijos contigo.'
          }
        ]
      },
      {
        aliyahNumber: 5,
        nameHebrew: 'חֲמִישִׁי',
        nameSpanish: '5ª Aliyá (Jamishí)',
        refRange: 'Génesis 9:8–9:17',
        verses: [
          {
            verseNumber: 8,
            verseKey: 'Génesis 9:8',
            hebrew: 'וַיֹּ֤אמֶר אֱלֹהִים֙ אֶל־נֹ֔חַ וְאֶל־בָּנָ֥יו אִתּ֖וֹ לֵאמֹֽר׃',
            transliteration: "Vayomer Elohim el Noaj ve'el banav ito lemor:",
            spanish: 'Y habló Elohim a Noaj y a sus hijos con él, diciendo:'
          },
          {
            verseNumber: 13,
            verseKey: 'Génesis 9:13',
            hebrew: 'אֶת־קַשְׁתִּ֕י נָתַ֖תִּי בֶּֽעָנָ֑ן וְהָֽיְתָה֙ לְא֣וֹת בְּרִ֔ית בֵּינִ֖י וּבֵ֥ין הָאָֽרֶץ׃',
            transliteration: "Et kashti natati be'anán, vehayetá le'ot berit beini uvein ha'aretz.",
            spanish: 'Mi arco he puesto en las nubes, el cual será por señal de pacto entre Mí y la tierra.'
          }
        ]
      },
      {
        aliyahNumber: 6,
        nameHebrew: 'שִׁשִּׁי',
        nameSpanish: '6ª Aliyá (Shishí)',
        refRange: 'Génesis 9:18–10:32',
        verses: [
          {
            verseNumber: 18,
            verseKey: 'Génesis 9:18',
            hebrew: 'וַיִּֽהְי֣וּ בְנֵי־נֹ֗חַ הַיֹּֽצְאִים֙ מִן־הַתֵּבָ֔ה שֵׁ֖ם וְחָ֣ם וָיָ֑פֶת וְחָ֕ם ה֖וּא אֲבִ֥י כְנָֽעַן׃',
            transliteration: "Vayihyú vnei Noaj hayotz'im min hatevá: Shem, veJam vaYáfet; veJam hu aví Jená'an.",
            spanish: 'Y los hijos de Noaj que salieron de la Tevá fueron Shem, Jam y Yáfet; y Jam es el padre de Kenáan.'
          }
        ]
      },
      {
        aliyahNumber: 7,
        nameHebrew: 'שְׁבִיעִי',
        nameSpanish: '7ª Aliyá (Shevií)',
        refRange: 'Génesis 11:1–11:32',
        verses: [
          {
            verseNumber: 1,
            verseKey: 'Génesis 11:1',
            hebrew: 'וַֽיְהִ֥י כׇל־הָאָ֖רֶץ שָׂפָ֣ה אֶחָ֑ת וּדְבָרִ֖ים אֲחָדִֽים׃',
            transliteration: "Vayehí jol ha'aretz safá ejat udevorim ajadim.",
            spanish: 'Y tenía entonces toda la tierra una sola lengua y unas mismas palabras.'
          },
          {
            verseNumber: 9,
            verseKey: 'Génesis 11:9',
            hebrew: 'עַל־כֵּ֞ן קָרָ֤א שְׁמָהּ֙ בָּבֶ֔ל כִּי־שָׁ֛ם בָּלַ֥ל יְהֹוָ֖ה שְׂפַ֣ת כׇּל־הָאָ֑רֶץ וּמִשָּׁם֙ הֱפִיצָ֣ם יְהֹוָ֔ה עַל־פְּנֵ֖י כׇּל־הָאָֽרֶץ׃',
            transliteration: "Al ken qara shemah Bavel, ki sham balal YHVH sefat kol ha'aretz, umisham hefitzam YHVH al pnei kol ha'aretz.",
            spanish: 'Por esto fue llamado su nombre Bavel, porque allí confundió YHVH el lenguaje de toda la tierra, y desde allí los esparció YHVH sobre la faz de toda la tierra.'
          }
        ]
      }
    ]
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
    // Verificar si la fecha grabada coincide con hoy
    if (record.dateKey === schedule.dateKey) {
      // Si hoy es Shabat mañana (0), verificar si leyó la parashá completa
      if (schedule.targetAliyahNumber === 0) {
        return record.completedFull === true || record.completedAliyah === 0;
      }
      // Si es un día ordinario, verificar si leyó la aliyá que correspondía hoy
      return record.completedAliyah === schedule.targetAliyahNumber || record.completedFull === true;
    }
  } catch (e) {
    console.warn('Error leyendo registro diario de lectura:', e);
  }

  return false;
}

/**
 * Marca la Aliyá de hoy (o la parashá completa) como leída hoy.
 * Esto hace que el widget de inicio se oculte inmediatamente.
 */
export async function markDailyAliyahCompletedToday(
  aliyahNumber: number,
  parashaId: string,
  userId?: string
): Promise<void> {
  if (typeof window === 'undefined') return;

  const schedule = getDiasporaDailySchedule();
  const storageKey = `${DAILY_READ_KEY}_${userId || 'guest'}`;

  const record = {
    dateKey: schedule.dateKey,
    parashaId,
    completedAliyah: aliyahNumber,
    completedFull: aliyahNumber === 0,
    timestamp: Date.now(),
  };

  // 1. Guardar en LocalStorage para actualización instantánea de la UI
  localStorage.setItem(storageKey, JSON.stringify(record));

  // 2. Actualizar el mapa general de progreso de la Parashá
  const progressKey = `${PARASHA_PROGRESS_PREFIX}${parashaId}_${userId || 'guest'}`;
  let progress: ParashaProgress = {
    parasha_id: parashaId,
    completed_aliyot: [],
    full_parasha_completed: false,
    last_read_at: new Date().toISOString(),
  };

  const cachedProg = localStorage.getItem(progressKey);
  if (cachedProg) {
    try {
      progress = JSON.parse(cachedProg);
    } catch {}
  }

  if (aliyahNumber === 0) {
    progress.full_parasha_completed = true;
    progress.completed_aliyot = [1, 2, 3, 4, 5, 6, 7];
  } else if (!progress.completed_aliyot.includes(aliyahNumber)) {
    progress.completed_aliyot.push(aliyahNumber);
  }
  progress.last_read_at = new Date().toISOString();

  localStorage.setItem(progressKey, JSON.stringify(progress));

  // 3. Sincronizar en Supabase si hay usuario activo
  if (userId) {
    try {
      await supabase.from('parasha_progress').upsert({
        user_id: userId,
        parasha_id: parashaId,
        completed_aliyot: progress.completed_aliyot,
        is_completed: progress.full_parasha_completed,
        last_read_at: progress.last_read_at,
        date_key: schedule.dateKey,
      });
    } catch (err) {
      console.warn('Nota: Progreso de Parashá guardado localmente (Supabase:', err, ')');
    }
  }

  // Notificar al sistema para actualizar el widget de inicio en tiempo real
  window.dispatchEvent(new CustomEvent('parasha_progress_updated'));
}

/**
 * Obtiene el progreso general de la parashá actual
 */
export function getParashaProgress(parashaId: string, userId?: string): ParashaProgress {
  const defaultProg: ParashaProgress = {
    parasha_id: parashaId,
    completed_aliyot: [],
    full_parasha_completed: false,
  };

  if (typeof window === 'undefined') return defaultProg;

  const progressKey = `${PARASHA_PROGRESS_PREFIX}${parashaId}_${userId || 'guest'}`;
  const stored = localStorage.getItem(progressKey);
  if (!stored) return defaultProg;

  try {
    return JSON.parse(stored);
  } catch {
    return defaultProg;
  }
}
