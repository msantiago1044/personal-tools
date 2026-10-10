-- ==============================================================================
-- ESQUEMA DE BASE DE DATOS: MÓDULO EMOCIONES & BIENESTAR
-- Tabla: user_emotions
-- Motor: Supabase PostgreSQL con Row Level Security (RLS)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.user_emotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    emotion VARCHAR(50) NOT NULL, -- 'excelente', 'bien', 'calma', 'cansado', 'triste', 'estresado'
    score INT NOT NULL DEFAULT 3 CHECK (score >= 1 AND score <= 5),
    note TEXT,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índices de consulta rápida por usuario y fecha
CREATE INDEX IF NOT EXISTS idx_user_emotions_user ON public.user_emotions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_emotions_created ON public.user_emotions(user_id, created_at DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.user_emotions ENABLE ROW LEVEL SECURITY;

-- Políticas de Seguridad RLS
CREATE POLICY "Users can view their own emotions"
    ON public.user_emotions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own emotions"
    ON public.user_emotions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own emotions"
    ON public.user_emotions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own emotions"
    ON public.user_emotions FOR DELETE
    USING (auth.uid() = user_id);
