import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { supabase, signOut, saveSessionBackup, tryRestoreSessionBackup } from './lib/supabase';
import { LoginPage } from './pages/LoginPage';
import { ToolHub } from './components/ToolHub';
import { shouldPromptMoodCheck } from './lib/emotions';
import { shouldPromptPirkeiAvotAsync, getStoredPirkeiAvotBookmark, syncPirkeiAvotWithCloud } from './lib/pirkeiAvot';
import { PirkeiAvotBookmark } from '../../packages/shared/src/types';
import { ErrorBoundary } from './components/ErrorBoundary';
import { MODULE_REGISTRY, findModuleByHash, getModuleById, ModuleManifest } from './modules/moduleRegistry';
import { recordModuleUsage } from './modules/moduleUsage';
import { ToastContainer } from './components/ToastContainer';

// Modales globales cargados bajo demanda para mantener el Launcher ultra liviano
const MoodCheckModal = React.lazy(() =>
  import('./components/MoodCheckModal').then((m) => ({ default: m.MoodCheckModal }))
);
const PirkeiAvotPromptModal = React.lazy(() =>
  import('./components/pirkei_avot/PirkeiAvotPromptModal').then((m) => ({ default: m.PirkeiAvotPromptModal }))
);

function ModuleLoadingFallback({ moduleName }: { moduleName?: string }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm transition-colors duration-200">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="font-medium text-xs sm:text-sm">
          {moduleName ? `Cargando módulo ${moduleName}...` : 'Cargando módulo...'}
        </span>
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<string>('hub');
  const [showMoodPrompt, setShowMoodPrompt] = useState(false);
  const [showAvotPrompt, setShowAvotPrompt] = useState(false);
  const [avotBookmark, setAvotBookmark] = useState<PirkeiAvotBookmark>(() => getStoredPirkeiAvotBookmark());
  const [avotGreeting, setAvotGreeting] = useState<string>('Pausa de Mediodía');
  const [avotTarget, setAvotTarget] = useState<{ chapter: number; mishna: number } | null>(null);

  // Inicializar vista basada en hash existente si el usuario ingresó por enlace directo
  useEffect(() => {
    const hash = window.location.hash;
    const initialMod = findModuleByHash(hash);
    if (initialMod) {
      setCurrentView(initialMod.id);
      recordModuleUsage(initialMod.id);
    } else {
      setCurrentView('hub');
    }
  }, []);

  const changeView = useCallback((viewId: string) => {
    setCurrentView(viewId);
    if (viewId === 'hub') {
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    } else {
      const mod = getModuleById(viewId);
      if (mod) {
        recordModuleUsage(mod.id, session?.user?.email || session?.user?.id);
        window.location.hash = `#/${mod.hashAliases[0] || mod.id}`;
      }
    }
  }, [session]);

  // Sincronizar vista ante navegación del navegador (Atrás / Adelante)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (!hash || hash === '#' || hash === '#/' || hash.includes('hub')) {
        setCurrentView('hub');
      } else {
        const matched = findModuleByHash(hash);
        if (matched) {
          setCurrentView(matched.id);
          recordModuleUsage(matched.id, session?.user?.email || session?.user?.id);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [session]);

  // Autenticación con Supabase
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (initialSession?.user && isMounted) {
          setSession(initialSession);
          saveSessionBackup(initialSession);
          setLoading(false);
          return;
        }

        const restored = await tryRestoreSessionBackup();
        if (restored?.user && isMounted) {
          setSession(restored);
          setLoading(false);
          return;
        }

        if (isMounted) {
          setSession(null);
          setLoading(false);
        }
      } catch (err) {
        console.warn('Error inicializando auth:', err);
        if (isMounted) setLoading(false);
      }
    }

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (!isMounted) return;
      if (currentSession?.user) {
        setSession(currentSession);
        saveSessionBackup(currentSession);
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        saveSessionBackup(null);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Chequeo de estado de ánimo (evalúa reglas de tiempo y reentradas durante el día)
  useEffect(() => {
    if (!session?.user) return;

    const checkPrompt = () => {
      if (shouldPromptMoodCheck()) {
        setShowMoodPrompt(true);
      }
    };

    const timer = setTimeout(checkPrompt, 500);

    // Al volver a la pestaña/app durante el día, comprobar si corresponde preguntar
    window.addEventListener('focus', checkPrompt);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('focus', checkPrompt);
    };
  }, [session]);

  // Sugerencia de lectura de Pirkei Avot a mediodía o en la tarde (12:00 a 19:30)
  // Sincroniza previamente con la nube para que reconozca lecturas hechas en laptop u otro dispositivo
  useEffect(() => {
    if (!session?.user) return;

    let isMounted = true;

    const checkAvotPrompt = async () => {
      // Si el usuario ya está en Pirkei Avot o el modal de ánimo está abierto, no interrumpir
      if (currentView === 'pirkei_avot' || showMoodPrompt) return;

      const { shouldPrompt, bookmark, greeting } = await shouldPromptPirkeiAvotAsync(session.user.id);
      if (isMounted && shouldPrompt) {
        setAvotBookmark(bookmark);
        setAvotGreeting(greeting);
        setShowAvotPrompt(true);
      }
    };

    // Sincronizar en segundo plano inmediatamente
    syncPirkeiAvotWithCloud(session.user.id);

    const timer = setTimeout(checkAvotPrompt, 1200);
    window.addEventListener('focus', checkAvotPrompt);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      window.removeEventListener('focus', checkAvotPrompt);
    };
  }, [session, currentView, showMoodPrompt]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm transition-colors duration-200">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span>Cargando Personal Tools...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return <LoginPage />;
  }

  const activeModule: ModuleManifest | null = currentView !== 'hub' ? getModuleById(currentView) : null;

  return (
    <ErrorBoundary fallbackTitle="Error en la aplicación">
      {activeModule ? (
        <ErrorBoundary fallbackTitle={`Error en módulo ${activeModule.name}`} onReset={() => changeView('hub')}>
          <Suspense fallback={<ModuleLoadingFallback moduleName={activeModule.name} />}>
            <activeModule.component
              user={session.user}
              onBackToHub={() => changeView('hub')}
              initialChapter={currentView === 'pirkei_avot' ? avotTarget?.chapter : undefined}
              initialMishna={currentView === 'pirkei_avot' ? avotTarget?.mishna : undefined}
            />
          </Suspense>
        </ErrorBoundary>
      ) : (
        <ToolHub
          userId={session.user.id}
          userEmail={session.user.email}
          userName={session.user.user_metadata?.full_name}
          avatarUrl={session.user.user_metadata?.avatar_url}
          onSelectTool={(route) => {
            const matched = MODULE_REGISTRY.find(
              (m) => route.startsWith(m.route) || m.hashAliases.some((alias) => route.includes(alias))
            );
            if (matched) {
              changeView(matched.id);
            }
          }}
          onLogout={() => {
            window.location.hash = '';
            signOut();
          }}
        />
      )}

      {/* Ventana flotante de chequeo de emoción (Cargada bajo demanda) */}
      {showMoodPrompt && (
        <Suspense fallback={null}>
          <MoodCheckModal
            userId={session.user.id}
            userName={session.user.user_metadata?.full_name}
            isOpen={showMoodPrompt}
            onClose={() => setShowMoodPrompt(false)}
          />
        </Suspense>
      )}

      {/* Ventana flotante de sugerencia de Pirkei Avot al mediodía o en la tarde (Cargada bajo demanda) */}
      {showAvotPrompt && (
        <Suspense fallback={null}>
          <PirkeiAvotPromptModal
            isOpen={showAvotPrompt}
            bookmark={avotBookmark}
            greeting={avotGreeting}
            onClose={() => setShowAvotPrompt(false)}
            onReadNow={(chapter, mishna) => {
              setShowAvotPrompt(false);
              setAvotTarget({ chapter, mishna });
              changeView('pirkei_avot');
            }}
            onViewAllChapters={() => {
              setShowAvotPrompt(false);
              setAvotTarget(null);
              changeView('pirkei_avot');
            }}
          />
        </Suspense>
      )}

      {/* Notificaciones globales tipo Toast (modernas y no invasivas) */}
      <ToastContainer />
    </ErrorBoundary>
  );
}

