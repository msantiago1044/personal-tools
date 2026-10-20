import { DebtDetail } from '../../../../../packages/shared/src/types';

export interface PayoffSchedulePoint {
  monthIndex: number;
  dateStr: string;
  totalBalance: number;
  paidInterestThisMonth: number;
  paidPrincipalThisMonth: number;
  activeDebtsCount: number;
}

export interface PayoffSimulationResult {
  strategy: 'snowball' | 'avalanche';
  payoffMonths: number;
  payoffDate: string;
  totalInterestPaid: number;
  totalInterestWithoutExtra: number;
  interestSaved: number;
  monthsSaved: number;
  schedule: PayoffSchedulePoint[];
  debtFreeYear: number;
  debtFreeMonth: number;
}

interface InternalDebt {
  id: string;
  name: string;
  balance: number;
  annualRatePct: number;
  minPayment: number;
}

function runSimulation(
  initialDebts: InternalDebt[],
  extraMonthly: number,
  strategy: 'snowball' | 'avalanche'
): { months: number; totalInterest: number; schedule: PayoffSchedulePoint[] } {
  // Copia profunda
  let debts = initialDebts
    .filter((d) => d.balance > 0)
    .map((d) => ({ ...d }));

  if (debts.length === 0) {
    return { months: 0, totalInterest: 0, schedule: [] };
  }

  let totalInterest = 0;
  let month = 0;
  const maxMonths = 360; // 30 años máximo
  const schedule: PayoffSchedulePoint[] = [];

  const startDate = new Date();

  while (debts.some((d) => d.balance > 0.01) && month < maxMonths) {
    month++;
    
    // 1. Aplicar intereses mensuales de cada deuda
    for (const d of debts) {
      if (d.balance > 0) {
        const monthlyInterest = (d.balance * (d.annualRatePct / 100)) / 12;
        d.balance += monthlyInterest;
        totalInterest += monthlyInterest;
      }
    }

    // 2. Ordenar deudas según estrategia
    if (strategy === 'snowball') {
      // Menor saldo primero
      debts.sort((a, b) => a.balance - b.balance);
    } else {
      // Mayor tasa de interés primero
      debts.sort((a, b) => b.annualRatePct - a.annualRatePct);
    }

    let extraPool = extraMonthly;
    let paidPrincipalThisMonth = 0;
    let paidInterestThisMonth = 0;

    // 3. Pagar cuotas mínimas obligatorias
    for (const d of debts) {
      if (d.balance <= 0) continue;

      const monthlyInterest = (d.balance * (d.annualRatePct / 100)) / 12;
      paidInterestThisMonth += monthlyInterest;

      const payment = Math.min(d.balance, Math.max(d.minPayment, monthlyInterest + 1));
      d.balance -= payment;
      paidPrincipalThisMonth += Math.max(0, payment - monthlyInterest);

      if (d.balance < 0.01) {
        // La cuota mínima que quedó libre se suma a la bolsa de aceleración
        extraPool += d.minPayment;
        d.balance = 0;
      }
    }

    // 4. Aplicar bolsa extra a la deuda prioritaria
    for (const d of debts) {
      if (d.balance > 0 && extraPool > 0) {
        const extraPayment = Math.min(d.balance, extraPool);
        d.balance -= extraPayment;
        paidPrincipalThisMonth += extraPayment;
        extraPool -= extraPayment;

        if (d.balance < 0.01) {
          extraPool += d.minPayment;
          d.balance = 0;
        }
      }
    }

    const currentTotalBalance = debts.reduce((sum, d) => sum + Math.max(0, d.balance), 0);
    const pointDate = new Date(startDate.getFullYear(), startDate.getMonth() + month, 1);

    schedule.push({
      monthIndex: month,
      dateStr: pointDate.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
      totalBalance: Math.round(currentTotalBalance * 100) / 100,
      paidInterestThisMonth: Math.round(paidInterestThisMonth * 100) / 100,
      paidPrincipalThisMonth: Math.round(paidPrincipalThisMonth * 100) / 100,
      activeDebtsCount: debts.filter((d) => d.balance > 0.01).length,
    });
  }

  return {
    months: month,
    totalInterest: Math.round(totalInterest * 100) / 100,
    schedule,
  };
}

/**
 * Simula y compara la amortización de deudas aplicando Bola de Nieve vs Avalancha.
 */
export function simulateDebtPayoff(
  debts: DebtDetail[],
  extraMonthly: number = 0,
  strategy: 'snowball' | 'avalanche' = 'snowball'
): PayoffSimulationResult {
  const internalDebts: InternalDebt[] = debts.map((d) => ({
    id: d.id,
    name: d.name,
    balance: Number(d.current_balance) || 0,
    annualRatePct: Number(d.interest_rate_annual) || 0,
    minPayment: Math.max(5, Number(d.minimum_payment) || 20),
  }));

  // Simulación con abono extra
  const withExtra = runSimulation(internalDebts, Math.max(0, extraMonthly), strategy);

  // Simulación base (sin abono extra) para calcular ahorros
  const baseSimulation = runSimulation(internalDebts, 0, strategy);

  const now = new Date();
  const payoffDateObj = new Date(now.getFullYear(), now.getMonth() + withExtra.months, 1);
  const payoffDate = payoffDateObj.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  const totalInterestPaid = withExtra.totalInterest;
  const totalInterestWithoutExtra = baseSimulation.totalInterest;
  const interestSaved = Math.max(0, Math.round((totalInterestWithoutExtra - totalInterestPaid) * 100) / 100);
  const monthsSaved = Math.max(0, baseSimulation.months - withExtra.months);

  return {
    strategy,
    payoffMonths: withExtra.months,
    payoffDate,
    totalInterestPaid,
    totalInterestWithoutExtra,
    interestSaved,
    monthsSaved,
    schedule: withExtra.schedule,
    debtFreeYear: payoffDateObj.getFullYear(),
    debtFreeMonth: payoffDateObj.getMonth() + 1,
  };
}
