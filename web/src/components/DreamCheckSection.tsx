import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sparkles, Mic, Square, Trash2, AlertCircle } from 'lucide-react';

interface DreamCheckSectionProps {
  hadDream: boolean | null;
  onSelectHadDream: (had: boolean) => void;
  dreamText: string;
  onChangeDreamText: (text: string) => void;
  dreamAudioUrl: string | null;
  onChangeDreamAudioUrl: (url: string | null) => void;
}

export const DreamCheckSection: React.FC<DreamCheckSectionProps> = ({
  hadDream,
  onSelectHadDream,
  dreamText,
  onChangeDreamText,
  dreamAudioUrl,
  onChangeDreamAudioUrl,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordingError, setRecordingError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Limpiar temporizador y pistas de audio al desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    setRecordingError(null);
    try {
      if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        setRecordingError('Tu navegador no admite la grabación directa de audio.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      let mimeType = 'audio/webm';
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        }
      }

      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mimeType || 'audio/webm',
        });

        // Convertir a base64 Data URL para persistencia autónoma
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          onChangeDreamAudioUrl(base64data);
        };

        // Detener hardware del micrófono
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('[DreamCheckSection] Error al iniciar grabación:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setRecordingError('Permiso de micrófono denegado. Puedes escribir tu sueño en el campo de texto.');
      } else {
        setRecordingError('No se pudo acceder al micrófono. Por favor verifica los permisos.');
      }
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const deleteRecording = () => {
    stopRecording();
    onChangeDreamAudioUrl(null);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="pt-2 border-t border-slate-200/70 dark:border-slate-700/70 space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Moon className="w-3.5 h-3.5 text-indigo-500" />
          ¿Soñaste con algo anoche?
        </span>
        <span className="text-[10px] text-slate-400">Diario de sueños</span>
      </div>

      {/* Botones de Sí / No */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onSelectHadDream(false)}
          className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all duration-150 flex items-center justify-center gap-1.5 ${
            hadDream === false
              ? 'border-slate-400 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 ring-2 ring-slate-400/20 shadow-xs'
              : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
          }`}
        >
          <span>😴 No tuve / No recuerdo</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectHadDream(true)}
          className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all duration-150 flex items-center justify-center gap-1.5 ${
            hadDream === true
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
              : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>🌙 Sí, tuve un sueño</span>
        </button>
      </div>

      {/* Formulario de registro de sueño si marcó que Sí */}
      {hadDream && (
        <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/60 space-y-2.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-[11px] text-indigo-900 dark:text-indigo-200 font-medium">
            <span>Guarda tu sueño (se añadirá a tu módulo de Notas)</span>
          </div>

          {/* Campo de texto */}
          <div>
            <textarea
              rows={2}
              value={dreamText}
              onChange={(e) => onChangeDreamText(e.target.value)}
              placeholder="¿Qué recuerdas de tu sueño? Lugares, personas, detalles..."
              className="w-full text-xs p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Grabación de nota de voz */}
          <div className="space-y-1.5">
            {recordingError && (
              <div className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{recordingError}</span>
              </div>
            )}

            {isRecording ? (
              <div className="flex items-center justify-between p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                  <span className="text-xs font-semibold">Grabando voz: {formatSeconds(recordingSeconds)}</span>
                </div>
                <button
                  type="button"
                  onClick={stopRecording}
                  className="px-2.5 py-1 text-xs font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition flex items-center gap-1"
                >
                  <Square className="w-3 h-3 fill-current" />
                  <span>Detener</span>
                </button>
              </div>
            ) : dreamAudioUrl ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                  <span>🎙️ Audio del sueño grabado</span>
                  <button
                    type="button"
                    onClick={deleteRecording}
                    className="text-rose-500 hover:text-rose-700 flex items-center gap-1 font-medium transition"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Eliminar audio</span>
                  </button>
                </div>
                <audio controls src={dreamAudioUrl} className="w-full h-8 rounded-lg" />
              </div>
            ) : (
              <button
                type="button"
                onClick={startRecording}
                className="w-full py-1.5 px-3 rounded-xl border border-indigo-300/80 dark:border-indigo-700/80 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-indigo-700 dark:text-indigo-300 text-xs font-medium transition flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Mic className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Grabar nota de voz del sueño</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

