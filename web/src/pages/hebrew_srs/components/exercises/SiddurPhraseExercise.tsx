import React, { useState } from 'react';
import { SiddurPhraseItem } from '../../types/hebrewSrs.types';
import { HebrewAudioService } from '../../services/hebrewAudio';
import { Volume2, Mic, MicOff, BookOpen, Check, ArrowRight, Sparkles } from 'lucide-react';

interface SiddurPhraseExerciseProps {
  item: SiddurPhraseItem;
  onComplete: (isCorrect: boolean, reactionTimeMs: number) => void;
}

export const SiddurPhraseExercise: React.FC<SiddurPhraseExerciseProps> = ({
  item,
  onComplete,
}) => {
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPlayingTurtle, setIsPlayingTurtle] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);
  const [voiceSuccess, setVoiceSuccess] = useState<boolean | null>(null);
  const [startTime] = useState(performance.now());
  const [hasCompleted, setHasCompleted] = useState(false);

  const handlePlayAudio = async (speed: 'normal' | 'turtle') => {
    if (speed === 'turtle') setIsPlayingTurtle(true);
    else setIsPlayingAudio(true);

    await HebrewAudioService.speak(item.phrase_hebrew, item.audio_hint, speed);

    setIsPlayingAudio(false);
    setIsPlayingTurtle(false);
  };

  const handlePlayWordAudio = async (wordHebrew: string) => {
    await HebrewAudioService.speak(wordHebrew);
  };

  const handleStartMic = async () => {
    setIsListeningVoice(true);
    setVoiceFeedback('Escuchando tu pronunciación en hebreo...');
    setVoiceSuccess(null);

    const result = await HebrewAudioService.listenPronunciation(item.phrase_hebrew, 6000);

    setIsListeningVoice(false);
    setVoiceFeedback(result.message);
    setVoiceSuccess(result.isMatch);

    if (result.isMatch) {
      setHasCompleted(true);
    }
  };

  const handleFinish = () => {
    const reactionTime = Math.round(performance.now() - startTime);
    onComplete(true, reactionTime);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
      {/* Cabecera */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            Lectura Litúrgica del Siddur
          </span>
          <span className="text-xs text-slate-400 font-medium">{item.source}</span>
        </div>

        {/* Botones de Audio */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handlePlayAudio('normal')}
            disabled={isPlayingAudio}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors"
            title="Escuchar frase completa"
          >
            <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-pulse text-indigo-600' : ''}`} />
          </button>
          <button
            onClick={() => handlePlayAudio('turtle')}
            disabled={isPlayingTurtle}
            className={`px-2 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
              isPlayingTurtle
                ? 'bg-amber-100 border-amber-400 text-amber-800 scale-105'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-400'
            }`}
            title="Audio Tortuga (lento)"
          >
            <span>🐢</span>
            <span className="text-[11px] font-mono">Lento</span>
          </button>
        </div>
      </div>

      {/* Título de la oración */}
      <div className="text-center">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">{item.title}</h3>
        <p className="text-xs text-slate-400">Toca cualquier palabra para ver su pronunciación y significado</p>
      </div>

      {/* Frase Hebrea Completa con Niqqudot (Derecha a Izquierda) */}
      <div
        className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50/40 via-amber-50/20 to-slate-50 dark:from-slate-800/80 dark:to-slate-900 border-2 border-indigo-100 dark:border-slate-700 flex flex-wrap items-center justify-center gap-x-4 gap-y-3"
        dir="rtl"
      >
        {item.words.map((w, idx) => {
          const isSelected = selectedWordIndex === idx;
          return (
            <button
              key={`word_${idx}`}
              onClick={() => {
                setSelectedWordIndex(idx);
                handlePlayWordAudio(w.hebrew);
              }}
              className={`px-3 py-1.5 rounded-2xl transition-all font-serif text-3xl sm:text-4xl font-bold cursor-pointer select-none ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-lg scale-110 shadow-indigo-600/30 ring-2 ring-indigo-400'
                  : 'text-slate-900 dark:text-amber-100 hover:bg-indigo-100/60 dark:hover:bg-slate-700/60'
              }`}
              style={{ fontFamily: '"SBL Hebrew", "Ezra SIL", serif' }}
            >
              {w.hebrew}
            </button>
          );
        })}
      </div>

      {/* Detalle de Palabra Seleccionada o Transliteración Global */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
        {selectedWordIndex !== null ? (
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-indigo-600 dark:text-indigo-400">
              Palabra Seleccionada
            </span>
            <div className="text-lg font-bold text-slate-800 dark:text-white">
              {item.words[selectedWordIndex].transliteration} = "{item.words[selectedWordIndex].meaning_es}"
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-xs font-mono font-medium text-indigo-700 dark:text-indigo-300">
              {item.transliteration}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              "{item.translation_es}"
            </p>
          </div>
        )}
      </div>

      {/* Reconocimiento de Voz / Micrófono */}
      <div className="space-y-2">
        <button
          onClick={handleStartMic}
          disabled={isListeningVoice}
          className={`w-full py-3 px-4 rounded-2xl border-2 font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
            isListeningVoice
              ? 'bg-rose-50 border-rose-500 text-rose-600 animate-pulse'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
          }`}
        >
          {isListeningVoice ? <MicOff className="w-4 h-4 text-rose-500" /> : <Mic className="w-4 h-4 text-indigo-500" />}
          <span>
            {isListeningVoice
              ? 'Escuchando tu voz... Lee la frase en voz alta'
              : 'Comprobar mi pronunciación en voz alta (Micrófono)'}
          </span>
        </button>

        {voiceFeedback && (
          <div
            className={`p-3 rounded-xl text-xs font-medium text-center ${
              voiceSuccess === true
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300'
                : voiceSuccess === false
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
            }`}
          >
            {voiceFeedback}
          </div>
        )}
      </div>

      {/* Botón de Finalización */}
      <div className="pt-2">
        <button
          onClick={handleFinish}
          className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
        >
          <Check className="w-4 h-4" />
          <span>He leído y comprendido esta frase del Siddur</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};
