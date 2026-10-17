import { describe, it, expect } from 'vitest';

export function calculateNetCashflow(transactions: Array<{ type: 'ingreso' | 'salida' | 'transferencia'; amount: number }>) {
  return transactions.reduce((acc, tx) => {
    if (tx.type === 'ingreso') return acc + Number(tx.amount);
    if (tx.type === 'salida') return acc - Number(tx.amount);
    return acc; // transferencias internas no alteran el flujo neto total
  }, 0);
}

export function calculateBudgetPercentage(spent: number, budgeted: number): number {
  if (budgeted <= 0) return spent > 0 ? 100 : 0;
  return Math.round((spent / budgeted) * 100);
}

describe('Financial Logic & Calculations', () => {
  it('calculates net cashflow accurately without floating point leaks', () => {
    const txs: Array<{ type: 'ingreso' | 'salida' | 'transferencia'; amount: number }> = [
      { type: 'ingreso', amount: 5000 },
      { type: 'salida', amount: 1250.5 },
      { type: 'transferencia', amount: 800 }, // No debe sumar ni restar al neto global
      { type: 'salida', amount: 249.5 },
    ];

    const net = calculateNetCashflow(txs);
    expect(net).toBe(3500);
  });

  it('calculates budget percentage used correctly', () => {
    expect(calculateBudgetPercentage(250, 1000)).toBe(25);
    expect(calculateBudgetPercentage(1200, 1000)).toBe(120);
    expect(calculateBudgetPercentage(0, 500)).toBe(0);
    expect(calculateBudgetPercentage(100, 0)).toBe(100);
  });
});
