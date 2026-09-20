-- ==============================================================================
-- ESQUEMA DE BASE DE DATOS: GESTIÓN FINANCIERA & HUB MODULAR
-- Motor: Supabase PostgreSQL con Row Level Security (RLS)
-- ==============================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TIPOS ENUMERADOS
CREATE TYPE transaction_type AS ENUM ('ingreso', 'salida', 'transferencia');
CREATE TYPE account_type AS ENUM ('tarjeta', 'efectivo', 'ahorro', 'inversion', 'otro');
CREATE TYPE category_type AS ENUM ('ingreso', 'salida');

-- 3. PERFIL DE USUARIO Y PREFERENCIAS GENERALES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    currency_code VARCHAR(3) DEFAULT 'USD',
    currency_symbol VARCHAR(5) DEFAULT '$',
    home_widgets JSONB DEFAULT '["daily_cashflow", "monthly_balance", "recent_transactions", "budget_gauge"]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Trigger para crear perfil automáticamente al registrarse con Google Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );

    -- Categorías iniciales por defecto para el usuario
    INSERT INTO public.categories (user_id, name, type, icon, color) VALUES
    (NEW.id, 'Salario', 'ingreso', 'briefcase', '#10B981'),
    (NEW.id, 'Negocios', 'ingreso', 'trending-up', '#059669'),
    (NEW.id, 'Alimentación', 'salida', 'shopping-cart', '#EF4444'),
    (NEW.id, 'Transporte', 'salida', 'truck', '#F59E0B'),
    (NEW.id, 'Vivienda y Servicios', 'salida', 'home', '#3B82F6'),
    (NEW.id, 'Entretenimiento', 'salida', 'film', '#8B5CF6'),
    (NEW.id, 'Salud', 'salida', 'heart', '#EC4899');

    -- Cuenta inicial por defecto
    INSERT INTO public.accounts (user_id, name, type, initial_balance) VALUES
    (NEW.id, 'Efectivo Principal', 'efectivo', 0.00),
    (NEW.id, 'Cuenta Bancaria', 'tarjeta', 0.00);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. TABLA: CUENTAS (accounts)
CREATE TABLE IF NOT EXISTS public.accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type account_type NOT NULL DEFAULT 'efectivo',
    initial_balance NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    color VARCHAR(20) DEFAULT '#3B82F6',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. TABLA: CATEGORÍAS (categories)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(80) NOT NULL,
    type category_type NOT NULL,
    icon VARCHAR(50) DEFAULT 'tag',
    color VARCHAR(20) DEFAULT '#6B7280',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. TABLA: TRANSACCIONES / MOVIMIENTOS (transactions)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE RESTRICT,
    destination_account_id UUID REFERENCES public.accounts(id) ON DELETE RESTRICT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    description TEXT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Validaciones de integridad de negocio
    CONSTRAINT check_transfer_dest_account CHECK (
        (type = 'transferencia' AND destination_account_id IS NOT NULL AND destination_account_id <> account_id)
        OR (type <> 'transferencia' AND destination_account_id IS NULL)
    ),
    CONSTRAINT check_category_presence CHECK (
        (type = 'transferencia' AND category_id IS NULL)
        OR (type <> 'transferencia')
    )
);

-- 7. TABLA: PRESUPUESTOS MENSUALES (budgets)
CREATE TABLE IF NOT EXISTS public.budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    month SMALLINT NOT NULL CHECK (month BETWEEN 1 AND 12),
    year SMALLINT NOT NULL CHECK (year >= 2020),
    estimated_amount NUMERIC(14, 2) NOT NULL CHECK (estimated_amount >= 0),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, category_id, month, year)
);

-- 8. ÍNDICES DE RENDIMIENTO (Performance Tuning)
CREATE INDEX IF NOT EXISTS idx_accounts_user ON public.accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_user ON public.categories(user_id, type);
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON public.transactions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_account ON public.transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_dest_account ON public.transactions(destination_account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON public.transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_budgets_user_period ON public.budgets(user_id, year, month);

-- 9. ROW LEVEL SECURITY (RLS) - AISLAMIENTO TOTAL POR USUARIO
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- Políticas para Profiles
CREATE POLICY "Users can view their own profile" 
    ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Políticas para Accounts
CREATE POLICY "Users can CRUD their own accounts" 
    ON public.accounts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Políticas para Categories
CREATE POLICY "Users can CRUD their own categories" 
    ON public.categories FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Políticas para Transactions
CREATE POLICY "Users can CRUD their own transactions" 
    ON public.transactions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Políticas para Budgets
CREATE POLICY "Users can CRUD their own budgets" 
    ON public.budgets FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 10. RPC: CÁLCULO DE PRESUPUESTO MENSUAL VS REAL Y COMPARATIVA CON EL AÑO ANTERIOR
CREATE OR REPLACE FUNCTION public.get_monthly_budget_comparison(
    p_year INT,
    p_month INT
)
RETURNS TABLE (
    category_id UUID,
    category_name VARCHAR,
    category_color VARCHAR,
    category_icon VARCHAR,
    estimated_amount NUMERIC,
    actual_amount NUMERIC,
    percentage_used NUMERIC,
    spent_previous_year NUMERIC
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    RETURN QUERY
    WITH current_month_expenses AS (
        SELECT 
            t.category_id,
            COALESCE(SUM(t.amount), 0) AS total_actual
        FROM public.transactions t
        WHERE t.user_id = auth.uid()
          AND t.type = 'salida'
          AND EXTRACT(YEAR FROM t.date) = p_year
          AND EXTRACT(MONTH FROM t.date) = p_month
        GROUP BY t.category_id
    ),
    previous_year_expenses AS (
        SELECT 
            t.category_id,
            COALESCE(SUM(t.amount), 0) AS total_prev_year
        FROM public.transactions t
        WHERE t.user_id = auth.uid()
          AND t.type = 'salida'
          AND EXTRACT(YEAR FROM t.date) = (p_year - 1)
          AND EXTRACT(MONTH FROM t.date) = p_month
        GROUP BY t.category_id
    )
    SELECT 
        c.id AS category_id,
        c.name AS category_name,
        c.color AS category_color,
        c.icon AS category_icon,
        COALESCE(b.estimated_amount, 0.00) AS estimated_amount,
        COALESCE(cur.total_actual, 0.00) AS actual_amount,
        CASE 
            WHEN COALESCE(b.estimated_amount, 0) > 0 
                THEN ROUND((COALESCE(cur.total_actual, 0.00) / b.estimated_amount) * 100, 2)
            ELSE 0.00 
        END AS percentage_used,
        COALESCE(prev.total_prev_year, 0.00) AS spent_previous_year
    FROM public.categories c
    LEFT JOIN public.budgets b 
        ON b.category_id = c.id 
        AND b.user_id = auth.uid() 
        AND b.month = p_month 
        AND b.year = p_year
    LEFT JOIN current_month_expenses cur 
        ON cur.category_id = c.id
    LEFT JOIN previous_year_expenses prev 
        ON prev.category_id = c.id
    WHERE c.user_id = auth.uid() 
      AND c.type = 'salida'
    ORDER BY percentage_used DESC, estimated_amount DESC;
END;
$$;
