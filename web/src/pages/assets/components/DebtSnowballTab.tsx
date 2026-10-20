import React, { useState, useMemo } from 'react';
import {
  Flame,
  Snowflake,
  TrendingDown,
  DollarSign,
  Plus,
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { DebtDetail, Account } from '../../../../../packages/shared/src/types';
import { simulateDebtPayoff } from '../lib/debtSimulatorEngine';

interface DebtSnowballTabProps {
  debts: DebtDetail[];
  financeAccounts: Account[];
  onSaveDebt: (debt: Partial<DebtDetail>) => Promise<any>;
}

export const DebtSnowballTab: React.FC<DebtSnowballTabProps> = ({
  debts,
  financeAccounts,
  onSaveDebt,
}) => {
  const [strategy, setStrategy] = useState<'snowball' | 'avalanche'>('snowball');
  const [extraPayment, setExtraPayment] = useState<number>(50);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newDebtName, setNewDebtName] = useState('');
  const [newDebtBalance, setNewDebtBalance] = useState('');
  const [newDebtRate, setNewDebtRate] = useState('24');
  const [newDebtMinPay, setNewDebtMinPay] = useState('25');

  // Integrar pasivos de finanzas si no hay deudas explícitas creadas
  const activeDebts: DebtDetail[] = useMemo(() => {
    if (debts.length > 0) return debts;

    // Si aún no hay en debt_details, traer tarjetas o cuentas con saldo de Finanzas
    return financeAccounts
      .filter((acc) => acc.type === 'tarjeta')
      .map((acc) => ({
        id: acc.id,
        user_id: acc.user_id,
        account_id: acc.id,
        name: acc.name,
        current_balance: Math.abs(Number(acc.current_balance ?? acc.initial_balance ?? 0)) || 500,
        interest_rate_annual: 24, // Estimado 24% para tarjeta de crédito
        minimum_payment: 30,
        created_at: acc.created_at,
      }));
  }, [debts, financeAccounts]);

  // Ejecutar simulación
  const simulation = useMemo(() => {
    return simulateDebtPayoff(activeDebts, extraPayment, strategy);
  }, [activeDebts, extraPayment, strategy]);

  const handleCreateDebt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDebtName.trim() || !newDebtBalance) return;

    await onSaveDebt({
      name: newDebtName.trim(),
      current_balance: Number(newDebtBalance) || 0,
      interest_rate_annual: Number(newDebtRate) || 0,
      minimum_payment: Number(newDebtMinPay) || 20,
    });

    setNewDebtName('');
    setNewDebtBalance('');
    setShowAddModal(false);
  };

  const totalCurrentDebt = activeDebts.reduce((sum, d) => sum + Number(d.current_balance || 0), 0);

  return (
    <div className="space-y-6">
      {/* Encabezado y Selector de Estrategia */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>⚡ Plan de Salida y Amortización de Deudas</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Simula acelerar tus pagos aplicando el método Bola de Nieve o Avalancha.
          </p>
        </div>

        {/* Toggle Estrategia */}
        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setStrategy('snowball')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              strategy === 'snowball'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Snowflake className="w-3.5 h-3.5" />
            <span>Bola de Nieve</span>
          </button>
          <button
            onClick={() => setStrategy('avalanche')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              strategy === 'avalanche'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Avalancha</span>
          </button>
        </div>
      </div>

      {/* Explicación de la estrategia seleccionada */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2.5 shadow-sm">
        {strategy === 'snowball' ? (
          <>
            <Snowflake className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 dark:text-slate-200">Método Bola de Nieve:</strong>{' '}
              Se ordenan las deudas de <em>menor saldo a mayor saldo</em>. Pagas el mínimo en todas y concentras el abono extra en liquidar la más pequeña primero. Proporciona victorias psicológicas rápidas que mantienen alta tu motivación.
            </div>
          </>
        ) : (
          <>
            <Flame className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 dark:text-slate-200">Método Avalancha:</strong>{' '}
              Se ordenan las deudas de <em>mayor tasa de interés a menor</em>. Es matemáticamente la estrategia más eficiente, ya que reduce al máximo los intereses que terminas regalándole a los bancos.
            </div>
          </>
        )}
      </div>

      {/* Slider Interactivo de Abono Extra Mensual */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              ¿Cuánto dinero extra puedes abonar a capital cada mes?
            </label>
            <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 block mt-1">
              +${extraPayment}/mes
            </span>
          </div>

          {/* Botones de sugerencia rápida */}
          <div className="flex items-center gap-1.5">
            {[25, 50, 100, 200, 300].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setExtraPayment(val)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium font-mono border transition-all ${
                  extraPayment === val
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                +${val}
              </button>
            ))}
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="1000"
          step="10"
          value={extraPayment}
          onChange={(e) => setExtraPayment(Number(e.target.value))}
          className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
        />
      </div>

      {/* Tarjetas de Resultados de la Simulación */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Fecha Libre de Deudas</span>
          </div>
          <span className="text-2xl font-black text-emerald-800 dark:text-emerald-100 mt-2 block capitalize">
            {simulation.payoffDate || 'Sin deudas'}
          </span>
          <span className="text-xs text-emerald-700/80 dark:text-emerald-300/80 mt-1 block">
            {simulation.payoffMonths} meses en total{' '}
            {simulation.monthsSaved > 0 && (
              <strong className="underline">({simulation.monthsSaved} meses antes)</strong>
            )}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <TrendingDown className="w-4 h-4 text-emerald-500" />
            <span>Intereses Ahorrados</span>
          </div>
          <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-2 block">
            ${simulation.interestSaved.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
          <span className="text-xs text-slate-400 mt-1 block">
            Dinero que conservas en tu bolsillo
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <DollarSign className="w-4 h-4 text-rose-500" />
            <span>Saldo Total a Liquidar</span>
          </div>
          <span className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400 mt-2 block">
            ${totalCurrentDebt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-xs text-slate-400 mt-1 block">
            {activeDebts.length} pasivo(s) activo(s)
          </span>
        </div>
      </div>

      {/* Lista de Deudas y Botón para Agregar */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-100">
            Tus Pasivos y Préstamos Activos
          </h4>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-xs font-medium text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Registrar Deuda / Préstamo</span>
          </button>
        </div>

        {activeDebts.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            ¡Felicidades! No tienes pasivos registrados.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {activeDebts.map((debt, index) => (
              <div key={debt.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-mono font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div>
                    <h5 className="font-medium text-sm text-slate-800 dark:text-slate-100">
                      {debt.name}
                    </h5>
                    <span className="text-xs text-slate-400">
                      Tasa: {debt.interest_rate_annual}% anual • Cuota mín: ${debt.minimum_payment}/mes
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold font-mono text-sm text-slate-800 dark:text-slate-100 block">
                    ${Number(debt.current_balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para Registrar Deuda Manualmente */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h4 className="font-semibold text-base text-slate-800 dark:text-slate-100 mb-4">
              Registrar Deuda / Crédito
            </h4>
            <form onSubmit={handleCreateDebt} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Nombre (ej: Tarjeta Visa, Crédito Vehicular)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nombre de la deuda"
                  value={newDebtName}
                  onChange={(e) => setNewDebtName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Saldo Actual ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    min="0"
                    placeholder="0.00"
                    value={newDebtBalance}
                    onChange={(e) => setNewDebtBalance(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Tasa Anual (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="24"
                    value={newDebtRate}
                    onChange={(e) => setNewDebtRate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Pago Mínimo Mensual ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="25.00"
                  value={newDebtMinPay}
                  onChange={(e) => setNewDebtMinPay(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium"
                >
                  Guardar Deuda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
