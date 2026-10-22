import React, { useState, useEffect } from 'react';
import { SidurSegment } from '../../../../../packages/shared/src/types';
import { SidurDisplayPreferences } from '../types/sidur.types';
import { ThemeMode } from '../../../lib/theme';
import {
  getRenderedTransliteration,
  getRenderedSpanish,
  isSegmentRequiringMinian,
} from '../services/sidurService';
import { PostureBadge } from './PostureBadge';
import { ChevronLeft, ChevronRight, Minimize2, MoveHorizontal } from 'lucide-react';

interface SidurKavanaModeProps {
  segments: SidurSegment[];
  tefilaTitle: string;
  preferences: SidurDisplayPreferences;
  theme: ThemeMode;
  onClose: () => void;
}

export const SidurKavanaMode: React.FC<SidurKavanaModeProps> = ({
  segments,
  tefilaTitle,
  preferences,
  theme,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Detección del tema activo (claro u oscuro)
  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Soporte para gestos táctiles (Swipe con el dedo para pasar hojas)
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const deltaY = e.changedTouches[0].clientY - touchStartY;

    // Se valida que el desplazamiento horizontal sea dominante y supere el umbral
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        // Deslizar hacia la izquierda -> Siguiente hoja/oración
        setCurrentIndex((prev) => Math.min(prev + 1, segments.length - 1));
      } else {
        // Deslizar hacia la derecha -> Hoja/oración anterior
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
    }
    setTouchStartX(null);
    setTouchStartY(null);
  };

  const currentSegment = segments[currentIndex] || segments[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setCurrentIndex((prev) => Math.min(prev + 1, segments.length - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [segments.length, onClose]);

  if (!currentSegment) return null;

  // Siempre usa YHVH para la transliteración y el español
  const translit = getRenderedTransliteration(currentSegment, 'YHVH');
  const spanish = getRenderedSpanish(currentSegment, 'YHVH');
  const requiresMinian = isSegmentRequiringMinian(currentSegment);

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`fixed inset-0 z-50 flex flex-col justify-between p-4 sm:p-6 select-none animate-fadeIn transition-colors duration-300 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#FAF7EE] text-stone-900'
      }`}
    >
      {/* Barra superior de Kavaná */}
      <header
        className={`flex items-center justify-between pb-4 border-b ${
          isDark ? 'border-slate-800/80' : 'border-amber-900/15'
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs uppercase tracking-widest font-semibold ${
                isDark ? 'text-amber-400' : 'text-amber-800'
              }`}
            >
              Modo Kavaná · Enfoque Total
            </span>
            {requiresMinian && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-400/40">
                👥 Minián
              </span>
            )}
          </div>

          <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>
            {tefilaTitle} — {currentSegment.titleSpanish || 'Rezo'}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <PostureBadge posture={currentSegment.posture} isSilent={currentSegment.isSilent} />

          <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-stone-500'}`}>
            {currentIndex + 1} / {segments.length}
          </span>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                : 'bg-amber-100/90 hover:bg-amber-200 text-stone-800 border border-amber-300/60'
            }`}
            title="Salir del Modo Kavaná (Esc)"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Contenido Central: Gran texto litúrgico tipo hoja de libro */}
      <main className="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full py-6 sm:py-8 overflow-y-auto px-4">
        {currentSegment.moroccanNote && (
          <div
            className={`mb-6 p-3.5 rounded-xl text-xs ${
              isDark
                ? 'bg-amber-950/40 border border-amber-800/60 text-amber-200'
                : 'bg-amber-100/90 border border-amber-300/80 text-amber-950'
            }`}
          >
            <span className="font-bold">🇲🇦 Costumbre Marroquí:</span> {currentSegment.moroccanNote}
          </div>
        )}

        {/* Hebreo Masorético con Niqqud */}
        {preferences.showHebrew && (
          <p
            dir="rtl"
            className={`font-serif text-3xl sm:text-4xl md:text-5xl leading-relaxed sm:leading-loose text-center mb-8 tracking-wide ${
              isDark ? 'text-white' : 'text-stone-950'
            }`}
            style={{ fontFamily: '"Noto Serif Hebrew", "Frank Ruehl CLM", serif' }}
          >
            {currentSegment.hebrew}
          </p>
        )}

        {/* Fonética Masorética (con YHVH) */}
        {preferences.showTranslit && translit && (
          <p
            className={`font-serif text-base sm:text-lg md:text-xl italic text-center mb-6 leading-relaxed ${
              isDark ? 'text-amber-300/90' : 'text-amber-900 font-medium'
            }`}
          >
            {translit}
          </p>
        )}

        {/* Traducción al Español (con YHVH) */}
        {preferences.showSpanish && spanish && (
          <p
            className={`font-sans text-sm sm:text-base md:text-lg text-center max-w-3xl mx-auto leading-relaxed pt-4 border-t ${
              isDark
                ? 'text-slate-400 border-slate-800/80'
                : 'text-stone-700 border-amber-900/15'
            }`}
          >
            {spanish}
          </p>
        )}

        {/* Indicador táctil de pasar hojas */}
        <div className="flex items-center justify-center gap-1.5 mt-6 text-[11px] opacity-60 text-center">
          <MoveHorizontal className="w-3.5 h-3.5" />
          <span>Desliza hacia un lado para pasar las hojas</span>
        </div>
      </main>

      {/* Barra inferior de navegación */}
      <footer
        className={`flex items-center justify-between pt-4 max-w-4xl mx-auto w-full border-t ${
          isDark ? 'border-slate-800/80' : 'border-amber-900/15'
        }`}
      >
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
          disabled={currentIndex === 0}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl disabled:opacity-30 disabled:pointer-events-none text-sm font-semibold transition-colors ${
            isDark
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              : 'bg-stone-200/90 hover:bg-stone-300 text-stone-900'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Anterior</span>
        </button>

        {/* Puntos de progreso estilo folio */}
        <div className="flex items-center gap-1 max-w-[200px] overflow-hidden">
          {segments.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === currentIndex
                  ? isDark
                    ? 'w-6 bg-amber-400'
                    : 'w-6 bg-amber-600'
                  : isDark
                  ? 'w-1.5 bg-slate-800'
                  : 'w-1.5 bg-stone-300'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, segments.length - 1))}
          disabled={currentIndex === segments.length - 1}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors ${
            isDark
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              : 'bg-amber-600 hover:bg-amber-700 text-white'
          }`}
        >
          <span>Siguiente</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </footer>
    </div>
  );
};
