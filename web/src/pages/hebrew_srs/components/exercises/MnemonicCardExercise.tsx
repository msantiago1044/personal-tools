import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HebrewCard, RatingScore, SRSLevel } from '../../types/hebrewSrs.types';
import { HebrewAudioService } from '../../services/hebrewAudio';
import {
  RotateCcw,
  Volume2,
  Clock,
  Sparkles,
  Lightbulb,
  Mic,
  Check,
  Zap,
} from 'lucide-react';

interface MnemonicCardExerciseProps {
  card: HebrewCard;
  currentLevel: SRSLevel;
  totalInSession: number;
  currentIndex: number;
  onRate: (rating: RatingScore, reactionTimeMs: number) => void;
}

export const MnemonicCardExercise: React.FC<MnemonicCardExerciseProps> = ({
  card,
  currentLevel,
  totalInSession,
  currentIndex,
  onRate,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [reactionTimeMs, setReactionTimeMs] = useState<number>(0);
  const [isPlayingTurtle, setIsPlayingTurtle] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [voiceResult, setVoiceResult] = useState<string | null>(null);

  // Cronómetro de latencia cognitiva
  const startTimeRef = useRef<number>(performance.now());
  const timerIntervalRef = useRef<number | null>(null);
  const [elapsedDisplayMs, setElapsedDisplayMs] = useState(0);

  useEffect(() => {
    setIsFlipped(false);
    setVoiceResult(null);
    startTimeRef.current = performance.now();
    setElapsedDisplayMs(0);
    setReactionTimeMs(0);

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = window.setInterval(() => {
      setElapsedDisplayMs(Math.round(performance.now() - startTimeRef.current));
    }, 50);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [card.id]);

  const handlePlayAudio = useCallback(async (speed: 'normal' | 'turtle') => {
    if (speed === 'turtle') setIsPlayingTurtle(true);
    await HebrewAudioService.speak(card.combined_symbol, card.audio_hint, speed);
    setIsPlayingTurtle(false);
  }, [card.combined_symbol, card.audio_hint]);

  const handleFlip = useCallback(() => {
    if (isFlipped) return;

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    const finalTime = Math.round(performance.now() - startTimeRef.current);
    setReactionTimeMs(finalTime);
    setElapsedDisplayMs(finalTime);
    setIsFlipped(true);

    handlePlayAudio('normal');
  }, [isFlipped, handlePlayAudio]);

  const handleMicTest = async () => {
    setIsListeningVoice(true);
    setVoiceResult('Escuchando...');

    const res = await HebrewAudioService.listenPronunciation(card.combined_symbol, 4000);
    setIsListeningVoice(false);
    setVoiceResult(res.message);
  };

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (!isFlipped) {
        if (e.code === 'Space' || e.key === 'Enter') {
          e.preventDefault();
          handleFlip();
        }
      } else {
        if (e.key === '1') onRate('again', reactionTimeMs);
        if (e.key === '2') onRate('hard', reactionTimeMs);
        if (e.key === '3') onRate('good', reactionTimeMs);
        if (e.key === '4') onRate('easy', reactionTimeMs);
        if (e.key.toLowerCase() === 'a') handlePlayAudio('normal');
        if (e.key.toLowerCase() === 't') handlePlayAudio('turtle');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, reactionTimeMs, onRate, handleFlip, handlePlayAudio]);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Barra superior de estado */}
      <div className="w-full flex items-center justify-between mb-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Paso {currentIndex + 1} de {totalInSession}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-medium border border-slate-200 dark:border-slate-700">
            Caja Leitner {currentLevel}
          </span>
        </div>

        {/* Cronómetro */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <Clock className="w-3.5 h-3.5 text-indigo-500" />
          <span>{(elapsedDisplayMs / 1000).toFixed(2)}s</span>
        </div>
      </div>

      {/* Tarjeta 3D */}
      <div
        className="w-full h-80 sm:h-96 relative cursor-pointer select-none [perspective:1000px]"
        onClick={handleFlip}
      >
        <div
          className={`w-full h-full relative transition-transform duration-500 [transform-style:preserve-3d] ${
            isFlipped ? '[transform:rotateY(180deg)]' : ''
          }`}
        >
          {/* CARA DELANTERA */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-3xl bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200 dark:border-slate-700 shadow-xl flex flex-col justify-between p-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                Decodifica el símbolo
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Mnemotecnia Visual
              </span>
            </div>

            {/* Glifo */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <span
                className="text-8xl sm:text-9xl font-serif text-slate-900 dark:text-amber-100 font-bold hover:scale-105 transition-transform"
                style={{ fontFamily: '"SBL Hebrew", serif' }}
              >
                {card.combined_symbol}
              </span>
              <span className="text-xs text-slate-400 mt-2">
                Haz clic o pulsa [Espacio] para comprobar
              </span>
            </div>

            <div className="flex items-center justify-center gap-1 text-xs text-slate-400">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Voltear para ver respuesta y ancla</span>
            </div>
          </div>

          {/* CARA TRASERA */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-3xl bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-2 border-indigo-200 dark:border-indigo-900/60 shadow-xl flex flex-col justify-between p-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-indigo-600 dark:text-indigo-400">
                Respuesta & Fonética
              </span>

              {/* Controles de audio rápido */}
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handlePlayAudio('normal')}
                  className="p-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 hover:bg-indigo-100 transition-colors"
                  title="Audio normal (A)"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handlePlayAudio('turtle')}
                  className={`px-2 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                    isPlayingTurtle
                      ? 'bg-amber-100 text-amber-800 border-amber-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 border-slate-200'
                  }`}
                  title="Audio Tortuga (T)"
                >
                  🐢
                </button>
              </div>
            </div>

            {/* Contenido Central */}
            <div className="flex-1 flex flex-col items-center justify-center py-2 text-center space-y-2">
              <div className="flex items-baseline gap-4">
                <span
                  className="text-5xl font-serif text-slate-900 dark:text-white font-bold"
                  style={{ fontFamily: '"SBL Hebrew", serif' }}
                >
                  {card.combined_symbol}
                </span>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {card.transliteration}
                  </h3>
                  <p className="text-xs text-slate-500">{card.letter_name}</p>
                </div>
              </div>

              {/* Ancla Mnemotécnica Visual */}
              {card.mnemonic_phrase && (
                <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-left max-w-sm flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-900 dark:text-amber-200 font-medium">
                    <strong>Ancla mnemotécnica:</strong> {card.mnemonic_phrase}
                  </p>
                </div>
              )}

              {/* Ejemplo en el Siddur */}
              {card.siddur_example && (
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  En el Siddur:{' '}
                  <strong className="font-serif text-sm text-slate-800 dark:text-slate-200">
                    {card.siddur_example}
                  </strong>{' '}
                  ({card.siddur_meaning})
                </div>
              )}
            </div>

            {/* Prueba de Micrófono Rápida */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-2" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between text-xs">
                <button
                  onClick={handleMicTest}
                  disabled={isListeningVoice}
                  className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 font-medium"
                >
                  <Mic className={`w-3.5 h-3.5 ${isListeningVoice ? 'text-rose-500 animate-pulse' : 'text-indigo-500'}`} />
                  <span>{isListeningVoice ? 'Escuchando tu voz...' : 'Validar pronunciación (Micrófono)'}</span>
                </button>
                {voiceResult && <span className="text-[11px] text-indigo-600 font-medium">{voiceResult}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de calificación Leitner */}
      <div className="w-full mt-5">
        {!isFlipped ? (
          <button
            onClick={handleFlip}
            className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Mostrar Respuesta (Espacio)</span>
          </button>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 animate-in fade-in">
            <button
              onClick={() => onRate('again', reactionTimeMs)}
              className="p-3 rounded-2xl border-2 border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 flex flex-col items-center gap-1 hover:-translate-y-0.5 transition-all"
            >
              <span className="text-xs font-bold flex items-center gap-1">
                <RotateCcw className="w-3 h-3" /> Otra vez
              </span>
              <span className="text-[10px] text-rose-500 font-medium">Reinicio (1d) [1]</span>
            </button>

            <button
              onClick={() => onRate('hard', reactionTimeMs)}
              className="p-3 rounded-2xl border-2 border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 flex flex-col items-center gap-1 hover:-translate-y-0.5 transition-all"
            >
              <span className="text-xs font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" /> Difícil
              </span>
              <span className="text-[10px] text-amber-500 font-medium">Mantiene [2]</span>
            </button>

            <button
              onClick={() => onRate('good', reactionTimeMs)}
              className="p-3 rounded-2xl border-2 border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex flex-col items-center gap-1 hover:-translate-y-0.5 transition-all"
            >
              <span className="text-xs font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> Bien
              </span>
              <span className="text-[10px] text-emerald-500 font-medium">+1 Nivel [3]</span>
            </button>

            <button
              onClick={() => onRate('easy', reactionTimeMs)}
              className="p-3 rounded-2xl border-2 border-indigo-200 dark:border-indigo-900/60 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 flex flex-col items-center gap-1 hover:-translate-y-0.5 transition-all"
            >
              <span className="text-xs font-bold flex items-center gap-1">
                <Zap className="w-3 h-3" /> Fácil
              </span>
              <span className="text-[10px] text-indigo-500 font-medium">+2 Niveles [4]</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
