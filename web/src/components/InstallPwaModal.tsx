import React, { useState, useEffect } from 'react';
import {
  isStandaloneMode,
  isIosDevice,
  isAndroidDevice,
  promptPwaInstall,
  subscribePwaInstall,
} from '../lib/pwa';
import {
  Download,
  Smartphone,
  Share,
  PlusSquare,
  CheckCircle2,
  X,
  Sparkles,
  ShieldCheck,
  Zap,
  MoreVertical,
} from 'lucide-react';

interface InstallPwaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallPwaModal: React.FC<InstallPwaModalProps> = ({ isOpen, onClose }) => {
  const [canPrompt, setCanPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsStandalone(isStandaloneMode());
      setIsIos(isIosDevice());
      setIsAndroid(isAndroidDevice());
    }

    const unsubscribe = subscribePwaInstall((available) => {
      setCanPrompt(available);
    });

    return unsubscribe;
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    setInstalling(true);
    const result = await promptPwaInstall();
    setInstalling(false);
    if (result === 'accepted') {
      setInstalledSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 dark:bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 transition-colors relative overflow-hidden">
        {/* Glow decorativo de fondo */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Cabecera */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg shadow-xs">
              📱
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                Instalar en tu Celular
              </h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                Acceso directo &middot; Web App Progresiva (PWA)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido */}
        <div className="mt-5 space-y-4">
          {/* Mensaje si ya está en Standalone */}
          {isStandalone ? (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  ¡App ya instalada!
                </p>
                <p className="text-xs text-emerald-700/90 dark:text-emerald-400/90 mt-0.5 leading-relaxed">
                  Ya estás utilizando Personal Tools en modo pantalla completa desde tu pantalla de inicio. Tu sesión se mantendrá guardada permanentemente.
                </p>
              </div>
            </div>
          ) : installedSuccess ? (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  ¡Instalación completada!
                </p>
                <p className="text-xs text-emerald-700/90 dark:text-emerald-400/90 mt-0.5 leading-relaxed">
                  El icono de Personal Tools se ha agregado a tu pantalla de inicio. Ya puedes acceder directamente desde allí sin volver a iniciar sesión.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Botón de instalación con 1 toque si el navegador lo soporta */}
              {canPrompt && (
                <button
                  onClick={handleInstallClick}
                  disabled={installing}
                  className="w-full flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-2xl shadow-md transition duration-200 disabled:opacity-50"
                >
                  <Download className="w-5 h-5" />
                  <span>{installing ? 'Instalando...' : 'Instalar en Pantalla de Inicio'}</span>
                </button>
              )}

              {/* Instrucciones para iOS Safari */}
              {isIos && !canPrompt && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <Smartphone className="w-4 h-4 text-emerald-500" />
                    <span>Instrucciones para iPhone / iPad (Safari):</span>
                  </div>
                  <ol className="space-y-2 text-xs text-slate-600 dark:text-slate-300 list-decimal list-inside pl-1">
                    <li className="leading-relaxed">
                      Toca el botón <strong className="text-slate-900 dark:text-white">Compartir</strong> (<Share className="w-3.5 h-3.5 inline mx-1 text-blue-500" />) en la barra inferior de Safari.
                    </li>
                    <li className="leading-relaxed">
                      Desliza hacia abajo y pulsa en <strong className="text-slate-900 dark:text-white">"Añadir a pantalla de inicio"</strong> (<PlusSquare className="w-3.5 h-3.5 inline mx-1 text-emerald-500" />).
                    </li>
                    <li className="leading-relaxed">
                      Pulsa <strong className="text-slate-900 dark:text-white">"Añadir"</strong> en la esquina superior derecha.
                    </li>
                  </ol>
                </div>
              )}

              {/* Instrucciones para Android Chrome (si no salió el botón directo) */}
              {isAndroid && !canPrompt && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <Smartphone className="w-4 h-4 text-emerald-500" />
                    <span>Instrucciones para Android (Chrome):</span>
                  </div>
                  <ol className="space-y-2 text-xs text-slate-600 dark:text-slate-300 list-decimal list-inside pl-1">
                    <li className="leading-relaxed">
                      Toca el botón de opciones (<MoreVertical className="w-3.5 h-3.5 inline mx-0.5 text-slate-500" /> tres puntos) en la esquina superior derecha de tu navegador.
                    </li>
                    <li className="leading-relaxed">
                      Selecciona <strong className="text-slate-900 dark:text-white">"Instalar aplicación"</strong> o <strong className="text-slate-900 dark:text-white">"Añadir a la pantalla principal"</strong>.
                    </li>
                    <li className="leading-relaxed">
                      Confirma tocando <strong className="text-slate-900 dark:text-white">"Instalar"</strong>.
                    </li>
                  </ol>
                </div>
              )}

              {/* Para computadoras u otros navegadores */}
              {!isIos && !isAndroid && !canPrompt && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2.5">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Puedes instalar Personal Tools directamente desde la barra de direcciones de tu navegador:
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Haz clic en el icono de instalación <Download className="w-3.5 h-3.5 inline mx-1 text-emerald-500" /> ubicado al final de la barra de direcciones o en el menú de opciones del navegador &gt; <em>"Instalar Personal Tools"</em>.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Ventajas de la PWA */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Ventajas al instalar:
            </h4>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>Sesión permanente:</strong> No tendrás que volver a iniciar sesión.</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>Icono en tu pantalla de inicio:</strong> Acceso rápido como cualquier app.</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Zap className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>Pantalla completa:</strong> Sin barra de navegación ni distracciones.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 py-1 px-3 rounded-lg transition"
          >
            Entendido, cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
