import { NewsArticle, NewsCluster, NewsSource } from '../types/news.types';

export const KNOWN_SOURCES: Record<string, NewsSource> = {
  semana: { id: 'semana', name: 'Semana', bias: 'right', country: 'CO', reliabilityScore: 78 },
  eltiempo: { id: 'eltiempo', name: 'El Tiempo', bias: 'center', country: 'CO', reliabilityScore: 88 },
  elespectador: { id: 'elespectador', name: 'El Espectador', bias: 'left', country: 'CO', reliabilityScore: 90 },
  lasillavacia: { id: 'lasillavacia', name: 'La Silla Vacía', bias: 'center', country: 'CO', reliabilityScore: 94 },
  rtvc: { id: 'rtvc', name: 'RTVC Noticias', bias: 'left', country: 'CO', reliabilityScore: 76 },
  elcolombiano: { id: 'elcolombiano', name: 'El Colombiano', bias: 'right', country: 'CO', reliabilityScore: 82 },
  reuters: { id: 'reuters', name: 'Reuters', bias: 'neutral', country: 'INT', reliabilityScore: 98 },
  apnews: { id: 'apnews', name: 'Associated Press (AP)', bias: 'neutral', country: 'INT', reliabilityScore: 97 },
  theguardian: { id: 'theguardian', name: 'The Guardian', bias: 'left', country: 'INT', reliabilityScore: 89 },
  wsj: { id: 'wsj', name: 'Wall Street Journal', bias: 'right', country: 'INT', reliabilityScore: 91 },
  arxiv: { id: 'arxiv', name: 'arXiv Preprints', bias: 'neutral', country: 'INT', reliabilityScore: 99 },
  nature: { id: 'nature', name: 'Nature News & Science', bias: 'neutral', country: 'INT', reliabilityScore: 99 },
  hackernews: { id: 'hackernews', name: 'Hacker News / TechRadar', bias: 'neutral', country: 'INT', reliabilityScore: 92 },
  mongabay: { id: 'mongabay', name: 'Mongabay Latam', bias: 'neutral', country: 'INT', reliabilityScore: 95 },
};

export const INITIAL_CLUSTERS: NewsCluster[] = [
  {
    id: 'cluster-reforma-salud',
    headline: 'Debate legislativo sobre el nuevo modelo de financiamiento en el sistema de salud colombiano',
    topic: 'Reforma a la Salud en Colombia',
    category: 'colombia',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    coverage: {
      leftPercent: 35,
      centerPercent: 25,
      rightPercent: 40,
      totalArticles: 3,
    },
    blindspot: null,
    articles: [
      {
        id: 'art-1',
        title: 'El nuevo giro directo a hospitales busca acabar con la intermediación financiera ineficiente',
        summary: 'RTVC destaca cómo el gobierno defiende que los recursos públicos lleguen sin trabas a los centros asistenciales de las regiones más apartadas.',
        source: KNOWN_SOURCES.rtvc,
        url: 'https://rtvcnoticias.com',
        publishedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        category: 'colombia',
        tags: ['Salud', 'Congreso', 'Giro Directo'],
        bias: 'left',
      },
      {
        id: 'art-2',
        title: 'Comisión Séptima debate facultades extraordinarias y sostenibilidad fiscal de la salud',
        summary: 'El Tiempo analiza el equilibrio entre la necesidad de transformar el modelo preventivo y las alertas de Hacienda sobre el impacto fiscal.',
        source: KNOWN_SOURCES.eltiempo,
        url: 'https://eltiempo.com',
        publishedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        category: 'colombia',
        tags: ['Hacienda', 'Senado', 'Sostenibilidad'],
        bias: 'center',
      },
      {
        id: 'art-3',
        title: 'Alertas gremiales por posible desabastecimiento e incertidumbre en la gestión del riesgo médico',
        summary: 'Semana recoge declaraciones de gremios y oposición advirtiendo sobre el riesgo de estatización total y colapso de las redes de especialistas.',
        source: KNOWN_SOURCES.semana,
        url: 'https://semana.com',
        publishedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        category: 'colombia',
        tags: ['Oposición', 'Gremio Médico', 'Riesgo'],
        bias: 'right',
      },
    ],
  },
  {
    id: 'cluster-transicion-energetica',
    headline: 'Subastas de energías renovables e incentivos para hidrógeno verde en La Guajira',
    topic: 'Transición Energética',
    category: 'colombia',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    coverage: {
      leftPercent: 45,
      centerPercent: 30,
      rightPercent: 25,
      totalArticles: 3,
    },
    blindspot: null,
    articles: [
      {
        id: 'art-4',
        title: 'Comunidades Wayúu y gobierno avanzan en acuerdos vinculantes para parques eólicos',
        summary: 'El Espectador detalla la implementación del consentimiento previo y la participación comunitaria en los beneficios energéticos.',
        source: KNOWN_SOURCES.elespectador,
        url: 'https://elespectador.com',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        category: 'colombia',
        tags: ['Energía Eólica', 'La Guajira', 'Ambiente'],
        bias: 'left',
      },
      {
        id: 'art-5',
        title: 'La seguridad energética requiere armonizar energías limpias con respaldo térmico e hídrico',
        summary: 'El Colombiano advierte sobre retrasos en líneas de transmisión y la importancia de no apurar desconexiones sin respaldo firme.',
        source: KNOWN_SOURCES.elcolombiano,
        url: 'https://elcolombiano.com',
        publishedAt: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
        category: 'colombia',
        tags: ['Seguridad Energética', 'Transmisión'],
        bias: 'right',
      },
      {
        id: 'art-6',
        title: 'Radiografía de las consultas previas: el desafío logístico de los proyectos eólicos',
        summary: 'La Silla Vacía mapea el estado real de los 16 proyectos en licenciamiento y las tensiones entre tiempos corporativos y comunitarios.',
        source: KNOWN_SOURCES.lasillavacia,
        url: 'https://lasillavacia.com',
        publishedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        category: 'colombia',
        tags: ['Datos', 'Investigación'],
        bias: 'center',
      },
    ],
  },
  {
    id: 'cluster-ai-regulation-world',
    headline: 'Unión Europea y EE.UU. afinan directrices sobre modelos de frontera y marcas de agua de IA',
    topic: 'Regulación Global de Inteligencia Artificial',
    category: 'world',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    coverage: {
      leftPercent: 30,
      centerPercent: 40,
      rightPercent: 30,
      totalArticles: 2,
    },
    blindspot: null,
    articles: [
      {
        id: 'art-7',
        title: 'Agencias internacionales fijan estándares técnicos para evitar desinformación algorítmica',
        summary: 'Reuters reporta acuerdos multilaterales entre laboratorios de IA y reguladores de telecomunicaciones para cripto-marcas en audio y video sintético.',
        source: KNOWN_SOURCES.reuters,
        url: 'https://reuters.com',
        publishedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        category: 'world',
        tags: ['AI Act', 'Seguridad', 'Estándares'],
        bias: 'neutral',
      },
      {
        id: 'art-8',
        title: 'Críticas del sector tecnológico ante posibles cuellos de botella para startups y código abierto',
        summary: 'The Wall Street Journal expone la preocupación de fondos de venture capital por exigencias burocráticas que benefician a los incumbentes.',
        source: KNOWN_SOURCES.wsj,
        url: 'https://wsj.com',
        publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        category: 'world',
        tags: ['Open Source', 'Innovación', 'Startups'],
        bias: 'right',
      },
    ],
  },
];

export const INITIAL_PAPERS_AND_TECH: NewsArticle[] = [
  {
    id: 'paper-1',
    title: 'Reasoning Models via Test-Time Compute Scaling: Beyond Autoregressive Generation',
    summary: 'Investigación formal sobre la asignación dinámica de computación en tiempo de inferencia para resolver razonamientos matemáticos y de verificación formal.',
    source: KNOWN_SOURCES.arxiv,
    url: 'https://arxiv.org/abs/2410.01234',
    publishedAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    category: 'papers',
    tags: ['arXiv:2410.01234', 'Machine Learning', 'Test-Time Compute', 'LLMs'],
    bias: 'neutral',
    paperMetadata: {
      arxivId: '2410.01234',
      doi: '10.48550/arXiv.2410.01234',
      authors: ['S. Chen', 'M. Alvarez', 'K. Sutskever', 'et al.'],
      journalOrVenue: 'arXiv cs.LG / NeurIPS 2026 Submission',
      pdfUrl: 'https://arxiv.org/pdf/2410.01234.pdf',
      keyTakeaway: 'Invertir 10x más cómputo en verificación de respuestas en inferencia supera en precisión a escalar 100x el tamaño de parámetros del modelo.',
    },
  },
  {
    id: 'paper-2',
    title: 'Solid-State Electrolyte Battery with 92% Capacity Retention after 3000 Fast-Charge Cycles',
    summary: 'Científicos presentan un electrolito cerámico flexible de sulfuro dopado que elimina la degradación por dendritas de litio en condiciones extremas.',
    source: KNOWN_SOURCES.nature,
    url: 'https://nature.com/articles/s41586-026-battery',
    publishedAt: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    category: 'papers',
    tags: ['Nature Materials', 'Baterías', 'Nanotecnología', 'Energía'],
    bias: 'neutral',
    paperMetadata: {
      doi: '10.1038/s41586-026-08129-x',
      authors: ['Dr. Elena Rostova', 'H. Tanaka', 'Carlos Méndez'],
      journalOrVenue: 'Nature Energy Vol. 11',
      pdfUrl: 'https://nature.com/articles/s41586-026-battery.pdf',
      keyTakeaway: 'Habilita recargas de vehículos eléctricos en 8 minutos sin riesgo térmico y con vida útil proyectada superior a 20 años.',
    },
  },
  {
    id: 'paper-3',
    title: 'Monitoreo satelital con radar de apertura sintética (SAR) detecta deforestación en la Amazonía en tiempo real bajo cobertura de nubes',
    summary: 'Nueva arquitectura de red neuronal convolucional procesa imágenes Sentinel-1 para alertar tala ilegal en menos de 4 horas.',
    source: KNOWN_SOURCES.mongabay,
    url: 'https://es.mongabay.com/radar-amazonia',
    publishedAt: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    category: 'environment',
    tags: ['Amazonía', 'Satélite SAR', 'Conservación', 'Biodiversidad'],
    bias: 'neutral',
    paperMetadata: {
      journalOrVenue: 'Remote Sensing of Environment / Mongabay Investigación',
      authors: ['Instituto Sinchi', 'Agencia Espacial Europea'],
      keyTakeaway: 'Supera la limitación histórica de la nubosidad tropical en el Caquetá y Guaviare, permitiendo respuesta operativa de guardabosques.',
    },
  },
  {
    id: 'tech-1',
    title: 'WebAssembly Garbage Collection (WasmGC) alcanza soporte universal en navegadores de escritorio y móviles',
    summary: 'Los motores V8, JavaScriptCore y SpiderMonkey completan la especificación nativa, permitiendo compilar Kotlin, Dart y Java a Wasm a velocidad casi nativa.',
    source: KNOWN_SOURCES.hackernews,
    url: 'https://news.ycombinator.com',
    publishedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    category: 'tech',
    tags: ['Wasm', 'Web Standards', 'Performance', 'Vite'],
    bias: 'neutral',
  },
];

/**
 * Consulta noticias y clusters desde Supabase con fallback automático
 */
export async function fetchNewsDataFromSupabase(): Promise<{
  clusters: NewsCluster[];
  articles: NewsArticle[];
}> {
  try {
    const { supabase } = await import('../../../lib/supabase');

    // 1. Obtener clusters activos
    const { data: dbClusters, error: clusterErr } = await supabase
      .from('news_clusters')
      .select('*')
      .order('last_updated', { ascending: false })
      .limit(20);

    // 2. Obtener artículos
    const { data: dbArticles, error: articleErr } = await supabase
      .from('news_articles')
      .select('*, news_sources(*)')
      .order('published_at', { ascending: false })
      .limit(60);

    if (clusterErr || articleErr || !dbArticles || dbArticles.length === 0) {
      return { clusters: INITIAL_CLUSTERS, articles: INITIAL_PAPERS_AND_TECH };
    }

    // Mapear artículos de BD a la interfaz de la app
    const mappedArticles: NewsArticle[] = dbArticles.map((item: any) => {
      const sourceObj: NewsSource = item.news_sources
        ? {
            id: item.news_sources.id,
            name: item.news_sources.name,
            bias: item.news_sources.bias,
            country: item.news_sources.country,
            reliabilityScore: item.news_sources.reliability_score,
          }
        : KNOWN_SOURCES[item.source_id] || {
            id: item.source_id,
            name: item.source_id,
            bias: item.bias || 'neutral',
            country: 'CO',
          };

      return {
        id: item.id,
        clusterId: item.cluster_id,
        title: item.title,
        summary: item.summary,
        source: sourceObj,
        url: item.url,
        imageUrl: item.image_url,
        publishedAt: item.published_at,
        category: item.category,
        tags: item.tags || [],
        bias: item.bias,
        paperMetadata: item.paper_metadata || undefined,
      };
    });

    // Artículos que no pertenecen a clusters (papers, tech standalone)
    const standalone = mappedArticles.filter((a) => !a.clusterId);

    // Mapear clusters conectando sus artículos
    let clusters: NewsCluster[] = [];
    if (dbClusters && dbClusters.length > 0) {
      clusters = dbClusters.map((c: any) => {
        const clusterArticles = mappedArticles.filter((a) => a.clusterId === c.id);
        return {
          id: c.id,
          headline: c.headline,
          topic: c.topic,
          category: c.category,
          lastUpdated: c.last_updated,
          coverage: {
            leftPercent: c.left_percent ?? 33,
            centerPercent: c.center_percent ?? 34,
            rightPercent: c.right_percent ?? 33,
            totalArticles: clusterArticles.length || c.total_articles || 1,
          },
          blindspot: c.blindspot,
          articles: clusterArticles.length > 0 ? clusterArticles : [],
        };
      });
    }

    // Si no hay clusters en la base de datos pero sí en los iniciales, combinar
    const finalClusters = clusters.length > 0 ? clusters : INITIAL_CLUSTERS;
    const finalArticles = standalone.length > 0 ? standalone : INITIAL_PAPERS_AND_TECH;

    return { clusters: finalClusters, articles: finalArticles };
  } catch (err) {
    console.warn('[NewsService] Error al conectar con Supabase, usando datos en caché:', err);
    return { clusters: INITIAL_CLUSTERS, articles: INITIAL_PAPERS_AND_TECH };
  }
}

/**
 * Suscripción en Tiempo Real mediante Supabase WebSockets (supabase_realtime)
 */
export function subscribeToRealtimeNews(
  onNewArticle: (article: NewsArticle) => void,
  onClusterUpdate: () => void
): () => void {
  let channel: any = null;

  import('../../../lib/supabase').then(({ supabase }) => {
    channel = supabase
      .channel('public:realtime_news')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'news_articles' },
        (payload: any) => {
          const item = payload.new;
          if (!item) return;

          const sourceObj: NewsSource = KNOWN_SOURCES[item.source_id] || {
            id: item.source_id,
            name: item.source_id,
            bias: item.bias || 'neutral',
            country: 'CO',
          };

          const newArticle: NewsArticle = {
            id: item.id,
            clusterId: item.cluster_id,
            title: item.title,
            summary: item.summary,
            source: sourceObj,
            url: item.url,
            imageUrl: item.image_url,
            publishedAt: item.published_at || new Date().toISOString(),
            category: item.category,
            tags: item.tags || [],
            bias: item.bias,
            paperMetadata: item.paper_metadata,
          };

          onNewArticle(newArticle);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'news_clusters' },
        () => {
          onClusterUpdate();
        }
      )
      .subscribe();
  });

  return () => {
    if (channel) {
      import('../../../lib/supabase').then(({ supabase }) => {
        supabase.removeChannel(channel);
      });
    }
  };
}
