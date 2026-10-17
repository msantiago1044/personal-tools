import React from 'react';
import {
  MethodComparisonMetrics,
  ReviewLog,
  HebrewCard,
} from '../types/hebrewSrs.types';
import {
  BarChart3,
  Clock,
  Zap,
  Award,
  Activity,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface MetricsDashboardProps {
  metrics: MethodComparisonMetrics[];
  logs: ReviewLog[];
  cards: HebrewCard[];
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  metrics,
  logs,
  cards,
}) => {
  // Métodos que tienen al menos 1 revisión
  const activeMetrics = metrics.filter((m) => m.totalReviews > 0);

  // Método con menor tiempo de reacción
  const fastestMethod = [...activeMetrics].sort(
    (a, b) => a.avgReactionTimeMs - b.avgReactionTimeMs
  )[0];

  // Método con mayor retención
  const highestRetentionMethod = [...activeMetrics].sort(
    (a, b) => b.retention7DaysPercent - a.retention7DaysPercent
  )[0];

  // Método con mayor tasa de error (punto a reforzar)
  const lowestAccuracyMethod = [...activeMetrics].sort(
    (a, b) => a.accuracyRate - b.accuracyRate
  )[0];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* CABECERA PRINCIPAL: DIAGNÓSTICO COGNITIVO */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-1">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Informe Psicométrico de Aprendizaje</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              ¿Qué método te está funcionando más?
            </h2>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <Activity className="w-4 h-4 text-indigo-500" />
            <span>{logs.length} revisiones analizadas</span>
          </div>
        </div>

        {/* VEREDICTO CLARO EN ESPAÑOL */}
        {activeMetrics.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Tarjeta 1: Método más rápido */}
            {fastestMethod && (
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    🥇 Mayor Velocidad de Reconocimiento
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {fastestMethod.methodLabel}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Promedio de{' '}
                    <strong className="text-emerald-700 dark:text-emerald-400 font-mono">
                      {fastestMethod.avgReactionTimeMs} ms
                    </strong>{' '}
                    por respuesta. Este método automatiza tu lectura sin titubear.
                  </p>
                </div>
              </div>
            )}

            {/* Tarjeta 2: Mayor retención a largo plazo */}
            {highestRetentionMethod && (
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    🥇 Mayor Retención Duradera
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {highestRetentionMethod.methodLabel}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    <strong className="text-amber-700 dark:text-amber-400 font-mono">
                      {highestRetentionMethod.retention7DaysPercent}%
                    </strong>{' '}
                    de retención tras una semana. Fija la memoria a largo plazo.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-400 text-xs">
            Aún no has completado sesiones de estudio. Completa tu primera sesión diaria para ver qué
            técnica funciona mejor en tu cerebro.
          </div>
        )}
      </div>

      {/* COMPARATIVA DETALLADA DE TODOS LOS MÉTODOS */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-indigo-500" />
          <span>Comparativa Detallada de Métodos Pedagógicos</span>
        </h3>

        <div className="space-y-3">
          {metrics.map((item) => {
            return (
              <div
                key={item.method}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-slate-800 dark:text-white">
                    {item.methodLabel}
                  </div>
                  <div className="text-xs font-semibold text-slate-500">
                    {item.totalReviews} {item.totalReviews === 1 ? 'ejercicio' : 'ejercicios'}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Velocidad promedio</span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {item.avgReactionTimeMs > 0 ? `${item.avgReactionTimeMs} ms` : '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Tasa de acierto</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {item.totalReviews > 0 ? `${item.accuracyRate}%` : '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Retención a 7 días</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {item.totalReviews > 0 ? `${item.retention7DaysPercent}%` : '—'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
