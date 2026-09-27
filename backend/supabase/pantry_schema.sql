-- ==============================================================================
-- ESQUEMA DE BASE DE DATOS: MÓDULO MERCADO, DESPENSA & NUTRICIÓN IA
-- Tablas: grocery_receipts, pantry_items, pantry_consumptions
-- Motor: Supabase PostgreSQL con RLS
-- ==============================================================================

-- 1. TABLA: FACTURAS DE MERCADO (grocery_receipts)
CREATE TABLE IF NOT EXISTS public.grocery_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    store_name VARCHAR(150) NOT NULL,
    purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (total_amount >= 0),
    image_url TEXT,
    items_count INT NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_grocery_receipts_user ON public.grocery_receipts(user_id);
CREATE INDEX IF NOT EXISTS idx_grocery_receipts_date ON public.grocery_receipts(purchase_date);

ALTER TABLE public.grocery_receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their own grocery receipts"
    ON public.grocery_receipts FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 2. TABLA: ÍTEMS DE DESPENSA / PRODUCTOS DEL MERCADO (pantry_items)
CREATE TABLE IF NOT EXISTS public.pantry_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    receipt_id UUID REFERENCES public.grocery_receipts(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(80) NOT NULL DEFAULT 'Despensa',
    quantity NUMERIC(10, 2) NOT NULL DEFAULT 1 CHECK (quantity >= 0),
    initial_quantity NUMERIC(10, 2) NOT NULL DEFAULT 1 CHECK (initial_quantity > 0),
    unit VARCHAR(30) NOT NULL DEFAULT 'unidad',
    unit_price NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (unit_price >= 0),
    total_price NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (total_price >= 0),
    purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiration_date DATE,
    shelf_life_days INT NOT NULL DEFAULT 14 CHECK (shelf_life_days > 0),
    calories_per_unit NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (calories_per_unit >= 0),
    total_calories NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (total_calories >= 0),
    protein_g NUMERIC(8, 2) DEFAULT 0,
    carbs_g NUMERIC(8, 2) DEFAULT 0,
    fat_g NUMERIC(8, 2) DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'disponible' CHECK (status IN ('disponible', 'consumiendo', 'agotado', 'vencido')),
    consumed_at TIMESTAMPTZ,
    consumption_days NUMERIC(6, 1),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pantry_items_user ON public.pantry_items(user_id);
CREATE INDEX IF NOT EXISTS idx_pantry_items_status ON public.pantry_items(user_id, status);
CREATE INDEX IF NOT EXISTS idx_pantry_items_name ON public.pantry_items(user_id, name);
CREATE INDEX IF NOT EXISTS idx_pantry_items_receipt ON public.pantry_items(receipt_id);

ALTER TABLE public.pantry_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their own pantry items"
    ON public.pantry_items FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 3. TABLA: REGISTRO HISTÓRICO DE CONSUMOS (pantry_consumptions)
CREATE TABLE IF NOT EXISTS public.pantry_consumptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES public.pantry_items(id) ON DELETE CASCADE,
    quantity_consumed NUMERIC(10, 2) NOT NULL CHECK (quantity_consumed > 0),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pantry_consumptions_user ON public.pantry_consumptions(user_id);
CREATE INDEX IF NOT EXISTS idx_pantry_consumptions_item ON public.pantry_consumptions(item_id);

ALTER TABLE public.pantry_consumptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their own pantry consumptions"
    ON public.pantry_consumptions FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
