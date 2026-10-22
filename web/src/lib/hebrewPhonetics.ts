/**
 * hebrewPhonetics.ts
 * Motor avanzado de fonética y transliteración de Hebreo Bíblico a Fonética Sefardí en Español.
 * Especialmente optimizado para lectores hispanohablantes (latinoamericanos) con respeto reverente
 * a los Nombres Sagrados (YHVH, Elohím, Adonái, El Shadái, etc.).
 */

export type SacredNameOption = 'YHVH' | 'Adonai' | 'HaShem';

export interface PhoneticOptions {
  sacredName?: SacredNameOption;
  useTildes?: boolean;
}

// Rangos Unicode Masoréticos
// \u0591-\u05AF: Cantilaciones (Ta'amim / Trope)
// \u05BD: Meteg, \u05BF: Rafe, \u05C0: Paseq, \u05C4-\u05C5: Puntos superiores
const CANTILLATION_REGEX = /[\u0591-\u05AF\u05BD\u05BF\u05C0\u05C4\u05C5]/g;

/**
 * Normaliza y limpia cantilaciones de una palabra o frase hebrea preservando letras y niqqud.
 */
export function stripCantillation(hebrew: string): string {
  if (!hebrew) return '';
  return hebrew.replace(CANTILLATION_REGEX, '');
}

/**
 * Diccionario de Nombres Sagrados y términos de Torá frecuentes para máxima exactitud.
 */
const SACRED_MAP_YHVH: Record<string, string> = {
  // Tetragrámaton solo y con niqqud masorético estándar
  'יהוה': 'YHVH',
  'יְהוָה': 'YHVH',
  'יְהֹוָה': 'YHVH',
  'יֱהֹוִה': 'Elohím', // Qeré cuando va junto a Adonai
  'יֱהוִה': 'Elohím',
  
  // Con prefijos bíblicos
  'וַיהוָה': 'Ve-YHVH',
  'וַיְהֹוָה': 'Ve-YHVH',
  'וַֽיהוָה': 'Ve-YHVH',
  'בַּיהוָה': 'Ba-YHVH',
  'בַּֽיהוָה': 'Ba-YHVH',
  'לַיהוָה': 'La-YHVH',
  'לַֽיהוָה': 'La-YHVH',
  'מֵיהוָה': 'Me-YHVH',
  'מֵֽיהוָה': 'Me-YHVH',
  'כַּיהוָה': 'Ka-YHVH',
  
  // Nombres Divinos
  'אֱלֹהִים': 'Elohím',
  'הָאֱלֹהִים': 'Ha-Elohím',
  'אֱלֹהֵינוּ': 'Elohéinu',
  'אֱלֹהֶיךָ': 'Elohéja',
  'אֱלֹהָיו': 'Elohav',
  'אֱלֹהֵי': 'Elohéi',
  'אֱלוֹהַּ': 'Elóah',
  'אֲדֹנָי': 'Adonái',
  'אֵל': 'El',
  'הָאֵל': 'Ha-El',
  'שַׁדַּי': 'Shadái',
  'אֵל־שַׁדַּי': 'El-Shadái',
  'אֵל שַׁדַּי': 'El Shadái',
  'צְבָאוֹת': 'Tzevaót',
  'יָהּ': 'Yah',
};

const SACRED_MAP_ADONAI: Record<string, string> = {
  ...SACRED_MAP_YHVH,
  'יהוה': 'Adonái',
  'יְהוָה': 'Adonái',
  'יְהֹוָה': 'Adonái',
  'וַיהוָה': 'Va-Adonái',
  'וַיְהֹוָה': 'Va-Adonái',
  'וַֽיהוָה': 'Va-Adonái',
  'בַּיהוָה': 'Ba-Adonái',
  'בַּֽיהוָה': 'Ba-Adonái',
  'לַיהוָה': 'La-Adonái',
  'לַֽיהוָה': 'La-Adonái',
  'מֵיהוָה': 'Me-Adonái',
  'מֵֽיהוָה': 'Me-Adonái',
  'כַּיהוָה': 'Ka-Adonái',
};

const SACRED_MAP_HASHEM: Record<string, string> = {
  ...SACRED_MAP_YHVH,
  'יהוה': 'HaShem',
  'יְהוָה': 'HaShem',
  'יְהֹוָה': 'HaShem',
  'וַיהוָה': 'Ve-HaShem',
  'וַיְהֹוָה': 'Ve-HaShem',
  'וַֽיהוָה': 'Ve-HaShem',
  'בַּיהוָה': 'Ba-HaShem',
  'בַּֽיהוָה': 'Ba-HaShem',
  'לַיהוָה': 'La-HaShem',
  'לַֽיהוָה': 'La-HaShem',
  'מֵיהוָה': 'Me-HaShem',
  'מֵֽיהוָה': 'Me-HaShem',
  'כַּיהוָה': 'Ka-HaShem',
  'אֱלֹהִים': 'Elokím',
  'הָאֱלֹהִים': 'Ha-Elokím',
  'אֱלֹהֵינוּ': 'Elokéinu',
  'אֱלֹהֶיךָ': 'Elokéja',
};

/**
 * Palabras clave y nombres propios con pronunciación y capitalización canónica.
 */
const CANONICAL_WORDS: Record<string, string> = {
  'לֶךְ־לְךָ': 'Lej-lejá',
  'לֶךְ': 'Lej',
  'לְךָ': 'lejá',
  'כׇּל': 'kol',
  'כׇּל': 'kol',
  'כׇל': 'kol',
  'כֹּל': 'kol',
  'כׇּל־': 'kol-',
  'כׇּל־': 'kol-',
  'כׇל־': 'kol-',
  'כֹּל־': 'kol-',
  'אֶת־': 'et-',
  'אֵת': 'et',
  'עַל־': 'al-',
  'אֶל־': 'el-',
  'מִן־': 'min-',
  'בֶּן־': 'ben-',
  'בֶּן־': 'ben-',
  'אַבְרָם': 'Avrám',
  'וְאַבְרָם': 'Ve-Avrám',
  'לְאַבְרָם': 'Le-Avrám',
  'אַבְרָהָם': 'Avrahám',
  'וְאַבְרָהָם': 'Ve-Avrahám',
  'שָׂרָה': 'Saráh',
  'שָׂרַי': 'Sarái',
  'וְשָׂרַי': 'Ve-Sarái',
  'לוֹט': 'Lot',
  'וְלוֹט': 'Ve-Lot',
  'יִצְחָק': 'Yitzják',
  'יַעֲקֹב': 'Yaakóv',
  'יִשְׂרָאֵל': 'Yisraél',
  'וְיִשְׂרָאֵל': 'Ve-Yisraél',
  'נֹחַ': 'Noaj',
  'לְנֹחַ': 'leNoaj',
  'רוּחַ': 'Ruaj',
  'שַׁבָּת': 'Shabát',
  'תּוֹרָה': 'Toráh',
  'שֵׁם': 'Shem',
  'חָם': 'Jam',
  'יָפֶת': 'Yáfet',
  'כְּנַעַן': 'Canaán',
  'כְּנָעַן': 'Canaán',
  'חָרָן': 'Jarán',
  'וַיֹּאמֶר': 'Vayómer',
  'וַיֹּאמֶר': 'Vayómer',
  'וַיֵּלֶךְ': 'Vayélej',
  'וַיֵּצְאוּ': "Vayetz'ú",
  'וַיָּבֹאוּ': "Vayavó'u",
  'וַיִּקַּח': 'Vayikaj',
};

/**
 * Translitera una sola palabra hebrea vocalizada a fonética en español sefardí.
 */
export function transliterateHebrewWord(word: string, options: PhoneticOptions = {}): string {
  const sacredMode = options.sacredName || 'YHVH';
  const cleanWord = stripCantillation(word).trim();
  if (!cleanWord) return '';

  // 1. Detección infalible por esqueleto consonántico del Tetragrámaton y Nombres Sagrados
  // (Inmune a variaciones vocálicas masoréticas como לַיהֹוָה, בַּֽיהוָה, יֱהֹוִה, etc.)
  const consonantsOnly = cleanWord.replace(/[\u0591-\u05C7־\-]/g, '');

  if (consonantsOnly === 'יהוה') {
    return sacredMode === 'YHVH' ? 'YHVH' : sacredMode === 'Adonai' ? 'Adonái' : 'HaShem';
  }
  if (consonantsOnly === 'ויהוה') {
    return sacredMode === 'YHVH' ? 'Ve-YHVH' : sacredMode === 'Adonai' ? 'Va-Adonái' : 'Ve-HaShem';
  }
  if (consonantsOnly === 'ביהוה') {
    return sacredMode === 'YHVH' ? 'Ba-YHVH' : sacredMode === 'Adonai' ? 'Ba-Adonái' : 'Ba-HaShem';
  }
  if (consonantsOnly === 'ליהוה') {
    return sacredMode === 'YHVH' ? 'La-YHVH' : sacredMode === 'Adonai' ? 'La-Adonái' : 'La-HaShem';
  }
  if (consonantsOnly === 'מיהוה') {
    return sacredMode === 'YHVH' ? 'Me-YHVH' : sacredMode === 'Adonai' ? 'Me-Adonái' : 'Me-HaShem';
  }
  if (consonantsOnly === 'כיהוה') {
    return sacredMode === 'YHVH' ? 'Ka-YHVH' : sacredMode === 'Adonai' ? 'Ka-Adonái' : 'Ka-HaShem';
  }

  // Nombres Divinos derivados de Elohim
  if (consonantsOnly === 'אלהים') {
    return sacredMode === 'HaShem' ? 'Elokím' : 'Elohím';
  }
  if (consonantsOnly === 'האלהים') {
    return sacredMode === 'HaShem' ? 'Ha-Elokím' : 'Ha-Elohím';
  }
  if (consonantsOnly === 'ואלהים') {
    return sacredMode === 'HaShem' ? 'Ve-Elokím' : 'Ve-Elohím';
  }
  if (consonantsOnly === 'לאלהים') {
    return sacredMode === 'HaShem' ? 'Le-Elokím' : 'Le-Elohím';
  }
  if (consonantsOnly === 'באלהים') {
    return sacredMode === 'HaShem' ? 'Be-Elokím' : 'Be-Elohím';
  }

  // Detección directa en diccionario de Nombres Sagrados adicionales
  const sacredDict = sacredMode === 'YHVH' ? SACRED_MAP_YHVH : sacredMode === 'Adonai' ? SACRED_MAP_ADONAI : SACRED_MAP_HASHEM;
  if (sacredDict[cleanWord]) {
    return sacredDict[cleanWord];
  }

  // 2. Detección especial de palabras canónicas
  if (CANONICAL_WORDS[cleanWord]) {
    return CANONICAL_WORDS[cleanWord];
  }

  // 3. Motor fonético consonante + niqqud (Sefardí Latino)
  let out = '';
  const len = cleanWord.length;
  let idx = 0;
  let prevSyllableHadSilentSheva = false;

  while (idx < len) {
    const ch = cleanWord[idx];
    const code = ch.charCodeAt(0);

    // Manejo de Maqaf (guión hebreo ־)
    if (ch === '־' || ch === '-') {
      out += '-';
      idx++;
      prevSyllableHadSilentSheva = false;
      continue;
    }

    // A. Shuruq inicial o Vav con Dagesh inicial (U+05D5 + U+05BC)
    // En hebreo bíblico, וּ al inicio de palabra antes de letras labiales (בומף) o shva suena "u" (ej. וּמִמּוֹלַדְתְּךָ -> u-mimoladetejá)
    if (idx === 0 && ch === 'ו' && idx + 1 < len && cleanWord.charCodeAt(idx + 1) === 0x05bc) {
      out += 'u';
      idx += 2;
      continue;
    }

    // B. Letra consonante
    if (code >= 0x05d0 && code <= 0x05ea) {
      let dagesh = false;
      let shinDot = false;
      let sinDot = false;
      let vowels: string[] = [];

      let nextIdx = idx + 1;
      while (nextIdx < len) {
        const nextCh = cleanWord[nextIdx];
        const nextCode = nextCh.charCodeAt(0);
        if (nextCode >= 0x05d0 && nextCode <= 0x05ea || nextCh === '־' || nextCh === '-') {
          break; // Siguiente consonante
        }
        if (nextCode === 0x05bc) {
          dagesh = true;
        } else if (nextCode === 0x05c1) {
          shinDot = true;
        } else if (nextCode === 0x05c2) {
          sinDot = true;
        } else if (nextCode >= 0x05b0 && nextCode <= 0x05bb || nextCode === 0x05c7) {
          vowels.push(nextCh);
        }
        nextIdx++;
      }

      // Última vocal producida en 'out'
      const lastCharOfOut = out.length > 0 ? out[out.length - 1].toLowerCase() : '';
      const outEndsInVowel = /[aeiouáéíóú]/.test(lastCharOfOut);

      // 1. Determinar el sonido de la consonante
      let cSound = '';
      switch (ch) {
        case 'א': // Alef
          // Alef silenciosa (quiescente / mater lectionis):
          // Si no tiene vocales propias y sigue a una vocal (como en וַיֹּאמֶר, לֵאמֹר, רֹאשׁ),
          // o si está al final absoluto de la palabra (בָּרָא, חַטָּאת), es completamente muda.
          if (vowels.length === 0) {
            cSound = '';
          } else {
            cSound = (idx === 0) ? '' : "'";
          }
          break;
        case 'ב': // Bet / Vet
          cSound = dagesh ? 'b' : (idx === 0 ? 'b' : 'v');
          break;
        case 'ג': // Guimel
          cSound = 'g';
          break;
        case 'ד': // Dalet
          cSound = 'd';
          break;
        case 'ה': // He
          cSound = 'h';
          break;
        case 'ו': // Vav
          if (dagesh && vowels.length === 0) {
            // Shuruq como vocal /u/
            cSound = 'u';
          } else if (vowels.includes('\u05B9') || vowels.includes('\u05BA')) {
            // Vav con Jólem como vocal /o/
            cSound = 'o';
            vowels = vowels.filter(v => v !== '\u05B9' && v !== '\u05BA');
          } else {
            cSound = 'v';
          }
          break;
        case 'ז': // Zayin
          cSound = 'z';
          break;
        case 'ח': // Jet
          cSound = 'j';
          break;
        case 'ט': // Tet
          cSound = 't';
          break;
        case 'י': // Yod
          if (vowels.length === 0) {
            // Mater lectionis Yod sin vocal propia:
            if (lastCharOfOut === 'i') {
              // ִ + י = 'i' (ej. שָׁנִים -> shanim, no shaniym)
              cSound = '';
            } else if (lastCharOfOut === 'e') {
              // ֵ + י = 'i' (ej. בֵּית -> beit, no beyit)
              cSound = 'i';
            } else if (lastCharOfOut === 'a') {
              // ַ + י = 'i' (ej. שָׂרַי -> Sarai)
              cSound = 'i';
            } else {
              cSound = 'y';
            }
          } else {
            cSound = 'y';
          }
          break;
        case 'כ':
        case 'ך': // Kaf / Jaf
          cSound = dagesh ? 'k' : 'j';
          break;
        case 'ל': // Lamed
          cSound = 'l';
          break;
        case 'מ':
        case 'ם': // Mem
          cSound = 'm';
          break;
        case 'נ':
        case 'ן': // Nun
          cSound = 'n';
          break;
        case 'ס': // Samej
          cSound = 's';
          break;
        case 'ע': // Ayin
          cSound = "'";
          break;
        case 'פ':
        case 'ף': // Pe / Fe
          cSound = dagesh ? 'p' : 'f';
          break;
        case 'צ':
        case 'ץ': // Tsadi
          cSound = 'tz';
          break;
        case 'ק': // Qof
          cSound = 'k';
          break;
        case 'ר': // Resh
          cSound = 'r';
          break;
        case 'ש': // Shin / Sin
          cSound = sinDot ? 's' : 'sh';
          break;
        case 'ת': // Tav
          cSound = 't';
          break;
        default:
          cSound = '';
          break;
      }

      // Regla de Pataj Furtivo (Patach Genuvah):
      // Si la letra es gutural final (ח, ע, o הּ) y tiene Pataj (\u05B7), la vocal 'a' se pronuncia ANTES de la consonante
      const isWordEnd = nextIdx >= len || cleanWord[nextIdx] === '־' || cleanWord[nextIdx] === '-';
      const hasPatach = vowels.includes('\u05B7');
      if (isWordEnd && hasPatach && (ch === 'ח' || ch === 'ע')) {
        out += 'a' + cSound;
        idx = nextIdx;
        prevSyllableHadSilentSheva = false;
        continue;
      }

      // 2. Determinar la vocal de esta consonante
      let vSound = '';
      let isSilentSheva = false;

      for (const v of vowels) {
        switch (v) {
          case '\u05B0': // Shevá
            // Regla hebrea de dos Shevás consecutivos:
            // Si la consonante previa tuvo un Shevá silencioso (Naj), este segundo Shevá es OBLIGATORIAMENTE vocal (Na' = /e/)
            // Ej: אַרְצְךָ -> r (silencioso) + tz (vocal e) -> artzeja
            // Ej: וּמִמּוֹלַדְתְּךָ -> d (silencioso) + t (vocal e) -> mimoladteja
            if (idx === 0) {
              vSound = 'e';
            } else if (prevSyllableHadSilentSheva) {
              vSound = 'e';
              prevSyllableHadSilentSheva = false;
            } else if (dagesh) {
              // Con dagesh forte el sheva siempre es vocal
              vSound = 'e';
            } else {
              // Sheva intermedio: silencioso (cierre silábico)
              vSound = '';
              isSilentSheva = true;
            }
            break;
          case '\u05B1': // Jataf Segol
          case '\u05B5': // Tzere
          case '\u05B6': // Segol
            vSound = 'e';
            break;
          case '\u05B2': // Jataf Patach
          case '\u05B7': // Patach
          case '\u05B8': // Qamats
            vSound = 'a';
            break;
          case '\u05B3': // Jataf Qamats
          case '\u05B9': // Jólem
          case '\u05BA': // Jólem Jaser
          case '\u05C7': // Qamats Qatán
            vSound = 'o';
            break;
          case '\u05B4': // Chiriq
            vSound = 'i';
            break;
          case '\u05BB': // Qubuts
            vSound = 'u';
            break;
        }
      }

      prevSyllableHadSilentSheva = isSilentSheva;

      // Ajuste para Gimel en español si la vocal es 'e' o 'i' (/ɡ/ en vez de /x/)
      if (cSound === 'g' && (vSound === 'e' || vSound === 'i')) {
        cSound = 'gu';
      }

      // Si la consonante fue Vav y actuó como vocal ('u' o 'o') sin vocal adicional
      if (ch === 'ו' && (cSound === 'u' || cSound === 'o') && !vSound) {
        out += cSound;
      } else {
        out += cSound + vSound;
      }

      idx = nextIdx;
      continue;
    }

    // Carácter no hebreo (espacios, signos de puntuación)
    if (code < 128) {
      out += ch;
    }
    prevSyllableHadSilentSheva = false;
    idx++;
  }

  // Limpieza de dobles apóstrofes o artefactos fonéticos
  out = out.replace(/''+/g, "'");
  out = out.replace(/^'/, ''); // Eliminar apóstrofe inicial si quedó de Alef
  out = out.replace(/-'/g, '-');

  return out;
}

/**
 * Translitera un versículo o texto hebreo vocalizado completo a fonética Sefardí en español.
 */
export function transliterateHebrewToSpanish(hebrewText: string, options: PhoneticOptions = {}): string {
  if (!hebrewText) return '';

  const clean = hebrewText
    .replace(/<[^>]+>/g, '')
    .replace(/&thinsp;/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/[\u200B-\u200F\uFEFF]/g, '') // Caracteres bidi invisibles
    .replace(/\{[פס]\}/g, ''); // Marcas masoréticas de parashá abierta/cerrada

  // Separar respetando espacios y signos de puntuación bíblicos (sof pasuq ׃, paseq ׀)
  const tokens = clean.split(/([ \t\r\n׃׀]+)/);

  const transliteratedTokens = tokens.map((token) => {
    if (!token || /^[ \t\r\n׃׀]+$/.test(token)) {
      if (token === '׃') return '.';
      if (token === '׀') return '';
      return token;
    }

    // Comprobar token completo en diccionario canónico antes de dividir
    const strippedToken = stripCantillation(token);
    if (CANONICAL_WORDS[strippedToken]) {
      return CANONICAL_WORDS[strippedToken];
    }

    // Separar palabras compuestas unidas por Maqaf (־)
    if (token.includes('־')) {
      const parts = token.split('־');
      return parts.map((p) => transliterateHebrewWord(p, options)).join('-');
    }

    return transliterateHebrewWord(token, options);
  });

  let result = transliteratedTokens.join('');

  // Post-procesamiento estético y capitalización de inicio de frase
  result = result
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+\./g, '.')
    .replace(/\s+,/g, ',')
    .trim();

  // Capitalizar la primera letra si no está en mayúscula
  if (result.length > 0) {
    result = result.charAt(0).toUpperCase() + result.slice(1);
  }

  return result;
}
