import React, { useState, useEffect, useMemo } from 'react';
import {
  WeatherRecord,
  WeatherConditionKey,
  ThermalSensationKey,
  WEATHER_CONDITIONS_CONFIG,
  THERMAL_SENSATION_CONFIG,
  fetchWeatherRecords,
  saveWeatherRecord,
  deleteWeatherRecord,
} from '../../lib/weather';
import { getLocalDateString } from '../../lib/sleep';
import { ThemeMode, getStoredTheme, applyTheme } from '../../lib/theme';
import {
  ArrowLeft,
  CloudSun,
  Sun,
  Moon,
  Laptop,
  Calendar,
  Sparkles,
  Thermometer,
  Trash2,
  Check,
  Plus,
} from 'lucide-react';

interface WeatherModuleProps {
  user: any;
  onBackToHub: () => void;
}

export const WeatherModule: React.FC<WeatherModuleProps> = ({ user, onBackToHub }) => {
  const [records, setRecords] = useState<WeatherRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme());
  const [todayDate] = useState<string>(getLocalDateString());
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Formulario manual / edición para el día de hoy
  const [selectedCondition, setSelectedCondition] = useState<WeatherConditionKey>('soleado');
  const [temperatureInput, setTemperatureInput] = useState<string>('24');
  const [sensation, setSensation] = useState<ThermalSensationKey>('agradable');
  const [notesInput, setNotesInput] = useState<string>('');
  const [savingToday, setSavingToday] = useState<boolean>(false);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchWeatherRecords(user.id);
      setRecords(data);

      const todayRec = data.find((r) => r.record_date === todayDate);
      if (todayRec) {
        setSelectedCondition(todayRec.condition);
        if (todayRec.temperature_c !== undefined) {
          setTemperatureInput(todayRec.temperature_c.toString());
        }
        if (todayRec.thermal_sensation) {
          setSensation(todayRec.thermal_sensation);
        }
        if (todayRec.notes) {
          setNotesInput(todayRec.notes);
        }
      }
    } catch (err) {
      console.error('[WeatherModule] Error cargando datos:', err);
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

  // Estadísticas del clima
  const stats = useMemo(() => {
    if (records.length === 0) {
      return { predominant: 'Sin datos', totalDays: 0, avgTemp: 'N/A' };
    }

    const counts: Record<string, number> = {};
    let tempSum = 0;
    let tempCount = 0;

    records.forEach((r) => {
      counts[r.condition] = (counts[r.condition] || 0) + 1;
      if (r.temperature_c !== undefined && !isNaN(r.temperature_c)) {
        tempSum += r.temperature_c;
        tempCount++;
      }
    });

    let topCond = 'soleado';
    let topCount = 0;
    Object.entries(counts).forEach(([cond, cnt]) => {
      if (cnt > topCount) {
        topCount = cnt;
        topCond = cond;
      }
    });

    return {
      predominant: WEATHER_CONDITIONS_CONFIG[topCond as WeatherConditionKey]?.label || topCond,
      totalDays: records.length,
      avgTemp: tempCount > 0 ? `${(tempSum / tempCount).toFixed(1)}°C` : 'N/A',
    };
  }, [records]);

  const handleSaveToday = async () => {
    setSavingToday(true);
    try {
      const updated = await saveWeatherRecord(user.id, {
        record_date: todayDate,
        condition: selectedCondition,
        temperature_c: temperatureInput ? parseFloat(temperatureInput) : undefined,
        thermal_sensation: sensation,
        notes: notesInput,
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
      console.error('[WeatherModule] Error guardando clima:', err);
    } finally {
      setSavingToday(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteWeatherRecord(id, user.id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
    setDeleteConfirmId(null);
  };

  const currentConditionConfig = WEATHER_CONDITIONS_CONFIG[selectedCondition] || WEATHER_CONDITIONS_CONFIG.soleado;

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
                <span className="text-2xl select-none">🌤️</span>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Clima & Entorno
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  Entorno
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Registra el tiempo meteorológico de tu día y su efecto en tu energía y bienestar.
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

        {/* Tarjeta Principal de Clima de Hoy */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-transparent border border-amber-200 dark:border-amber-900/40 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Condición de hoy ({todayDate})</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{currentConditionConfig.emoji}</span>
                <span>{currentConditionConfig.label}</span>
                {todayRecord && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-semibold">
                    Registrado
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {currentConditionConfig.description}
              </p>
            </div>

            {/* Selector de temperatura y sensación */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-2xl">
                <Thermometer className="w-4 h-4 text-amber-500" />
                <input
                  type="number"
                  value={temperatureInput}
                  onChange={(e) => setTemperatureInput(e.target.value)}
                  placeholder="24"
                  className="w-10 text-xs font-bold text-center bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none"
                />
                <span className="text-xs font-bold text-slate-400">°C</span>
              </div>
            </div>
          </div>

          {/* Cuadrícula de Condiciones del Clima (1 clic) */}
          <div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-2">
              Selecciona el clima que experimentaste hoy:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(WEATHER_CONDITIONS_CONFIG) as WeatherConditionKey[]).map((key) => {
                const cfg = WEATHER_CONDITIONS_CONFIG[key];
                const isSelected = selectedCondition === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedCondition(key)}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border transition-all duration-150 text-left ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 ring-2 ring-amber-500/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-2xl leading-none">{cfg.emoji}</span>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                        {cfg.label}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[110px]">
                        {cfg.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sensación térmica */}
          <div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1.5">
              Sensación térmica percibida:
            </span>
            <div className="grid grid-cols-5 gap-1.5">
              {(Object.keys(THERMAL_SENSATION_CONFIG) as ThermalSensationKey[]).map((key) => {
                const cfg = THERMAL_SENSATION_CONFIG[key];
                const isSelected = sensation === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSensation(key)}
                    className={`py-1.5 px-1 rounded-xl border text-center transition ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 ring-2 ring-amber-500/20 text-amber-700 dark:text-amber-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-sm block">{cfg.emoji}</span>
                    <span className="text-[9px] block truncate">{cfg.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notas de impacto */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              placeholder="Notas opcionales: ej. Tarde ventosa muy fresca, agradable para caminar..."
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="button"
              onClick={handleSaveToday}
              disabled={savingToday}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{savingToday ? 'Guardando...' : 'Guardar Clima'}</span>
            </button>
          </div>
        </div>

        {/* Resumen de Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-xs text-slate-400 mb-1">Clima predominante</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {stats.predominant}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-xs text-slate-400 mb-1">Temperatura promedio</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {stats.avgTemp}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-xs text-slate-400 mb-1">Días registrados</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {stats.totalDays}
            </div>
          </div>
        </div>

        {/* Historial del Clima */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>Historial del clima</span>
            </h2>
            <span className="text-xs text-slate-400">
              {records.length} {records.length === 1 ? 'día' : 'días'}
            </span>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">Cargando registros...</div>
          ) : records.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Aún no tienes registros de clima. ¡Registra el de hoy arriba o en el check-in de las 7:00 PM!
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {records.map((record) => {
                const cfg = WEATHER_CONDITIONS_CONFIG[record.condition] || WEATHER_CONDITIONS_CONFIG.soleado;
                return (
                  <div key={record.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40">
                        {cfg.emoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {record.record_date}
                          </span>
                          <span className="text-[10px] px-2 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                            {cfg.label}
                          </span>
                          {record.temperature_c !== undefined && (
                            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                              {record.temperature_c}°C
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {record.thermal_sensation && THERMAL_SENSATION_CONFIG[record.thermal_sensation]?.label}
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

