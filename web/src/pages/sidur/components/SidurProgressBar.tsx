import React, { useState, useEffect, useMemo } from 'react';
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
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sections.length) return;

      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const totalPct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollY / docHeight) * 100)) : 0;
      setOverallPercent(totalPct);

      // Si hay una sección específica filtrada en la vista, su índice es fijo
      if (activeSectionId !== 'all') {
        const found = sections.findIndex((s) => s.id === activeSectionId);
        if (found !== -1) {
          setActiveIdx(found);
          setActiveSectionPercent(totalPct);
          return;
        }
      }

      // Cálculo por secciones visibles en el documento
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
          currentSectionPct = Math.min(100, Math.max(0, ((viewportMid - top) / Math.max(height, 1)) * 100));
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
    handleScroll(); // Evaluación inicial

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections, activeSectionId]);

  const activeSection = sections[activeIdx] || sections[0];
  const remainingCount = Math.max(0, sections.length - 1 - activeIdx);

  const handleJumpToSection = (sectionId: string) => {
    onSelectSection('all');
    setTimeout(() => {
      const el = document.getElementById(`section-${sectionId}`);
      if (el) {
        const yOffset = -140; // compensar header y selector sticky
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
    }, 50);
  };

  if (!sections || sections.length === 0) return null;

  return (
    <div className="sticky top-[58px] md:top-[65px] z-20 backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-2 transition-all shadow-xs select-none">
      <div className="max-w-6xl mx-auto space-y-1.5">
        {/* Fila superior: Indicadores de sección actual y restantes estilo capítulo */}
        <div className="flex items-center justify-between gap-2 text-xs">
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

            {activeSection.titleHebrew && (
              <span
                dir="rtl"
                className="hidden sm:inline font-serif text-slate-500 dark:text-slate-400 text-[11px] truncate"
              >
                ({activeSection.titleHebrew})
              </span>
            )}
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

            <span className="font-mono font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {Math.round(overallPercent)}%
            </span>
          </div>
        </div>

        {/* Barra de progreso subdividida estilo video de YouTube */}
        <div className="relative flex items-center gap-1 w-full h-2.5 sm:h-3 rounded-full bg-slate-200/70 dark:bg-slate-800/80 p-0.5 overflow-hidden">
          {sections.map((sec, idx) => {
            const isCompleted = idx < activeIdx;
            const isCurrent = idx === activeIdx;
            const isPending = idx > activeIdx;

            return (
              <div
                key={sec.id}
                onClick={() => handleJumpToSection(sec.id)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="relative flex-1 h-full rounded-xs bg-slate-300/60 dark:bg-slate-700/60 overflow-hidden cursor-pointer group transition-all"
                title={`${idx + 1}. ${sec.titleSpanish} (${sec.titleHebrew}) · Clic para saltar`}
              >
                {/* Relleno del capítulo */}
                {isCompleted && (
                  <div className="w-full h-full bg-amber-500 dark:bg-amber-400 transition-all duration-300" />
                )}

                {isCurrent && (
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 dark:from-amber-400 dark:to-amber-300 transition-all duration-150 relative"
                    style={{ width: `${Math.max(12, activeSectionPercent)}%` }}
                  >
                    {/* Punto brillante en el extremo activo */}
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white shadow-xs rounded-full animate-pulse" />
                  </div>
                )}

                {isPending && (
                  <div className="w-0 h-full bg-amber-500/30 group-hover:w-full transition-all duration-200" />
                )}

                {/* Resaltado al pasar el ratón */}
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Tooltip dinámico al pasar el cursor sobre un capítulo */}
        {hoveredIdx !== null && sections[hoveredIdx] && (
          <div className="text-[11px] text-center text-amber-800 dark:text-amber-300 font-medium py-0.5 animate-fadeIn">
            <span>
              Capítulo {hoveredIdx + 1}: {sections[hoveredIdx].titleSpanish}
            </span>
            <span dir="rtl" className="font-serif ml-1.5 opacity-80">
              · {sections[hoveredIdx].titleHebrew}
            </span>
            <span className="text-slate-400 dark:text-slate-500 ml-1.5">
              ({sections[hoveredIdx].segments.length} oraciones · Haz clic para ir)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
