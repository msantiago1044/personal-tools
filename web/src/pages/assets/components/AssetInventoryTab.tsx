import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Filter,
  Trash2,
  Edit2,
  TrendingDown,
  TrendingUp,
  MapPin,
  ShieldCheck,
  Calendar,
  Sparkles,
  Package,
} from 'lucide-react';
import { Asset, AssetCategory } from '../../../../../packages/shared/src/types';

interface AssetInventoryTabProps {
  assets: Asset[];
  onOpenCreateModal: () => void;
  onEditAsset: (asset: Asset) => void;
  onDeleteAsset: (id: string) => void;
}

const CATEGORY_CHIPS: { key: string; label: string; icon: string }[] = [
  { key: 'all', label: 'Todos', icon: '📦' },
  { key: 'enseres', label: 'Hogar & Enseres', icon: '🛏️' },
  { key: 'tecnologia', label: 'Tecnología', icon: '💻' },
  { key: 'vehiculo', label: 'Vehículos', icon: '🚗' },
  { key: 'inmueble', label: 'Inmuebles', icon: '🏢' },
  { key: 'inversion', label: 'Inversiones', icon: '💎' },
  { key: 'otro', label: 'Otros', icon: '📁' },
];

export const AssetInventoryTab: React.FC<AssetInventoryTabProps> = ({
  assets,
  onOpenCreateModal,
  onEditAsset,
  onDeleteAsset,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtrar activos
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchCategory = selectedCategory === 'all' || asset.category === selectedCategory;
      const matchSearch =
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (asset.location && asset.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (asset.notes && asset.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [assets, selectedCategory, searchQuery]);

  // Métricas rápidas de la lista actual
  const stats = useMemo(() => {
    const totalOriginal = filteredAssets.reduce((sum, a) => sum + Number(a.purchase_price || 0), 0);
    const totalCurrent = filteredAssets.reduce((sum, a) => sum + Number(a.current_value || 0), 0);
    const netChange = totalCurrent - totalOriginal;
    return {
      count: filteredAssets.length,
      totalOriginal,
      totalCurrent,
      netChange,
    };
  }, [filteredAssets]);

  const getCategoryIcon = (cat: AssetCategory) => {
    switch (cat) {
      case 'enseres': return '🛏️';
      case 'tecnologia': return '💻';
      case 'vehiculo': return '🚗';
      case 'inmueble': return '🏢';
      case 'inversion': return '💎';
      default: return '📦';
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra Superior: Búsqueda y Botón Nuevo */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por nombre, habitación o marca..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
        </div>

        <button
          onClick={onOpenCreateModal}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Bien o Activo</span>
        </button>
      </div>

      {/* Selector de Categorías (Chips) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORY_CHIPS.map((chip) => (
          <button
            key={chip.key}
            onClick={() => setSelectedCategory(chip.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === chip.key
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <span>{chip.icon}</span>
            <span>{chip.label}</span>
          </button>
        ))}
      </div>

      {/* Mini Resumen del Inventario */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Bienes Registrados
          </span>
          <span className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1 block">
            {stats.count}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Costo Original
          </span>
          <span className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1 block font-mono">
            ${stats.totalOriginal.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Valor Estimado Hoy
          </span>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block font-mono">
            ${stats.totalCurrent.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Variación / Depreciación
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            {stats.netChange >= 0 ? (
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-rose-500" />
            )}
            <span
              className={`text-lg font-bold font-mono ${
                stats.netChange >= 0 ? 'text-emerald-500' : 'text-rose-500'
              }`}
            >
              {stats.netChange >= 0 ? '+' : ''}
              ${Math.abs(stats.netChange).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>

      {/* Grid de Tarjetas de Activos */}
      {filteredAssets.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40">
          <Package className="w-12 h-12 text-slate-400 mx-auto mb-3 stroke-[1.5]" />
          <h4 className="text-base font-semibold text-slate-800 dark:text-slate-100">
            No hay bienes registrados aún
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            Comienza inventariando tus compras duraderas: tu cama, nevera, laptop, vehículo o apartamento.
          </p>
          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-all"
          >
            + Registrar mi primer bien
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map((asset) => {
            const original = Number(asset.purchase_price) || 0;
            const current = Number(asset.current_value) || 0;
            const diff = current - original;
            const pct = original > 0 ? Math.round((current / original) * 100) : 100;
            const isAppreciated = diff > 0;

            return (
              <div
                key={asset.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Fila superior: Categoría + Acciones */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <span>{getCategoryIcon(asset.category)}</span>
                      <span className="capitalize">{asset.category}</span>
                    </span>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditAsset(asset)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`¿Seguro que deseas eliminar "${asset.name}" de tu inventario?`)) {
                            onDeleteAsset(asset.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Título y Ubicación */}
                  <h4 className="font-semibold text-base text-slate-800 dark:text-slate-100 line-clamp-1">
                    {asset.name}
                  </h4>
                  {asset.location && (
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{asset.location}</span>
                    </div>
                  )}

                  {/* Comparativa de Valores */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                        Valor Hoy
                      </span>
                      <span className="text-xl font-bold text-slate-800 dark:text-slate-100 font-mono">
                        ${current.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                        Costo Compra
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono line-through">
                        ${original.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>

                  {/* Barra de Vida Útil / Porcentaje */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-500">
                        {isAppreciated ? 'Plusvalía acumulada' : 'Valor conservado'}
                      </span>
                      <span
                        className={`font-semibold font-mono ${
                          isAppreciated ? 'text-emerald-500' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {isAppreciated ? `+${Math.round(((current - original) / original) * 100)}%` : `${pct}%`}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isAppreciated
                            ? 'bg-emerald-500'
                            : pct > 50
                            ? 'bg-emerald-500'
                            : pct > 20
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(5, pct))}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer de Tarjeta con Garantía o Fecha */}
                <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{asset.purchase_date}</span>
                  </div>

                  {asset.warranty_expiration && (
                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Garantía {asset.warranty_expiration}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
