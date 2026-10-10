import React, { useEffect, useState, useCallback } from 'react';
import { supabase, signOut, saveSessionBackup, tryRestoreSessionBackup } from './lib/supabase';
import { LoginPage } from './pages/LoginPage';
import { ToolHub } from './components/ToolHub';
import { FinanceModule } from './pages/finance/FinanceModule';
import { TehilimModule } from './pages/tehilim/TehilimModule';
import { DwgViewerModule } from './pages/cad/DwgViewerModule';
import { PantryModule } from './pages/pantry/PantryModule';
import { EmocionesModule } from './pages/emotions/EmocionesModule';
import { MoodCheckModal } from './components/MoodCheckModal';
import { shouldPromptMoodCheck } from './lib/emotions';

type ViewType = 'hub' | 'finance' | 'tehilim' | 'dwg_viewer' | 'pantry' | 'emotions';

function getViewFromLocation(): ViewType {
  const hash = window.location.hash.toLowerCase();
  const path = window.location.pathname.toLowerCase();

  if (hash.includes('finance') || path.startsWith('/finance')) return 'finance';
  if (hash.includes('tehilim') || path.startsWith('/tehilim')) return 'tehilim';
  if (hash.includes('cad') || hash.includes('dwg') || path.startsWith('/cad') || path.startsWith('/dwg')) return 'dwg_viewer';
  if (hash.includes('pantry') || hash.includes('mercado') || path.startsWith('/pantry')) return 'pantry';
  if (hash.includes('emocion') || hash.includes('emotion') || path.startsWith('/emotions')) return 'emotions';
  if (hash.includes('hub')) return 'hub';

  // Fallback con localStorage si el hash está vacío
  const saved = localStorage.getItem('app_current_view') as ViewType;
  if (saved && ['hub', 'finance', 'tehilim', 'dwg_viewer', 'pantry', 'emotions'].includes(saved)) {
    return saved;
  }

  return 'hub';
}

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>(getViewFromLocation);
  const [showMoodPrompt, setShowMoodPrompt] = useState(false);

  const changeView = useCallback((view: ViewType) => {
    setCurrentView(view);
    localStorage.setItem('app_current_view', view);
    if (view === 'hub') {
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    } else if (view === 'dwg_viewer') {
      window.location.hash = '#/cad-viewer';
    } else {
      window.location.hash = `#/${view}`;
    }
  }, []);

  // Sincronizar vista ante cambios en el hash del navegador (Atrás / Adelante)
  useEffect(() => {
    const handleHashChange = () => {
      const detected = getViewFromLocation();
      setCurrentView(detected);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Auth Supabase con respaldo reforzado para persistencia de sesión
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        // 1. Obtener sesión de Supabase
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (initialSession?.user && isMounted) {
          setSession(initialSession);
          saveSessionBackup(initialSession);
          setLoading(false);
          return;
        }

        // 2. Si getSession devolvió null (por ejemplo tras reiniciar el navegador en el acceso directo del celular),
        // intentar restaurar inmediatamente usando el respaldo persistido y refresh token
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

    // 3. Suscribirse a cambios de autenticación
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

  // Chequeo de estado de ánimo al entrar a la app (si han pasado más de 1 hora)
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

  // Si no hay sesión, mostramos la pantalla de login con Google
  if (!session) {
    return <LoginPage />;
  }

  return (
    <>
      {/* Vistas según módulo activo */}
      {currentView === 'finance' && (
        <FinanceModule
          user={session.user}
          onBackToHub={() => changeView('hub')}
        />
      )}

      {currentView === 'tehilim' && (
        <TehilimModule
          user={session.user}
          onBackToHub={() => changeView('hub')}
        />
      )}

      {currentView === 'dwg_viewer' && (
        <DwgViewerModule
          onBackToHub={() => changeView('hub')}
        />
      )}

      {currentView === 'pantry' && (
        <PantryModule
          user={session.user}
          onBackToHub={() => changeView('hub')}
        />
      )}

      {currentView === 'emotions' && (
        <EmocionesModule
          user={session.user}
          onBackToHub={() => changeView('hub')}
        />
      )}

      {currentView === 'hub' && (
        <ToolHub
          userEmail={session.user.email}
          userName={session.user.user_metadata?.full_name}
          avatarUrl={session.user.user_metadata?.avatar_url}
          onSelectTool={(route) => {
            if (route.startsWith('/finance')) {
              changeView('finance');
            } else if (route.startsWith('/tehilim')) {
              changeView('tehilim');
            } else if (route.startsWith('/cad-viewer') || route.startsWith('/dwg')) {
              changeView('dwg_viewer');
            } else if (route.startsWith('/pantry')) {
              changeView('pantry');
            } else if (route.startsWith('/emotions')) {
              changeView('emotions');
            }
          }}
          onLogout={() => {
            localStorage.removeItem('app_current_view');
            window.location.hash = '';
            signOut();
          }}
        />
      )}

      {/* Ventana flotante de chequeo de emoción (solo si pasaron más de 1 hora) */}
      <MoodCheckModal
        userId={session.user.id}
        userName={session.user.user_metadata?.full_name}
        isOpen={showMoodPrompt}
        onClose={() => setShowMoodPrompt(false)}
      />
    </>
  );
}
