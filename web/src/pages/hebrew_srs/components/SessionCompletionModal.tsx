import React from 'react';
import { DailySessionSummary } from '../types/hebrewSrs.types';
import { Flame, Trophy, Award, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';

interface SessionCompletionModalProps {
  summary: DailySessionSummary;
  onFinishAndRest: () => void;
  onGoToFreePractice: () => void;
}

export const SessionCompletionModal: React.FC<SessionCompletionModalProps> = ({
  summary,
  onFinishAndRest,
  onGoToFreePractice,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in zoom-in-95">
        {/* Medalla e Icono de Racha */}
        <div className="relative inline-block mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-500/25 mx-auto">
            <Trophy className="w-10 h-10" />
          </div>
          <div className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center gap-1 shadow-md">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>{summary.streak} {summary.streak === 1 ? 'día' : 'días'}</span>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            ¡Meta de Hoy Completada!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Has completado tus 10 ejercicios diarios con éxito.
          </p>
        </div>

        {/* TARJETA DESTACADA: EL MÉTODO QUE MÁS FUNCIONÓ HOY */}
        <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-left space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Tu método más efectivo hoy</span>
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            ⭐ {summary.bestMethodToday}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {summary.bestMethodDescription}
          </p>
        </div>

        {/* Resumen de Métricas */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] text-slate-400 block">Precisión Global</span>
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {summary.accuracyPercent}% aciertos
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] text-slate-400 block">Velocidad Promedio</span>
            <span className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400">
              {(summary.avgReactionTimeMs / 1000).toFixed(2)}s
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 italic">
          "{summary.verdictText}"
        </p>

        {/* Acciones del usuario */}
        <div className="flex flex-col gap-2.5 pt-2">
          <button
            onClick={onFinishAndRest}
            className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Aceptar y Descansar (Recomendado)</span>
          </button>
          <button
            onClick={onGoToFreePractice}
            className="w-full py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ir a Práctica Libre sin Límites</span>
          </button>
        </div>
      </div>
    </div>
  );
};
