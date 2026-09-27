import React, { useEffect, useState, useCallback } from 'react';
import { supabase, signOut } from './lib/supabase';
import { LoginPage } from './pages/LoginPage';
import { ToolHub } from './components/ToolHub';
import { FinanceModule } from './pages/finance/FinanceModule';
import { TehilimModule } from './pages/tehilim/TehilimModule';
import { DwgViewerModule } from './pages/cad/DwgViewerModule';

type ViewType = 'hub' | 'finance' | 'tehilim' | 'dwg_viewer';

function getViewFromLocation(): ViewType {
  const hash = window.location.hash.toLowerCase();
  const path = window.location.pathname.toLowerCase();

  if (hash.includes('finance') || path.startsWith('/finance')) return 'finance';
  if (hash.includes('tehilim') || path.startsWith('/tehilim')) return 'tehilim';
  if (hash.includes('cad') || hash.includes('dwg') || path.startsWith('/cad') || path.startsWith('/dwg')) return 'dwg_viewer';
  if (hash.includes('hub')) return 'hub';

  // Fallback con localStorage si el hash está vacío
  const saved = localStorage.getItem('app_current_view') as ViewType;
  if (saved && ['hub', 'finance', 'tehilim', 'dwg_viewer'].includes(saved)) {
    return saved;
  }

  return 'hub';
}

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>(getViewFromLocation);

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

  useEffect(() => {
    // 1. Obtener sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Suscribirse a cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  // Si hay sesión y está en el módulo de Finanzas
  if (currentView === 'finance') {
    return (
      <FinanceModule
        user={session.user}
        onBackToHub={() => changeView('hub')}
      />
    );
  }

  // Si está en el módulo de Tehilim (150 Salmos)
  if (currentView === 'tehilim') {
    return (
      <TehilimModule
        user={session.user}
        onBackToHub={() => changeView('hub')}
      />
    );
  }

  // Si está en el módulo de Visor de Planos DWG / CAD
  if (currentView === 'dwg_viewer') {
    return (
      <DwgViewerModule
        onBackToHub={() => changeView('hub')}
      />
    );
  }

  // Vista por defecto post-login: Tool Hub (Launcher de Herramientas)
  return (
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
        }
      }}
      onLogout={() => {
        localStorage.removeItem('app_current_view');
        window.location.hash = '';
        signOut();
      }}
    />
  );
}
