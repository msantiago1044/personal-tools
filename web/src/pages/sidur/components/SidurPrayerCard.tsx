import React, { useState } from 'react';
import { SidurSegment } from '../../../../../packages/shared/src/types';
import { SidurDisplayPreferences } from '../types/sidur.types';
import {
  getRenderedTransliteration,
  getRenderedSpanish,
  isSegmentRequiringMinian,
} from '../services/sidurService';
import { PostureBadge } from './PostureBadge';
import { Copy, Check } from 'lucide-react';

interface SidurPrayerCardProps {
  segment: SidurSegment;
  preferences: SidurDisplayPreferences;
  index: number;
}

export const SidurPrayerCard: React.FC<SidurPrayerCardProps> = ({
  segment,
  preferences,
  index,
}) => {
  const [copied, setCopied] = useState(false);

  // Nombres Sagrados fijados a YHVH
  const translitText = getRenderedTransliteration(segment, 'YHVH');
  const spanishText = getRenderedSpanish(segment, 'YHVH');
  const requiresMinian = isSegmentRequiringMinian(segment);

  const handleCopy = () => {
    const full = `${segment.titleSpanish || ''}\n\n${segment.hebrew}\n\n${translitText}\n\n${spanishText}`;
    navigator.clipboard.writeText(full.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mapeo dinámico de tamaño de fuente
  const getHebrewFontSize = () => {
    switch (preferences.fontSize) {
      case 'sm':
        return 'text-lg leading-relaxed';
      case 'base':
        return 'text-xl md:text-2xl leading-loose';
      case 'lg':
        return 'text-2xl md:text-3xl leading-loose';
      case 'xl':
        return 'text-3xl md:text-4xl leading-loose';
    }
  };

  const getSubFontSize = () => {
    switch (preferences.fontSize) {
      case 'sm':
        return 'text-xs';
      case 'base':
        return 'text-sm';
      case 'lg':
        return 'text-base';
      case 'xl':
        return 'text-lg';
    }
  };

  return (
    <article className="relative bg-white/70 dark:bg-[#1a202c]/70 rounded-xl p-5 md:p-6 border border-amber-900/15 dark:border-amber-500/20 shadow-xs hover:border-amber-500/40 dark:hover:border-amber-400/40 transition-all duration-200 backdrop-blur-2xs">
      {/* Encabezado del segmento: Título + Postura + Botón copiar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-amber-900/10 dark:border-amber-400/15">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-md bg-amber-100/80 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-xs font-serif font-bold flex items-center justify-center shrink-0 border border-amber-300/60 dark:border-amber-700/60">
            {index + 1}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif tracking-wide">
                {segment.titleSpanish || 'Rezo'}
              </h3>
              {segment.titleHebrew && (
                <span dir="rtl" className="text-xs font-serif text-amber-800 dark:text-amber-300 font-semibold">
                  {segment.titleHebrew}
                </span>
              )}
              {requiresMinian && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60">
                  👥 Minián
                </span>
              )}
            </div>
            {segment.titleTranslit && (
              <p className="text-xs text-slate-500 dark:text-slate-400 italic font-serif">
                {segment.titleTranslit}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <PostureBadge posture={segment.posture} isSilent={segment.isSilent} />

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors"
            title="Copiar texto de la oración"
            aria-label="Copiar texto de la oración"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Nota litúrgica particular marroquí estilizada como glosa tradicional */}
      {segment.moroccanNote && (
        <div className="mb-4 p-3 rounded-lg bg-amber-100/60 dark:bg-amber-950/40 border border-amber-300/70 dark:border-amber-800/60 flex items-start gap-2.5 text-xs text-amber-950 dark:text-amber-200">
          <span className="text-base shrink-0 select-none">🇲🇦</span>
          <div className="leading-relaxed">
            <strong className="font-semibold text-amber-900 dark:text-amber-300">Minhag Maroko:</strong>{' '}
            <span>{segment.moroccanNote}</span>
          </div>
        </div>
      )}

      {/* Capa 1: Hebreo Masorético con Niqqud */}
      {preferences.showHebrew && (
        <div className="mb-4">
          <p
            dir="rtl"
            className={`font-serif text-slate-950 dark:text-amber-50 tracking-wide select-text leading-loose ${getHebrewFontSize()}`}
            style={{ fontFamily: '"Noto Serif Hebrew", "Frank Ruehl CLM", serif' }}
          >
            {segment.hebrew}
          </p>
        </div>
      )}

      {/* Capa 2: Transliteración Fonética en Español */}
      {preferences.showTranslit && translitText && (
        <div className="mb-3">
          <p
            className={`font-serif text-slate-700 dark:text-slate-300 italic leading-relaxed select-text ${getSubFontSize()}`}
          >
            {translitText}
          </p>
        </div>
      )}

      {/* Capa 3: Traducción Fiel al Español */}
      {preferences.showSpanish && spanishText && (
        <div className="pt-2.5 border-t border-amber-900/10 dark:border-amber-400/15">
          <p
            className={`text-slate-800 dark:text-slate-300 font-sans leading-relaxed select-text ${getSubFontSize()}`}
          >
            {spanishText}
          </p>
        </div>
      )}
    </article>
  );
};
