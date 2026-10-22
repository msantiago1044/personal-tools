import React, { useState, useEffect, useMemo } from 'react';
import { ModuleProps } from '../../modules/moduleRegistry';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { SidurTefilaId, SidurSegment } from '../../../../packages/shared/src/types';
import { ThemeMode, getStoredTheme, applyTheme } from '../../lib/theme';
import { SacredNameOption } from '../../lib/hebrewPhonetics';
import { SidurDisplayPreferences } from './types/sidur.types';
import {
  getSidurTefilot,
  getSidurTefila,
  getSuggestedTefilaId,
} from './services/sidurService';
import { useSidurProgress } from './hooks/useSidurProgress';
import { SidurHeader } from './components/SidurHeader';
import { SidurTefilaSelector } from './components/SidurTefilaSelector';
import { SidurSectionNav } from './components/SidurSectionNav';
import { SidurPrayerCard } from './components/SidurPrayerCard';
import { SidurKavanaMode } from './components/SidurKavanaMode';
import { SidurChatModal } from './components/SidurChatModal';
import { SidurBookPage } from './components/SidurBookPage';
import { BookOpen, Sparkles } from 'lucide-react';

export const SidurModuleContent: React.FC<ModuleProps> = ({ user, onBackToHub }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => getStoredTheme());
  const tefilot = useMemo(() => getSidurTefilot(), []);
  const suggestedTefilaId = useMemo(() => getSuggestedTefilaId(), []);

  // Tefilá activa
  const [selectedTefilaId, setSelectedTefilaId] = useState<SidurTefilaId>(() => suggestedTefilaId);
  const currentTefila = useMemo(
    () => getSidurTefila(selectedTefilaId) || tefilot[0],
    [selectedTefilaId, tefilot]
  );

  // Sección activa dentro de la tefilá ('all' o ID de sección)
  const [activeSectionId, setActiveSectionId] = useState<string | 'all'>('all');

  // Al cambiar de tefilá, reseteamos la sección a 'all'
  useEffect(() => {
    setActiveSectionId('all');
  }, [selectedTefilaId]);

  // Preferencias de lectura persistentes
  const [preferences, setPreferences] = useState<SidurDisplayPreferences>(() => {
    let sacredName: SacredNameOption = 'YHVH';
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidur_sacred_name_mode') as SacredNameOption;
      if (saved === 'Adonai' || saved === 'HaShem' || saved === 'YHVH') {
        sacredName = saved;
      }
    }
    return {
      showHebrew: true,
      showTranslit: true,
      showSpanish: true,
      fontSize: 'base',
      sacredNameMode: sacredName,
    };
  });

  const updatePreferences = (updates: Partial<SidurDisplayPreferences>) => {
    setPreferences((prev) => {
      const next = { ...prev, ...updates };
      if (updates.sacredNameMode && typeof window !== 'undefined') {
        localStorage.setItem('sidur_sacred_name_mode', updates.sacredNameMode);
      }
      return next;
    });
  };

  // Tema
  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // Progreso y racha
  const { progress, toggleCompleted } = useSidurProgress(user?.id);

  // Modales
  const [kavanaOpen, setKavanaOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // Segmentos a mostrar según sección seleccionada
  const displayedSections = useMemo(() => {
    if (activeSectionId === 'all') return currentTefila.sections;
    return currentTefila.sections.filter((s) => s.id === activeSectionId);
  }, [currentTefila, activeSectionId]);

  // Lista plana de todos los segmentos para el Modo Kavaná
  const allSegments = useMemo<SidurSegment[]>(() => {
    return currentTefila.sections.flatMap((s) => s.segments);
  }, [currentTefila]);

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex flex-col">
      {/* 1. Barra de cabecera con preferencias y herramientas */}
      <SidurHeader
        onBackToHub={onBackToHub}
        preferences={preferences}
        onUpdatePreferences={updatePreferences}
        onOpenChat={() => setChatOpen(true)}
        onToggleKavana={() => setKavanaOpen(true)}
        theme={theme}
        onThemeChange={handleThemeChange}
      />

      {/* 2. Selector de Tefilot (Shajarit, Minjá, Arvit, Birkat HaMazón, etc.) */}
      <SidurTefilaSelector
        tefilot={tefilot}
        selectedTefilaId={selectedTefilaId}
        suggestedTefilaId={suggestedTefilaId}
        onSelectTefila={setSelectedTefilaId}
        progress={progress}
        onToggleCompleted={toggleCompleted}
      />

      {/* 3. Navegador de Secciones */}
      <SidurSectionNav
        sections={currentTefila.sections}
        activeSectionId={activeSectionId}
        onSelectSection={setActiveSectionId}
      />

      {/* 4. Cuerpo de la Tefilá */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 space-y-8">
        {/* Banner descriptivo de la tefilá */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-500/15 dark:via-amber-500/5 border-l-4 border-amber-500 p-4 rounded-r-2xl">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {currentTefila.nameSpanish}
            </h2>
            <span dir="rtl" className="text-sm font-serif text-amber-700 dark:text-amber-400">
              {currentTefila.nameHebrew}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {currentTefila.description}
          </p>
        </div>

        {/* Renderizado de Secciones envueltas en Hojas de Libro Auténticas */}
        {displayedSections.map((section, sIdx) => (
          <SidurBookPage
            key={section.id}
            tefilaTitleHebrew={currentTefila.nameHebrew}
            tefilaTitleSpanish={currentTefila.nameSpanish}
            sectionTitleHebrew={section.titleHebrew}
            sectionTitleSpanish={section.titleSpanish}
            folioNumber={sIdx + 1}
          >
            {section.description && (
              <p className="text-xs text-amber-900/70 dark:text-amber-300/70 italic text-center pb-2 font-serif">
                {section.description}
              </p>
            )}

            <div className="space-y-4">
              {section.segments.map((seg, idx) => (
                <SidurPrayerCard
                  key={seg.id}
                  segment={seg}
                  preferences={preferences}
                  index={idx}
                />
              ))}
            </div>
          </SidurBookPage>
        ))}

        {/* Pie de página con recomendación de estudio y asistente */}
        <div className="mt-12 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 flex items-center justify-center mx-auto">
            <BookOpen className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Núsaj Kehilot Maroko · Rito Tradicional Sefardí
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Preservando con fidelidad las formulaciones litúrgicas de las ilustres comunidades de
            Casablanca, Tánger, Fez, Meknés y Marruecos en general.
          </p>
          <button
            onClick={() => setChatOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>¿Preguntas sobre este rezo o leyes halájicas? Consultar Guía IA</span>
          </button>
        </div>
      </main>

      {/* 5. Modal Modo Kavaná (Pantalla completa sin distracciones) */}
      {kavanaOpen && (
        <SidurKavanaMode
          segments={allSegments}
          tefilaTitle={currentTefila.nameSpanish}
          preferences={preferences}
          onClose={() => setKavanaOpen(false)}
        />
      )}

      {/* 6. Modal Asistente Litúrgico IA */}
      <SidurChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export const SidurModule: React.FC<ModuleProps> = (props) => {
  return (
    <ErrorBoundary fallbackTitle="Error al cargar el Sidur">
      <SidurModuleContent {...props} />
    </ErrorBoundary>
  );
};
