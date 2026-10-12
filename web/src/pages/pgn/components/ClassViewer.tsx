import React, { useState } from 'react';
import { PgnClass, AnswerKey } from '../types/pgn.types';
import {
  CheckCircle,
  AlertTriangle,
  Scale,
  Lightbulb,
  Target,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  BookmarkCheck,
  RotateCcw,
} from 'lucide-react';

interface ClassViewerProps {
  currentClass: PgnClass;
  isCompleted: boolean;
  savedAnswer?: AnswerKey;
  onToggleComplete: (classId: number) => void;
  onSaveAnswer: (classId: number, answer: AnswerKey) => void;
  onPrevClass: () => void;
  onNextClass: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export const ClassViewer: React.FC<ClassViewerProps> = ({
  currentClass,
  isCompleted,
  savedAnswer,
  onToggleComplete,
  onSaveAnswer,
  onPrevClass,
  onNextClass,
  hasPrev,
  hasNext,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerKey | null>(savedAnswer || null);
  const [showFeedback, setShowFeedback] = useState<boolean>(!!savedAnswer);

  // Sincronizar cuando cambia de clase
  React.useEffect(() => {
    setSelectedAnswer(savedAnswer || null);
    setShowFeedback(!!savedAnswer);
  }, [currentClass.id, savedAnswer]);

  const handleSelectOption = (key: AnswerKey) => {
    setSelectedAnswer(key);
    setShowFeedback(true);
    onSaveAnswer(currentClass.id, key);
  };

  const handleResetQuestion = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const isCorrect = selectedAnswer === currentClass.checkpoint.correctKey;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Encabezado de la Clase */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              Clase {currentClass.id} de 40
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Semana {currentClass.week} • {currentClass.moduleTitle}
            </span>
          </div>

          <button
            onClick={() => onToggleComplete(currentClass.id)}
            className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-xl border transition ${
              isCompleted
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            {isCompleted ? 'Clase Completada' : 'Marcar como Completada'}
          </button>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {currentClass.title}
        </h2>
      </div>

      {/* 1. Objetivo y Fundamento Legal */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 font-semibold text-sm mb-3">
          <Target className="w-4 h-4" />
          <span>1. Objetivo y Fundamento Legal (Manual 3PU-15)</span>
        </div>
        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-3">
          {currentClass.objective}
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-600 dark:text-slate-400 font-mono">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Norma Base:</span>
          {currentClass.legalBasis}
        </div>
      </div>

      {/* 2. Concepto Clave en Cápsula (Sin Rodeos) */}
      <div className="bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-transparent bg-white dark:bg-slate-900 border border-emerald-500/20 dark:border-emerald-500/20 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2.5 text-teal-600 dark:text-teal-400 font-semibold text-sm mb-3">
          <Lightbulb className="w-4 h-4" />
          <span>2. Concepto Clave en Cápsula (Sin Rodeos)</span>
        </div>
        <div className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed font-medium bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/10">
          {currentClass.conceptCapsule}
        </div>
      </div>

      {/* 3. Caso Aplicado "En la Baranda" (Caso Real PGN) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2.5 text-blue-600 dark:text-blue-400 font-semibold text-sm mb-3">
          <Scale className="w-4 h-4" />
          <span>3. Caso Aplicado "En la Baranda" (PGN Real 3PU-15)</span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
          <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
            {currentClass.barandaCase.title}
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong className="text-slate-800 dark:text-slate-200">Situación Fáctica: </strong>
            {currentClass.barandaCase.situation}
          </p>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-300 font-medium">
              <strong>Actuación debida del 3PU-15: </strong>
              {currentClass.barandaCase.resolution}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Alerta de Concurso ("Trampa de la Universidad Evaluadora") */}
      <div className="bg-amber-500/5 dark:bg-amber-950/10 border border-amber-500/20 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2.5 text-amber-700 dark:text-amber-400 font-semibold text-sm mb-2">
          <AlertTriangle className="w-4 h-4" />
          <span>4. Alerta de Concurso ("Trampa de la Universidad de Antioquia")</span>
        </div>
        <h4 className="font-bold text-sm text-amber-900 dark:text-amber-300 mb-1">
          {currentClass.examTrap.title}
        </h4>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-2">
          <strong className="text-amber-800 dark:text-amber-300">Distractor Habitual: </strong>
          {currentClass.examTrap.trap}
        </p>
        <div className="bg-amber-100/70 dark:bg-amber-900/30 p-3 rounded-lg text-xs font-semibold text-amber-900 dark:text-amber-200 border border-amber-300/40 dark:border-amber-700/40">
          ✓ Regla Inquebrantable: {currentClass.examTrap.rule}
        </div>
      </div>

      {/* 5. Checkpoint Situacional (Pregunta Tipo Test) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold text-sm">
            <HelpCircle className="w-4 h-4" />
            <span>5. Checkpoint Situacional (Evaluación Rápida)</span>
          </div>
          {showFeedback && (
            <button
              onClick={handleResetQuestion}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reintentar
            </button>
          )}
        </div>

        <p className="font-medium text-slate-900 dark:text-white text-sm sm:text-base leading-relaxed mb-4">
          {currentClass.checkpoint.question}
        </p>

        {/* Opciones A, B, C */}
        <div className="space-y-3">
          {currentClass.checkpoint.options.map((option) => {
            const isSelected = selectedAnswer === option.key;
            const isOptionCorrect = option.key === currentClass.checkpoint.correctKey;

            let optionStyle = 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30';

            if (showFeedback) {
              if (isOptionCorrect) {
                optionStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200';
              } else if (isSelected && !isOptionCorrect) {
                optionStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200';
              } else {
                optionStyle = 'opacity-50 border-slate-200 dark:border-slate-800';
              }
            } else if (isSelected) {
              optionStyle = 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20';
            }

            return (
              <button
                key={option.key}
                disabled={showFeedback}
                onClick={() => handleSelectOption(option.key)}
                className={`w-full text-left p-4 rounded-xl border transition flex items-start gap-3.5 cursor-pointer disabled:cursor-default ${optionStyle}`}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition ${
                    showFeedback && isOptionCorrect
                      ? 'bg-emerald-600 text-white'
                      : showFeedback && isSelected && !isOptionCorrect
                      ? 'bg-rose-600 text-white'
                      : isSelected
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {option.key}
                </span>
                <span className="text-xs sm:text-sm leading-relaxed">{option.text}</span>
              </button>
            );
          })}
        </div>

        {/* Retroalimentación Técnica */}
        {showFeedback && (
          <div
            className={`mt-5 p-4 rounded-xl border transition-all ${
              isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500/30'
                : 'bg-rose-50 dark:bg-rose-950/20 border-rose-500/30'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm mb-2">
              {isCorrect ? (
                <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle className="w-4 h-4" /> ¡Excelente! Respuesta Correcta ({currentClass.checkpoint.correctKey})
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400">
                  <AlertTriangle className="w-4 h-4" /> Respuesta Incorrecta. La opción válida era ({currentClass.checkpoint.correctKey})
                </span>
              )}
            </div>

            <div className="text-xs sm:text-sm space-y-1.5 text-slate-700 dark:text-slate-300">
              <p>
                <strong className="text-slate-900 dark:text-white">Fundamento Técnico: </strong>
                {currentClass.checkpoint.justification.correct}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                <strong>Por qué los demás son inválidos: </strong>
                {currentClass.checkpoint.justification.incorrect}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Controles de Navegación entre Clases */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          disabled={!hasPrev}
          onClick={onPrevClass}
          className="flex items-center gap-2 text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="w-4 h-4" /> Clase Anterior
        </button>

        <span className="text-xs text-slate-400">
          {currentClass.id} de 40 clases
        </span>

        <button
          disabled={!hasNext}
          onClick={onNextClass}
          className="flex items-center gap-2 text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs"
        >
          Siguiente Clase <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
