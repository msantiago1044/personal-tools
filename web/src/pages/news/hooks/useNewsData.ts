import { useState, useMemo, useEffect, useCallback } from 'react';
import { NewsCategory, PoliticalBias, NewsCluster, NewsArticle } from '../types/news.types';
import { INITIAL_CLUSTERS, INITIAL_PAPERS_AND_TECH, KNOWN_SOURCES } from '../services/newsService';

export function useNewsData() {
  const [clusters, setClusters] = useState<NewsCluster[]>(INITIAL_CLUSTERS);
  const [standaloneArticles, setStandaloneArticles] = useState<NewsArticle[]>(INITIAL_PAPERS_AND_TECH);
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('all');
  const [selectedBias, setSelectedBias] = useState<PoliticalBias | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLiveActive, setIsLiveActive] = useState(true);
  const [incomingCount, setIncomingCount] = useState(0);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());

  // Simulación de "Tiempo Real" cada 45 segundos o mediante botón de refresco
  useEffect(() => {
    if (!isLiveActive) return;

    const interval = setInterval(() => {
      setIncomingCount((prev) => prev + 1);
    }, 45000);

    return () => clearInterval(interval);
  }, [isLiveActive]);

  const handleApplyIncomingUpdates = useCallback(() => {
    // Agrega una nueva noticia simulada de última hora
    const mockBreakingArticle: NewsArticle = {
      id: `live-${Date.now()}`,
      title: 'Banco de la República ajusta tasa de interés interbancaria en su junta extraordinaria',
      summary: 'El emisor toma decisiones de política monetaria con base en el comportamiento de la inflación mensual y el crecimiento proyectado.',
      source: KNOWN_SOURCES.portafolio || KNOWN_SOURCES.eltiempo,
      url: 'https://portafolio.co',
      publishedAt: new Date().toISOString(),
      category: 'colombia',
      tags: ['Economía', 'Tasas', 'BanRep', 'Urgente'],
      bias: 'center',
    };

    setStandaloneArticles((prev) => [mockBreakingArticle, ...prev]);
    setIncomingCount(0);
    setLastRefreshedAt(new Date());
  }, []);

  // Filtrado de clusters (agrupaciones comparativas de noticias)
  const filteredClusters = useMemo(() => {
    return clusters.filter((cluster) => {
      // Filtro de categoría
      if (selectedCategory !== 'all' && selectedCategory !== 'papers' && selectedCategory !== 'tech') {
        if (cluster.category !== selectedCategory) return false;
      } else if (selectedCategory === 'papers' || selectedCategory === 'tech') {
        // Los papers suelen estar en standaloneArticles, no en clusters políticos
        return false;
      }

      // Filtro de búsqueda
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesHeadline = cluster.headline.toLowerCase().includes(query);
        const matchesTopic = cluster.topic.toLowerCase().includes(query);
        const matchesArticles = cluster.articles.some(
          (a) => a.title.toLowerCase().includes(query) || a.summary.toLowerCase().includes(query)
        );
        if (!matchesHeadline && !matchesTopic && !matchesArticles) return false;
      }

      // Filtro de sesgo: verificar si tiene artículos del sesgo solicitado
      if (selectedBias !== 'all') {
        const hasMatchingBias = cluster.articles.some((a) => a.bias === selectedBias);
        if (!hasMatchingBias) return false;
      }

      return true;
    });
  }, [clusters, selectedCategory, selectedBias, searchQuery]);

  // Filtrado de artículos individuales / papers científicos / tech
  const filteredArticles = useMemo(() => {
    return standaloneArticles.filter((article) => {
      // Filtro de categoría
      if (selectedCategory !== 'all') {
        if (article.category !== selectedCategory) return false;
      }

      // Filtro de sesgo
      if (selectedBias !== 'all') {
        if (article.bias !== selectedBias) return false;
      }

      // Filtro de búsqueda
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = article.title.toLowerCase().includes(query);
        const matchesSummary = article.summary.toLowerCase().includes(query);
        const matchesTags = article.tags.some((t) => t.toLowerCase().includes(query));
        const matchesAuthors = article.paperMetadata?.authors?.some((author) =>
          author.toLowerCase().includes(query)
        );
        if (!matchesTitle && !matchesSummary && !matchesTags && !matchesAuthors) return false;
      }

      return true;
    });
  }, [standaloneArticles, selectedCategory, selectedBias, searchQuery]);

  return {
    clusters: filteredClusters,
    standaloneArticles: filteredArticles,
    totalCount: filteredClusters.length + filteredArticles.length,
    selectedCategory,
    setSelectedCategory,
    selectedBias,
    setSelectedBias,
    searchQuery,
    setSearchQuery,
    isLiveActive,
    setIsLiveActive,
    incomingCount,
    lastRefreshedAt,
    handleApplyIncomingUpdates,
  };
}
