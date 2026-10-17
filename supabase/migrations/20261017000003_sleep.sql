-- ==============================================================================
-- ESQUEMA DE BASE DE DATOS: MÓDULO SUEÑO & DESCANSO
-- Tabla: user_sleep_records
-- Motor: Supabase PostgreSQL con Row Level Security (RLS)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.user_sleep_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sleep_date DATE NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    duration_minutes INT NOT NULL,
    quality_score INT NOT NULL DEFAULT 3 CHECK (quality_score >= 1 AND quality_score <= 5),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT uq_user_sleep_date UNIQUE (user_id, sleep_date)
);

-- Índices de consulta rápida por usuario y fecha de sueño
CREATE INDEX IF NOT EXISTS idx_user_sleep_records_user ON public.user_sleep_records(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sleep_records_date ON public.user_sleep_records(user_id, sleep_date DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.user_sleep_records ENABLE ROW LEVEL SECURITY;

-- Políticas de Seguridad RLS
DROP POLICY IF EXISTS "Users can view their own sleep records" ON public.user_sleep_records;
CREATE POLICY "Users can view their own sleep records"
    ON public.user_sleep_records FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own sleep records" ON public.user_sleep_records;
CREATE POLICY "Users can insert their own sleep records"
    ON public.user_sleep_records FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own sleep records" ON public.user_sleep_records;
CREATE POLICY "Users can update their own sleep records"
    ON public.user_sleep_records FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own sleep records" ON public.user_sleep_records;
CREATE POLICY "Users can delete their own sleep records"
    ON public.user_sleep_records FOR DELETE
    USING (auth.uid() = user_id);
