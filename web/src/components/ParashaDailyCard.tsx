import React, { useState, useEffect } from 'react';
import {
  getDiasporaDailySchedule,
  isDailyAliyahReadToday,
  markDailyAliyahCompletedToday,
  syncParashaWithCloud,
} from '../lib/parashaService';
import { recordModuleUsage } from '../modules/moduleUsage';
import { BookOpen, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

interface ParashaDailyCardProps {
  userId?: string;
  onOpenParasha: (aliyahNumber?: number) => void;
}

export const ParashaDailyCard: React.FC<ParashaDailyCardProps> = ({
  userId,
  onOpenParasha,
}) => {
  const [schedule, setSchedule] = useState(() => getDiasporaDailySchedule());
  const [isReadToday, setIsReadToday] = useState(() => isDailyAliyahReadToday(userId));
  const [isDismissing, setIsDismissing] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const runSync = () => {
      syncParashaWithCloud(userId).then((res) => {
        if (!isCancelled) {
          setSchedule(getDiasporaDailySchedule());
          if (res.isReadToday) {
            setIsReadToday(true);
          } else {
            setIsReadToday(isDailyAliyahReadToday(userId));
          }
        }
      });
    };

    runSync();

    const handleLocalUpdate = () => {
      setSchedule(getDiasporaDailySchedule());
      setIsReadToday(isDailyAliyahReadToday(userId));
    };

    const handleFocusAndSync = () => {
      handleLocalUpdate();
      runSync();
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        handleFocusAndSync();
      }
    };

    window.addEventListener('parasha_progress_updated', handleLocalUpdate);
    window.addEventListener('focus', handleFocusAndSync);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      isCancelled = true;
      window.removeEventListener('parasha_progress_updated', handleLocalUpdate);
      window.removeEventListener('focus', handleFocusAndSync);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [userId]);

  // Si ya fue leída hoy, el widget se retira por completo de la pantalla de inicio
  if (isReadToday) {
    return null;
  }

  const handleQuickMarkRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissing(true);
    recordModuleUsage('parasha', userId);
    await markDailyAliyahCompletedToday(
      schedule.targetAliyahNumber,
      schedule.parashaId || schedule.parashaName,
      userId
    );
    setTimeout(() => {
      setIsReadToday(true);
      setIsDismissing(false);
    }, 300);
  };

  return (
    <div
      className={`relative mb-6 rounded-2xl p-4 sm:p-5 transition-all duration-300 shadow-xs border bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-slate-900/40 border-emerald-500/30 dark:border-emerald-800/50 ${
        isDismissing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xl shrink-0">
            📜
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-300/60 dark:border-emerald-800/60 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Torá · Diáspora
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {schedule.dayName}
              </span>
            </div>

            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
              <span>{schedule.targetAliyahName}</span>
              <span className="text-slate-400 dark:text-slate-500 font-normal">·</span>
              <span className="text-emerald-600 dark:text-emerald-400">
                Parashat {schedule.parashaName}
              </span>
              <span className="font-serif text-sm text-emerald-700 dark:text-emerald-400" dir="rtl">
                ({schedule.parashaHebrew})
              </span>
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {schedule.isShabbatMorning
                ? 'Lectura completa de Shabat por la mañana con las 7 aliyot.'
                : schedule.isShabbatAfternoon
                ? 'Minjá de Shabat: inicia el ciclo semanal con la 1ª Aliyá (Rishón).'
                : 'Lectura diaria de la Torá versículo a versículo.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Botón rápido para marcar como leída directamente */}
          <button
            type="button"
            onClick={handleQuickMarkRead}
            title="Marcar como leída hoy"
            className="flex-1 sm:flex-none px-3 py-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 transition flex items-center justify-center gap-1.5 shadow-xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Ya la leí</span>
          </button>

          {/* Botón principal para ir a leerla */}
          <button
            type="button"
            onClick={() => onOpenParasha(schedule.targetAliyahNumber)}
            className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Leer ahora</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
