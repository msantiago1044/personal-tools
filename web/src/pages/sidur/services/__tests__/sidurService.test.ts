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

  it('debe contener las 19 bendiciones en la sección de la Amidá de Shajarit', () => {
    const shajarit = getSidurTefila('shajarit');
    expect(shajarit).toBeDefined();

    const amidaSection = shajarit?.sections.find((s) => s.id === 'amida_jol');
    expect(amidaSection).toBeDefined();
    // 1 intro + 19 bendiciones + 1 cierre
    expect(amidaSection?.segments.length).toBe(21);
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

    // 3. Modo Sin Minián (Tefilat Yajid: omite Barejú y 13 Midot súplica)
    const sinMinian = getFilteredSections(shajarit.sections, 'sin_minian');
    const barejuInSinMinian = sinMinian.flatMap((s) => s.segments).find((seg) => seg.id === 'bareju');
    expect(barejuInSinMinian).toBeUndefined();

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
});
