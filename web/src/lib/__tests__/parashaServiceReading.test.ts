import { describe, it, expect, beforeEach, vi } from 'vitest';

let store: Record<string, string> = {};
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
  key: (i: number) => Object.keys(store)[i] || null,
  get length() {
    return Object.keys(store).length;
  },
};

vi.stubGlobal('localStorage', localStorageMock);
vi.stubGlobal('window', {
  localStorage: localStorageMock,
  dispatchEvent: () => true,
  CustomEvent: class CustomEvent {
    type: string;
    constructor(type: string) {
      this.type = type;
    }
  },
});

vi.mock('../supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
          order: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
      upsert: () => Promise.resolve({ data: null, error: null }),
    }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      updateUser: () => Promise.resolve({ data: { user: null }, error: null }),
    },
  },
}));

import {
  getDiasporaDailySchedule,
  isDailyAliyahReadToday,
  markDailyAliyahCompletedToday,
  getParashaProgress,
  getCanonicalParashaId,
} from '../parashaService';

describe('Parashá Reading & Multiple Aliyot Tracking', () => {
  beforeEach(() => {
    store = {};
  });

  it('normalizes toldot and toledot to the same canonical ID toldot', () => {
    expect(getCanonicalParashaId('toldot')).toBe('toldot');
    expect(getCanonicalParashaId('toledot')).toBe('toldot');
    expect(getCanonicalParashaId('Toldot')).toBe('toldot');
    expect(getCanonicalParashaId('vayeilech')).toBe('vayeilech');
    expect(getCanonicalParashaId('lechlecha')).toBe('lechlecha');
  });

  it('recognizes today reading when marking the scheduled aliyá', async () => {
    const schedule = getDiasporaDailySchedule();
    expect(isDailyAliyahReadToday('test_user')).toBe(false);

    await markDailyAliyahCompletedToday(
      schedule.targetAliyahNumber,
      schedule.parashaId || schedule.parashaName,
      'test_user'
    );

    expect(isDailyAliyahReadToday('test_user')).toBe(true);
  });

  it('recognizes reading saved under toledot as read for toldot', async () => {
    const schedule = getDiasporaDailySchedule();
    // Simular que se guardó bajo la clave toledot
    const record = {
      dateKey: schedule.dateKey,
      parashaId: 'toledot',
      completedAliyah: schedule.targetAliyahNumber,
      completedAliyot: [schedule.targetAliyahNumber],
      completedFull: false,
      timestamp: Date.now(),
    };
    store[`parasha_daily_read_record_legacy_user`] = JSON.stringify(record);
    store[`parasha_progress_toledot_legacy_user`] = JSON.stringify({
      parasha_id: 'toledot',
      completed_aliyot: [schedule.targetAliyahNumber],
      last_read_at: new Date().toISOString(),
    });

    expect(isDailyAliyahReadToday('legacy_user')).toBe(true);
  });

  it('accumulates multiple aliyot in one day and keeps isDailyAliyahReadToday true', async () => {
    const schedule = getDiasporaDailySchedule();
    expect(isDailyAliyahReadToday('test_user')).toBe(false);

    await markDailyAliyahCompletedToday(
      schedule.targetAliyahNumber,
      schedule.parashaId || schedule.parashaName,
      'test_user'
    );

    expect(isDailyAliyahReadToday('test_user')).toBe(true);
  });

  it('accumulates multiple aliyot in one day and keeps isDailyAliyahReadToday true', async () => {
    const schedule = getDiasporaDailySchedule();
    const parashaId = schedule.parashaId || schedule.parashaName;

    // Usuario lee la aliyá de hoy y luego adelanta la siguiente
    await markDailyAliyahCompletedToday(schedule.targetAliyahNumber, parashaId, 'user_multi');
    expect(isDailyAliyahReadToday('user_multi')).toBe(true);

    const nextAliyah = (schedule.targetAliyahNumber % 7) + 1;
    await markDailyAliyahCompletedToday(nextAliyah, parashaId, 'user_multi');

    // Sigue siendo true para hoy porque la de hoy no se desmarca al leer la siguiente
    expect(isDailyAliyahReadToday('user_multi')).toBe(true);

    const prog = getParashaProgress(parashaId, 'user_multi');
    expect(prog.completed_aliyot).toContain(schedule.targetAliyahNumber);
    expect(prog.completed_aliyot).toContain(nextAliyah);
  });

  it('marks isDailyAliyahReadToday true if full parasha is completed', async () => {
    const schedule = getDiasporaDailySchedule();
    const parashaId = schedule.parashaId || schedule.parashaName;

    await markDailyAliyahCompletedToday(0, parashaId, 'user_full');

    expect(isDailyAliyahReadToday('user_full')).toBe(true);
    const prog = getParashaProgress(parashaId, 'user_full');
    expect(prog.full_parasha_completed).toBe(true);
    expect(prog.completed_aliyot).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });
});
