import React, { useState } from 'react';
import { ModuleProps } from '../../modules/moduleRegistry';
import { ThemeMode, getStoredTheme, applyTheme } from '../../lib/theme';
import { useNewsData } from './hooks/useNewsData';
import { NewsHeader } from './components/NewsHeader';
import { NewsFilters } from './components/NewsFilters';
import { PerspectiveClusterCard } from './components/PerspectiveClusterCard';
import { PaperItemCard } from './components/PaperItemCard';
import { SingleArticleCard } from './components/SingleArticleCard';
import { Newspaper, BookOpen, Sparkles, AlertCircle } from 'lucide-react';

export const NewsModule: React.FC<ModuleProps> = ({ onBackToHub }) => {
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme());

  const {
    clusters,
    standaloneArticles,
    totalCount,
    selectedCategory,
    setSelectedCategory,
    selectedBias,
    setSelectedBias,
    searchQuery,
    setSearchQuery,
    isLiveActive,
    incomingCount,
    handleApplyIncomingUpdates,
  } = useNewsData();

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Cabecera del módulo */}
      <NewsHeader
        onBackToHub={onBackToHub}
        isLiveActive={isLiveActive}
        incomingCount={incomingCount}
        onApplyIncoming={handleApplyIncomingUpdates}
        theme={theme}
        onThemeChange={handleThemeChange}
      />

      {/* Contenedor Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Barra de filtros y búsqueda */}
        <NewsFilters
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedBias={selectedBias}
          onSelectBias={setSelectedBias}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Estado Vacío */}
        {totalCount === 0 && (
          <div className="py-16 text-center max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No se encontraron noticias con estos filtros
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Prueba cambiando el espectro político o seleccionando "Todo el Feed".
            </p>
          </div>
        )}

        {/* Sección 1: Clusters de Contraste Político (Izquierda vs Derecha vs Neutro) */}
        {clusters.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Contraste de Cobertura & Perspectivas
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold">
                {clusters.length} {clusters.length === 1 ? 'historia' : 'historias'}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              {clusters.map((cluster) => (
                <PerspectiveClusterCard key={cluster.id} cluster={cluster} />
              ))}
            </div>
          </section>
        )}

        {/* Sección 2: Papers Científicos y Avances Tecnológicos */}
        {standaloneArticles.length > 0 && (
          <section className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Papers Científicos, Radar Tech & Medio Ambiente
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
                  {standaloneArticles.length}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              {standaloneArticles.map((art) => {
                if (art.category === 'papers' || art.paperMetadata) {
                  return <PaperItemCard key={art.id} article={art} />;
                }
                return <SingleArticleCard key={art.id} article={art} />;
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
