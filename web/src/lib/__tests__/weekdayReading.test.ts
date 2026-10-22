import { describe, it, expect } from 'vitest';
import {
  getWeekdayReadingForParasha,
  annotateParashaWithWeekdayReading,
  normalizeParashaKey,
} from '../../../../packages/shared/src/data/weekdayTorahReadings';
import { PARASHAT_NOACH_DATA } from '../../../../packages/shared/src/data/parashatNoachData';
import { PARASHAT_LECH_LECHA_DATA } from '../../../../packages/shared/src/data/parashatLechLechaData';
import { WeeklyParasha } from '../../../../packages/shared/src/types';

describe('Lectura de Torá para Días de Semana (Cohén, Leví, Israel)', () => {
  it('normaliza nombres de parashá correctamente con acentos y mayúsculas', () => {
    expect(normalizeParashaKey('Noaj')).toBe('noaj');
    expect(normalizeParashaKey('Lej-Lejá')).toBe('lejleja');
    expect(normalizeParashaKey('Lech-Lecha')).toBe('lechlecha');
  });

  it('obtiene la estructura de lectura de días de semana para Noaj', () => {
    const reading = getWeekdayReadingForParasha('Noaj');
    expect(reading).toBeDefined();
    expect(reading?.spansAliyot).toEqual([1]);
    expect(reading?.cohen.nameHebrew).toBe('כֹּהֵן');
    expect(reading?.cohen.startVerseNum).toBe(9);
    expect(reading?.cohen.endVerseNum).toBe(16);
    expect(reading?.levi.nameHebrew).toBe('לֵוִי');
    expect(reading?.levi.startVerseNum).toBe(17);
    expect(reading?.levi.endVerseNum).toBe(19);
    expect(reading?.israel.nameHebrew).toBe('יִשְׂרָאֵל');
    expect(reading?.israel.startVerseNum).toBe(20);
    expect(reading?.israel.endVerseNum).toBe(22);
  });

  it('obtiene la estructura de lectura de días de semana para Lej-Lejá', () => {
    const reading = getWeekdayReadingForParasha('Lej-Lejá');
    expect(reading).toBeDefined();
    expect(reading?.spansAliyot).toEqual([1]);
    expect(reading?.cohen.startVerseNum).toBe(1);
    expect(reading?.cohen.endVerseNum).toBe(3);
    expect(reading?.levi.startVerseNum).toBe(4);
    expect(reading?.levi.endVerseNum).toBe(9);
    expect(reading?.israel.startVerseNum).toBe(10);
    expect(reading?.israel.endVerseNum).toBe(13);
  });

  it('identifica parashot donde la lectura de semana se extiende a la 2ª Aliyá (Nitzavim / Vayeilej)', () => {
    const nitzavim = getWeekdayReadingForParasha('Nitzavim');
    expect(nitzavim).toBeDefined();
    expect(nitzavim?.spansAliyot).toEqual([1, 2]);
    expect(nitzavim?.cohen.aliyahNumber).toBe(1);
    expect(nitzavim?.levi.aliyahNumber).toBe(2);
    expect(nitzavim?.israel.aliyahNumber).toBe(2);

    const vayeilech = getWeekdayReadingForParasha('Vayeilech');
    expect(vayeilech).toBeDefined();
    expect(vayeilech?.spansAliyot).toEqual([1, 2]);
  });

  it('anota correctamente la parashá Noaj con Cohén, Leví e Israel', () => {
    const annotated = annotateParashaWithWeekdayReading(PARASHAT_NOACH_DATA);
    expect(annotated.weekdayReading).toBeDefined();

    const aliyah1 = annotated.aliyot[0];
    expect(aliyah1.hasWeekdayReading).toBe(true);

    // Versículo 9 (primero de Cohén)
    const v9 = aliyah1.verses.find((v) => v.verseNumber === 9);
    expect(v9?.weekdayAliyah).toBe('cohen');
    expect(v9?.isWeekdayStart).toBe('cohen');

    // Versículo 16 (último de Cohén)
    const v16 = aliyah1.verses.find((v) => v.verseNumber === 16);
    expect(v16?.weekdayAliyah).toBe('cohen');

    // Versículo 17 (primero de Leví)
    const v17 = aliyah1.verses.find((v) => v.verseNumber === 17);
    expect(v17?.weekdayAliyah).toBe('levi');
    expect(v17?.isWeekdayStart).toBe('levi');

    // Versículo 20 (primero de Israel)
    const v20 = aliyah1.verses.find((v) => v.verseNumber === 20);
    expect(v20?.weekdayAliyah).toBe('israel');
    expect(v20?.isWeekdayStart).toBe('israel');

    // Versículo 22 (último de Israel y fin de lectura de semana)
    const v22 = aliyah1.verses.find((v) => v.verseNumber === 22);
    expect(v22?.weekdayAliyah).toBe('israel');
    expect(v22?.isWeekdayEnd).toBe(true);
  });

  it('anota correctamente la parashá Lej-Lejá con Cohén, Leví e Israel', () => {
    const annotated = annotateParashaWithWeekdayReading(PARASHAT_LECH_LECHA_DATA);
    expect(annotated.weekdayReading).toBeDefined();

    const aliyah1 = annotated.aliyot[0];
    expect(aliyah1.hasWeekdayReading).toBe(true);

    const v1 = aliyah1.verses.find((v) => v.verseNumber === 1);
    expect(v1?.weekdayAliyah).toBe('cohen');
    expect(v1?.isWeekdayStart).toBe('cohen');

    const v4 = aliyah1.verses.find((v) => v.verseNumber === 4);
    expect(v4?.weekdayAliyah).toBe('levi');
    expect(v4?.isWeekdayStart).toBe('levi');

    const v10 = aliyah1.verses.find((v) => v.verseNumber === 10);
    expect(v10?.weekdayAliyah).toBe('israel');
    expect(v10?.isWeekdayStart).toBe('israel');

    const v13 = aliyah1.verses.find((v) => v.verseNumber === 13);
    expect(v13?.weekdayAliyah).toBe('israel');
    expect(v13?.isWeekdayEnd).toBe(true);
  });

  it('deduce dinámicamente la lectura cuando la 1ª Aliyá es corta y se extiende a la 2ª Aliyá', () => {
    const mockParasha: WeeklyParasha = {
      id: 'custom_short',
      nameHebrew: 'קְצָרָה',
      nameSpanish: 'Corta',
      book: 'Deuteronomy',
      bookSpanish: 'Devarim',
      ref: 'Devarim 1:1–2:10',
      aliyot: [
        {
          aliyahNumber: 1,
          nameHebrew: 'רִאשׁוֹן',
          nameSpanish: '1ª Aliyá',
          refRange: 'Devarim 1:1–1:3',
          verses: [
            { verseNumber: 1, verseKey: '1:1', hebrew: 'א', transliteration: 'a', spanish: 'uno' },
            { verseNumber: 2, verseKey: '1:2', hebrew: 'ב', transliteration: 'b', spanish: 'dos' },
            { verseNumber: 3, verseKey: '1:3', hebrew: 'ג', transliteration: 'c', spanish: 'tres' },
          ],
        },
        {
          aliyahNumber: 2,
          nameHebrew: 'שֵׁנִי',
          nameSpanish: '2ª Aliyá',
          refRange: 'Devarim 1:4–1:15',
          verses: [
            { verseNumber: 4, verseKey: '1:4', hebrew: 'ד', transliteration: 'd', spanish: 'cuatro' },
            { verseNumber: 5, verseKey: '1:5', hebrew: 'ה', transliteration: 'e', spanish: 'cinco' },
            { verseNumber: 6, verseKey: '1:6', hebrew: 'ו', transliteration: 'f', spanish: 'seis' },
            { verseNumber: 7, verseKey: '1:7', hebrew: 'ז', transliteration: 'g', spanish: 'siete' },
            { verseNumber: 8, verseKey: '1:8', hebrew: 'ח', transliteration: 'h', spanish: 'ocho' },
            { verseNumber: 9, verseKey: '1:9', hebrew: 'ט', transliteration: 'i', spanish: 'nueve' },
            { verseNumber: 10, verseKey: '1:10', hebrew: 'י', transliteration: 'j', spanish: 'diez' },
          ],
        },
      ],
    };

    const annotated = annotateParashaWithWeekdayReading(mockParasha);
    expect(annotated.weekdayReading).toBeDefined();
    expect(annotated.weekdayReading?.spansAliyot).toEqual([1, 2]);
    expect(annotated.aliyot[0].hasWeekdayReading).toBe(true);
    expect(annotated.aliyot[1].hasWeekdayReading).toBe(true);
    expect(annotated.aliyot[0].verses[0].weekdayAliyah).toBe('cohen');
    expect(annotated.aliyot[1].verses[0].weekdayAliyah).toBe('levi');
  });
});
