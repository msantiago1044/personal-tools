import React, { useState, useEffect, useMemo } from 'react';
import {
  SleepRecord,
  SLEEP_QUALITY_CONFIG,
  fetchSleepRecords,
  saveSleepRecord,
  deleteSleepRecord,
  formatSleepDuration,
  getLocalDateString,
  calculateDurationMinutes,
} from '../../lib/sleep';
import { fetchEmotionRecords, EmotionRecord, EMOTIONS_CONFIG } from '../../lib/emotions';
import { ThemeMode, getStoredTheme, applyTheme } from '../../lib/theme';
import {
  ArrowLeft,
  Moon,
  Sun,
  Clock,
  Sparkles,
  Activity,
  Calendar,
  BarChart2,
  Smile,
  Plus,
  Trash2,
  TrendingUp,
  Award,
  X,
  Check,
  Laptop,
} from 'lucide-react';

interface SleepModuleProps {
  user: any;
  onBackToHub: () => void;
}

export const SleepModule: React.FC<SleepModuleProps> = ({ user, onBackToHub }) => {
  const [records, setRecords] = useState<SleepRecord[]>([]);
  const [emotions, setEmotions] = useState<EmotionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme());
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Formulario manual
  const [modalDate, setModalDate] = useState(getLocalDateString());
  const [modalBedTime, setModalBedTime] = useState('23:00');
  const [modalWakeTime, setModalWakeTime] = useState('07:00');
  const [modalQuality, setModalQuality] = useState(4);
  const [modalNotes, setModalNotes] = useState('');
  const [savingRecord, setSavingRecord] = useState(false);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [sleepData, emotionData] = await Promise.all([
        fetchSleepRecords(user.id),
        fetchEmotionRecords(user.id),
      ]);
      setRecords(sleepData);
      setEmotions(emotionData);
    } catch (err) {
      console.error('[SleepModule] Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user.id]);

  const handleDelete = async (id: string) => {
    await deleteSleepRecord(id, user.id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
    setDeleteConfirmId(null);
  };

  const handleSaveManualRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingRecord(true);
    try {
      const [bH, bM] = modalBedTime.split(':').map(Number);
      const [wH, wM] = modalWakeTime.split(':').map(Number);

      const targetDate = new Date(`${modalDate}T12:00:00`);
      const bedDate = new Date(targetDate);
      if (bH > wH || (bH === wH && bM > wM)) {
        bedDate.setDate(bedDate.getDate() - 1);
      }
      bedDate.setHours(bH, bM, 0, 0);

      const wakeDate = new Date(targetDate);
      wakeDate.setHours(wH, wM, 0, 0);

      const saved = await saveSleepRecord(user.id, {
        sleep_date: modalDate,
        start_time: bedDate.toISOString(),
        end_time: wakeDate.toISOString(),
        quality_score: modalQuality,
        notes: modalNotes,
      });

      setRecords((prev) => {
        const filtered = prev.filter((r) => r.sleep_date !== saved.sleep_date);
        return [saved, ...filtered].sort(
          (a, b) => new Date(b.sleep_date).getTime() - new Date(a.sleep_date).getTime()
        );
      });

      setShowAddModal(false);
      setModalNotes('');
    } catch (err) {
      console.error('[SleepModule] Error al guardar registro manual:', err);
    } finally {
      setSavingRecord(false);
    }
  };

  // Métricas calculadas
  const stats = useMemo(() => {
    if (records.length === 0) {
      return {
        totalNights: 0,
        avgMinutes: 0,
        avgQuality: 0,
        lastNight: null as SleepRecord | null,
        optimalNights: 0,
      };
    }

    const totalMinutes = records.reduce((acc, r) => acc + r.duration_minutes, 0);
    const totalQuality = records.reduce((acc, r) => acc + r.quality_score, 0);
    const avgMinutes = Math.round(totalMinutes / records.length);
    const avgQuality = Number((totalQuality / records.length).toFixed(1));
    const optimalNights = records.filter((r) => r.duration_minutes >= 420 && r.duration_minutes <= 540).length;

    return {
      totalNights: records.length,
      avgMinutes,
      avgQuality,
      lastNight: records[0],
      optimalNights,
    };
  }, [records]);

  // Últimos 7 días para la gráfica
  const last7DaysChart = useMemo(() => {
    const list = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = getLocalDateString(d);
      const record = records.find((r) => r.sleep_date === dateStr);
      const dayName = d.toLocaleDateString('es-ES', { weekday: 'short' });
      list.push({
        dateStr,
        dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1, 3),
        record,
        durationMinutes: record ? record.duration_minutes : 0,
        qualityScore: record ? record.quality_score : 0,
      });
    }
    return list;
  }, [records]);

  // Correlación entre sueño y estado de ánimo
  const correlationInsight = useMemo(() => {
    if (records.length === 0 || emotions.length === 0) return null;

    // Mapear emociones por fecha (YYYY-MM-DD)
    const emotionByDate = new Map<string, EmotionRecord[]>();
    emotions.forEach((e) => {
      const date = e.created_at.slice(0, 10);
      const arr = emotionByDate.get(date) || [];
      arr.push(e);
      emotionByDate.set(date, arr);
    });

    let goodSleepCount = 0;
    let goodSleepHighMoodCount = 0;

    let badSleepCount = 0;
    let badSleepLowMoodCount = 0;

    records.forEach((s) => {
      const dayEmotions = emotionByDate.get(s.sleep_date);
      if (dayEmotions && dayEmotions.length > 0) {
        const avgMoodScore = dayEmotions.reduce((acc, e) => acc + e.score, 0) / dayEmotions.length;

        // Buen descanso: >= 7h o calidad >= 4
        if (s.duration_minutes >= 420 || s.quality_score >= 4) {
          goodSleepCount++;
          if (avgMoodScore >= 3.5) goodSleepHighMoodCount++;
        } else if (s.duration_minutes < 360 || s.quality_score <= 2) {
          badSleepCount++;
          if (avgMoodScore < 3.0) badSleepLowMoodCount++;
        }
      }
    });

    if (goodSleepCount >= 2) {
      const pct = Math.round((goodSleepHighMoodCount / goodSleepCount) * 100);
      return {
        text: `Los días que duermes bien o más de 7h, tu ánimo promedio es positivo en el ${pct}% de los casos.`,
        type: 'positive',
      };
    }

    return null;
  }, [records, emotions]);

  const formatClockTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHub}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Volver al Hub"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  Sueño & Descanso
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Horarios, duración y calidad de recuperación
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Selector de tema */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => handleThemeChange('light')}
                className={`p-1.5 rounded-lg text-xs transition ${
                  theme === 'light'
                    ? 'bg-white dark:bg-slate-700 text-amber-600 shadow-xs'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Claro"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`p-1.5 rounded-lg text-xs transition ${
                  theme === 'dark'
                    ? 'bg-white dark:bg-slate-700 text-indigo-400 shadow-xs'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Oscuro"
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>

            {/* Botón nuevo registro */}
            <button
              onClick={() => {
                setModalDate(getLocalDateString());
                setShowAddModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Registrar noche</span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs">Cargando registros de descanso...</p>
          </div>
        ) : (
          <>
            {/* Tarjetas de Métricas Clave */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {/* Última Noche */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Última Noche</span>
                  <Clock className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.lastNight ? formatSleepDuration(stats.lastNight.duration_minutes) : '--'}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                  {stats.lastNight
                    ? `${formatClockTime(stats.lastNight.start_time)} → ${formatClockTime(stats.lastNight.end_time)}`
                    : 'Sin registros aún'}
                </p>
              </div>

              {/* Calidad Promedio */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Calidad (1 al 5)</span>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{stats.avgQuality > 0 ? stats.avgQuality : '--'}</span>
                  {stats.avgQuality > 0 && (
                    <span className="text-sm">
                      {SLEEP_QUALITY_CONFIG[Math.round(stats.avgQuality)]?.emoji}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {stats.avgQuality > 0
                    ? SLEEP_QUALITY_CONFIG[Math.round(stats.avgQuality)]?.label
                    : 'Aún sin promediar'}
                </p>
              </div>

              {/* Promedio de Horas */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Promedio Diario</span>
                  <Activity className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.avgMinutes > 0 ? formatSleepDuration(stats.avgMinutes) : '--'}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Meta saludable: 7h - 8h
                </p>
              </div>

              {/* Total Noches */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Total Noches</span>
                  <Calendar className="w-4 h-4 text-sky-500" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.totalNights}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {stats.optimalNights} noches en meta (7-9h)
                </p>
              </div>
            </div>

            {/* Correlación / Insight Inteligente */}
            {correlationInsight && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-emerald-500/10 to-transparent border border-indigo-200 dark:border-indigo-900/50 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-indigo-500 text-white shrink-0 mt-0.5">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Correlación con tu Estado de Ánimo
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    {correlationInsight.text}
                  </p>
                </div>
              </div>
            )}

            {/* Gráfica de los Últimos 7 Días */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-indigo-500" />
                    Tendencia de los Últimos 7 Días
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    Horas de descanso y calidad del 1 al 5
                  </p>
                </div>
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  Meta: 8h
                </span>
              </div>

              {/* Barras de la gráfica */}
              <div className="grid grid-cols-7 gap-2 pt-6 pb-2 items-end min-h-[160px]">
                {last7DaysChart.map((day) => {
                  const hours = day.durationMinutes / 60;
                  // Altura porcentual relativa a 10 horas max
                  const heightPercent = Math.min(Math.round((hours / 10) * 100), 100);
                  const qualityConfig = day.qualityScore ? SLEEP_QUALITY_CONFIG[day.qualityScore] : null;

                  return (
                    <div key={day.dateStr} className="flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 group-hover:scale-110 transition-transform">
                        {hours > 0 ? `${hours.toFixed(1)}h` : '--'}
                      </div>

                      {/* Contenedor de barra */}
                      <div className="w-full max-w-[36px] bg-slate-100 dark:bg-slate-800 rounded-xl h-28 flex items-end p-1 relative overflow-hidden">
                        {/* Línea guía de 8h (80%) */}
                        <div className="absolute top-[20%] left-0 right-0 border-b border-dashed border-slate-300 dark:border-slate-700 pointer-events-none" />

                        {hours > 0 && (
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className={`w-full rounded-lg transition-all duration-300 flex items-center justify-center ${
                              day.qualityScore >= 4
                                ? 'bg-gradient-to-t from-emerald-600 to-teal-400'
                                : day.qualityScore === 3
                                ? 'bg-gradient-to-t from-indigo-600 to-sky-400'
                                : 'bg-gradient-to-t from-amber-600 to-rose-400'
                            }`}
                            title={`${day.dateStr}: ${hours.toFixed(1)}h (${qualityConfig?.label || ''})`}
                          >
                            {day.qualityScore > 0 && (
                              <span className="text-[10px] filter drop-shadow-xs">
                                {qualityConfig?.emoji}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        {day.dayName}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Historial Detallado */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  Historial de Noches Registradas
                </h3>
                <span className="text-xs text-slate-400">{records.length} registros</span>
              </div>

              {records.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                  Aún no tienes registros de sueño. Al iniciar tu día con el chequeo de emociones se registrará automáticamente.
                </div>
              ) : (
                <div className="space-y-2">
                  {records.map((r) => {
                    const quality = SLEEP_QUALITY_CONFIG[r.quality_score];
                    const isConfirmingDelete = deleteConfirmId === r.id;

                    return (
                      <div
                        key={r.id}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4 hover:shadow-xs transition"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-11 h-11 rounded-2xl flex flex-col items-center justify-center shrink-0 border ${
                              quality ? quality.borderClass : 'border-slate-200 dark:border-slate-700'
                            } ${quality ? quality.bgLightClass : 'bg-slate-100 dark:bg-slate-800'}`}
                          >
                            <span className="text-base leading-none">{quality?.emoji || '😴'}</span>
                            <span className="text-[9px] font-bold mt-0.5">{r.quality_score}/5</span>
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900 dark:text-white">
                                {formatSleepDuration(r.duration_minutes)}
                              </span>
                              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                • {quality?.label}
                              </span>
                            </div>

                            <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                              <span>{r.sleep_date}</span> ({formatClockTime(r.start_time)} → {formatClockTime(r.end_time)})
                            </div>

                            {r.notes && (
                              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 italic">
                                "{r.notes}"
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isConfirmingDelete ? (
                            <div className="flex items-center gap-1.5 animate-in fade-in">
                              <button
                                onClick={() => handleDelete(r.id)}
                                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-600 text-white hover:bg-rose-500"
                              >
                                Sí, borrar
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-1 text-xs rounded-lg text-slate-400 hover:text-slate-200"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(r.id)}
                              className="p-2 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                              title="Eliminar registro"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Modal Manual de Añadir/Editar Noche */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Moon className="w-4 h-4" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Registrar Noche de Sueño
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveManualRecord} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Fecha de la Noche
                </label>
                <input
                  type="date"
                  value={modalDate}
                  onChange={(e) => setModalDate(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Hora dormir
                  </label>
                  <input
                    type="time"
                    value={modalBedTime}
                    onChange={(e) => setModalBedTime(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1 flex items-center gap-1">
                    <Sun className="w-3 h-3 text-amber-500" />
                    Hora despertar
                  </label>
                  <input
                    type="time"
                    value={modalWakeTime}
                    onChange={(e) => setModalWakeTime(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
              </div>

              {/* Selector Calidad 1 al 5 */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-medium text-slate-500">
                    Calidad percibida (1 al 5)
                  </span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {SLEEP_QUALITY_CONFIG[modalQuality]?.emoji} {SLEEP_QUALITY_CONFIG[modalQuality]?.label}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map((score) => {
                    const item = SLEEP_QUALITY_CONFIG[score];
                    const isSelected = modalQuality === score;
                    return (
                      <button
                        key={score}
                        type="button"
                        onClick={() => setModalQuality(score)}
                        className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20 text-indigo-700 dark:text-indigo-300 shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <span className="text-base mb-1">{item.emoji}</span>
                        <span className="text-[10px] font-bold">{score}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Notas (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Cené liviano, leí 20 min..."
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  maxLength={120}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingRecord}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
                >
                  {savingRecord ? 'Guardando...' : 'Guardar Noche'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
