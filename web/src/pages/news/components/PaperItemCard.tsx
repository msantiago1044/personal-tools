import React from 'react';
import { NewsArticle } from '../types/news.types';
import { FileText, Download, ExternalLink, Sparkles, BookOpen } from 'lucide-react';

interface PaperItemCardProps {
  article: NewsArticle;
}

export const PaperItemCard: React.FC<PaperItemCardProps> = ({ article }) => {
  const meta = article.paperMetadata;

  return (
    <article className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800/90 dark:to-slate-850 rounded-2xl border border-indigo-100/80 dark:border-indigo-950/40 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-2.5 relative overflow-hidden">
      {/* Acento visual superior */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      <div>
        {/* Metadatos y badges */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
              <BookOpen className="w-3 h-3" />
              {meta?.journalOrVenue || 'Paper'}
            </span>
            {meta?.arxivId && (
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                arXiv:{meta.arxivId}
              </span>
            )}
          </div>

          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            {new Date(article.publishedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* Título */}
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          <a href={article.url} target="_blank" rel="noreferrer">
            {article.title}
          </a>
        </h3>

        {/* Autores */}
        {meta?.authors && meta.authors.length > 0 && (
          <p className="text-[11px] text-slate-400 mt-1">
            {meta.authors.join(', ')}
          </p>
        )}

        {/* Resumen */}
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
          {article.summary}
        </p>

        {/* Conclusión ejecutiva limpia */}
        {meta?.keyTakeaway && (
          <div className="mt-2.5 p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-950 dark:text-indigo-200 leading-snug">
              {meta.keyTakeaway}
            </p>
          </div>
        )}
      </div>

      {/* Footer con Tags y Enlace a PDF */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 mt-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {meta?.pdfUrl && (
            <a
              href={meta.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg flex items-center gap-1 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </a>
          )}
          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="px-2.5 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-1 transition-all shadow-sm"
          >
            <span>Ver fuente</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
};
