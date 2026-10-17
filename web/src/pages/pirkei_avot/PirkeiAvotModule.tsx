import React, { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { PIRKEI_AVOT_DATA } from '../../../../packages/shared/src/data/pirkeiAvotData';
import { AvotChapter, AvotMishna, PirkeiAvotBookmark, PirkeiAvotProgress } from '../../../../packages/shared/src/types';
import {
  getStoredPirkeiAvotBookmark,
  savePirkeiAvotBookmark,
  getStoredPirkeiAvotProgress,
  savePirkeiAvotProgress,
} from '../../lib/pirkeiAvot';
import { ThemeMode, getStoredTheme, applyTheme } from '../../lib/theme';
import {
  BookOpen,
  CheckCircle,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Sun,
  Moon,
  Laptop,
  Bookmark,
  Check,
  Award,
  Compass,
} from 'lucide-react';

interface PirkeiAvotModuleProps {
  user: any;
  onBackToHub: () => void;
  initialChapter?: number;
  initialMishna?: number;
}

export const PirkeiAvotModule: React.FC<PirkeiAvotModuleProps> = ({
  user,
  onBackToHub,
  initialChapter,
  initialMishna,
}) => {
  // Estado de temas
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme());

  // Progreso por capítulo
  const [progressMap, setProgressMap] = useState<Record<number, PirkeiAvotProgress>>(() =>
    getStoredPirkeiAvotProgress(user?.id)
  );

  // Marcador activo (dónde quedó la lectura)
  const [bookmark, setBookmark] = useState<PirkeiAvotBookmark>(() =>
    getStoredPirkeiAvotBookmark(user?.id)
  );

  // Capítulo actualmente abierto en el lector (null = vista general del catálogo)
  const [selectedChapterNumber, setSelectedChapterNumber] = useState<number | null>(() => {
    if (initialChapter && initialChapter >= 1 && initialChapter <= 6) return initialChapter;
    // Si viene de URL con hash param, e.g. #pirkei-avot?chapter=2
    if (typeof window !== 'undefined') {
      const match = window.location.hash.match(/chapter=(\d+)/);
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (num >= 1 && num <= 6) return num;
      }
    }
    return null;
  });

  // Mishná a enfocar tras carga
  const [targetMishnaNumber, setTargetMishnaNumber] = useState<number | null>(() => {
    if (initialMishna) return initialMishna;
    if (typeof window !== 'undefined') {
      const match = window.location.hash.match(/mishna=(\d+)/);
      if (match && match[1]) return parseInt(match[1], 10);
    }
    return null;
  });

  // Preferencias de lectura
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [showHebrew, setShowHebrew] = useState(true);
  const [showTranslit, setShowTranslit] = useState(true);
  const [showSpanish, setShowSpanish] = useState(true);
  const [animatingCelebration, setAnimatingCelebration] = useState(false);

  const mishnaRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // Cargar progreso desde Supabase
  useEffect(() => {
    if (user?.id) {
      supabase
        .from('pirkei_avot_progress')
        .select('*')
        .eq('user_id', user.id)
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            const map: Record<number, PirkeiAvotProgress> = { ...progressMap };
            data.forEach((item: any) => {
              map[item.chapter_number] = {
                chapter_number: item.chapter_number,
                completed_mishnayot: item.completed_mishnayot || [],
                completed_count: item.completed_count || 0,
                is_completed: item.is_completed || false,
                last_read_at: item.last_read_at,
              };
            });
            setProgressMap(map);
          }
        });

      supabase
        .from('pirkei_avot_bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setBookmark({
              chapter: data.chapter,
              mishna: data.mishna,
              updated_at: data.updated_at,
              completed: data.completed,
            });
          }
        });
    }
  }, [user?.id]);

  // Desplazamiento suave a la mishná objetivo cuando se abre un capítulo
  useEffect(() => {
    if (selectedChapterNumber !== null && targetMishnaNumber !== null) {
      const timer = setTimeout(() => {
        const el = mishnaRefs.current[targetMishnaNumber];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [selectedChapterNumber, targetMishnaNumber]);

  // Capítulo actual en vista de lectura
  const currentChapter: AvotChapter | null = useMemo(() => {
    if (selectedChapterNumber === null) return null;
    return PIRKEI_AVOT_DATA.find((c) => c.chapter === selectedChapterNumber) || null;
  }, [selectedChapterNumber]);

  // Progreso del capítulo actual
  const currentChapterProgress: PirkeiAvotProgress | undefined = useMemo(() => {
    if (!currentChapter) return undefined;
    return progressMap[currentChapter.chapter];
  }, [currentChapter, progressMap]);

  // Estadísticas globales
  const stats = useMemo(() => {
    let totalCompletedChapters = 0;
    let totalCompletedMishnayot = 0;
    let totalMishnayotInBook = 0;

    PIRKEI_AVOT_DATA.forEach((chap) => {
      totalMishnayotInBook += chap.mishnayot.length;
      const p = progressMap[chap.chapter];
      if (p) {
        if (p.is_completed) totalCompletedChapters++;
        totalCompletedMishnayot += p.completed_mishnayot.length;
      }
    });

    const overallPct = Math.round((totalCompletedMishnayot / totalMishnayotInBook) * 100);

    return {
      totalCompletedChapters,
      totalCompletedMishnayot,
      totalMishnayotInBook,
      overallPct,
    };
  }, [progressMap]);

  // Actualizar el marcador de lectura
  const handleSetBookmark = async (chapter: number, mishna: number) => {
    const newBm: PirkeiAvotBookmark = {
      chapter,
      mishna,
      updated_at: new Date().toISOString(),
      completed: false,
    };
    setBookmark(newBm);
    await savePirkeiAvotBookmark(newBm, user?.id);
  };

  // Alternar completado de una mishná individual
  const handleToggleMishnaCompleted = async (mishnaNum: number) => {
    if (!currentChapter) return;
    const currentCompleted = currentChapterProgress?.completed_mishnayot || [];
    let updatedList: number[];

    if (currentCompleted.includes(mishnaNum)) {
      updatedList = currentCompleted.filter((m) => m !== mishnaNum);
    } else {
      updatedList = [...currentCompleted, mishnaNum];
    }

    const newMap = await savePirkeiAvotProgress(currentChapter.chapter, updatedList, user?.id);
    setProgressMap(newMap);

    // Actualizar también el marcador como última mishná leída
    handleSetBookmark(currentChapter.chapter, mishnaNum);

    // Celebración si completó todas las mishnayot del capítulo
    if (updatedList.length === currentChapter.mishnayot.length) {
      setAnimatingCelebration(true);
      setTimeout(() => setAnimatingCelebration(false), 3000);
    }
  };

  // Marcar todo el capítulo como completado y avanzar
  const handleMarkEntireChapterCompleted = async () => {
    if (!currentChapter) return;
    const allNums = currentChapter.mishnayot.map((m) => m.mishna);
    const newMap = await savePirkeiAvotProgress(currentChapter.chapter, allNums, user?.id);
    setProgressMap(newMap);

    setAnimatingCelebration(true);
    setTimeout(() => setAnimatingCelebration(false), 3000);

    // Avanzar al siguiente capítulo si existe
    if (currentChapter.chapter < 6) {
      setTimeout(() => {
        const nextChap = currentChapter.chapter + 1;
        setSelectedChapterNumber(nextChap);
        setTargetMishnaNumber(1);
        handleSetBookmark(nextChap, 1);
      }, 900);
    }
  };

  // Abrir capítulo desde el catálogo
  const handleOpenChapter = (chapNum: number, mishnaNum: number = 1) => {
    setSelectedChapterNumber(chapNum);
    setTargetMishnaNumber(mishnaNum);
    handleSetBookmark(chapNum, mishnaNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Estilos de tamaño de fuente
  const fontClasses = {
    sm: { hebrew: 'text-lg', translit: 'text-xs', spanish: 'text-xs' },
    base: { hebrew: 'text-2xl', translit: 'text-sm', spanish: 'text-sm' },
    lg: { hebrew: 'text-3xl', translit: 'text-base', spanish: 'text-base' },
    xl: { hebrew: 'text-4xl', translit: 'text-lg', spanish: 'text-lg' },
  }[fontSize];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* =========================================================================
          CABECERA PRINCIPAL DEL MÓDULO
         ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-amber-200/50 dark:border-amber-900/40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (selectedChapterNumber !== null) {
                  setSelectedChapterNumber(null);
                } else {
                  onBackToHub();
                }
              }}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={selectedChapterNumber !== null ? 'Volver al índice de capítulos' : 'Volver al inicio'}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🏛️</span>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Pirkei Avot
                  <span className="text-xs font-normal text-amber-600 dark:text-amber-400 font-hebrew">
                    (פִּרְקֵי אָבוֹת)
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {selectedChapterNumber !== null
                  ? `Capítulo ${selectedChapterNumber} · ${currentChapter?.titleTransliteration || ''}`
                  : 'Ética de los Padres · 6 Capítulos con Hebreo, Fonética y Traducción'}
              </p>
            </div>
          </div>

          {/* Selector de tema */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => handleThemeChange('light')}
              className={`p-1.5 rounded-lg transition ${
                theme === 'light' ? 'bg-white text-amber-500 shadow-xs' : 'text-slate-400'
              }`}
              title="Modo Claro"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`p-1.5 rounded-lg transition ${
                theme === 'dark' ? 'bg-slate-700 text-amber-400 shadow-xs' : 'text-slate-400'
              }`}
              title="Modo Oscuro"
            >
              <Moon className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleThemeChange('system')}
              className={`p-1.5 rounded-lg transition ${
                theme === 'system' ? 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-xs' : 'text-slate-400'
              }`}
              title="Tema del Sistema"
            >
              <Laptop className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          VISTA 1: LECTOR DEL CAPÍTULO ACTIVO
         ========================================================================= */}
      {currentChapter ? (
        <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 pb-40">
          {/* Animación de felicitación al completar */}
          {animatingCelebration && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-sm px-5 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
              <Award className="w-5 h-5 text-amber-200" />
              <span>¡Completaste este capítulo de Pirkei Avot!</span>
            </div>
          )}

          {/* Barra de herramientas y resumen del capítulo */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 mb-6 border border-amber-200/70 dark:border-amber-900/50 shadow-sm relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/40 dark:border-amber-700/40">
                  Capítulo {currentChapter.chapter} de 6
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {currentChapter.mishnayot.length} Mishnayot
                </span>
                {currentChapterProgress?.is_completed && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Capítulo completado
                  </span>
                )}
              </div>

              {/* Botón para volver al catálogo */}
              <button
                onClick={() => setSelectedChapterNumber(null)}
                className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
              >
                ← Ver todos los capítulos
              </button>
            </div>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
              {currentChapter.titleSpanish}
            </h2>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
              <span className="font-hebrew text-lg font-bold text-amber-700 dark:text-amber-300">
                {currentChapter.titleHebrew}
              </span>
              <span>•</span>
              <span className="italic">{currentChapter.titleTransliteration}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              {currentChapter.description}
            </p>

            {/* Configuración de lectura (Idiomas y tamaño de letra) */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
                <button
                  onClick={() => setShowHebrew(!showHebrew)}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    showHebrew
                      ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 shadow-xs font-bold'
                      : 'text-slate-400'
                  }`}
                >
                  עִבְרִית (Hebreo)
                </button>
                <button
                  onClick={() => setShowTranslit(!showTranslit)}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    showTranslit
                      ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 shadow-xs font-bold'
                      : 'text-slate-400'
                  }`}
                >
                  Fonética
                </button>
                <button
                  onClick={() => setShowSpanish(!showSpanish)}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    showSpanish
                      ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 shadow-xs font-bold'
                      : 'text-slate-400'
                  }`}
                >
                  Español
                </button>
              </div>

              {/* Selector de tamaño de letra */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {(['sm', 'base', 'lg', 'xl'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setFontSize(sz)}
                    className={`px-2 py-0.5 text-xs uppercase font-bold rounded-lg transition ${
                      fontSize === sz
                        ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs'
                        : 'text-slate-400'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* =========================================================================
              LISTADO DE MISHNAYOT CON CAPAS DE TRADUCCIÓN
             ========================================================================= */}
          <div className="space-y-5">
            {currentChapter.mishnayot.map((m) => {
              const isCompleted = (currentChapterProgress?.completed_mishnayot || []).includes(m.mishna);
              const isCurrentBookmark = bookmark.chapter === currentChapter.chapter && bookmark.mishna === m.mishna;

              return (
                <div
                  key={m.mishna}
                  ref={(el) => {
                    mishnaRefs.current[m.mishna] = el;
                  }}
                  id={`mishna-${m.mishna}`}
                  className={`bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border transition-all duration-200 relative ${
                    isCurrentBookmark
                      ? 'border-amber-400 dark:border-amber-500 shadow-md ring-2 ring-amber-400/20'
                      : 'border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-300 dark:hover:border-amber-800'
                  }`}
                >
                  {/* Encabezado de la Mishná */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-200 font-bold text-xs flex items-center justify-center">
                        {m.mishna}
                      </span>
                      {m.sage && (
                        <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                          {m.sage}
                        </span>
                      )}
                      {isCurrentBookmark && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white flex items-center gap-1 shadow-xs">
                          <Bookmark className="w-3 h-3 fill-white" /> Tu punto de lectura
                        </span>
                      )}
                    </div>

                    {/* Botones de acción: Fijar marcador y Marcar como leída */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSetBookmark(currentChapter.chapter, m.mishna)}
                        className={`p-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                          isCurrentBookmark
                            ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200'
                            : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800'
                        }`}
                        title="Marcar aquí como mi última lectura para el mediodía/tarde"
                      >
                        <Bookmark className={`w-4 h-4 ${isCurrentBookmark ? 'fill-amber-600' : ''}`} />
                        <span className="hidden sm:inline">Guardar punto</span>
                      </button>

                      <button
                        onClick={() => handleToggleMishnaCompleted(m.mishna)}
                        className={`p-1.5 px-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                          isCompleted
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-emerald-600'
                        }`}
                        title={isCompleted ? 'Desmarcar' : 'Marcar como leída'}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>{isCompleted ? 'Leída' : 'Marcar'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Resumen o enseñanza clave */}
                  {m.keyTeaching && (
                    <div className="text-xs font-medium text-amber-800/80 dark:text-amber-300/80 mb-3 bg-amber-50/60 dark:bg-amber-950/30 px-3 py-1.5 rounded-xl border border-amber-200/50 dark:border-amber-900/40">
                      💡 <strong>Principio ético:</strong> {m.keyTeaching}
                    </div>
                  )}

                  {/* Capa 1: Hebreo vocalizado */}
                  {showHebrew && (
                    <div
                      dir="rtl"
                      className={`font-hebrew ${fontClasses.hebrew} font-bold text-slate-900 dark:text-slate-100 leading-relaxed tracking-wide mb-3`}
                    >
                      {m.hebrew}
                    </div>
                  )}

                  {/* Capa 2: Fonética y Transliteración */}
                  {showTranslit && (
                    <div
                      className={`${fontClasses.translit} italic text-amber-800 dark:text-amber-300/90 leading-relaxed mb-3`}
                    >
                      {m.transliteration}
                    </div>
                  )}

                  {/* Capa 3: Traducción en Español */}
                  {showSpanish && (
                    <div
                      className={`${fontClasses.spanish} text-slate-700 dark:text-slate-300 leading-relaxed font-normal`}
                    >
                      {m.spanish}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Navegación y Finalización de Capítulo */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => {
                if (currentChapter.chapter > 1) {
                  handleOpenChapter(currentChapter.chapter - 1, 1);
                }
              }}
              disabled={currentChapter.chapter <= 1}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Capítulo Anterior</span>
            </button>

            <button
              onClick={handleMarkEntireChapterCompleted}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Marcar Capítulo {currentChapter.chapter} Completado</span>
            </button>

            <button
              onClick={() => {
                if (currentChapter.chapter < 6) {
                  handleOpenChapter(currentChapter.chapter + 1, 1);
                }
              }}
              disabled={currentChapter.chapter >= 6}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <span>Siguiente Capítulo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </main>
      ) : (
        /* =========================================================================
            VISTA 2: ÍNDICE GENERAL / CATÁLOGO DE LOS 6 CAPÍTULOS
           ========================================================================= */
        <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 pb-28">
          {/* Banner Hero de Pirkei Avot */}
          <div className="relative rounded-3xl p-6 sm:p-8 mb-6 overflow-hidden bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white shadow-xl">
            <div className="relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-1.5 bg-amber-400/25 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-100 mb-3 border border-amber-300/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mishná · Séder Nezikín</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
                Tratado de los Padres
              </h2>
              <p className="text-xs sm:text-sm text-amber-100 leading-relaxed mb-4">
                La joya ética de la sabiduría tradicional judía. Máximas, enseñanzas sobre el carácter, la humildad, el estudio y la justicia transmitidas de generación en generación.
              </p>

              {/* Botón de acceso rápido al marcador guardado */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleOpenChapter(bookmark.chapter, bookmark.mishna)}
                  className="bg-white text-amber-700 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-md hover:bg-amber-50 transition flex items-center gap-2"
                >
                  <Bookmark className="w-4 h-4 fill-amber-700" />
                  <span>Continuar donde quedé (Cap. {bookmark.chapter}, Mishná {bookmark.mishna})</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Ilustración de fondo sutil */}
            <div className="absolute right-6 -bottom-6 text-9xl opacity-15 select-none pointer-events-none font-hebrew">
              אָבוֹת
            </div>
          </div>

          {/* Tarjeta de métricas globales */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-0.5">
                Mishnayot Leídas
              </span>
              <div className="text-xl font-black text-slate-900 dark:text-white">
                {stats.totalCompletedMishnayot} <span className="text-xs font-normal text-slate-400">/ {stats.totalMishnayotInBook}</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-0.5">
                Capítulos Completados
              </span>
              <div className="text-xl font-black text-amber-600 dark:text-amber-400">
                {stats.totalCompletedChapters} <span className="text-xs font-normal text-slate-400">/ 6</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-0.5">
                Progreso General
              </span>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                {stats.overallPct}%
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-0.5">
                Punto de Lectura
              </span>
              <div className="text-sm font-bold text-amber-700 dark:text-amber-300 mt-1 flex items-center gap-1">
                <Compass className="w-4 h-4" /> Cap. {bookmark.chapter}:{bookmark.mishna}
              </div>
            </div>
          </div>

          {/* Grilla de los 6 Capítulos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PIRKEI_AVOT_DATA.map((chap) => {
              const p = progressMap[chap.chapter];
              const completedCount = p?.completed_mishnayot.length || 0;
              const isCompleted = p?.is_completed || false;
              const isBookmarkHere = bookmark.chapter === chap.chapter;
              const pct = Math.round((completedCount / chap.mishnayot.length) * 100);

              return (
                <div
                  key={chap.chapter}
                  onClick={() => handleOpenChapter(chap.chapter, isBookmarkHere ? bookmark.mishna : 1)}
                  className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border transition-all duration-150 cursor-pointer flex flex-col justify-between hover:shadow-md group relative overflow-hidden ${
                    isBookmarkHere
                      ? 'border-amber-400 dark:border-amber-600 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-800'
                  }`}
                >
                  {isBookmarkHere && (
                    <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1 shadow-xs">
                      <Bookmark className="w-3 h-3 fill-white" /> Aquí quedaste
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                        Capítulo {chap.chapter}
                      </span>
                      <span className="font-hebrew text-sm font-bold text-slate-500 dark:text-slate-400">
                        {chap.titleHebrew}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition mb-1">
                      {chap.titleSpanish}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                      {chap.description}
                    </p>
                  </div>

                  {/* Barra de progreso del capítulo */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-400 font-medium">
                        {completedCount} de {chap.mishnayot.length} leídas
                      </span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">
                        {pct}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}
    </div>
  );
};
