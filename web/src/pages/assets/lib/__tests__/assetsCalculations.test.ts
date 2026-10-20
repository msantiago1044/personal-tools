import { describe, it, expect } from 'vitest';
import { calculateAssetDepreciation, getDefaultCategorySettings } from '../depreciationEngine';
import { simulateDebtPayoff } from '../debtSimulatorEngine';
import { Asset, DebtDetail } from '../../../../../../packages/shared/src/types';

describe('depreciationEngine', () => {
  it('aplica configuraciones por defecto correctas según la categoría', () => {
    const enseres = getDefaultCategorySettings('enseres');
    expect(enseres.depreciationMethod).toBe('lineal');
    expect(enseres.usefulLifeMonths).toBeGreaterThan(60);

    const inmueble = getDefaultCategorySettings('inmueble');
    expect(inmueble.depreciationMethod).toBe('apreciacion');
    expect(inmueble.defaultAnnualRate).toBe(4);
  });

  it('calcula la depreciación lineal correctamente para una cama o nevera', () => {
    const asset: Asset = {
      id: '1',
      user_id: 'u1',
      name: 'Nevera No Frost',
      category: 'enseres',
      purchase_date: '2024-01-01',
      purchase_price: 1000,
      currency: 'USD',
      depreciation_method: 'lineal',
      useful_life_months: 100, // 100 meses -> $10 por mes
      salvage_value: 0,
      annual_rate: 0,
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
    };

    // 10 meses después (1 de Noviembre 2024)
    const asOfDate = new Date('2024-11-01');
    const result = calculateAssetDepreciation(asset, asOfDate);

    expect(result.ageMonths).toBe(10);
    expect(result.currentValue).toBe(900);
    expect(result.depreciatedAmount).toBe(100);
    expect(result.percentageRemaining).toBe(90);
  });

  it('respeta el valor residual sin caer en negativo tras expirar vida útil', () => {
    const asset: Asset = {
      id: '2',
      user_id: 'u1',
      name: 'Almohada Ortopédica',
      category: 'enseres',
      purchase_date: '2020-01-01',
      purchase_price: 100,
      currency: 'USD',
      depreciation_method: 'lineal',
      useful_life_months: 24, // 2 años
      salvage_value: 15,
      annual_rate: 0,
      is_active: true,
      created_at: '2020-01-01T00:00:00Z',
    };

    // 5 años después
    const asOfDate = new Date('2025-01-01');
    const result = calculateAssetDepreciation(asset, asOfDate);

    expect(result.currentValue).toBe(15);
    expect(result.depreciatedAmount).toBe(85);
    expect(result.remainingLifeMonths).toBe(0);
  });

  it('calcula la plusvalía (apreciación) para bienes raíces', () => {
    const asset: Asset = {
      id: '3',
      user_id: 'u1',
      name: 'Apartamento Centro',
      category: 'inmueble',
      purchase_date: '2022-01-01',
      purchase_price: 100000,
      currency: 'USD',
      depreciation_method: 'apreciacion',
      useful_life_months: 360,
      salvage_value: 100000,
      annual_rate: 5, // 5% anual
      is_active: true,
      created_at: '2022-01-01T00:00:00Z',
    };

    // 2 años después (2024-01-01)
    const asOfDate = new Date('2024-01-01');
    const result = calculateAssetDepreciation(asset, asOfDate);

    // 100,000 * (1.05)^2 = 110,250
    expect(result.currentValue).toBeCloseTo(110250, -1);
    expect(result.depreciatedAmount).toBeLessThan(0); // Ganancia de valor
  });
});

describe('debtSimulatorEngine', () => {
  const sampleDebts: DebtDetail[] = [
    {
      id: 'd1',
      user_id: 'u1',
      name: 'Tarjeta Visa',
      current_balance: 500,
      interest_rate_annual: 24, // 24% anual
      minimum_payment: 30,
      created_at: '2025-01-01T00:00:00Z',
    },
    {
      id: 'd2',
      user_id: 'u1',
      name: 'Préstamo Auto',
      current_balance: 2000,
      interest_rate_annual: 12, // 12% anual
      minimum_payment: 80,
      created_at: '2025-01-01T00:00:00Z',
    },
  ];

  it('simula la salida de deudas con método bola de nieve y ahorro por abono extra', () => {
    const resultBase = simulateDebtPayoff(sampleDebts, 0, 'snowball');
    const resultExtra = simulateDebtPayoff(sampleDebts, 100, 'snowball');

    expect(resultBase.payoffMonths).toBeGreaterThan(resultExtra.payoffMonths);
    expect(resultExtra.interestSaved).toBeGreaterThan(0);
    expect(resultExtra.monthsSaved).toBeGreaterThan(0);
    expect(resultExtra.schedule.length).toBe(resultExtra.payoffMonths);
  });

  it('maneja el caso cuando no hay deudas sin romper', () => {
    const result = simulateDebtPayoff([], 50, 'avalanche');
    expect(result.payoffMonths).toBe(0);
    expect(result.totalInterestPaid).toBe(0);
    expect(result.schedule.length).toBe(0);
  });
});
