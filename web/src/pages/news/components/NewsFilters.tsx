import React from 'react';
import { Search, Globe, Cpu, FileText, Leaf, Filter } from 'lucide-react';
import { NewsCategory, PoliticalBias } from '../types/news.types';

interface NewsFiltersProps {
  selectedCategory: NewsCategory;
  onSelectCategory: (cat: NewsCategory) => void;
  selectedBias: PoliticalBias | 'all';
  onSelectBias: (bias: PoliticalBias | 'all') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const CATEGORIES: { id: NewsCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'Todo el Feed', icon: <Globe className="w-4 h-4" /> },
  { id: 'colombia', label: '🇨🇴 Colombia', icon: null },
  { id: 'world', label: '🌍 Internacional', icon: null },
  { id: 'tech', label: '⚡ Tecnología & IA', icon: <Cpu className="w-4 h-4" /> },
  { id: 'papers', label: '🔬 Papers Científicos', icon: <FileText className="w-4 h-4" /> },
  { id: 'environment', label: '🌱 Medio Ambiente', icon: <Leaf className="w-4 h-4" /> },
];

const BIASES: { id: PoliticalBias | 'all'; label: string; dotColor: string }[] = [
  { id: 'all', label: 'Todos los sesgos', dotColor: 'bg-slate-400' },
  { id: 'left', label: 'Izquierda / Progresista', dotColor: 'bg-rose-500' },
  { id: 'center', label: 'Centro / Fact-check', dotColor: 'bg-amber-400' },
  { id: 'right', label: 'Derecha / Conservador', dotColor: 'bg-blue-500' },
  { id: 'neutral', label: 'Neutras / Papers', dotColor: 'bg-emerald-500' },
];

export const NewsFilters: React.FC<NewsFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedBias,
  onSelectBias,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Barra de búsqueda y selector de espectro */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por titular, concepto, autor o medio (ej. 'reforma', 'arXiv', 'litio')..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all shadow-sm"
          />
        </div>

        {/* Filtro rápido de sesgo político */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Sesgo:
          </span>
          {BIASES.map((b) => {
            const isActive = selectedBias === b.id;
            return (
              <button
                key={b.id}
                onClick={() => onSelectBias(b.id)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${b.dotColor}`} />
                <span>{b.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pestañas de categorías */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-t-lg transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
                isSelected
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
