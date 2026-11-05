import React, { useState, useEffect, useMemo } from 'react';
import {
  FoodRecord,
  FOOD_QUALITY_CONFIG,
  COMMON_FOOD_TAGS,
  fetchFoodRecords,
  saveFoodRecord,
  deleteFoodRecord,
} from '../../lib/food';
import { getLocalDateString } from '../../lib/sleep';
import { ThemeMode, getStoredTheme, applyTheme } from '../../lib/theme';
import {
  ArrowLeft,
  Utensils,
  Sun,
  Moon,
  Laptop,
  Calendar,
  Sparkles,
  Trash2,
  Check,
  Plus,
  Heart,
  Tag,
} from 'lucide-react';

interface FoodModuleProps {
  user: any;
  onBackToHub: () => void;
}

export const FoodModule: React.FC<FoodModuleProps> = ({ user, onBackToHub }) => {
  const [records, setRecords] = useState<FoodRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme());
  const [todayDate] = useState<string>(getLocalDateString());
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Formulario de edición de hoy
  const [breakfast, setBreakfast] = useState('');
  const [lunch, setLunch] = useState('');
  const [dinner, setDinner] = useState('');
  const [snacks, setSnacks] = useState('');
  const [qualityScore, setQualityScore] = useState<number>(4);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Casero']);
  const [notes, setNotes] = useState('');
  const [savingToday, setSavingToday] = useState(false);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchFoodRecords(user.id);
      setRecords(data);

      const todayRec = data.find((r) => r.record_date === todayDate);
      if (todayRec) {
        setBreakfast(todayRec.breakfast || '');
        setLunch(todayRec.lunch || '');
        setDinner(todayRec.dinner || '');
        setSnacks(todayRec.snacks || '');
        setQualityScore(todayRec.quality_score || 4);
        setSelectedTags(todayRec.tags || ['Casero']);
        setNotes(todayRec.notes || '');
      }
    } catch (err) {
      console.error('[FoodModule] Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user.id]);

  const todayRecord = useMemo(() => {
    return records.find((r) => r.record_date === todayDate) || null;
  }, [records, todayDate]);

  // Estadísticas globales
  const stats = useMemo(() => {
    if (records.length === 0) {
      return { totalDays: 0, avgQuality: '0.0', topTags: [] };
    }

    const qualitySum = records.reduce((acc, curr) => acc + (curr.quality_score || 3), 0);
    const avgQuality = (qualitySum / records.length).toFixed(1);

    const tagCounts: Record<string, number> = {};
    records.forEach((r) => {
      (r.tags || []).forEach((t) => {
        tagCounts[t] = (tagCounts[t] || 0) + 1;
      });
    });

    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tag]) => tag);

    return {
      totalDays: records.length,
      avgQuality,
      topTags,
    };
  }, [records]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSaveToday = async () => {
    setSavingToday(true);
    try {
      const updated = await saveFoodRecord(user.id, {
        record_date: todayDate,
        breakfast,
        lunch,
        dinner,
        snacks,
        quality_score: qualityScore,
        tags: selectedTags,
        notes,
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
    } catch (err) {
      console.error('[FoodModule] Error guardando comidas:', err);
    } finally {
      setSavingToday(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteFoodRecord(id, user.id);
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
                <span className="text-2xl select-none">🥗</span>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Alimentación & Comidas
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Salud
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Registra qué comiste en el día, mantén consciencia de tu nutrición y balance.
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

        {/* Tarjeta Principal de Alimentación de Hoy */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-transparent border border-emerald-200 dark:border-emerald-900/40 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Comidas de hoy ({todayDate})</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                ¿Qué has comido hoy?
              </h2>
            </div>
            {todayRecord && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Registrado</span>
              </span>
            )}
          </div>

          {/* Entradas de las comidas del día */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <span>🌅</span> Desayuno
              </label>
              <input
                type="text"
                placeholder="Ej. Huevos revueltos, café y tostadas..."
                value={breakfast}
                onChange={(e) => setBreakfast(e.target.value)}
                className="w-full text-xs bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <span>☀️</span> Almuerzo
              </label>
              <input
                type="text"
                placeholder="Ej. Pechuga a la plancha, arroz y ensalada verde..."
                value={lunch}
                onChange={(e) => setLunch(e.target.value)}
                className="w-full text-xs bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <span>🌙</span> Cena
              </label>
              <input
                type="text"
                placeholder="Ej. Sopa de verduras y té caliente..."
                value={dinner}
                onChange={(e) => setDinner(e.target.value)}
                className="w-full text-xs bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <span>🍎</span> Snacks / Meriendas
              </label>
              <input
                type="text"
                placeholder="Ej. Manzana, frutos secos, yogur..."
                value={snacks}
                onChange={(e) => setSnacks(e.target.value)}
                className="w-full text-xs bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          {/* Balance nutricional percibido (1 a 5) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Calidad y balance percibido de hoy:
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {FOOD_QUALITY_CONFIG[qualityScore]?.emoji} {FOOD_QUALITY_CONFIG[qualityScore]?.label}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map((score) => {
                const item = FOOD_QUALITY_CONFIG[score];
                const isSelected = qualityScore === score;
                return (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setQualityScore(score)}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 ring-2 ring-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-lg leading-none mb-1">{item.emoji}</span>
                    <span className="text-[10px] truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Etiquetas comunes */}
          <div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1.5">
              Etiquetas del día:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_FOOD_TAGS.map((t) => {
                const isSel = selectedTags.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTag(t)}
                    className={`text-[10px] font-medium px-2.5 py-1 rounded-full border transition ${
                      isSel
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Botón de guardado */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleSaveToday}
              disabled={savingToday}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{savingToday ? 'Guardando...' : 'Guardar Comidas de Hoy'}</span>
            </button>
          </div>
        </div>

        {/* Resumen de Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-xs text-slate-400 mb-1">Días con comidas registradas</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {stats.totalDays}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-xs text-slate-400 mb-1">Calidad promedio (1 al 5)</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              ⭐ {stats.avgQuality}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-xs text-slate-400 mb-1">Etiquetas frecuentes</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {stats.topTags.length > 0 ? (
                stats.topTags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold"
                  >
                    #{t}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">Sin etiquetas</span>
              )}
            </div>
          </div>
        </div>

        {/* Historial de Comidas */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" />
              <span>Historial nutricional</span>
            </h2>
            <span className="text-xs text-slate-400">
              {records.length} {records.length === 1 ? 'registro' : 'registros'}
            </span>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">Cargando registros...</div>
          ) : records.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Aún no tienes registros de comidas. ¡Guarda tu desayuno, almuerzo o cena arriba o en el check-in de las 7:00 PM!
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {records.map((record) => {
                const qCfg = FOOD_QUALITY_CONFIG[record.quality_score || 3];
                return (
                  <div key={record.id} className="py-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {record.record_date}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold">
                          {qCfg?.emoji} {qCfg?.label}
                        </span>
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

                    {/* Contenido de comidas */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                      {record.breakfast && (
                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                          <span className="font-semibold text-slate-700 dark:text-slate-200">🌅 Desayuno: </span>
                          <span>{record.breakfast}</span>
                        </div>
                      )}
                      {record.lunch && (
                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                          <span className="font-semibold text-slate-700 dark:text-slate-200">☀️ Almuerzo: </span>
                          <span>{record.lunch}</span>
                        </div>
                      )}
                      {record.dinner && (
                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                          <span className="font-semibold text-slate-700 dark:text-slate-200">🌙 Cena: </span>
                          <span>{record.dinner}</span>
                        </div>
                      )}
                      {record.snacks && (
                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                          <span className="font-semibold text-slate-700 dark:text-slate-200">🍎 Snacks: </span>
                          <span>{record.snacks}</span>
                        </div>
                      )}
                    </div>

                    {/* Etiquetas */}
                    {record.tags && record.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {record.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[9px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
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

