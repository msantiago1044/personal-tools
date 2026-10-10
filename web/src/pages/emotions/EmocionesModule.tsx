import React, { useState, useEffect, useMemo } from 'react';
import {
  EMOTIONS_CONFIG,
  EmotionKey,
  EmotionRecord,
  fetchEmotionRecords,
  deleteEmotionRecord,
} from '../../lib/emotions';
import { MoodCheckModal } from '../../components/MoodCheckModal';
import { ThemeMode, getStoredTheme, applyTheme } from '../../lib/theme';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Activity,
  Clock,
  Sun,
  Moon,
  Laptop,
  Smile,
  Heart,
  BarChart2,
} from 'lucide-react';

interface EmocionesModuleProps {
  user: any;
  onBackToHub: () => void;
}

export const EmocionesModule: React.FC<EmocionesModuleProps> = ({ user, onBackToHub }) => {
  const [records, setRecords] = useState<EmotionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme());
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterEmotion, setFilterEmotion] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const loadData = async () => {
    setLoading(true);
    const data = await fetchEmotionRecords(user.id);
    setRecords(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user.id]);

  const handleDelete = async (id: string) => {
    await deleteEmotionRecord(id, user.id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
    setDeleteConfirmId(null);
  };

  // Métricas y estadísticas calculadas (sin etiquetas morales de positivo/negativo)
  const stats = useMemo(() => {
    if (records.length === 0) {
      return {
        predominant: null,
        total: 0,
        uniqueCount: 0,
        uniqueDays: 0,
        counts: {} as Record<EmotionKey, number>,
      };
    }

    const counts: Record<EmotionKey, number> = {
      excelente: 0,
      bien: 0,
      calma: 0,
      cansado: 0,
      triste: 0,
      estresado: 0,
    };

    records.forEach((r) => {
      if (counts[r.emotion] !== undefined) {
        counts[r.emotion]++;
      }
    });

    let topEmotion: EmotionKey | null = null;
    let topCount = -1;

    (Object.keys(counts) as EmotionKey[]).forEach((key) => {
      if (counts[key] > topCount && counts[key] > 0) {
        topCount = counts[key];
        topEmotion = key;
      }
    });

    const uniqueCount = (Object.keys(counts) as EmotionKey[]).filter((key) => counts[key] > 0).length;
    const uniqueDays = new Set(records.map((r) => r.created_at.slice(0, 10))).size;

    return {
      predominant: topEmotion ? EMOTIONS_CONFIG[topEmotion] : null,
      total: records.length,
      uniqueCount,
      uniqueDays,
      counts,
    };
  }, [records]);

  // Filtrado de registros
  const filteredRecords = useMemo(() => {
    if (filterEmotion === 'all') return records;
    return records.filter((r) => r.emotion === filterEmotion);
  }, [records, filterEmotion]);

  const formatTimestamp = (isoDate: string) => {
    try {
      const date = new Date(isoDate);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();

      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);
      const isYesterday = date.toDateString() === yesterday.toDateString();

      const timeStr = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

      if (isToday) return `Hoy a las ${timeStr}`;
      if (isYesterday) return `Ayer a las ${timeStr}`;

      return `${date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} a las ${timeStr}`;
    } catch {
      return isoDate;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Barra superior */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHub}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Volver al Hub"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <div>
                <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  Emociones
                </h1>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                  Registro de estado de ánimo y bienestar
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Selector de Tema */}
            <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
              <button
                onClick={() => handleThemeChange('light')}
                title="Modo Claro"
                className={`p-1.5 rounded-lg text-xs transition ${
                  theme === 'light'
                    ? 'bg-white dark:bg-slate-700 text-amber-600 font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                title="Modo Oscuro"
                className={`p-1.5 rounded-lg text-xs transition ${
                  theme === 'dark'
                    ? 'bg-white dark:bg-slate-700 text-blue-500 font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleThemeChange('system')}
                title="Sistema"
                className={`p-1.5 rounded-lg text-xs transition ${
                  theme === 'system'
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Botón manual para registrar */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">¿Cómo te sientes?</span>
              <span className="sm:hidden">Registrar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Tarjetas de Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Card 1: Emoción predominante */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center text-2xl shrink-0">
              {stats.predominant ? stats.predominant.emoji : '🧘'}
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Predominante
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {stats.predominant ? stats.predominant.label : 'Sin registros aún'}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                {stats.predominant ? stats.predominant.description : 'Registra tu primer estado'}
              </p>
            </div>
          </div>

          {/* Card 2: Variabilidad Emocional (Emodiversidad) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200/60 dark:border-violet-800/60 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Variabilidad Emocional
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {stats.total > 0 ? `${stats.uniqueCount} de 6 estados` : '0 de 6 estados'}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                {stats.total > 0
                  ? `${stats.uniqueDays} ${stats.uniqueDays === 1 ? 'día registrado' : 'días registrados'}`
                  : 'Amplitud de estados reconocidos'}
              </p>
            </div>
          </div>

          {/* Card 3: Total Registros */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Total Registros
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {stats.total} {stats.total === 1 ? 'chequeo' : 'chequeos'}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Historial guardado
              </p>
            </div>
          </div>
        </div>

        {/* Desglose de Emociones */}
        {stats.total > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Distribución de tus estados
              </h3>
              <span className="text-xs text-slate-400">Total: {stats.total}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-1">
              {Object.values(EMOTIONS_CONFIG).map((item) => {
                const count = stats.counts[item.key] || 0;
                const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div
                    key={item.key}
                    className={`p-2.5 rounded-xl border ${item.borderClass} ${item.bgLightClass} text-center`}
                  >
                    <div className="text-xl mb-0.5">{item.emoji}</div>
                    <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      {item.label}
                    </p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                      {count} <span className="text-[10px] text-slate-400 font-normal">({pct}%)</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Sección de Historial */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Historial de Momentos
              </h2>
            </div>

            {/* Filtros rápidos por emoción */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                onClick={() => setFilterEmotion('all')}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition shrink-0 ${
                  filterEmotion === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
                }`}
              >
                Todos
              </button>
              {Object.values(EMOTIONS_CONFIG).map((em) => (
                <button
                  key={em.key}
                  onClick={() => setFilterEmotion(em.key)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition shrink-0 flex items-center gap-1 ${
                    filterEmotion === em.key
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span>{em.emoji}</span>
                  <span className="hidden md:inline">{em.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Listado */}
          {loading ? (
            <div className="p-12 text-center text-sm text-slate-400">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Cargando historial de emociones...
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center text-2xl mx-auto">
                🌱
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  No hay registros en esta vista
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Registra cómo te sientes ahora para empezar a construir tu historial de bienestar personal.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Registrar cómo me siento ahora</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredRecords.map((item) => {
                const config = EMOTIONS_CONFIG[item.emotion] || EMOTIONS_CONFIG.calma;
                const isConfirmingDelete = deleteConfirmId === item.id;

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="text-2xl p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shrink-0">
                        {config.emoji}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${config.colorClass}`}>
                            {config.label}
                          </span>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500">
                            &middot; {formatTimestamp(item.created_at)}
                          </span>
                        </div>
                        {item.note && (
                          <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed break-words">
                            "{item.note}"
                          </p>
                        )}
                        {!item.note && (
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 italic">
                            {config.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {isConfirmingDelete ? (
                        <div className="flex items-center gap-1 animate-in fade-in duration-150">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-[11px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-900 transition"
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="text-[11px] text-slate-400 hover:text-slate-600 px-2 py-1"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Eliminar registro"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Modal para registrar emoción manualmente */}
      <MoodCheckModal
        userId={user.id}
        userName={user.user_metadata?.full_name}
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSaved={loadData}
      />
    </div>
  );
};
