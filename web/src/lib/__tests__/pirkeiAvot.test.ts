import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getLocalDateKey,
  getStoredPirkeiAvotBookmark,
  hasReadPirkeiAvotToday,
  shouldPromptPirkeiAvot,
  mergePirkeiAvotProgressMaps,
} from '../pirkeiAvot';

describe('pirkeiAvot service', () => {
  let store: Record<string, string> = {};

  beforeEach(() => {
    store = {};
    const localStorageMock = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };

    vi.stubGlobal('localStorage', localStorageMock);
    vi.stubGlobal('window', {
      dispatchEvent: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      localStorage: localStorageMock,
    });
    vi.restoreAllMocks();
  });

  it('calcula la clave de fecha local correctamente YYYY-MM-DD', () => {
    const testDate = new Date(2026, 9, 17); // Oct 17, 2026
    const key = getLocalDateKey(testDate);
    expect(key).toBe('2026-10-17');
  });

  it('obtiene el marcador por defecto (Cap 1, Mishná 1) si no hay datos guardados', () => {
    const bm = getStoredPirkeiAvotBookmark('test-user');
    expect(bm.chapter).toBe(1);
    expect(bm.mishna).toBe(1);
    expect(bm.completed).toBe(false);
  });

  it('reconoce cuando el usuario NO ha leído Pirkei Avot hoy', () => {
    const read = hasReadPirkeiAvotToday('test-user');
    expect(read).toBe(false);
  });

  it('reconoce cuando el usuario SÍ ha leído Pirkei Avot hoy mediante bandera diaria', () => {
    const todayKey = getLocalDateKey();
    localStorage.setItem(`pirkei_avot_daily_read_${todayKey}_test-user`, 'true');

    const read = hasReadPirkeiAvotToday('test-user');
    expect(read).toBe(true);
  });

  it('reconoce lectura de hoy a partir del timestamp en pirkei_avot_progress', () => {
    const now = new Date().toISOString();
    const mockProgress = {
      1: {
        chapter_number: 1,
        completed_mishnayot: [1, 2],
        completed_count: 0,
        is_completed: false,
        last_read_at: now,
      },
    };
    localStorage.setItem('pirkei_avot_progress_test-user', JSON.stringify(mockProgress));

    const read = hasReadPirkeiAvotToday('test-user');
    expect(read).toBe(true);
  });

  it('no sugiere la ventana emergente si el usuario ya leyó hoy', () => {
    const todayKey = getLocalDateKey();
    localStorage.setItem(`pirkei_avot_daily_read_${todayKey}_test-user`, 'true');

    const dateMock = new Date();
    dateMock.setHours(15, 0, 0, 0);
    vi.setSystemTime(dateMock);

    const result = shouldPromptPirkeiAvot('test-user');
    expect(result.shouldPrompt).toBe(false);
  });

  it('mezcla correctamente lecturas realizadas en laptop y celular (merge bidireccional)', () => {
    const localProgress = {
      1: {
        chapter_number: 1,
        completed_mishnayot: [1, 2],
        completed_count: 0,
        is_completed: false,
        mishna_counts: { 1: 1, 2: 2 },
        mishna_last_read: { 1: '2026-10-17T18:00:00Z', 2: '2026-10-17T18:10:00Z' },
        years_history: { '2026': [1, 2] },
        cycle: 1,
        last_read_at: '2026-10-17T18:10:00Z',
      },
    };

    const remoteProgress = {
      1: {
        chapter_number: 1,
        completed_mishnayot: [2, 3],
        completed_count: 0,
        is_completed: false,
        mishna_counts: { 2: 1, 3: 1 },
        mishna_last_read: { 2: '2026-10-17T17:00:00Z', 3: '2026-10-17T19:00:00Z' },
        years_history: { '2026': [2, 3] },
        cycle: 1,
        last_read_at: '2026-10-17T19:00:00Z',
      },
    };

    const { merged, chaptersToUpload } = mergePirkeiAvotProgressMaps(localProgress, remoteProgress);

    expect(merged[1]).toBeDefined();
    // Unión de mishnayot leídas en ambos dispositivos: [1, 2, 3]
    expect(merged[1].completed_mishnayot).toEqual([1, 2, 3]);
    // Conteo máximo para la mishná 2 (2 en local vs 1 en remoto) -> 2
    expect(merged[1].mishna_counts[2]).toBe(2);
    // Fecha más reciente para la mishná 2 (18:10 vs 17:00) -> 18:10
    expect(merged[1].mishna_last_read[2]).toBe('2026-10-17T18:10:00Z');
    // Fecha más reciente del capítulo -> 19:00
    expect(merged[1].last_read_at).toBe('2026-10-17T19:00:00Z');
    // La nube no tenía la mishná 1, por lo que debe subirse
    expect(chaptersToUpload.length).toBe(1);
    expect(chaptersToUpload[0].completed_mishnayot).toEqual([1, 2, 3]);
  });
});
