import React from 'react';
import { NewsArticle } from '../types/news.types';
import { ExternalLink, Tag } from 'lucide-react';

interface SingleArticleCardProps {
  article: NewsArticle;
}

export const SingleArticleCard: React.FC<SingleArticleCardProps> = ({ article }) => {
  return (
    <article className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-3">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {article.source.name}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <a href={article.url} target="_blank" rel="noreferrer">
            {article.title}
          </a>
        </h3>

        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
          {article.summary}
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 mt-1">
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

        <a
          href={article.url}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          <span>Abrir</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </article>
  );
};
