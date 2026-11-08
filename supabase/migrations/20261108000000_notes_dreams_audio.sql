-- ==============================================================================
-- MIGRACIÓN: SOPORTE PARA DIARIO DE SUEÑOS Y NOTAS DE VOZ EN user_notes
-- ==============================================================================

ALTER TABLE public.user_notes
ADD COLUMN IF NOT EXISTS is_dream BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS audio_url TEXT;

-- Índice para filtrado veloz de sueños por usuario
CREATE INDEX IF NOT EXISTS idx_user_notes_dream ON public.user_notes(user_id, is_dream);
