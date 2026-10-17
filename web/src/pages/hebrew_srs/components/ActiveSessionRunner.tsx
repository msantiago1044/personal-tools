import React, { useState } from 'react';
import {
  DynamicSessionExercise,
  RatingScore,
  LearningMethod,
  UserCardProgress,
} from '../types/hebrewSrs.types';
import { MnemonicCardExercise } from './exercises/MnemonicCardExercise';
import { SyllableBuilderExercise } from './exercises/SyllableBuilderExercise';
import { MatchPairsExercise } from './exercises/MatchPairsExercise';
import { MinimalPairExercise } from './exercises/MinimalPairExercise';
import { ClozeNiqqudExercise } from './exercises/ClozeNiqqudExercise';
import { SiddurPhraseExercise } from './exercises/SiddurPhraseExercise';
import { X, Sparkles } from 'lucide-react';

interface ActiveSessionRunnerProps {
  sessionTitle: string;
  exercises: DynamicSessionExercise[];
  progressList: UserCardProgress[];
  onStepComplete: (
    exercise: DynamicSessionExercise,
    rating: RatingScore,
    reactionTimeMs: number,
    isCorrect?: boolean
  ) => void;
  onSessionFinished: () => void;
  onExit: () => void;
}

export const ActiveSessionRunner: React.FC<ActiveSessionRunnerProps> = ({
  sessionTitle,
  exercises,
  progressList,
  onStepComplete,
  onSessionFinished,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (exercises.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <p className="text-sm text-slate-500">No hay ejercicios cargados para esta sesión.</p>
        <button
          onClick={onExit}
          className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          Volver
        </button>
      </div>
    );
  }

  const currentExercise = exercises[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / exercises.length) * 100);

  const handleNextStep = (
    rating: RatingScore,
    reactionTimeMs: number,
    isCorrect?: boolean
  ) => {
    onStepComplete(currentExercise, rating, reactionTimeMs, isCorrect);

    if (currentIndex + 1 < exercises.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onSessionFinished();
    }
  };

  // Nivel Leitner de la tarjeta si aplica
  const cardProgress = progressList.find((p) => p.card_id === currentExercise.cardId);
  const currentLevel = cardProgress?.srs_level || 1;

  return (
    <div className="w-full max-w-3xl mx-auto py-2 space-y-4">
      {/* Barra de Progreso Superior */}
      <div className="flex items-center justify-between gap-4 px-2">
        <button
          onClick={onExit}
          className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Salir de la sesión"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Barra de Progreso estilo Duolingo */}
        <div className="flex-1 space-y-1">
          <div className="flex justify-between text-[11px] font-semibold text-slate-500">
            <span>{sessionTitle}</span>
            <span>
              {currentIndex + 1} de {exercises.length}
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Renderizado Dinámico del Ejercicio Activo */}
      <div className="pt-2">
        {currentExercise.type === 'flashcard' &&
          currentExercise.data.kind === 'flashcard' && (
            <MnemonicCardExercise
              card={currentExercise.data.card}
              currentLevel={currentLevel}
              totalInSession={exercises.length}
              currentIndex={currentIndex}
              onRate={(rating, reactionTimeMs) => {
                handleNextStep(
                  rating,
                  reactionTimeMs,
                  rating === 'good' || rating === 'easy'
                );
              }}
            />
          )}

        {currentExercise.type === 'syllable_builder' &&
          currentExercise.data.kind === 'syllable_builder' && (
            <SyllableBuilderExercise
              item={currentExercise.data.item}
              onComplete={(isCorrect, reactionTimeMs) => {
                handleNextStep(
                  isCorrect ? 'good' : 'again',
                  reactionTimeMs,
                  isCorrect
                );
              }}
            />
          )}

        {currentExercise.type === 'match_pairs' &&
          currentExercise.data.kind === 'match_pairs' && (
            <MatchPairsExercise
              items={currentExercise.data.items}
              onComplete={(isCorrect, reactionTimeMs) => {
                handleNextStep('good', reactionTimeMs, isCorrect);
              }}
            />
          )}

        {currentExercise.type === 'minimal_pair' &&
          currentExercise.data.kind === 'minimal_pair' && (
            <MinimalPairExercise
              item={currentExercise.data.item}
              onComplete={(isCorrect, reactionTimeMs) => {
                handleNextStep(
                  isCorrect ? 'good' : 'again',
                  reactionTimeMs,
                  isCorrect
                );
              }}
            />
          )}

        {currentExercise.type === 'cloze_niqqud' &&
          currentExercise.data.kind === 'cloze_niqqud' && (
            <ClozeNiqqudExercise
              item={currentExercise.data.item}
              onComplete={(isCorrect, reactionTimeMs) => {
                handleNextStep(
                  isCorrect ? 'good' : 'again',
                  reactionTimeMs,
                  isCorrect
                );
              }}
            />
          )}

        {currentExercise.type === 'siddur_phrase' &&
          currentExercise.data.kind === 'siddur_phrase' && (
            <SiddurPhraseExercise
              item={currentExercise.data.item}
              onComplete={(isCorrect, reactionTimeMs) => {
                handleNextStep('easy', reactionTimeMs, isCorrect);
              }}
            />
          )}
      </div>
    </div>
  );
};
