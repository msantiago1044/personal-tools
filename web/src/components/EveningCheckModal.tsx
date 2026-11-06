import React, { useState, useMemo } from 'react';
import {
  saveWaterRecord,
  ML_PER_GLASS,
  DEFAULT_WATER_GOAL_ML,
} from '../lib/water';
import {
  WEATHER_CONDITIONS_CONFIG,
  WeatherConditionKey,
  saveWeatherRecord,
} from '../lib/weather';
import {
  saveFoodRecord,
  FOOD_QUALITY_CONFIG,
} from '../lib/food';
import {
  EMOTIONS_CONFIG,
  EmotionKey,
  saveEmotionRecord,
} from '../lib/emotions';
import {
  markEveningCheckDismissed,
  markEveningCheckCompleted,
} from '../lib/eveningCheck';
import { getLocalDateString } from '../lib/sleep';
import { useModalBackHandler } from '../lib/useModalBackHandler';
import {
  X,
  Sparkles,
  Check,
  Droplet,
  CloudSun,
  Utensils,
  Plus,
  Minus,
  Sunset,
  ArrowRight,
  Smile,
} from 'lucide-react';

interface EveningCheckModalProps {
  userId: string;
  userName?: string;
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const EveningCheckModal: React.FC<EveningCheckModalProps> = ({
  userId,
  userName,
  isOpen,
  onClose,
  onSaved,
}) => {
  // 1. Estado Agua
  const [glasses, setGlasses] = useState<number>(8); // 8 vasos = 2 Litros (estándar saludable)
  const milliliters = glasses * ML_PER_GLASS;
  const waterProgress = Math.min(100, Math.round((milliliters / DEFAULT_WATER_GOAL_ML) * 100));

  // 2. Estado Clima
  const [selectedWeather, setSelectedWeather] = useState<WeatherConditionKey>('soleado');
  const [temperature, setTemperature] = useState<string>('');

  // 3. Estado Comidas
  const [foodSummary, setFoodSummary] = useState<string>('');
  const [showDetailedMeals, setShowDetailedMeals] = useState<boolean>(false);
  const [breakfast, setBreakfast] = useState<string>('');
  const [lunch, setLunch] = useState<string>('');
  const [dinner, setDinner] = useState<string>('');
  const [foodQuality, setFoodQuality] = useState<number>(4);

  // 4. Estado Emociones
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionKey | null>(null);

  // Estados UI
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Manejo de botón 'Atrás' en móviles Android / PWA
  useModalBackHandler({
    isOpen,
    onClose: () => {
      markEveningCheckDismissed(userId);
      onClose();
    },
    modalId: 'evening_check_prompt',
  });

  if (!isOpen) return null;

  const firstName = userName ? userName.split(' ')[0] : null;

  const handleDismiss = () => {
    markEveningCheckDismissed(userId);
    onClose();
  };

  const handleSave = async () => {
    setSaving(true);
    const today = getLocalDateString();

    try {
      // 1. Guardar Agua en user_water_records
      await saveWaterRecord(userId, {
        record_date: today,
        glasses,
        milliliters,
        goal_ml: DEFAULT_WATER_GOAL_ML,
      });

      // 2. Guardar Clima en user_weather_records
      await saveWeatherRecord(userId, {
        record_date: today,
        condition: selectedWeather,
        temperature_c: temperature ? parseFloat(temperature) : undefined,
      });

      // 3. Guardar Comidas en user_food_records
      const finalBreakfast = showDetailedMeals ? breakfast : undefined;
      const finalLunch = showDetailedMeals ? lunch : (foodSummary ? `Resumen del día: ${foodSummary}` : undefined);
      const finalDinner = showDetailedMeals ? dinner : undefined;

      await saveFoodRecord(userId, {
        record_date: today,
        breakfast: finalBreakfast,
        lunch: finalLunch,
        dinner: finalDinner,
        quality_score: foodQuality,
        notes: !showDetailedMeals && foodSummary ? foodSummary : undefined,
      });

      // 4. Guardar Emoción de la tarde/noche si el usuario la seleccionó
      if (selectedEmotion) {
        await saveEmotionRecord(
          userId,
          selectedEmotion,
          'Registrado en check-in de cierre de las 7:00 PM'
        );
      }

      // Marcar chequeo de las 7:00 PM completado para hoy
      markEveningCheckCompleted(userId);

      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onSaved?.();
        onClose();
      }, 900);
    } catch (err) {
      console.error('[EveningCheckModal] Error guardando check-in de la tarde:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/65 dark:bg-black/80 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-900 dark:text-slate-100 transition-all duration-200 relative overflow-hidden max-h-[92dvh] sm:max-h-[90vh] overflow-y-auto safe-bottom">
        {/* Indicador táctil superior para celulares (Drag Handle) */}
        <div className="w-full flex justify-center -mt-2 pb-2.5 sm:hidden">
          <div className="w-10 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Glow decorativo sutil */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

        {/* Cabecera */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <Sunset className="w-3.5 h-3.5" />
              <span>Check-in de las 7:00 PM</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {firstName ? `¿Cómo concluye tu día, ${firstName}?` : '¿Cómo concluye tu día de hoy?'}
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              3 preguntas breves: hidratación, clima y alimentación.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2 -mt-2"
            title="Ahora no (recordar más tarde)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback de guardado exitoso */}
        {savedSuccess ? (
          <div className="py-10 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-3xl mb-3 shadow-sm">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              ¡Check-in de las 7:00 PM Registrado!
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
              Tu consumo de agua, el clima y tus comidas quedaron guardados en sus respectivos módulos.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 1. SECCIÓN: AGUA TOMADA HOY */}
            <div className="p-3.5 rounded-2xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400">
                  <Droplet className="w-4 h-4 fill-sky-500/20" />
                  <span>1. ¿Cuánta agua tomaste hoy?</span>
                </div>
                <span className="text-xs font-bold text-sky-700 dark:text-sky-300">
                  {milliliters} ml ({glasses} {glasses === 1 ? 'vaso' : 'vasos'})
                </span>
              </div>

              {/* Barra de progreso de agua */}
              <div className="w-full bg-slate-200/70 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${waterProgress}%` }}
                />
              </div>

              {/* Controles rápidos de vasos */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setGlasses((g) => Math.max(0, g - 1))}
                    disabled={glasses <= 0}
                    className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition disabled:opacity-40"
                    title="Restar 1 vaso"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-bold w-12 text-center text-slate-800 dark:text-slate-100">
                    {glasses} 🥛
                  </span>
                  <button
                    type="button"
                    onClick={() => setGlasses((g) => g + 1)}
                    className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                    title="Sumar 1 vaso"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Accesos rápidos de presets */}
                <div className="flex gap-1">
                  {[4, 6, 8, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGlasses(num)}
                      className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition ${
                        glasses === num
                          ? 'border-sky-500 bg-sky-500 text-white'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {num * 250}ml
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. SECCIÓN: CLIMA DEL DÍA */}
            <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <CloudSun className="w-4 h-4" />
                  <span>2. ¿Cómo estuvo el clima en tu día?</span>
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {WEATHER_CONDITIONS_CONFIG[selectedWeather]?.label}
                </span>
              </div>

              {/* Grid de opciones de clima (1 clic) */}
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {(Object.keys(WEATHER_CONDITIONS_CONFIG) as WeatherConditionKey[]).slice(0, 8).map((key) => {
                  const cfg = WEATHER_CONDITIONS_CONFIG[key];
                  const isSelected = selectedWeather === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedWeather(key)}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all duration-150 ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 ring-2 ring-amber-500/20 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-lg leading-none mb-1">{cfg.emoji}</span>
                      <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                        {cfg.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. SECCIÓN: COMIDAS DEL DÍA */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <Utensils className="w-4 h-4" />
                  <span>3. ¿Qué comiste en todo el día?</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDetailedMeals(!showDetailedMeals)}
                  className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  {showDetailedMeals ? 'Modo rápido' : 'Detallar por comidas'}
                </button>
              </div>

              {!showDetailedMeals ? (
                <input
                  type="text"
                  placeholder="Ej. Fruta en la mañana, ensalada con pollo al almuerzo, cena ligera..."
                  value={foodSummary}
                  onChange={(e) => setFoodSummary(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              ) : (
                <div className="space-y-1.5 animate-in fade-in duration-150">
                  <input
                    type="text"
                    placeholder="🌅 Desayuno..."
                    value={breakfast}
                    onChange={(e) => setBreakfast(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="☀️ Almuerzo..."
                    value={lunch}
                    onChange={(e) => setLunch(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="🌙 Cena..."
                    value={dinner}
                    onChange={(e) => setDinner(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              )}

              {/* Selector de balance nutricional (1 al 5) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    Balance nutricional percibido:
                  </span>
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    {FOOD_QUALITY_CONFIG[foodQuality]?.emoji} {FOOD_QUALITY_CONFIG[foodQuality]?.label}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {[1, 2, 3, 4, 5].map((score) => {
                    const item = FOOD_QUALITY_CONFIG[score];
                    const isSelected = foodQuality === score;
                    return (
                      <button
                        key={score}
                        type="button"
                        onClick={() => setFoodQuality(score)}
                        className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl border transition ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 ring-2 ring-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                            : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <span className="text-base leading-none mb-0.5">{item.emoji}</span>
                        <span className="text-[10px] font-bold">{score}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 4. SECCIÓN: EMOCIONES / ÁNIMO AL CERRAR EL DÍA */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  <Smile className="w-4 h-4" />
                  <span>4. ¿Cómo te sientes al cerrar el día? (opcional)</span>
                </div>
                {selectedEmotion && (
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                    {EMOTIONS_CONFIG[selectedEmotion]?.emoji} {EMOTIONS_CONFIG[selectedEmotion]?.label}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pt-1">
                {(Object.keys(EMOTIONS_CONFIG) as EmotionKey[]).map((key) => {
                  const cfg = EMOTIONS_CONFIG[key];
                  const isSelected = selectedEmotion === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedEmotion(isSelected ? null : key)}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all duration-150 ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title={cfg.label}
                    >
                      <span className="text-xl leading-none mb-1">{cfg.emoji}</span>
                      <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-200 leading-tight truncate max-w-full">
                        {cfg.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="w-full py-2.5 px-4 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-600 via-emerald-600 to-sky-600 hover:opacity-95 text-white shadow-sm transition flex items-center justify-center gap-2"
              >
                {saving ? (
                  'Guardando check-in...'
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Guardar check-in de las 7:00 PM</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] text-slate-400">
                  Podrás editar o ver detalles en cada módulo respectivo.
                </span>
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  Recordar más tarde
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

