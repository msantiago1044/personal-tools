import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { BudgetComparison } from '../../../../packages/shared/src/types';

interface BudgetGaugeCardProps {
  year: number;
  month: number;
}

export const BudgetGaugeCard: React.FC<BudgetGaugeCardProps> = ({ year, month }) => {
  const [data, setData] = useState<BudgetComparison[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchBudgetComparison();
  }, [year, month]);

  const fetchBudgetComparison = async () => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase.rpc('get_monthly_budget_comparison', {
        p_year: year,
        p_month: month,
      });

      if (error) throw error;
      setData(result || []);
    } catch (err) {
      console.error('Error fetching budget comparison:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-slate-400 text-sm animate-pulse p-4">Calculando presupuestos y comparativas...</div>;
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-slate-900 dark:text-slate-100 shadow-sm transition-colors">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Presupuesto del Mes vs Real</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Comparativa de salidas con el tope mensual y el mismo mes del año anterior ({year - 1})
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item) => {
          const isOverBudget = item.percentage_used > 100;
          const isWarning = item.percentage_used >= 80 && item.percentage_used <= 100;

          const barColor = isOverBudget
            ? 'bg-rose-500'
            : isWarning
            ? 'bg-amber-400'
            : 'bg-emerald-500';

          return (
            <div key={item.category_id} className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800/80">
              <div className="flex justify-between items-center text-sm mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.category_color || '#10B981' }}
                  />
                  <span className="font-semibold text-slate-900 dark:text-white">{item.category_name}</span>
                </div>

                <div className="text-right">
                  <span className="font-bold text-slate-900 dark:text-slate-200">${item.actual_amount.toFixed(2)}</span>
                  <span className="text-slate-400 text-xs"> / ${item.estimated_amount.toFixed(2)}</span>
                </div>
              </div>

              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${Math.min(item.percentage_used, 100)}%` }}
                />
              </div>

              <div className="flex justify-between items-center mt-2.5 text-xs text-slate-500 dark:text-slate-400">
                <span className={isOverBudget ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-600 dark:text-slate-300'}>
                  {item.percentage_used}% gastado {isOverBudget ? '(¡Tope superado!)' : '(En margen de ahorro)'}
                </span>

                <span className="text-slate-400">
                  Año anterior ({year - 1}):{' '}
                  <strong className="text-slate-700 dark:text-slate-300">${item.spent_previous_year.toFixed(2)}</strong>
                </span>
              </div>
            </div>
          );
        })}

        {data.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">
            No tienes presupuestos ni gastos registrados para este mes.
          </div>
        )}
      </div>
    </div>
  );
};
