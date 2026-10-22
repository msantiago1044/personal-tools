import React from 'react';
import { SidurTefila, SidurTefilaId, SidurProgress } from '../../../../../packages/shared/src/types';
import { CheckCircle2, Clock, Flame } from 'lucide-react';

interface SidurTefilaSelectorProps {
  tefilot: SidurTefila[];
  selectedTefilaId: SidurTefilaId;
  suggestedTefilaId: SidurTefilaId;
  onSelectTefila: (id: SidurTefilaId) => void;
  progress: SidurProgress;
  onToggleCompleted: (id: SidurTefilaId) => void;
}

export const SidurTefilaSelector: React.FC<SidurTefilaSelectorProps> = ({
  tefilot,
  selectedTefilaId,
  suggestedTefilaId,
  onSelectTefila,
  progress,
  onToggleCompleted,
}) => {
  const isCompleted = (id: SidurTefilaId): boolean => {
    if (id === 'shajarit') return progress.shajaritCompleted;
    if (id === 'minja') return progress.minjaCompleted;
    if (id === 'arvit') return progress.arvitCompleted;
    return false;
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 py-3 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Pestañas de Tefilá */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {tefilot.map((t) => {
            const isSelected = t.id === selectedTefilaId;
            const isSuggested = t.id === suggestedTefilaId;
            const completed = isCompleted(t.id);

            return (
              <button
                key={t.id}
                onClick={() => onSelectTefila(t.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80'
                }`}
              >
                <span>{t.nameSpanish}</span>
                <span
                  dir="rtl"
                  className={`text-xs font-serif ${
                    isSelected
                      ? 'text-slate-900/80'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {t.nameHebrew.split(' ')[1] || t.nameHebrew}
                </span>

                {/* Badge sugerido según hora */}
                {isSuggested && !completed && (
                  <span
                    title="Horario litúrgico actual"
                    className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 font-medium"
                  >
                    <Clock className="w-2.5 h-2.5" />
                    <span>Ahora</span>
                  </span>
                )}

                {/* Indicador de completado */}
                {completed && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Acciones de cumplimiento y racha */}
        <div className="flex items-center gap-2 text-xs shrink-0 self-end md:self-auto">
          {['shajarit', 'minja', 'arvit'].includes(selectedTefilaId) && (
            <button
              onClick={() => onToggleCompleted(selectedTefilaId)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium border transition-colors ${
                isCompleted(selectedTefilaId)
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <CheckCircle2
                className={`w-4 h-4 ${
                  isCompleted(selectedTefilaId)
                    ? 'text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-900/40'
                    : 'text-slate-400'
                }`}
              />
              <span>
                {isCompleted(selectedTefilaId)
                  ? 'Rezo Completado Hoy'
                  : 'Marcar como Completado'}
              </span>
            </button>
          )}

          {progress.streakDays > 0 && (
            <div
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 font-semibold"
              title={`${progress.streakDays} días consecutivos de tefilá`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
              <span>{progress.streakDays}d racha</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
