import React, { useState, useEffect } from 'react';
import { ThemeMode, getStoredTheme, applyTheme } from '../lib/theme';
import { Sun, Moon, Laptop, Flame, Clock, SlidersHorizontal, Pin, Download, Cloud, LayoutGrid, LayoutList } from 'lucide-react';
import { MODULE_REGISTRY, ModuleManifest } from '../modules/moduleRegistry';
import { isStandaloneMode } from '../lib/pwa';
import { InstallPwaModal } from './InstallPwaModal';
import { ParashaDailyCard } from './ParashaDailyCard';
import { syncParashaWithCloud } from '../lib/parashaService';
import { hasReadPirkeiAvotToday, getStoredPirkeiAvotBookmark, syncPirkeiAvotWithCloud } from '../lib/pirkeiAvot';
import {
  ModuleSortMode,
  getModuleUsageStats,
  recordModuleUsage,
  togglePinModule,
  getStoredSortPreference,
  setStoredSortPreference,
  sortModules,
  formatRelativeTime,
  formatExactTime,
  hasVisitedModuleToday,
  syncModuleUsageWithCloud,
} from '../modules/moduleUsage';

export type HubLayoutMode = 'grid' | 'cards';

interface ToolHubProps {
  userId?: string;
  userEmail: string;
  userName?: string;
  avatarUrl?: string;
  onSelectTool: (route: string) => void;
  onLogout: () => void;
}

export const ToolHub: React.FC<ToolHubProps> = ({
  userId,
  userEmail,
  userName,
  avatarUrl,
  onSelectTool,
  onLogout,
}) => {
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme());
  const [showInstallModal, setShowInstallModal] = useState(false);
  const isStandalone = typeof window !== 'undefined' ? isStandaloneMode() : true;
  const userKey = userId || userEmail || userName || 'default';
  const [sortMode, setSortMode] = useState<ModuleSortMode>(getStoredSortPreference());
  const [usageStats, setUsageStats] = useState(() => getModuleUsageStats(userKey));
  const [, setAvotVersion] = useState(0);

  // Modo de visualización: Cuadrícula compacta de iconos (App Drawer) o Tarjetas detalladas
  const [layoutMode, setLayoutMode] = useState<HubLayoutMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pt_hub_layout_mode');
      if (saved === 'grid' || saved === 'cards') return saved;
    }
    return 'grid'; // Por defecto: Grilla rápida compacta
  });

  const handleLayoutChange = (mode: HubLayoutMode) => {
    setLayoutMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pt_hub_layout_mode', mode);
    }
  };

  // Sincronizar estadísticas unificadas en la nube (Móvil + Web)
  useEffect(() => {
    let isCancelled = false;

    const runSync = async () => {
      const merged = await syncModuleUsageWithCloud(userKey);
      if (!isCancelled && merged) {
        setUsageStats(merged);
        setSortMode(getStoredSortPreference());
      }
      // Sincronizar y mezclar lecturas de Pirkei Avot entre dispositivos
      await syncPirkeiAvotWithCloud(userId || userKey);
      if (!isCancelled) {
        setAvotVersion((v) => v + 1);
      }
      // Sincronizar y mezclar lecturas de Parashá entre dispositivos (móvil y web)
      await syncParashaWithCloud(userId || userKey);
    };

    runSync();

    const handleAvotUpdate = () => {
      setAvotVersion((v) => v + 1);
    };

    const handleUsageUpdated = () => {
      if (!isCancelled) {
        setUsageStats(getModuleUsageStats(userKey));
      }
    };

    // Re-sincronizar cuando el usuario regrese a la pestaña o reactive la PWA en el celular
    const handleFocus = () => {
      handleUsageUpdated();
      runSync();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleUsageUpdated();
        runSync();
      } else if (document.visibilityState === 'hidden') {
        syncModuleUsageWithCloud(userKey).catch(() => {});
      }
    };

    const handlePageHide = () => {
      syncModuleUsageWithCloud(userKey).catch(() => {});
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('pirkei_avot_updated', handleAvotUpdate);
    window.addEventListener('module_usage_updated', handleUsageUpdated);
    window.addEventListener('pagehide', handlePageHide);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isCancelled = true;
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('pirkei_avot_updated', handleAvotUpdate);
      window.removeEventListener('module_usage_updated', handleUsageUpdated);
      window.removeEventListener('pagehide', handlePageHide);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userKey, userId]);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const handleSortChange = (newMode: ModuleSortMode) => {
    setSortMode(newMode);
    setStoredSortPreference(newMode, userKey);
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
        {/* Widget diario de Parashá de la semana (se oculta automáticamente si ya fue leída hoy) */}
        <ParashaDailyCard
          userId={userKey}
          onOpenParasha={() => {
            recordModuleUsage('parasha', userKey);
            setUsageStats(getModuleUsageStats(userKey));
            onSelectTool('/parasha');
          }}
        />

        {/* Módulos según modo de visualización */}
        {layoutMode === 'grid' ? (
          /* =========================================================================
              VISTA 1: GRILLA COMPACTA DE ACCESO RÁPIDO (ICONOS + NOMBRES CORTOS)
             ========================================================================= */
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
            {sortedModules.map((tool, index) => {
              const isActive = tool.status === 'active';
              const stats = usageStats[tool.id] || { count: 0, lastOpened: 0, pinned: false };
              const isPinned = !!stats.pinned;
              const isPirkeiRead = tool.id === 'pirkei_avot' && hasReadPirkeiAvotToday(userKey);
              const visitedToday = isActive && hasVisitedModuleToday(stats.lastOpened);
              const relativeTime = formatRelativeTime(stats.lastOpened);
              const exactTime = formatExactTime(stats.lastOpened);
              const shortTitle = tool.shortName || tool.name;

              return (
                <div
                  key={tool.id}
                  role="button"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => isActive && handleOpenTool(tool)}
                  onKeyDown={(e) => {
                    if (isActive && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleOpenTool(tool);
                    }
                  }}
                  title={`${tool.name}: ${tool.description}${isActive ? (visitedToday ? ` (Entrado hoy${exactTime ? ` a las ${exactTime}` : ''})` : ' (Pendiente de entrar hoy)') : ''}`}
                  aria-label={`Abrir módulo ${tool.name}`}
                  className={`group relative flex flex-col items-center justify-between text-center p-3 sm:p-4 rounded-3xl transition-all duration-200 select-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${
                    isActive
                      ? visitedToday
                        ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border border-slate-200/90 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg hover:-translate-y-1 cursor-pointer active:scale-95 shadow-xs'
                        : 'bg-emerald-50/70 dark:bg-emerald-950/25 backdrop-blur-xs border border-emerald-300/80 dark:border-emerald-700/50 hover:border-emerald-500/70 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-1 cursor-pointer active:scale-95 shadow-xs'
                      : 'bg-slate-100/40 dark:bg-slate-900/30 border border-slate-200/40 dark:border-slate-800/40 opacity-45 cursor-not-allowed'
                  }`}
                >
                  {/* Botón Pin para fijar en cabecera */}
                  <button
                    type="button"
                    onClick={(e) => handleTogglePin(e, tool.id)}
                    title={isPinned ? 'Desfijar de la cabecera' : 'Fijar arriba'}
                    aria-label={isPinned ? 'Desfijar de la cabecera' : 'Fijar arriba'}
                    className={`absolute top-2 right-2 p-1 rounded-lg transition-opacity z-10 ${
                      isPinned
                        ? 'opacity-100 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70'
                        : 'opacity-0 group-hover:opacity-100 text-slate-300 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                  >
                    <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-current rotate-45' : ''}`} />
                  </button>

                  {/* Icono de App con contenedor premium y micro-animación */}
                  <div
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl flex items-center justify-center text-2xl sm:text-3xl shadow-xs transition-transform duration-200 group-hover:scale-110 mb-2 mt-1 ${
                      isActive
                        ? visitedToday
                          ? 'bg-gradient-to-br from-slate-100 to-slate-200/80 dark:from-slate-800 dark:to-slate-800/60 border border-slate-200/90 dark:border-slate-700/60'
                          : 'bg-gradient-to-br from-emerald-100/80 to-emerald-200/50 dark:from-emerald-900/40 dark:to-emerald-800/25 border border-emerald-200/80 dark:border-emerald-700/50'
                        : 'bg-slate-200/50 dark:bg-slate-800/40 text-slate-400 border border-slate-200/40 dark:border-slate-800/40'
                    }`}
                  >
                    <span className="leading-none select-none">{tool.emoji}</span>

                    {/* Insignia de Pirkei Avot leído hoy */}
                    {isPirkeiRead && (
                      <span
                        title="Lectura de hoy registrada"
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs ring-2 ring-white dark:ring-slate-900"
                      >
                        ✓
                      </span>
                    )}

                    {/* Indicador de Top más usados si estamos en orden 'most_used' */}
                    {sortMode === 'most_used' && stats.count > 0 && index < 3 && !isPinned && (
                      <span
                        title="Módulo frecuente"
                        className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[9px] shadow-xs ring-2 ring-white dark:ring-slate-900"
                      >
                        🔥
                      </span>
                    )}
                  </div>

                  {/* Nombre corto centrado */}
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate w-full px-1">
                    {shortTitle}
                  </span>

                  {/* Contador o distintivo sutil */}
                  <span className="text-[10px] mt-0.5 truncate w-full font-medium">
                    {sortMode === 'most_used' && stats.count > 0 ? (
                      <span className={visitedToday ? 'text-slate-400 dark:text-slate-500' : 'text-emerald-700 dark:text-emerald-300 font-semibold'}>
                        {stats.count} {stats.count === 1 ? 'uso' : 'usos'}
                      </span>
                    ) : visitedToday ? (
                      <span className="text-slate-400 dark:text-slate-500">
                        {exactTime ? `Hoy ${exactTime}` : 'Entrado hoy'}
                      </span>
                    ) : (
                      <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
                        {tool.badge || 'Pendiente'}
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          /* =========================================================================
              VISTA 2: TARJETAS DETALLADAS CON DESCRIPCIÓN
             ========================================================================= */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedModules.map((tool) => {
              const isActive = tool.status === 'active';
              const stats = usageStats[tool.id] || { count: 0, lastOpened: 0, pinned: false };
              const isPinned = !!stats.pinned;
              const visitedToday = isActive && hasVisitedModuleToday(stats.lastOpened);
              const relativeTime = formatRelativeTime(stats.lastOpened);
              const exactTime = formatExactTime(stats.lastOpened);

              return (
                <div
                  key={tool.id}
                  role="button"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => isActive && handleOpenTool(tool)}
                  onKeyDown={(e) => {
                    if (isActive && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleOpenTool(tool);
                    }
                  }}
                  title={`${tool.name}: ${tool.description}${isActive ? (visitedToday ? ` (Entrado hoy${exactTime ? ` a las ${exactTime}` : ''})` : ' (Pendiente de entrar hoy)') : ''}`}
                  aria-label={`Abrir módulo ${tool.name}: ${tool.description}`}
                  className={`relative rounded-2xl p-5 transition-all duration-150 flex flex-col justify-between focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${
                    isActive
                      ? visitedToday
                        ? 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md cursor-pointer group shadow-xs'
                        : 'bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-300/70 dark:border-emerald-700/40 hover:border-emerald-500/60 hover:shadow-md hover:shadow-emerald-500/5 cursor-pointer group shadow-xs'
                      : 'bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/40 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-xs transition-transform duration-200 group-hover:scale-105 ${
                          isActive
                            ? visitedToday
                              ? 'bg-slate-100 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/70'
                              : 'bg-emerald-100/80 dark:bg-emerald-900/40 border border-emerald-200/80 dark:border-emerald-700/60'
                            : 'bg-slate-200/50 dark:bg-slate-800/50 text-slate-400 border border-slate-200/40 dark:border-slate-800/40'
                        }`}
                      >
                        <span className="select-none leading-none">{tool.emoji}</span>
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

                        {tool.id === 'pirkei_avot' ? (
                          hasReadPirkeiAvotToday(userKey) ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1 shadow-xs">
                              ✓ Leído hoy
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/50">
                              Cap. {getStoredPirkeiAvotBookmark(userKey).chapter}:{getStoredPirkeiAvotBookmark(userKey).mishna}
                            </span>
                          )
                        ) : visitedToday ? (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                            ✓ Hoy {exactTime}
                          </span>
                        ) : tool.badge ? (
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                              isActive
                                ? 'bg-emerald-100/80 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300/70 dark:border-emerald-800/50'
                                : 'bg-slate-200/60 dark:bg-slate-800/60 text-slate-500'
                            }`}
                          >
                            {tool.badge}
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-100/60 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
                            Pendiente
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
        )}

        {/* Barra de ordenación y preferencias (ubicada debajo de los iconos para priorizar la grilla) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-6 sm:mt-8 pb-8 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Módulos ({MODULE_REGISTRY.length})
            </span>
            {sortMode === 'most_used' && (
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/40 flex items-center gap-1.5">
                <span>Orden dinámico por más usados</span>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-normal border-l border-emerald-200 dark:border-emerald-800/60 pl-1.5">
                  <Cloud className="w-3 h-3 text-emerald-500" />
                  Móvil + Web
                </span>
              </span>
            )}
            {sortMode === 'recent' && (
              <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md border border-blue-200/60 dark:border-blue-800/40">
                Orden por última apertura
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Selector de Vista: Cuadrícula Rápida de Iconos vs Tarjetas */}
            <div className="flex items-center bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs text-xs">
              <button
                onClick={() => handleLayoutChange('grid')}
                title="Vista compacta de cuadrícula con iconos y nombres cortos"
                aria-label="Vista de cuadrícula con iconos"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition font-medium ${
                  layoutMode === 'grid'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Iconos</span>
              </button>
              <button
                onClick={() => handleLayoutChange('cards')}
                title="Vista de tarjetas detalladas con descripciones"
                aria-label="Vista de tarjetas detalladas"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition font-medium ${
                  layoutMode === 'cards'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tarjetas</span>
              </button>
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
