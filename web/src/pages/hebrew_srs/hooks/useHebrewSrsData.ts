import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  StudyBlock,
  HebrewCard,
  UserCardProgress,
  ReviewLog,
  RatingScore,
  SRSLevel,
  DailyReviewStats,
  MethodComparisonMetrics,
  StreakData,
  DynamicSessionExercise,
  DailySessionSummary,
  CurriculumPhaseNumber,
} from '../types/hebrewSrs.types';
import { HebrewSrsService } from '../services/hebrewSrsService';
import {
  generateDailySession,
  generateFreePracticeSession,
  updateStreakOnSessionComplete,
  calculateDailySessionSummary,
  calculateMethodMetrics,
  getTodayISODate,
} from '../services/srsAlgorithm';
import { HebrewSrsTab } from '../components/HebrewSrsHeader';

export function useHebrewSrsData(userId: string) {
  const [loading, setLoading] = useState(true);
  const [blocks, setBlocks] = useState<StudyBlock[]>([]);
  const [cards, setCards] = useState<HebrewCard[]>([]);
  const [progress, setProgress] = useState<UserCardProgress[]>([]);
  const [logs, setLogs] = useState<ReviewLog[]>([]);
  const [streak, setStreak] = useState<StreakData>({
    current_streak: 1,
    best_streak: 1,
    last_active_date: getTodayISODate(),
    completed_today: false,
  });
  const [activePhase, setActivePhaseState] = useState<CurriculumPhaseNumber>(1);

  // Navegación principal
  const [activeTab, setActiveTab] = useState<HebrewSrsTab>('dashboard');

  // Sesión Activa
  const [activeSessionQueue, setActiveSessionQueue] = useState<DynamicSessionExercise[]>([]);
  const [sessionTitle, setSessionTitle] = useState('Sesión Diaria');
  const [isFreePracticeSession, setIsFreePracticeSession] = useState(false);
  const [sessionCompletedLogs, setSessionCompletedLogs] = useState<ReviewLog[]>([]);

  // Modal de resumen diario
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [dailySummary, setDailySummary] = useState<DailySessionSummary | null>(null);

  // Carga inicial de datos
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        fetchedBlocks,
        fetchedCards,
        fetchedProgress,
        fetchedLogs,
        fetchedStreak,
        fetchedPhase,
      ] = await Promise.all([
        HebrewSrsService.getStudyBlocks(),
        HebrewSrsService.getCards(),
        HebrewSrsService.getUserProgress(userId),
        HebrewSrsService.getReviewLogs(userId),
        HebrewSrsService.getStreak(userId),
        HebrewSrsService.getActivePhase(userId),
      ]);

      setBlocks(fetchedBlocks);
      setCards(fetchedCards);
      setProgress(fetchedProgress);
      setLogs(fetchedLogs);
      setStreak(fetchedStreak);
      setActivePhaseState(fetchedPhase);
    } catch (err) {
      console.error('[useHebrewSrsData] Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Cambiar fase activa
  const handleSetActivePhase = useCallback(
    async (phase: CurriculumPhaseNumber) => {
      setActivePhaseState(phase);
      await HebrewSrsService.saveActivePhase(userId, phase);
    },
    [userId]
  );

  // Iniciar Sesión Diaria (Botón 1)
  const handleStartDailySession = useCallback(() => {
    const queue = generateDailySession(cards, progress, activePhase);
    setActiveSessionQueue(queue);
    setSessionTitle('Mi Sesión Diaria');
    setIsFreePracticeSession(false);
    setSessionCompletedLogs([]);
    setActiveTab('session');
  }, [cards, progress, activePhase]);

  // Iniciar Práctica Libre (Botón 2)
  const handleStartFreePractice = useCallback(
    (mode: 'all' | 'syllables' | 'pairs' | 'phrases' | 'match') => {
      const queue = generateFreePracticeSession(mode, cards);
      setActiveSessionQueue(queue);
      const titleMap = {
        all: 'Práctica Libre • Entrenamiento Mixto',
        syllables: 'Práctica Libre • Sílabas del Siddur',
        pairs: 'Práctica Libre • Pares Mínimos',
        phrases: 'Práctica Libre • Lectura de Oraciones',
        match: 'Práctica Libre • Emparejamiento Rápido',
      };
      setSessionTitle(titleMap[mode]);
      setIsFreePracticeSession(true);
      setSessionCompletedLogs([]);
      setActiveTab('session');
    },
    [cards]
  );

  // Registro de un paso completado en la sesión
  const handleStepComplete = useCallback(
    async (
      exercise: DynamicSessionExercise,
      rating: RatingScore,
      reactionTimeMs: number,
      isCorrect?: boolean
    ) => {
      let createdLog: ReviewLog;

      if (exercise.cardId && !isFreePracticeSession) {
        // Tarjeta vinculada al motor SRS
        const result = await HebrewSrsService.recordReview(
          userId,
          exercise.cardId,
          exercise.method,
          reactionTimeMs,
          rating,
          progress,
          { isCorrect }
        );
        createdLog = result.log;

        // Actualizar progreso en memoria
        setProgress((prev) => {
          const filtered = prev.filter((p) => p.card_id !== exercise.cardId);
          return [...filtered, result.updatedProgress];
        });
      } else {
        // Ejercicio sin tarjeta fija o de práctica libre
        createdLog = {
          id: `log_free_${Date.now()}`,
          user_id: userId,
          card_id: exercise.cardId || 'generic',
          method_used: exercise.method,
          reaction_time_ms: reactionTimeMs,
          rating_score: rating,
          previous_level: 1,
          new_level: 1,
          is_correct: isCorrect,
          created_at: new Date().toISOString(),
        };
      }

      setLogs((prev) => [createdLog, ...prev]);
      setSessionCompletedLogs((prev) => [createdLog, ...prev]);
    },
    [userId, progress, isFreePracticeSession]
  );

  // Fin de sesión (Completó los 10 pasos)
  const handleSessionFinished = useCallback(async () => {
    if (!isFreePracticeSession) {
      // 1. Actualizar Racha
      const updatedStreak = updateStreakOnSessionComplete(streak);
      setStreak(updatedStreak);
      await HebrewSrsService.saveStreak(userId, updatedStreak);

      // 2. Calcular diagnóstico del día
      const summary = calculateDailySessionSummary(
        sessionCompletedLogs,
        updatedStreak,
        activeSessionQueue.length
      );
      setDailySummary(summary);
      setShowCompletionModal(true);
    } else {
      // Práctica libre finalizada -> vuelve al dashboard
      setActiveTab('dashboard');
    }
  }, [isFreePracticeSession, streak, sessionCompletedLogs, activeSessionQueue.length, userId]);

  // Cerrar modal de resumen
  const handleCloseCompletionModal = useCallback(
    (goToFreePractice = false) => {
      setShowCompletionModal(false);
      setDailySummary(null);
      if (goToFreePractice) {
        handleStartFreePractice('all');
      } else {
        setActiveTab('dashboard');
      }
    },
    [handleStartFreePractice]
  );

  // Estadísticas del día
  const dailyStats: DailyReviewStats = useMemo(() => {
    const today = getTodayISODate();
    const progressMap = new Map(progress.map((p) => [p.card_id, p]));

    let pendingCount = 0;
    let masteredCount = 0;
    const levelDistribution: Record<SRSLevel, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    for (const card of cards) {
      const prog = progressMap.get(card.id);
      if (!prog || prog.next_review_date <= today) {
        pendingCount++;
      }
      const lvl = prog ? prog.srs_level : 1;
      levelDistribution[lvl]++;
      if (lvl === 5) masteredCount++;
    }

    return {
      totalPendingToday: pendingCount,
      completedToday: streak.completed_today ? 10 : 0,
      masteredCount,
      totalCards: cards.length,
      levelDistribution,
      streak,
      activePhase,
    };
  }, [cards, progress, streak, activePhase]);

  // Métricas agregadas por método
  const methodMetrics: MethodComparisonMetrics[] = useMemo(() => {
    return calculateMethodMetrics(logs, progress, cards);
  }, [logs, progress, cards]);

  return {
    loading,
    blocks,
    cards,
    progress,
    logs,
    streak,
    activePhase,
    setActivePhase: handleSetActivePhase,
    activeTab,
    setActiveTab,
    activeSessionQueue,
    sessionTitle,
    dailyStats,
    methodMetrics,
    showCompletionModal,
    dailySummary,
    handleStartDailySession,
    handleStartFreePractice,
    handleStepComplete,
    handleSessionFinished,
    handleCloseCompletionModal,
  };
}
