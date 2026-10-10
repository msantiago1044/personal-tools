import React, { useState } from 'react';
import {
  EMOTIONS_CONFIG,
  EmotionKey,
  saveEmotionRecord,
  markMoodPromptDismissed,
} from '../lib/emotions';
import { X, Sparkles, Check, MessageSquare } from 'lucide-react';

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

  if (!isOpen) return null;

  const handleSelectEmotion = async (emotionKey: EmotionKey) => {
    setSelectedEmotion(emotionKey);

    // Si no tiene desplegado el input de notas, guardamos directamente con 1 solo toque
    if (!showNoteInput) {
      setSaving(true);
      await saveEmotionRecord(userId, emotionKey);
      setSaving(false);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        setSelectedEmotion(null);
        setNote('');
        onSaved?.();
        onClose();
      }, 750);
    }
  };

  const handleConfirmWithNote = async () => {
    if (!selectedEmotion) return;
    setSaving(true);
    await saveEmotionRecord(userId, selectedEmotion, note);
    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setSelectedEmotion(null);
      setNote('');
      setShowNoteInput(false);
      onSaved?.();
      onClose();
    }, 750);
  };

  const handleDismiss = () => {
    // Al cerrar sin seleccionar, se registra que ya se preguntó para no volver a insistir antes de 1 hora
    markMoodPromptDismissed();
    onClose();
  };

  const firstName = userName ? userName.split(' ')[0] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 dark:bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl text-slate-900 dark:text-slate-100 transition-colors relative overflow-hidden">
        {/* Glow decorativo sutil */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

        {/* Cabecera */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chequeo diario</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              {firstName ? `¿Cómo te sientes, ${firstName}?` : '¿Cómo te sientes en este momento?'}
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Toca un icono para registrar tu ánimo
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
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">¡Emoción registrada!</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Guardado en tu historial de bienestar
            </p>
          </div>
        ) : (
          <>
            {/* Grid sencillo de iconografía con las 6 emociones */}
            <div className="grid grid-cols-3 gap-2.5 my-3.5">
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

            {/* Opción desplegable para nota corta */}
            {!showNoteInput ? (
              <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800/80">
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
              <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 animate-in fade-in duration-150">
                <input
                  type="text"
                  placeholder="Ej. Día productivo, un poco de cansancio..."
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
                    {saving ? 'Guardando...' : 'Guardar'}
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
