import React from 'react';
import { ArrowLeft, Radio, RefreshCw, Sun, Moon } from 'lucide-react';
import { ThemeMode } from '../../../lib/theme';

interface NewsHeaderProps {
  onBackToHub: () => void;
  isLiveActive: boolean;
  incomingCount: number;
  onApplyIncoming: () => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export const NewsHeader: React.FC<NewsHeaderProps> = ({
  onBackToHub,
  isLiveActive,
  incomingCount,
  onApplyIncoming,
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
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Radar de Noticias & Papers
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {isLiveActive ? 'EN VIVO' : 'PAUSADO'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden md:block">
                Contraste de perspectivas políticas (Colombia & Mundo) y avances científicos
              </p>
            </div>
          </div>
        </div>

        {/* Lado derecho: Notificación de noticias nuevas y Theme Toggle */}
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
