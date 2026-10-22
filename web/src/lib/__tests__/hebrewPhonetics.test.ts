import { describe, it, expect } from 'vitest';
import {
  transliterateHebrewToSpanish,
  transliterateHebrewWord,
  stripCantillation,
} from '../hebrewPhonetics';

describe('hebrewPhonetics - Motor de Fonética Sefardí en Español', () => {
  it('elimina cantilaciones masoréticas correctamente', () => {
    const raw = 'וַיֹּ֤אמֶר יְהֹוָה֙ אֶל־אַבְרָ֔ם';
    const stripped = stripCantillation(raw);
    expect(stripped).toBe('וַיֹּאמֶר יְהֹוָה אֶל־אַבְרָם');
  });

  describe('Nombres Sagrados y Tetragrámaton', () => {
    it('translitera el Tetragrámaton como YHVH por defecto', () => {
      expect(transliterateHebrewWord('יְהֹוָה', { sacredName: 'YHVH' })).toBe('YHVH');
      expect(transliterateHebrewWord('יְהוָה', { sacredName: 'YHVH' })).toBe('YHVH');
      expect(transliterateHebrewWord('יהוה', { sacredName: 'YHVH' })).toBe('YHVH');
    });

    it('translitera el Tetragrámaton con prefijos bíblicos', () => {
      expect(transliterateHebrewWord('וַיהוָה', { sacredName: 'YHVH' })).toBe('Ve-YHVH');
      expect(transliterateHebrewWord('בַּיהוָה', { sacredName: 'YHVH' })).toBe('Ba-YHVH');
      expect(transliterateHebrewWord('לַיהוָה', { sacredName: 'YHVH' })).toBe('La-YHVH');
      expect(transliterateHebrewWord('מֵיהוָה', { sacredName: 'YHVH' })).toBe('Me-YHVH');
    });

    it('respeta la opción Adonai cuando se solicita', () => {
      expect(transliterateHebrewWord('יְהֹוָה', { sacredName: 'Adonai' })).toBe('Adonái');
      expect(transliterateHebrewWord('וַיהוָה', { sacredName: 'Adonai' })).toBe('Va-Adonái');
    });

    it('respeta la opción HaShem cuando se solicita', () => {
      expect(transliterateHebrewWord('יְהֹוָה', { sacredName: 'HaShem' })).toBe('HaShem');
      expect(transliterateHebrewWord('וַיהוָה', { sacredName: 'HaShem' })).toBe('Ve-HaShem');
      expect(transliterateHebrewWord('אֱלֹהִים', { sacredName: 'HaShem' })).toBe('Elokím');
    });

    it('translitera Nombres Divinos con reverencia y tildes', () => {
      expect(transliterateHebrewWord('אֱלֹהִים')).toBe('Elohím');
      expect(transliterateHebrewWord('הָאֱלֹהִים')).toBe('Ha-Elohím');
      expect(transliterateHebrewWord('אֲדֹנָי')).toBe('Adonái');
      expect(transliterateHebrewWord('שַׁדַּי')).toBe('Shadái');
      expect(transliterateHebrewWord('צְבָאוֹת')).toBe('Tzevaót');
    });
  });

  describe('Corrección de anomalías gramaticales bíblicas', () => {
    it('corrige el Shuruq inicial y no produce la letra "b" absurda', () => {
      // וּמִמּֽוֹלַדְתְּךָ֖ -> no debe ser "bmimvoladeteja"
      const res = transliterateHebrewWord('וּמִמּֽוֹלַדְתְּךָ֖');
      expect(res.startsWith('u')).toBe(true);
      expect(res).not.toContain('bmim');
    });

    it('corrige el Jólem y no inserta falsas "v"', () => {
      // גָּדוֹל -> gadol, no gadvol
      expect(transliterateHebrewWord('גָּד֔וֹל')).toBe('gadol');
      // לוֹט -> Lot, no lvot
      expect(transliterateHebrewWord('ל֑וֹט')).toBe('Lot');
      // אִתּוֹ -> ito, no itvo
      expect(transliterateHebrewWord('אִתּ֖וֹ')).toBe('ito');
    });

    it('trata el Sheva mudo adecuadamente evitando sílabas fantasma', () => {
      // אַבְרָם -> Avrám (no averam)
      expect(transliterateHebrewWord('אַבְרָם')).toBe('Avrám');
    });

    it('aplica Pataj Furtivo en consonantes guturales finales', () => {
      // נֹחַ -> Noaj (no Noja)
      expect(transliterateHebrewWord('נֹחַ')).toBe('Noaj');
      // רוּחַ -> Ruaj (no Ruja)
      expect(transliterateHebrewWord('ר֣וּחַ')).toBe('Ruaj');
    });
  });

  describe('Versículos completos de la Torá', () => {
    it('translitera Génesis 12:1 correctamente con YHVH y fonética limpia', () => {
      const verse = 'וַיֹּ֤אמֶר יְהֹוָה֙ אֶל־אַבְרָ֔ם לֶךְ־לְךָ֛ מֵאַרְצְךָ֥ וּמִמּֽוֹלַדְתְּךָ֖ וּמִבֵּ֣ית אָבִ֑יךָ אֶל־הָאָ֖רֶץ אֲשֶׁ֥ר אַרְאֶֽךָּ׃';
      const translit = transliterateHebrewToSpanish(verse, { sacredName: 'YHVH' });
      
      expect(translit).toContain('Vayómer YHVH');
      expect(translit).toContain('el-Avrám');
      expect(translit).toContain('Lej-lejá');
      expect(translit).not.toContain('yehovah');
      expect(translit).not.toContain('bmimvoladeteja');
      expect(translit).not.toContain('bmibeyt');
    });

    it('translitera Génesis 12:4 sin "yehovah" ni "lvot"', () => {
      const verse = 'וַיֵּ֣לֶךְ אַבְרָ֗ם כַּאֲשֶׁ֨ר דִּבֶּ֤ר אֵלָיו֙ יְהֹוָ֔ה וַיֵּ֥לֶךְ אִתּ֖וֹ ל֑וֹט וְאַבְרָ֗ם בֶּן־חָמֵ֤שׁ שָׁנִים֙ וְשִׁבְעִ֣ים שָׁנָ֔ה בְּצֵאת֖וֹ מֵחָרָֽן׃';
      const translit = transliterateHebrewToSpanish(verse, { sacredName: 'YHVH' });

      expect(translit).toContain('YHVH');
      expect(translit).toContain('Lot');
      expect(translit).not.toContain('yehovah');
      expect(translit).not.toContain('lvot');
      expect(translit).not.toContain('itvo');
    });
  });
});
