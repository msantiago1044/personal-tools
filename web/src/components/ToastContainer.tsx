import React, { useEffect, useState } from 'react';
import { toast, ToastMessage } from '../lib/toast';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe((newToast) => {
      setToasts((prev) => [...prev, newToast]);

      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          setToasts((current) => current.filter((t) => t.id !== newToast.id));
        }, newToast.duration);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDismiss = (id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((t) => {
        const isSuccess = t.type === 'success';
        const isError = t.type === 'error';
        const isWarning = t.type === 'warning';

        return (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl shadow-lg border backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
              isSuccess
                ? 'bg-emerald-500/10 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-100 border-emerald-500/30'
                : isError
                ? 'bg-rose-500/10 dark:bg-rose-950/80 text-rose-900 dark:text-rose-100 border-rose-500/30'
                : isWarning
                ? 'bg-amber-500/10 dark:bg-amber-950/80 text-amber-900 dark:text-amber-100 border-amber-500/30'
                : 'bg-white/95 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 border-slate-200/80 dark:border-slate-800'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
              {isError && <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
              {isWarning && <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
              {!isSuccess && !isError && !isWarning && (
                <Info className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              {t.title && <h4 className="text-xs font-bold leading-tight mb-0.5">{t.title}</h4>}
              <p className="text-xs leading-snug">{t.message}</p>
            </div>

            <button
              onClick={() => handleDismiss(t.id)}
              className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              title="Cerrar notificación"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
