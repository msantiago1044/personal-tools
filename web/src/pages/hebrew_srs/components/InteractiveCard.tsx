import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  HebrewCard,
  LearningMethod,
  RatingScore,
  SRSLevel,
} from '../types/hebrewSrs.types';
import { HebrewAudioService } from '../services/hebrewAudio';
import {
  RotateCcw,
  Volume2,
  PenTool,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Check,
  Zap,
  Clock,
  Sparkles,
} from 'lucide-react';

interface InteractiveCardProps {
  card: HebrewCard;
  method: LearningMethod;
  currentLevel: SRSLevel;
  totalDueCount: number;
  currentIndex: number;
  onRate: (rating: RatingScore, reactionTimeMs: number, tactileVerified?: boolean) => void;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  card,
  method,
  currentLevel,
  totalDueCount,
  currentIndex,
  onRate,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [reactionTimeMs, setReactionTimeMs] = useState<number>(0);
  const [tactileVerified, setTactileVerified] = useState(false);
  const [showAnalyticRule, setShowAnalyticRule] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Referencias para cronómetro de alta precisión
  const startTimeRef = useRef<number>(performance.now());
  const timerIntervalRef = useRef<number | null>(null);
  const [elapsedDisplayMs, setElapsedDisplayMs] = useState(0);

  // Reiniciar cronómetro y estados al cambiar de tarjeta
  useEffect(() => {
    setIsFlipped(false);
    setTactileVerified(false);
    setShowAnalyticRule(false);
    startTimeRef.current = performance.now();
    setElapsedDisplayMs(0);
    setReactionTimeMs(0);

    // Iniciar ticker visual para el cronómetro
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = window.setInterval(() => {
      setElapsedDisplayMs(Math.round(performance.now() - startTimeRef.current));
    }, 50);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [card.id]);

  // Manejo de reproducción de audio
  const handlePlayAudio = useCallback(async () => {
    setIsPlayingAudio(true);
    await HebrewAudioService.speak(card.combined_symbol, card.audio_hint);
    setIsPlayingAudio(false);
  }, [card.combined_symbol, card.audio_hint]);

  // Voltear tarjeta y registrar el tiempo de reacción exacto
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

    // Si el método es Auditivo, reproducir automáticamente al voltear
    if (method === 'auditory') {
      handlePlayAudio();
    }
  }, [isFlipped, method, handlePlayAudio]);

  // Atajos de teclado para flujo de estudio rápido
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Evitar capturar si el usuario está en un input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (!isFlipped) {
        if (e.code === 'Space' || e.key === 'Enter') {
          e.preventDefault();
          handleFlip();
        }
      } else {
        if (e.key === '1') onRate('again', reactionTimeMs, tactileVerified);
        if (e.key === '2') onRate('hard', reactionTimeMs, tactileVerified);
        if (e.key === '3') onRate('good', reactionTimeMs, tactileVerified);
        if (e.key === '4') onRate('easy', reactionTimeMs, tactileVerified);
        if (e.key.toLowerCase() === 'a') handlePlayAudio();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, reactionTimeMs, tactileVerified, onRate, handleFlip, handlePlayAudio]);

  // Color e indicador según velocidad de respuesta
  const getSpeedTier = (ms: number) => {
    if (ms < 1500) {
      return { label: 'Rápido (<1.5s)', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
    }
    if (ms < 3500) {
      return { label: 'Normal (1.5-3.5s)', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' };
    }
    return { label: 'Titubeo (>3.5s)', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
  };

  const speedInfo = getSpeedTier(elapsedDisplayMs);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Barra superior de estado de tarjeta */}
      <div className="w-full flex items-center justify-between mb-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Tarjeta {currentIndex + 1} de {totalDueCount}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-medium border border-slate-200 dark:border-slate-700">
            Caja Leitner: Nivel {currentLevel}
          </span>
        </div>

        {/* Cronómetro en tiempo real */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-mono font-medium transition-colors ${speedInfo.color}`}>
          <Clock className="w-3.5 h-3.5" />
          <span>{(elapsedDisplayMs / 1000).toFixed(2)}s</span>
          {isFlipped && <span className="text-[10px] hidden sm:inline ml-1">({reactionTimeMs}ms)</span>}
        </div>
      </div>

      {/* Tarjeta 3D Flip */}
      <div
        className="w-full h-80 sm:h-96 relative cursor-pointer select-none [perspective:1000px]"
        onClick={handleFlip}
      >
        <div
          className={`w-full h-full relative transition-transform duration-500 [transform-style:preserve-3d] ${
            isFlipped ? '[transform:rotateY(180deg)]' : ''
          }`}
        >
          {/* CARA DELANTERA (Pregunta / Símbolo Hebreo) */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-3xl bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200 dark:border-slate-700 shadow-xl flex flex-col justify-between p-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
                Decodifica el símbolo
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {method === 'srs_puro' && 'SRS Clásico'}
                {method === 'kinetic' && 'Kinético'}
                {method === 'auditory' && 'Auditivo'}
                {method === 'analytic' && 'Analítico'}
              </span>
            </div>

            {/* Glifo Hebreo Bíblico Gigante */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <span
                className="text-7xl sm:text-8xl font-serif text-slate-900 dark:text-amber-100 font-bold transition-transform hover:scale-105 duration-200"
                style={{ fontFamily: '"SBL Hebrew", "Ezra SIL", "Times New Roman", serif' }}
              >
                {card.combined_symbol}
              </span>
              <span className="text-xs text-slate-400 mt-2">
                Haz clic o pulsa [Espacio] para ver respuesta
              </span>
            </div>

            <div className="flex items-center justify-center gap-1 text-xs text-slate-400">
              <RotateCcw className="w-3.5 h-3.5 animate-pulse" />
              <span>Voltear tarjeta</span>
            </div>
          </div>

          {/* CARA TRASERA (Respuesta & Desglose Fonético) */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-3xl bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-2 border-indigo-200 dark:border-indigo-900/60 shadow-xl flex flex-col justify-between p-6">
            {/* Header de Respuesta */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-indigo-600 dark:text-indigo-400">
                Respuesta & Fonética
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayAudio();
                }}
                className={`p-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors ${
                  isPlayingAudio ? 'ring-2 ring-indigo-500 scale-110' : ''
                }`}
                title="Reproducir audio de nuevo (Atajo: A)"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Contenido Central */}
            <div className="flex-1 flex flex-col items-center justify-center py-2 text-center">
              <div className="flex items-baseline gap-4 mb-2">
                <span
                  className="text-5xl font-serif text-slate-800 dark:text-white font-bold"
                  style={{ fontFamily: '"SBL Hebrew", "Ezra SIL", serif' }}
                >
                  {card.combined_symbol}
                </span>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {card.transliteration}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{card.letter_name}</p>
                </div>
              </div>

              {/* Detalle Fonético */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md px-2 mt-1">
                {card.phonetic_rule}
              </p>
            </div>

            {/* Pie de cara trasera */}
            <div className="text-center text-[11px] text-slate-400">
              Evalúa tu grado de acierto abajo
            </div>
          </div>
        </div>
      </div>

      {/* COMPONENTES ESPECÍFICOS SEGÚN EL MÉTODO DE APRENDIZAJE */}
      <div className="w-full mt-4 space-y-3">
        {/* Método Kinético: Confirmación táctil de escritura */}
        {method === 'kinetic' && (
          <div
            onClick={() => setTactileVerified(!tactileVerified)}
            className={`w-full p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              tactileVerified
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-200 hover:bg-amber-100/60'
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs sm:text-sm">
              <PenTool className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <span>
                <strong>Modo Kinético:</strong> Escribe la letra en papel antes de calificar.
              </span>
            </div>
            <button
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                tactileVerified
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200'
              }`}
            >
              <Check className={`w-3.5 h-3.5 ${tactileVerified ? 'opacity-100' : 'opacity-30'}`} />
              <span>{tactileVerified ? 'Confirmado' : 'Lo escribí'}</span>
            </button>
          </div>
        )}

        {/* Método Analítico: Desplegable con regla fonética */}
        {method === 'analytic' && (
          <div className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 overflow-hidden transition-colors">
            <button
              type="button"
              onClick={() => setShowAnalyticRule(!showAnalyticRule)}
              className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <span>Desglose Analítico & Regla Gramatical</span>
              </div>
              {showAnalyticRule ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showAnalyticRule && (
              <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-900/40 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                <p>
                  <strong>Consonante:</strong> {card.consonant} ({card.letter_name})
                </p>
                <p>
                  <strong>Vocal Niqqud:</strong> {card.niqqud}
                </p>
                <p>
                  <strong>Regla Fonética:</strong> {card.phonetic_rule}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Método Auditivo: Botón de Audio Reforzado */}
        {method === 'auditory' && (
          <div className="w-full p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/60 dark:bg-indigo-950/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-indigo-800 dark:text-indigo-200">
              <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>
                <strong>Modo Auditivo:</strong> Síntesis fonética en hebreo (he-IL).
              </span>
            </div>
            <button
              onClick={handlePlayAudio}
              disabled={isPlayingAudio}
              className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isPlayingAudio ? 'Reproduciendo...' : 'Escuchar'}</span>
            </button>
          </div>
        )}
      </div>

      {/* BOTONES DE CALIFICACIÓN LEITNER (Solo visibles tras voltear) */}
      <div className="w-full mt-5">
        {!isFlipped ? (
          <button
            onClick={handleFlip}
            className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Mostrar Respuesta (Espacio)</span>
          </button>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 animate-in fade-in duration-200">
            {/* 1. Otra vez (Falló -> Nivel 1) */}
            <button
              onClick={() => onRate('again', reactionTimeMs, tactileVerified)}
              className="p-3 rounded-2xl border-2 border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/70 text-rose-700 dark:text-rose-300 flex flex-col items-center gap-1 transition-all hover:-translate-y-0.5"
            >
              <span className="text-xs font-bold flex items-center gap-1">
                <RotateCcw className="w-3 h-3" /> Otra vez
              </span>
              <span className="text-[10px] text-rose-500 font-medium">Reinicio (1d) [1]</span>
            </button>

            {/* 2. Difícil (Dudó -> Mantiene nivel) */}
            <button
              onClick={() => onRate('hard', reactionTimeMs, tactileVerified)}
              className="p-3 rounded-2xl border-2 border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/70 text-amber-700 dark:text-amber-300 flex flex-col items-center gap-1 transition-all hover:-translate-y-0.5"
            >
              <span className="text-xs font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" /> Difícil
              </span>
              <span className="text-[10px] text-amber-500 font-medium">Mantiene [2]</span>
            </button>

            {/* 3. Bien (Normal -> +1 Nivel) */}
            <button
              onClick={() => onRate('good', reactionTimeMs, tactileVerified)}
              className="p-3 rounded-2xl border-2 border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/70 text-emerald-700 dark:text-emerald-300 flex flex-col items-center gap-1 transition-all hover:-translate-y-0.5"
            >
              <span className="text-xs font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> Bien
              </span>
              <span className="text-[10px] text-emerald-500 font-medium">+1 Nivel [3]</span>
            </button>

            {/* 4. Fácil (Inmediato -> +2 Niveles) */}
            <button
              onClick={() => onRate('easy', reactionTimeMs, tactileVerified)}
              className="p-3 rounded-2xl border-2 border-indigo-200 dark:border-indigo-900/60 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/70 text-indigo-700 dark:text-indigo-300 flex flex-col items-center gap-1 transition-all hover:-translate-y-0.5"
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
