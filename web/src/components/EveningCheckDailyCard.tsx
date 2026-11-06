import React, { useState, useEffect } from 'react';
import {
  isEveningCheckCompletedToday,
  isEveningCheckTime,
  shouldPromptEveningCheckAsync,
} from '../lib/eveningCheck';
import { Sunset, CheckCircle2, ChevronRight, Droplet, CloudSun, Utensils, Sparkles } from 'lucide-react';

interface EveningCheckDailyCardProps {
  userId?: string;
  onOpenCheck: () => void;
}

export const EveningCheckDailyCard: React.FC<EveningCheckDailyCardProps> = ({
  userId,
  onOpenCheck,
}) => {
  const [isCompleted, setIsCompleted] = useState(() => isEveningCheckCompletedToday());
  const [isEvening, setIsEvening] = useState(() => isEveningCheckTime());

  useEffect(() => {
    let isCancelled = false;

    const checkStatus = () => {
      setIsEvening(isEveningCheckTime());
      const localComp = isEveningCheckCompletedToday();
      setIsCompleted(localComp);

      if (userId && !localComp) {
        shouldPromptEveningCheckAsync(userId).then((shouldPrompt) => {
          if (!isCancelled) {
            setIsCompleted(!shouldPrompt);
          }
        });
      }
    };

    checkStatus();

    // Comprobar cada 30 segundos si el reloj cruzó las 7:00 PM
    const interval = setInterval(checkStatus, 30000);

    const handleUpdate = () => checkStatus();
    window.addEventListener('evening_check_updated', handleUpdate);
    window.addEventListener('focus', handleUpdate);
    document.addEventListener('visibilitychange', handleUpdate);

    return () => {
      isCancelled = true;
      clearInterval(interval);
      window.removeEventListener('evening_check_updated', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
      document.removeEventListener('visibilitychange', handleUpdate);
    };
  }, [userId]);

  // Si ya se completó el check-in de hoy
  if (isCompleted) {
    return (
      <div className="relative mb-6 rounded-2xl p-3.5 sm:p-4 transition-all duration-300 border bg-slate-50/80 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-lg shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Check-in de las 7:00 PM completado
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                Al día
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Registraste agua, clima y alimentación de hoy.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenCheck}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition shrink-0"
        >
          Ver / Editar
        </button>
      </div>
    );
  }

  // Si está pendiente (especialmente visible y destacado después de las 7:00 PM)
  return (
    <div
      onClick={onOpenCheck}
      className={`relative mb-6 rounded-2xl p-4 sm:p-5 transition-all duration-300 shadow-xs border cursor-pointer group ${
        isEvening
          ? 'bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-sky-500/10 dark:from-amber-950/40 dark:via-rose-950/25 dark:to-sky-950/25 border-amber-500/40 dark:border-amber-700/50 hover:border-amber-500/70'
          : 'bg-gradient-to-r from-slate-100/80 to-slate-50 dark:from-slate-900/60 dark:to-slate-900/30 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 text-white flex items-center justify-center text-xl shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <Sunset className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 tracking-wide uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {isEvening ? 'Hora del Check-in (7:00 PM)' : 'Check-in de Cierre de Día'}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 animate-pulse">
                Pendiente
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5">
              ¿Cuánta agua tomaste, qué clima hubo y qué comiste hoy?
            </h3>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <Droplet className="w-3 h-3 text-sky-500" /> Agua
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CloudSun className="w-3 h-3 text-amber-500" /> Clima
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Utensils className="w-3 h-3 text-emerald-500" /> Comidas
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenCheck();
          }}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 group-hover:translate-x-0.5"
        >
          <span>Completar Check-in</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
