import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { supabase, signOut, saveSessionBackup, tryRestoreSessionBackup } from './lib/supabase';
import { LoginPage } from './pages/LoginPage';
import { ToolHub } from './components/ToolHub';
import { MoodCheckModal } from './components/MoodCheckModal';
import { shouldPromptMoodCheck } from './lib/emotions';
import { ErrorBoundary } from './components/ErrorBoundary';
import { MODULE_REGISTRY, findModuleByHash, getModuleById, ModuleManifest } from './modules/moduleRegistry';
import { recordModuleUsage } from './modules/moduleUsage';

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

  // Chequeo de estado de ánimo
  useEffect(() => {
    if (session?.user) {
      if (shouldPromptMoodCheck()) {
        const timer = setTimeout(() => {
          setShowMoodPrompt(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [session]);

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
            />
          </Suspense>
        </ErrorBoundary>
      ) : (
        <ToolHub
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

      {/* Ventana flotante de chequeo de emoción */}
      <MoodCheckModal
        userId={session.user.id}
        userName={session.user.user_metadata?.full_name}
        isOpen={showMoodPrompt}
        onClose={() => setShowMoodPrompt(false)}
      />
    </ErrorBoundary>
  );
}
