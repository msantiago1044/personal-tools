-- ==============================================================================
-- ESQUEMA DE BASE DE DATOS: MÓDULO RADAR DE NOTICIAS, PERSPECTIVAS Y PAPERS
-- Tablas: news_sources, news_clusters, news_articles
-- Motor: Supabase PostgreSQL con Row Level Security (RLS) y Realtime habilitado
-- ==============================================================================

-- 1. Tabla de Fuentes y Medios
CREATE TABLE IF NOT EXISTS public.news_sources (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    bias VARCHAR(20) NOT NULL CHECK (bias IN ('left', 'center', 'right', 'neutral')),
    country VARCHAR(10) NOT NULL DEFAULT 'CO', -- 'CO' o 'INT'
    reliability_score INT DEFAULT 85 CHECK (reliability_score BETWEEN 0 AND 100),
    website_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Tabla de Clusters de Historias (Agrupación de un mismo hecho con múltiples enfoques)
CREATE TABLE IF NOT EXISTS public.news_clusters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    headline TEXT NOT NULL,
    topic TEXT NOT NULL,
    category VARCHAR(30) NOT NULL CHECK (category IN ('colombia', 'world', 'tech', 'papers', 'environment')),
    left_percent INT DEFAULT 33,
    center_percent INT DEFAULT 34,
    right_percent INT DEFAULT 33,
    total_articles INT DEFAULT 0,
    blindspot VARCHAR(20) CHECK (blindspot IN ('left', 'right', NULL)),
    last_updated TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Tabla de Artículos y Papers Científicos
CREATE TABLE IF NOT EXISTS public.news_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cluster_id UUID REFERENCES public.news_clusters(id) ON DELETE SET NULL,
    source_id TEXT NOT NULL REFERENCES public.news_sources(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    image_url TEXT,
    category VARCHAR(30) NOT NULL CHECK (category IN ('colombia', 'world', 'tech', 'papers', 'environment')),
    bias VARCHAR(20) NOT NULL CHECK (bias IN ('left', 'center', 'right', 'neutral')),
    tags TEXT[] DEFAULT '{}',
    paper_metadata JSONB DEFAULT NULL, -- { arxivId, doi, authors, journalOrVenue, pdfUrl, keyTakeaway }
    published_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índices de alto rendimiento
CREATE INDEX IF NOT EXISTS idx_news_articles_category ON public.news_articles(category, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_bias ON public.news_articles(bias);
CREATE INDEX IF NOT EXISTS idx_news_articles_cluster ON public.news_articles(cluster_id);
CREATE INDEX IF NOT EXISTS idx_news_clusters_category ON public.news_clusters(category, last_updated DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.news_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

-- Políticas de Acceso (Lectura e Inserción para la suite y workers de ingesta)
CREATE POLICY "Allow read news_sources" ON public.news_sources FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Allow read news_clusters" ON public.news_clusters FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Allow read news_articles" ON public.news_articles FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Allow insert news_articles" ON public.news_articles FOR INSERT TO authenticated, anon WITH CHECK (true);
CREATE POLICY "Allow update news_articles" ON public.news_articles FOR UPDATE TO authenticated, anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow insert news_clusters" ON public.news_clusters FOR INSERT TO authenticated, anon WITH CHECK (true);
CREATE POLICY "Allow update news_clusters" ON public.news_clusters FOR UPDATE TO authenticated, anon USING (true) WITH CHECK (true);

-- Habilitar replicación en Tiempo Real para Supabase Realtime
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'news_articles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.news_articles;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'news_clusters'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.news_clusters;
  END IF;
END $$;

-- ==============================================================================
-- DATOS SEMILLA: Fuentes principales preconfiguradas
-- ==============================================================================
INSERT INTO public.news_sources (id, name, bias, country, reliability_score, website_url) VALUES
('semana', 'Semana', 'right', 'CO', 78, 'https://semana.com'),
('eltiempo', 'El Tiempo', 'center', 'CO', 88, 'https://eltiempo.com'),
('elespectador', 'El Espectador', 'left', 'CO', 90, 'https://elespectador.com'),
('lasillavacia', 'La Silla Vacía', 'center', 'CO', 94, 'https://lasillavacia.com'),
('rtvc', 'RTVC Noticias', 'left', 'CO', 76, 'https://rtvcnoticias.com'),
('elcolombiano', 'El Colombiano', 'right', 'CO', 82, 'https://elcolombiano.com'),
('reuters', 'Reuters', 'neutral', 'INT', 98, 'https://reuters.com'),
('apnews', 'Associated Press (AP)', 'neutral', 'INT', 97, 'https://apnews.com'),
('theguardian', 'The Guardian', 'left', 'INT', 89, 'https://theguardian.com'),
('wsj', 'Wall Street Journal', 'right', 'INT', 91, 'https://wsj.com'),
('arxiv', 'arXiv Preprints', 'neutral', 'INT', 99, 'https://arxiv.org'),
('nature', 'Nature News & Science', 'neutral', 'INT', 99, 'https://nature.com'),
('hackernews', 'Hacker News', 'neutral', 'INT', 92, 'https://news.ycombinator.com'),
('mongabay', 'Mongabay Latam', 'neutral', 'INT', 95, 'https://es.mongabay.com')
ON CONFLICT (id) DO NOTHING;
