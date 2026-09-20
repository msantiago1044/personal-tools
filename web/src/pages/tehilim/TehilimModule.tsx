import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { TEHILIM_PSALMS } from '../../../../packages/shared/src/data/tehilimData';
import { Psalm, TehilimProgress } from '../../../../packages/shared/src/types';
import { ThemeMode, getStoredTheme, applyTheme } from '../../lib/theme';
import {
  BookOpen,
  CheckCircle,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Search,
  RotateCcw,
  Sparkles,
  Sun,
  Moon,
  Laptop,
  Flame,
  Award,
  Filter,
  Eye,
  EyeOff,
  Type,
  Bookmark
} from 'lucide-react';

interface TehilimModuleProps {
  user: any;
  onBackToHub: () => void;
}

type FilterStatus = 'all' | 'unread' | 'completed';
type BookFilter = 'all' | 1 | 2 | 3 | 4 | 5 | 'tikkun';

export const TehilimModule: React.FC<TehilimModuleProps> = ({ user, onBackToHub }) => {
  // Estado de temas
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme());

  // Progreso por salmo: Map de psalm_number => TehilimProgress
  const [progressMap, setProgressMap] = useState<Record<number, TehilimProgress>>({});
  const [loadingProgress, setLoadingProgress] = useState(true);

  // Filtros y búsqueda
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [bookFilter, setBookFilter] = useState<BookFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Salmo actualmente abierto en el lector (null = vista de cuadrícula)
  const [selectedPsalmNumber, setSelectedPsalmNumber] = useState<number | null>(null);

  // Preferencias de lectura
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [showHebrew, setShowHebrew] = useState(true);
  const [showTranslit, setShowTranslit] = useState(true);
  const [showSpanish, setShowSpanish] = useState(true);
  const [animatingSuccess, setAnimatingSuccess] = useState(false);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // Cargar progreso desde LocalStorage y Supabase
  useEffect(() => {
    const localKey = `tehilim_progress_${user?.id || 'guest'}`;
    const cached = localStorage.getItem(localKey);
    let initialMap: Record<number, TehilimProgress> = {};

    if (cached) {
      try {
        initialMap = JSON.parse(cached);
        setProgressMap(initialMap);
      } catch (e) {
        console.error('Error parseando progreso local:', e);
      }
    }

    // Sincronizar con Supabase si hay usuario
    if (user?.id) {
      supabase
        .from('tehilim_progress')
        .select('*')
        .eq('user_id', user.id)
        .then(({ data, error }) => {
          if (!error && data) {
            const remoteMap: Record<number, TehilimProgress> = { ...initialMap };
            data.forEach((row: any) => {
              remoteMap[row.psalm_number] = {
                psalm_number: row.psalm_number,
                completed_count: row.completed_count,
                is_completed: row.is_completed,
                last_read_at: row.last_read_at,
                created_at: row.created_at,
              };
            });
            setProgressMap(remoteMap);
            localStorage.setItem(localKey, JSON.stringify(remoteMap));
          }
          setLoadingProgress(false);
        });
    } else {
      setLoadingProgress(false);
    }
  }, [user?.id]);

  // Guardar progreso de un salmo (Marcar como completado)
  const markPsalmCompleted = async (psalmNum: number) => {
    const current = progressMap[psalmNum] || {
      psalm_number: psalmNum,
      completed_count: 0,
      is_completed: false,
    };

    const newCount = current.completed_count + 1;
    const now = new Date().toISOString();

    const updated: TehilimProgress = {
      psalm_number: psalmNum,
      completed_count: newCount,
      is_completed: true,
      last_read_at: now,
    };

    const newMap = {
      ...progressMap,
      [psalmNum]: updated,
    };

    setProgressMap(newMap);
    const localKey = `tehilim_progress_${user?.id || 'guest'}`;
    localStorage.setItem(localKey, JSON.stringify(newMap));

    // Animación visual de celebración
    setAnimatingSuccess(true);
    setTimeout(() => setAnimatingSuccess(false), 1200);

    // Persistir en Supabase
    if (user?.id) {
      try {
        await supabase.from('tehilim_progress').upsert({
          user_id: user.id,
          psalm_number: psalmNum,
          completed_count: newCount,
          is_completed: true,
          last_read_at: now,
        });
      } catch (err) {
        console.error('Error sincronizando con Supabase:', err);
      }
    }
  };

  // Reiniciar lectura individual de un salmo a no leído (opcional)
  const resetPsalmReading = async (psalmNum: number) => {
    const current = progressMap[psalmNum];
    if (!current) return;

    const updated: TehilimProgress = {
      ...current,
      is_completed: false,
    };

    const newMap = { ...progressMap, [psalmNum]: updated };
    setProgressMap(newMap);
    const localKey = `tehilim_progress_${user?.id || 'guest'}`;
    localStorage.setItem(localKey, JSON.stringify(newMap));

    if (user?.id) {
      await supabase.from('tehilim_progress').upsert({
        user_id: user.id,
        psalm_number: psalmNum,
        completed_count: current.completed_count,
        is_completed: false,
      });
    }
  };

  // Estadísticas globales
  const stats = useMemo(() => {
    let completedCount = 0;
    let totalReadings = 0;

    for (let i = 1; i <= 150; i++) {
      const p = progressMap[i];
      if (p && p.completed_count > 0) {
        completedCount++;
        totalReadings += p.completed_count;
      }
    }

    const percentage = Math.round((completedCount / 150) * 100);
    return {
      completedCount,
      unreadCount: 150 - completedCount,
      percentage,
      totalReadings,
    };
  }, [progressMap]);

  // Filtrado de Salmos para la lista
  const filteredPsalms = useMemo(() => {
    return TEHILIM_PSALMS.filter((psalm) => {
      const p = progressMap[psalm.number];
      const isRead = !!(p && p.completed_count > 0);

      // Filtro de estado
      if (statusFilter === 'unread' && isRead) return false;
      if (statusFilter === 'completed' && !isRead) return false;

      // Filtro de libro / categoría
      if (bookFilter === 'tikkun') {
        const tikkunNums = [16, 32, 41, 42, 59, 77, 90, 105, 137, 150];
        if (!tikkunNums.includes(psalm.number)) return false;
      } else if (bookFilter !== 'all') {
        if (psalm.book !== bookFilter) return false;
      }

      // Filtro de texto de búsqueda
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const numMatch = psalm.number.toString() === q;
        const titleMatch = psalm.titleSpanish.toLowerCase().includes(q) ||
          psalm.titleTransliteration.toLowerCase().includes(q) ||
          psalm.titleHebrew.includes(q);
        const verseMatch = psalm.verses.some(v =>
          v.spanish.toLowerCase().includes(q) ||
          v.transliteration.toLowerCase().includes(q)
        );
        return numMatch || titleMatch || verseMatch;
      }

      return true;
    });
  }, [statusFilter, bookFilter, searchQuery, progressMap]);

  // Salmo actual
  const currentPsalm = useMemo(() => {
    if (selectedPsalmNumber === null) return null;
    return TEHILIM_PSALMS.find((p) => p.number === selectedPsalmNumber) || null;
  }, [selectedPsalmNumber]);

  const currentProgress = selectedPsalmNumber ? progressMap[selectedPsalmNumber] : null;

  // Tamaño de texto en versículos
  const fontClasses = {
    sm: { heb: 'text-lg', tr: 'text-xs', es: 'text-xs' },
    base: { heb: 'text-2xl', tr: 'text-sm', es: 'text-sm' },
    lg: { heb: 'text-3xl', tr: 'text-base', es: 'text-base' },
    xl: { heb: 'text-4xl', tr: 'text-lg', es: 'text-lg' },
  }[fontSize];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Barra de Navegación Superior */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (selectedPsalmNumber !== null) {
                setSelectedPsalmNumber(null);
              } else {
                onBackToHub();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{selectedPsalmNumber !== null ? 'Volver al listado' : 'Launcher Hub'}</span>
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <div>
              <h1 className="text-base sm:text-lg font-bold leading-tight text-slate-900 dark:text-white flex items-center gap-2">
                <span>Tehilim (150 Salmos)</span>
                <span className="text-[11px] font-medium bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/60 hidden md:inline-block">
                  Hebreo • Fonética • Español
                </span>
              </h1>
            </div>
          </div>
        </div>

        {/* Controles de cabecera: tema y métricas rápidas */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-xl text-xs font-medium text-emerald-800 dark:text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{stats.completedCount}/150 leídos ({stats.percentage}%)</span>
          </div>

          {/* Selector de tema */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => handleThemeChange('light')}
              className={`p-1.5 rounded-lg text-xs transition ${
                theme === 'light' ? 'bg-white dark:bg-slate-700 text-amber-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`p-1.5 rounded-lg text-xs transition ${
                theme === 'dark' ? 'bg-white dark:bg-slate-700 text-blue-400 shadow-sm' : 'text-slate-500'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleThemeChange('system')}
              className={`p-1.5 rounded-lg text-xs transition ${
                theme === 'system' ? 'bg-white dark:bg-slate-700 text-emerald-500 shadow-sm' : 'text-slate-500'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          VISTA 1: LECTOR DEL SALMO ACTIVO
         ========================================================================= */}
      {currentPsalm ? (
        <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto p-4 sm:p-6 pb-28">
          {/* Barra de herramientas del lector */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 mb-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-lg">
                  Libro {currentPsalm.book}
                </span>
                {currentPsalm.category && (
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-lg">
                    {currentPsalm.category}
                  </span>
                )}
                {currentProgress && currentProgress.completed_count > 0 ? (
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-lg flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Completado {currentProgress.completed_count} {currentProgress.completed_count === 1 ? 'vez' : 'veces'}
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-lg flex items-center gap-1">
                    <Clock className="w-3 h-3" /> No leído
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Salmo {currentPsalm.number} — {currentPsalm.titleSpanish}
              </h2>
              <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                <span className="font-hebrew text-base text-slate-700 dark:text-slate-300 font-bold">{currentPsalm.titleHebrew}</span>
                <span>•</span>
                <span className="italic">{currentPsalm.titleTransliteration}</span>
              </div>
            </div>

            {/* Opciones de visualización (Idiomas y tamaño) */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
                <button
                  onClick={() => setShowHebrew(!showHebrew)}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    showHebrew ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold' : 'text-slate-400'
                  }`}
                >
                  עִבְרִית
                </button>
                <button
                  onClick={() => setShowTranslit(!showTranslit)}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    showTranslit ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold' : 'text-slate-400'
                  }`}
                >
                  Fonética
                </button>
                <button
                  onClick={() => setShowSpanish(!showSpanish)}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    showSpanish ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold' : 'text-slate-400'
                  }`}
                >
                  Español
                </button>
              </div>

              {/* Ajuste de tamaño de letra */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {(['sm', 'base', 'lg', 'xl'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setFontSize(sz)}
                    className={`px-2 py-0.5 text-xs uppercase font-bold rounded-lg transition ${
                      fontSize === sz ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-400'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Versículos Interlineales */}
          <div className="space-y-4">
            {currentPsalm.verses.map((verse) => (
              <div
                key={verse.verse}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/40 transition group"
              >
                {/* Número de versículo */}
                <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                    Versículo {verse.verse}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {currentPsalm.number}:{verse.verse}
                  </span>
                </div>

                {/* Texto Hebreo (RTL) */}
                {showHebrew && (
                  <div
                    dir="rtl"
                    className={`font-serif text-right text-slate-900 dark:text-amber-100 leading-relaxed tracking-wide mb-3 ${fontClasses.heb}`}
                    style={{ fontFamily: "'SBL Hebrew', 'Taamey Frank CLM', 'Times New Roman', serif" }}
                  >
                    {verse.hebrew}
                  </div>
                )}

                {/* Transliteración Fonética */}
                {showTranslit && (
                  <div className={`text-purple-700 dark:text-purple-300 font-sans leading-relaxed tracking-wide italic mb-2 ${fontClasses.tr}`}>
                    {verse.transliteration}
                  </div>
                )}

                {/* Traducción al Español */}
                {showSpanish && (
                  <div className={`text-slate-700 dark:text-slate-300 leading-relaxed ${fontClasses.es}`}>
                    {verse.spanish}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* BARRA INFERIOR PERSISTENTE PARA MARCAR COMPLETADO Y NAVEGACIÓN */}
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3.5 shadow-2xl">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
              {/* Botón Salmo Anterior */}
              <button
                disabled={currentPsalm.number <= 1}
                onClick={() => {
                  setSelectedPsalmNumber(currentPsalm.number - 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  currentPsalm.number > 1
                    ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer'
                    : 'bg-slate-100/50 dark:bg-slate-800/50 text-slate-400 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Anterior (Salmo {currentPsalm.number - 1})</span>
                <span className="sm:hidden">Ant.</span>
              </button>

              {/* BOTÓN PRINCIPAL: MARCAR COMO COMPLETADO */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => markPsalmCompleted(currentPsalm.number)}
                  className={`relative flex items-center gap-2.5 px-5 sm:px-7 py-3 rounded-2xl font-bold text-sm text-white transition-all transform active:scale-95 shadow-lg ${
                    animatingSuccess
                      ? 'bg-emerald-600 scale-105 shadow-emerald-500/40 ring-4 ring-emerald-400/30'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/25'
                  }`}
                >
                  <CheckCircle2 className={`w-5 h-5 ${animatingSuccess ? 'animate-bounce' : ''}`} />
                  <span>
                    {animatingSuccess
                      ? '¡Completado con Éxito! 🎉'
                      : currentProgress && currentProgress.completed_count > 0
                      ? `Leído (+1) • Total: ${currentProgress.completed_count}`
                      : 'Marcar como Completado'}
                  </span>
                </button>

                {/* Contador de lecturas */}
                {currentProgress && currentProgress.completed_count > 0 && (
                  <div className="hidden md:flex flex-col text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Veces leído</span>
                    <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                      {currentProgress.completed_count} {currentProgress.completed_count === 1 ? 'vez' : 'veces'}
                    </span>
                  </div>
                )}
              </div>

              {/* Botón Salmo Siguiente */}
              <button
                disabled={currentPsalm.number >= 150}
                onClick={() => {
                  setSelectedPsalmNumber(currentPsalm.number + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  currentPsalm.number < 150
                    ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer'
                    : 'bg-slate-100/50 dark:bg-slate-800/50 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span className="hidden sm:inline">Siguiente (Salmo {currentPsalm.number + 1})</span>
                <span className="sm:hidden">Sig.</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================================
            VISTA 2: LISTADO / CATÁLOGO DE LOS 150 SALMOS CON FILTROS Y ESTADÍSTICAS
           ========================================================================= */
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8">
          {/* Tarjeta Banner de Resumen y Progreso */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 text-white p-6 sm:p-8 mb-8 shadow-xl shadow-emerald-900/10">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                    Lectura Diaria de Tehilim
                  </span>
                  <span className="text-xs font-semibold text-emerald-200">150 Capítulos</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Tu progreso en el Libro de los Salmos
                </h2>
                <p className="text-emerald-100 text-sm mt-1 max-w-xl">
                  Lee cada salmo en hebreo con su fonética y significado en español. Marca cada lectura para registrar tus vueltas completadas.
                </p>
              </div>

              {/* Métricas destacadas */}
              <div className="flex items-center gap-4 bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <div className="text-center px-3 border-r border-white/10">
                  <div className="text-2xl font-black">{stats.completedCount}</div>
                  <div className="text-[10px] uppercase font-medium text-emerald-200">Leídos</div>
                </div>
                <div className="text-center px-3 border-r border-white/10">
                  <div className="text-2xl font-black">{stats.unreadCount}</div>
                  <div className="text-[10px] uppercase font-medium text-amber-200">No leídos</div>
                </div>
                <div className="text-center px-3">
                  <div className="text-2xl font-black">{stats.totalReadings}</div>
                  <div className="text-[10px] uppercase font-medium text-cyan-200">Lecturas tot.</div>
                </div>
              </div>
            </div>

            {/* Barra de progreso lineal */}
            <div className="mt-6 pt-4 border-t border-white/15">
              <div className="flex justify-between text-xs font-semibold mb-1.5 text-emerald-100">
                <span>Avance de la vuelta actual: {stats.completedCount} de 150</span>
                <span>{stats.percentage}%</span>
              </div>
              <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-emerald-300 to-cyan-300 rounded-full transition-all duration-500"
                  style={{ width: `${stats.percentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Barra de Filtros y Búsqueda */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
            {/* Filtros de lectura: Todos / No leídos / Completados */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  statusFilter === 'all'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Todos (150)
              </button>
              <button
                onClick={() => setStatusFilter('unread')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  statusFilter === 'unread'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>No leídos ({stats.unreadCount})</span>
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  statusFilter === 'completed'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Completados ({stats.completedCount})</span>
              </button>
            </div>

            {/* Buscador rápido */}
            <div className="relative flex-1 md:max-w-xs">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por número o palabra..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white shadow-xs"
              />
            </div>
          </div>

          {/* Sub-filtros por Libro de Tehilim (1 al 5) y Tikún Haklalí */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
            <button
              onClick={() => setBookFilter('all')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                bookFilter === 'all'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              Todos los Libros
            </button>
            <button
              onClick={() => setBookFilter(1)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                bookFilter === 1
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              Libro 1 (1-41)
            </button>
            <button
              onClick={() => setBookFilter(2)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                bookFilter === 2
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              Libro 2 (42-72)
            </button>
            <button
              onClick={() => setBookFilter(3)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                bookFilter === 3
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              Libro 3 (73-89)
            </button>
            <button
              onClick={() => setBookFilter(4)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                bookFilter === 4
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              Libro 4 (90-106)
            </button>
            <button
              onClick={() => setBookFilter(5)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                bookFilter === 5
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              Libro 5 (107-150)
            </button>
            <button
              onClick={() => setBookFilter('tikkun')}
              className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                bookFilter === 'tikkun'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tikún Haklalí (10 Salmos)</span>
            </button>
          </div>

          {/* Cuadrícula de Salmos */}
          {filteredPsalms.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
              <p className="text-slate-400 text-sm">No se encontraron salmos con los filtros actuales.</p>
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setBookFilter('all');
                  setSearchQuery('');
                }}
                className="mt-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredPsalms.map((psalm) => {
                const prog = progressMap[psalm.number];
                const isRead = !!(prog && prog.completed_count > 0);

                return (
                  <div
                    key={psalm.number}
                    onClick={() => {
                      setSelectedPsalmNumber(psalm.number);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                      isRead
                        ? 'bg-white dark:bg-slate-900 border-emerald-500/30 hover:border-emerald-500 hover:shadow-md hover:shadow-emerald-500/5'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-400 hover:shadow-md'
                    }`}
                  >
                    <div>
                      {/* Cabecera de la tarjeta: Número y estado */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 group-hover:scale-105 transition">
                          {psalm.number}
                        </span>

                        {isRead ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            <span>{prog.completed_count} {prog.completed_count === 1 ? 'lectura' : 'lecturas'}</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/40">
                            <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                            <span>No leído</span>
                          </span>
                        )}
                      </div>

                      {/* Títulos */}
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                        {psalm.titleSpanish}
                      </h3>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-serif line-clamp-1 mt-0.5">
                        {psalm.titleHebrew}
                      </div>
                      <div className="text-[11px] text-purple-600 dark:text-purple-400 italic line-clamp-1 mt-0.5">
                        {psalm.titleTransliteration}
                      </div>
                    </div>

                    {/* Pie de tarjeta */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{psalm.verses.length} versículos</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                        Leer ➔
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      )}
    </div>
  );
};
