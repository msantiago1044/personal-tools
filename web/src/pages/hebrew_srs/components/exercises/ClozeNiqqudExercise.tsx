import React, { useState } from 'react';
import { ClozeNiqqudItem } from '../../types/hebrewSrs.types';
import { HebrewAudioService } from '../../services/hebrewAudio';
import { Volume2, CheckCircle2, XCircle, ArrowRight, HelpCircle } from 'lucide-react';

interface ClozeNiqqudExerciseProps {
  item: ClozeNiqqudItem;
  onComplete: (isCorrect: boolean, reactionTimeMs: number) => void;
}

export const ClozeNiqqudExercise: React.FC<ClozeNiqqudExerciseProps> = ({
  item,
  onComplete,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [startTime] = useState(performance.now());
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedIdx(index);
    setIsAnswered(true);

    const chosen = item.options[index];
    HebrewAudioService.speak(chosen.combined_preview, item.audio_hint);
  };

  const handleNext = () => {
    const isCorrect = selectedIdx !== null ? item.options[selectedIdx].is_correct : false;
    const reactionTime = Math.round(performance.now() - startTime);
    onComplete(isCorrect, reactionTime);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
      {/* Cabecera */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" />
          Decodificación Inversa (Cloze)
        </span>
        <button
          onClick={() => HebrewAudioService.speak(item.base_consonant, item.audio_hint)}
          className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-indigo-600 transition-colors"
          title="Escuchar sonido objetivo"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Consonante base y sonido objetivo */}
      <div className="text-center py-2 space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          ¿Qué signo de Niqqud debe agregarse para que suene como:
        </span>
        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          "{item.target_sound}"?
        </div>

        {/* Muestra la letra con un círculo punteado debajo */}
        <div className="inline-block p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-indigo-300 dark:border-indigo-800 my-2">
          <span
            className="text-7xl font-serif font-bold text-slate-900 dark:text-white"
            style={{ fontFamily: '"SBL Hebrew", serif' }}
          >
            {selectedIdx !== null
              ? item.options[selectedIdx].combined_preview
              : `${item.base_consonant}◌`}
          </span>
        </div>
      </div>

      {/* Opciones de Niqqud */}
      <div className="grid grid-cols-2 gap-3">
        {item.options.map((option, idx) => {
          const isSelected = selectedIdx === idx;
          let btnClass =
            'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-800 dark:text-slate-100';

          if (isAnswered) {
            if (option.is_correct) {
              btnClass =
                'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/30';
            } else if (isSelected) {
              btnClass =
                'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-100';
            } else {
              btnClass = 'opacity-30 border-slate-200 dark:border-slate-800';
            }
          }

          return (
            <button
              key={`niqqud_opt_${idx}`}
              onClick={() => handleSelectOption(idx)}
              disabled={isAnswered}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${btnClass}`}
            >
              <span
                className="text-4xl font-serif font-bold"
                style={{ fontFamily: '"SBL Hebrew", serif' }}
              >
                {option.combined_preview}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {option.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Botón continuar */}
      {isAnswered && (
        <div className="pt-2 animate-in fade-in">
          <button
            onClick={handleNext}
            className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <span>Continuar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
