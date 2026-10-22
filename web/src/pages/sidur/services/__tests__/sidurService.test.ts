import { describe, it, expect, vi } from 'vitest';
import {
  getSidurTefilot,
  getSidurTefila,
  getSuggestedTefilaId,
  getRenderedTransliteration,
  getRenderedSpanish,
  getFilteredSections,
  isSegmentRequiringMinian,
} from '../sidurService';
import { SidurSegment } from '../../../../../../packages/shared/src/types';

describe('sidurService - Liturgia Marroquí', () => {
  it('debe devolver las 5 liturgias completas de días de jol', () => {
    const tefilot = getSidurTefilot();
    expect(tefilot.length).toBe(5);

    const ids = tefilot.map((t) => t.id);
    expect(ids).toContain('shajarit');
    expect(ids).toContain('minja');
    expect(ids).toContain('arvit');
    expect(ids).toContain('birkat_hamazon');
    expect(ids).toContain('oraciones_diarias');
  });

  it('debe contener las 19 bendiciones completas en la Amidá de Shajarit, Minjá y Arvit', () => {
    // 1. Shajarit
    const shajarit = getSidurTefila('shajarit');
    expect(shajarit).toBeDefined();
    const shajaritAmida = shajarit?.sections.find((s) => s.id === 'amida_jol');
    expect(shajaritAmida?.segments.length).toBe(21);

    // 2. Minjá
    const minja = getSidurTefila('minja');
    expect(minja).toBeDefined();
    const minjaAmida = minja?.sections.find((s) => s.id === 'minja_amida_section');
    expect(minjaAmida?.segments.length).toBe(21);
    expect(minjaAmida?.segments[1].titleSpanish).toContain('Patriarcas');

    // 3. Arvit
    const arvit = getSidurTefila('arvit');
    expect(arvit).toBeDefined();
    const arvitAmida = arvit?.sections.find((s) => s.id === 'arvit_amida_section');
    expect(arvitAmida?.segments.length).toBe(21);

    // 4. Shemá completo con los 3 párrafos en Shajarit y Arvit
    const shajaritShema = shajarit?.sections
      .find((s) => s.id === 'shema_u_virjoteha')
      ?.segments.find((seg) => seg.id === 'shema_yisrael');
    expect(shajaritShema?.hebrew).toContain('וְהָיָה אִם־שָׁמֹעַ');
    expect(shajaritShema?.hebrew).toContain('וַיֹּאמֶר יהוה אֶל־מֹשֶׁה');

    const arvitShema = arvit?.sections
      .find((s) => s.id === 'arvit_inicio')
      ?.segments.find((seg) => seg.id === 'arvit_shema');
    expect(arvitShema?.hebrew).toContain('וְהָיָה אִם־שָׁמֹעַ');
    expect(arvitShema?.hebrew).toContain('וַיֹּאמֶר יהוה אֶל־מֹשֶׁה');
  });

  it('debe utilizar YHVH por defecto al generar transliteración y español', () => {
    const sampleSegment: SidurSegment = {
      id: 'test_seg',
      hebrew: 'בָּרוּךְ אַתָּה יהוה אֱלֹהֵינוּ',
      transliteration: 'Barúj Atáh Adonái Elohéinu',
      spanish: 'Bendito eres Tú, YHVH nuestro Dios',
    };

    // Llamadas sin especificar modo deben usar YHVH
    expect(getRenderedTransliteration(sampleSegment)).toContain('YHVH');
    expect(getRenderedSpanish(sampleSegment)).toContain('YHVH');
  });

  it('debe filtrar adecuadamente según los 4 modos de rezo (completo, minian, sin_minian, rapido)', () => {
    const shajarit = getSidurTefila('shajarit');
    expect(shajarit).toBeDefined();
    if (!shajarit) return;

    // 1. Modo Completo
    const completo = getFilteredSections(shajarit.sections, 'completo');
    expect(completo.length).toBe(shajarit.sections.length);

    // 2. Modo Con Minián (incluye Barejú)
    const minian = getFilteredSections(shajarit.sections, 'minian');
    const barejuInMinian = minian.flatMap((s) => s.segments).find((seg) => seg.id === 'bareju');
    expect(barejuInMinian).toBeDefined();

    // 3. Modo Individual / Sin Minián (Tefilat Yajid: omite Barejú y 13 Midot súplica)
    const sinMinian = getFilteredSections(shajarit.sections, 'sin_minian');
    const barejuInSinMinian = sinMinian.flatMap((s) => s.segments).find((seg) => seg.id === 'bareju');
    expect(barejuInSinMinian).toBeUndefined();

    const individual = getFilteredSections(shajarit.sections, 'individual');
    const barejuInIndividual = individual.flatMap((s) => s.segments).find((seg) => seg.id === 'bareju');
    expect(barejuInIndividual).toBeUndefined();

    // 4. Modo Rápido (solo núcleo halájico esencial: Baruj Sheamar, Ashrei, Shemá, Amidá, Alénu)
    const rapido = getFilteredSections(shajarit.sections, 'rapido');
    const rapidoSegmentIds = rapido.flatMap((s) => s.segments).map((seg) => seg.id);

    expect(rapidoSegmentIds).toContain('baruj_sheamar');
    expect(rapidoSegmentIds).toContain('ashrei');
    expect(rapidoSegmentIds).toContain('shema_yisrael');
    expect(rapidoSegmentIds).toContain('amida_1_avot');
    expect(rapidoSegmentIds).toContain('alenu_leshabeaj');

    // Oraciones optativas o secundarias deben quedar excluidas en modo rápido
    expect(rapidoSegmentIds).not.toContain('pitum_haketoret');
    expect(rapidoSegmentIds).not.toContain('mizmor_shir_janukat');
  });

  it('getSuggestedTefilaId debe sugerir tefilá según la hora del día', () => {
    // 08:30 -> Shajarit
    const morningDate = new Date(2026, 9, 22, 8, 30, 0);
    vi.setSystemTime(morningDate);
    expect(getSuggestedTefilaId()).toBe('shajarit');

    // 15:45 -> Minjá
    const afternoonDate = new Date(2026, 9, 22, 15, 45, 0);
    vi.setSystemTime(afternoonDate);
    expect(getSuggestedTefilaId()).toBe('minja');

    // 21:00 -> Arvit
    const nightDate = new Date(2026, 9, 22, 21, 0, 0);
    vi.setSystemTime(nightDate);
    expect(getSuggestedTefilaId()).toBe('arvit');

    vi.useRealTimers();
  });

  it('debe garantizar que ningún segmento de ninguna tefilá tenga textos vacíos ni puntos suspensivos (...)', () => {
    const tefilot = getSidurTefilot();

    tefilot.forEach((tefila) => {
      tefila.sections.forEach((sec) => {
        sec.segments.forEach((seg) => {
          // 1. Textos no vacíos
          expect(seg.hebrew.trim().length, `Hebreo vacío en ${tefila.id} / ${seg.id}`).toBeGreaterThan(0);
          expect(seg.spanish.trim().length, `Español vacío en ${tefila.id} / ${seg.id}`).toBeGreaterThan(0);
          expect(seg.transliteration.trim().length, `Transliteración vacía en ${tefila.id} / ${seg.id}`).toBeGreaterThan(0);

          // 2. Cero elipsis o recortes
          expect(seg.hebrew, `Puntos suspensivos en hebreo de ${tefila.id} / ${seg.id}`).not.toContain('...');
          expect(seg.transliteration, `Puntos suspensivos en transliteración de ${tefila.id} / ${seg.id}`).not.toContain('...');
          expect(seg.spanish, `Puntos suspensivos en español de ${tefila.id} / ${seg.id}`).not.toContain('...');
        });
      });
    });
  });

  it('debe verificar la integridad de las secciones marroquíes ampliadas', () => {
    // 1. Pitum HaKetoret completo (368 maneh y 11 especias)
    const shajarit = getSidurTefila('shajarit');
    const pitum = shajarit?.sections.find((s) => s.id === 'korbanot')?.segments.find((seg) => seg.id === 'pitum_haketoret');
    expect(pitum?.hebrew).toContain('שְׁלֹשׁ מֵאוֹת וְשִׁשִּׁים וּשְׁמוֹנָה מָנִים');
    expect(pitum?.hebrew).toContain('הַצֳּרִי');
    expect(pitum?.hebrew).toContain('תָּנָא דְבֵי אֵלִיָּהוּ');
    expect(pitum?.transliteration).toContain('Taná Devéi Eliyáhu');

    // 2. Shirat HaYam completa en Pesuké deZimrá
    const shiratHayam = shajarit?.sections.find((s) => s.id === 'pesukei_dezimra')?.segments.find((seg) => seg.id === 'shirat_hayam');
    expect(shiratHayam).toBeDefined();
    expect(shiratHayam?.hebrew).toContain('אָשִׁירָה לַיהוה כִּי־גָאֹה גָּאָה');
    expect(shiratHayam?.hebrew).toContain('יהוה יִמְלֹךְ לְעֹלָם וָעֶד');

    // 3. Tajanun de Shajarit con Salmo 25 íntegro de 22 versículos
    const salmo25 = shajarit?.sections.find((s) => s.id === 'tajanun')?.segments.find((seg) => seg.id === 'salmo_25_nefilat_apayim');
    expect(salmo25).toBeDefined();
    expect(salmo25?.hebrew).toContain('אֵלֶיךָ יהוה נַפְשִׁי אֶשָּׂא');
    expect(salmo25?.hebrew).toContain('פְּדֵה אֱלֹהִים אֶת־יִשְׂרָאֵל');

    // 4. Uvá LeTsiyón con Kedushá de-Sidrá (Targum arameo)
    const uvaLetsiyon = shajarit?.sections.find((s) => s.id === 'conclusion_shajarit')?.segments.find((seg) => seg.id === 'uva_letzion');
    expect(uvaLetsiyon?.hebrew).toContain('קַדִּישׁ בִּשְׁמֵי מְרוֹמָא עִלָּאָה');

    // 5. Birkat HaMazón completo con Zimmun marroquí y Salmo 126
    const bhamazon = getSidurTefila('birkat_hamazon');
    const zimmun = bhamazon?.sections.find((s) => s.id === 'birkat_hamazon_complete')?.segments.find((seg) => seg.id === 'zimun_morocco');
    expect(zimmun?.hebrew).toContain('הַב לָן וְנִבְרִיךְ');
    const harajaman = bhamazon?.sections.find((s) => s.id === 'birkat_hamazon_complete')?.segments.find((seg) => seg.id === 'harajaman_series');
    expect(harajaman?.hebrew).toContain('הָרַחֲמָן, הוּא יְבָרֵךְ אֶת־בַּעַל הַבַּיִת הַזֶּה');

    // 6. Keriát Shemá al HaMitá con HaMapíl y Salmo 91
    const diarias = getSidurTefila('oraciones_diarias');
    const hamapil = diarias?.sections.find((s) => s.id === 'shema_al_hamita_section')?.segments.find((seg) => seg.id === 'hamapil');
    expect(hamapil?.hebrew).toContain('הַמַּפִּיל חֶבְלֵי שֵׁנָה');
    const salmo91 = diarias?.sections.find((s) => s.id === 'shema_al_hamita_section')?.segments.find((seg) => seg.id === 'salmo_91_yoshev_beseter');
    expect(salmo91?.hebrew).toContain('יֹשֵׁב בְּסֵתֶר עֶלְיוֹן');
  });
});
