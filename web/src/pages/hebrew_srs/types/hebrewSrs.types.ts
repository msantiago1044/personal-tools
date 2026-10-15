/**
 * Tipos e interfaces de dominio para el Módulo de Hebreo Bíblico SRS
 * Decodificación de Niqqud y Evaluación Psicométrica Experimental
 */

export type LearningMethod = 'kinetic' | 'auditory' | 'analytic' | 'srs_puro';

export type RatingScore = 'again' | 'hard' | 'good' | 'easy';

export type SRSLevel = 1 | 2 | 3 | 4 | 5;

export interface StudyBlock {
  id: string;
  slug: string;
  name: string;
  vowel_focus: string;
  description: string;
  order_index: number;
  created_at?: string;
}

export interface HebrewCard {
  id: string;
  block_id: string;
  consonant: string;
  niqqud: string;
  combined_symbol: string;
  letter_name: string;
  transliteration: string;
  phonetic_rule: string;
  audio_hint?: string;
  difficulty_tier?: number;
  notes?: string;
}

export interface UserBlockSetting {
  id: string;
  user_id: string;
  block_id: string;
  method_used: LearningMethod;
  is_active: boolean;
  updated_at?: string;
}

export interface UserCardProgress {
  id: string;
  user_id: string;
  card_id: string;
  srs_level: SRSLevel;
  next_review_date: string; // YYYY-MM-DD
  last_reviewed_at?: string;
  repetitions: number;
  lapses: number;
  current_streak: number;
  updated_at?: string;
}

export interface ReviewLog {
  id: string;
  user_id: string;
  card_id: string;
  method_used: LearningMethod;
  reaction_time_ms: number; // Recall latency
  rating_score: RatingScore;
  previous_level: SRSLevel;
  new_level: SRSLevel;
  tactile_verified?: boolean; // Confirmación de escritura a mano
  created_at: string;
}

export interface SRSReviewResult {
  previousLevel: SRSLevel;
  newLevel: SRSLevel;
  intervalDays: number;
  nextReviewDate: string; // YYYY-MM-DD
  isLapse: boolean;
}

export interface MethodComparisonMetrics {
  method: LearningMethod;
  methodLabel: string;
  totalReviews: number;
  avgReactionTimeMs: number;
  retention7DaysPercent: number; // Retención a 7 días
  masteredCardsCount: number; // Tarjetas en Nivel 5
  accuracyRate: number; // % sin 'again'
  tactileAdherencePercent?: number; // Para Kinético
}

export interface DailyReviewStats {
  totalPendingToday: number;
  completedToday: number;
  masteredCount: number; // En Nivel 5
  totalCards: number;
  levelDistribution: Record<SRSLevel, number>;
}
