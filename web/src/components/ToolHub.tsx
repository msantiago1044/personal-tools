import React, { useState } from 'react';
import { ThemeMode, getStoredTheme, applyTheme } from '../lib/theme';
import { Sun, Moon, Laptop, Flame, Clock, SlidersHorizontal, Pin, Download } from 'lucide-react';
import { MODULE_REGISTRY, ModuleManifest } from '../modules/moduleRegistry';
import { isStandaloneMode } from '../lib/pwa';
import { InstallPwaModal } from './InstallPwaModal';
import {
  ModuleSortMode,
  getModuleUsageStats,
  recordModuleUsage,
  togglePinModule,
  getStoredSortPreference,
  setStoredSortPreference,
  sortModules,
  formatRelativeTime,
} from '../modules/moduleUsage';

interface ToolHubProps {
  userEmail: string;
  userName?: string;
  avatarUrl?: string;
  onSelectTool: (route: string) => void;
  onLogout: () => void;
}

export const ToolHub: React.FC<ToolHubProps> = ({
  userEmail,
  userName,
  avatarUrl,
  onSelectTool,
  onLogout,
}) => {
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme());
  const [showInstallModal, setShowInstallModal] = useState(false);
  const isStandalone = typeof window !== 'undefined' ? isStandaloneMode() : true;
  const userKey = userEmail || userName || 'default';
  const [sortMode, setSortMode] = useState<ModuleSortMode>(getStoredSortPreference());
  const [usageStats, setUsageStats] = useState(() => getModuleUsageStats(userKey));

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const handleSortChange = (newMode: ModuleSortMode) => {
    setSortMode(newMode);
    setStoredSortPreference(newMode);
  };

  const handleTogglePin = (e: React.MouseEvent, moduleId: string) => {
    e.stopPropagation();
    togglePinModule(moduleId, userKey);
    setUsageStats(getModuleUsageStats(userKey));
  };

  const handleOpenTool = (tool: ModuleManifest) => {
    if (tool.status !== 'active') return;
    recordModuleUsage(tool.id, userKey);
    setUsageStats(getModuleUsageStats(userKey));
    onSelectTool(tool.route);
  };

  const sortedModules = sortModules(MODULE_REGISTRY, sortMode, usageStats);
  const displayName = userName ? userName.split(' ')[0] : userEmail.split('@')[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-8 md:p-10 transition-colors duration-200">
      {/* Header Minimalista */}
      <header className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-200/80 dark:border-slate-800/80 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Hola, {displayName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Selecciona un módulo
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Selector de tema */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <button
              onClick={() => handleThemeChange('light')}
              title="Claro"
              aria-label="Cambiar a tema claro"
              className={`p-1.5 rounded-lg text-xs transition ${
                theme === 'light'
                  ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              title="Oscuro"
              aria-label="Cambiar a tema oscuro"
              className={`p-1.5 rounded-lg text-xs transition ${
                theme === 'dark'
                  ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-bold'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleThemeChange('system')}
              title="Sistema"
              aria-label="Cambiar a tema del sistema"
              className={`p-1.5 rounded-lg text-xs transition ${
                theme === 'system'
                  ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
          </div>

          {!isStandalone && (
            <button
              onClick={() => setShowInstallModal(true)}
              title="Instalar App en el dispositivo (PWA)"
              aria-label="Instalar App en el dispositivo (PWA)"
              className="flex items-center gap-1.5 text-xs bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-semibold px-2.5 py-2 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Instalar App</span>
            </button>
          )}

          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-emerald-700 dark:text-slate-300 border border-emerald-200 dark:border-slate-700">
              {(userName || userEmail).charAt(0).toUpperCase()}
            </div>
          )}

          <button
            onClick={onLogout}
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
            className="text-xs bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 transition"
          >
            Salir
          </button>
        </div>
      </header>

      {/* Grid de Herramientas Minimalista */}
      <main className="max-w-5xl mx-auto mt-6 sm:mt-8">
        {/* Barra superior de ordenación y preferencias */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Módulos ({MODULE_REGISTRY.length})
            </span>
            {sortMode === 'most_used' && (
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/40">
                Orden dinámico por más usados
              </span>
            )}
            {sortMode === 'recent' && (
              <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md border border-blue-200/60 dark:border-blue-800/40">
                Orden por última apertura
              </span>
            )}
          </div>

          {/* Selector de Orden */}
          <div className="flex items-center bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs text-xs">
            <button
              onClick={() => handleSortChange('most_used')}
              title="Colocar primero los que más usas"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium ${
                sortMode === 'most_used'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Más usados</span>
            </button>

            <button
              onClick={() => handleSortChange('recent')}
              title="Colocar primero los usados recientemente"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium ${
                sortMode === 'recent'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Recientes</span>
            </button>

            <button
              onClick={() => handleSortChange('default')}
              title="Ver en el orden original"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium ${
                sortMode === 'default'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Predeterminado</span>
            </button>
          </div>
        </div>

        {/* Grid de Módulos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedModules.map((tool) => {
            const isActive = tool.status === 'active';
            const stats = usageStats[tool.id] || { count: 0, lastOpened: 0, pinned: false };
            const isPinned = !!stats.pinned;
            const relativeTime = formatRelativeTime(stats.lastOpened);

            return (
              <div
                key={tool.id}
                onClick={() => isActive && handleOpenTool(tool)}
                className={`relative rounded-2xl p-5 transition-all duration-150 flex flex-col justify-between ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 hover:border-emerald-500/40 hover:shadow-md cursor-pointer group shadow-xs'
                    : 'bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/40 opacity-50 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {tool.id === 'finance'
                        ? '📊'
                        : tool.id === 'tehilim'
                        ? '📜'
                        : tool.id === 'dwg_viewer'
                        ? '📐'
                        : tool.id === 'pantry'
                        ? '🛒'
                        : tool.id === 'emotions'
                        ? '✨'
                        : tool.id === 'notes'
                        ? '📝'
                        : tool.id === 'pgn'
                        ? '⚖️'
                        : tool.id === 'hebrew_srs'
                        ? '📖'
                        : tool.id === 'sleep'
                        ? '🌙'
                        : '💎'}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Botón Pin para fijar manualmente arriba */}
                      <button
                        type="button"
                        onClick={(e) => handleTogglePin(e, tool.id)}
                        title={isPinned ? 'Desfijar de la cabecera' : 'Fijar este módulo arriba'}
                        aria-label={isPinned ? 'Desfijar de la cabecera' : 'Fijar este módulo arriba'}
                        className={`p-1.5 rounded-lg transition-all ${
                          isPinned
                            ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                            : 'text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-current rotate-45' : ''}`} />
                      </button>

                      {tool.badge && (
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                            isActive
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50'
                              : 'bg-slate-200/60 dark:bg-slate-800/60 text-slate-500'
                          }`}
                        >
                          {tool.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug line-clamp-2">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs font-medium text-slate-400 dark:text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span>{isActive ? 'Abrir' : 'Próximamente'}</span>

                    {/* Métrica de uso contextual según el modo seleccionado */}
                    {sortMode === 'most_used' && stats.count > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-normal">
                        {stats.count === 1 ? '1 uso' : `${stats.count} usos`}
                      </span>
                    )}
                    {sortMode === 'recent' && relativeTime && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-normal">
                        {relativeTime}
                      </span>
                    )}
                    {isPinned && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-medium">
                        Fijado
                      </span>
                    )}
                  </div>

                  <span className={`text-xs ${isActive ? 'text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform' : 'text-slate-300 dark:text-slate-700'}`}>
                    →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Modal de Instrucciones de Instalación PWA (iOS / Android / Desktop) */}
      <InstallPwaModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </div>
  );
};

