import React from 'react';
import { CURRICULUM_PHASES } from '../services/seedData';
import { CurriculumPhaseNumber } from '../types/hebrewSrs.types';
import { CheckCircle2, Lock, Sparkles, BookOpen, Layers } from 'lucide-react';

interface RoadmapCurriculumViewProps {
  activePhase: CurriculumPhaseNumber;
  onSelectPhase?: (phase: CurriculumPhaseNumber) => void;
}

export const RoadmapCurriculumView: React.FC<RoadmapCurriculumViewProps> = ({
  activePhase,
  onSelectPhase,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Banner de Bienvenida a la Ruta Litúrgica */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-amber-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-semibold uppercase tracking-wider text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ruta Curricular • Siddur & Jumash</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            5 Fases para Leer Textos Sagrados con Niqqud
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100">
            Avanzas de forma natural desde los sonidos de las vocales abiertas hasta la lectura
            completa del <em>Shemá Yisrael</em>, las <em>Berajot</em> del Siddur y el <em>Génesis</em>.
          </p>
        </div>
      </div>

      {/* Lista de Fases */}
      <div className="space-y-4">
        {CURRICULUM_PHASES.map((phase) => {
          const isCurrent = phase.number === activePhase;
          const isPassed = phase.number < activePhase;

          return (
            <div
              key={`phase_${phase.number}`}
              onClick={() => onSelectPhase?.(phase.number)}
              className={`p-6 rounded-3xl border-2 transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-white dark:bg-slate-800 border-indigo-600 shadow-xl shadow-indigo-600/10 scale-[1.01]'
                  : isPassed
                  ? 'bg-slate-50 dark:bg-slate-900/60 border-emerald-500/50'
                  : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-sm ${
                      isPassed
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-5 h-5" /> : phase.number}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {phase.title}
                    </h3>
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      Signos: {phase.vowel_family}
                    </span>
                  </div>
                </div>

                <div>
                  {isCurrent ? (
                    <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 text-xs font-bold">
                      Fase Activa
                    </span>
                  ) : isPassed ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 text-xs font-bold">
                      Dominada
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-medium flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Por desbloquear
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 space-y-2">
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {phase.description}
                </p>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-700 flex items-center gap-2 text-xs">
                  <BookOpen className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">
                    <strong>Objetivo Bíblico / Siddur:</strong> {phase.siddur_target}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
