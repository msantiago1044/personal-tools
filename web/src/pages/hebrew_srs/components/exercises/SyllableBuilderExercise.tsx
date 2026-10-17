import React, { useState, useEffect } from 'react';
import { SyllableBuilderItem } from '../../types/hebrewSrs.types';
import { HebrewAudioService } from '../../services/hebrewAudio';
import { Volume2, RotateCcw, Check, ArrowRight, Sparkles } from 'lucide-react';

interface SyllableBuilderExerciseProps {
  item: SyllableBuilderItem;
  onComplete: (isCorrect: boolean, reactionTimeMs: number) => void;
}

export const SyllableBuilderExercise: React.FC<SyllableBuilderExerciseProps> = ({
  item,
  onComplete,
}) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [allChips, setAllChips] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime] = useState(performance.now());
  const [isPlayingTurtle, setIsPlayingTurtle] = useState(false);

  // Mezclar fichas al cargar
  useEffect(() => {
    const combined = [...item.correct_syllables, ...item.distractor_syllables];
    // Barajar aleatoriamente
    const shuffled = combined.sort(() => Math.random() - 0.5);
    setAllChips(shuffled);
    setSelectedIndices([]);
    setIsAnswered(false);
    setIsCorrect(false);
  }, [item.id]);

  const handleChipClick = (index: number) => {
    if (isAnswered) return;
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter((i) => i !== index));
    } else {
      setSelectedIndices([...selectedIndices, index]);
    }
  };

  const handlePlayAudio = async (speed: 'normal' | 'turtle') => {
    if (speed === 'turtle') setIsPlayingTurtle(true);
    await HebrewAudioService.speak(item.word_hebrew, item.audio_hint, speed);
    setIsPlayingTurtle(false);
  };

  const handleVerify = () => {
    if (isAnswered || selectedIndices.length === 0) return;

    // En hebreo se lee de derecha a izquierda: las sílabas ensambladas deben coincidir exactamente
    const assembledSyllables = selectedIndices.map((i) => allChips[i]);
    const correctStr = item.correct_syllables.join('');
    const assembledStr = assembledSyllables.join('');

    const correct = assembledStr === correctStr;
    setIsCorrect(correct);
    setIsAnswered(true);

    handlePlayAudio('normal');
  };

  const handleNext = () => {
    const reactionTime = Math.round(performance.now() - startTime);
    onComplete(isCorrect, reactionTime);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
      {/* Cabecera del Ejercicio */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Ensamblador de Sílabas
          </span>
          <span className="text-xs text-slate-400 font-medium">{item.source}</span>
        </div>

        {/* Botones de Audio Normal y Tortuga Lenta */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handlePlayAudio('normal')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            title="Audio normal"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handlePlayAudio('turtle')}
            className={`px-2 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
              isPlayingTurtle
                ? 'bg-amber-100 border-amber-400 text-amber-800 scale-105'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-400'
            }`}
            title="Audio Tortuga (lento y detallado)"
          >
            <span>🐢</span>
            <span className="text-[11px] font-mono">Lento</span>
          </button>
        </div>
      </div>

      {/* Instrucción y Significado */}
      <div className="text-center space-y-1">
        <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Arma la palabra bíblica:
        </h4>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          "{item.meaning_es}"
        </h2>
        <p className="text-xs font-mono text-indigo-600 dark:text-indigo-400">
          [{item.transliteration}]
        </p>
      </div>

      {/* Ranura de Ensamblado (Lectura Hebrea: Derecha a Izquierda) */}
      <div
        className="min-h-[76px] p-4 rounded-2xl border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-slate-800/40 flex flex-wrap items-center justify-center gap-2.5 transition-all"
        dir="rtl"
      >
        {selectedIndices.length === 0 ? (
          <span className="text-xs text-slate-400 select-none font-medium">
            Toca las fichas de abajo para formar la palabra en orden
          </span>
        ) : (
          selectedIndices.map((chipIndex) => (
            <button
              key={`selected_${chipIndex}`}
              onClick={() => handleChipClick(chipIndex)}
              disabled={isAnswered}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-serif text-2xl font-bold shadow-md hover:bg-rose-500 transition-all active:scale-95"
              style={{ fontFamily: '"SBL Hebrew", serif' }}
            >
              {allChips[chipIndex]}
            </button>
          ))
        )}
      </div>

      {/* Banco de Fichas Sueltas Disponibles */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2" dir="rtl">
        {allChips.map((chip, idx) => {
          const isSelected = selectedIndices.includes(idx);
          return (
            <button
              key={`chip_${idx}`}
              onClick={() => handleChipClick(idx)}
              disabled={isSelected || isAnswered}
              className={`px-5 py-3 rounded-2xl font-serif text-3xl font-bold transition-all ${
                isSelected
                  ? 'opacity-20 scale-95 border-2 border-slate-200 dark:border-slate-800'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:scale-105 shadow-md active:scale-95'
              }`}
              style={{ fontFamily: '"SBL Hebrew", serif' }}
            >
              {chip}
            </button>
          );
        })}
      </div>

      {/* Botones de Acción y Feedback */}
      <div className="pt-2">
        {!isAnswered ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedIndices([])}
              disabled={selectedIndices.length === 0}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30"
              title="Reiniciar selección"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={handleVerify}
              disabled={selectedIndices.length === 0}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-40"
            >
              <Check className="w-4 h-4" />
              <span>Comprobar Ensamblado</span>
            </button>
          </div>
        ) : (
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between animate-in fade-in ${
              isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
            }`}
          >
            <div>
              <div className="text-sm font-bold flex items-center gap-1.5">
                {isCorrect ? '¡Correcto! Palabra ensamblada:' : 'Casi... La palabra correcta es:'}
              </div>
              <div className="text-xl font-serif font-bold mt-0.5">
                {item.word_hebrew} ({item.transliteration})
              </div>
            </div>

            <button
              onClick={handleNext}
              className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
