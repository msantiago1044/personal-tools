import React, { useState, useEffect, useMemo } from 'react';
import { ModuleProps } from '../../modules/moduleRegistry';
import { ThemeMode, getStoredTheme, applyTheme } from '../../lib/theme';
import { PGN_MODULES, PGN_CLASSES } from './data/pgnCurriculumData';
import { UserPgnProgress, AnswerKey } from './types/pgn.types';
import { ClassViewer } from './components/ClassViewer';
import { ExamRunner } from './components/ExamRunner';
import { SummaryDashboard } from './components/SummaryDashboard';
import {
  ArrowLeft,
  Sun,
  Moon,
  Laptop,
  BookOpen,
  Award,
  BarChart3,
  Search,
  CheckCircle,
  Filter,
} from 'lucide-react';

export const PgnPrepModule: React.FC<ModuleProps> = ({ user, onBackToHub }) => {
  const userId = user?.id || 'local_user';
  const storageKey = `pgn_prep_progress_${userId}`;

  // Estado de temas
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme());

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // Progreso persistente
  const [progress, setProgress] = useState<UserPgnProgress>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error leyendo progreso PGN:', e);
    }
    return {
      completedClasses: [],
      checkpointAnswers: {},
      examResults: {},
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch (e) {
      console.warn('Error guardando progreso PGN:', e);
    }
  }, [progress, storageKey]);

  // Vistas y navegación
  const [activeTab, setActiveTab] = useState<'dashboard' | 'classes' | 'exams'>('dashboard');
  const [selectedClassId, setSelectedClassId] = useState<number>(1);
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Clases filtradas por búsqueda y módulo
  const filteredClasses = useMemo(() => {
    let list = PGN_CLASSES;

    if (selectedModuleFilter !== 'all') {
      list = list.filter((c) => c.moduleId === selectedModuleFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.conceptCapsule.toLowerCase().includes(q) ||
          c.objective.toLowerCase().includes(q) ||
          c.legalBasis.toLowerCase().includes(q)
      );
    }

    return list;
  }, [selectedModuleFilter, searchQuery]);

  const currentClass = useMemo(() => {
    return PGN_CLASSES.find((c) => c.id === selectedClassId) || PGN_CLASSES[0];
  }, [selectedClassId]);

  const handleToggleComplete = (classId: number) => {
    setProgress((prev) => {
      const exists = prev.completedClasses.includes(classId);
      const updated = exists
        ? prev.completedClasses.filter((id) => id !== classId)
        : [...prev.completedClasses, classId];
      return { ...prev, completedClasses: updated };
    });
  };

  const handleSaveAnswer = (classId: number, answer: AnswerKey) => {
    setProgress((prev) => ({
      ...prev,
      checkpointAnswers: { ...prev.checkpointAnswers, [classId]: answer },
    }));
  };

  const handleSaveExamResult = (examId: string, score: number, total: number, passed: boolean) => {
    setProgress((prev) => ({
      ...prev,
      examResults: {
        ...prev.examResults,
        [examId]: {
          score,
          total,
          percentage: Math.round((score / total) * 100),
          passed,
          date: new Date().toISOString(),
        },
      },
    }));
  };

  const currentIndex = PGN_CLASSES.findIndex((c) => c.id === selectedClassId);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < PGN_CLASSES.length - 1;

  const handlePrevClass = () => {
    if (hasPrev) setSelectedClassId(PGN_CLASSES[currentIndex - 1].id);
  };

  const handleNextClass = () => {
    if (hasNext) setSelectedClassId(PGN_CLASSES[currentIndex + 1].id);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Header Fijo */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHub}
              title="Volver al Hub"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                  PGN 3PU-15
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  Mérito 2026
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Preparación intensiva al mérito • Universidad de Antioquia
              </p>
            </div>
          </div>

          {/* Navegación por Tabs principales */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Panel</span>
            </button>

            <button
              onClick={() => setActiveTab('classes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'classes'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>40 Clases</span>
            </button>

            <button
              onClick={() => setActiveTab('exams')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'exams'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Simulacros</span>
            </button>
          </div>

          {/* Selector de tema */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => handleThemeChange('light')}
              title="Claro"
              className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                theme === 'light' ? 'bg-amber-100 text-amber-700 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              title="Oscuro"
              className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                theme === 'dark' ? 'bg-blue-100 text-blue-700 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleThemeChange('system')}
              title="Sistema"
              className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                theme === 'system' ? 'bg-emerald-100 text-emerald-700 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'dashboard' && (
          <SummaryDashboard
            progress={progress}
            onSelectClass={(id) => {
              setSelectedClassId(id);
              setActiveTab('classes');
            }}
            onSelectModule={(modId) => {
              setSelectedModuleFilter(modId);
              setActiveTab('classes');
            }}
          />
        )}

        {activeTab === 'classes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Barra lateral de selección de clases */}
            <aside className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-4 lg:sticky lg:top-24 max-h-[82vh] flex flex-col">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                  Índice de Clases (1 a 40)
                </h3>

                {/* Filtro de búsqueda */}
                <div className="relative mb-2.5">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar tema, norma o caso..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Filtro por Módulo */}
                <div className="flex gap-1 overflow-x-auto pb-1 text-xs no-scrollbar">
                  <button
                    onClick={() => setSelectedModuleFilter('all')}
                    className={`px-2 py-1 rounded-lg shrink-0 font-medium cursor-pointer ${
                      selectedModuleFilter === 'all'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Todos
                  </button>
                  {PGN_MODULES.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedModuleFilter(m.id)}
                      className={`px-2 py-1 rounded-lg shrink-0 font-medium cursor-pointer ${
                        selectedModuleFilter === m.id
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      M{m.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista scrollable de clases */}
              <div className="overflow-y-auto space-y-1.5 flex-1 pr-1">
                {filteredClasses.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">
                    No se encontraron clases con este filtro.
                  </p>
                ) : (
                  filteredClasses.map((cls) => {
                    const isSelected = cls.id === selectedClassId;
                    const isCompleted = progress.completedClasses.includes(cls.id);
                    const isAnswered = !!progress.checkpointAnswers[cls.id];

                    return (
                      <button
                        key={cls.id}
                        onClick={() => setSelectedClassId(cls.id)}
                        className={`w-full text-left p-2.5 rounded-xl border transition flex items-start justify-between gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/60 shadow-xs'
                            : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-slate-400">
                              C{cls.id}
                            </span>
                            <span className="text-[10px] text-slate-400 truncate">
                              Sem {cls.week}
                            </span>
                          </div>
                          <p
                            className={`text-xs font-semibold truncate ${
                              isSelected
                                ? 'text-emerald-950 dark:text-emerald-200'
                                : 'text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {cls.title}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 mt-0.5">
                          {isAnswered && (
                            <span className="w-2 h-2 rounded-full bg-purple-500" title="Checkpoint resuelto" />
                          )}
                          {isCompleted && (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </aside>

            {/* Contenido de la Clase Seleccionada */}
            <div className="lg:col-span-8">
              <ClassViewer
                currentClass={currentClass}
                isCompleted={progress.completedClasses.includes(currentClass.id)}
                savedAnswer={progress.checkpointAnswers[currentClass.id]}
                onToggleComplete={handleToggleComplete}
                onSaveAnswer={handleSaveAnswer}
                onPrevClass={handlePrevClass}
                onNextClass={handleNextClass}
                hasPrev={hasPrev}
                hasNext={hasNext}
              />
            </div>
          </div>
        )}

        {activeTab === 'exams' && (
          <ExamRunner onSaveExamResult={handleSaveExamResult} />
        )}
      </main>
    </div>
  );
};
