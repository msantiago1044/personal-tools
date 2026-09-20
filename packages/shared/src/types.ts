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
