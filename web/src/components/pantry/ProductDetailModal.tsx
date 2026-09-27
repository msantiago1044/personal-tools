import React, { useState, useMemo } from 'react';
import {
  X,
  Droplet,
  Globe,
  Leaf,
  Zap,
  Flame,
  ShieldCheck,
  AlertTriangle,
  Info,
  Calendar,
  Sparkles,
  ShoppingBag,
  Activity,
  Heart,
  ChevronRight,
  TrendingDown,
  Layers,
  Utensils,
  Package,
  DollarSign,
  Pencil,
  Save,
  Check,
} from 'lucide-react';
import { PantryItem } from '../../../../packages/shared/src/types';
import { getFoodIntelligence, FoodIntelligenceData } from '../../lib/pantryFoodIntelligence';

const PANTRY_CATEGORIES = [
  'Proteínas',
  'Lácteos',
  'Granos & Cereales',
  'Frutas & Verduras',
  'Aseo & Limpieza',
  'Mascotas',
  'Snacks & Bebidas',
  'Condimentos & Aceites',
  'Panadería',
  'Despensa',
];

interface ProductDetailModalProps {
  item: PantryItem;
  onClose: () => void;
  onConsume?: (item: PantryItem, full?: boolean) => void;
  onUpdateItem?: (updatedItem: PantryItem) => void | Promise<void>;
  initialEditMode?: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  item,
  onClose,
  onConsume,
  onUpdateItem,
  initialEditMode = false,
}) => {
  const [currentItem, setCurrentItem] = useState<PantryItem>(item);
  const [activeSubTab, setActiveSubTab] = useState<'balance' | 'nutrition' | 'isa' | 'economics'>('balance');

  // Helper robusto para admitir decimales con punto (.) o coma (,)
  const parseDecimal = (val: string | number): number => {
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    if (!val || String(val).trim() === '') return 0;
    const clean = String(val).replace(',', '.').trim();
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
  };

  const foodData: FoodIntelligenceData = useMemo(() => {
    return getFoodIntelligence(currentItem);
  }, [currentItem]);

  // Estado de Edición Individual (Cantidad, Unidad, Precios y Nutrición Completa)
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [editName, setEditName] = useState(item.name);
  const [editCategory, setEditCategory] = useState(item.category || 'Despensa');
  const [editQuantity, setEditQuantity] = useState(String(item.quantity));
  const [editUnit, setEditUnit] = useState(item.unit || 'un');
  const [editUnitPrice, setEditUnitPrice] = useState(item.unit_price !== undefined ? String(item.unit_price) : '');
  const [editTotalPrice, setEditTotalPrice] = useState(
    item.total_price !== undefined
      ? String(item.total_price)
      : item.unit_price
      ? String(Math.round(Number(item.unit_price) * Number(item.quantity) * 100) / 100)
      : ''
  );
  const [editShelfLife, setEditShelfLife] = useState(String(item.shelf_life_days || 14));

  // Datos nutricionales editables
  const [editServingSize, setEditServingSize] = useState(
    item.serving_size || foodData.nutrition.servingSize || '100g o 1 porción'
  );
  const [editCalories, setEditCalories] = useState(
    String(item.calories_per_unit || foodData.nutrition.calories || '')
  );
  const [editProtein, setEditProtein] = useState(
    item.protein_g !== undefined ? String(item.protein_g) : String(foodData.nutrition.protein_g ?? 0)
  );
  const [editCarbs, setEditCarbs] = useState(
    item.carbs_g !== undefined ? String(item.carbs_g) : String(foodData.nutrition.carbs_g ?? 0)
  );
  const [editSugar, setEditSugar] = useState(
    item.sugar_g !== undefined ? String(item.sugar_g) : String(foodData.nutrition.sugar_g ?? 0)
  );
  const [editFiber, setEditFiber] = useState(
    item.fiber_g !== undefined ? String(item.fiber_g) : String(foodData.nutrition.fiber_g ?? 0)
  );
  const [editFat, setEditFat] = useState(
    item.fat_g !== undefined ? String(item.fat_g) : String(foodData.nutrition.fat_g ?? 0)
  );
  const [editSatFat, setEditSatFat] = useState(
    item.saturated_fat_g !== undefined ? String(item.saturated_fat_g) : String(foodData.nutrition.saturated_fat_g ?? 0)
  );
  const [editSodium, setEditSodium] = useState(
    item.sodium_mg !== undefined ? String(item.sodium_mg) : String(foodData.nutrition.sodium_mg ?? 0)
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  const { nutrition, isa, economics, isaScore, isaGrade, nutriEcoBalance, balanceExplanation } = foodData;

  // Manejadores sincronizados de cambios numéricos con soporte para decimales
  const handleQuantityChange = (val: string) => {
    const sanitized = val.replace(/[^0-9.,]/g, '');
    setEditQuantity(sanitized);
    const q = parseDecimal(sanitized);
    const tot = parseDecimal(editTotalPrice);
    const p = parseDecimal(editUnitPrice);
    if (q > 0 && tot > 0) {
      setEditUnitPrice(String(Math.round((tot / q) * 100) / 100));
    } else if (q > 0 && p > 0) {
      setEditTotalPrice(String(Math.round(q * p * 100) / 100));
    }
  };

  const handleUnitPriceChange = (val: string) => {
    const sanitized = val.replace(/[^0-9.,]/g, '');
    setEditUnitPrice(sanitized);
    const p = parseDecimal(sanitized);
    const q = parseDecimal(editQuantity);
    if (p > 0 && q > 0) {
      setEditTotalPrice(String(Math.round(p * q * 100) / 100));
    }
  };

  const handleTotalPriceChange = (val: string) => {
    const sanitized = val.replace(/[^0-9.,]/g, '');
    setEditTotalPrice(sanitized);
    const tot = parseDecimal(sanitized);
    const q = parseDecimal(editQuantity);
    if (tot > 0 && q > 0) {
      setEditUnitPrice(String(Math.round((tot / q) * 100) / 100));
    }
  };

  const handleDecimalInput = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value.replace(/[^0-9.,]/g, ''));
  };

  // Cálculos en tiempo real para el calculador interactivo de costo y rendimiento
  const parsedEditQty = parseDecimal(editQuantity);
  const parsedEditTotal = parseDecimal(editTotalPrice);
  const parsedEditUnitP = parseDecimal(editUnitPrice);
  const activeTotalPrice = parsedEditTotal > 0 ? parsedEditTotal : parsedEditUnitP * parsedEditQty;
  const activeUnitPrice =
    parsedEditUnitP > 0
      ? parsedEditUnitP
      : parsedEditQty > 0 && activeTotalPrice > 0
      ? activeTotalPrice / parsedEditQty
      : 0;

  const cleanUnit = (editUnit || '').toLowerCase().trim();
  const isVolumeUnit =
    cleanUnit === 'ml' ||
    cleanUnit.includes('mili') ||
    cleanUnit.includes('mililitro') ||
    cleanUnit === 'cc' ||
    cleanUnit === 'cm3' ||
    cleanUnit === 'l' ||
    cleanUnit === 'lt' ||
    cleanUnit === 'lts' ||
    cleanUnit.includes('litro');

  const isLiter = cleanUnit === 'l' || cleanUnit === 'lt' || cleanUnit === 'lts' || cleanUnit.includes('litro');
  const isGram = cleanUnit === 'g' || cleanUnit === 'gr' || cleanUnit === 'grs' || cleanUnit.includes('gram');
  const isKg = cleanUnit.includes('kg') || cleanUnit.includes('kilo');
  const isPound = cleanUnit.includes('lb') || cleanUnit.includes('libra');

  // Densidad alimentaria específica del producto (ej. Aceite = 0.92, Leche = 1.03, General = 1.0)
  const isCookingOil = (editName || currentItem.name).toLowerCase().includes('aceite');
  const isDairyMilk = (editName || currentItem.name).toLowerCase().includes('leche');
  const productDensity = isCookingOil ? 0.92 : isDairyMilk ? 1.03 : 1.0;

  // Equivalencias exactas en ml y gramos
  let calculatedMl = 0;
  let calculatedGrams = 0;

  if (isVolumeUnit) {
    calculatedMl = isLiter ? parsedEditQty * 1000 : parsedEditQty;
    calculatedGrams = Math.round(calculatedMl * productDensity);
  } else if (isGram || isKg || isPound) {
    calculatedGrams = isKg ? parsedEditQty * 1000 : isPound ? parsedEditQty * 500 : parsedEditQty;
    calculatedMl = Math.round(calculatedGrams / productDensity);
  } else {
    // Si la unidad es libre (ej. unidades, paquetes, latas)
    const matchNameMl = (editName || currentItem.name).match(/(\d+)\s*(ml|mililitros|cc|l|litros)\b/i);
    const matchNameGr = (editName || currentItem.name).match(/(\d+)\s*(g|gr|gramos|kg|kilos)\b/i);
    if (matchNameMl) {
      const val = parseFloat(matchNameMl[1]);
      calculatedMl = matchNameMl[2].toLowerCase().startsWith('l') ? val * 1000 : val;
      calculatedGrams = Math.round(calculatedMl * productDensity);
    } else if (matchNameGr) {
      const val = parseFloat(matchNameGr[1]);
      calculatedGrams = matchNameGr[2].toLowerCase().startsWith('k') ? val * 1000 : val;
      calculatedMl = Math.round(calculatedGrams / productDensity);
    } else {
      calculatedGrams = parsedEditQty * 100;
      calculatedMl = calculatedGrams;
    }
  }

  // Costos equivalentes en tiempo real
  const costPerMl = calculatedMl > 0 && activeTotalPrice > 0 ? activeTotalPrice / calculatedMl : 0;
  const costPerLiter = costPerMl * 1000;
  const costPerGram = calculatedGrams > 0 && activeTotalPrice > 0 ? activeTotalPrice / calculatedGrams : 0;
  const costPer100g = costPerGram * 100;
  const costPerKg = costPerGram * 1000;
  const costPer100ml = costPerMl * 100;

  // Porción de consumo
  let portionGrams = 100;
  if (editServingSize.includes('14g') || editServingSize.includes('15ml')) portionGrams = 14;
  else if (editServingSize.includes('10g')) portionGrams = 10;
  else if (editServingSize.includes('50g')) portionGrams = 50;
  else if (editServingSize.includes('80g')) portionGrams = 80;
  else if (editServingSize.includes('120g')) portionGrams = 120;
  else if (editServingSize.includes('250ml') || editServingSize.includes('250g')) portionGrams = 250;

  const costPerServing = isVolumeUnit
    ? costPerMl * (portionGrams / productDensity)
    : costPerGram * portionGrams;
  const approxServings = calculatedGrams > 0 && portionGrams > 0 ? Math.round(calculatedGrams / portionGrams) : 0;

  const handleApplyUnit = (targetUnit: 'mililitros' | 'litros' | 'gramos' | 'kg') => {
    if (targetUnit === 'mililitros') {
      setEditQuantity(String(calculatedMl));
      setEditUnit('mililitros');
      setEditUnitPrice(String(Math.round(costPerMl * 100) / 100));
    } else if (targetUnit === 'litros') {
      setEditQuantity(String(Math.round((calculatedMl / 1000) * 100) / 100));
      setEditUnit('litros');
      setEditUnitPrice(String(Math.round(costPerLiter * 100) / 100));
    } else if (targetUnit === 'gramos') {
      setEditQuantity(String(calculatedGrams));
      setEditUnit('gramos');
      setEditUnitPrice(String(Math.round(costPerGram * 100) / 100));
    } else if (targetUnit === 'kg') {
      setEditQuantity(String(Math.round((calculatedGrams / 1000) * 100) / 100));
      setEditUnit('kg');
      setEditUnitPrice(String(Math.round(costPerKg * 100) / 100));
    }
  };

  // Guardar cambios individuales del producto
  const handleSaveItemChanges = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const q = parseDecimal(editQuantity);
      const p = parseDecimal(editUnitPrice);
      const tot = parseDecimal(editTotalPrice) || (p * q);
      const sl = parseInt(editShelfLife) || 14;
      const cal = parseDecimal(editCalories);
      const prot = parseDecimal(editProtein);
      const carbs = parseDecimal(editCarbs);
      const sugar = parseDecimal(editSugar);
      const fiber = parseDecimal(editFiber);
      const fat = parseDecimal(editFat);
      const satFat = parseDecimal(editSatFat);
      const sod = parseDecimal(editSodium);

      const updatedItem: PantryItem = {
        ...currentItem,
        name: editName.trim() || currentItem.name,
        category: editCategory || currentItem.category,
        quantity: q,
        unit: editUnit.trim() || currentItem.unit || 'un',
        unit_price: p,
        total_price: tot,
        shelf_life_days: sl,
        calories_per_unit: cal,
        total_calories: cal * q,
        protein_g: prot,
        carbs_g: carbs,
        fat_g: fat,
        sugar_g: sugar,
        fiber_g: fiber,
        saturated_fat_g: satFat,
        sodium_mg: sod,
        serving_size: editServingSize.trim() || undefined,
        status: q <= 0 ? 'agotado' : currentItem.status === 'agotado' ? 'disponible' : currentItem.status,
        updated_at: new Date().toISOString(),
      };

      setCurrentItem(updatedItem);

      if (onUpdateItem) {
        await onUpdateItem(updatedItem);
      }

      setSaveSuccessNotice(true);
      setTimeout(() => setSaveSuccessNotice(false), 3000);
      setIsEditing(false);
    } catch (err) {
      console.error('Error guardando cambios del producto:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Color temático según el grado ISA
  const isaGradeColor =
    isaGrade === 'A+' || isaGrade === 'A'
      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500/30'
      : isaGrade === 'B'
      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-500/30'
      : isaGrade === 'C'
      ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-500/30'
      : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-500/30';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 max-w-3xl w-full shadow-2xl max-h-[92vh] overflow-y-auto space-y-6 animate-in zoom-in-95 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================================================= */}
        {/* CABECERA DEL PRODUCTO                                                     */}
        {/* ========================================================================= */}
        <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {currentItem.category}
              </span>
              <span
                className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  currentItem.status === 'disponible'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                    : currentItem.status === 'consumiendo'
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                }`}
              >
                {currentItem.status === 'disponible' ? 'En Stock' : currentItem.status === 'consumiendo' ? 'En Consumo' : 'Agotado'}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {currentItem.quantity} {currentItem.unit} disponibles
              </span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
              {currentItem.name}
            </h3>

            <div className="flex items-center gap-3 text-xs text-slate-400 pt-0.5 flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Comprado: {currentItem.purchase_date}
              </span>
              <span>•</span>
              <span>Vida útil: ~{currentItem.shelf_life_days || 14} días</span>
              {Number(currentItem.unit_price) > 0 && (
                <>
                  <span>•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    ${Number(currentItem.unit_price).toLocaleString()} / {currentItem.unit}
                    {Number(currentItem.total_price) > 0 && Number(currentItem.total_price) !== Number(currentItem.unit_price) && (
                      <span className="text-slate-400 font-normal ml-1">
                        (Total: ${Number(currentItem.total_price).toLocaleString()} COP)
                      </span>
                    )}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shadow-xs ${
                isEditing
                  ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-500'
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Modificar cantidad, unidad o precio del producto"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cerrar' : 'Editar'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notificación de guardado exitoso */}
        {saveSuccessNotice && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-500" />
            <span>¡Producto actualizado! Cantidad, unidad, precio e índices recalculados en tiempo real.</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PANEL DE EDICIÓN COMPLETA (STOCK, FINANZAS Y NUTRICIÓN)                    */}
        {/* ========================================================================= */}
        {isEditing && (
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 via-slate-50 to-emerald-500/5 dark:from-emerald-950/40 dark:via-slate-900 dark:to-emerald-950/20 border border-emerald-500/30 rounded-3xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Modificar Producto & Datos Nutricionales
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Ajusta stock, precios o macronutrientes oficiales. Se admiten valores decimales con coma o punto.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveItemChanges} className="space-y-4">
              {/* SECCIÓN 1: STOCK, PRESENTACIÓN Y FINANZAS */}
              <div className="p-4 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                  1. Stock, Presentación y Precios
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Nombre */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Nombre del Alimento
                    </label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 outline-none"
                    />
                  </div>

                  {/* Categoría */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Categoría
                    </label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 outline-none"
                    >
                      {PANTRY_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {/* Cantidad Comprada */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Cantidad del Producto
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      required
                      value={editQuantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      placeholder="ej. 2700, 2.7, 500"
                      className="w-full px-3 py-2 rounded-xl text-xs font-black bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 outline-none"
                    />
                    <span className="text-[10px] text-slate-400 block mt-0.5">Contenido del envase</span>
                  </div>

                  {/* Unidad */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Unidad de Medida
                    </label>
                    <input
                      type="text"
                      required
                      value={editUnit}
                      onChange={(e) => setEditUnit(e.target.value)}
                      placeholder="mililitros, g, litros, kg..."
                      className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 outline-none"
                    />
                    <div className="flex flex-wrap gap-1 mt-1">
                      {[
                        { label: 'ml', val: 'mililitros' },
                        { label: 'L', val: 'litros' },
                        { label: 'g', val: 'gramos' },
                        { label: 'kg', val: 'kg' },
                        { label: 'lb', val: 'libras' },
                        { label: 'un', val: 'unidades' },
                      ].map((uOpt) => (
                        <button
                          key={uOpt.label}
                          type="button"
                          onClick={() => setEditUnit(uOpt.val)}
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold transition border ${
                            cleanUnit.startsWith(uOpt.label) || cleanUnit === uOpt.val
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {uOpt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Precio Total Pagado */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Precio Pagado ($ COP)
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={editTotalPrice}
                      onChange={(e) => handleTotalPriceChange(e.target.value)}
                      placeholder="ej. 26000"
                      className="w-full px-3 py-2 rounded-xl text-xs font-black text-emerald-600 dark:text-emerald-400 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none"
                    />
                    <span className="text-[10px] text-slate-400 block mt-0.5">Total pagado en caja</span>
                  </div>

                  {/* Precio Unitario */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Precio Unitario ($/{editUnit || 'un'})
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={editUnitPrice}
                      onChange={(e) => handleUnitPriceChange(e.target.value)}
                      placeholder="ej. 9.63"
                      className="w-full px-3 py-2 rounded-xl text-xs font-black text-emerald-600 dark:text-emerald-400 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none"
                    />
                    <span className="text-[10px] text-slate-400 block mt-0.5">Calculado: Total ÷ Cantidad</span>
                  </div>
                </div>

                {/* CALCULADORA INTELIGENTE DE COSTO UNITARIO Y RENDIMIENTO EN TIEMPO REAL */}
                {activeTotalPrice > 0 && parsedEditQty > 0 && (
                  <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-500/30 rounded-2xl space-y-3 animate-in fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-emerald-500/20 pb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        <Sparkles className="w-4 h-4 text-emerald-500" />
                        <span>Cálculo Automático de Costo por Unidad (ml, g, L, Kg, porción)</span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        Compra: {parsedEditQty} {editUnit} = ${activeTotalPrice.toLocaleString()} COP
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                      {/* Costo por Mililitro / Litro */}
                      <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-emerald-500/20 shadow-2xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Costo por Mililitro
                        </span>
                        <p className="text-base font-black text-emerald-600 dark:text-emerald-400">
                          ${costPerMl >= 1 ? costPerMl.toFixed(2) : costPerMl.toFixed(3)}{' '}
                          <span className="text-[10px] font-semibold text-slate-400">/ ml</span>
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          ${Math.round(costPerLiter).toLocaleString()} / Litro
                        </p>
                        {calculatedMl > 0 && (
                          <button
                            type="button"
                            onClick={() => handleApplyUnit('mililitros')}
                            className="mt-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
                          >
                            Guardar como {calculatedMl.toLocaleString()} ml →
                          </button>
                        )}
                      </div>

                      {/* Costo por Gramo / 100g */}
                      <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-emerald-500/20 shadow-2xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Costo por Gramo
                        </span>
                        <p className="text-base font-black text-slate-900 dark:text-white">
                          ${costPerGram >= 1 ? costPerGram.toFixed(2) : costPerGram.toFixed(3)}{' '}
                          <span className="text-[10px] font-semibold text-slate-400">/ g</span>
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          ${Math.round(costPer100g).toLocaleString()} / 100g • ${Math.round(costPerKg).toLocaleString()} / Kg
                        </p>
                        {calculatedGrams > 0 && (
                          <button
                            type="button"
                            onClick={() => handleApplyUnit('gramos')}
                            className="mt-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
                          >
                            Guardar como {calculatedGrams.toLocaleString()} g →
                          </button>
                        )}
                      </div>

                      {/* Costo por Porción */}
                      <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-emerald-500/20 shadow-2xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Porción ({portionGrams}g / {Math.round(portionGrams / productDensity)}ml)
                        </span>
                        <p className="text-base font-black text-amber-600 dark:text-amber-400">
                          ${Math.round(costPerServing).toLocaleString()}{' '}
                          <span className="text-[10px] font-semibold text-slate-400">COP</span>
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          ~{approxServings} porciones en el envase
                        </p>
                      </div>

                      {/* Adaptar a otra unidad */}
                      <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-emerald-500/20 shadow-2xs flex flex-col justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Adaptar Inventario
                        </span>
                        <div className="grid grid-cols-2 gap-1 my-1">
                          <button
                            type="button"
                            onClick={() => handleApplyUnit('litros')}
                            className="px-1.5 py-1 text-[9px] font-bold bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-300"
                            title="Guardar en Litros"
                          >
                            En Litros (L)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApplyUnit('kg')}
                            className="px-1.5 py-1 text-[9px] font-bold bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-300"
                            title="Guardar en Kilogramos"
                          >
                            En Kilos (kg)
                          </button>
                        </div>
                        <p className="text-[9px] text-slate-400">
                          {isCookingOil
                            ? 'Densidad aceite: 0.92 g/ml'
                            : isDairyMilk
                            ? 'Densidad leche: 1.03 g/ml'
                            : 'Densidad base: 1.0 g/ml'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Vida Útil */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Vida Útil Estimada (Días)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={editShelfLife}
                      onChange={(e) => setEditShelfLife(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 outline-none"
                    />
                  </div>

                  {/* Tamaño Porción */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Tamaño de Porción de Referencia
                    </label>
                    <input
                      type="text"
                      value={editServingSize}
                      onChange={(e) => setEditServingSize(e.target.value)}
                      placeholder="ej. 1 cucharada (14g / 15ml), 100g, 1 vaso"
                      className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN 2: INFORMACIÓN NUTRICIONAL OFICIAL DE ETIQUETA */}
              <div className="p-4 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                    2. Tabla Nutricional Oficial (Valores de Etiqueta)
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Base: {editServingSize}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Calorías */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Calorías (kcal)
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={editCalories}
                      onChange={handleDecimalInput(setEditCalories)}
                      placeholder="ej. 124 o 884"
                      className="w-full px-3 py-2 rounded-xl text-xs font-black text-amber-600 dark:text-amber-400 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:border-amber-500 outline-none"
                    />
                  </div>

                  {/* Proteína */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Proteína (g)
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={editProtein}
                      onChange={handleDecimalInput(setEditProtein)}
                      placeholder="ej. 0 o 25"
                      className="w-full px-3 py-2 rounded-xl text-xs font-black bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 outline-none"
                    />
                  </div>

                  {/* Carbohidratos */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Carbohidratos (g)
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={editCarbs}
                      onChange={handleDecimalInput(setEditCarbs)}
                      placeholder="ej. 0 o 45"
                      className="w-full px-3 py-2 rounded-xl text-xs font-black bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 outline-none"
                    />
                  </div>

                  {/* Grasas Totales */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Grasas Totales (g)
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={editFat}
                      onChange={handleDecimalInput(setEditFat)}
                      placeholder="ej. 14 o 100"
                      className="w-full px-3 py-2 rounded-xl text-xs font-black bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 outline-none"
                    />
                  </div>

                  {/* Grasas Saturadas */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Grasas Saturadas (g)
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={editSatFat}
                      onChange={handleDecimalInput(setEditSatFat)}
                      placeholder="ej. 1.7"
                      className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 outline-none"
                    />
                  </div>

                  {/* Azúcares */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Azúcares Totales (g)
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={editSugar}
                      onChange={handleDecimalInput(setEditSugar)}
                      placeholder="ej. 0"
                      className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 outline-none"
                    />
                  </div>

                  {/* Fibra */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Fibra Dietaria (g)
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={editFiber}
                      onChange={handleDecimalInput(setEditFiber)}
                      placeholder="ej. 0"
                      className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 outline-none"
                    />
                  </div>

                  {/* Sodio */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Sodio (mg)
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={editSodium}
                      onChange={handleDecimalInput(setEditSodium)}
                      placeholder="ej. 0"
                      className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PANEL PRINCIPAL: ÍNDICE ISA & BALANCE NUTRI-ECO-ECONÓMICO                */}
        {/* ========================================================================= */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-slate-50 to-blue-500/5 dark:from-emerald-950/30 dark:via-slate-900 dark:to-blue-950/20 border border-emerald-500/20 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Índice de Sostenibilidad Alimentaria (ISA)</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Triple equilibrio biofísico: densidad nutricional, huella de recursos y precio por gramo nutricional.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className={`px-4 py-2 rounded-2xl border text-center ${isaGradeColor}`}>
                <span className="text-[10px] font-bold block uppercase tracking-wider">Grado ISA</span>
                <span className="text-2xl font-black">{isaGrade}</span>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[10px] font-bold block uppercase tracking-wider text-slate-400">Score</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">{isaScore}/100</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">Equilibrio Nutri-Eco-Precio:</span>
              <span
                className={`font-black uppercase text-[11px] px-2 py-0.5 rounded-full ${
                  nutriEcoBalance === 'Excelente'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : nutriEcoBalance === 'Favorable'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                    : nutriEcoBalance === 'Equilibrado'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                }`}
              >
                {nutriEcoBalance}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                • Retorno: {economics.economicNutritionalEfficiency}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11.5px]">
              {balanceExplanation}
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SUB-NAVEGACIÓN INTERNA: BALANCE | NUTRICIÓN | ISA | PRECIO/GRAMO         */}
        {/* ========================================================================= */}
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('balance')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'balance'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Resumen Integral</span>
          </button>
          <button
            onClick={() => setActiveSubTab('economics')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'economics'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
            <span>Precio / Gramo Nutricional</span>
          </button>
          <button
            onClick={() => setActiveSubTab('nutrition')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'nutrition'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Nutrición & Etiquetas Colombia</span>
          </button>
          <button
            onClick={() => setActiveSubTab('isa')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'isa'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-blue-500" />
            <span>Los 4 Pilares del ISA</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* VISTA 1: RESUMEN INTEGRAL (NUTRIENTES CLAVE VS RECURSOS & COSTO/GRAMO)   */}
        {/* ========================================================================= */}
        {activeSubTab === 'balance' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Energía */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-amber-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Energía</span>
                  <Flame className="w-3.5 h-3.5" />
                </div>
                <p className="text-xl font-black text-slate-900 dark:text-white">
                  {nutrition.calories}{' '}
                  <span className="text-xs font-normal text-slate-400">kcal</span>
                </p>
                <span className="text-[10px] text-slate-400">Por {nutrition.servingSize}</span>
              </div>

              {/* Proteína */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-rose-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Proteína</span>
                  <Heart className="w-3.5 h-3.5" />
                </div>
                <p className="text-xl font-black text-slate-900 dark:text-white">
                  {nutrition.protein_g} <span className="text-xs font-normal text-slate-400">g</span>
                </p>
                <span className="text-[10px] text-slate-400">Tejido muscular y celular</span>
              </div>

              {/* Huella Hídrica */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-blue-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Agua Dulce</span>
                  <Droplet className="w-3.5 h-3.5" />
                </div>
                <p className="text-xl font-black text-slate-900 dark:text-white">
                  {isa.waterLitersPerKg.toLocaleString()}{' '}
                  <span className="text-xs font-normal text-slate-400">L/kg</span>
                </p>
                <span className="text-[10px] text-slate-400">{isa.waterCategory} huella</span>
              </div>

              {/* Precio por Gramo Nutricional */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-emerald-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">$/g Nutriente</span>
                  <DollarSign className="w-3.5 h-3.5" />
                </div>
                <p className="text-xl font-black text-slate-900 dark:text-white">
                  {economics.pricePerNutrientGramCOP > 0 ? (
                    <>
                      ${economics.pricePerNutrientGramCOP}{' '}
                      <span className="text-xs font-normal text-slate-400">COP/g</span>
                    </>
                  ) : (
                    <span className="text-sm font-semibold text-slate-400">Sin precio</span>
                  )}
                </p>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  Retorno {economics.economicNutritionalEfficiency}
                </span>
              </div>
            </div>

            {/* Píldora de Eficiencia Económica en el Balance */}
            {economics.pricePerUnitCOP > 0 && (
              <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-500/20 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    <span>Rendimiento Económico del Nutriente (Ponderación 25% ISA)</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                    {economics.economicScore}/100 Eficiencia
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {economics.economicExplanation}
                </p>
                <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                  {economics.pricePerProteinGramCOP > 0 && (
                    <span>
                      Costo por gramo de proteína: <strong className="text-slate-800 dark:text-slate-200">${economics.pricePerProteinGramCOP} COP/g</strong>
                    </span>
                  )}
                  <span>•</span>
                  <span>
                    Precio por gramo de alimento: <strong className="text-slate-800 dark:text-slate-200">${economics.pricePerGramCOP} COP/g</strong>
                  </span>
                </div>
              </div>
            )}

            {/* Sellos de Advertencia o Alimento Natural */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Sellos Frontales MinSalud Colombia (Res. 810/2021)
              </span>

              {nutrition.colombianWarningLabels.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {nutrition.colombianWarningLabels.map((warning) => (
                    <div
                      key={warning}
                      className="bg-black text-white px-3 py-1.5 rounded-xl border-2 border-white shadow-md text-center inline-flex flex-col items-center justify-center font-black leading-tight"
                    >
                      <span className="text-[10px] text-amber-400 font-bold tracking-tight">ADVERTENCIA</span>
                      <span className="text-[11px] uppercase tracking-wider">{warning}</span>
                      <span className="text-[8px] text-slate-300 font-normal">MINSALUD</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/20 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    Alimento Natural / Libre de Sellos Frontales de Advertencia según normativa colombiana.
                  </span>
                </div>
              )}
            </div>

            {/* Consejo de conservación y reducción de entropía */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                <Package className="w-4 h-4 text-emerald-600" />
                <span>Almacenamiento Óptimo & Cero Desperdicio</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400">{nutrition.storageAdvice}</p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VISTA 2: EFICIENCIA ECONÓMICA & PRECIO POR GRAMO NUTRICIONAL              */}
        {/* ========================================================================= */}
        {activeSubTab === 'economics' && (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-500/10 dark:bg-emerald-950/30 rounded-2xl border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    $
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      Retorno Biológico por Dinero Invertido
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Mide cuántos pesos ($ COP) cuesta cada gramo de nutrición neta aprovechable.
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Eficiencia</span>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase">
                    {economics.economicNutritionalEfficiency} ({economics.economicScore}/100)
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* $/g Nutriente Útil */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Costo por Gramo Nutricional
                </span>
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  ${economics.pricePerNutrientGramCOP}{' '}
                  <span className="text-xs font-normal text-slate-400">COP/g</span>
                </p>
                <p className="text-[11px] text-slate-500">
                  Proteína + Fibra + Energía limpia
                </p>
              </div>

              {/* $/g Proteína Neta */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Costo por Gramo de Proteína
                </span>
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  {economics.pricePerProteinGramCOP > 0 ? (
                    <>
                      ${economics.pricePerProteinGramCOP}{' '}
                      <span className="text-xs font-normal text-slate-400">COP/g</span>
                    </>
                  ) : (
                    <span className="text-sm font-semibold text-slate-400">N/A (Sin proteína)</span>
                  )}
                </p>
                <p className="text-[11px] text-slate-500">
                  {economics.pricePerProteinGramCOP > 0
                    ? 'Eficiencia para masa muscular'
                    : 'Este alimento no aporta proteína significativa'}
                </p>
              </div>

              {/* $/g Alimento Total */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Costo por Gramo de Alimento
                </span>
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  ${economics.pricePerGramCOP}{' '}
                  <span className="text-xs font-normal text-slate-400">COP/g</span>
                </p>
                <p className="text-[11px] text-slate-500">
                  ~{economics.estimatedWeightGrams}g por {currentItem.unit}
                  {economics.totalItemGrams ? ` • Total: ~${economics.totalItemGrams.toLocaleString()}g` : ''}
                </p>
              </div>
            </div>

            {/* DESGLOSE DETALLADO DE COSTO EQUIVALENTE & RENDIMIENTO */}
            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-500/20 space-y-3">
              <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-700 dark:text-emerald-300">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>Desglose Completo de Costo Equivalente (ml, g, L, Kg, porción)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* Costo ml */}
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Costo por Mililitro</span>
                  <p className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    ${economics.pricePerMlCOP ? (economics.pricePerMlCOP >= 1 ? economics.pricePerMlCOP.toFixed(2) : economics.pricePerMlCOP.toFixed(3)) : `${economics.pricePerGramCOP}`}
                    <span className="text-[10px] text-slate-400 font-normal"> / ml</span>
                  </p>
                  <span className="text-[10px] text-slate-500">
                    ${Math.round((economics.pricePerMlCOP || economics.pricePerGramCOP) * 1000).toLocaleString()} / Litro
                  </span>
                </div>

                {/* Costo gramo */}
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Costo por Gramo</span>
                  <p className="text-base font-black text-slate-900 dark:text-white">
                    ${economics.pricePerGramCOP}{' '}
                    <span className="text-[10px] text-slate-400 font-normal">/ g</span>
                  </p>
                  <span className="text-[10px] text-slate-500">
                    ${(economics.pricePer100gCOP || Math.round(economics.pricePerGramCOP * 100)).toLocaleString()} / 100g • ${Math.round(economics.pricePerGramCOP * 1000).toLocaleString()} / Kg
                  </span>
                </div>

                {/* Costo porción */}
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Porción Oficial</span>
                  <p className="text-base font-black text-amber-600 dark:text-amber-400">
                    ${economics.pricePerServingCOP?.toLocaleString() || Math.round(economics.pricePerGramCOP * 14)}{' '}
                    <span className="text-[10px] text-slate-400 font-normal">COP</span>
                  </p>
                  <span className="text-[10px] text-slate-500">
                    {foodData.nutrition.servingSize} {economics.totalServings ? `(~${economics.totalServings} porciones)` : ''}
                  </span>
                </div>

                {/* Resumen compra */}
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Total Pagado</span>
                  <p className="text-base font-black text-slate-900 dark:text-white">
                    ${Number(currentItem.total_price || economics.totalPriceCOP || 0).toLocaleString()}{' '}
                    <span className="text-[10px] text-slate-400 font-normal">COP</span>
                  </p>
                  <span className="text-[10px] text-slate-500">
                    Por {currentItem.quantity} {currentItem.unit}
                  </span>
                </div>
              </div>
            </div>

            {/* Diagnóstico y balance en el ISA */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>Cómo influye este costo en el Índice ISA Integral</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {economics.economicExplanation}
              </p>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 text-[11px] space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-500">Ponderación en el Índice ISA:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">25% Eficiencia Económica</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Densidad Nutricional Neta:</span>
                  <span>40%</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Bajo Impacto de Recursos Naturales:</span>
                  <span>35%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VISTA 3: INFORMACIÓN NUTRICIONAL & ETIQUETADO DETALLADO                  */}
        {/* ========================================================================= */}
        {activeSubTab === 'nutrition' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900 dark:text-white">Tabla Nutricional Oficial</span>
                <span className="text-slate-400">Base porción: {nutrition.servingSize}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    <tr className="py-1.5">
                      <td className="py-2 font-black text-slate-900 dark:text-white">Calorías / Energía</td>
                      <td className="py-2 text-right font-black text-amber-600 dark:text-amber-400">
                        <span>{nutrition.calories} kcal</span>
                        {nutrition.totalPackageCalories && nutrition.totalPackageCalories > nutrition.calories && (
                          <span className="block text-[10px] font-normal text-slate-400">
                            Total despensa: ~{nutrition.totalPackageCalories.toLocaleString()} kcal
                          </span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-slate-700 dark:text-slate-300">Proteína</td>
                      <td className="py-2 text-right font-bold text-slate-900 dark:text-white">
                        {nutrition.protein_g} g
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-slate-700 dark:text-slate-300">Carbohidratos Totales</td>
                      <td className="py-2 text-right font-bold text-slate-900 dark:text-white">
                        {nutrition.carbs_g} g
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pl-4 text-slate-500 text-[11px]">— Azúcares Totales</td>
                      <td className="py-1.5 text-right text-slate-500 text-[11px]">
                        {nutrition.sugar_g} g
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pl-4 text-slate-500 text-[11px]">— Fibra Dietaria</td>
                      <td className="py-1.5 text-right font-semibold text-emerald-600 text-[11px]">
                        {nutrition.fiber_g} g
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-slate-700 dark:text-slate-300">Grasas Totales</td>
                      <td className="py-2 text-right font-bold text-slate-900 dark:text-white">
                        {nutrition.fat_g} g
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pl-4 text-slate-500 text-[11px]">— Grasas Saturadas</td>
                      <td className="py-1.5 text-right text-slate-500 text-[11px]">
                        {nutrition.saturated_fat_g} g
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-slate-700 dark:text-slate-300">Sodio</td>
                      <td className="py-2 text-right font-bold text-slate-900 dark:text-white">
                        {nutrition.sodium_mg} mg
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Micronutrientes y Vitaminas */}
            {nutrition.micronutrients.length > 0 && (
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Micronutrientes & Vitaminas Clave
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  {nutrition.micronutrients.map((micro) => (
                    <div
                      key={micro.name}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs"
                    >
                      <strong className="block font-bold text-slate-900 dark:text-white">
                        {micro.name}
                      </strong>
                      <span className="text-emerald-600 dark:text-emerald-400 font-black">
                        {micro.amount}
                      </span>
                      {micro.pctDailyValue !== undefined && (
                        <span className="text-[10px] text-slate-400 ml-1">
                          ({micro.pctDailyValue}% VD)
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VISTA 3: LOS 4 PILARES DEL ISA & RECURSOS NATURALES                       */}
        {/* ========================================================================= */}
        {activeSubTab === 'isa' && (
          <div className="space-y-3">
            {/* Pilar 1: Huella Hídrica */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-blue-500" />
                  <strong className="font-bold text-slate-900 dark:text-white">
                    1. Huella Hídrica (Agua consumida para su cultivo/producción)
                  </strong>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300">
                  {isa.waterCategory}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Requiere aprox.{' '}
                <strong className="text-blue-600 dark:text-blue-400 font-black">
                  {isa.waterLitersPerKg.toLocaleString()} litros
                </strong>{' '}
                de agua dulce por cada kilogramo producido (suma de agua verde de lluvia, agua azul de riego y agua gris para asimilación de cargas).
              </p>
              <div className="text-[11px] text-slate-500 italic bg-blue-50/50 dark:bg-blue-950/30 p-2 rounded-xl border border-blue-500/10">
                💡 {isa.waterEquivalence}
              </div>
            </div>

            {/* Pilar 2: Degradación de Suelo */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-amber-500" />
                  <strong className="font-bold text-slate-900 dark:text-white">
                    2. Presión & Degradación de Suelo Agrícola
                  </strong>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-300">
                  Riesgo {isa.soilDegradationRisk}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {isa.soilImpactDetail} Evalúa la intensidad en el uso de la tierra, la compactación edáfica y la dependencia de agroquímicos.
              </p>
            </div>

            {/* Pilar 3: Huella de Carbono */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  <strong className="font-bold text-slate-900 dark:text-white">
                    3. Huella de Carbono & Emisiones GEI
                  </strong>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300">
                  {isa.carbonLevel}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Emite aprox.{' '}
                <strong className="text-slate-900 dark:text-white font-black">
                  {isa.carbonKgCO2ePerKg} kg CO₂e
                </strong>{' '}
                por kg de alimento a lo largo de su cadena de producción, refrigeración y transporte. Equivale a recorrer{' '}
                <strong className="text-slate-900 dark:text-white">{isa.carbonEquivalenceKmCar} km</strong> en un vehículo particular.
              </p>
            </div>

            {/* Pilar 4: Tasa de Entropía del Sistema */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-500" />
                  <strong className="font-bold text-slate-900 dark:text-white">
                    4. Entropía del Sistema Doméstico (Desorden & Perecibilidad)
                  </strong>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300">
                  Entropía {isa.entropyLevel}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {isa.entropyExplanation}
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-[11px]">
                  <span className="text-slate-400 block font-semibold">Riesgo de perecibilidad:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{isa.perishabilityRisk}</span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-[11px]">
                  <span className="text-slate-400 block font-semibold">Empaque / Residuos:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{isa.packagingImpact}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PIE DEL MODAL CON ACCIONES RÁPIDAS DE DESPENSA                            */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs text-slate-400">
            Stock actual: <strong className="text-slate-800 dark:text-slate-200">{currentItem.quantity} {currentItem.unit}</strong>
            {Number(currentItem.unit_price) > 0 && (
              <>
                {' '}• Precio:{' '}
                <strong className="text-slate-800 dark:text-slate-200">
                  ${Number(currentItem.unit_price).toLocaleString()} COP / {currentItem.unit}
                </strong>
              </>
            )}
            {Number(currentItem.total_price) > 0 && (
              <>
                {' '}• Total:{' '}
                <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                  ${Number(currentItem.total_price).toLocaleString()} COP
                </strong>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
            >
              <Pencil className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{isEditing ? 'Cerrar Edición' : 'Editar'}</span>
            </button>

            {onConsume && currentItem.status !== 'agotado' && (
              <button
                onClick={() => {
                  onConsume(currentItem, true);
                  onClose();
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-900/50 transition"
              >
                Marcar Agotado
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs transition shadow-sm"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
