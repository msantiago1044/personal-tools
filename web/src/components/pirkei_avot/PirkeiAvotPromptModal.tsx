import React from 'react';
import { BookOpen, Sparkles, X, Sun, ChevronRight, Clock } from 'lucide-react';
import { PirkeiAvotBookmark } from '../../../../packages/shared/src/types';
import { PIRKEI_AVOT_DATA } from '../../../../packages/shared/src/data/pirkeiAvotData';
import { markPirkeiAvotPromptDismissed } from '../../lib/pirkeiAvot';

interface PirkeiAvotPromptModalProps {
  isOpen: boolean;
  bookmark: PirkeiAvotBookmark;
  greeting?: string;
  onClose: () => void;
  onReadNow: (chapter: number, mishna: number) => void;
  onViewAllChapters: () => void;
}

export const PirkeiAvotPromptModal: React.FC<PirkeiAvotPromptModalProps> = ({
  isOpen,
  bookmark,
  greeting = 'Pausa de Sabiduría',
  onClose,
  onReadNow,
  onViewAllChapters,
}) => {
  if (!isOpen) return null;

  const currentChapter = PIRKEI_AVOT_DATA.find((c) => c.chapter === bookmark.chapter) || PIRKEI_AVOT_DATA[0];
  const currentMishna = currentChapter.mishnayot.find((m) => m.mishna === bookmark.mishna) || currentChapter.mishnayot[0];

  const handleDismiss = () => {
    markPirkeiAvotPromptDismissed();
    onClose();
  };

  const handleContinue = () => {
    markPirkeiAvotPromptDismissed();
    onReadNow(currentChapter.chapter, currentMishna.mishna);
  };

  const handleOpenCatalog = () => {
    markPirkeiAvotPromptDismissed();
    onViewAllChapters();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 dark:bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-amber-900/40 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 transition-all duration-200 relative overflow-hidden">
        {/* Glow decorativo sutil ámbar / dorado */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-amber-500/15 dark:bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* Cabecera con botón de cerrar */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs border border-amber-300/40 dark:border-amber-700/40">
              <Sun className="w-5 h-5 text-amber-500 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{greeting}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                Ética de los Padres (Pirkei Avot)
              </h3>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Cerrar (recordar más tarde)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mensaje inspirador */}
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Tómate un momento de pausa y estudio reflexivo. La tradición enseña que una máxima de sabiduría al mediodía o en la tarde renueva la perspectiva ética de tu día.
        </p>

        {/* Tarjeta con la posición actual guardada */}
        <div className="mb-5 p-4 rounded-2xl bg-gradient-to-br from-amber-50/70 via-amber-50/30 to-transparent dark:from-slate-800/80 dark:to-slate-800/40 border border-amber-200/80 dark:border-amber-800/50">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Tu última lectura guardada
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 font-bold">
              Cap. {currentChapter.chapter} · Mishná {currentMishna.mishna}
            </span>
          </div>

          <div className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
            {currentChapter.titleSpanish}
          </div>

          {currentMishna.sage && (
            <div className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-0.5">
              Sabio: {currentMishna.sage}
            </div>
          )}

          {currentMishna.keyTeaching && (
            <p className="text-xs text-slate-600 dark:text-slate-300 italic mt-2 line-clamp-2">
              «{currentMishna.keyTeaching}»
            </p>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleContinue}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-150 group"
          >
            <BookOpen className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Continuar en Cap. {currentChapter.chapter}, Mishná {currentMishna.mishna}</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>

          <div className="flex items-center justify-between gap-2 mt-1">
            <button
              onClick={handleOpenCatalog}
              className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition py-1.5 px-2"
            >
              Ver índice de capítulos
            </button>
            <button
              onClick={handleDismiss}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition py-1.5 px-2"
            >
              Más tarde
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
