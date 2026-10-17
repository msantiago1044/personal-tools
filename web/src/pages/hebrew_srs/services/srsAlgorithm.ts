/**
 * Motor del Algoritmo de Repetición Espaciada (SRS / Leitner Modificado)
 * Generador de Sesiones Inteligentes de 10 Pasos, Racha (Streak) y Diagnóstico Cognitivo
 */

import {
  SRSLevel,
  RatingScore,
  SRSReviewResult,
  ReviewLog,
  MethodComparisonMetrics,
  LearningMethod,
  UserCardProgress,
  HebrewCard,
  StreakData,
  DynamicSessionExercise,
  DailySessionSummary,
  CurriculumPhaseNumber,
} from '../types/hebrewSrs.types';

import {
  SEED_MINIMAL_PAIRS,
  SEED_CLOZE_ITEMS,
  SEED_SYLLABLE_BUILDERS,
  SEED_MATCH_PAIRS,
  SEED_SIDDUR_PHRASES,
} from './seedData';

/**
 * Intervalos de reposo en días por cada una de las 5 cajas Leitner:
 * - Nivel 1: 1 día
 * - Nivel 2: 3 días
 * - Nivel 3: 7 días
 * - Nivel 4: 14 días
 * - Nivel 5: 30 días (Dominado en memoria a largo plazo)
 */
export const LEITNER_INTERVALS_DAYS: Record<SRSLevel, number> = {
  1: 1,
  2: 3,
  3: 7,
  4: 14,
  5: 30,
};

export const METHOD_LABELS: Record<LearningMethod, string> = {
  srs_flashcard: 'Tarjeta Mnemotécnica',
  minimal_pair: 'Pares Mínimos (Discriminación)',
  cloze_niqqud: 'Cloze Inverso (Completar)',
  syllable_builder: 'Ensamblador de Sílabas',
  match_pairs: 'Emparejamiento Rápido',
  siddur_phrase: 'Frase del Siddur / Torá',
  srs_puro: 'SRS Clásico',
  kinetic: 'Kinético',
  auditory: 'Auditivo',
  analytic: 'Analítico',
};

export function formatISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayISODate(): string {
  return formatISODate(new Date());
}

export function addDaysToDate(days: number, baseDate: Date = new Date()): string {
  const result = new Date(baseDate.getTime());
  result.setDate(result.getDate() + days);
  return formatISODate(result);
}

/**
 * Lógica Leitner con 4 botones de evaluación
 */
export function calculateNextReview(
  currentLevel: SRSLevel,
  rating: RatingScore,
  baseDate: Date = new Date()
): SRSReviewResult {
  let newLevel: SRSLevel = currentLevel;
  let isLapse = false;

  switch (rating) {
    case 'again':
      newLevel = 1;
      isLapse = currentLevel > 1;
      break;
    case 'hard':
      newLevel = currentLevel;
      isLapse = false;
      break;
    case 'good':
      newLevel = Math.min(5, currentLevel + 1) as SRSLevel;
      isLapse = false;
      break;
    case 'easy':
      newLevel = Math.min(5, currentLevel + 2) as SRSLevel;
      isLapse = false;
      break;
  }

  const intervalDays = LEITNER_INTERVALS_DAYS[newLevel];
  const nextReviewDate = addDaysToDate(intervalDays, baseDate);

  return {
    previousLevel: currentLevel,
    newLevel,
    intervalDays,
    nextReviewDate,
    isLapse,
  };
}

/**
 * Calcula la racha diaria (Streak) de días consecutivos estudiando
 */
export function updateStreakOnSessionComplete(currentStreak: StreakData): StreakData {
  const today = getTodayISODate();
  if (currentStreak.last_active_date === today && currentStreak.completed_today) {
    return currentStreak; // Ya registrada hoy
  }

  const yesterday = addDaysToDate(-1, new Date());
  let newStreakCount = 1;

  if (currentStreak.last_active_date === yesterday) {
    newStreakCount = currentStreak.current_streak + 1;
  } else if (currentStreak.last_active_date === today) {
    newStreakCount = Math.max(1, currentStreak.current_streak);
  }

  return {
    current_streak: newStreakCount,
    best_streak: Math.max(newStreakCount, currentStreak.best_streak || 0),
    last_active_date: today,
    completed_today: true,
  };
}

/**
 * Generador Inteligente de la Sesión Diaria (10 Ejercicios Balanceados)
 * Fusiona los 9 métodos sin requerir configuración del usuario
 */
export function generateDailySession(
  cards: HebrewCard[],
  progressList: UserCardProgress[],
  activePhase: CurriculumPhaseNumber = 1
): DynamicSessionExercise[] {
  const today = getTodayISODate();
  const progressMap = new Map(progressList.map((p) => [p.card_id, p]));

  // 1. Identificar tarjetas pendientes hoy
  const dueCards = cards.filter((c) => {
    const prog = progressMap.get(c.id);
    return !prog || prog.next_review_date <= today;
  });

  const sessionQueue: DynamicSessionExercise[] = [];
  let exerciseIndex = 0;

  // Si hay pendientes, introducirlas con formatos interactivos adaptativos
  for (const card of dueCards.slice(0, 6)) {
    exerciseIndex++;
    const prog = progressMap.get(card.id);
    const level = prog ? prog.srs_level : 1;

    if (level === 1) {
      // Nuevas o falladas: Tarjeta con Mnemotecnia Visual
      sessionQueue.push({
        id: `sess_ex_${exerciseIndex}`,
        type: 'flashcard',
        cardId: card.id,
        method: 'srs_flashcard',
        phase: card.phase || activePhase,
        data: { kind: 'flashcard', card },
      });
    } else if (level === 2) {
      // Nivel 2: Par Mínimo de discriminación o Cloze
      const pair = SEED_MINIMAL_PAIRS[exerciseIndex % SEED_MINIMAL_PAIRS.length];
      sessionQueue.push({
        id: `sess_ex_${exerciseIndex}`,
        type: 'minimal_pair',
        cardId: card.id,
        method: 'minimal_pair',
        phase: card.phase || activePhase,
        data: { kind: 'minimal_pair', item: pair },
      });
    } else {
      // Nivel 3+: Ensamblador de sílabas bíblicas
      const builder = SEED_SYLLABLE_BUILDERS[exerciseIndex % SEED_SYLLABLE_BUILDERS.length];
      sessionQueue.push({
        id: `sess_ex_${exerciseIndex}`,
        type: 'syllable_builder',
        cardId: card.id,
        method: 'syllable_builder',
        phase: card.phase || activePhase,
        data: { kind: 'syllable_builder', item: builder },
      });
    }
  }

  // 2. Intercalar mecánicas rápidas tipo Duolingo (Ensamblador, Emparejamiento, Cloze)
  const remainingSlots = Math.max(0, 10 - sessionQueue.length);

  // Agregar siempre un Emparejamiento Rápido de Fichas (Match Pairs)
  if (sessionQueue.length < 10) {
    exerciseIndex++;
    sessionQueue.push({
      id: `sess_ex_${exerciseIndex}`,
      type: 'match_pairs',
      method: 'match_pairs',
      phase: activePhase,
      data: { kind: 'match_pairs', items: SEED_MATCH_PAIRS },
    });
  }

  // Agregar Cloze de completar Niqqud
  if (sessionQueue.length < 10) {
    exerciseIndex++;
    const cloze = SEED_CLOZE_ITEMS[exerciseIndex % SEED_CLOZE_ITEMS.length];
    sessionQueue.push({
      id: `sess_ex_${exerciseIndex}`,
      type: 'cloze_niqqud',
      method: 'cloze_niqqud',
      phase: activePhase,
      data: { kind: 'cloze_niqqud', item: cloze },
    });
  }

  // Agregar Ensamblador de sílabas del Siddur
  if (sessionQueue.length < 10) {
    exerciseIndex++;
    const builder = SEED_SYLLABLE_BUILDERS[(exerciseIndex + 1) % SEED_SYLLABLE_BUILDERS.length];
    sessionQueue.push({
      id: `sess_ex_${exerciseIndex}`,
      type: 'syllable_builder',
      method: 'syllable_builder',
      phase: activePhase,
      data: { kind: 'syllable_builder', item: builder },
    });
  }

  // Culminar con una frase bíblica real del Siddur o Jumash
  if (sessionQueue.length < 10) {
    exerciseIndex++;
    const phrase = SEED_SIDDUR_PHRASES[0];
    sessionQueue.push({
      id: `sess_ex_${exerciseIndex}`,
      type: 'siddur_phrase',
      method: 'siddur_phrase',
      phase: activePhase,
      data: { kind: 'siddur_phrase', item: phrase },
    });
  }

  // Rellenar con tarjetas flashcards si aún falta para completar 10
  while (sessionQueue.length < 10) {
    exerciseIndex++;
    const card = cards[exerciseIndex % cards.length];
    sessionQueue.push({
      id: `sess_ex_${exerciseIndex}`,
      type: 'flashcard',
      cardId: card.id,
      method: 'srs_flashcard',
      phase: card.phase || activePhase,
      data: { kind: 'flashcard', card },
    });
  }

  return sessionQueue.slice(0, 10);
}

/**
 * Generador de Práctica Libre (Sin alterar fechas del SRS)
 */
export function generateFreePracticeSession(
  mode: 'all' | 'syllables' | 'pairs' | 'phrases' | 'match',
  cards: HebrewCard[]
): DynamicSessionExercise[] {
  const result: DynamicSessionExercise[] = [];

  if (mode === 'syllables') {
    SEED_SYLLABLE_BUILDERS.forEach((item, i) => {
      result.push({
        id: `free_syl_${i}`,
        type: 'syllable_builder',
        method: 'syllable_builder',
        phase: 1,
        data: { kind: 'syllable_builder', item },
      });
    });
  } else if (mode === 'pairs') {
    SEED_MINIMAL_PAIRS.forEach((item, i) => {
      result.push({
        id: `free_pair_${i}`,
        type: 'minimal_pair',
        method: 'minimal_pair',
        phase: 1,
        data: { kind: 'minimal_pair', item },
      });
    });
  } else if (mode === 'phrases') {
    SEED_SIDDUR_PHRASES.forEach((item, i) => {
      result.push({
        id: `free_phrase_${i}`,
        type: 'siddur_phrase',
        method: 'siddur_phrase',
        phase: 5,
        data: { kind: 'siddur_phrase', item },
      });
    });
  } else if (mode === 'match') {
    result.push({
      id: 'free_match_1',
      type: 'match_pairs',
      method: 'match_pairs',
      phase: 1,
      data: { kind: 'match_pairs', items: SEED_MATCH_PAIRS },
    });
  } else {
    // Mezcla equilibrada para entrenamiento general
    cards.slice(0, 4).forEach((card, i) => {
      result.push({
        id: `free_card_${i}`,
        type: 'flashcard',
        cardId: card.id,
        method: 'srs_flashcard',
        phase: card.phase || 1,
        data: { kind: 'flashcard', card },
      });
    });
    SEED_SYLLABLE_BUILDERS.slice(0, 3).forEach((item, i) => {
      result.push({
        id: `free_mix_syl_${i}`,
        type: 'syllable_builder',
        method: 'syllable_builder',
        phase: 1,
        data: { kind: 'syllable_builder', item },
      });
    });
    result.push({
      id: 'free_mix_match',
      type: 'match_pairs',
      method: 'match_pairs',
      phase: 1,
      data: { kind: 'match_pairs', items: SEED_MATCH_PAIRS },
    });
    SEED_SIDDUR_PHRASES.slice(0, 2).forEach((item, i) => {
      result.push({
        id: `free_mix_phrase_${i}`,
        type: 'siddur_phrase',
        method: 'siddur_phrase',
        phase: 5,
        data: { kind: 'siddur_phrase', item },
      });
    });
  }

  return result;
}

/**
 * Calcula el resumen diario y el Diagnóstico Cognitivo al terminar la sesión
 */
export function calculateDailySessionSummary(
  logs: ReviewLog[],
  streak: StreakData,
  totalReviewed: number
): DailySessionSummary {
  const sessionLogs = logs.slice(0, totalReviewed);
  const correctCount = sessionLogs.filter(
    (l) => l.rating_score === 'good' || l.rating_score === 'easy' || l.is_correct === true
  ).length;

  const accuracyPercent =
    totalReviewed > 0 ? Math.round((correctCount / totalReviewed) * 100) : 100;

  const totalTime = sessionLogs.reduce((acc, l) => acc + (l.reaction_time_ms || 1500), 0);
  const avgReactionTimeMs = totalReviewed > 0 ? Math.round(totalTime / totalReviewed) : 1400;

  // Agrupar por método para encontrar el más fuerte de hoy
  const methodMap = new Map<LearningMethod, { correct: number; total: number; time: number }>();
  for (const log of sessionLogs) {
    const cur = methodMap.get(log.method_used) || { correct: 0, total: 0, time: 0 };
    cur.total++;
    cur.time += log.reaction_time_ms || 1500;
    if (log.rating_score === 'good' || log.rating_score === 'easy' || log.is_correct) {
      cur.correct++;
    }
    methodMap.set(log.method_used, cur);
  }

  let bestMethod: LearningMethod = 'syllable_builder';
  let bestScore = -1;

  methodMap.forEach((val, m) => {
    const rate = val.total > 0 ? (val.correct / val.total) * 100 : 0;
    if (rate > bestScore) {
      bestScore = rate;
      bestMethod = m;
    }
  });

  const bestMethodLabel = METHOD_LABELS[bestMethod] || 'Ensamblador de Sílabas';

  let verdictText = `Tu cerebro decodificó con ${accuracyPercent}% de precisión y ${avgReactionTimeMs}ms de velocidad promedio.`;
  if (accuracyPercent >= 90) {
    verdictText +=
      ' ¡Excelente sesión! Tu retención en el vocabulario del Siddur se afianzó sólidamente.';
  } else {
    verdictText +=
      ' Buen entrenamiento. El sistema programó las tarjetas de menor velocidad para repasar pronto.';
  }

  return {
    totalReviewed,
    correctCount,
    accuracyPercent,
    avgReactionTimeMs,
    streak: streak.current_streak,
    bestMethodToday: bestMethodLabel,
    bestMethodDescription: `Alcanzaste tu mayor precisión en ${bestMethodLabel}.`,
    verdictText,
    phaseAdvanceText: 'Avanzaste en tu meta de lectura del Siddur y Jumash.',
  };
}

/**
 * Métricas históricas completas agrupadas por método
 */
export function calculateMethodMetrics(
  logs: ReviewLog[],
  progress: UserCardProgress[],
  cards: HebrewCard[]
): MethodComparisonMetrics[] {
  const methods: LearningMethod[] = [
    'syllable_builder',
    'minimal_pair',
    'srs_flashcard',
    'cloze_niqqud',
    'match_pairs',
    'siddur_phrase',
  ];

  return methods.map((m) => {
    const methodLogs = logs.filter((l) => l.method_used === m);
    const totalReviews = methodLogs.length;

    const totalTime = methodLogs.reduce((acc, l) => acc + (l.reaction_time_ms || 1500), 0);
    const avgReactionTimeMs = totalReviews > 0 ? Math.round(totalTime / totalReviews) : 0;

    const correctLogs = methodLogs.filter(
      (l) => l.rating_score === 'good' || l.rating_score === 'easy' || l.is_correct === true
    );
    const accuracyRate = totalReviews > 0 ? Math.round((correctLogs.length / totalReviews) * 100) : 0;

    // Retención estimada: % que no cayó en 'again'
    const nonLapses = methodLogs.filter((l) => l.rating_score !== 'again');
    const retention7DaysPercent =
      totalReviews > 0 ? Math.round((nonLapses.length / totalReviews) * 100) : 0;

    return {
      method: m,
      methodLabel: METHOD_LABELS[m],
      totalReviews,
      avgReactionTimeMs,
      retention7DaysPercent,
      masteredCardsCount: progress.filter((p) => p.srs_level === 5).length,
      accuracyRate,
    };
  });
}
