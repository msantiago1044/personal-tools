import React, { useState, useEffect, useMemo } from 'react';
import {
  WaterRecord,
  fetchWaterRecords,
  saveWaterRecord,
  deleteWaterRecord,
  addWaterMl,
  DEFAULT_WATER_GOAL_ML,
  ML_PER_GLASS,
} from '../../lib/water';
import { getLocalDateString } from '../../lib/sleep';
import { ThemeMode, getStoredTheme, applyTheme } from '../../lib/theme';
import {
  ArrowLeft,
  Droplet,
  Plus,
  Minus,
  Trash2,
  Calendar,
  Sparkles,
  BarChart2,
  TrendingUp,
  Award,
  Sun,
  Moon,
  Laptop,
  Check,
  RotateCcw,
} from 'lucide-react';

interface WaterModuleProps {
  user: any;
  onBackToHub: () => void;
}

export const WaterModule: React.FC<WaterModuleProps> = ({ user, onBackToHub }) => {
  const [records, setRecords] = useState<WaterRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme());
  const [todayDate] = useState<string>(getLocalDateString());
  const [customGlassesInput, setCustomGlassesInput] = useState<string>('');
  const [notesInput, setNotesInput] = useState<string>('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchWaterRecords(user.id);
      setRecords(data);
    } catch (err) {
      console.error('[WaterModule] Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user.id]);

  // Registro del día actual
  const todayRecord = useMemo(() => {
    return records.find((r) => r.record_date === todayDate) || null;
  }, [records, todayDate]);

  const todayMl = todayRecord?.milliliters || 0;
  const todayGoal = todayRecord?.goal_ml || DEFAULT_WATER_GOAL_ML;
  const progressPercent = Math.min(100, Math.round((todayMl / todayGoal) * 100));
  const todayGlasses = todayRecord?.glasses || Math.round(todayMl / ML_PER_GLASS);

  // Estadísticas globales y racha
  const stats = useMemo(() => {
    if (records.length === 0) {
      return { totalLiters: 0, avgDailyMl: 0, streakDays: 0, goalMetCount: 0 };
    }

    const totalMl = records.reduce((acc, curr) => acc + (curr.milliliters || 0), 0);
    const avgDailyMl = Math.round(totalMl / records.length);
    const goalMetCount = records.filter((r) => r.milliliters >= (r.goal_ml || DEFAULT_WATER_GOAL_ML)).length;

    // Calcular racha de días consecutivos cumpliendo la meta
    let streak = 0;
    const sorted = [...records].sort((a, b) => b.record_date.localeCompare(a.record_date));
    for (const r of sorted) {
      if (r.milliliters >= (r.goal_ml || DEFAULT_WATER_GOAL_ML)) {
        streak++;
      } else {
        break;
      }
    }

    return {
      totalLiters: (totalMl / 1000).toFixed(1),
      avgDailyMl,
      streakDays: streak,
      goalMetCount,
    };
  }, [records]);

  // Manejadores rápidos
  const handleQuickAdd = async (amountMl: number) => {
    const updated = await addWaterMl(user.id, amountMl, todayDate);
    setRecords((prev) => {
      const idx = prev.findIndex((r) => r.record_date === todayDate);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }
      return [updated, ...prev];
    });
  };

  const handleSetExactGlasses = async (numGlasses: number) => {
    const safeGlasses = Math.max(0, numGlasses);
    const updated = await saveWaterRecord(user.id, {
      record_date: todayDate,
      glasses: safeGlasses,
      milliliters: safeGlasses * ML_PER_GLASS,
      notes: notesInput || todayRecord?.notes,
    });
    setRecords((prev) => {
      const idx = prev.findIndex((r) => r.record_date === todayDate);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }
      return [updated, ...prev];
    });
    setCustomGlassesInput('');
  };

  const handleDelete = async (id: string) => {
    await deleteWaterRecord(id, user.id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
    setDeleteConfirmId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 md:p-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Cabecera y Navegación */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHub}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
              title="Volver al menú principal"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl select-none">💧</span>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Agua & Hidratación
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-sky-100 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  Bienestar
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Monitorea tu ingesta diaria, alcanza tu meta y cultiva un hábito vital.
              </p>
            </div>
          </div>

          {/* Selector de tema */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/60 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <button
              onClick={() => handleThemeChange('light')}
              className={`p-1.5 rounded-lg transition ${theme === 'light' ? 'bg-white dark:bg-slate-800 text-amber-500 shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
              title="Tema claro"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`p-1.5 rounded-lg transition ${theme === 'dark' ? 'bg-white dark:bg-slate-800 text-sky-400 shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
              title="Tema oscuro"
            >
              <Moon className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleThemeChange('system')}
              className={`p-1.5 rounded-lg transition ${theme === 'system' ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
              title="Tema del sistema"
            >
              <Laptop className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tarjeta Principal de Hidratación de Hoy */}
        <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-sky-500/10 via-sky-400/5 to-transparent border border-sky-200 dark:border-sky-900/40 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Progreso de hoy ({todayDate})</span>
              </div>
              <div className="flex items-baseline justify-center md:justify-start gap-2">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                  {todayMl}
                </span>
                <span className="text-base font-semibold text-slate-400">
                  / {todayGoal} ml
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Has bebido aproximadamente <strong className="text-sky-600 dark:text-sky-400">{todayGlasses} vasos</strong> de 250ml.
                {progressPercent >= 100 && ' 🎉 ¡Meta diaria alcanzada!'}
              </p>
            </div>

            {/* Círculo / Barra de progreso */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-slate-200 dark:stroke-slate-800 fill-none"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-sky-500 fill-none transition-all duration-500 ease-out"
                    strokeWidth="10"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * progressPercent) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {progressPercent}%
                  </span>
                  <span className="text-[10px] text-slate-400">meta</span>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de Registro Rápido */}
          <div className="mt-6 pt-5 border-t border-sky-100 dark:border-sky-900/30 flex flex-wrap items-center justify-center md:justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickAdd(250)}
                className="px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs shadow-xs transition flex items-center gap-1.5 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+1 Vaso (250ml)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickAdd(500)}
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs shadow-xs transition flex items-center gap-1.5 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+1 Botella (500ml)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickAdd(750)}
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs shadow-xs transition flex items-center gap-1.5 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+1 Termo (750ml)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickAdd(-250)}
                disabled={todayMl <= 0}
                className="px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs transition disabled:opacity-40 flex items-center gap-1"
                title="Deshacer último vaso"
              >
                <RotateCcw className="w-3 h-3" />
                <span>-1 vaso</span>
              </button>
            </div>

            {/* Ajuste manual de vasos */}
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="0"
                max="30"
                placeholder="Vasos"
                value={customGlassesInput}
                onChange={(e) => setCustomGlassesInput(e.target.value)}
                className="w-16 px-2 py-1.5 text-xs text-center font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={() => customGlassesInput && handleSetExactGlasses(parseInt(customGlassesInput, 10))}
                className="px-2.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
              >
                Fijar
              </button>
            </div>
          </div>
        </div>

        {/* Resumen de Métricas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Racha de meta</span>
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {stats.streakDays} {stats.streakDays === 1 ? 'día' : 'días'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <TrendingUp className="w-4 h-4 text-sky-500" />
              <span>Promedio diario</span>
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {stats.avgDailyMl} ml
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <Droplet className="w-4 h-4 text-blue-500" />
              <span>Total registrado</span>
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {stats.totalLiters} L
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>Metas logradas</span>
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {stats.goalMetCount} veces
            </div>
          </div>
        </div>

        {/* Historial de Registros */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-500" />
              <span>Historial de consumo</span>
            </h2>
            <span className="text-xs text-slate-400">
              {records.length} {records.length === 1 ? 'registro' : 'registros'}
            </span>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">Cargando registros...</div>
          ) : records.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Aún no tienes registros de agua. ¡Comienza añadiendo un vaso arriba o en el check-in de las 7:00 PM!
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {records.map((record) => {
                const met = record.milliliters >= (record.goal_ml || DEFAULT_WATER_GOAL_ML);
                return (
                  <div key={record.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${met ? 'bg-sky-100 dark:bg-sky-950/70 text-sky-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                        💧
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {record.record_date}
                          </span>
                          {met && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-semibold">
                              Meta cumplida
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {record.milliliters} ml ({record.glasses} vasos)
                          {record.notes && ` • "${record.notes}"`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {deleteConfirmId === record.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleDelete(record.id)}
                            className="px-2 py-1 text-[10px] font-bold rounded-lg bg-rose-600 text-white"
                          >
                            Eliminar
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 text-[10px] rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(record.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Eliminar registro"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

