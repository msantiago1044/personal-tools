import React from 'react';
import {
  MethodComparisonMetrics,
  ReviewLog,
  HebrewCard,
} from '../types/hebrewSrs.types';
import {
  BarChart3,
  Clock,
  Trophy,
  Zap,
  TrendingUp,
  Activity,
  Award,
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
  const cardMap = React.useMemo(() => new Map(cards.map((c) => [c.id, c])), [cards]);

  // Encontrar el método con menor tiempo de reacción (más rápido) con al menos 1 review
  const methodsWithReviews = metrics.filter((m) => m.totalReviews > 0);

  const fastestMethod = [...methodsWithReviews].sort(
    (a, b) => a.avgReactionTimeMs - b.avgReactionTimeMs
  )[0];

  // Encontrar el método con mayor retención a 7 días
  const highestRetentionMethod = [...methodsWithReviews].sort(
    (a, b) => b.retention7DaysPercent - a.retention7DaysPercent
  )[0];

  // Máximo tiempo para normalizar las barras
  const maxReactionTime = Math.max(...metrics.map((m) => m.avgReactionTimeMs), 4000);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* CABECERA DE EVALUACIÓN CIENTÍFICA */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              <span>Comparativa Científica de Métodos de Aprendizaje</span>
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Evaluación psicométrica objetiva: Latencia de reconocimiento (*Recall Timer*) vs.
              Retención real a 7 días.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <Activity className="w-4 h-4 text-indigo-600" />
            <span>{logs.length} revisiones analizadas</span>
          </div>
        </div>

        {/* HALLAZGOS Y DESTACADOS EXPERIMENTALES */}
        {methodsWithReviews.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 border-t border-slate-100 dark:border-slate-700/80">
            {fastestMethod && (
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500 text-white">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Menor Tiempo de Reacción
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {fastestMethod.methodLabel}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Promedio de{' '}
                    <strong className="text-emerald-600 dark:text-emerald-400 font-mono">
                      {fastestMethod.avgReactionTimeMs} ms
                    </strong>{' '}
                    por tarjeta. Refleja mayor fluidez de decodificación inmediata.
                  </p>
                </div>
              </div>
            )}

            {highestRetentionMethod && (
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500 text-white">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Mayor Retención a 7 Días
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {highestRetentionMethod.methodLabel}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Tasa de consolidación del{' '}
                    <strong className="text-amber-600 dark:text-amber-400 font-mono">
                      {highestRetentionMethod.retention7DaysPercent}%
                    </strong>{' '}
                    en intervalos de 7+ días.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* TARJETAS COMPARATIVAS POR CADA MÉTODO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((m) => {
          const latencyBarPercent =
            m.avgReactionTimeMs > 0 ? Math.min(100, (m.avgReactionTimeMs / maxReactionTime) * 100) : 0;

          return (
            <div
              key={m.method}
              className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {m.methodLabel}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                  {m.totalReviews} revisiones
                </span>
              </div>

              {/* Métricas Principales */}
              <div className="space-y-3 pt-2">
                {/* 1. Latencia de Reacción */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      Latencia de Respuesta Promedio
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {m.avgReactionTimeMs > 0 ? `${m.avgReactionTimeMs} ms` : 'Sin datos'}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${latencyBarPercent}%` }}
                    />
                  </div>
                </div>

                {/* 2. Retención a 7 días */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                      Retención Consolidada (7+ días)
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {m.retention7DaysPercent}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${m.retention7DaysPercent}%` }}
                    />
                  </div>
                </div>

                {/* 3. Indicadores secundarios */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Tasa de Acierto</span>
                    <strong className="text-slate-800 dark:text-slate-200">
                      {m.accuracyRate}%
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Tarjetas Dominadas (N5)</span>
                    <strong className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      {m.masteredCardsCount}
                    </strong>
                  </div>
                  {m.method === 'kinetic' && m.tactileAdherencePercent !== undefined && (
                    <div className="col-span-2 pt-1">
                      <span className="text-slate-400 block text-[11px]">Adherencia a Escritura a Mano</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">
                        {m.tactileAdherencePercent}% de confirmación
                      </strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* TABLA DE REGISTROS DE REVISIÓN RECIENTES */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Registro Experimental Reciente (Últimos Repasos)
        </h3>

        {logs.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            Aún no has registrado repasos. Inicia una sesión de estudio para alimentar los datos
            experimentales.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-lg">Símbolo</th>
                  <th className="py-2.5 px-3">Método</th>
                  <th className="py-2.5 px-3">Latencia (ms)</th>
                  <th className="py-2.5 px-3">Calificación</th>
                  <th className="py-2.5 px-3">Transición Leitner</th>
                  <th className="py-2.5 px-3 rounded-r-lg">Escritura</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {logs.slice(0, 10).map((log) => {
                  const card = cardMap.get(log.card_id);
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                      <td className="py-2.5 px-3 font-serif text-base font-bold text-slate-900 dark:text-white">
                        {card?.combined_symbol || '—'}
                        <span className="text-xs font-sans text-slate-400 font-normal ml-2">
                          ({card?.transliteration})
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-medium capitalize">
                        {log.method_used.replace('_', ' ')}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {log.reaction_time_ms} ms
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            log.rating_score === 'again'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              : log.rating_score === 'hard'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                              : log.rating_score === 'good'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                          }`}
                        >
                          {log.rating_score}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        Nivel {log.previous_level} →{' '}
                        <strong className="text-slate-900 dark:text-white">
                          Nivel {log.new_level}
                        </strong>
                      </td>
                      <td className="py-2.5 px-3">
                        {log.tactile_verified ? (
                          <span className="text-emerald-600 font-semibold">✓ En papel</span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
