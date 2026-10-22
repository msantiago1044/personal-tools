import React from 'react';
import { SidurTefila, SidurTefilaId } from '../../../../../packages/shared/src/types';
import { ThemeMode } from '../../../lib/theme';
import {
  ArrowLeft,
  Sun,
  Moon,
  Laptop,
  Clock,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface SidurTefilaLauncherProps {
  tefilot: SidurTefila[];
  suggestedTefilaId: SidurTefilaId;
  onSelectTefila: (id: SidurTefilaId) => void;
  onBackToHub: () => void;
  theme: ThemeMode;
  onThemeChange: (t: ThemeMode) => void;
}

const TEFILA_METADATA: Record<
  SidurTefilaId,
  {
    icon: string;
    tagline: string;
    summary: string;
    gradient: string;
    accentBorder: string;
  }
> = {
  shajarit: {
    icon: '🌅',
    tagline: 'Plegaria Matutina',
    summary: 'Birjot HaShajar, Talit, Tefilín, Pesuké deZimrá, Shemá y Amidá.',
    gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
    accentBorder: 'border-amber-400 dark:border-amber-600',
  },
  minja: {
    icon: '☀️',
    tagline: 'Plegaria Vespertina',
    summary: 'Ashrei, Amidá de 19 bendiciones, Tajanún y Alénu LeShabéaj.',
    gradient: 'from-orange-500/10 via-orange-500/5 to-transparent',
    accentBorder: 'border-orange-400 dark:border-orange-600',
  },
  arvit: {
    icon: '🌙',
    tagline: 'Plegaria Nocturna',
    summary: 'Shemá nocturno con Hashkivenu, Amidá y Kadish.',
    gradient: 'from-indigo-500/10 via-indigo-500/5 to-transparent',
    accentBorder: 'border-indigo-400 dark:border-indigo-600',
  },
  birkat_hamazon: {
    icon: '🍞',
    tagline: 'Bendición del Pan',
    summary: 'Acción de gracias preceptuada de la Torá tras el sustento.',
    gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
    accentBorder: 'border-emerald-400 dark:border-emerald-600',
  },
  oraciones_diarias: {
    icon: '🧭',
    tagline: 'Plegarias Diarias',
    summary: 'Tefilat HaDerej (del camino), Shemá al acostarse y bendiciones.',
    gradient: 'from-cyan-500/10 via-cyan-500/5 to-transparent',
    accentBorder: 'border-cyan-400 dark:border-cyan-600',
  },
};

export const SidurTefilaLauncher: React.FC<SidurTefilaLauncherProps> = ({
  tefilot,
  suggestedTefilaId,
  onSelectTefila,
  onBackToHub,
  theme,
  onThemeChange,
}) => {
  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex flex-col">
      {/* Cabecera limpia */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHub}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Volver al Centro de Módulos"
              aria-label="Volver"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xl">📜</span>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Sidur · Días de Jol
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50">
                Núsaj Marruecos
              </span>
            </div>
          </div>

          {/* Selector de Tema */}
          <div className="flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700 text-xs">
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
      </header>

      {/* Contenido principal: Selección de Tefilá */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center">
        <div className="text-center mb-8 space-y-2">
          <span className="text-xs font-serif text-amber-700 dark:text-amber-400 font-semibold tracking-wider uppercase">
            «דַּע לִפְנֵי מִי אַתָּה עוֹמֵד»
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            ¿Qué rezo deseas realizar?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Elige la tefilá para acceder directamente a su texto litúrgico tradicional con fonética masorética.
          </p>
        </div>

        {/* Tarjetas de Tefilot */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tefilot.map((t) => {
            const isSuggested = t.id === suggestedTefilaId;
            const meta = TEFILA_METADATA[t.id] || {
              icon: '📖',
              tagline: 'Plegaria',
              summary: t.description,
              gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
              accentBorder: 'border-amber-400 dark:border-amber-600',
            };

            return (
              <button
                key={t.id}
                onClick={() => onSelectTefila(t.id)}
                className={`group relative text-left p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer ${
                  isSuggested
                    ? 'border-amber-400 dark:border-amber-500/80 ring-2 ring-amber-400/30 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700'
                }`}
              >
                {/* Badge de Horario Recomendado */}
                {isSuggested && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 shadow-xs">
                    <Clock className="w-3 h-3" />
                    <span>Recomendado ahora</span>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                    {meta.icon}
                  </div>

                  <div className="flex-1 min-w-0 pr-8">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                        {meta.tagline}
                      </span>
                      <span dir="rtl" className="text-sm font-serif text-slate-400 dark:text-slate-500">
                        {t.nameHebrew}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {t.nameSpanish}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {meta.summary}
                    </p>

                    <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 opacity-80 group-hover:opacity-100">
                      <span>Comenzar rezo</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Pie discreto */}
        <div className="mt-10 text-center text-xs text-slate-500 dark:text-slate-500 flex items-center justify-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
          <span>Núsaj Kehilot Maroko · Rito Tradicional Sefardí</span>
        </div>
      </main>
    </div>
  );
};
