import React from 'react';
import { SidurTefila, SidurTefilaId } from '../../../../../packages/shared/src/types';
import { Clock } from 'lucide-react';

interface SidurTefilaSelectorProps {
  tefilot: SidurTefila[];
  selectedTefilaId: SidurTefilaId;
  suggestedTefilaId: SidurTefilaId;
  onSelectTefila: (id: SidurTefilaId) => void;
}

export const SidurTefilaSelector: React.FC<SidurTefilaSelectorProps> = ({
  tefilot,
  selectedTefilaId,
  suggestedTefilaId,
  onSelectTefila,
}) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 py-2.5 px-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Pestañas de Tefilá */}
        <div className="flex items-center gap-2 overflow-x-auto w-full pb-1 md:pb-0 scrollbar-none">
          {tefilot.map((t) => {
            const isSelected = t.id === selectedTefilaId;
            const isSuggested = t.id === suggestedTefilaId;

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

                {/* Badge sugerido según hora actual */}
                {isSuggested && (
                  <span
                    title="Horario litúrgico actual"
                    className={`flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                      isSelected
                        ? 'bg-slate-950/15 text-slate-950'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200'
                    }`}
                  >
                    <Clock className="w-2.5 h-2.5" />
                    <span>Ahora</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
