import React, { useState, useEffect } from 'react';
import { SidurSection } from '../../../../../packages/shared/src/types';
import { Layers } from 'lucide-react';

interface SidurProgressBarProps {
  sections: SidurSection[];
  activeSectionId: string | 'all';
  onSelectSection: (id: string | 'all') => void;
}

export const SidurProgressBar: React.FC<SidurProgressBarProps> = ({
  sections,
  activeSectionId,
  onSelectSection,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeSectionPercent, setActiveSectionPercent] = useState(0);
  const [overallPercent, setOverallPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sections.length) return;

      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const totalPct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollY / docHeight) * 100)) : 0;
      setOverallPercent(totalPct);

      if (activeSectionId !== 'all') {
        const found = sections.findIndex((s) => s.id === activeSectionId);
        if (found !== -1) {
          setActiveIdx(found);
          setActiveSectionPercent(totalPct);
          return;
        }
      }

      const viewportMid = scrollY + window.innerHeight * 0.35;
      let currentIdx = 0;
      let currentSectionPct = 0;

      for (let i = 0; i < sections.length; i++) {
        const s = sections[i];
        const el = document.getElementById(`section-${s.id}`);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        const top = rect.top + scrollY;
        const height = rect.height;
        const bottom = top + height;

        if (viewportMid >= top && viewportMid <= bottom) {
          currentIdx = i;
          currentSectionPct = Math.min(
            100,
            Math.max(0, ((viewportMid - top) / Math.max(height, 1)) * 100)
          );
          break;
        } else if (viewportMid > bottom) {
          currentIdx = i;
          currentSectionPct = 100;
        }
      }

      setActiveIdx(currentIdx);
      setActiveSectionPercent(currentSectionPct);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections, activeSectionId]);

  const activeSection = sections[activeIdx] || sections[0];
  const remainingCount = Math.max(0, sections.length - 1 - activeIdx);

  const handleJumpToSection = (sectionId: string) => {
    onSelectSection('all');
    setTimeout(() => {
      const el = document.getElementById(`section-${sectionId}`);
      if (el) {
        const yOffset = -70; // compensar header sticky
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
    }, 40);
  };

  if (!sections || sections.length === 0) return null;

  return (
    <aside
      aria-label="Indicador persistente de progreso del rezo"
      className="fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col items-end gap-1.5 select-none pointer-events-auto"
    >
      {/* 1. Indicador persistente de la sección actual (NUNCA se pierde con el scroll) */}
      <div className="flex items-center gap-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-300/80 dark:border-slate-700/80 shadow-md text-xs transition-all max-w-[140px] sm:max-w-[200px]">
        <Layers className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <div className="flex flex-col text-right overflow-hidden">
          <span className="font-bold text-amber-700 dark:text-amber-400 text-[11px] leading-tight whitespace-nowrap">
            Sección {activeIdx + 1} de {sections.length}
          </span>
          <span
            className="font-semibold text-slate-800 dark:text-slate-100 text-[10px] leading-tight truncate"
            title={activeSection.titleSpanish}
          >
            {activeSection.titleSpanish}
          </span>
        </div>
      </div>

      {/* 2. Barra vertical segmentada estilo capítulos de YouTube y contador de secciones restantes */}
      <div className="flex items-center gap-1.5 pr-1">
        <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xs px-1.5 py-0.5 rounded-md border border-slate-200/70 dark:border-slate-800/70 shadow-2xs">
          {remainingCount === 0 ? 'Fin' : `Faltan ${remainingCount}`}
        </span>

        <div
          className="w-3 sm:w-3.5 h-60 sm:h-72 rounded-full bg-slate-200/80 dark:bg-slate-800/90 backdrop-blur-md border border-slate-300/70 dark:border-slate-700/70 p-0.5 flex flex-col gap-1 shadow-md overflow-hidden"
          title={`Progreso total: ${Math.round(overallPercent)}%`}
        >
          {sections.map((sec, idx) => {
            const isCompleted = idx < activeIdx;
            const isCurrent = idx === activeIdx;

            return (
              <div
                key={sec.id}
                onClick={() => handleJumpToSection(sec.id)}
                className="relative flex-1 w-full rounded-xs bg-slate-300/50 dark:bg-slate-700/50 overflow-hidden cursor-pointer group transition-all"
              >
                {/* Relleno vertical del capítulo */}
                {isCompleted && (
                  <div className="w-full h-full bg-amber-500 dark:bg-amber-400 transition-all duration-300" />
                )}

                {isCurrent && (
                  <div
                    className="w-full bg-amber-500 dark:bg-amber-400 transition-all duration-150"
                    style={{ height: `${activeSectionPercent}%` }}
                  />
                )}

                {/* Tooltip flotante hacia la izquierda al pasar el cursor */}
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-slate-900/95 dark:bg-slate-100/95 text-white dark:text-slate-900 text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl flex flex-col gap-0.5 z-50">
                  <span className="font-bold">
                    {idx + 1}. {sec.titleSpanish}
                  </span>
                  <span className="text-[10px] text-amber-400 dark:text-amber-700 font-sans">
                    Clic para saltar a esta sección
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Porcentaje numérico */}
      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-xs mr-1">
        {Math.round(overallPercent)}%
      </span>
    </aside>
  );
};
