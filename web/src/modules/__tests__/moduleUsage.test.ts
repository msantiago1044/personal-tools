import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  recordModuleUsage,
  getModuleUsageStats,
  getModuleAccessTimeline,
  formatExactTime,
  hasVisitedModuleToday,
} from '../moduleUsage';

describe('moduleUsage - Registro de horarios de entrada', () => {
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
      length: 0,
      key: () => null,
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

  it('debe registrar el timestamp actual en lastOpened y en el array history', () => {
    const fixedNow = 1774320000000;
    vi.spyOn(Date, 'now').mockReturnValue(fixedNow);

    recordModuleUsage('sleep', 'test_user');

    const stats = getModuleUsageStats('test_user');
    expect(stats['sleep']).toBeDefined();
    expect(stats['sleep'].count).toBe(1);
    expect(stats['sleep'].lastOpened).toBe(fixedNow);
    expect(stats['sleep'].history).toEqual([fixedNow]);
  });

  it('debe acumular los timestamps en history al entrar varias veces', () => {
    const t1 = 1774320000000;
    const t2 = 1774323600000;
    const t3 = 1774327200000;

    vi.spyOn(Date, 'now').mockReturnValue(t1);
    recordModuleUsage('emotions', 'test_user');

    vi.spyOn(Date, 'now').mockReturnValue(t2);
    recordModuleUsage('emotions', 'test_user');

    vi.spyOn(Date, 'now').mockReturnValue(t3);
    recordModuleUsage('emotions', 'test_user');

    const stats = getModuleUsageStats('test_user');
    expect(stats['emotions'].count).toBe(3);
    expect(stats['emotions'].lastOpened).toBe(t3);
    expect(stats['emotions'].history).toEqual([t1, t2, t3]);
  });

  it('debe generar una cronología con fecha, hora exacta y orden de acceso', () => {
    const d1 = new Date(2026, 9, 21, 7, 15, 0).getTime();
    const d2 = new Date(2026, 9, 21, 7, 30, 0).getTime();
    const d3 = new Date(2026, 9, 21, 8, 5, 0).getTime();

    vi.spyOn(Date, 'now').mockReturnValue(d1);
    recordModuleUsage('sleep', 'test_user');

    vi.spyOn(Date, 'now').mockReturnValue(d2);
    recordModuleUsage('emotions', 'test_user');

    vi.spyOn(Date, 'now').mockReturnValue(d3);
    recordModuleUsage('parasha', 'test_user');

    const timeline = getModuleAccessTimeline('test_user');
    expect(timeline.length).toBe(3);
    expect(timeline[0].moduleId).toBe('sleep');
    expect(timeline[0].timeStr).toBe('07:15');
    expect(timeline[1].moduleId).toBe('emotions');
    expect(timeline[1].timeStr).toBe('07:30');
    expect(timeline[2].moduleId).toBe('parasha');
    expect(timeline[2].timeStr).toBe('08:05');
  });

  it('formatExactTime debe formatear correctamente la hora', () => {
    const sampleDate = new Date(2026, 9, 21, 8, 45, 0).getTime();
    expect(formatExactTime(sampleDate)).toBe('08:45');
  });

  it('hasVisitedModuleToday detecta si un timestamp es de hoy o de otro día', () => {
    const today = new Date();
    const todayTimestamp = today.getTime();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayTimestamp = yesterday.getTime();

    expect(hasVisitedModuleToday(todayTimestamp)).toBe(true);
    expect(hasVisitedModuleToday(yesterdayTimestamp)).toBe(false);
    expect(hasVisitedModuleToday(undefined)).toBe(false);
    expect(hasVisitedModuleToday(0)).toBe(false);
  });
});
