-- ==============================================================================
-- MÓDULO HEBREO BÍBLICO SRS (Decodificación de Niqqud & Comparativa Experimental)
-- Esquema de Base de Datos para Supabase (PostgreSQL con Row Level Security)
-- ==============================================================================

-- 1. Tabla de Bloques de Estudio (Aislamiento de variables experimentales)
CREATE TABLE IF NOT EXISTS public.hebrew_study_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    vowel_focus VARCHAR(50) NOT NULL, -- ej. 'Qamats (ָ)', 'Pataj (ַ)'
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de Tarjetas de Estudio (Consonantes + Niqqud)
CREATE TABLE IF NOT EXISTS public.hebrew_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    block_id UUID NOT NULL REFERENCES public.hebrew_study_blocks(id) ON DELETE CASCADE,
    consonant VARCHAR(20) NOT NULL,       -- Letra base (ej. 'ב' - Bet)
    niqqud VARCHAR(20) NOT NULL,          -- Símbolo vocálico (ej. 'ַ' - Pataj)
    combined_symbol VARCHAR(20) NOT NULL,  -- Glifo compuesto completo (ej. 'בַּ')
    letter_name VARCHAR(50) NOT NULL,     -- Nombre de la letra (ej. 'Bet')
    transliteration VARCHAR(50) NOT NULL, -- Pronunciación / Transliteración (ej. 'ba')
    phonetic_rule TEXT NOT NULL,          -- Regla fonética/analítica explicativa
    audio_hint VARCHAR(100),              -- Fonética aproximada para Web Speech
    difficulty_tier INTEGER DEFAULT 1,    -- Nivel de complejidad inicial (1 a 3)
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Configuración Experimental por Usuario y Bloque (Método asignado)
-- Permite aislar y contrastar métodos (Kinético, Auditivo, Analítico, SRS Puro)
CREATE TABLE IF NOT EXISTS public.user_hebrew_block_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    block_id UUID NOT NULL REFERENCES public.hebrew_study_blocks(id) ON DELETE CASCADE,
    method_used VARCHAR(30) NOT NULL DEFAULT 'srs_puro', -- 'kinetic' | 'auditory' | 'analytic' | 'srs_puro'
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT user_block_unique UNIQUE (user_id, block_id),
    CONSTRAINT chk_method CHECK (method_used IN ('kinetic', 'auditory', 'analytic', 'srs_puro'))
);

-- 4. Progreso SRS del Usuario por Tarjeta (Cajas Leitner 1 a 5)
CREATE TABLE IF NOT EXISTS public.user_hebrew_card_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    card_id UUID NOT NULL REFERENCES public.hebrew_cards(id) ON DELETE CASCADE,
    srs_level INTEGER NOT NULL DEFAULT 1,  -- 1 a 5 (5 = Dominado)
    next_review_date DATE NOT NULL DEFAULT CURRENT_DATE,
    last_reviewed_at TIMESTAMPTZ,
    repetitions INTEGER NOT NULL DEFAULT 0,
    lapses INTEGER NOT NULL DEFAULT 0,     -- Veces que regresó a Nivel 1
    current_streak INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT user_card_progress_unique UNIQUE (user_id, card_id),
    CONSTRAINT chk_srs_level CHECK (srs_level BETWEEN 1 AND 5)
);

-- 5. Logs Detallados de Revisión (Para analítica psicométrica y de retención)
CREATE TABLE IF NOT EXISTS public.hebrew_review_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    card_id UUID NOT NULL REFERENCES public.hebrew_cards(id) ON DELETE CASCADE,
    method_used VARCHAR(30) NOT NULL,
    reaction_time_ms INTEGER NOT NULL,     -- Recall latency exacta en milisegundos
    rating_score VARCHAR(20) NOT NULL,     -- 'again' | 'hard' | 'good' | 'easy'
    previous_level INTEGER NOT NULL,
    new_level INTEGER NOT NULL,
    tactile_verified BOOLEAN DEFAULT FALSE, -- Registra si el usuario confirmó escritura a mano
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ÍNDICES DE RENDIMIENTO (Performance Tuning)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_hebrew_cards_block ON public.hebrew_cards(block_id);
CREATE INDEX IF NOT EXISTS idx_hebrew_progress_user_due ON public.user_hebrew_card_progress(user_id, next_review_date);
CREATE INDEX IF NOT EXISTS idx_hebrew_logs_user_method ON public.hebrew_review_logs(user_id, method_used);
CREATE INDEX IF NOT EXISTS idx_hebrew_logs_created ON public.hebrew_review_logs(created_at);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.hebrew_study_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hebrew_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_hebrew_block_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_hebrew_card_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hebrew_review_logs ENABLE ROW LEVEL SECURITY;

-- Lectura pública para el contenido didáctico base
CREATE POLICY "Contenido base de bloques visible para todos"
    ON public.hebrew_study_blocks FOR SELECT
    USING (true);

CREATE POLICY "Tarjetas didácticas visibles para todos"
    ON public.hebrew_cards FOR SELECT
    USING (true);

-- Políticas de aislamiento total por usuario
CREATE POLICY "Gestión de configuraciones por usuario"
    ON public.user_hebrew_block_settings FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Progreso de tarjetas por usuario"
    ON public.user_hebrew_card_progress FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Logs de revisión por usuario"
    ON public.hebrew_review_logs FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- SEMILLAS INICIALES (Seed Data: Bloque A Kamatz y Bloque B Patach)
-- ==============================================================================
INSERT INTO public.hebrew_study_blocks (id, slug, name, vowel_focus, description, order_index)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'fase-1-vocales-a', 'Fase 1: Vocales A (Qamats y Pataj)', 'Qamats (ָ) & Pataj (ַ)', 'Consonantes fundamentales con vocales abiertas y regla del Daguesh lene.', 1),
    ('22222222-2222-2222-2222-222222222222', 'fase-2-vocales-e', 'Fase 2: Vocales E y Sheva', 'Tsere (ֵ), Segol (ֶ) & Sheva (ְ)', 'Vocales medias y articulación del Sheva silábico en textos litúrgicos.', 2),
    ('33333333-3333-3333-3333-333333333333', 'fase-3-vocales-i-o', 'Fase 3: Vocales I y O', 'Hireq (ִ) & Holem (ֹ / וֹ)', 'Puntos altos y bajos, distinguiendo Holem del punto de Shin/Sin.', 3),
    ('44444444-4444-4444-4444-444444444444', 'fase-4-vocales-u-sofit', 'Fase 4: Vocales U y Letras Finales', 'Qibbuts (ֻ), Shuruq (וּ) & Sofit', 'Vocal U y reconocimiento automático de terminaciones de palabras hebreas.', 4),
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    name = EXCLUDED.name,
    vowel_focus = EXCLUDED.vowel_focus,
    description = EXCLUDED.description,
    order_index = EXCLUDED.order_index;

-- Tarjetas Bloque A: Consonantes con Qamats (ָ)
INSERT INTO public.hebrew_cards (block_id, consonant, niqqud, combined_symbol, letter_name, transliteration, phonetic_rule, audio_hint)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'א', 'ָ', 'אָ', 'Alef con Qamats', 'ʾā (Aa)', 'Alef es gutural y silenciosa; asume totalmente el sonido vocálico del Qamats (/a/). No recibe daguesh.', 'ah'),
    ('11111111-1111-1111-1111-111111111111', 'ב', 'ָ', 'בָּ', 'Bet (con Daguesh) con Qamats', 'bā (Baa)', 'Bet con Daguesh lene tiene sonido oclusivo /b/ seguido del Qamats /a/ sostenido.', 'ba'),
    ('11111111-1111-1111-1111-111111111111', 'ב', 'ָ', 'בָ', 'Vet (sin Daguesh) con Qamats', 'ḇā (Vaa)', 'Bet sin punto (Vet) es fricativa con sonido /v/ suave seguido de la vocal /a/.', 'va'),
    ('11111111-1111-1111-1111-111111111111', 'ג', 'ָ', 'גָּ', 'Guímel con Qamats', 'gā (Gaa)', 'Sonido oclusivo guturo-velar /g/ como en "gato", combinado con Qamats.', 'ga'),
    ('11111111-1111-1111-1111-111111111111', 'ד', 'ָ', 'דָּ', 'Dálet con Qamats', 'dā (Daa)', 'Consonante dental /d/ seguida de la vocal abierta prolongada /a/.', 'da'),
    ('11111111-1111-1111-1111-111111111111', 'ה', 'ָ', 'הָ', 'He con Qamats', 'hā (Haa)', 'Consonante espirada /h/ suave como en inglés "house", con Qamats.', 'ha'),
    ('11111111-1111-1111-1111-111111111111', 'ו', 'ָ', 'וָ', 'Vav con Qamats', 'wā / vā', 'Vav consonántica con sonido /v/ o /w/ arcaico, portadora del Qamats.', 'va'),
    ('11111111-1111-1111-1111-111111111111', 'ז', 'ָ', 'זָ', 'Zayin con Qamats', 'zā (Zaa)', 'Sibilante sonora /z/ vibrante como el zumbido de abeja, con vocal /a/.', 'za'),
    ('11111111-1111-1111-1111-111111111111', 'ח', 'ָ', 'חָ', 'Jet con Qamats', 'ḥā (Jaa)', 'Gutural sorda fuerte /x/ (fricativa velar, "j" profunda), con Qamats.', 'ja'),
    ('11111111-1111-1111-1111-111111111111', 'ט', 'ָ', 'טָ', 'Tet con Qamats', 'ṭā (Taa enfática)', 'Dental oclusiva sorda con articulación enfática tradicional, con Qamats.', 'ta'),
    ('11111111-1111-1111-1111-111111111111', 'י', 'ָ', 'יָ', 'Yod con Qamats', 'yā (Yaa)', 'Semivocal /y/ palatal consonántica seguida de vocal /a/.', 'ya'),
    ('11111111-1111-1111-1111-111111111111', 'ל', 'ָ', 'לָ', 'Lámed con Qamats', 'lā (Laa)', 'Líquida lateral alveolar /l/, la letra más alta del alefato, con Qamats.', 'la')
ON CONFLICT DO NOTHING;

-- Tarjetas Bloque B: Consonantes con Pataj (ַ)
INSERT INTO public.hebrew_cards (block_id, consonant, niqqud, combined_symbol, letter_name, transliteration, phonetic_rule, audio_hint)
VALUES
    ('22222222-2222-2222-2222-222222222222', 'מ', 'ַ', 'מַ', 'Mem con Pataj', 'ma (Ma corto)', 'Nasal bilabial /m/ con Pataj; vocal breve típicamente en sílaba cerrada o tónica.', 'ma'),
    ('22222222-2222-2222-2222-222222222222', 'נ', 'ַ', 'נַ', 'Nun con Pataj', 'na (Na corto)', 'Nasal alveolar /n/ con Pataj breve.', 'na'),
    ('22222222-2222-2222-2222-222222222222', 'ס', 'ַ', 'סַ', 'Sámej con Pataj', 'sa (Sa)', 'Sibilante alveolar sorda /s/ pura e invariable, con vocal breve /a/.', 'sa'),
    ('22222222-2222-2222-2222-222222222222', 'ע', 'ַ', 'עַ', 'Ayin con Pataj', 'ʿa (Aa gutural)', 'Gutural oclusiva faríngea sonora; en dicción moderna suele sonar similar a Alef.', 'ah'),
    ('22222222-2222-2222-2222-222222222222', 'פ', 'ַ', 'פַּ', 'Pe (con Daguesh) con Pataj', 'pa (Pa oclusivo)', 'Pe con Daguesh lene es oclusiva sorda /p/ con vocal corta /a/.', 'pa'),
    ('22222222-2222-2222-2222-222222222222', 'פ', 'ַ', 'פַ', 'Fe (sin Daguesh) con Pataj', 'fa (Fa fricativo)', 'Pe sin punto (Fe) es labiodental fricativa /f/ con Pataj.', 'fa'),
    ('22222222-2222-2222-2222-222222222222', 'צ', 'ַ', 'צַ', 'Tsade con Pataj', 'ṣa (Tsa)', 'Africada alveolar sorda /ts/ combinada con vocal breve /a/.', 'tsa'),
    ('22222222-2222-2222-2222-222222222222', 'ק', 'ַ', 'קַ', 'Qof con Pataj', 'qa (Ka post-velar)', 'Oclusiva velar sorda /k/ histórica post-velar, con Pataj.', 'ka'),
    ('22222222-2222-2222-2222-222222222222', 'ר', 'ַ', 'רַ', 'Resh con Pataj', 'ra (Ra uvular)', 'Líquida vibrante; por regla no recibe daguesh forte sino que alarga la vocal precedente.', 'ra'),
    ('22222222-2222-2222-2222-222222222222', 'ש', 'ַ', 'שַׁ', 'Shin (punto derecho) con Pataj', 'sha (Sha)', 'Sibilante postalveolar sorda /ʃ/ ("sh" inglesa) con Pataj breve.', 'sha'),
    ('22222222-2222-2222-2222-222222222222', 'ש', 'ַ', 'שַׂ', 'Sin (punto izquierdo) con Pataj', 'sa (Sa suave)', 'Sibilante con punto a la izquierda, fonéticamente idéntica a Sámej (/s/).', 'sa'),
    ('22222222-2222-2222-2222-222222222222', 'ת', 'ַ', 'תַּ', 'Tav con Pataj', 'ta (Ta firme)', 'Última letra del alefato hebreo. Con o sin daguesh en hebreo bíblico clásico.', 'ta')
ON CONFLICT DO NOTHING;
