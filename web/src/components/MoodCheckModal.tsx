import React, { useState, useEffect, useMemo } from 'react';
import {
  EMOTIONS_CONFIG,
  EmotionKey,
  saveEmotionRecord,
  markMoodPromptDismissed,
} from '../lib/emotions';
import {
  hasSleepRecordedForDate,
  saveSleepRecord,
  getLocalDateString,
  formatSleepDuration,
  SLEEP_QUALITY_CONFIG,
} from '../lib/sleep';
import { X, Sparkles, Check, MessageSquare, Moon, Sun, Clock } from 'lucide-react';

interface MoodCheckModalProps {
  userId: string;
  userName?: string;
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const MoodCheckModal: React.FC<MoodCheckModalProps> = ({
  userId,
  userName,
  isOpen,
  onClose,
  onSaved,
}) => {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionKey | null>(null);
  const [note, setNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Estados para el registro de sueño en la primera entrada del día
  const [needsSleepPrompt, setNeedsSleepPrompt] = useState(false);
  const [checkingSleepStatus, setCheckingSleepStatus] = useState(true);
  const [skipSleepRecord, setSkipSleepRecord] = useState(false);
  const [bedTime, setBedTime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState(() => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(Math.floor(now.getMinutes() / 5) * 5).padStart(2, '0');
    return `${h}:${m}`;
  });
  const [sleepQuality, setSleepQuality] = useState<number>(4);

  // Verificar si es la primera entrada del día (sin registro de sueño para hoy)
  useEffect(() => {
    if (!isOpen || !userId) return;

    let isMounted = true;
    async function checkStatus() {
      setCheckingSleepStatus(true);
      try {
        const hasSleep = await hasSleepRecordedForDate(userId, getLocalDateString());
        if (isMounted) {
          setNeedsSleepPrompt(!hasSleep);
        }
      } catch (e) {
        if (isMounted) setNeedsSleepPrompt(false);
      } finally {
        if (isMounted) setCheckingSleepStatus(false);
      }
    }

    checkStatus();

    return () => {
      isMounted = false;
    };
  }, [isOpen, userId]);

  // Cálculo de duración en minutos entre hora acostarse y despertar
  const durationMinutes = useMemo(() => {
    try {
      const [bH, bM] = bedTime.split(':').map(Number);
      const [wH, wM] = wakeTime.split(':').map(Number);
      if (isNaN(bH) || isNaN(bM) || isNaN(wH) || isNaN(wM)) return 0;
      let diff = (wH * 60 + wM) - (bH * 60 + bM);
      if (diff <= 0) {
        diff += 24 * 60; // Cruzó la medianoche
      }
      return diff;
    } catch {
      return 0;
    }
  }, [bedTime, wakeTime]);

  if (!isOpen) return null;

  const performSave = async (emotionKey: EmotionKey, customNote?: string) => {
    setSaving(true);
    try {
      // 1. Guardar emoción
      await saveEmotionRecord(userId, emotionKey, customNote);

      // 2. Si corresponde a la primera entrada y el usuario no omitió el sueño, guardar registro de sueño
      if (needsSleepPrompt && !skipSleepRecord && durationMinutes > 0) {
        const now = new Date();
        const [bH, bM] = bedTime.split(':').map(Number);
        const [wH, wM] = wakeTime.split(':').map(Number);

        // Si la hora de dormir es mayor a la de despertar, fue ayer
        const bedDate = new Date(now);
        if (bH > wH || (bH === wH && bM > wM)) {
          bedDate.setDate(bedDate.getDate() - 1);
        }
        bedDate.setHours(bH, bM, 0, 0);

        const wakeDate = new Date(now);
        wakeDate.setHours(wH, wM, 0, 0);

        await saveSleepRecord(userId, {
          sleep_date: getLocalDateString(now),
          start_time: bedDate.toISOString(),
          end_time: wakeDate.toISOString(),
          quality_score: sleepQuality,
          notes: customNote ? `Ánimo matutino: ${emotionKey}. ${customNote}` : `Ánimo matutino: ${emotionKey}`,
        });
      }

      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        setSelectedEmotion(null);
        setNote('');
        setShowNoteInput(false);
        setSkipSleepRecord(false);
        onSaved?.();
        onClose();
      }, 750);
    } catch (err) {
      console.error('[MoodCheckModal] Error al guardar:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSelectEmotion = async (emotionKey: EmotionKey) => {
    setSelectedEmotion(emotionKey);

    // Si no tiene desplegado el input de notas, guardamos directamente
    if (!showNoteInput) {
      await performSave(emotionKey);
    }
  };

  const handleConfirmWithNote = async () => {
    if (!selectedEmotion) return;
    await performSave(selectedEmotion, note);
  };

  const handleDismiss = () => {
    markMoodPromptDismissed();
    onClose();
  };

  const firstName = userName ? userName.split(' ')[0] : null;
  const isFirstDailyCheckin = needsSleepPrompt && !skipSleepRecord;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 dark:bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className={`w-full ${isFirstDailyCheckin ? 'max-w-md' : 'max-w-sm'} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl text-slate-900 dark:text-slate-100 transition-all duration-200 relative overflow-hidden max-h-[90vh] overflow-y-auto`}>
        {/* Glow decorativo sutil */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-400/10 rounded-full blur-xl pointer-events-none" />

        {/* Cabecera */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isFirstDailyCheckin ? '🌅 Primera entrada del día' : 'Chequeo de bienestar'}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              {firstName ? `¿Cómo te sientes, ${firstName}?` : '¿Cómo te sientes en este momento?'}
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {isFirstDailyCheckin
                ? 'Registra tu descanso de anoche y tu estado de ánimo'
                : 'Toca un icono para registrar tu ánimo actual'}
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Ahora no (preguntar más tarde)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback de guardado exitoso */}
        {savedSuccess ? (
          <div className="py-8 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl mb-2.5 shadow-sm">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {isFirstDailyCheckin ? '¡Sueño y Ánimo Registrados!' : '¡Emoción registrada!'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Guardado en tu historial de bienestar y descanso
            </p>
          </div>
        ) : (
          <>
            {/* Sección de Sueño para la Primera Entrada del Día */}
            {isFirstDailyCheckin && !checkingSleepStatus && (
              <div className="my-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    <Moon className="w-3.5 h-3.5" />
                    <span>Descanso de anoche</span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300">
                    {formatSleepDuration(durationMinutes)}
                  </span>
                </div>

                {/* Horas de inicio y fin */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Hora de dormir
                    </label>
                    <input
                      type="time"
                      value={bedTime}
                      onChange={(e) => setBedTime(e.target.value)}
                      className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                      <Sun className="w-3 h-3 text-amber-500" />
                      Hora despertar
                    </label>
                    <input
                      type="time"
                      value={wakeTime}
                      onChange={(e) => setWakeTime(e.target.value)}
                      className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Calidad de sueño del 1 al 5 */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                      ¿Cómo dormiste? (1 al 5)
                    </span>
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      {SLEEP_QUALITY_CONFIG[sleepQuality]?.emoji} {SLEEP_QUALITY_CONFIG[sleepQuality]?.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5">
                    {[1, 2, 3, 4, 5].map((score) => {
                      const item = SLEEP_QUALITY_CONFIG[score];
                      const isSelected = sleepQuality === score;
                      return (
                        <button
                          key={score}
                          type="button"
                          onClick={() => setSleepQuality(score)}
                          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all duration-150 ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20 text-indigo-700 dark:text-indigo-300 shadow-xs'
                              : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <span className="text-base leading-none mb-1">{item.emoji}</span>
                          <span className="text-[10px] font-bold">{score}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Opción para omitir registro de sueño si tiene prisa */}
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setSkipSleepRecord(true)}
                    className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline"
                  >
                    Omitir registro de sueño hoy
                  </button>
                </div>
              </div>
            )}

            {/* Grid de iconografía con las 6 emociones */}
            <div className="mb-2">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-2">
                {isFirstDailyCheckin ? 'Selecciona tu ánimo al comenzar el día:' : 'Selecciona tu emoción:'}
              </span>

              <div className="grid grid-cols-3 gap-2.5">
                {Object.values(EMOTIONS_CONFIG).map((item) => {
                  const isSelected = selectedEmotion === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleSelectEmotion(item.key)}
                      disabled={saving}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-150 active:scale-95 group ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 shadow-sm ring-2 ring-emerald-500/20'
                          : `${item.borderClass} ${item.bgLightClass}`
                      }`}
                    >
                      <span className="text-2xl mb-1 filter drop-shadow-xs group-hover:scale-110 transition-transform">
                        {item.emoji}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Opción desplegable para nota corta */}
            {!showNoteInput ? (
              <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setShowNoteInput(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>+ Añadir nota corta</span>
                </button>

                <button
                  type="button"
                  onClick={handleDismiss}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  Ahora no
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 animate-in fade-in duration-150">
                <input
                  type="text"
                  placeholder="Ej. Desperté con buena energía, listo para la jornada..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={120}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNoteInput(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 px-2 py-1"
                  >
                    Cancelar nota
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmWithNote}
                    disabled={!selectedEmotion || saving}
                    className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white px-3.5 py-1.5 rounded-xl shadow-xs transition"
                  >
                    {saving ? 'Guardando...' : 'Guardar todo'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
