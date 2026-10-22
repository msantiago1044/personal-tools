import { WeeklyParasha, WeekdayReading } from '../types';

/**
 * Catálogo de lecturas públicas de Torá para Días de Semana (Lunes, Jueves y Shabat Minjá).
 * En la liturgia judía, se leen 3 Aliyot de la porción semanal:
 * 1. Cohén (כֹּהֵן)
 * 2. Leví (לֵוִי)
 * 3. Israel (יִשְׂרָאֵל)
 * 
 * En la mayoría de las parashot, toda la lectura de días de semana se ubica dentro de la 1ª Aliyá (Rishón).
 * En parashot con una 1ª Aliyá corta (ej. Nitzavim, Vayeilej), la lectura se extiende a la 2ª Aliyá (Shení).
 */
export const WEEKDAY_READINGS_CATALOG: Record<string, WeekdayReading> = {
  // Bereshit / Génesis
  bereshit: {
    ref: 'Génesis 1:1–2:3',
    spansAliyot: [1],
    cohen: {
      type: 'cohen',
      nameHebrew: 'כֹּהֵן',
      nameSpanish: 'Cohén',
      refRange: 'Génesis 1:1–1:5',
      aliyahNumber: 1,
      startVerseNum: 1,
      endVerseNum: 5,
    },
    levi: {
      type: 'levi',
      nameHebrew: 'לֵוִי',
      nameSpanish: 'Leví',
      refRange: 'Génesis 1:6–1:8',
      aliyahNumber: 1,
      startVerseNum: 6,
      endVerseNum: 8,
    },
    israel: {
      type: 'israel',
      nameHebrew: 'יִשְׂרָאֵל',
      nameSpanish: 'Israel',
      refRange: 'Génesis 1:9–1:13',
      aliyahNumber: 1,
      startVerseNum: 9,
      endVerseNum: 13,
    },
  },

  noach: {
    ref: 'Génesis 6:9–6:22',
    spansAliyot: [1],
    cohen: {
      type: 'cohen',
      nameHebrew: 'כֹּהֵן',
      nameSpanish: 'Cohén',
      refRange: 'Génesis 6:9–6:16',
      aliyahNumber: 1,
      startVerseNum: 9,
      endVerseNum: 16,
    },
    levi: {
      type: 'levi',
      nameHebrew: 'לֵוִי',
      nameSpanish: 'Leví',
      refRange: 'Génesis 6:17–6:19',
      aliyahNumber: 1,
      startVerseNum: 17,
      endVerseNum: 19,
    },
    israel: {
      type: 'israel',
      nameHebrew: 'יִשְׂרָאֵל',
      nameSpanish: 'Israel',
      refRange: 'Génesis 6:20–6:22',
      aliyahNumber: 1,
      startVerseNum: 20,
      endVerseNum: 22,
    },
  },

  lechlecha: {
    ref: 'Génesis 12:1–12:13',
    spansAliyot: [1],
    cohen: {
      type: 'cohen',
      nameHebrew: 'כֹּהֵן',
      nameSpanish: 'Cohén',
      refRange: 'Génesis 12:1–12:3',
      aliyahNumber: 1,
      startVerseNum: 1,
      endVerseNum: 3,
    },
    levi: {
      type: 'levi',
      nameHebrew: 'לֵוִי',
      nameSpanish: 'Leví',
      refRange: 'Génesis 12:4–12:9',
      aliyahNumber: 1,
      startVerseNum: 4,
      endVerseNum: 9,
    },
    israel: {
      type: 'israel',
      nameHebrew: 'יִשְׂרָאֵל',
      nameSpanish: 'Israel',
      refRange: 'Génesis 12:10–12:13',
      aliyahNumber: 1,
      startVerseNum: 10,
      endVerseNum: 13,
    },
  },

  vayera: {
    ref: 'Génesis 18:1–18:14',
    spansAliyot: [1],
    cohen: {
      type: 'cohen',
      nameHebrew: 'כֹּהֵן',
      nameSpanish: 'Cohén',
      refRange: 'Génesis 18:1–18:5',
      aliyahNumber: 1,
      startVerseNum: 1,
      endVerseNum: 5,
    },
    levi: {
      type: 'levi',
      nameHebrew: 'לֵוִי',
      nameSpanish: 'Leví',
      refRange: 'Génesis 18:6–18:8',
      aliyahNumber: 1,
      startVerseNum: 6,
      endVerseNum: 8,
    },
    israel: {
      type: 'israel',
      nameHebrew: 'יִשְׂרָאֵל',
      nameSpanish: 'Israel',
      refRange: 'Génesis 18:9–18:14',
      aliyahNumber: 1,
      startVerseNum: 9,
      endVerseNum: 14,
    },
  },

  chayeisara: {
    ref: 'Génesis 23:1–23:16',
    spansAliyot: [1],
    cohen: {
      type: 'cohen',
      nameHebrew: 'כֹּהֵן',
      nameSpanish: 'Cohén',
      refRange: 'Génesis 23:1–23:4',
      aliyahNumber: 1,
      startVerseNum: 1,
      endVerseNum: 4,
    },
    levi: {
      type: 'levi',
      nameHebrew: 'לֵוִי',
      nameSpanish: 'Leví',
      refRange: 'Génesis 23:5–23:11',
      aliyahNumber: 1,
      startVerseNum: 5,
      endVerseNum: 11,
    },
    israel: {
      type: 'israel',
      nameHebrew: 'יִשְׂרָאֵל',
      nameSpanish: 'Israel',
      refRange: 'Génesis 23:12–23:16',
      aliyahNumber: 1,
      startVerseNum: 12,
      endVerseNum: 16,
    },
  },

  toldot: {
    ref: 'Génesis 25:19–26:5',
    spansAliyot: [1],
    cohen: {
      type: 'cohen',
      nameHebrew: 'כֹּהֵן',
      nameSpanish: 'Cohén',
      refRange: 'Génesis 25:19–25:22',
      aliyahNumber: 1,
      startVerseNum: 19,
      endVerseNum: 22,
    },
    levi: {
      type: 'levi',
      nameHebrew: 'לֵוִי',
      nameSpanish: 'Leví',
      refRange: 'Génesis 25:23–25:26',
      aliyahNumber: 1,
      startVerseNum: 23,
      endVerseNum: 26,
    },
    israel: {
      type: 'israel',
      nameHebrew: 'יִשְׂרָאֵל',
      nameSpanish: 'Israel',
      refRange: 'Génesis 25:27–26:5',
      aliyahNumber: 1,
      startVerseNum: 27,
      endVerseNum: 5,
    },
  },

  // Parashot con extensión a la 2ª Aliyá
  nitzavim: {
    ref: 'Deuteronomio 29:9–29:28',
    spansAliyot: [1, 2],
    cohen: {
      type: 'cohen',
      nameHebrew: 'כֹּהֵן',
      nameSpanish: 'Cohén',
      refRange: 'Deuteronomio 29:9–29:11',
      aliyahNumber: 1,
      startVerseNum: 9,
      endVerseNum: 11,
    },
    levi: {
      type: 'levi',
      nameHebrew: 'לֵוִי',
      nameSpanish: 'Leví',
      refRange: 'Deuteronomio 29:12–29:14',
      aliyahNumber: 2,
      startVerseNum: 12,
      endVerseNum: 14,
    },
    israel: {
      type: 'israel',
      nameHebrew: 'יִשְׂרָאֵל',
      nameSpanish: 'Israel',
      refRange: 'Deuteronomio 29:15–29:28',
      aliyahNumber: 2,
      startVerseNum: 15,
      endVerseNum: 28,
    },
  },

  vayeilech: {
    ref: 'Deuteronomio 31:1–31:6',
    spansAliyot: [1, 2],
    cohen: {
      type: 'cohen',
      nameHebrew: 'כֹּהֵן',
      nameSpanish: 'Cohén',
      refRange: 'Deuteronomio 31:1–31:3',
      aliyahNumber: 1,
      startVerseNum: 1,
      endVerseNum: 3,
    },
    levi: {
      type: 'levi',
      nameHebrew: 'לֵוִי',
      nameSpanish: 'Leví',
      refRange: 'Deuteronomio 31:4–31:6',
      aliyahNumber: 2,
      startVerseNum: 4,
      endVerseNum: 6,
    },
    israel: {
      type: 'israel',
      nameHebrew: 'יִשְׂרָאֵל',
      nameSpanish: 'Israel',
      refRange: 'Deuteronomio 31:7–31:9',
      aliyahNumber: 2,
      startVerseNum: 7,
      endVerseNum: 9,
    },
  },
};

/**
 * Normaliza la clave o nombre de la parashá para búsqueda en el catálogo.
 */
export function normalizeParashaKey(keyOrName: string): string {
  if (!keyOrName) return '';
  return keyOrName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Obtiene la estructura de lectura de días de semana para una parashá.
 */
export function getWeekdayReadingForParasha(keyOrName: string): WeekdayReading | null {
  const norm = normalizeParashaKey(keyOrName);
  if (WEEKDAY_READINGS_CATALOG[norm]) {
    return WEEKDAY_READINGS_CATALOG[norm];
  }

  // Comprobar sinónimos habituales
  if (norm.includes('lech') || norm.includes('lej')) {
    return WEEKDAY_READINGS_CATALOG.lechlecha;
  }
  if (norm.includes('noa')) {
    return WEEKDAY_READINGS_CATALOG.noach;
  }
  if (norm.includes('beresh') || norm.includes('genesis')) {
    return WEEKDAY_READINGS_CATALOG.bereshit;
  }
  if (norm.includes('nitzav')) {
    return WEEKDAY_READINGS_CATALOG.nitzavim;
  }
  if (norm.includes('vayeil') || norm.includes('vayele')) {
    return WEEKDAY_READINGS_CATALOG.vayeilech;
  }

  return null;
}

/**
 * Genera o ajusta automáticamente la anotación de la lectura de días de semana
 * (Cohén, Leví, Israel) en los versículos y aliyot de una Parashá.
 */
export function annotateParashaWithWeekdayReading(parasha: WeeklyParasha): WeeklyParasha {
  if (!parasha || !parasha.aliyot || parasha.aliyot.length === 0) {
    return parasha;
  }

  let weekdayReading = parasha.weekdayReading || getWeekdayReadingForParasha(parasha.id || parasha.nameSpanish);

  // Si no está en el catálogo, deducir halájicamente según la longitud de la 1ª Aliyá
  if (!weekdayReading) {
    const aliyah1 = parasha.aliyot[0];
    const versesCount1 = aliyah1?.verses?.length || 0;

    if (versesCount1 >= 10) {
      // Todos los 10+ versículos caben dentro de la 1ª Aliyá
      const cEnd = Math.max(3, Math.floor(versesCount1 * 0.35));
      const lEnd = Math.max(cEnd + 3, Math.floor(versesCount1 * 0.70));
      const firstV = aliyah1.verses[0]?.verseNumber || 1;

      weekdayReading = {
        ref: `${parasha.bookSpanish} (1ª Aliyá)`,
        spansAliyot: [1],
        cohen: {
          type: 'cohen',
          nameHebrew: 'כֹּהֵן',
          nameSpanish: 'Cohén',
          refRange: `${aliyah1.refRange} (v. ${firstV}–${aliyah1.verses[cEnd - 1]?.verseNumber || cEnd})`,
          aliyahNumber: 1,
          startVerseNum: firstV,
          endVerseNum: aliyah1.verses[cEnd - 1]?.verseNumber || cEnd,
        },
        levi: {
          type: 'levi',
          nameHebrew: 'לֵוִי',
          nameSpanish: 'Leví',
          refRange: `${aliyah1.refRange} (v. ${aliyah1.verses[cEnd]?.verseNumber || (cEnd + 1)}–${aliyah1.verses[lEnd - 1]?.verseNumber || lEnd})`,
          aliyahNumber: 1,
          startVerseNum: aliyah1.verses[cEnd]?.verseNumber || (cEnd + 1),
          endVerseNum: aliyah1.verses[lEnd - 1]?.verseNumber || lEnd,
        },
        israel: {
          type: 'israel',
          nameHebrew: 'יִשְׂרָאֵל',
          nameSpanish: 'Israel',
          refRange: `${aliyah1.refRange} (v. ${aliyah1.verses[lEnd]?.verseNumber || (lEnd + 1)}–${aliyah1.verses[versesCount1 - 1]?.verseNumber || versesCount1})`,
          aliyahNumber: 1,
          startVerseNum: aliyah1.verses[lEnd]?.verseNumber || (lEnd + 1),
          endVerseNum: aliyah1.verses[versesCount1 - 1]?.verseNumber || versesCount1,
        },
      };
    } else if (parasha.aliyot.length > 1) {
      // 1ª Aliyá corta: abarca 1ª y 2ª Aliyá
      const aliyah2 = parasha.aliyot[1];
      const versesCount2 = aliyah2?.verses?.length || 0;
      const lEnd2 = Math.min(versesCount2, 3);

      weekdayReading = {
        ref: `${parasha.bookSpanish} (1ª y 2ª Aliyá)`,
        spansAliyot: [1, 2],
        cohen: {
          type: 'cohen',
          nameHebrew: 'כֹּהֵן',
          nameSpanish: 'Cohén',
          refRange: aliyah1.refRange,
          aliyahNumber: 1,
          startVerseNum: aliyah1.verses[0]?.verseNumber || 1,
          endVerseNum: aliyah1.verses[versesCount1 - 1]?.verseNumber || versesCount1,
        },
        levi: {
          type: 'levi',
          nameHebrew: 'לֵוִי',
          nameSpanish: 'Leví',
          refRange: `${aliyah2.refRange} (primeros versículos)`,
          aliyahNumber: 2,
          startVerseNum: aliyah2.verses[0]?.verseNumber || 1,
          endVerseNum: aliyah2.verses[lEnd2 - 1]?.verseNumber || lEnd2,
        },
        israel: {
          type: 'israel',
          nameHebrew: 'יִשְׂרָאֵל',
          nameSpanish: 'Israel',
          refRange: `${aliyah2.refRange} (continuación)`,
          aliyahNumber: 2,
          startVerseNum: aliyah2.verses[lEnd2]?.verseNumber || (lEnd2 + 1),
          endVerseNum: aliyah2.verses[versesCount2 - 1]?.verseNumber || versesCount2,
        },
      };
    }
  }

  if (!weekdayReading) {
    return parasha;
  }

  parasha.weekdayReading = weekdayReading;

  // Anotar cada Aliyá y sus versículos
  parasha.aliyot = parasha.aliyot.map((al) => {
    const isAliyahInvolved = weekdayReading!.spansAliyot.includes(al.aliyahNumber);
    if (!isAliyahInvolved) {
      return { ...al, hasWeekdayReading: false };
    }

    const { cohen, levi, israel } = weekdayReading!;

    // Identificar versículos correspondientes
    const annotatedVerses = al.verses.map((verse, vIdx) => {
      let weekdayAliyah: 'cohen' | 'levi' | 'israel' | undefined = undefined;
      let isWeekdayStart: 'cohen' | 'levi' | 'israel' | undefined = undefined;
      let isWeekdayEnd = false;

      if (al.aliyahNumber === cohen.aliyahNumber && verse.verseNumber >= cohen.startVerseNum && verse.verseNumber <= cohen.endVerseNum) {
        weekdayAliyah = 'cohen';
        if (verse.verseNumber === cohen.startVerseNum || vIdx === 0) {
          isWeekdayStart = 'cohen';
        }
      } else if (al.aliyahNumber === levi.aliyahNumber && verse.verseNumber >= levi.startVerseNum && verse.verseNumber <= levi.endVerseNum) {
        weekdayAliyah = 'levi';
        if (verse.verseNumber === levi.startVerseNum) {
          isWeekdayStart = 'levi';
        }
      } else if (al.aliyahNumber === israel.aliyahNumber && verse.verseNumber >= israel.startVerseNum && verse.verseNumber <= israel.endVerseNum) {
        weekdayAliyah = 'israel';
        if (verse.verseNumber === israel.startVerseNum) {
          isWeekdayStart = 'israel';
        }
        if (verse.verseNumber === israel.endVerseNum) {
          isWeekdayEnd = true;
        }
      }

      return {
        ...verse,
        weekdayAliyah: weekdayAliyah || verse.weekdayAliyah,
        isWeekdayStart: isWeekdayStart || verse.isWeekdayStart,
        isWeekdayEnd: isWeekdayEnd || verse.isWeekdayEnd,
      };
    });

    return {
      ...al,
      hasWeekdayReading: true,
      verses: annotatedVerses,
    };
  });

  return parasha;
}
