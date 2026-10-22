import React from 'react';
import { ThemeMode } from '../../../lib/theme';
import { SidurDisplayPreferences } from '../types/sidur.types';
import { SidurPrayerMode } from '../../../../../packages/shared/src/types';
import {
  ArrowLeft,
  Maximize2,
  Sun,
  Moon,
  Laptop,
  Type,
} from 'lucide-react';

interface SidurHeaderProps {
  onBackToHub: () => void;
  preferences: SidurDisplayPreferences;
  onUpdatePreferences: (updates: Partial<SidurDisplayPreferences>) => void;
  onToggleKavana: () => void;
  theme: ThemeMode;
  onThemeChange: (t: ThemeMode) => void;
}

const PRAYER_MODES: {
  id: SidurPrayerMode;
  label: string;
  shortLabel: string;
  icon: string;
  description: string;
}[] = [
  {
    id: 'minian',
    label: 'Con Minián',
    shortLabel: 'Minián',
    icon: '👥',
    description: 'Incluye Kaddish, Barejú, 13 Midot y respuestas comunitarias',
  },
  {
    id: 'sin_minian',
    label: 'Sin Minián',
    shortLabel: 'Sin Minián',
    icon: '👤',
    description: 'Rezo individual / Tefilat Yajid (omite oraciones que exigen quórum de 10)',
  },
  {
    id: 'rapido',
    label: 'Modo Rápido',
    shortLabel: 'Rápido',
    icon: '⚡',
    description: 'Núcleo halájico esencial para cuando hay apremio de tiempo',
  },
  {
    id: 'completo',
    label: 'Modo Completo',
    shortLabel: 'Completo',
    icon: '📖',
    description: 'Liturgia íntegra tradicional con todos los salmos y cánticos',
  },
];

export const SidurHeader: React.FC<SidurHeaderProps> = ({
  onBackToHub,
  preferences,
  onUpdatePreferences,
  onToggleKavana,
  theme,
  onThemeChange,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Lado izquierdo: Botón volver + Título */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHub}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Volver al Centro de Módulos"
            aria-label="Volver al Centro de Módulos"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📜</span>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Sidur · Días de Jol
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50">
                Núsaj Marruecos
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Liturgia tradicional con fonética masorética y nombres divinos consagrados (YHVH)
            </p>
          </div>
        </div>

        {/* Lado derecho: 4 Modos, Capas, Tamaño, Kavaná y Tema */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Selector de los 4 Modos de Rezo */}
          <div
            className="flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700"
            role="group"
            aria-label="Modo de rezo"
          >
            {PRAYER_MODES.map((m) => {
              const isSelected = preferences.prayerMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onUpdatePreferences({ prayerMode: m.id })}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={`${m.label}: ${m.description}`}
                >
                  <span className="text-sm">{m.icon}</span>
                  <span className="hidden lg:inline">{m.label}</span>
                  <span className="inline lg:hidden">{m.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Toggles de Capas (Hebreo / Fonética / Español) */}
          <div className="flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onUpdatePreferences({ showHebrew: !preferences.showHebrew })}
              className={`px-2 py-1 rounded-md font-medium transition-all ${
                preferences.showHebrew
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
              title="Mostrar u ocultar texto en Hebreo con Niqqud"
            >
              עִבְרִית
            </button>
            <button
              onClick={() => onUpdatePreferences({ showTranslit: !preferences.showTranslit })}
              className={`px-2 py-1 rounded-md font-medium transition-all ${
                preferences.showTranslit
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
              title="Mostrar u ocultar Fonética en Español"
            >
              Fonética
            </button>
            <button
              onClick={() => onUpdatePreferences({ showSpanish: !preferences.showSpanish })}
              className={`px-2 py-1 rounded-md font-medium transition-all ${
                preferences.showSpanish
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
              title="Mostrar u ocultar Traducción al Español"
            >
              Español
            </button>
          </div>

          {/* Selector de Tamaño de Fuente */}
          <div className="flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700">
            <span className="px-1 text-slate-400">
              <Type className="w-3.5 h-3.5" />
            </span>
            {(['sm', 'base', 'lg', 'xl'] as const).map((size) => (
              <button
                key={size}
                onClick={() => onUpdatePreferences({ fontSize: size })}
                className={`px-1.5 py-1 rounded-md font-semibold uppercase text-[11px] transition-all ${
                  preferences.fontSize === size
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Botón Modo Kavaná */}
          <button
            onClick={onToggleKavana}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 dark:bg-amber-500/15 dark:hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 font-semibold transition-colors"
            title="Modo Kavaná: Hoja completa y concentración"
          >
            <Maximize2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="hidden sm:inline">Kavaná</span>
          </button>

          {/* Selector de Tema */}
          <div className="flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onThemeChange('light')}
              className={`p-1.5 rounded-md ${theme === 'light' ? 'bg-white text-amber-500 shadow-xs' : 'text-slate-400'}`}
              title="Modo Claro"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onThemeChange('dark')}
              className={`p-1.5 rounded-md ${theme === 'dark' ? 'bg-slate-700 text-indigo-400 shadow-xs' : 'text-slate-400'}`}
              title="Modo Oscuro"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onThemeChange('system')}
              className={`p-1.5 rounded-md ${theme === 'system' ? 'bg-white dark:bg-slate-700 text-emerald-500 shadow-xs' : 'text-slate-400'}`}
              title="Tema del Sistema"
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
