import React, { useState, useEffect } from 'react';
import { SidurSegment } from '../../../../../packages/shared/src/types';
import { SidurDisplayPreferences } from '../types/sidur.types';
import {
  getRenderedTransliteration,
  getRenderedSpanish,
} from '../services/sidurService';
import { PostureBadge } from './PostureBadge';
import { ChevronLeft, ChevronRight, Minimize2, Eye, EyeOff } from 'lucide-react';

interface SidurKavanaModeProps {
  segments: SidurSegment[];
  tefilaTitle: string;
  preferences: SidurDisplayPreferences;
  onClose: () => void;
}

export const SidurKavanaMode: React.FC<SidurKavanaModeProps> = ({
  segments,
  tefilaTitle,
  preferences,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const translit = getRenderedTransliteration(
    currentSegment,
    preferences.sacredNameMode
  );
  const spanish = getRenderedSpanish(currentSegment, preferences.sacredNameMode);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col justify-between p-6 select-none animate-fadeIn">
      {/* Barra superior de Kavaná */}
      <header className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            Modo Kavaná · Enfoque Total
          </span>
          <h2 className="text-base font-bold text-white">
            {tefilaTitle} — {currentSegment.titleSpanish || 'Rezo'}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <PostureBadge
            posture={currentSegment.posture}
            isSilent={currentSegment.isSilent}
          />

          <span className="text-xs font-mono text-slate-400">
            {currentIndex + 1} / {segments.length}
          </span>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Salir del Modo Kavaná (Esc)"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Contenido Central: Gran texto litúrgico */}
      <main className="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full py-8 overflow-y-auto px-4">
        {currentSegment.moroccanNote && (
          <div className="mb-6 p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs text-amber-200">
            <span className="font-bold">🇲🇦 Costumbre Marroquí:</span>{' '}
            {currentSegment.moroccanNote}
          </div>
        )}

        {/* Hebreo con Niqqud */}
        {preferences.showHebrew && (
          <p
            dir="rtl"
            className="font-serif text-3xl sm:text-4xl md:text-5xl leading-relaxed sm:leading-loose text-white text-center mb-8 tracking-wide"
            style={{ fontFamily: '"Noto Serif Hebrew", "Frank Ruehl CLM", serif' }}
          >
            {currentSegment.hebrew}
          </p>
        )}

        {/* Fonética */}
        {preferences.showTranslit && translit && (
          <p className="font-sans text-base sm:text-lg md:text-xl italic text-slate-300 text-center mb-6 leading-relaxed">
            {translit}
          </p>
        )}

        {/* Traducción */}
        {preferences.showSpanish && spanish && (
          <p className="font-sans text-sm sm:text-base md:text-lg text-slate-400 text-center max-w-3xl mx-auto leading-relaxed border-t border-slate-800/80 pt-4">
            {spanish}
          </p>
        )}
      </main>

      {/* Barra inferior de navegación */}
      <footer className="flex items-center justify-between border-t border-slate-800/80 pt-4 max-w-4xl mx-auto w-full">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-sm font-semibold transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Anterior</span>
        </button>

        <div className="flex items-center gap-1">
          {segments.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === currentIndex
                  ? 'w-6 bg-amber-400'
                  : 'w-1.5 bg-slate-800 hover:bg-slate-600'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() =>
            setCurrentIndex((prev) => Math.min(prev + 1, segments.length - 1))
          }
          disabled={currentIndex === segments.length - 1}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors"
        >
          <span>Siguiente</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </footer>
    </div>
  );
};
