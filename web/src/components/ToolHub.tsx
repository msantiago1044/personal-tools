import React, { useState } from 'react';
import { ToolModule } from '../../../packages/shared/src/types';
import { ThemeMode, getStoredTheme, applyTheme } from '../lib/theme';
import { Sun, Moon, Laptop, Smartphone } from 'lucide-react';
import { DownloadApkModal } from './DownloadApkModal';

const AVAILABLE_TOOLS: ToolModule[] = [
  {
    id: 'finance',
    name: 'Finanzas',
    description: 'Flujo de caja, cuentas y presupuestos.',
    icon: 'wallet',
    route: '/finance/home',
    status: 'active',
    badge: 'Principal',
  },
  {
    id: 'pantry',
    name: 'Despensa & Mercado',
    description: 'Inventario, escaneo de facturas y nutrición.',
    icon: 'shopping-bag',
    route: '/pantry',
    status: 'active',
    badge: 'IA Vision',
  },
  {
    id: 'tehilim',
    name: 'Tehilim',
    description: '150 salmos con hebreo, fonética y traducción.',
    icon: 'book-open',
    route: '/tehilim',
    status: 'active',
  },
  {
    id: 'dwg_viewer',
    name: 'Planos CAD',
    description: 'Visor de archivos DWG y DXF con capas y regla.',
    icon: 'layers',
    route: '/cad-viewer',
    status: 'active',
  },
  {
    id: 'investments',
    name: 'Inversiones',
    description: 'Seguimiento de portafolio y rendimientos.',
    icon: 'trending-up',
    route: '/investments',
    status: 'coming_soon',
    badge: 'Pronto',
  },
  {
    id: 'invoicing',
    name: 'Facturación',
    description: 'Facturas, cotizaciones y cobros.',
    icon: 'file-text',
    route: '/invoicing',
    status: 'coming_soon',
  },
  {
    id: 'tasks',
    name: 'Metas',
    description: 'Objetivos de ahorro y productividad.',
    icon: 'check-circle',
    route: '/goals',
    status: 'coming_soon',
  },
];

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
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

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
              className={`p-1.5 rounded-lg text-xs transition ${
                theme === 'system'
                  ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Botón Descargar APK */}
          <button
            onClick={() => setShowDownloadModal(true)}
            title="App Android (.APK)"
            className="flex items-center gap-1.5 text-xs bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 font-medium transition shadow-xs"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">App</span>
          </button>

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
            className="text-xs bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 transition"
          >
            Salir
          </button>
        </div>
      </header>

      {/* Grid de Herramientas Minimalista */}
      <main className="max-w-5xl mx-auto mt-6 sm:mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AVAILABLE_TOOLS.map((tool) => {
            const isActive = tool.status === 'active';

            return (
              <div
                key={tool.id}
                onClick={() => isActive && onSelectTool(tool.route)}
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
                        : tool.id === 'investments'
                        ? '📈'
                        : tool.id === 'invoicing'
                        ? '🧾'
                        : '🎯'}
                    </div>

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

                  <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug line-clamp-2">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs font-medium text-slate-400 dark:text-slate-500">
                  <span>{isActive ? 'Abrir' : 'Próximamente'}</span>
                  <span className={`text-xs ${isActive ? 'text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform' : 'text-slate-300 dark:text-slate-700'}`}>
                    →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <DownloadApkModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
      />
    </div>
  );
};
