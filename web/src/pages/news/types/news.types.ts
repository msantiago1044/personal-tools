export type PoliticalBias = 'left' | 'center' | 'right' | 'neutral';

export type NewsCategory = 
  | 'all'
  | 'colombia'
  | 'world'
  | 'tech'
  | 'papers'
  | 'environment';

export interface NewsSource {
  id: string;
  name: string;
  bias: PoliticalBias;
  country: 'CO' | 'INT';
  logo?: string;
  reliabilityScore?: number; // 0 a 100
}

export interface NewsArticle {
  id: string;
  clusterId?: string;
  title: string;
  summary: string;
  source: NewsSource;
  url: string;
  imageUrl?: string;
  publishedAt: string; // ISO String
  category: NewsCategory;
  tags: string[];
  bias: PoliticalBias;
  // Campos especializados para papers científicos y tecnología
  paperMetadata?: {
    doi?: string;
    arxivId?: string;
    authors?: string[];
    journalOrVenue?: string;
    pdfUrl?: string;
    keyTakeaway?: string;
  };
}

export interface NewsCluster {
  id: string;
  headline: string;
  topic: string;
  category: NewsCategory;
  lastUpdated: string;
  coverage: {
    leftPercent: number;
    centerPercent: number;
    rightPercent: number;
    totalArticles: number;
  };
  articles: NewsArticle[];
  blindspot?: 'left' | 'right' | null; // Si casi solo un lado lo está cubriendo
}
