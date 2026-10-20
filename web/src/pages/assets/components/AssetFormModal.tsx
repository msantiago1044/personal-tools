import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle, Info, Calendar, DollarSign, Tag, MapPin, Shield } from 'lucide-react';
import { Asset, AssetCategory, DepreciationMethod } from '../../../../../packages/shared/src/types';
import { getDefaultCategorySettings } from '../lib/depreciationEngine';

interface AssetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: Partial<Asset>) => Promise<any>;
  assetToEdit?: Asset | null;
}

const CATEGORIES: { key: AssetCategory; label: string; icon: string; desc: string }[] = [
  { key: 'enseres', label: 'Hogar & Enseres', icon: '🛏️', desc: 'Cama, nevera, muebles, almohada, comedor' },
  { key: 'tecnologia', label: 'Tecnología & Gadgets', icon: '💻', desc: 'Laptop, smartphone, televisor, tablet' },
  { key: 'vehiculo', label: 'Vehículos', icon: '🚗', desc: 'Auto, motocicleta, bicicleta' },
  { key: 'inmueble', label: 'Bienes Raíces', icon: '🏢', desc: 'Casa, apartamento, lote, oficina' },
  { key: 'inversion', label: 'Inversión / Colección', icon: '💎', desc: 'Acciones, cripto, relojes, arte' },
  { key: 'otro', label: 'Otro Bien', icon: '📦', desc: 'Herramientas, equipos especiales' },
];

export const AssetFormModal: React.FC<AssetFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  assetToEdit,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<AssetCategory>('enseres');
  const [location, setLocation] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [depreciationMethod, setDepreciationMethod] = useState<DepreciationMethod>('lineal');
  const [usefulLifeMonths, setUsefulLifeMonths] = useState<number>(84);
  const [salvageValue, setSalvageValue] = useState<string>('0');
  const [annualRate, setAnnualRate] = useState<string>('0');
  const [warrantyExpiration, setWarrantyExpiration] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Inicializar al abrir o editar
  useEffect(() => {
    if (assetToEdit) {
      setName(assetToEdit.name);
      setCategory(assetToEdit.category);
      setLocation(assetToEdit.location || '');
      setPurchaseDate(assetToEdit.purchase_date);
      setPurchasePrice(assetToEdit.purchase_price.toString());
      setDepreciationMethod(assetToEdit.depreciation_method);
      setUsefulLifeMonths(assetToEdit.useful_life_months);
      setSalvageValue(assetToEdit.salvage_value.toString());
      setAnnualRate(assetToEdit.annual_rate.toString());
      setWarrantyExpiration(assetToEdit.warranty_expiration || '');
      setNotes(assetToEdit.notes || '');
    } else {
      // Valores por defecto para nuevo activo
      setName('');
      setCategory('enseres');
      setLocation('');
      setPurchaseDate(new Date().toISOString().split('T')[0]);
      setPurchasePrice('');
      const defaults = getDefaultCategorySettings('enseres');
      setDepreciationMethod(defaults.depreciationMethod);
      setUsefulLifeMonths(defaults.usefulLifeMonths);
      setSalvageValue('0');
      setAnnualRate(defaults.defaultAnnualRate.toString());
      setWarrantyExpiration('');
      setNotes('');
    }
  }, [assetToEdit, isOpen]);

  // Al cambiar categoría en modo creación, pre-llenar valores sugeridos
  const handleCategoryChange = (newCat: AssetCategory) => {
    setCategory(newCat);
    if (!assetToEdit) {
      const defaults = getDefaultCategorySettings(newCat);
      setDepreciationMethod(defaults.depreciationMethod);
      setUsefulLifeMonths(defaults.usefulLifeMonths);
      setAnnualRate(defaults.defaultAnnualRate.toString());
      if (purchasePrice && Number(purchasePrice) > 0) {
        const suggestedSalvage = Math.round((Number(purchasePrice) * defaults.salvagePercentage) / 100);
        setSalvageValue(suggestedSalvage.toString());
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      await onSave({
        id: assetToEdit?.id,
        name: name.trim(),
        category,
        location: location.trim(),
        purchase_date: purchaseDate,
        purchase_price: Number(purchasePrice) || 0,
        currency: 'USD',
        depreciation_method: depreciationMethod,
        useful_life_months: Number(usefulLifeMonths) || 12,
        salvage_value: Number(salvageValue) || 0,
        annual_rate: Number(annualRate) || 0,
        warranty_expiration: warrantyExpiration || undefined,
        notes: notes.trim(),
        is_active: true,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏛️</span>
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">
              {assetToEdit ? 'Editar Bien o Activo' : 'Registrar Nuevo Bien o Activo'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Selector de Categoría */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Tipo de Bien
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => handleCategoryChange(cat.key)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                    category === cat.key
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <span>{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Nombre y Ubicación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Nombre del Objeto / Bien *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Cama King Size, Nevera Samsung, Auto..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Ubicación / Espacio
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Ej. Habitación, Cocina, Garaje..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Precio de compra y Fecha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Costo / Precio de Compra ($) *
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  step="0.01"
                  required
                  min="0"
                  placeholder="0.00"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Fecha de Adquisición *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="date"
                  required
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Panel de Configuración de Depreciación / Valorización */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Regla de Depreciación o Plusvalía</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                  Método de cálculo
                </label>
                <select
                  value={depreciationMethod}
                  onChange={(e) => setDepreciationMethod(e.target.value as DepreciationMethod)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="lineal">Lineal Mensual (Enseres / Muebles)</option>
                  <option value="anual_pct">Porcentaje Anual (Autos / Gadgets)</option>
                  <option value="apreciacion">Plusvalía Anual +% (Inmuebles)</option>
                  <option value="ninguna">Sin depreciación (Valor Fijo)</option>
                </select>
              </div>

              {depreciationMethod === 'lineal' && (
                <div>
                  <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                    Vida útil estimada ({Math.round(usefulLifeMonths / 12)} años)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="6"
                      max="240"
                      step="6"
                      value={usefulLifeMonths}
                      onChange={(e) => setUsefulLifeMonths(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                    <span className="text-xs font-mono text-slate-500 w-16 text-right">
                      {usefulLifeMonths} m
                    </span>
                  </div>
                </div>
              )}

              {(depreciationMethod === 'anual_pct' || depreciationMethod === 'apreciacion') && (
                <div>
                  <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                    {depreciationMethod === 'apreciacion' ? 'Tasa de Plusvalía Anual (%)' : 'Tasa de Depreciación Anual (%)'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={annualRate}
                    onChange={(e) => setAnnualRate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs"
                  />
                </div>
              )}
            </div>

            {depreciationMethod === 'lineal' && (
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                <Info className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>
                  El objeto perderá valor de manera uniforme mes a mes hasta llegar a $
                  {salvageValue || 0}.
                </span>
              </div>
            )}
          </div>

          {/* Garantía y Notas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Vencimiento de Garantía
              </label>
              <div className="relative">
                <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="date"
                  value={warrantyExpiration}
                  onChange={(e) => setWarrantyExpiration(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Notas / Factura / Marca
              </label>
              <input
                type="text"
                placeholder="Ej. Factura #402, garantía extendida..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm shadow-lg shadow-emerald-600/25 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {saving ? 'Guardando...' : assetToEdit ? 'Actualizar Bien' : 'Guardar en Inventario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
