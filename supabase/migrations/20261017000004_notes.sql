-- ==============================================================================
-- ESQUEMA DE BASE DE DATOS: MÓDULO NOTAS & KEEP
-- Tabla: user_notes
-- Motor: Supabase PostgreSQL con Row Level Security (RLS)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.user_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT DEFAULT '',
    content TEXT DEFAULT '',
    is_checklist BOOLEAN DEFAULT FALSE,
    checklist_items JSONB DEFAULT '[]'::jsonb,
    color VARCHAR(30) DEFAULT 'default',
    is_pinned BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    is_trashed BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT '{}',
    reminder TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índices de consulta rápida
CREATE INDEX IF NOT EXISTS idx_user_notes_user ON public.user_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_status ON public.user_notes(user_id, is_trashed, is_archived, is_pinned);
CREATE INDEX IF NOT EXISTS idx_user_notes_updated ON public.user_notes(user_id, updated_at DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;

-- Políticas de Seguridad RLS
CREATE POLICY "Users can view their own notes"
    ON public.user_notes FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes"
    ON public.user_notes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
    ON public.user_notes FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
    ON public.user_notes FOR DELETE
    USING (auth.uid() = user_id);
