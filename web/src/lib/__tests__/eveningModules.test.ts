import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: null, error: new Error('offline') }),
          maybeSingle: () => Promise.resolve({ data: null, error: new Error('offline') }),
          eq: () => ({
            maybeSingle: () => Promise.resolve({ data: null, error: new Error('offline') }),
          }),
        }),
      }),
      upsert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: new Error('offline') }),
        }),
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: new Error('offline') }),
        }),
      }),
      delete: () => ({
        eq: () => ({
          eq: () => Promise.resolve({ error: null }),
        }),
      }),
    }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      updateUser: () => Promise.resolve({ data: null, error: null }),
    },
  },
}));

import {
  saveWaterRecord,
  fetchWaterRecords,
  addWaterMl,
  DEFAULT_WATER_GOAL_ML,
  ML_PER_GLASS,
} from '../water';
import {
  WEATHER_CONDITIONS_CONFIG,
  saveWeatherRecord,
  fetchWeatherRecords,
} from '../weather';
import {
  FOOD_QUALITY_CONFIG,
  saveFoodRecord,
  fetchFoodRecords,
} from '../food';
import {
  shouldPromptEveningCheck,
  markEveningCheckDismissed,
  markEveningCheckCompleted,
} from '../eveningCheck';
import { MODULE_REGISTRY, getModuleById } from '../../modules/moduleRegistry';

describe('Módulos de la Tarde: Agua, Clima y Alimentación', () => {
  const testUserId = 'test-user-12345';
  const testDate = '2026-11-05';
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
  });

  describe('Módulo de Agua (Water)', () => {
    it('debe guardar y recuperar correctamente el consumo de agua', async () => {
      const record = await saveWaterRecord(testUserId, {
        record_date: testDate,
        glasses: 8,
        milliliters: 8 * ML_PER_GLASS,
        goal_ml: DEFAULT_WATER_GOAL_ML,
        notes: 'Meta cumplida',
      });

      expect(record.glasses).toBe(8);
      expect(record.milliliters).toBe(2000);

      const records = await fetchWaterRecords(testUserId);
      expect(records.length).toBe(1);
      expect(records[0].glasses).toBe(8);
      expect(records[0].milliliters).toBe(2000);
    });

    it('debe incrementar el agua consumida con addWaterMl', async () => {
      await saveWaterRecord(testUserId, {
        record_date: testDate,
        glasses: 2,
        milliliters: 500,
      });

      const updated = await addWaterMl(testUserId, 250, testDate);
      expect(updated.milliliters).toBe(750);
      expect(updated.glasses).toBe(3);
    });
  });

  describe('Módulo de Clima (Weather)', () => {
    it('debe contar con todas las configuraciones de condiciones climáticas', () => {
      expect(WEATHER_CONDITIONS_CONFIG.soleado).toBeDefined();
      expect(WEATHER_CONDITIONS_CONFIG.lluvia).toBeDefined();
      expect(WEATHER_CONDITIONS_CONFIG.nublado).toBeDefined();
      expect(WEATHER_CONDITIONS_CONFIG.calor).toBeDefined();
    });

    it('debe guardar y recuperar un registro del clima', async () => {
      const record = await saveWeatherRecord(testUserId, {
        record_date: testDate,
        condition: 'lluvia',
        temperature_c: 19.5,
        thermal_sensation: 'fresco',
        notes: 'Lluvia constante durante la tarde',
      });

      expect(record.condition).toBe('lluvia');
      expect(record.temperature_c).toBe(19.5);
      expect(record.thermal_sensation).toBe('fresco');

      const all = await fetchWeatherRecords(testUserId);
      expect(all.length).toBe(1);
      expect(all[0].condition).toBe('lluvia');
    });
  });

  describe('Módulo de Alimentación (Food)', () => {
    it('debe tener las opciones de calidad nutricional del 1 al 5', () => {
      expect(FOOD_QUALITY_CONFIG[1]).toBeDefined();
      expect(FOOD_QUALITY_CONFIG[5]).toBeDefined();
      expect(FOOD_QUALITY_CONFIG[5].label).toContain('Nutritivo');
    });

    it('debe guardar comidas del día detalladas o en resumen', async () => {
      const record = await saveFoodRecord(testUserId, {
        record_date: testDate,
        breakfast: 'Avena con fruta',
        lunch: 'Ensalada con salmón',
        dinner: 'Sopa de verduras',
        quality_score: 5,
        tags: ['Casero', 'Saludable', 'Verduras'],
      });

      expect(record.breakfast).toBe('Avena con fruta');
      expect(record.quality_score).toBe(5);
      expect(record.tags).toContain('Saludable');

      const all = await fetchFoodRecords(testUserId);
      expect(all.length).toBe(1);
      expect(all[0].lunch).toBe('Ensalada con salmón');
    });
  });

  describe('Lógica de Chequeo de la Tarde (7:00 PM / Evening Check)', () => {
    it('no debe activarse si la hora es anterior a las 19:00', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-11-05T14:30:00'));

      expect(shouldPromptEveningCheck()).toBe(false);
      vi.useRealTimers();
    });

    it('debe activarse si la hora es 19:00 o posterior', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-11-05T19:05:00'));

      expect(shouldPromptEveningCheck()).toBe(true);
      vi.useRealTimers();
    });

    it('no debe activarse si ya se completó para hoy', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-11-05T19:30:00'));

      markEveningCheckCompleted(testUserId);
      expect(shouldPromptEveningCheck()).toBe(false);
      vi.useRealTimers();
    });

    it('no debe activarse si fue pospuesto hace menos de 20 minutos', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-11-05T19:00:00'));

      markEveningCheckDismissed(testUserId);
      expect(shouldPromptEveningCheck()).toBe(false);

      // Avanzar 21 minutos
      vi.setSystemTime(new Date('2026-11-05T19:21:00'));
      expect(shouldPromptEveningCheck()).toBe(true);
      vi.useRealTimers();
    });
  });

  describe('Registro Central de Módulos (moduleRegistry)', () => {
    it('debe incluir los tres nuevos módulos registrados y activos', () => {
      const waterMod = getModuleById('water');
      expect(waterMod).toBeDefined();
      expect(waterMod?.name).toBe('Agua & Hidratación');
      expect(waterMod?.status).toBe('active');

      const weatherMod = getModuleById('weather');
      expect(weatherMod).toBeDefined();
      expect(weatherMod?.name).toBe('Clima & Entorno');
      expect(weatherMod?.status).toBe('active');

      const foodMod = getModuleById('food');
      expect(foodMod).toBeDefined();
      expect(foodMod?.name).toBe('Alimentación & Comidas');
      expect(foodMod?.status).toBe('active');
    });
  });
});
