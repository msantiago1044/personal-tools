import React, { useState, useEffect } from 'react';
import { fetchLatestApkDownloadUrl, LATEST_RELEASE_CONFIG } from '../lib/appRelease';
import { Download, Smartphone, CheckCircle, ExternalLink, X } from 'lucide-react';

interface DownloadApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadApkModal: React.FC<DownloadApkModalProps> = ({ isOpen, onClose }) => {
  const [downloadUrl, setDownloadUrl] = useState<string>(LATEST_RELEASE_CONFIG.githubLatestUrl);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchLatestApkDownloadUrl()
        .then((url) => setDownloadUrl(url))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownload = () => {
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 transition-colors">
        {/* Cabecera */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                App Nativa Android
              </h3>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                Versión oficial más reciente
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido */}
        <div className="mt-5 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span>Archivo:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">PersonalTools.apk</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Compatibilidad:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Android 9.0+</span>
            </div>
          </div>

          {/* Botón Principal de Descarga */}
          <button
            onClick={handleDownload}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md transition duration-200 disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            <span>Descargar Última Versión (.APK)</span>
          </button>

          {/* Guía rápida de instalación */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-left space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pasos de instalación en tu celular:
            </h4>
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Al descargar, abre el archivo desde la barra de notificaciones o descargas.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Si Android solicita permisos, selecciona <strong>"Permitir desde esta fuente"</strong>.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>¡Listo! Tendrás la app nativa instalada con soporte completo de alarmas y notificaciones.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            Cerrar ventana
          </button>
        </div>
      </div>
    </div>
  );
};
