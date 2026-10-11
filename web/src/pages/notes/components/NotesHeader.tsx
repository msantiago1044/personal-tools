import React from 'react';
import {
  NoteTab,
  NoteLayout,
  NoteColorKey,
  NOTE_COLORS,
} from '../types/note.types';
import { ThemeMode } from '../../../lib/theme';
import {
  ArrowLeft,
  Search,
  X,
  LayoutGrid,
  List,
  StickyNote,
  Archive,
  Trash2,
  Sun,
  Moon,
  Laptop,
  Tag,
  Filter,
} from 'lucide-react';

interface NotesHeaderProps {
  onBackToHub: () => void;
  activeTab: NoteTab;
  onTabChange: (tab: NoteTab) => void;
  layout: NoteLayout;
  onLayoutChange: (layout: NoteLayout) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  allTags: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
  selectedColor: NoteColorKey | null;
  onColorSelect: (color: NoteColorKey | null) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onEmptyTrash?: () => void;
  trashCount?: number;
}

export const NotesHeader: React.FC<NotesHeaderProps> = ({
  onBackToHub,
  activeTab,
  onTabChange,
  layout,
  onLayoutChange,
  searchQuery,
  onSearchChange,
  allTags,
  selectedTag,
  onTagSelect,
  selectedColor,
  onColorSelect,
  theme,
  onThemeChange,
  onEmptyTrash,
  trashCount = 0,
}) => {
  const colorKeys = Object.keys(NOTE_COLORS) as NoteColorKey[];

  return (
    <header className="sticky top-0 z-30 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-3 space-y-3">
        {/* Fila Principal: Volver, Título, Buscador, Controles */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Lado izquierdo: Botón volver + Título */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToHub}
              title="Volver al Hub principal"
              className="p-2 -ml-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xl">📝</span>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Notas & Keep
              </h1>
            </div>
          </div>

          {/* Centro: Buscador estilo Keep */}
          <div className="flex-1 max-w-md relative">
            <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-3.5 py-2 shadow-xs focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/20 transition">
              <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar notas, listas, etiquetas..."
                className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Lado derecho: Selector de vista y selector de tema */}
          <div className="flex items-center justify-end gap-2">
            {/* Toggle Grid vs List */}
            <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 shadow-xs">
              <button
                type="button"
                onClick={() => onLayoutChange('grid')}
                title="Vista en cuadrícula"
                className={`p-1.5 rounded-lg transition ${
                  layout === 'grid'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onLayoutChange('list')}
                title="Vista en lista"
                className={`p-1.5 rounded-lg transition ${
                  layout === 'list'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Tema Claro / Oscuro / Sistema */}
            <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 shadow-xs">
              <button
                type="button"
                onClick={() => onThemeChange('light')}
                title="Tema claro"
                className={`p-1.5 rounded-lg transition ${
                  theme === 'light'
                    ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onThemeChange('dark')}
                title="Tema oscuro"
                className={`p-1.5 rounded-lg transition ${
                  theme === 'dark'
                    ? 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onThemeChange('system')}
                title="Tema del sistema"
                className={`p-1.5 rounded-lg transition ${
                  theme === 'system'
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Fila Secundaria: Pestañas de Navegación y Filtros */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
          {/* Pestañas estilo Keep */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              type="button"
              onClick={() => onTabChange('notes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'notes'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <StickyNote className="w-3.5 h-3.5" /> Notas
            </button>

            <button
              type="button"
              onClick={() => onTabChange('archived')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'archived'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Archive className="w-3.5 h-3.5" /> Archivadas
            </button>

            <button
              type="button"
              onClick={() => onTabChange('trash')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'trash'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" /> Papelera
            </button>
          </div>

          {/* Botón vaciar papelera si estamos en papelera */}
          {activeTab === 'trash' && trashCount > 0 && onEmptyTrash && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('¿Seguro que deseas vaciar la papelera? Esta acción no se puede deshacer.')) {
                  onEmptyTrash();
                }
              }}
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
            >
              <Trash2 className="w-3.5 h-3.5" /> Vaciar papelera
            </button>
          )}

          {/* Filtros rápidos: Etiquetas y Colores */}
          {activeTab !== 'trash' && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {/* Filtro por color */}
              <div className="flex items-center gap-1 pl-2 border-l border-slate-200 dark:border-slate-800">
                {selectedColor && (
                  <button
                    type="button"
                    onClick={() => onColorSelect(null)}
                    title="Quitar filtro de color"
                    className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
                {colorKeys.map((cKey) => {
                  if (cKey === 'default') return null;
                  const config = NOTE_COLORS[cKey];
                  const isSelected = selectedColor === cKey;
                  return (
                    <button
                      key={cKey}
                      type="button"
                      onClick={() => onColorSelect(isSelected ? null : cKey)}
                      title={`Filtrar por ${config.name}`}
                      className={`w-5 h-5 rounded-full transition-transform ${
                        isSelected ? 'scale-125 ring-2 ring-emerald-500 ring-offset-1' : 'hover:scale-110 opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: config.dotColor }}
                    />
                  );
                })}
              </div>

              {/* Filtro por etiquetas */}
              {allTags.length > 0 && (
                <div className="flex items-center gap-1 pl-2 border-l border-slate-200 dark:border-slate-800">
                  {selectedTag && (
                    <button
                      type="button"
                      onClick={() => onTagSelect(null)}
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40"
                    >
                      #{selectedTag} <X className="w-3 h-3" />
                    </button>
                  )}
                  {!selectedTag &&
                    allTags.slice(0, 5).map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => onTagSelect(tag)}
                        className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition"
                      >
                        #{tag}
                      </button>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
