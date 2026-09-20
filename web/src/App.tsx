import React, { useEffect, useState } from 'react';
import { supabase, signOut } from './lib/supabase';
import { LoginPage } from './pages/LoginPage';
import { ToolHub } from './components/ToolHub';
import { FinanceModule } from './pages/finance/FinanceModule';
import { TehilimModule } from './pages/tehilim/TehilimModule';
import { DwgViewerModule } from './pages/cad/DwgViewerModule';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'hub' | 'finance' | 'tehilim' | 'dwg_viewer'>('hub');

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
        onBackToHub={() => setCurrentView('hub')}
      />
    );
  }

  // Si está en el módulo de Tehilim (150 Salmos)
  if (currentView === 'tehilim') {
    return (
      <TehilimModule
        user={session.user}
        onBackToHub={() => setCurrentView('hub')}
      />
    );
  }

  // Si está en el módulo de Visor de Planos DWG / CAD
  if (currentView === 'dwg_viewer') {
    return (
      <DwgViewerModule
        onBackToHub={() => setCurrentView('hub')}
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
          setCurrentView('finance');
        } else if (route.startsWith('/tehilim')) {
          setCurrentView('tehilim');
        } else if (route.startsWith('/cad-viewer') || route.startsWith('/dwg')) {
          setCurrentView('dwg_viewer');
        }
      }}
      onLogout={() => signOut()}
    />
  );
}
