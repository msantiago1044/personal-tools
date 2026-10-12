import React, { useState, useEffect } from 'react';
import { PgnExam, AnswerKey } from '../types/pgn.types';
import { PGN_EXAMS } from '../data/pgnExamsData';
import {
  Timer,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Award,
  BookOpen,
} from 'lucide-react';

interface ExamRunnerProps {
  onSaveExamResult?: (examId: string, score: number, total: number, passed: boolean) => void;
}

export const ExamRunner: React.FC<ExamRunnerProps> = ({ onSaveExamResult }) => {
  const [selectedExam, setSelectedExam] = useState<PgnExam | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, AnswerKey>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [showReview, setShowReview] = useState<boolean>(false);

  // Inicializar tiempo al seleccionar examen
  const startExam = (exam: PgnExam) => {
    setSelectedExam(exam);
    setCurrentIndex(0);
    setAnswers({});
    setTimeLeftSeconds(exam.timeLimitMinutes * 60);
    setIsFinished(false);
    setShowReview(false);
  };

  // Temporizador en vivo
  useEffect(() => {
    if (!selectedExam || isFinished || timeLeftSeconds <= 0) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedExam, isFinished, timeLeftSeconds]);

  const handleSelectAnswer = (questionId: number, key: AnswerKey) => {
    if (isFinished) return;
    setAnswers((prev) => ({ ...prev, [questionId]: key }));
  };

  const handleFinishExam = () => {
    if (!selectedExam) return;
    setIsFinished(true);

    const correctCount = selectedExam.questions.reduce((acc, q) => {
      return answers[q.id] === q.correctKey ? acc + 1 : acc;
    }, 0);

    const percentage = Math.round((correctCount / selectedExam.questions.length) * 100);
    const passed = percentage >= selectedExam.cutoffPercentage;

    if (onSaveExamResult) {
      onSaveExamResult(selectedExam.id, correctCount, selectedExam.questions.length, passed);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!selectedExam) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-12">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm mb-2">
            <Award className="w-5 h-5" />
            <span>Simulacros & Pruebas Escritas Universitarias</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Simulador de Pruebas Escritas (Estándar UdeA / PGN)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Entrena bajo condiciones reales de presión temporal, umbral eliminatorio (65%) y preguntas de juicio situacional con distractores plausibles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PGN_EXAMS.map((exam) => (
            <div
              key={exam.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-500/40 transition shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    {exam.questionsCount} Preguntas
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                    <Timer className="w-3.5 h-3.5" /> {exam.timeLimitMinutes} min
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                  {exam.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {exam.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  Corte eliminatorio: <strong className="text-indigo-600 dark:text-indigo-400">{exam.cutoffPercentage}%</strong>
                </span>

                <button
                  onClick={() => startExam(exam)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  Iniciar Simulacro
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Vista de Resultados Finales
  if (isFinished) {
    const totalQuestions = selectedExam.questions.length;
    const correctCount = selectedExam.questions.reduce((acc, q) => {
      return answers[q.id] === q.correctKey ? acc + 1 : acc;
    }, 0);
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const isPassed = percentage >= selectedExam.cutoffPercentage;

    // Desglose por categoría si aplica
    const conocimientosQ = selectedExam.questions.filter((q) => q.category === 'conocimientos');
    const comportamentalesQ = selectedExam.questions.filter((q) => q.category === 'comportamentales');

    const conCount = conocimientosQ.reduce((acc, q) => (answers[q.id] === q.correctKey ? acc + 1 : acc), 0);
    const comCount = comportamentalesQ.reduce((acc, q) => (answers[q.id] === q.correctKey ? acc + 1 : acc), 0);

    const conPct = conocimientosQ.length > 0 ? Math.round((conCount / conocimientosQ.length) * 100) : 0;
    const comPct = comportamentalesQ.length > 0 ? Math.round((comCount / comportamentalesQ.length) * 100) : 0;

    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-12">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-slate-100 dark:bg-slate-800">
            {isPassed ? (
              <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <XCircle className="w-10 h-10 text-rose-600 dark:text-rose-400" />
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {isPassed ? '¡Superaste el Simulacro!' : 'No Aprobado (Bajo el Corte)'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6">
            {selectedExam.title}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto mb-6">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 block mb-1">Puntaje Global</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">{percentage}%</span>
              <span className="text-xs text-slate-400 block mt-0.5">({correctCount}/{totalQuestions})</span>
            </div>

            {conocimientosQ.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500 block mb-1">Conocimientos (70%)</span>
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{conPct}%</span>
                <span className="text-xs text-slate-400 block mt-0.5">({conCount}/{conocimientosQ.length})</span>
              </div>
            )}

            {comportamentalesQ.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500 block mb-1">Comportamental (30%)</span>
                <span className="text-2xl font-black text-purple-600 dark:text-purple-400">{comPct}%</span>
                <span className="text-xs text-slate-400 block mt-0.5">({comCount}/{comportamentalesQ.length})</span>
              </div>
            )}
          </div>

          {/* Diagnóstico Psicométrico */}
          <div
            className={`p-4 rounded-xl text-left border max-w-xl mx-auto mb-6 text-xs sm:text-sm ${
              percentage >= 85
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                : isPassed
                ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-500/30 text-amber-900 dark:text-amber-200'
                : 'bg-rose-50 dark:bg-rose-950/30 border-rose-500/30 text-rose-900 dark:text-rose-200'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {percentage >= 85
                ? 'Semáforo Verde: Desempeño Sobresaliente'
                : isPassed
                ? 'Semáforo Amarillo: Aprobado en Zona de Riesgo'
                : 'Semáforo Rojo: Por Debajo del Umbral Eliminatorio'}
            </div>
            <p>
              {percentage >= 85
                ? 'Tienes un dominio dogmático y procesal impecable. Perfil altamente competitivo para ocupar los primeros puestos de la lista de elegibles de la PGN.'
                : isPassed
                ? 'Superas el umbral mínimo del 65%, pero necesitas reforzar términos procesales y dosimetría sancionatoria para asegurar una posición de nombramiento en período de prueba.'
                : 'Tu puntaje en la prueba eliminatoria no alcanza los 65 puntos. Revisa con urgencia las clases del Módulo II (CGD) y Módulo IV (Contratación Estatal).'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setShowReview(!showReview)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              {showReview ? 'Ocultar Revisión Detallada' : 'Ver Preguntas y Respuestas Detalladas'}
            </button>

            <button
              onClick={() => startExam(selectedExam)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" /> Repetir Simulacro
            </button>

            <button
              onClick={() => setSelectedExam(null)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Volver a Lista de Exámenes
            </button>
          </div>
        </div>

        {/* Revisión pregunta por pregunta */}
        {showReview && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Revisión Pregunta por Pregunta
            </h3>

            {selectedExam.questions.map((q, idx) => {
              const userAns = answers[q.id];
              const isCorrectQ = userAns === q.correctKey;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border bg-white dark:bg-slate-900 transition ${
                    isCorrectQ
                      ? 'border-emerald-500/30'
                      : 'border-rose-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400">
                      Pregunta #{idx + 1}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        isCorrectQ
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {isCorrectQ ? 'Correcta' : 'Incorrecta'}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-slate-900 dark:text-white mb-3">
                    {q.question}
                  </p>

                  <div className="space-y-1.5 text-xs mb-3">
                    {q.options.map((opt) => (
                      <div
                        key={opt.key}
                        className={`p-2 rounded-lg flex items-start gap-2 ${
                          opt.key === q.correctKey
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold'
                            : opt.key === userAns
                            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-medium'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <span className="font-bold">{opt.key})</span>
                        <span>{opt.text}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-800">
                    <strong className="text-slate-800 dark:text-slate-200">Justificación Técnica: </strong>
                    {q.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Vista en ejecución del Examen
  const currentQ = selectedExam.questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const isTimeCritical = timeLeftSeconds < 300; // menos de 5 minutos

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Barra superior de control con temporizador */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4 sticky top-4 z-20 backdrop-blur-md bg-white/90 dark:bg-slate-900/90">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (window.confirm('¿Deseas salir del simulacro? Se perderán las respuestas no guardadas.')) {
                setSelectedExam(null);
              }
            }}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            ← Cancelar
          </button>
          <span className="text-xs font-bold text-slate-900 dark:text-white hidden sm:inline">
            {selectedExam.title}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs text-slate-500">
            Respondidas: <strong className="text-slate-900 dark:text-white">{answeredCount}</strong> / {selectedExam.questionsCount}
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition ${
              isTimeCritical
                ? 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950 dark:text-rose-400 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Timer className="w-4 h-4" />
            {formatTime(timeLeftSeconds)}
          </div>

          <button
            onClick={handleFinishExam}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            Finalizar Examen
          </button>
        </div>
      </div>

      {/* Pregunta Activa */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20">
            Pregunta {currentIndex + 1} de {selectedExam.questionsCount}
          </span>
          <span className="text-xs text-slate-400 capitalize">
            {currentQ.category || 'Conocimientos'}
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed mb-6">
          {currentQ.question}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((option) => {
            const isSelected = answers[currentQ.id] === option.key;

            return (
              <button
                key={option.key}
                onClick={() => handleSelectAnswer(currentQ.id, option.key)}
                className={`w-full text-left p-4 rounded-xl border transition flex items-start gap-3.5 cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-100 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-800/20 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
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
      </div>

      {/* Navegación y Paleta de Preguntas */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Cuadrícula de Navegación de Preguntas
          </span>
          <span className="text-xs text-slate-400">
            Haz clic en cualquier número para ir directo
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1">
          {selectedExam.questions.map((q, idx) => {
            const isAnswered = !!answers[q.id];
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                  isCurrent
                    ? 'ring-2 ring-indigo-500 bg-indigo-600 text-white'
                    : isAnswered
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-700/40'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-40"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Anterior
          </button>

          <button
            disabled={currentIndex === selectedExam.questionsCount - 1}
            onClick={() => setCurrentIndex((prev) => Math.min(selectedExam.questionsCount - 1, prev + 1))}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40"
          >
            Siguiente <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
