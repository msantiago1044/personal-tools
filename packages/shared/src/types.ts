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
}

export interface PantryEntropyMetrics {
  entropy_score: number; // 0 - 100
  freshness_level: 'alta' | 'media' | 'baja' | 'critica';
  risk_items_count: number;
  expired_items_count: number;
  turnover_rate_pct: number;
  recommendations: string[];
}


