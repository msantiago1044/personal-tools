-- ==============================================================================
-- MÓDULO PIRKEI AVOT (Ética de los Padres)
-- Esquema de Base de Datos para Supabase (PostgreSQL con Row Level Security)
-- ==============================================================================

-- 1. Tabla de Marcador de Lectura (Última posición del usuario)
CREATE TABLE IF NOT EXISTS public.pirkei_avot_bookmarks (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    chapter INTEGER NOT NULL DEFAULT 1,
    mishna INTEGER NOT NULL DEFAULT 1,
    completed BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de Progreso por Capítulo
CREATE TABLE IF NOT EXISTS public.pirkei_avot_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    chapter_number INTEGER NOT NULL,
    completed_mishnayot INTEGER[] DEFAULT '{}',
    completed_count INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    last_read_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT pirkei_avot_progress_user_chapter UNIQUE (user_id, chapter_number)
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.pirkei_avot_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pirkei_avot_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Marcadores de Pirkei Avot gestionados por el usuario"
    ON public.pirkei_avot_bookmarks FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Progreso de Pirkei Avot gestionado por el usuario"
    ON public.pirkei_avot_progress FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
