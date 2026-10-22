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
import { SidurTefilaSelector } from './components/SidurTefilaSelector';
import { SidurProgressBar } from './components/SidurProgressBar';
import { SidurSectionNav } from './components/SidurSectionNav';
import { SidurPrayerCard } from './components/SidurPrayerCard';
import { SidurKavanaMode } from './components/SidurKavanaMode';
import { SidurBookPage } from './components/SidurBookPage';
import { BookOpen } from 'lucide-react';

export const SidurModuleContent: React.FC<ModuleProps> = ({ onBackToHub }) => {
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

  // Preferencias de lectura persistentes (con los 4 modos y nombres divinos consagrados)
  const [preferences, setPreferences] = useState<SidurDisplayPreferences>(() => {
    let prayerMode: SidurPrayerMode = 'completo';
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('sidur_prayer_mode') as SidurPrayerMode;
      if (
        savedMode === 'minian' ||
        savedMode === 'sin_minian' ||
        savedMode === 'rapido' ||
        savedMode === 'completo'
      ) {
        prayerMode = savedMode;
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

  // Tema
  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // Modal Modo Kavaná
  const [kavanaOpen, setKavanaOpen] = useState(false);

  // Secciones filtradas según el modo litúrgico (Con Minián / Sin Minián / Rápido / Completo)
  const filteredSections = useMemo(
    () => getFilteredSections(currentTefila.sections, preferences.prayerMode),
    [currentTefila, preferences.prayerMode]
  );

  // Secciones a mostrar según filtro de sección seleccionada
  const displayedSections = useMemo(() => {
    if (activeSectionId === 'all') return filteredSections;
    return filteredSections.filter((s) => s.id === activeSectionId);
  }, [filteredSections, activeSectionId]);

  // Lista plana de todos los segmentos para el Modo Kavaná (respetando los filtros activos)
  const allSegments = useMemo<SidurSegment[]>(() => {
    return filteredSections.flatMap((s) => s.segments);
  }, [filteredSections]);

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex flex-col">
      {/* 1. Barra de cabecera con preferencias y herramientas */}
      <SidurHeader
        onBackToHub={onBackToHub}
        preferences={preferences}
        onUpdatePreferences={updatePreferences}
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
      />

      {/* 3. Barra de progreso subdividida estilo video de YouTube */}
      {!kavanaOpen && (
        <SidurProgressBar
          sections={filteredSections}
          activeSectionId={activeSectionId}
          onSelectSection={setActiveSectionId}
        />
      )}

      {/* 4. Navegador de Secciones */}
      <SidurSectionNav
        sections={filteredSections}
        activeSectionId={activeSectionId}
        onSelectSection={setActiveSectionId}
      />

      {/* 5. Cuerpo de la Tefilá */}
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

        {/* Pie de página tradicional con recomendación litúrgica */}
        <footer className="mt-12 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
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
          <p className="text-xs text-amber-800/80 dark:text-amber-400/80 font-serif italic max-w-lg mx-auto pt-1 border-t border-amber-900/10 dark:border-amber-400/15">
            «דַּע לִפְנֵי מִי אַתָּה עוֹמֵד: לִפְנֵי מֶלֶךְ מַלְכֵי הַמְּלָכִים הַקָּדוֹשׁ בָּרוּךְ הוּא»
            <br />
            «Sabe ante Quién estás de pie: ante el Supremo Rey de reyes, el Santo, bendito sea Él»
          </p>
        </footer>
      </main>

      {/* 6. Modal Modo Kavaná (Pantalla completa sin distracciones con tema y gestos de swipe) */}
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
