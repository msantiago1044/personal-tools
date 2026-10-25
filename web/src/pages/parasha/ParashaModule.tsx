import React, { useState, useEffect } from 'react';
import {
  WeeklyParasha,
  ParashaAliyah,
  ParashaVerse,
  ParashaDailySchedule,
  ParashaProgress,
} from '../../../../packages/shared/src/types';
import { supabase } from '../../lib/supabase';
import {
  getWeeklyParasha,
  getDiasporaDailySchedule,
  getParashaProgress,
  markDailyAliyahCompletedToday,
  getAliyahStats,
  syncParashaWithCloud,
} from '../../lib/parashaService';
import { transliterateHebrewToSpanish } from '../../lib/hebrewPhonetics';
import { ThemeMode, getStoredTheme, applyTheme } from '../../lib/theme';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Laptop,
  Sparkles,
  RotateCcw,
  Calendar,
  Share2,
  Clock,
  History,
} from 'lucide-react';

interface ParashaModuleProps {
  user?: any;
  onBackToHub: () => void;
  initialAliyah?: number;
}

export const ParashaModule: React.FC<ParashaModuleProps> = ({
  user,
  onBackToHub,
  initialAliyah,
}) => {
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme());
  const [parasha, setParasha] = useState<WeeklyParasha | null>(null);
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState<ParashaDailySchedule>(() => getDiasporaDailySchedule());

  // Aliyá seleccionada: 1 a 7, o 0 para ver la parashá completa
  const [selectedAliyah, setSelectedAliyah] = useState<number>(() => {
    if (typeof initialAliyah === 'number') return initialAliyah;
    const sched = getDiasporaDailySchedule();
    return sched.targetAliyahNumber;
  });

  // Preferencias de lectura
  const [showHebrew, setShowHebrew] = useState(true);
  const [showTranslit, setShowTranslit] = useState(true);
  const [showSpanish, setShowSpanish] = useState(true);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  // Transliteración fonética con Nombres Sagrados fijados permanentemente a YHVH
  const getRenderedTransliteration = (verse: ParashaVerse): string => {
    if (!verse) return '';
    let trans = verse.transliteration;
    if (
      !trans ||
      trans.includes('yehovah') ||
      trans.includes('bmim') ||
      trans.includes('rejb') ||
      trans.includes('gadvol') ||
      trans.includes('lvot') ||
      trans.includes('itvo') ||
      trans.includes('Adonai') ||
      trans.includes('Adonái') ||
      trans.includes('HaShem')
    ) {
      trans = transliterateHebrewToSpanish(verse.hebrew, { sacredName: 'YHVH' });
    }
    return trans
      .replace(/\bVa-Adon[aá]i\b/gi, 'Ve-YHVH')
      .replace(/\bVe-HaShem\b/gi, 'Ve-YHVH')
      .replace(/\bBa-Adon[aá]i\b/gi, 'Ba-YHVH')
      .replace(/\bBa-HaShem\b/gi, 'Ba-YHVH')
      .replace(/\bLa-Adon[aá]i\b/gi, 'La-YHVH')
      .replace(/\bLa-HaShem\b/gi, 'La-YHVH')
      .replace(/\bMe-Adon[aá]i\b/gi, 'Me-YHVH')
      .replace(/\bMe-HaShem\b/gi, 'Me-YHVH')
      .replace(/\bKa-Adon[aá]i\b/gi, 'Ka-YHVH')
      .replace(/\bKa-HaShem\b/gi, 'Ka-YHVH')
      .replace(/\bAdon[aá]i\b/gi, 'YHVH')
      .replace(/\bHaShem\b/gi, 'YHVH');
  };

  // Progreso
  const [progress, setProgress] = useState<ParashaProgress>({
    parasha_id: '',
    completed_aliyot: [],
    full_parasha_completed: false,
    completed_count: 0,
    aliyot_counts: {},
    aliyot_last_read: {},
    years_history: {},
  });

  const [completedSuccessMsg, setCompletedSuccessMsg] = useState<string | null>(null);

  // Cargar datos al montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('parasha_sacred_name_mode');
    }
    let isMounted = true;
    getWeeklyParasha()
      .then((data) => {
        if (isMounted) {
          setParasha(data);
          setProgress(getParashaProgress(data.id, user?.id));
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error cargando parashá:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Sincronizar progreso remoto de Supabase (móvil + web) bidireccionalmente
  useEffect(() => {
    let isCancelled = false;

    const runSync = () => {
      syncParashaWithCloud(user?.id).then((res) => {
        if (!isCancelled && res.progress) {
          setProgress(res.progress);
        }
      });
    };

    runSync();

    const handleUpdate = () => runSync();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        runSync();
      }
    };

    window.addEventListener('parasha_progress_updated', handleUpdate);
    window.addEventListener('focus', handleUpdate);
    document.addEventListener('visibilitychange', handleVisibility);

    let channel: any = null;
    if (user?.id) {
      channel = supabase
        .channel(`parasha_realtime_${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'parasha_progress',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            runSync();
          }
        )
        .subscribe();
    }

    return () => {
      isCancelled = true;
      window.removeEventListener('parasha_progress_updated', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user?.id, parasha?.id]);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const handleMarkAsRead = async (aliyahNum: number) => {
    if (!parasha) return;
    const updated = await markDailyAliyahCompletedToday(aliyahNum, parasha.id, user?.id);
    setProgress(updated);

    const name = aliyahNum === 0 ? 'Parashá Completa' : `${aliyahNum}ª Aliyá`;
    setCompletedSuccessMsg(`¡${name} marcada como leída! Se ha registrado en tu historial.`);
    setTimeout(() => {
      setCompletedSuccessMsg(null);
    }, 4000);
  };

  // Estadísticas acumuladas y ciclo
  const totalReadings = React.useMemo(() => {
    const counts = Object.values(progress.aliyot_counts || {});
    const sum = counts.reduce((acc, c) => acc + (c || 0), 0);
    return sum + (progress.completed_count || 0);
  }, [progress]);

  const studiedYears = React.useMemo(() => {
    const years = Object.keys(progress.years_history || {}).sort((a, b) => Number(b) - Number(a));
    return years;
  }, [progress.years_history]);

  // Filtro de lectura de días de semana dentro de la porción activa
  const [weekdayFilter, setWeekdayFilter] = useState<'all' | 'weekday_all' | 'cohen' | 'levi' | 'israel'>('all');

  // Resetear el filtro de días de semana al cambiar de Aliyá
  useEffect(() => {
    setWeekdayFilter('all');
  }, [selectedAliyah]);

  const isWeekdayTorahDay = React.useMemo(() => {
    // Lunes (1), Jueves (4), o Sábado (6) por la tarde (Minjá)
    const day = schedule.dayOfWeek;
    return day === 1 || day === 4 || schedule.isShabbatAfternoon;
  }, [schedule]);

  // Versículos a mostrar según la pestaña activa
  const currentVerses: ParashaVerse[] = React.useMemo(() => {
    if (!parasha || !parasha.aliyot) return [];
    if (selectedAliyah === 0) {
      // Toda la parashá completa
      return parasha.aliyot.flatMap((al) => al.verses);
    }
    const target = parasha.aliyot.find((al) => al.aliyahNumber === selectedAliyah);
    return target ? target.verses : [];
  }, [parasha, selectedAliyah]);

  const currentAliyahHasWeekday = React.useMemo(() => {
    if (!parasha || !parasha.weekdayReading) return false;
    if (selectedAliyah === 0) return true;
    return parasha.weekdayReading.spansAliyot.includes(selectedAliyah);
  }, [parasha, selectedAliyah]);

  const displayVerses: ParashaVerse[] = React.useMemo(() => {
    if (weekdayFilter === 'all') return currentVerses;
    if (weekdayFilter === 'weekday_all') {
      return currentVerses.filter((v) => !!v.weekdayAliyah);
    }
    return currentVerses.filter((v) => v.weekdayAliyah === weekdayFilter);
  }, [currentVerses, weekdayFilter]);

  const currentAliyahInfo = React.useMemo(() => {
    if (!parasha) return null;
    if (selectedAliyah === 0) {
      return {
        nameSpanish: 'Lectura Completa de Shabat',
        nameHebrew: 'קְרִיאָה שְׁלֵמָה',
        refRange: parasha.ref,
      };
    }
    return parasha.aliyot.find((al) => al.aliyahNumber === selectedAliyah) || null;
  }, [parasha, selectedAliyah]);

  const currentAliyahStats = React.useMemo(() => {
    return getAliyahStats(progress, selectedAliyah);
  }, [progress, selectedAliyah]);

  const isCurrentAliyahDone = React.useMemo(() => {
    if (selectedAliyah === 0) return progress.full_parasha_completed;
    return progress.completed_aliyot.includes(selectedAliyah);
  }, [progress, selectedAliyah]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-500 dark:text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Cargando Parashá de la semana...</span>
        </div>
      </div>
    );
  }

  if (!parasha) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 flex flex-col items-center justify-center text-center">
        <p className="text-slate-600 dark:text-slate-300 mb-4">No se pudo cargar la Parashá.</p>
        <button
          onClick={onBackToHub}
          className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 pb-16">
      {/* Barra superior de navegación */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHub}
              className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Volver al Inicio"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/40">
                  Diáspora
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {parasha.bookSpanish}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-white mt-0.5">
                <span>Parashat {parasha.nameSpanish}</span>
                <span className="font-serif text-lg text-emerald-700 dark:text-emerald-400" dir="rtl">
                  {parasha.nameHebrew}
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Selector de Tamaño de Fuente */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2 py-1 rounded transition ${
                  fontSize === 'sm' ? 'bg-white dark:bg-slate-700 shadow-xs text-emerald-600' : 'text-slate-400'
                }`}
                title="Fuente pequeña"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('base')}
                className={`px-2 py-1 rounded transition ${
                  fontSize === 'base' ? 'bg-white dark:bg-slate-700 shadow-xs text-emerald-600' : 'text-slate-400'
                }`}
                title="Fuente normal"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-1 rounded transition ${
                  fontSize === 'lg' ? 'bg-white dark:bg-slate-700 shadow-xs text-emerald-600' : 'text-slate-400'
                }`}
                title="Fuente grande"
              >
                A+
              </button>
            </div>

            {/* Selector de Tema */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
              <button
                onClick={() => handleThemeChange('light')}
                className={`p-1.5 rounded transition ${
                  theme === 'light' ? 'bg-white dark:bg-slate-700 text-amber-600 shadow-xs' : 'text-slate-400'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`p-1.5 rounded transition ${
                  theme === 'dark' ? 'bg-white dark:bg-slate-700 text-blue-400 shadow-xs' : 'text-slate-400'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Toggles de Capas de Idioma */}
        <div className="max-w-4xl mx-auto flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800/60 pt-2.5 mt-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">Capas:</span>
            <button
              onClick={() => setShowHebrew(!showHebrew)}
              className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition ${
                showHebrew
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  : 'bg-transparent text-slate-400 border-slate-200 dark:border-slate-800'
              }`}
            >
              עב Hebreo
            </button>
            <button
              onClick={() => setShowTranslit(!showTranslit)}
              className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition ${
                showTranslit
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  : 'bg-transparent text-slate-400 border-slate-200 dark:border-slate-800'
              }`}
            >
              🔤 Fonética
            </button>

            <button
              onClick={() => setShowSpanish(!showSpanish)}
              className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition ${
                showSpanish
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  : 'bg-transparent text-slate-400 border-slate-200 dark:border-slate-800'
              }`}
            >
              ES Español
            </button>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
            {schedule.dayName}: <span className="text-emerald-600 dark:text-emerald-400">{schedule.targetAliyahName}</span>
          </div>
        </div>
      </header>

      {/* Notificación de éxito al marcar como leída */}
      {completedSuccessMsg && (
        <div className="max-w-4xl mx-auto px-4 mt-3">
          <div className="bg-emerald-500 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>{completedSuccessMsg}</span>
            </div>
            <button onClick={() => setCompletedSuccessMsg(null)} className="text-white/80 hover:text-white font-bold ml-2">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Barra de Estadísticas Multianuales de Lectura */}
      <div className="max-w-4xl mx-auto px-4 mt-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase text-slate-400">Ciclo {new Date().getFullYear()}</span>
            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
              {progress.completed_aliyot.length} / 7 Aliyot
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase text-slate-400">Lecturas Acumuladas</span>
            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1">
              <History className="w-3.5 h-3.5 text-blue-500" />
              {totalReadings} {totalReadings === 1 ? 'lectura' : 'lecturas'}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase text-slate-400">Parashá Completa</span>
            <span className="text-sm font-extrabold text-purple-600 dark:text-purple-400">
              {progress.completed_count || 0} {progress.completed_count === 1 ? 'año/vuelta' : 'años/vueltas'}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase text-slate-400">Historial de Años</span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate">
              {studiedYears.length > 0 ? studiedYears.join(', ') : 'Año actual'}
            </span>
          </div>
        </div>
      </div>

      {/* Pestañas de Aliyot con indicador de lecturas y años anteriores */}
      <div className="max-w-4xl mx-auto px-4 mt-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {parasha.aliyot.map((al) => {
            const isSelected = selectedAliyah === al.aliyahNumber;
            const isToday = schedule.targetAliyahNumber === al.aliyahNumber;
            const alStats = getAliyahStats(progress, al.aliyahNumber);
            const hasWeekday = parasha.weekdayReading?.spansAliyot.includes(al.aliyahNumber);

            return (
              <button
                key={al.aliyahNumber}
                onClick={() => setSelectedAliyah(al.aliyahNumber)}
                className={`relative px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 shrink-0 border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-400/50'
                }`}
              >
                <span>{al.aliyahNumber}ª Aliyá</span>
                {hasWeekday && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                      isSelected
                        ? 'bg-blue-300/30 text-white'
                        : 'bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300'
                    }`}
                    title="Contiene lectura de días de semana: Cohén, Leví e Israel"
                  >
                    Cohén • Leví • Israel
                  </span>
                )}
                {alStats.count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    }`}
                    title={`Leída ${alStats.count} ${alStats.count === 1 ? 'vez' : 'veces'}`}
                  >
                    x{alStats.count}
                  </span>
                )}
                {alStats.wasReadLastYear && (
                  <span
                    className="text-[9px] px-1 py-0.2 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold"
                    title={`Leída el año anterior (${new Date().getFullYear() - 1})`}
                  >
                    {new Date().getFullYear() - 1}
                  </span>
                )}
                {isToday && (
                  <span
                    className={`text-[9px] uppercase px-1 py-0.2 rounded font-bold ${
                      isSelected
                        ? 'bg-white/30 text-white'
                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                    }`}
                  >
                    Hoy
                  </span>
                )}
              </button>
            );
          })}

          {/* Opción de Lectura Completa */}
          {(() => {
            const fullStats = getAliyahStats(progress, 0);
            return (
              <button
                onClick={() => setSelectedAliyah(0)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 shrink-0 border ${
                  selectedAliyah === 0
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-400/50'
                }`}
              >
                <span>📜 Completa</span>
                {fullStats.count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      selectedAliyah === 0 ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    x{fullStats.count}
                  </span>
                )}
                {schedule.targetAliyahNumber === 0 && (
                  <span
                    className={`text-[9px] uppercase px-1 py-0.2 rounded font-bold ${
                      selectedAliyah === 0
                        ? 'bg-white/30 text-white'
                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                    }`}
                  >
                    Shabat
                  </span>
                )}
              </button>
            );
          })()}
        </div>
      </div>

      {/* Contenido de la Aliyá */}
      <main className="max-w-4xl mx-auto px-4 mt-3">
        {/* Cabecera de la porción activa con insignias de conteo e historial anual */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 mb-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {currentAliyahInfo?.nameSpanish}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-serif">
                {currentAliyahInfo?.nameHebrew}
              </span>

              {/* Insignia: Veces leída */}
              {currentAliyahStats.count > 0 ? (
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Leída {currentAliyahStats.count} {currentAliyahStats.count === 1 ? 'vez' : 'veces'}</span>
                </span>
              ) : (
                <span className="text-[11px] font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  <span>Pendiente este ciclo</span>
                </span>
              )}

              {/* Insignia: Si se leyó el año anterior */}
              {currentAliyahStats.wasReadLastYear && (
                <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <span>📅 Leída el año pasado ({new Date().getFullYear() - 1})</span>
                </span>
              )}

              {/* Insignia: Si se leyó este año */}
              {currentAliyahStats.isReadThisYear && (
                <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50 px-2 py-0.5 rounded-lg">
                  ⭐ Leída en ciclo {new Date().getFullYear()}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Rango: <span className="font-semibold text-slate-700 dark:text-slate-300">{currentAliyahInfo?.refRange}</span>
            </p>
          </div>

          <button
            onClick={() => handleMarkAsRead(selectedAliyah)}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition shadow-xs cursor-pointer ${
              currentAliyahStats.isReadToday
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {currentAliyahStats.isReadToday
                ? `✓ Leída hoy (+1) • Total: ${currentAliyahStats.count}`
                : currentAliyahStats.count > 0
                ? `Marcar leída hoy (+1) • Total: ${currentAliyahStats.count}`
                : 'Marcar como leída hoy (+1)'}
            </span>
          </button>
        </div>

        {/* Lista de Versículos */}
        <div className="space-y-4">
          {displayVerses.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500 dark:text-slate-400">
              <p className="text-sm font-medium">No hay versículos para el filtro seleccionado.</p>
              <button
                onClick={() => setWeekdayFilter('all')}
                className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition"
              >
                Mostrar todos los versículos
              </button>
            </div>
          ) : (
            displayVerses.map((verse) => (
              <React.Fragment key={verse.verseKey}>
                {/* Indicador de inicio de Cohén */}
                {verse.isWeekdayStart === 'cohen' && (weekdayFilter === 'all' || weekdayFilter === 'weekday_all' || weekdayFilter === 'cohen') && (
                  <div className="rounded-2xl bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-transparent border-l-4 border-l-blue-600 border border-blue-200 dark:border-blue-900/60 p-3.5 sm:p-4 my-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                          1ª
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                              Días de Semana • Lunes, Jueves y Shabat Minjá
                            </span>
                            <span className="text-[9px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold px-1.5 py-0.2 rounded-full">
                              1ª Aliyá
                            </span>
                          </div>
                          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                            <span>Lectura del Cohén</span>
                            <span className="font-serif text-lg text-blue-700 dark:text-blue-400" dir="rtl">
                              כֹּהֵן
                            </span>
                          </h3>
                        </div>
                      </div>
                      {parasha.weekdayReading?.cohen && (
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                          {parasha.weekdayReading.cohen.refRange}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Indicador de inicio de Leví */}
                {verse.isWeekdayStart === 'levi' && (weekdayFilter === 'all' || weekdayFilter === 'weekday_all' || weekdayFilter === 'levi') && (
                  <div className="rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent border-l-4 border-l-indigo-600 border border-indigo-200 dark:border-indigo-900/60 p-3.5 sm:p-4 my-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                          2ª
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                              Días de Semana • Lunes, Jueves y Shabat Minjá
                            </span>
                            <span className="text-[9px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold px-1.5 py-0.2 rounded-full">
                              2ª Aliyá
                            </span>
                          </div>
                          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                            <span>Lectura del Leví</span>
                            <span className="font-serif text-lg text-indigo-700 dark:text-indigo-400" dir="rtl">
                              לֵוִי
                            </span>
                          </h3>
                        </div>
                      </div>
                      {parasha.weekdayReading?.levi && (
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                          {parasha.weekdayReading.levi.refRange}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Indicador de inicio de Israel */}
                {verse.isWeekdayStart === 'israel' && (weekdayFilter === 'all' || weekdayFilter === 'weekday_all' || weekdayFilter === 'israel') && (
                  <div className="rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border-l-4 border-l-emerald-600 border border-emerald-200 dark:border-emerald-900/60 p-3.5 sm:p-4 my-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                          3ª
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                              Días de Semana • Lunes, Jueves y Shabat Minjá
                            </span>
                            <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded-full">
                              3ª Aliyá
                            </span>
                          </div>
                          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                            <span>Lectura de Israel</span>
                            <span className="font-serif text-lg text-emerald-700 dark:text-emerald-400" dir="rtl">
                              יִשְׂרָאֵל
                            </span>
                          </h3>
                        </div>
                      </div>
                      {parasha.weekdayReading?.israel && (
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                          {parasha.weekdayReading.israel.refRange}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <article
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/70 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition"
                >
                  {/* Encabezado con número de versículo y Distintivo de Días de Semana */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800/60 flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                        {verse.verseKey}
                      </span>
                      {verse.weekdayAliyah === 'cohen' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                          <span className="font-serif">כֹּהֵן</span>
                          <span>• Cohén (Semana)</span>
                        </span>
                      )}
                      {verse.weekdayAliyah === 'levi' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                          <span className="font-serif">לֵוִי</span>
                          <span>• Leví (Semana)</span>
                        </span>
                      )}
                      {verse.weekdayAliyah === 'israel' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                          <span className="font-serif">יִשְׂרָאֵל</span>
                          <span>• Israel (Semana)</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400/80 font-mono">
                      Pasuk {verse.verseNumber}
                    </span>
                  </div>

                  {/* Capa 1: Hebreo vocalizado con Niqqud */}
                  {showHebrew && (
                    <p
                      dir="rtl"
                      className={`font-serif text-slate-900 dark:text-white leading-loose mb-3 tracking-wide ${
                        fontSize === 'sm'
                          ? 'text-lg'
                          : fontSize === 'base'
                          ? 'text-xl'
                          : fontSize === 'lg'
                          ? 'text-2xl'
                          : 'text-3xl'
                      }`}
                    >
                      {verse.hebrew}
                    </p>
                  )}

                  {/* Capa 2: Transliteración Fonética */}
                  {showTranslit && verse.transliteration && (
                    <p
                      className={`text-slate-600 dark:text-slate-300 font-sans italic mb-2.5 leading-relaxed ${
                        fontSize === 'sm' ? 'text-xs' : fontSize === 'base' ? 'text-sm' : fontSize === 'lg' ? 'text-base' : 'text-lg'
                      }`}
                    >
                      {getRenderedTransliteration(verse)}
                    </p>
                  )}

                  {/* Capa 3: Traducción al Español (Nombres Sagrados preservados) */}
                  {showSpanish && verse.spanish && (
                    <p
                      className={`text-slate-800 dark:text-slate-200 leading-relaxed font-normal ${
                        fontSize === 'sm' ? 'text-xs' : fontSize === 'base' ? 'text-sm' : fontSize === 'lg' ? 'text-base' : 'text-lg'
                      }`}
                    >
                      {verse.spanish}
                    </p>
                  )}
                </article>

                {/* Marcador de Fin de Lectura de Días de Semana */}
                {verse.isWeekdayEnd && (weekdayFilter === 'all' || weekdayFilter === 'weekday_all' || weekdayFilter === 'israel') && (
                  <div className="my-5 p-3.5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-300/80 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs shadow-xs">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold">
                      <span className="text-base">🏁</span>
                      <span>Fin de la lectura de días de semana (Lunes, Jueves y Shabat Minjá)</span>
                    </div>
                    <span className="font-serif text-sm font-bold text-slate-600 dark:text-slate-400" dir="rtl">
                      סוֹף קְרִיאַת שֵׁנִי וַחֲמִישִׁי
                    </span>
                  </div>
                )}
              </React.Fragment>
            ))
          )}
        </div>

        {/* Botón final para marcar como leída y avanzar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => {
              if (selectedAliyah > 1) setSelectedAliyah(selectedAliyah - 1);
            }}
            disabled={selectedAliyah <= 1}
            className="w-full sm:w-auto flex items-center justify-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Aliyá anterior</span>
          </button>

          <button
            onClick={() => handleMarkAsRead(selectedAliyah)}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Marcar lectura como completada hoy</span>
          </button>

          <button
            onClick={() => {
              if (selectedAliyah < 7) setSelectedAliyah(selectedAliyah + 1);
            }}
            disabled={selectedAliyah >= 7}
            className="w-full sm:w-auto flex items-center justify-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 transition"
          >
            <span>Siguiente aliyá</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
};
