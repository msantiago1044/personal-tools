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
          <div className="py-12 text-center max-w-sm mx-auto">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-2.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Sin resultados
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Prueba cambiando los filtros o la búsqueda.
            </p>
          </div>
        )}

        {/* Sección 1: Clusters de Contraste */}
        {clusters.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Historias & Cobertura
              </h2>
              <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold">
                {clusters.length}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 items-start">
              {clusters.map((cluster) => (
                <PerspectiveClusterCard key={cluster.id} cluster={cluster} />
              ))}
            </div>
          </section>
        )}

        {/* Sección 2: Papers y Avances */}
        {standaloneArticles.length > 0 && (
          <section className="space-y-3 pt-3 border-t border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Papers & Avances
              </h2>
              <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
                {standaloneArticles.length}
              </span>
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
