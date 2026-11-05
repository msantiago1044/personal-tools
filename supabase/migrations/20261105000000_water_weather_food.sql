-- ==============================================================================
-- ESQUEMA DE BASE DE DATOS: MÓDULOS AGUA, CLIMA Y ALIMENTACIÓN
-- Tablas: user_water_records, user_weather_records, user_food_records
-- Motor: Supabase PostgreSQL con Row Level Security (RLS)
-- ==============================================================================

-- 1. TABLA: user_water_records (Módulo Agua & Hidratación)
CREATE TABLE IF NOT EXISTS public.user_water_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    record_date DATE NOT NULL,
    glasses INT NOT NULL DEFAULT 0 CHECK (glasses >= 0),
    milliliters INT NOT NULL DEFAULT 0 CHECK (milliliters >= 0),
    goal_ml INT NOT NULL DEFAULT 2000 CHECK (goal_ml > 0),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT uq_user_water_date UNIQUE (user_id, record_date)
);

CREATE INDEX IF NOT EXISTS idx_user_water_records_user ON public.user_water_records(user_id);
CREATE INDEX IF NOT EXISTS idx_user_water_records_date ON public.user_water_records(user_id, record_date DESC);

ALTER TABLE public.user_water_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own water records" ON public.user_water_records;
CREATE POLICY "Users can view their own water records"
    ON public.user_water_records FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own water records" ON public.user_water_records;
CREATE POLICY "Users can insert their own water records"
    ON public.user_water_records FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own water records" ON public.user_water_records;
CREATE POLICY "Users can update their own water records"
    ON public.user_water_records FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own water records" ON public.user_water_records;
CREATE POLICY "Users can delete their own water records"
    ON public.user_water_records FOR DELETE
    USING (auth.uid() = user_id);


-- 2. TABLA: user_weather_records (Módulo Clima & Entorno)
CREATE TABLE IF NOT EXISTS public.user_weather_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    record_date DATE NOT NULL,
    condition VARCHAR(50) NOT NULL, -- 'soleado', 'parcial', 'nublado', 'lluvia', 'tormenta', 'viento', 'calor', 'frio'
    temperature_c NUMERIC(4, 1),
    thermal_sensation VARCHAR(50), -- 'muy_frio', 'fresco', 'agradable', 'caluroso', 'sofocante'
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT uq_user_weather_date UNIQUE (user_id, record_date)
);

CREATE INDEX IF NOT EXISTS idx_user_weather_records_user ON public.user_weather_records(user_id);
CREATE INDEX IF NOT EXISTS idx_user_weather_records_date ON public.user_weather_records(user_id, record_date DESC);

ALTER TABLE public.user_weather_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own weather records" ON public.user_weather_records;
CREATE POLICY "Users can view their own weather records"
    ON public.user_weather_records FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own weather records" ON public.user_weather_records;
CREATE POLICY "Users can insert their own weather records"
    ON public.user_weather_records FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own weather records" ON public.user_weather_records;
CREATE POLICY "Users can update their own weather records"
    ON public.user_weather_records FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own weather records" ON public.user_weather_records;
CREATE POLICY "Users can delete their own weather records"
    ON public.user_weather_records FOR DELETE
    USING (auth.uid() = user_id);


-- 3. TABLA: user_food_records (Módulo Alimentación & Comidas)
CREATE TABLE IF NOT EXISTS public.user_food_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    record_date DATE NOT NULL,
    breakfast TEXT,
    lunch TEXT,
    dinner TEXT,
    snacks TEXT,
    quality_score INT DEFAULT 3 CHECK (quality_score >= 1 AND quality_score <= 5),
    tags TEXT[],
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT uq_user_food_date UNIQUE (user_id, record_date)
);

CREATE INDEX IF NOT EXISTS idx_user_food_records_user ON public.user_food_records(user_id);
CREATE INDEX IF NOT EXISTS idx_user_food_records_date ON public.user_food_records(user_id, record_date DESC);

ALTER TABLE public.user_food_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own food records" ON public.user_food_records;
CREATE POLICY "Users can view their own food records"
    ON public.user_food_records FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own food records" ON public.user_food_records;
CREATE POLICY "Users can insert their own food records"
    ON public.user_food_records FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own food records" ON public.user_food_records;
CREATE POLICY "Users can update their own food records"
    ON public.user_food_records FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own food records" ON public.user_food_records;
CREATE POLICY "Users can delete their own food records"
    ON public.user_food_records FOR DELETE
    USING (auth.uid() = user_id);

