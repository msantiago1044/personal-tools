import React, { useState, useEffect } from 'react';
import { SidurSection } from '../../../../../packages/shared/src/types';
import { Layers, CheckCircle2 } from 'lucide-react';

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
        const yOffset = -90; // compensar header sticky
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
    }, 40);
  };

  if (!sections || sections.length === 0) return null;

  return (
    <>
      {/* 1. Barra de estado superior limpia y compacta (Sección X de Y) */}
      <div className="sticky top-[57px] z-20 backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-2 transition-all shadow-xs select-none">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400 shrink-0">
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              <span>
                Sección {activeIdx + 1} de {sections.length}:
              </span>
            </span>

            <span className="font-bold text-slate-800 dark:text-slate-100 truncate">
              {activeSection.titleSpanish}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0 text-[11px]">
            {remainingCount === 0 ? (
              <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3 h-3" />
                <span>Última sección</span>
              </span>
            ) : (
              <span className="text-slate-500 dark:text-slate-400">
                Faltan <strong className="text-slate-800 dark:text-slate-200 font-bold">{remainingCount}</strong>{' '}
                {remainingCount === 1 ? 'sección' : 'secciones'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Barra de Progreso Vertical Segmentada estilo capítulos de YouTube */}
      <aside
        aria-label="Progreso vertical del rezo"
        className="fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2 select-none"
      >
        <div
          className="w-3 sm:w-3.5 h-64 sm:h-72 rounded-full bg-slate-200/80 dark:bg-slate-800/90 backdrop-blur-md border border-slate-300/60 dark:border-slate-700/60 p-0.5 flex flex-col gap-1 shadow-md overflow-hidden"
          title={`Progreso: ${Math.round(overallPercent)}%`}
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
                    Clic para saltar
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Porcentaje numérico discreto al pie de la barra vertical */}
        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-xs">
          {Math.round(overallPercent)}%
        </span>
      </aside>
    </>
  );
};
