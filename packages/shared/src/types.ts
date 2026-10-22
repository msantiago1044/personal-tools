export type TransactionType = 'ingreso' | 'salida' | 'transferencia';
export type AccountType = 'tarjeta' | 'efectivo' | 'ahorro' | 'inversion' | 'otro';
export type CategoryType = 'ingreso' | 'salida';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  currency_code: string;
  currency_symbol: string;
  home_widgets: string[];
  created_at: string;
}

export interface Account {
  id: string;
  user_id: string;
  name: string;
  type: AccountType;
  initial_balance: number;
  current_balance?: number;
  color: string;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  account_id: string;
  destination_account_id?: string | null;
  category_id?: string | null;
  description?: string;
  date: string;
  created_at: string;
  
  // Joins opcionales para vistas
  account?: Account;
  destination_account?: Account;
  category?: Category;
}

export interface BudgetComparison {
  category_id: string;
  category_name: string;
  category_color: string;
  category_icon: string;
  estimated_amount: number;
  actual_amount: number;
  percentage_used: number;
  spent_previous_year: number;
}

export interface ToolModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  status: 'active' | 'beta' | 'coming_soon';
  badge?: string;
}

// ============================================================================
// MÓDULO: TEHILIM (150 SALMOS)
// ============================================================================
export interface PsalmVerse {
  verse: number;
  hebrew: string;
  transliteration: string;
  spanish: string;
}

export interface Psalm {
  number: number;
  titleHebrew: string;
  titleSpanish: string;
  titleTransliteration: string;
  category?: string;
  book: 1 | 2 | 3 | 4 | 5; // Los 5 libros tradicionales de Tehilim
  verses: PsalmVerse[];
}

export interface TehilimProgress {
  psalm_number: number;
  completed_count: number;
  is_completed: boolean;
  last_read_at?: string;
  created_at?: string;
}

// ============================================================================
// MÓDULO: VISOR DE PLANOS CAD (DWG / DXF)
// ============================================================================
export interface CadLayer {
  name: string;
  color: string;
  visible: boolean;
  entityCount: number;
}

export interface CadPoint {
  x: number;
  y: number;
  z?: number;
}

export type CadEntityType = 'LINE' | 'LWPOLYLINE' | 'POLYLINE' | 'CIRCLE' | 'ARC' | 'TEXT' | 'MTEXT' | 'DIMENSION' | 'HATCH' | 'INSERT' | 'ELLIPSE' | 'SPLINE' | 'SOLID' | 'POINT';

export interface CadEntity {
  type: CadEntityType;
  layer: string;
  color?: string;
  vertices?: CadPoint[];
  start?: CadPoint;
  end?: CadPoint;
  center?: CadPoint;
  radius?: number;
  startAngle?: number;
  endAngle?: number;
  text?: string;
  height?: number;
  rotation?: number;
  closed?: boolean;
}

export interface CadDrawing {
  filename: string;
  fileFormat: 'DWG' | 'DXF';
  version?: string;
  layers: Record<string, CadLayer>;
  entities: CadEntity[];
  bounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
}

// ============================================================================
// MÓDULO: DESPENSA & MERCADO INTELIGENTE (GROCERY & PANTRY AI)
// ============================================================================
export interface GroceryReceipt {
  id: string;
  user_id: string;
  store_name: string;
  purchase_date: string;
  total_amount: number;
  image_url?: string;
  items_count?: number;
  notes?: string;
  created_at: string;
}

export type PantryItemStatus = 'disponible' | 'consumiendo' | 'agotado' | 'vencido';

export interface PantryItem {
  id: string;
  user_id: string;
  receipt_id?: string | null;
  name: string;
  category: string;
  quantity: number;
  initial_quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
  purchase_date: string;
  expiration_date?: string;
  shelf_life_days: number;
  calories_per_unit: number;
  total_calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  sugar_g?: number;
  fiber_g?: number;
  saturated_fat_g?: number;
  sodium_mg?: number;
  serving_size?: string;
  status: PantryItemStatus;
  consumed_at?: string | null;
  consumption_days?: number | null;
  created_at: string;
  updated_at?: string;
}

export interface PriceTrendPoint {
  date: string;
  price: number;
  store: string;
}

export interface ProductPriceHistory {
  product_name: string;
  category: string;
  history: PriceTrendPoint[];
  current_price: number;
  previous_price?: number;
  price_change_pct?: number;
  trend: 'up' | 'down' | 'stable';
  unit_label?: string;
}

export interface PantryEntropyMetrics {
  entropy_score: number; // 0 - 100
  freshness_level: 'alta' | 'media' | 'baja' | 'critica';
  risk_items_count: number;
  expired_items_count: number;
  turnover_rate_pct: number;
  recommendations: string[];
}

// ============================================================================
// MÓDULO: PIRKEI AVOT (ÉTICA DE LOS PADRES)
// ============================================================================
export interface AvotMishna {
  mishna: number;
  hebrew: string;
  transliteration: string;
  spanish: string;
  sage?: string;
  keyTeaching?: string;
}

export interface AvotChapter {
  chapter: number;
  titleHebrew: string;
  titleTransliteration: string;
  titleSpanish: string;
  description: string;
  mishnayot: AvotMishna[];
}

export interface PirkeiAvotBookmark {
  chapter: number;
  mishna: number;
  updated_at: string;
  completed?: boolean;
}

export interface PirkeiAvotProgress {
  chapter_number: number;
  completed_mishnayot: number[];
  completed_count: number;
  is_completed: boolean;
  last_read_at?: string;
  mishna_counts?: Record<number, number>; // mishna_number -> veces leída (1, 2, 3...)
  mishna_last_read?: Record<number, string>; // mishna_number -> timestamp ISO de última lectura
  years_history?: Record<string, number[]>; // año (ej. "2025", "2026") -> mishnayot leídas ese año
  cycle?: number; // Vuelta en curso al tratado
}

// ============================================================================
// MÓDULO: PARASHÁ DE LA SEMANA (DIÁSPORA)
// ============================================================================
export type WeekdayAliyahType = 'cohen' | 'levi' | 'israel';

export interface WeekdayReadingAliyah {
  type: WeekdayAliyahType;
  nameHebrew: string; // 'כֹּהֵן' | 'לֵוִי' | 'יִשְׂרָאֵל'
  nameSpanish: string; // 'Cohén' | 'Leví' | 'Israel'
  refRange: string;
  aliyahNumber: number; // En qué aliyá de Shabat se encuentra (1 o 2)
  startVerseNum: number;
  endVerseNum: number;
}

export interface WeekdayReading {
  ref: string;
  spansAliyot: number[]; // [1] o [1, 2]
  cohen: WeekdayReadingAliyah;
  levi: WeekdayReadingAliyah;
  israel: WeekdayReadingAliyah;
}

export interface ParashaVerse {
  verseNumber: number;
  verseKey: string;
  hebrew: string;
  transliteration: string;
  spanish: string;
  weekdayAliyah?: WeekdayAliyahType;
  isWeekdayStart?: WeekdayAliyahType;
  isWeekdayEnd?: boolean;
}

export interface ParashaAliyah {
  aliyahNumber: number;
  nameHebrew: string;
  nameSpanish: string;
  refRange: string;
  verses: ParashaVerse[];
  hasWeekdayReading?: boolean;
}

export interface WeeklyParasha {
  id: string;
  nameHebrew: string;
  nameSpanish: string;
  book: 'Genesis' | 'Exodus' | 'Leviticus' | 'Numbers' | 'Deuteronomy';
  bookSpanish: string;
  ref: string;
  aliyot: ParashaAliyah[];
  summary?: string;
  weekdayReading?: WeekdayReading;
}

export interface ParashaDailySchedule {
  dayOfWeek: number;
  dayName: string;
  targetAliyahNumber: number;
  targetAliyahName: string;
  isShabbatMorning: boolean;
  isShabbatAfternoon: boolean;
  parashaName: string;
  parashaHebrew: string;
  parashaRef: string;
  aliyahRef?: string;
  dateKey: string;
  parashaId?: string;
}

export interface ParashaProgress {
  parasha_id: string;
  completed_aliyot: number[];
  full_parasha_completed: boolean;
  completed_count: number; // Veces que se ha completado la parashá completa
  last_read_at?: string;
  aliyot_counts?: Record<number, number>; // aliyahNumber (1-7) -> veces leída
  aliyot_last_read?: Record<number, string>; // aliyahNumber (1-7) -> última fecha de lectura ISO
  years_history?: Record<string, number[]>; // Año (ej. "2025", "2026") -> aliyot leídas en ese año
}

// ============================================================================
// MÓDULO: PATRIMONIO, ACTIVOS & AMORTIZACIÓN DE DEUDAS
// ============================================================================
export type AssetCategory = 'enseres' | 'tecnologia' | 'vehiculo' | 'inmueble' | 'inversion' | 'otro';
export type DepreciationMethod = 'lineal' | 'anual_pct' | 'apreciacion' | 'ninguna';

export interface Asset {
  id: string;
  user_id: string;
  name: string;
  category: AssetCategory;
  location?: string;
  purchase_date: string;
  purchase_price: number;
  currency: string;
  depreciation_method: DepreciationMethod;
  useful_life_months: number;
  salvage_value: number;
  annual_rate: number;
  warranty_expiration?: string;
  serial_number?: string;
  image_url?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;

  // Propiedades calculadas en cliente
  current_value?: number;
  depreciated_amount?: number;
  age_months?: number;
  remaining_life_months?: number;
}

export interface AssetValuation {
  id: string;
  asset_id: string;
  user_id: string;
  valuation_date: string;
  market_value: number;
  notes?: string;
  created_at: string;
}

export interface DebtDetail {
  id: string;
  user_id: string;
  account_id?: string | null;
  name: string;
  current_balance: number;
  interest_rate_annual: number;
  minimum_payment: number;
  due_day?: number;
  created_at: string;
}

export interface NetWorthSnapshot {
  id: string;
  user_id: string;
  snapshot_date: string;
  cash_balance: number;
  assets_value: number;
  liabilities_value: number;
  net_worth: number;
  created_at: string;
}

// ============================================================================
// MÓDULO: SIDUR (LITURGIA DÍAS DE JOL · NÚSAJ MARRUECOS)
// ============================================================================
export type SidurTefilaId = 'shajarit' | 'minja' | 'arvit' | 'birkat_hamazon' | 'oraciones_diarias';

export type PostureType =
  | 'standing'      // De pie (pies juntos, hacia Jerusalén)
  | 'sitting'       // Sentado
  | 'bowing'        // Inclinación (Modim, Barejú, Amidá)
  | 'chest_beat'    // Golpe suave en el pecho (Vidui / Ashamnu)
  | 'cover_eyes'    // Cubrirse los ojos con la mano derecha (Shemá)
  | 'tzitzit'       // Beso y toma de tzitzit (Baruj Sheamar, Shemá)
  | 'custom';

export interface SidurPosture {
  type: PostureType;
  label: string;
  instruction?: string;
}

export interface SidurSegment {
  id: string;
  titleHebrew?: string;
  titleSpanish?: string;
  titleTranslit?: string;
  posture?: SidurPosture;
  hebrew: string;
  transliteration?: string;
  spanish: string;
  moroccanNote?: string;
  isSilent?: boolean;
  isCommunityResponse?: boolean;
}

export interface SidurSection {
  id: string;
  order: number;
  titleHebrew: string;
  titleSpanish: string;
  titleTranslit: string;
  description?: string;
  segments: SidurSegment[];
}

export interface SidurTefila {
  id: SidurTefilaId;
  nameHebrew: string;
  nameSpanish: string;
  nameTranslit: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime';
  description: string;
  sections: SidurSection[];
}

export interface SidurProgress {
  date: string;
  shajaritCompleted: boolean;
  minjaCompleted: boolean;
  arvitCompleted: boolean;
  completedAt: Record<string, string>;
  streakDays: number;
  history: Record<string, string[]>;
}
