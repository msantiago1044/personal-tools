import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  StudyBlock,
  HebrewCard,
  UserCardProgress,
  ReviewLog,
  LearningMethod,
  RatingScore,
  SRSLevel,
  DailyReviewStats,
  MethodComparisonMetrics,
} from '../types/hebrewSrs.types';
import { HebrewSrsService } from '../services/hebrewSrsService';
import {
  isCardDue,
  getTodayISODate,
  calculateMethodComparison,
} from '../services/srsAlgorithm';

export function useHebrewSrsData(userId: string) {
  const [loading, setLoading] = useState(true);
  const [blocks, setBlocks] = useState<StudyBlock[]>([]);
  const [cards, setCards] = useState<HebrewCard[]>([]);
  const [progress, setProgress] = useState<UserCardProgress[]>([]);
  const [logs, setLogs] = useState<ReviewLog[]>([]);
  const [blockSettings, setBlockSettings] = useState<Record<string, LearningMethod>>({});

  // Filtro de bloque actual ('all' o un blockId específico)
  const [selectedBlockId, setSelectedBlockId] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'study' | 'dashboard' | 'metrics' | 'blocks'>('dashboard');

  // Índice de la tarjeta activa en la sesión de estudio actual
  const [studyCardIndex, setStudyCardIndex] = useState(0);

  // Carga inicial de datos
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [fetchedBlocks, fetchedCards, fetchedProgress, fetchedLogs, fetchedSettings] =
        await Promise.all([
          HebrewSrsService.getStudyBlocks(),
          HebrewSrsService.getCards(),
          HebrewSrsService.getUserProgress(userId),
          HebrewSrsService.getReviewLogs(userId),
          HebrewSrsService.getBlockSettings(userId),
        ]);

      setBlocks(fetchedBlocks);
      setCards(fetchedCards);
      setProgress(fetchedProgress);
      setLogs(fetchedLogs);
      setBlockSettings(fetchedSettings);
    } catch (err) {
      console.error('[useHebrewSrsData] Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Mapa rápido de progreso por card_id
  const progressMap = useMemo(() => {
    const map = new Map<string, UserCardProgress>();
    progress.forEach((p) => map.set(p.card_id, p));
    return map;
  }, [progress]);

  // Tarjetas filtradas por bloque seleccionado
  const filteredCards = useMemo(() => {
    if (selectedBlockId === 'all') return cards;
    return cards.filter((c) => c.block_id === selectedBlockId);
  }, [cards, selectedBlockId]);

  // Tarjetas pendientes de revisión hoy (o nuevas aún sin repasar)
  const dueCards = useMemo(() => {
    const today = getTodayISODate();
    return filteredCards.filter((card) => {
      const p = progressMap.get(card.id);
      if (!p) return true; // Tarjeta nueva sin revisar: pendiente hoy
      return isCardDue(p.next_review_date, today);
    });
  }, [filteredCards, progressMap]);

  // Tarjeta actual para la vista de estudio
  const currentStudyCard = useMemo(() => {
    if (dueCards.length === 0) return null;
    const safeIndex = Math.min(studyCardIndex, dueCards.length - 1);
    return dueCards[safeIndex] || null;
  }, [dueCards, studyCardIndex]);

  // Método activo para la tarjeta actual según la configuración de su bloque
  const currentCardMethod = useMemo<LearningMethod>(() => {
    if (!currentStudyCard) return 'srs_puro';
    return blockSettings[currentStudyCard.block_id] || 'srs_puro';
  }, [currentStudyCard, blockSettings]);

  // Estadísticas diarias consolidadas
  const dailyStats = useMemo<DailyReviewStats>(() => {
    const today = getTodayISODate();
    const levelDistribution: Record<SRSLevel, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let masteredCount = 0;

    cards.forEach((c) => {
      const p = progressMap.get(c.id);
      const level: SRSLevel = p ? p.srs_level : 1;
      levelDistribution[level]++;
      if (level === 5) masteredCount++;
    });

    // Cuántas se repasaron hoy
    const completedToday = logs.filter((log) => {
      return log.created_at.startsWith(today);
    }).length;

    const totalPendingToday = dueCards.length;

    return {
      totalPendingToday,
      completedToday,
      masteredCount,
      totalCards: cards.length,
      levelDistribution,
    };
  }, [cards, progressMap, logs, dueCards]);

  // Métricas comparativas entre los 4 métodos
  const methodMetrics = useMemo<MethodComparisonMetrics[]>(() => {
    return calculateMethodComparison(logs, progress, cards);
  }, [logs, progress, cards]);

  // Acción: Calificar y registrar revisión de tarjeta
  const handleReviewCard = async (
    rating: RatingScore,
    reactionTimeMs: number,
    tactileVerified?: boolean
  ) => {
    if (!currentStudyCard) return;

    const method = currentCardMethod;

    try {
      const { updatedProgress, log } = await HebrewSrsService.recordReview(
        userId,
        currentStudyCard.id,
        method,
        reactionTimeMs,
        rating,
        progress,
        tactileVerified
      );

      // Actualizar estado local reactivo
      setProgress((prev) => {
        const filtered = prev.filter((p) => p.card_id !== currentStudyCard.id);
        return [...filtered, updatedProgress];
      });

      setLogs((prev) => [log, ...prev]);

      // Si aún quedan tarjetas, no es necesario cambiar el índice si la lista disminuye
      // pero si el índice excede el nuevo tamaño, ajustamos
      if (studyCardIndex >= dueCards.length - 1) {
        setStudyCardIndex(0);
      }
    } catch (err) {
      console.error('[useHebrewSrsData] Error al registrar revisión:', err);
    }
  };

  // Acción: Asignar método experimental a un bloque
  const handleUpdateBlockMethod = async (blockId: string, method: LearningMethod) => {
    setBlockSettings((prev) => ({ ...prev, [blockId]: method }));
    await HebrewSrsService.saveBlockSetting(userId, blockId, method);
  };

  return {
    loading,
    blocks,
    cards,
    progress,
    logs,
    blockSettings,
    selectedBlockId,
    setSelectedBlockId,
    activeTab,
    setActiveTab,
    dueCards,
    currentStudyCard,
    currentCardMethod,
    studyCardIndex,
    setStudyCardIndex,
    dailyStats,
    methodMetrics,
    handleReviewCard,
    handleUpdateBlockMethod,
    reload: loadData,
  };
}
