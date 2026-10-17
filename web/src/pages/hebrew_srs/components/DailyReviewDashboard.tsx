import React, { useState } from 'react';
import {
  DailyReviewStats,
  CurriculumPhaseNumber,
  StudyBlock,
} from '../types/hebrewSrs.types';
import { CURRICULUM_PHASES } from '../services/seedData';
import {
  Flame,
  Sparkles,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Layers,
  Zap,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface DailyReviewDashboardProps {
  stats: DailyReviewStats;
  blocks: StudyBlock[];
  onStartDailySession: () => void;
  onStartFreePractice: (mode: 'all' | 'syllables' | 'pairs' | 'phrases' | 'match') => void;
  onOpenRoadmap: () => void;
}

export const DailyReviewDashboard: React.FC<DailyReviewDashboardProps> = ({
  stats,
  blocks,
  onStartDailySession,
  onStartFreePractice,
  onOpenRoadmap,
}) => {
  const [showFreePracticeModal, setShowFreePracticeModal] = useState(false);

  const activePhaseInfo =
    CURRICULUM_PHASES.find((p) => p.number === stats.activePhase) || CURRICULUM_PHASES[0];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* TARJETA HERO PRINCIPAL: LOS 2 BOTONES DE ACCIÓN */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-amber-700 p-6 sm:p-9 text-white shadow-2xl shadow-indigo-600/25 relative overflow-hidden">
        {/* Letra hebrea decorativa de fondo */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-6 translate-y-6">
          <span
            className="text-[200px] font-serif select-none"
            style={{ fontFamily: '"SBL Hebrew", serif' }}
          >
            בָּ
          </span>
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          {/* Insignia de Racha y Fase */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-amber-950 font-extrabold text-xs shadow-md">
              <Flame className="w-4 h-4 fill-current text-amber-700" />
              <span>{stats.streak.current_streak} {stats.streak.current_streak === 1 ? 'DÍA' : 'DÍAS'} DE RACHA</span>
            </div>

            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-semibold text-indigo-100">
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>{activePhaseInfo.title}</span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {stats.streak.completed_today
                ? '¡Meta de Hoy Cumplida! Descanso Activo'
                : '¿Listo para tu sesión de lectura de hoy?'}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-indigo-100 max-w-xl">
              {stats.streak.completed_today
                ? 'Completaste tu sesión diaria. Tu cerebro está fijando las conexiones sinápticas. Puedes descansar o hacer práctica libre.'
                : '10 ejercicios automáticos (Pares mínimos, Ensamblador de palabras del Siddur y Mnemotecnia). Cero configuración.'}
            </p>
          </div>

          {/* LOS 2 BOTONES PRINCIPALES */}
          <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* BOTÓN 1: MI SESIÓN DE HOY */}
            <button
              onClick={onStartDailySession}
              className="py-4 px-7 rounded-2xl bg-white text-indigo-900 font-extrabold text-base shadow-xl hover:bg-indigo-50 active:scale-98 flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>
                {stats.streak.completed_today
                  ? 'Repetir Sesión del Día'
                  : '▶ Iniciar Mi Sesión de Hoy (10 Ejercicios)'}
              </span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            {/* BOTÓN 2: PRÁCTICA LIBRE */}
            <button
              onClick={() => setShowFreePracticeModal(true)}
              className="py-4 px-6 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Práctica Libre (Sin límites)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ESTADO DE LAS 5 CAJAS LEITNER (Memoria a Largo Plazo) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Cajas Leitner (Distribución de tu Memoria)
            </h3>
          </div>
          <button
            onClick={onOpenRoadmap}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>Ver Ruta Completa</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2 sm:gap-3 text-center">
          {[1, 2, 3, 4, 5].map((lvl) => {
            const count = stats.levelDistribution[lvl as 1 | 2 | 3 | 4 | 5] || 0;
            const isMastered = lvl === 5;

            return (
              <div
                key={`lvl_${lvl}`}
                className={`p-3 sm:p-4 rounded-2xl border transition-all ${
                  isMastered
                    ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                }`}
              >
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 block uppercase">
                  Caja {lvl}
                </span>
                <span
                  className={`text-xl sm:text-2xl font-extrabold my-1 block ${
                    isMastered ? 'text-amber-600 dark:text-amber-400' : 'text-slate-800 dark:text-white'
                  }`}
                >
                  {count}
                </span>
                <span className="text-[10px] text-slate-500 font-medium hidden sm:block">
                  {lvl === 1 && '1 día'}
                  {lvl === 2 && '3 días'}
                  {lvl === 3 && '7 días'}
                  {lvl === 4 && '14 días'}
                  {lvl === 5 && 'Dominadas ⭐'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL DE PRÁCTICA LIBRE */}
      {showFreePracticeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-indigo-600" />
                <span>¿Qué deseas practicar libremente?</span>
              </h3>
              <button
                onClick={() => setShowFreePracticeModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              La práctica libre no altera los intervalos de tus Cajas Leitner ni tu calendario SRS.
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => {
                  setShowFreePracticeModal(false);
                  onStartFreePractice('all');
                }}
                className="w-full p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-left hover:border-indigo-500 flex items-center justify-between transition-colors"
              >
                <div>
                  <h4 className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
                    🎲 Entrenamiento Mixto Completo
                  </h4>
                  <p className="text-xs text-slate-500">Mezcla todas las mecánicas</p>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-500" />
              </button>

              <button
                onClick={() => {
                  setShowFreePracticeModal(false);
                  onStartFreePractice('syllables');
                }}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left hover:border-indigo-500 flex items-center justify-between transition-colors"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    🧩 Ensamblador de Sílabas del Siddur
                  </h4>
                  <p className="text-xs text-slate-500">Arma palabras bíblicas con fichas</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  setShowFreePracticeModal(false);
                  onStartFreePractice('pairs');
                }}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left hover:border-indigo-500 flex items-center justify-between transition-colors"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    ⚡ Discriminación de Pares Mínimos
                  </h4>
                  <p className="text-xs text-slate-500">Agudeza visual entre signos parecidos</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  setShowFreePracticeModal(false);
                  onStartFreePractice('phrases');
                }}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left hover:border-indigo-500 flex items-center justify-between transition-colors"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    📖 Lectura de Frases (Shema & Berajot)
                  </h4>
                  <p className="text-xs text-slate-500">Práctica de oraciones completas con audio</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
