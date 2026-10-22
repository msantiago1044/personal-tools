import { describe, it, expect } from 'vitest';
import { PARASHAT_LECH_LECHA_DATA } from '../../../../packages/shared/src/data/parashatLechLechaData';
import { PARASHAT_NOACH_DATA } from '../../../../packages/shared/src/data/parashatNoachData';

describe('Auditoría e Integridad de Fonética en Parashiot', () => {
  it('garantiza que Parashat Lej-Lejá no contiene corrupciones ni errores en el Tetragrámaton', () => {
    let totalVerses = 0;
    for (const aliyah of PARASHAT_LECH_LECHA_DATA.aliyot) {
      for (const v of aliyah.verses) {
        totalVerses++;
        expect(v.transliteration).toBeTruthy();
        expect(v.transliteration).not.toContain('yehovah');
        expect(v.transliteration).not.toContain('bmimvoladeteja');
        expect(v.transliteration).not.toContain('bmibeyt');
        expect(v.transliteration).not.toContain('rejbsham');
        expect(v.transliteration).not.toContain('veniverejb');
        expect(v.transliteration).not.toContain('gadvol');
        expect(v.transliteration).not.toContain('lvot');
        expect(v.transliteration).not.toContain('itvo');
      }
    }
    expect(totalVerses).toBeGreaterThan(50);
  });

  it('garantiza que Génesis 12:1 translitera con YHVH y fonética sefardí limpia', () => {
    const v1 = PARASHAT_LECH_LECHA_DATA.aliyot[0].verses[0];
    expect(v1.verseKey).toBe('Génesis 12:1');
    expect(v1.transliteration).toContain('Vayómer YHVH');
    expect(v1.transliteration).toContain('el-Avrám');
    expect(v1.transliteration).toContain('Lej-lejá');
    expect(v1.transliteration).toContain('umimoladteja');
    expect(v1.transliteration).toContain('umibeit');
    expect(v1.transliteration).toContain('avija');
  });

  it('garantiza que Parashat Noaj preserva YHVH y fonética sefardí limpia', () => {
    let noachVerses = 0;
    for (const aliyah of PARASHAT_NOACH_DATA.aliyot) {
      for (const v of aliyah.verses) {
        noachVerses++;
        expect(v.transliteration).not.toContain('yehovah');
        expect(v.transliteration).not.toContain('bmim');
      }
    }
    expect(noachVerses).toBeGreaterThan(20);
  });
});
