import React from 'react';
import { ArrowLeft, Radio, RefreshCw, Sun, Moon } from 'lucide-react';
import { ThemeMode } from '../../../lib/theme';

interface NewsHeaderProps {
  onBackToHub: () => void;
  isLiveActive: boolean;
  incomingCount: number;
  onApplyIncoming: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  lastRefreshedAt?: Date;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export const NewsHeader: React.FC<NewsHeaderProps> = ({
  onBackToHub,
  isLiveActive,
  incomingCount,
  onApplyIncoming,
  onRefresh,
  isRefreshing = false,
  lastRefreshedAt,
  theme,
  onThemeChange,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Lado izquierdo: Botón volver y Título */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHub}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5 text-sm font-medium"
            title="Volver al Hub"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Hub</span>
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label="periódico">📰</span>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Noticias & Papers
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {isLiveActive ? 'EN VIVO' : 'PAUSADO'}
              </span>
            </div>
          </div>
        </div>

        {/* Lado derecho: Notificación de noticias nuevas, botón refrescar y Theme Toggle */}
        <div className="flex items-center gap-2">
          {incomingCount > 0 && (
            <button
              onClick={onApplyIncoming}
              className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm shadow-blue-500/20 flex items-center gap-1.5 animate-bounce transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{incomingCount} {incomingCount === 1 ? 'nueva noticia' : 'nuevas noticias'}</span>
            </button>
          )}

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="px-2.5 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5 text-xs font-medium border border-slate-200 dark:border-slate-700/80 disabled:opacity-60"
              title={lastRefreshedAt ? `Última sincronización: ${lastRefreshedAt.toLocaleTimeString()}` : 'Actualizar noticias'}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600 dark:text-blue-400' : ''}`} />
              <span className="hidden sm:inline">{isRefreshing ? 'Actualizando...' : 'Actualizar'}</span>
            </button>
          )}

          <button
            onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Alternar tema claro/oscuro"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
