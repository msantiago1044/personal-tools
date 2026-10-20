-- ==============================================================================
-- ESQUEMA DE BASE DE DATOS: MÓDULO DE PATRIMONIO, ACTIVOS & AMORTIZACIÓN
-- Motor: Supabase PostgreSQL con Row Level Security (RLS)
-- ==============================================================================

-- 1. TIPOS ENUMERADOS
DO $$ BEGIN
    CREATE TYPE asset_category AS ENUM (
        'enseres',       -- Cama, nevera, muebles, almohadas, vajilla
        'tecnologia',    -- Laptop, smartphone, tablet, televisor
        'vehiculo',      -- Auto, moto, bicicleta
        'inmueble',      -- Casa, apartamento, lote, oficina
        'inversion',     -- Acciones, fondos, cripto, coleccionables
        'otro'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE depreciation_method AS ENUM (
        'lineal',        -- Pérdida fija por mes hasta valor residual
        'anual_pct',     -- Porcentaje fijo anual (vehículos, tecnología)
        'apreciacion',   -- Plusvalía anual positiva (bienes raíces)
        'ninguna'        -- Valor estático
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. TABLA: ACTIVOS Y BIENES TANGIBLES (assets)
CREATE TABLE IF NOT EXISTS public.assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    category asset_category NOT NULL DEFAULT 'enseres',
    location VARCHAR(100),
    purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
    purchase_price NUMERIC(14, 2) NOT NULL CHECK (purchase_price >= 0),
    currency VARCHAR(3) DEFAULT 'USD',
    depreciation_method depreciation_method NOT NULL DEFAULT 'lineal',
    useful_life_months INT NOT NULL DEFAULT 60 CHECK (useful_life_months > 0),
    salvage_value NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (salvage_value >= 0),
    annual_rate NUMERIC(5, 2) DEFAULT 0.00,
    warranty_expiration DATE,
    serial_number VARCHAR(100),
    image_url TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_assets_user_cat ON public.assets(user_id, category);
CREATE INDEX IF NOT EXISTS idx_assets_user_date ON public.assets(user_id, purchase_date DESC);

ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their own assets" 
    ON public.assets FOR ALL 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- 3. TABLA: AVALÚOS Y REVALORIZACIONES (asset_valuations)
CREATE TABLE IF NOT EXISTS public.asset_valuations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    valuation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    market_value NUMERIC(14, 2) NOT NULL CHECK (market_value >= 0),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_asset_valuations_asset ON public.asset_valuations(asset_id, valuation_date DESC);

ALTER TABLE public.asset_valuations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD asset valuations" 
    ON public.asset_valuations FOR ALL 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- 4. TABLA: DETALLES DE DEUDA Y PASIVOS (debt_details)
CREATE TABLE IF NOT EXISTS public.debt_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    name VARCHAR(120) NOT NULL,
    current_balance NUMERIC(14, 2) NOT NULL CHECK (current_balance >= 0),
    interest_rate_annual NUMERIC(5, 2) NOT NULL DEFAULT 0.00 CHECK (interest_rate_annual >= 0),
    minimum_payment NUMERIC(14, 2) NOT NULL CHECK (minimum_payment >= 0),
    due_day SMALLINT CHECK (due_day BETWEEN 1 AND 31),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_debt_details_user ON public.debt_details(user_id);

ALTER TABLE public.debt_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their own debt details" 
    ON public.debt_details FOR ALL 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- 5. TABLA: HISTÓRICO DE PATRIMONIO NETO (net_worth_snapshots)
CREATE TABLE IF NOT EXISTS public.net_worth_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    snapshot_date DATE NOT NULL,
    cash_balance NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    assets_value NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    liabilities_value NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    net_worth NUMERIC(14, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, snapshot_date)
);

CREATE INDEX IF NOT EXISTS idx_net_worth_snapshots_user_date ON public.net_worth_snapshots(user_id, snapshot_date DESC);

ALTER TABLE public.net_worth_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their own snapshots" 
    ON public.net_worth_snapshots FOR ALL 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);
