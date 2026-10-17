import React, { useState } from 'react';
import { MinimalPairItem } from '../../types/hebrewSrs.types';
import { HebrewAudioService } from '../../services/hebrewAudio';
import { Volume2, CheckCircle2, XCircle, ArrowRight, Eye } from 'lucide-react';

interface MinimalPairExerciseProps {
  item: MinimalPairItem;
  onComplete: (isCorrect: boolean, reactionTimeMs: number) => void;
}

export const MinimalPairExercise: React.FC<MinimalPairExerciseProps> = ({
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

    const isCorrect = item.options[index].is_correct;
    HebrewAudioService.speak(item.options[index].symbol, item.audio_hint);
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
        <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1">
          <Eye className="w-3.5 h-3.5" />
          Discriminación de Pares Mínimos
        </span>
        <button
          onClick={() => HebrewAudioService.speak(item.prompt_symbol, item.audio_hint)}
          className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-indigo-600 transition-colors"
          title="Escuchar"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Símbolo central */}
      <div className="text-center py-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          ¿Cuál es la pronunciación y regla exacta de este símbolo?
        </span>
        <div
          className="text-7xl sm:text-8xl font-serif font-bold text-slate-900 dark:text-amber-100 mt-2 select-none"
          style={{ fontFamily: '"SBL Hebrew", serif' }}
        >
          {item.prompt_symbol}
        </div>
      </div>

      {/* Opciones de respuesta */}
      <div className="space-y-3">
        {item.options.map((option, idx) => {
          const isSelected = selectedIdx === idx;
          let buttonStyle =
            'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-800 dark:text-slate-100';

          if (isAnswered) {
            if (option.is_correct) {
              buttonStyle =
                'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/30';
            } else if (isSelected) {
              buttonStyle =
                'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-100';
            } else {
              buttonStyle = 'opacity-40 border-slate-200 dark:border-slate-800';
            }
          }

          return (
            <button
              key={`opt_${idx}`}
              onClick={() => handleSelectOption(idx)}
              disabled={isAnswered}
              className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between text-left transition-all ${buttonStyle}`}
            >
              <div className="flex items-center gap-3.5">
                <span
                  className="text-3xl font-serif font-bold w-12 text-center"
                  style={{ fontFamily: '"SBL Hebrew", serif' }}
                >
                  {option.symbol}
                </span>
                <div>
                  <div className="font-bold text-sm">{option.transliteration}</div>
                  {isAnswered && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {option.distinction_rule}
                    </div>
                  )}
                </div>
              </div>

              {isAnswered && (
                <div>
                  {option.is_correct ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  ) : isSelected ? (
                    <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                  ) : null}
                </div>
              )}
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
