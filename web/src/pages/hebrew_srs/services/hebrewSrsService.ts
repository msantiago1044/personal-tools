/**
 * Servicio de Persistencia Dual (Supabase + LocalStorage Fallback)
 * Cumple con Ley 5 (Resiliencia) y Ley 6 (Persistencia Segura) de LEYES_MODULARES.md
 */

import { supabase } from '../../../lib/supabase';
import {
  StudyBlock,
  HebrewCard,
  UserCardProgress,
  ReviewLog,
  LearningMethod,
  RatingScore,
  SRSLevel,
  StreakData,
  CurriculumPhaseNumber,
} from '../types/hebrewSrs.types';
import { SEED_STUDY_BLOCKS, SEED_HEBREW_CARDS } from './seedData';
import { calculateNextReview, getTodayISODate } from './srsAlgorithm';

const STORAGE_KEYS = {
  BLOCK_SETTINGS: 'hebrew_srs_block_settings',
  CARD_PROGRESS: 'hebrew_srs_card_progress',
  REVIEW_LOGS: 'hebrew_srs_review_logs',
  STREAK: 'hebrew_srs_streak',
  ACTIVE_PHASE: 'hebrew_srs_active_phase',
};

export class HebrewSrsService {
  /**
   * Obtiene los bloques de estudio disponibles
   */
  public static async getStudyBlocks(): Promise<StudyBlock[]> {
    try {
      const { data, error } = await supabase
        .from('hebrew_study_blocks')
        .select('*')
        .order('order_index', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as StudyBlock[];
      }
    } catch (e) {
      // Usar fallback local
    }
    return SEED_STUDY_BLOCKS;
  }

  /**
   * Obtiene las tarjetas de estudio (filtrables por bloque o fase)
   */
  public static async getCards(blockId?: string): Promise<HebrewCard[]> {
    try {
      let query = supabase.from('hebrew_cards').select('*');
      if (blockId && blockId !== 'all') {
        query = query.eq('block_id', blockId);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as HebrewCard[];
      }
    } catch (e) {
      // Usar fallback local
    }
    return blockId && blockId !== 'all'
      ? SEED_HEBREW_CARDS.filter((c) => c.block_id === blockId)
      : SEED_HEBREW_CARDS;
  }

  /**
   * Obtiene la Racha Diaria del Usuario (Streak)
   */
  public static async getStreak(userId: string): Promise<StreakData> {
    const defaultStreak: StreakData = {
      current_streak: 1,
      best_streak: 1,
      last_active_date: getTodayISODate(),
      completed_today: false,
    };

    try {
      const raw = localStorage.getItem(`${STORAGE_KEYS.STREAK}_${userId}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        const today = getTodayISODate();
        // Verificar si la fecha de completado es de hoy
        parsed.completed_today = parsed.last_active_date === today && parsed.completed_today;
        return parsed;
      }
    } catch (e) {}

    return defaultStreak;
  }

  /**
   * Guarda la Racha Diaria
   */
  public static async saveStreak(userId: string, streak: StreakData): Promise<void> {
    try {
      localStorage.setItem(`${STORAGE_KEYS.STREAK}_${userId}`, JSON.stringify(streak));
    } catch (e) {}
  }

  /**
   * Obtiene la fase activa del currículo (1 a 5)
   */
  public static async getActivePhase(userId: string): Promise<CurriculumPhaseNumber> {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEYS.ACTIVE_PHASE}_${userId}`);
      if (raw) return parseInt(raw, 10) as CurriculumPhaseNumber;
    } catch (e) {}
    return 1;
  }

  /**
   * Guarda la fase activa del currículo
   */
  public static async saveActivePhase(
    userId: string,
    phase: CurriculumPhaseNumber
  ): Promise<void> {
    try {
      localStorage.setItem(`${STORAGE_KEYS.ACTIVE_PHASE}_${userId}`, phase.toString());
    } catch (e) {}
  }

  /**
   * Obtiene el progreso de todas las tarjetas para el usuario
   */
  public static async getUserProgress(userId: string): Promise<UserCardProgress[]> {
    try {
      const { data, error } = await supabase
        .from('user_hebrew_card_progress')
        .select('*')
        .eq('user_id', userId);

      if (!error && data && data.length > 0) {
        return data as UserCardProgress[];
      }
    } catch (e) {}

    try {
      const raw = localStorage.getItem(`${STORAGE_KEYS.CARD_PROGRESS}_${userId}`);
      if (raw) return JSON.parse(raw);
    } catch (e) {}

    return [];
  }

  /**
   * Obtiene el historial de revisiones (logs) para análisis de retención
   */
  public static async getReviewLogs(userId: string): Promise<ReviewLog[]> {
    try {
      const { data, error } = await supabase
        .from('hebrew_review_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as ReviewLog[];
      }
    } catch (e) {}

    try {
      const raw = localStorage.getItem(`${STORAGE_KEYS.REVIEW_LOGS}_${userId}`);
      if (raw) return JSON.parse(raw);
    } catch (e) {}

    return [];
  }

  /**
   * Registra una revisión completada en el motor SRS y guarda log psicométrico
   */
  public static async recordReview(
    userId: string,
    cardId: string,
    methodUsed: LearningMethod,
    reactionTimeMs: number,
    ratingScore: RatingScore,
    currentProgressList: UserCardProgress[],
    options?: {
      isCorrect?: boolean;
      voiceVerified?: boolean;
      tactileVerified?: boolean;
    }
  ): Promise<{ updatedProgress: UserCardProgress; log: ReviewLog }> {
    const existing = currentProgressList.find((p) => p.card_id === cardId);
    const previousLevel: SRSLevel = existing ? existing.srs_level : 1;

    // Calcular siguiente nivel y fecha
    const srsResult = calculateNextReview(previousLevel, ratingScore);

    const nowISO = new Date().toISOString();
    const updatedProgress: UserCardProgress = {
      id: existing?.id || `prog_${cardId}_${Date.now()}`,
      user_id: userId,
      card_id: cardId,
      srs_level: srsResult.newLevel,
      next_review_date: srsResult.nextReviewDate,
      last_reviewed_at: nowISO,
      repetitions: (existing?.repetitions || 0) + 1,
      lapses: (existing?.lapses || 0) + (srsResult.isLapse ? 1 : 0),
      current_streak: srsResult.isLapse ? 0 : (existing?.current_streak || 0) + 1,
      updated_at: nowISO,
    };

    const log: ReviewLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      user_id: userId,
      card_id: cardId,
      method_used: methodUsed,
      reaction_time_ms: reactionTimeMs,
      rating_score: ratingScore,
      previous_level: previousLevel,
      new_level: srsResult.newLevel,
      is_correct:
        options?.isCorrect !== undefined
          ? options.isCorrect
          : ratingScore === 'good' || ratingScore === 'easy',
      tactile_verified: options?.tactileVerified || false,
      voice_verified: options?.voiceVerified || false,
      created_at: nowISO,
    };

    // 1. Guardar en Supabase (asíncrono, no bloqueante)
    try {
      await supabase.from('user_hebrew_card_progress').upsert(
        {
          user_id: userId,
          card_id: cardId,
          srs_level: updatedProgress.srs_level,
          next_review_date: updatedProgress.next_review_date,
          last_reviewed_at: updatedProgress.last_reviewed_at,
          repetitions: updatedProgress.repetitions,
          lapses: updatedProgress.lapses,
          current_streak: updatedProgress.current_streak,
          updated_at: nowISO,
        },
        { onConflict: 'user_id,card_id' }
      );

      await supabase.from('hebrew_review_logs').insert({
        user_id: userId,
        card_id: cardId,
        method_used: methodUsed,
        reaction_time_ms: reactionTimeMs,
        rating_score: ratingScore,
        previous_level: previousLevel,
        new_level: srsResult.newLevel,
        is_correct: log.is_correct,
        tactile_verified: log.tactile_verified,
        created_at: nowISO,
      });
    } catch (e) {
      // Error silencioso, se mantiene en LocalStorage
    }

    // 2. Guardar en LocalStorage
    try {
      const storedProgress = await this.getUserProgress(userId);
      const filteredProg = storedProgress.filter((p) => p.card_id !== cardId);
      filteredProg.push(updatedProgress);
      localStorage.setItem(`${STORAGE_KEYS.CARD_PROGRESS}_${userId}`, JSON.stringify(filteredProg));

      const storedLogs = await this.getReviewLogs(userId);
      storedLogs.unshift(log);
      localStorage.setItem(`${STORAGE_KEYS.REVIEW_LOGS}_${userId}`, JSON.stringify(storedLogs));
    } catch (e) {}

    return { updatedProgress, log };
  }
}
