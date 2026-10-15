import React, { useState } from 'react';
import { ModuleProps } from '../../modules/moduleRegistry';
import { ThemeMode, getStoredTheme, applyTheme } from '../../lib/theme';
import { useHebrewSrsData } from './hooks/useHebrewSrsData';
import { HebrewSrsHeader } from './components/HebrewSrsHeader';
import { InteractiveCard } from './components/InteractiveCard';
import { DailyReviewDashboard } from './components/DailyReviewDashboard';
import { MetricsDashboard } from './components/MetricsDashboard';
import { BlockSettingsView } from './components/BlockSettingsView';
import { CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';

export const HebrewSrsModule: React.FC<ModuleProps> = ({ user, onBackToHub }) => {
  const userId = user?.id || 'local_user';
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme());

  const {
    loading,
    blocks,
    cards,
    progress,
    logs,
    blockSettings,
    selectedBlockId,
    setSelectedBlockId,
    activeTab,
    setActiveTab,
    dueCards,
    currentStudyCard,
    currentCardMethod,
    studyCardIndex,
    setStudyCardIndex,
    dailyStats,
    methodMetrics,
    handleReviewCard,
    handleUpdateBlockMethod,
  } = useHebrewSrsData(userId);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const handleStartStudySession = (blockId?: string) => {
    if (blockId) setSelectedBlockId(blockId);
    setStudyCardIndex(0);
    setActiveTab('study');
  };

  // Mapa rápido de progreso para saber el nivel Leitner de la tarjeta activa
  const currentCardProgress = progress.find((p) => p.card_id === currentStudyCard?.id);
  const currentLevel = currentCardProgress?.srs_level || 1;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white animate-bounce shadow-lg shadow-indigo-600/30">
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
          Cargando laboratorio de Hebreo SRS...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex flex-col font-sans">
      {/* Encabezado Principal */}
      <HebrewSrsHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingCount={dueCards.length}
        theme={theme}
        onThemeChange={handleThemeChange}
        onBackToHub={onBackToHub}
      />

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* PESTAÑA 1: ESTUDIO INTERACTIVO (TARJETA CON CRONÓMETRO) */}
        {activeTab === 'study' && (
          <div className="py-4">
            {dueCards.length > 0 && currentStudyCard ? (
              <InteractiveCard
                card={currentStudyCard}
                method={currentCardMethod}
                currentLevel={currentLevel}
                totalDueCount={dueCards.length}
                currentIndex={studyCardIndex}
                onRate={(rating, reactionTimeMs, tactileVerified) => {
                  handleReviewCard(rating, reactionTimeMs, tactileVerified);
                }}
              />
            ) : (
              /* Estado cuando no hay pendientes */
              <div className="max-w-md mx-auto text-center py-12 px-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  ¡Sesión de Repaso Completada!
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Has repasado todas las tarjetas programadas para hoy según sus intervalos de
                  reposo.
                </p>
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => setActiveTab('metrics')}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors"
                  >
                    Ver Métricas de Retención
                  </button>
                  <button
                    onClick={() => {
                      setSelectedBlockId('all');
                      setActiveTab('dashboard');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Volver al Dashboard</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA 2: DASHBOARD DE REPASOS Y CAJAS LEITNER */}
        {activeTab === 'dashboard' && (
          <DailyReviewDashboard
            blocks={blocks}
            stats={dailyStats}
            blockSettings={blockSettings}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
            onStartStudy={handleStartStudySession}
            onOpenSettings={() => setActiveTab('blocks')}
          />
        )}

        {/* PESTAÑA 3: MÉTRICAS Y COMPARATIVA EXPERIMENTAL */}
        {activeTab === 'metrics' && (
          <MetricsDashboard
            metrics={methodMetrics}
            logs={logs}
            cards={cards}
          />
        )}

        {/* PESTAÑA 4: CONFIGURACIÓN DE BLOQUES Y MÉTODOS */}
        {activeTab === 'blocks' && (
          <BlockSettingsView
            blocks={blocks}
            blockSettings={blockSettings}
            onUpdateMethod={handleUpdateBlockMethod}
          />
        )}
      </main>
    </div>
  );
};
