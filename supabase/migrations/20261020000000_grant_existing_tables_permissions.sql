-- ==============================================================================
-- MIGRACIÓN: CONCESIÓN EXPLÍCITA DE PERMISOS (GRANTS) PARA POSTGREST / SUPABASE API
-- Fecha: 2026-10-20
-- Motivo: Actualización de seguridad de Supabase donde las tablas en 'public'
--         requieren privilegios explícitos a nivel de tabla para anon / authenticated / service_role.
-- ==============================================================================

-- 1. Asegurar uso del esquema public
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- 2. Permisos para secuencias existentes y futuras
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated, service_role;

-- ==============================================================================
-- 3. PERMISOS EN TABLAS PRIVADAS (Acceso completo para authenticated y service_role)
-- ==============================================================================

-- Módulo Core, Perfil y Finanzas
GRANT ALL ON TABLE public.profiles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.profiles TO authenticated;

GRANT ALL ON TABLE public.accounts TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.accounts TO authenticated;

GRANT ALL ON TABLE public.categories TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.categories TO authenticated;

GRANT ALL ON TABLE public.transactions TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.transactions TO authenticated;

GRANT ALL ON TABLE public.budgets TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.budgets TO authenticated;

-- Módulo Tehilim
GRANT ALL ON TABLE public.tehilim_progress TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.tehilim_progress TO authenticated;

-- Módulo Mercado y Despensa
GRANT ALL ON TABLE public.grocery_receipts TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.grocery_receipts TO authenticated;

GRANT ALL ON TABLE public.pantry_items TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.pantry_items TO authenticated;

GRANT ALL ON TABLE public.pantry_consumptions TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.pantry_consumptions TO authenticated;

-- Módulo Parashá y Pirkei Avot
GRANT ALL ON TABLE public.parasha_progress TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.parasha_progress TO authenticated;

GRANT ALL ON TABLE public.pirkei_avot_progress TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.pirkei_avot_progress TO authenticated;

GRANT ALL ON TABLE public.pirkei_avot_bookmarks TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.pirkei_avot_bookmarks TO authenticated;

-- Módulo Emociones
GRANT ALL ON TABLE public.user_emotions TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.user_emotions TO authenticated;

-- Módulo Sueño
GRANT ALL ON TABLE public.user_sleep_records TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.user_sleep_records TO authenticated;

-- Módulo Notas & Keep
GRANT ALL ON TABLE public.user_notes TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.user_notes TO authenticated;

-- Módulo Hebreo Bíblico (Tablas privadas del usuario)
GRANT ALL ON TABLE public.user_hebrew_block_settings TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.user_hebrew_block_settings TO authenticated;

GRANT ALL ON TABLE public.user_hebrew_card_progress TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.user_hebrew_card_progress TO authenticated;

GRANT ALL ON TABLE public.hebrew_review_logs TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.hebrew_review_logs TO authenticated;

-- ==============================================================================
-- 4. PERMISOS EN TABLAS DIDÁCTICAS PÚBLICAS (Lectura para anon y authenticated)
-- ==============================================================================
GRANT ALL ON TABLE public.hebrew_study_blocks TO service_role;
GRANT SELECT ON TABLE public.hebrew_study_blocks TO anon, authenticated;

GRANT ALL ON TABLE public.hebrew_cards TO service_role;
GRANT SELECT ON TABLE public.hebrew_cards TO anon, authenticated;

-- ==============================================================================
-- 5. FUNCIONES RPC
-- ==============================================================================
GRANT EXECUTE ON FUNCTION public.get_monthly_budget_comparison(INT, INT) TO authenticated;
