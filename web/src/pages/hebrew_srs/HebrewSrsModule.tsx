import React, { useState } from 'react';
import { ModuleProps } from '../../modules/moduleRegistry';
import { ThemeMode, getStoredTheme, applyTheme } from '../../lib/theme';
import { useHebrewSrsData } from './hooks/useHebrewSrsData';
import { HebrewSrsHeader } from './components/HebrewSrsHeader';
import { DailyReviewDashboard } from './components/DailyReviewDashboard';
import { ActiveSessionRunner } from './components/ActiveSessionRunner';
import { RoadmapCurriculumView } from './components/RoadmapCurriculumView';
import { MetricsDashboard } from './components/MetricsDashboard';
import { SessionCompletionModal } from './components/SessionCompletionModal';
import { Sparkles } from 'lucide-react';

export const HebrewSrsModule: React.FC<ModuleProps> = ({ user, onBackToHub }) => {
  const userId = user?.id || 'local_user';
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme());

  const {
    loading,
    blocks,
    cards,
    progress,
    logs,
    streak,
    activePhase,
    setActivePhase,
    activeTab,
    setActiveTab,
    activeSessionQueue,
    sessionTitle,
    dailyStats,
    methodMetrics,
    showCompletionModal,
    dailySummary,
    handleStartDailySession,
    handleStartFreePractice,
    handleStepComplete,
    handleSessionFinished,
    handleCloseCompletionModal,
  } = useHebrewSrsData(userId);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white animate-bounce shadow-lg shadow-indigo-600/30">
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
          Cargando entrenador de Hebreo y Siddur...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex flex-col font-sans">
      {/* Encabezado con Racha y Pestañas Simples */}
      <HebrewSrsHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        streakCount={streak.current_streak}
        theme={theme}
        onThemeChange={handleThemeChange}
        onBackToHub={onBackToHub}
      />

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* PESTAÑA 1: DASHBOARD CON LOS 2 BOTONES PRINCIPALES */}
        {activeTab === 'dashboard' && (
          <DailyReviewDashboard
            stats={dailyStats}
            blocks={blocks}
            onStartDailySession={handleStartDailySession}
            onStartFreePractice={handleStartFreePractice}
            onOpenRoadmap={() => setActiveTab('roadmap')}
          />
        )}

        {/* PESTAÑA 2: SESIÓN ACTIVA (10 PASOS INTERACTIVOS) */}
        {activeTab === 'session' && (
          <ActiveSessionRunner
            sessionTitle={sessionTitle}
            exercises={activeSessionQueue}
            progressList={progress}
            onStepComplete={handleStepComplete}
            onSessionFinished={handleSessionFinished}
            onExit={() => setActiveTab('dashboard')}
          />
        )}

        {/* PESTAÑA 3: RUTA CURRICULAR DEL SIDDUR & JUMASH */}
        {activeTab === 'roadmap' && (
          <RoadmapCurriculumView
            activePhase={activePhase}
            onSelectPhase={(phase) => setActivePhase(phase)}
          />
        )}

        {/* PESTAÑA 4: MÉTRICAS Y DIAGNÓSTICO COGNITIVO */}
        {activeTab === 'metrics' && (
          <MetricsDashboard
            metrics={methodMetrics}
            logs={logs}
            cards={cards}
          />
        )}
      </main>

      {/* MODAL DE RESUMEN AL COMPLETAR LA SESIÓN DIARIA */}
      {showCompletionModal && dailySummary && (
        <SessionCompletionModal
          summary={dailySummary}
          onFinishAndRest={() => handleCloseCompletionModal(false)}
          onGoToFreePractice={() => handleCloseCompletionModal(true)}
        />
      )}
    </div>
  );
};
