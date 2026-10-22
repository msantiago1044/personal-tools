import React, { useState, useEffect, useMemo } from 'react';
import { ModuleProps } from '../../modules/moduleRegistry';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { SidurTefilaId, SidurSegment, SidurPrayerMode } from '../../../../packages/shared/src/types';
import { ThemeMode, getStoredTheme, applyTheme } from '../../lib/theme';
import { SidurDisplayPreferences } from './types/sidur.types';
import {
  getSidurTefilot,
  getSidurTefila,
  getSuggestedTefilaId,
  getFilteredSections,
} from './services/sidurService';
import { SidurHeader } from './components/SidurHeader';
import { SidurTefilaLauncher } from './components/SidurTefilaLauncher';
import { SidurProgressBar } from './components/SidurProgressBar';
import { SidurPrayerCard } from './components/SidurPrayerCard';
import { SidurKavanaMode } from './components/SidurKavanaMode';
import { SidurBookPage } from './components/SidurBookPage';
import { BookOpen } from 'lucide-react';

export const SidurModuleContent: React.FC<ModuleProps> = ({ onBackToHub }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => getStoredTheme());
  const tefilot = useMemo(() => getSidurTefilot(), []);
  const suggestedTefilaId = useMemo(() => getSuggestedTefilaId(), []);

  // Tefilá activa (null = pantalla de selección inicial)
  const [selectedTefilaId, setSelectedTefilaId] = useState<SidurTefilaId | null>(null);

  const currentTefila = useMemo(() => {
    if (!selectedTefilaId) return null;
    return getSidurTefila(selectedTefilaId) || null;
  }, [selectedTefilaId]);

  // Sección activa ('all' o ID de sección)
  const [activeSectionId, setActiveSectionId] = useState<string | 'all'>('all');

  useEffect(() => {
    setActiveSectionId('all');
  }, [selectedTefilaId]);

  // Preferencias de lectura persistentes
  const [preferences, setPreferences] = useState<SidurDisplayPreferences>(() => {
    let prayerMode: SidurPrayerMode = 'completo';
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('sidur_prayer_mode') as SidurPrayerMode;
      if (
        savedMode === 'minian' ||
        savedMode === 'sin_minian' ||
        savedMode === 'individual' ||
        savedMode === 'rapido' ||
        savedMode === 'completo'
      ) {
        prayerMode = savedMode === 'sin_minian' ? 'individual' : savedMode;
      }
    }
    return {
      showHebrew: true,
      showTranslit: true,
      showSpanish: true,
      fontSize: 'base',
      prayerMode,
    };
  });

  const updatePreferences = (updates: Partial<SidurDisplayPreferences>) => {
    setPreferences((prev) => {
      const next = { ...prev, ...updates };
      if (updates.prayerMode && typeof window !== 'undefined') {
        localStorage.setItem('sidur_prayer_mode', updates.prayerMode);
      }
      return next;
    });
  };

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // Modal Modo Kavaná
  const [kavanaOpen, setKavanaOpen] = useState(false);

  // Secciones filtradas según el modo litúrgico (Minián / Individual / Rápido / Completo)
  const filteredSections = useMemo(() => {
    if (!currentTefila) return [];
    return getFilteredSections(currentTefila.sections, preferences.prayerMode);
  }, [currentTefila, preferences.prayerMode]);

  // Secciones a mostrar
  const displayedSections = useMemo(() => {
    if (activeSectionId === 'all') return filteredSections;
    return filteredSections.filter((s) => s.id === activeSectionId);
  }, [filteredSections, activeSectionId]);

  // Segmentos para el Modo Kavaná
  const allSegments = useMemo<SidurSegment[]>(() => {
    return filteredSections.flatMap((s) => s.segments);
  }, [filteredSections]);

  // Si no se ha elegido tefilá, mostrar pantalla de bienvenida y selección
  if (!selectedTefilaId || !currentTefila) {
    return (
      <SidurTefilaLauncher
        tefilot={tefilot}
        suggestedTefilaId={suggestedTefilaId}
        onSelectTefilaAndMode={(tefilaId, mode) => {
          setSelectedTefilaId(tefilaId);
          updatePreferences({ prayerMode: mode });
        }}
        onBackToHub={onBackToHub}
        theme={theme}
        onThemeChange={handleThemeChange}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex flex-col">
      {/* 1. Cabecera con preferencias y botón para cambiar de rezo */}
      <SidurHeader
        onBackToHub={onBackToHub}
        preferences={preferences}
        onUpdatePreferences={updatePreferences}
        onToggleKavana={() => setKavanaOpen(true)}
        theme={theme}
        onThemeChange={handleThemeChange}
        currentTefila={{
          nameSpanish: currentTefila.nameSpanish,
          nameHebrew: currentTefila.nameHebrew,
        }}
        onChangeTefila={() => setSelectedTefilaId(null)}
      />

      {/* 2. Barra de estado superior y barra vertical segmentada tipo YouTube */}
      {!kavanaOpen && (
        <SidurProgressBar
          sections={filteredSections}
          activeSectionId={activeSectionId}
          onSelectSection={setActiveSectionId}
        />
      )}

      {/* 3. Cuerpo de la Tefilá en hojas de libro */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 space-y-8">
        {displayedSections.map((section, sIdx) => (
          <SidurBookPage
            key={section.id}
            id={`section-${section.id}`}
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

        {/* Pie de página sobrio y limpio */}
        <footer className="mt-8 p-4 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 text-center flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
          <span>Núsaj Kehilot Maroko · Rito Tradicional Sefardí</span>
        </footer>
      </main>

      {/* 4. Modo Kavaná */}
      {kavanaOpen && (
        <SidurKavanaMode
          segments={allSegments}
          tefilaTitle={currentTefila.nameSpanish}
          preferences={preferences}
          theme={theme}
          onClose={() => setKavanaOpen(false)}
        />
      )}
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
