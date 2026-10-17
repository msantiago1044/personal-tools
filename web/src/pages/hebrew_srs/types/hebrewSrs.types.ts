/**
 * Tipos e interfaces de dominio para el Módulo de Hebreo Bíblico SRS
 * Sistema de 9 Métodos Integrados para Lectura del Siddur & Jumash con Cajas Leitner
 */

// Métodos pedagógicos integrados y métodos legados para compatibilidad
export type LearningMethod =
  | 'srs_flashcard'     // 1. Tarjeta mnemotécnica visual clásica
  | 'minimal_pair'      // 2. Discriminación fonológica rápida
  | 'cloze_niqqud'      // 3. Decodificación inversa (completar vocal)
  | 'syllable_builder'  // 4. Ensamblador de sílabas bíblicas táctiles
  | 'match_pairs'       // 5. Emparejamiento rápido de fichas
  | 'siddur_phrase'     // 6. Lectura guiada de frases del Siddur/Jumash
  | 'kinetic'           // Legado
  | 'auditory'          // Legado
  | 'analytic'          // Legado
  | 'srs_puro';         // Legado

export type RatingScore = 'again' | 'hard' | 'good' | 'easy';

export type SRSLevel = 1 | 2 | 3 | 4 | 5;

// Fases del Currículo de Lectura Bíblica y Litúrgica
export type CurriculumPhaseNumber = 1 | 2 | 3 | 4 | 5;

export interface CurriculumPhase {
  number: CurriculumPhaseNumber;
  title: string;
  vowel_family: string;
  description: string;
  siddur_target: string;
  unlocked: boolean;
  totalCards: number;
}

export interface StudyBlock {
  id: string;
  slug: string;
  name: string;
  vowel_focus: string;
  description: string;
  order_index: number;
  phase?: CurriculumPhaseNumber;
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
  mnemonic_image?: string; // Ancla mnemotécnica visual
  mnemonic_phrase?: string;
  audio_hint?: string;
  difficulty_tier?: number;
  phase?: CurriculumPhaseNumber;
  siddur_example?: string;
  siddur_meaning?: string;
  notes?: string;
}

// 2. Par Mínimo (Discriminación fonológica entre semejantes)
export interface MinimalPairItem {
  id: string;
  prompt_symbol: string;
  correct_transliteration: string;
  options: {
    symbol: string;
    transliteration: string;
    is_correct: boolean;
    distinction_rule: string;
  }[];
  audio_hint?: string;
}

// 3. Decodificación Inversa / Cloze (Completar Niqqud activo)
export interface ClozeNiqqudItem {
  id: string;
  base_consonant: string;
  consonant_name: string;
  target_sound: string; // ej. "ba"
  correct_niqqud: string;
  niqqud_name: string;
  options: {
    niqqud: string;
    combined_preview: string;
    name: string;
    is_correct: boolean;
  }[];
  audio_hint?: string;
}

// 4. Ensamblador de Sílabas Bíblicas (Duolingo Style Word Builder)
export interface SyllableBuilderItem {
  id: string;
  word_hebrew: string;
  transliteration: string;
  meaning_es: string;
  source: string; // ej. "Siddur • Berajá"
  correct_syllables: string[]; // de derecha a izquierda: ['בָּ', 'רוּךְ']
  distractor_syllables: string[]; // ['מֶ', 'לֶךְ']
  audio_hint?: string;
}

// 5. Emparejamiento Rápido de Fichas (Match Pairs)
export interface MatchPairToken {
  id: string;
  symbol: string;
  sound: string;
}

// 6. Frases y Versículos Litúrgicos del Siddur / Jumash
export interface SiddurPhraseWord {
  hebrew: string;
  transliteration: string;
  meaning_es: string;
}

export interface SiddurPhraseItem {
  id: string;
  title: string;
  source: string; // ej. "Shemá Yisrael • Dt. 6:4"
  phrase_hebrew: string;
  transliteration: string;
  translation_es: string;
  words: SiddurPhraseWord[];
  audio_hint?: string;
}

// Estructura de Ejercicio Dinámico para la Sesión Diaria
export type ExerciseType =
  | 'flashcard'
  | 'minimal_pair'
  | 'cloze_niqqud'
  | 'syllable_builder'
  | 'match_pairs'
  | 'siddur_phrase';

export interface DynamicSessionExercise {
  id: string;
  type: ExerciseType;
  cardId?: string;
  method: LearningMethod;
  phase: CurriculumPhaseNumber;
  data:
    | { kind: 'flashcard'; card: HebrewCard }
    | { kind: 'minimal_pair'; item: MinimalPairItem }
    | { kind: 'cloze_niqqud'; item: ClozeNiqqudItem }
    | { kind: 'syllable_builder'; item: SyllableBuilderItem }
    | { kind: 'match_pairs'; items: MatchPairToken[] }
    | { kind: 'siddur_phrase'; item: SiddurPhraseItem };
}

// Progreso SRS del Usuario
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

// Logs de Revisión Psicométrica
export interface ReviewLog {
  id: string;
  user_id: string;
  card_id: string;
  method_used: LearningMethod;
  reaction_time_ms: number;
  rating_score: RatingScore;
  previous_level: SRSLevel;
  new_level: SRSLevel;
  is_correct?: boolean;
  tactile_verified?: boolean;
  voice_verified?: boolean;
  created_at: string;
}

export interface SRSReviewResult {
  previousLevel: SRSLevel;
  newLevel: SRSLevel;
  intervalDays: number;
  nextReviewDate: string; // YYYY-MM-DD
  isLapse: boolean;
}

// Racha y Hábitos Diarios
export interface StreakData {
  current_streak: number;
  best_streak: number;
  last_active_date: string; // YYYY-MM-DD
  completed_today: boolean;
}

// Resumen del Día mostrado al terminar los 10 ejercicios
export interface DailySessionSummary {
  totalReviewed: number;
  correctCount: number;
  accuracyPercent: number;
  avgReactionTimeMs: number;
  streak: number;
  bestMethodToday: string;
  bestMethodDescription: string;
  verdictText: string;
  phaseAdvanceText: string;
}

// Métricas de comparación científica
export interface MethodComparisonMetrics {
  method: LearningMethod;
  methodLabel: string;
  totalReviews: number;
  avgReactionTimeMs: number;
  retention7DaysPercent: number;
  masteredCardsCount: number;
  accuracyRate: number;
}

export interface DailyReviewStats {
  totalPendingToday: number;
  completedToday: number;
  masteredCount: number;
  totalCards: number;
  levelDistribution: Record<SRSLevel, number>;
  streak: StreakData;
  activePhase: CurriculumPhaseNumber;
}
