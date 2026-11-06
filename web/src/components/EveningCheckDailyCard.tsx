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

  // 1. Antes de las 7:00 PM, no mostrar nada: el día aún está transcurriendo y no corresponde preguntar
  if (!isEvening) {
    return null;
  }

  // 2. Si ya se completó el check-in de hoy, ocultar el banner para mantener el Hub limpio
  if (isCompleted) {
    return null;
  }

  // 3. Si son las 7:00 PM en adelante y está pendiente, mostrar el banner destacado
  return (
    <div
      onClick={onOpenCheck}
      className="relative mb-6 rounded-2xl p-4 sm:p-5 transition-all duration-300 shadow-xs border cursor-pointer group bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-sky-500/10 dark:from-amber-950/40 dark:via-rose-950/25 dark:to-sky-950/25 border-amber-500/40 dark:border-amber-700/50 hover:border-amber-500/70"
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

