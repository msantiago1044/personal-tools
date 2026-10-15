import React from 'react';
import {
  StudyBlock,
  DailyReviewStats,
  LearningMethod,
  SRSLevel,
} from '../types/hebrewSrs.types';
import { METHOD_LABELS, LEITNER_INTERVALS_DAYS } from '../services/srsAlgorithm';
import {
  Clock,
  Sparkles,
  Trophy,
  CheckCircle2,
  Layers,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface DailyReviewDashboardProps {
  blocks: StudyBlock[];
  stats: DailyReviewStats;
  blockSettings: Record<string, LearningMethod>;
  selectedBlockId: string;
  onSelectBlock: (blockId: string) => void;
  onStartStudy: (blockId?: string) => void;
  onOpenSettings: () => void;
}

export const DailyReviewDashboard: React.FC<DailyReviewDashboardProps> = ({
  blocks,
  stats,
  blockSettings,
  selectedBlockId,
  onSelectBlock,
  onStartStudy,
  onOpenSettings,
}) => {
  // Cálculo de meta diaria
  const totalTargetToday = stats.completedToday + stats.totalPendingToday;
  const progressPercent =
    totalTargetToday > 0 ? Math.round((stats.completedToday / totalTargetToday) * 100) : 100;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* TARJETA HERO: ESTADO DIARIO Y LLAMADA A LA ACCIÓN */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-amber-600 p-6 sm:p-8 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-8 translate-y-8">
          <span
            className="text-[180px] font-serif select-none"
            style={{ fontFamily: '"SBL Hebrew", serif' }}
          >
            אָ
          </span>
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Sesión Diaria de Decodificación</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {stats.totalPendingToday > 0
              ? `Tienes ${stats.totalPendingToday} tarjetas pendientes para hoy`
              : '¡Todo al día! Has completado tus repasos de hoy'}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-indigo-100 max-w-xl">
            La repetición espaciada refuerza la memoria de trabajo y afianza la decodificación
            automática de las vocales Tiberianas (Niqqud).
          </p>

          {/* Barra de progreso diario */}
          <div className="mt-5 space-y-2 max-w-md">
            <div className="flex justify-between text-xs font-medium text-indigo-200">
              <span>Progreso de hoy: {stats.completedToday} repasadas</span>
              <span>{progressPercent}% completado</span>
            </div>
            <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm p-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onStartStudy(selectedBlockId === 'all' ? undefined : selectedBlockId)}
              disabled={stats.totalPendingToday === 0}
              className="px-6 py-3 rounded-xl bg-white text-indigo-700 font-bold text-sm shadow-md hover:bg-indigo-50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>
                {stats.totalPendingToday > 0
                  ? `Comenzar Repaso (${stats.totalPendingToday})`
                  : 'Sin pendientes'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenSettings}
              className="px-4 py-3 rounded-xl bg-white/15 hover:bg-white/20 backdrop-blur-sm text-white font-medium text-sm transition-colors"
            >
              Asignar Métodos a Bloques
            </button>
          </div>
        </div>
      </div>

      {/* MÉTRICAS RÁPIDAS DE CABECERA */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase">Pendientes</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {stats.totalPendingToday}
          </p>
          <span className="text-[11px] text-slate-500">Listas para repasar</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase">Repasadas Hoy</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {stats.completedToday}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Tarjetas evaluadas
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase">Dominadas (N5)</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {stats.masteredCount}
          </p>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            Intervalo de 30 días
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase">Total Mazo</span>
            <Layers className="w-4 h-4 text-slate-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {stats.totalCards}
          </p>
          <span className="text-[11px] text-slate-500">Letras y combinaciones</span>
        </div>
      </div>

      {/* PIRÁMIDE / DISTRIBUCIÓN DE LAS 5 CAJAS LEITNER */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>Distribución en las 5 Cajas Leitner (SRS)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cada acierto asciende la tarjeta a intervalos mayores de reposo
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {([1, 2, 3, 4, 5] as SRSLevel[]).map((level) => {
            const count = stats.levelDistribution[level];
            const days = LEITNER_INTERVALS_DAYS[level];
            const isMastered = level === 5;

            return (
              <div
                key={level}
                className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                  isMastered
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
                    : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider">Caja {level}</span>
                  {isMastered && <Trophy className="w-3.5 h-3.5 text-amber-500" />}
                </div>
                <div className="my-3">
                  <span className="text-3xl font-extrabold">{count}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">tarjetas</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Reposo: {days} {days === 1 ? 'día' : 'días'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SELECTOR DE BLOQUES DE ESTUDIO (AISLAMIENTO EXPERIMENTAL) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-500" />
            <span>Bloques de Estudio Aislados (Anti-Sesgo)</span>
          </h3>
          <span className="text-xs text-slate-500">
            Control de variables de arrastre fonético
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blocks.map((block) => {
            const assignedMethod = blockSettings[block.id] || 'srs_puro';
            const isSelected = selectedBlockId === block.id;

            return (
              <div
                key={block.id}
                onClick={() => onSelectBlock(isSelected ? 'all' : block.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/30 dark:bg-indigo-950/20'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      Vocal: {block.vowel_focus}
                    </span>
                    <h4 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                      {block.name}
                    </h4>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-semibold border border-amber-300/40">
                    {METHOD_LABELS[assignedMethod]}
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {block.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                    {isSelected ? '✓ Bloque Seleccionado' : 'Clic para filtrar este bloque'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartStudy(block.id);
                    }}
                    className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    <span>Repasar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
