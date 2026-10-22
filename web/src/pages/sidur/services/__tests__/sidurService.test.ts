import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getSidurTefilot,
  getSidurTefila,
  getSuggestedTefilaId,
  getRenderedTransliteration,
  getRenderedSpanish,
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

  it('debe adaptar la transliteración y el español según el modo de Nombre Sagrado', () => {
    const sampleSegment: SidurSegment = {
      id: 'test_seg',
      hebrew: 'בָּרוּךְ אַתָּה יהוה אֱלֹהֵינוּ',
      transliteration: 'Barúj Atáh Adonái Elohéinu',
      spanish: 'Bendito eres Tú, YHVH nuestro Dios',
    };

    // Modo YHVH
    expect(getRenderedTransliteration(sampleSegment, 'YHVH')).toContain('YHVH');
    expect(getRenderedSpanish(sampleSegment, 'YHVH')).toContain('YHVH');

    // Modo Adonai
    expect(getRenderedTransliteration(sampleSegment, 'Adonai')).toContain('Adonái');
    expect(getRenderedSpanish(sampleSegment, 'Adonai')).toContain('Adonái');

    // Modo HaShem
    expect(getRenderedTransliteration(sampleSegment, 'HaShem')).toContain('HaShem');
    expect(getRenderedSpanish(sampleSegment, 'HaShem')).toContain('HaShem');
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
