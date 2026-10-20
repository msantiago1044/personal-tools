import React, { useState } from 'react';
import { NewsCluster, PoliticalBias, NewsArticle } from '../types/news.types';
import { ExternalLink, Layers, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

interface PerspectiveClusterCardProps {
  cluster: NewsCluster;
}

export const PerspectiveClusterCard: React.FC<PerspectiveClusterCardProps> = ({ cluster }) => {
  // Pestaña activa por defecto: primer artículo disponible
  const [activeBiasTab, setActiveBiasTab] = useState<PoliticalBias>(
    cluster.articles[0]?.bias || 'center'
  );

  const selectedArticle: NewsArticle | undefined =
    cluster.articles.find((a) => a.bias === activeBiasTab) || cluster.articles[0];

  const getBiasLabel = (bias: PoliticalBias) => {
    switch (bias) {
      case 'left':
        return 'Izquierda / Progresista';
      case 'center':
        return 'Centro / Institucional';
      case 'right':
        return 'Derecha / Conservador';
      case 'neutral':
        return 'Neutro / Fact-check';
    }
  };

  const getBiasBadgeClass = (bias: PoliticalBias) => {
    switch (bias) {
      case 'left':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'center':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'right':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'neutral':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    }
  };

  return (
    <article className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col gap-4">
      {/* Encabezado del Cluster */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-700/70 text-slate-700 dark:text-slate-300">
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            {cluster.topic}
          </span>

          <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {new Date(cluster.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
          {cluster.headline}
        </h3>
      </div>

      {/* Barra de Distribución de Sesgo (Ground News Style) */}
      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3 border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-medium">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Izquierda: {cluster.coverage.leftPercent}%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Centro: {cluster.coverage.centerPercent}%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Derecha: {cluster.coverage.rightPercent}%
          </span>
        </div>

        {/* Barra segmentada */}
        <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-700">
          <div
            style={{ width: `${cluster.coverage.leftPercent}%` }}
            className="h-full bg-rose-500 transition-all duration-500"
            title={`Izquierda: ${cluster.coverage.leftPercent}%`}
          />
          <div
            style={{ width: `${cluster.coverage.centerPercent}%` }}
            className="h-full bg-amber-400 transition-all duration-500"
            title={`Centro: ${cluster.coverage.centerPercent}%`}
          />
          <div
            style={{ width: `${cluster.coverage.rightPercent}%` }}
            className="h-full bg-blue-500 transition-all duration-500"
            title={`Derecha: ${cluster.coverage.rightPercent}%`}
          />
        </div>
      </div>

      {/* Pestañas de Perspectivas para comparar cómo titula cada medio */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 block">
          Comparativa de Enfoque Editorial:
        </span>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {cluster.articles.map((art) => {
            const isTabActive = activeBiasTab === art.bias;
            return (
              <button
                key={art.id}
                onClick={() => setActiveBiasTab(art.bias)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 border ${
                  isTabActive
                    ? `${getBiasBadgeClass(art.bias)} shadow-sm ring-1 ring-black/5`
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <span>{art.source.name}</span>
                <span className="opacity-75">({getBiasLabel(art.bias).split(' ')[0]})</span>
              </button>
            );
          })}
        </div>

        {/* Noticia Seleccionada según el enfoque */}
        {selectedArticle && (
          <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {selectedArticle.source.name}{' '}
                <span className="font-normal text-slate-400">({selectedArticle.source.country === 'CO' ? 'Colombia' : 'Global'})</span>
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${getBiasBadgeClass(selectedArticle.bias)}`}>
                {getBiasLabel(selectedArticle.bias)}
              </span>
            </div>

            <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
              {selectedArticle.title}
            </h4>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedArticle.summary}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800 mt-1">
              <div className="flex items-center gap-1.5">
                {selectedArticle.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <a
                href={selectedArticle.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Leer original</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
