/**
 * Motor del Algoritmo de Repetición Espaciada (SRS / Leitner Modificado)
 * Especializado en Decodificación Fonética de Hebreo Bíblico
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
} from '../types/hebrewSrs.types';

/**
 * Intervalos de reposo en días por cada una de las 5 cajas Leitner:
 * - Nivel 1: 1 día
 * - Nivel 2: 3 días
 * - Nivel 3: 7 días
 * - Nivel 4: 14 días
 * - Nivel 5: 30 días (Dominado)
 */
export const LEITNER_INTERVALS_DAYS: Record<SRSLevel, number> = {
  1: 1,
  2: 3,
  3: 7,
  4: 14,
  5: 30,
};

export const METHOD_LABELS: Record<LearningMethod, string> = {
  srs_puro: 'SRS Clásico (Puro)',
  kinetic: 'Kinético / Escritura',
  auditory: 'Auditivo / WebSpeech',
  analytic: 'Analítico / Reglas',
};

/**
 * Da formato ISO local YYYY-MM-DD a un objeto Date
 */
export function formatISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Obtiene la fecha de hoy normalizada a medianoche local YYYY-MM-DD
 */
export function getTodayISODate(): string {
  return formatISODate(new Date());
}

/**
 * Suma días a una fecha base (ISO string o Date) preservando zona horaria local
 */
export function addDaysToDate(days: number, baseDate: Date = new Date()): string {
  const result = new Date(baseDate.getTime());
  result.setDate(result.getDate() + days);
  return formatISODate(result);
}

/**
 * Calcula la transición de nivel y la próxima fecha de revisión según el
 * algoritmo Leitner modificado con 4 botones de autoevaluación:
 *
 * 1. 'again' (Falló): Regresa directo al Nivel 1. (Lapse)
 * 2. 'hard'  (Dudó):  Mantiene el nivel actual.
 * 3. 'good'  (Normal): Avanza +1 nivel (máx 5).
 * 4. 'easy'  (Inmediato): Avanza +2 niveles (salto acelerado, máx 5).
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
      // Mantiene el nivel actual
      newLevel = currentLevel;
      isLapse = false;
      break;

    case 'good':
      // Avanza +1 nivel (máximo 5)
      newLevel = Math.min(5, currentLevel + 1) as SRSLevel;
      isLapse = false;
      break;

    case 'easy':
      // Salto acelerado: Avanza +2 niveles (máximo 5)
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
 * Determina si una tarjeta está vencida para repaso hoy o antes
 */
export function isCardDue(nextReviewDateStr: string, todayStr: string = getTodayISODate()): boolean {
  return nextReviewDateStr <= todayStr;
}

/**
 * Calcula métricas comparativas científicas entre los métodos de aprendizaje:
 * - Tiempo de reacción promedio (ms)
 * - Tasa de retención a 7 días (porcentaje de tarjetas en nivel 3+ o aciertos sostenidos)
 * - Tasa de precisión general (% sin 'again')
 * - Tarjetas en Nivel 5 (Dominadas)
 * - Adherencia táctil para el método kinético
 */
export function calculateMethodComparison(
  logs: ReviewLog[],
  progressList: UserCardProgress[],
  cards: HebrewCard[]
): MethodComparisonMetrics[] {
  const methods: LearningMethod[] = ['srs_puro', 'kinetic', 'auditory', 'analytic'];
  const cardMap = new Map<string, HebrewCard>(cards.map((c) => [c.id, c]));
  const progressMap = new Map<string, UserCardProgress>(progressList.map((p) => [p.card_id, p]));

  return methods.map((method) => {
    const methodLogs = logs.filter((log) => log.method_used === method);
    const totalReviews = methodLogs.length;

    // 1. Latencia promedio de reconocimiento (Recall Time en ms)
    const avgReactionTimeMs =
      totalReviews > 0
        ? Math.round(methodLogs.reduce((acc, log) => acc + log.reaction_time_ms, 0) / totalReviews)
        : 0;

    // 2. Tasa de precisión inmediata (% que no fue 'again')
    const successfulReviews = methodLogs.filter((log) => log.rating_score !== 'again').length;
    const accuracyRate = totalReviews > 0 ? Math.round((successfulReviews / totalReviews) * 100) : 0;

    // 3. Tarjetas asociadas a este método (según último log o progreso)
    const cardIdsForMethod = new Set(methodLogs.map((l) => l.card_id));
    let masteredCardsCount = 0;
    let cardsInLevel3OrHigher = 0;

    cardIdsForMethod.forEach((cardId) => {
      const prog = progressMap.get(cardId);
      if (prog) {
        if (prog.srs_level === 5) masteredCardsCount++;
        if (prog.srs_level >= 3) cardsInLevel3OrHigher++; // Intervalos de 7+ días
      }
    });

    // 4. Retención a 7 días (% de tarjetas que alcanzaron el umbral de 7 días sin recaer)
    const totalCardsTested = cardIdsForMethod.size;
    const retention7DaysPercent =
      totalCardsTested > 0 ? Math.round((cardsInLevel3OrHigher / totalCardsTested) * 100) : 0;

    // 5. Adherencia táctil (para Kinético)
    let tactileAdherencePercent: number | undefined;
    if (method === 'kinetic' && totalReviews > 0) {
      const tactileCount = methodLogs.filter((l) => l.tactile_verified).length;
      tactileAdherencePercent = Math.round((tactileCount / totalReviews) * 100);
    }

    return {
      method,
      methodLabel: METHOD_LABELS[method],
      totalReviews,
      avgReactionTimeMs,
      retention7DaysPercent,
      masteredCardsCount,
      accuracyRate,
      tactileAdherencePercent,
    };
  });
}
