import React from 'react';
import { SidurSection } from '../../../../../packages/shared/src/types';

interface SidurSectionNavProps {
  sections: SidurSection[];
  activeSectionId: string | 'all';
  onSelectSection: (id: string | 'all') => void;
}

export const SidurSectionNav: React.FC<SidurSectionNavProps> = ({
  sections,
  activeSectionId,
  onSelectSection,
}) => {
  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs border-b border-slate-200/80 dark:border-slate-800/80 py-2.5 px-4 sticky top-[61px] z-20">
      <div className="max-w-6xl mx-auto flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <button
          onClick={() => onSelectSection('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeSectionId === 'all'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Todo el Rezo Completo
        </button>

        {sections.map((sec, idx) => {
          const isCurrent = activeSectionId === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => onSelectSection(sec.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isCurrent
                  ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200 border border-amber-300 dark:border-amber-700 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
              }`}
            >
              <span className="opacity-60 font-mono text-[11px]">{idx + 1}.</span>
              <span>{sec.titleSpanish}</span>
              <span dir="rtl" className="font-serif text-[11px] opacity-75">
                {sec.titleHebrew.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
