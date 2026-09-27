import React, { useState, useMemo } from 'react';
import {
  Flame,
  Heart,
  Droplet,
  Zap,
  Info,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { PantryItem } from '../../../../packages/shared/src/types';
import { getFoodIntelligence } from '../../lib/pantryFoodIntelligence';

export type NutritionMode = 'calories' | 'protein' | 'carbs' | 'fat';

interface NutritionAnalyticsProps {
  pantryItems: PantryItem[];
  totalCaloriesAvailable: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatG: number;
  onSelectProduct: (item: PantryItem) => void;
}

// Filtro estricto para excluir productos de aseo, limpieza, mascotas y no comestibles para humanos
const isCleaningOrNonFood = (item: PantryItem): boolean => {
  const cat = (item.category || '').toLowerCase();
  const name = (item.name || '').toLowerCase();

  // 1. Categorías no comestibles para humanos (Aseo, Mascotas, etc.)
  if (
    cat.includes('aseo') ||
    cat.includes('limpieza') ||
    cat.includes('higiene') ||
    cat.includes('cuidado personal') ||
    cat.includes('mascota') ||
    cat.includes('mascotas') ||
    cat.includes('animal') ||
    cat.includes('veterinaria') ||
    cat.includes('perro') ||
    cat.includes('gato')
  ) {
    return true;
  }

  // 2. Palabras clave en el nombre del producto
  const nonFoodKeywords = [
    // Aseo y limpieza
    'suavizante',
    'jabon',
    'jabón',
    'detergente',
    'limpido',
    'límpido',
    'cloro',
    'desinfectante',
    'lavaplatos',
    'blanqueador',
    'esponja',
    'papel higienico',
    'papel higiénico',
    'toallas cocina',
    'servilletas',
    'crema dental',
    'shampoo',
    'champu',
    'champú',
    'acondicionador',
    'cepillo',
    'desodorante',
    'ambientador',
    'bolsas basura',
    'varsol',
    'toalla higienica',
    'toallitas',
    'desengrasante',
    'insecticida',

    // Alimentos y artículos de mascotas (no comestibles para humanos)
    'perro',
    'perros',
    'perrito',
    'canino',
    'canina',
    'cachorro',
    'cachorros',
    'gato',
    'gatos',
    'gatito',
    'gatitos',
    'felino',
    'felina',
    'mascota',
    'mascotas',
    'concentrado',
    'croquetas',
    'cuido',
    'carnaza',
    'hueso perro',
    'pedigree',
    'dog chow',
    'dogchow',
    'cat chow',
    'catchow',
    'whiskas',
    'purina',
    'ringo',
    'filpo',
    'mirringo',
    'chunky',
    'monello',
    'hills',
    'royal canin',
    'pro plan',
    'arena para gato',
    'arena gato',
    'snack perro',
    'snack gato',
    'comida para perro',
    'alimento para perro',
    'comida para gato',
    'alimento para gato',
  ];

  return nonFoodKeywords.some((kw) => name.includes(kw));
};

interface ProcessedFoodPoint {
  item: PantryItem;
  name: string;
  category: string;
  pricePerGramCOP: number;
  chart1NutrientAmount: number;
  chart1NutrientLabel: string;
  totalNutrientInStock: number;
}

export const NutritionAnalytics: React.FC<NutritionAnalyticsProps> = ({
  pantryItems,
  totalCaloriesAvailable,
  totalProteinG,
  totalCarbsG,
  totalFatG,
  onSelectProduct,
}) => {
  // Modo de selección nutricional: Calorías (default inicial), Proteína, Carbohidratos, Grasas
  const [activeMode, setActiveMode] = useState<NutritionMode>('calories');

  // Punto inspeccionado en el plano cartesiano
  const [selectedPointChart1, setSelectedPointChart1] = useState<ProcessedFoodPoint | null>(null);

  // Filtrar solo alimentos activos comestibles (excluye agotados y productos de aseo/limpieza)
  const activeFoodItems = useMemo(() => {
    return pantryItems.filter((i) => i.status !== 'agotado' && !isCleaningOrNonFood(i));
  }, [pantryItems]);

  // Procesar métricas de cada alimento para el plano cartesiano y el ranking
  const processedPoints: ProcessedFoodPoint[] = useMemo(() => {
    return activeFoodItems.map((item) => {
      const intel = getFoodIntelligence(item);
      const economics = intel.economics;
      const nutrition = intel.nutrition;

      const pPerGram = economics.pricePerGramCOP > 0 ? economics.pricePerGramCOP : 5;

      // Densidad nutricional por cada 100g del alimento
      const calsPer100g = Math.max(nutrition.calories || 0, item.calories_per_unit || 0, 50);
      const protPer100g = Math.max(nutrition.protein_g || 0, item.protein_g || 0);
      const carbsPer100g = Math.max(nutrition.carbs_g || 0, item.carbs_g || 0);
      const fatPer100g = Math.max(nutrition.fat_g || 0, item.fat_g || 0);

      const currentStockGrams = economics.estimatedWeightGrams * Math.max(1, item.quantity);

      let chart1Val = 0;
      let chart1Lbl = '';
      let totalNutrient = 0;

      if (activeMode === 'calories') {
        chart1Val = Math.round(calsPer100g);
        chart1Lbl = `${chart1Val} kcal/100g`;
        totalNutrient = Math.round(
          item.total_calories ||
            (calsPer100g * (currentStockGrams / 100)) ||
            (item.calories_per_unit * item.quantity)
        );
      } else if (activeMode === 'protein') {
        chart1Val = Math.round(protPer100g * 10) / 10;
        chart1Lbl = `${chart1Val}g Prot/100g`;
        totalNutrient = Math.round(
          (item.protein_g || protPer100g) * (item.unit === 'kg' ? item.quantity * 10 : item.quantity)
        );
      } else if (activeMode === 'carbs') {
        chart1Val = Math.round(carbsPer100g * 10) / 10;
        chart1Lbl = `${chart1Val}g Carb/100g`;
        totalNutrient = Math.round(
          (item.carbs_g || carbsPer100g) * (item.unit === 'kg' ? item.quantity * 10 : item.quantity)
        );
      } else {
        // fat
        chart1Val = Math.round(fatPer100g * 10) / 10;
        chart1Lbl = `${chart1Val}g Grasa/100g`;
        totalNutrient = Math.round(
          (item.fat_g || fatPer100g) * (item.unit === 'kg' ? item.quantity * 10 : item.quantity)
        );
      }

      return {
        item,
        name: item.name,
        category: item.category,
        pricePerGramCOP: pPerGram,
        chart1NutrientAmount: chart1Val,
        chart1NutrientLabel: chart1Lbl,
        totalNutrientInStock: totalNutrient,
      };
    });
  }, [activeFoodItems, activeMode]);

  // Lista ordenada de mayor a menor según el nutriente activo en despensa
  const sortedRanking = useMemo(() => {
    return [...processedPoints]
      .filter((p) => p.totalNutrientInStock > 0 || p.chart1NutrientAmount > 0)
      .sort((a, b) => b.totalNutrientInStock - a.totalNutrientInStock)
      .slice(0, 10);
  }, [processedPoints]);

  // Total acumulado del nutriente activo para calcular porcentajes en las barras
  const totalNutrientSum = useMemo(() => {
    if (activeMode === 'calories') return totalCaloriesAvailable || 1;
    if (activeMode === 'protein') return totalProteinG || 1;
    if (activeMode === 'carbs') return totalCarbsG || 1;
    return totalFatG || 1;
  }, [activeMode, totalCaloriesAvailable, totalProteinG, totalCarbsG, totalFatG]);

  // Punto activo para la barra de inspección
  const activePoint1 = selectedPointChart1 || (processedPoints.length > 0 ? processedPoints[0] : null);

  // ==========================================================================
  // CONFIGURACIÓN DEL PLANO CARTESIANO: VALOR GRAMO ($/g) VS APORTE NUTRICIONAL
  // ==========================================================================
  const chart1Width = 650;
  const chart1Height = 320;
  const pad1 = { top: 25, right: 30, bottom: 45, left: 60 };
  const plot1W = chart1Width - pad1.left - pad1.right;
  const plot1H = chart1Height - pad1.top - pad1.bottom;

  const maxNutrient1 = useMemo(() => {
    const maxVal = Math.max(...processedPoints.map((p) => p.chart1NutrientAmount), 10);
    return Math.ceil(maxVal * 1.15);
  }, [processedPoints]);

  const maxPricePerGram1 = useMemo(() => {
    const maxVal = Math.max(...processedPoints.map((p) => p.pricePerGramCOP), 15);
    return Math.ceil(maxVal * 1.2);
  }, [processedPoints]);

  const getChart1Coords = (p: ProcessedFoodPoint) => {
    const x = pad1.left + (Math.max(0, p.chart1NutrientAmount) / (maxNutrient1 || 1)) * plot1W;
    const y = pad1.top + plot1H - (Math.max(0, p.pricePerGramCOP) / (maxPricePerGram1 || 1)) * plot1H;
    return { x, y };
  };

  // Paleta y temas según el modo seleccionado
  const themeColors = {
    calories: {
      accent: 'amber',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-500',
      dotColor: '#f59e0b',
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
      unitTitle: 'Calorías (kcal / 100g)',
      rankingTitle: 'Mayor Aporte Calórico en tu Alacena',
      unitUnit: 'kcal',
    },
    protein: {
      accent: 'rose',
      text: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-500',
      dotColor: '#f43f5e',
      badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
      unitTitle: 'Proteínas (g / 100g)',
      rankingTitle: 'Mayor Aporte de Proteína en tu Alacena',
      unitUnit: 'g Prot',
    },
    carbs: {
      accent: 'orange',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-500',
      dotColor: '#ea580c',
      badge: 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300',
      unitTitle: 'Carbohidratos (g / 100g)',
      rankingTitle: 'Mayor Aporte de Carbohidratos en tu Alacena',
      unitUnit: 'g Carb',
    },
    fat: {
      accent: 'blue',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-500',
      dotColor: '#3b82f6',
      badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300',
      unitTitle: 'Grasas Saludables (g / 100g)',
      rankingTitle: 'Mayor Aporte de Grasas Saludables en tu Alacena',
      unitUnit: 'g Grasa',
    },
  }[activeMode];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ========================================================================= */}
      {/* 1. DIVISIONES INTERACTIVAS: ENERGÍA TOTAL | PROTEÍNAS | CARBOS | GRASAS    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* División 1: Energía Total en Despensa (restablece vista de calorías) */}
        <div
          onClick={() => setActiveMode('calories')}
          className={`p-4 rounded-3xl border transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between ${
            activeMode === 'calories'
              ? 'bg-gradient-to-br from-amber-500/15 via-white to-transparent dark:from-amber-950/40 dark:via-slate-900 border-amber-500 ring-2 ring-amber-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-400'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400">
                Energía Total en Despensa
              </span>
              <Flame className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
              {Math.round(totalCaloriesAvailable).toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-400">kcal</span>
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Equivale a aprox.{' '}
              <strong className="text-slate-800 dark:text-slate-200 font-semibold">
                {Math.round(totalCaloriesAvailable / 2000)} días
              </strong>{' '}
              de autonomía nutricional (base 2,000 kcal/día).
            </p>
          </div>
          <div className="pt-2 flex justify-between items-center text-[10px]">
            <span
              className={
                activeMode === 'calories'
                  ? 'text-amber-600 dark:text-amber-400 font-bold'
                  : 'text-slate-400'
              }
            >
              {activeMode === 'calories' ? '● Filtro Activo' : 'Clic para ver inicial'}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* División 2: Proteínas */}
        <div
          onClick={() => setActiveMode('protein')}
          className={`p-4 rounded-3xl border transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between ${
            activeMode === 'protein'
              ? 'bg-gradient-to-br from-rose-500/15 via-white to-transparent dark:from-rose-950/40 dark:via-slate-900 border-rose-500 ring-2 ring-rose-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-rose-400'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-500">
                Proteínas
              </span>
              <Heart className="w-4 h-4 text-rose-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {Math.round(totalProteinG).toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-400">g</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Pollo, carne, atún, huevos, leguminosas.
            </p>
          </div>
          <div className="pt-2 flex justify-between items-center text-[10px]">
            <span className={activeMode === 'protein' ? 'text-rose-500 font-bold' : 'text-slate-400'}>
              {activeMode === 'protein' ? '● Filtro Activo' : 'Clic para filtrar'}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* División 3: Carbohidratos */}
        <div
          onClick={() => setActiveMode('carbs')}
          className={`p-4 rounded-3xl border transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between ${
            activeMode === 'carbs'
              ? 'bg-gradient-to-br from-amber-500/15 via-white to-transparent dark:from-amber-950/40 dark:via-slate-900 border-amber-500 ring-2 ring-amber-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-400'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-500">
                Carbohidratos
              </span>
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {Math.round(totalCarbsG).toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-400">g</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Arroz, pasta, avena, plátano, granos.
            </p>
          </div>
          <div className="pt-2 flex justify-between items-center text-[10px]">
            <span className={activeMode === 'carbs' ? 'text-amber-600 font-bold' : 'text-slate-400'}>
              {activeMode === 'carbs' ? '● Filtro Activo' : 'Clic para filtrar'}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* División 4: Grasas Saludables */}
        <div
          onClick={() => setActiveMode('fat')}
          className={`p-4 rounded-3xl border transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between ${
            activeMode === 'fat'
              ? 'bg-gradient-to-br from-blue-500/15 via-white to-transparent dark:from-blue-950/40 dark:via-slate-900 border-blue-500 ring-2 ring-blue-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-500">
                Grasas Saludables
              </span>
              <Droplet className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {Math.round(totalFatG).toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-400">g</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Aceites, frutos secos, lácteos enteros.
            </p>
          </div>
          <div className="pt-2 flex justify-between items-center text-[10px]">
            <span className={activeMode === 'fat' ? 'text-blue-500 font-bold' : 'text-slate-400'}>
              {activeMode === 'fat' ? '● Filtro Activo' : 'Clic para filtrar'}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PLANO CARTESIANO: VALOR GRAMO ($/g) VS APORTE NUTRICIONAL               */}
      {/* ========================================================================= */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Plano Cartesiano: Valor por Gramo ($/g) vs. Aporte Nutricional</span>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${themeColors.badge}`}
              >
                Filtro: {themeColors.unitTitle}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Evalúa la eficiencia de compra: productos con alto aporte nutricional y bajo costo por gramo.
            </p>
          </div>
        </div>

        {/* Barra de Inspección Estable (Contenedor de altura fija para evitar saltos de layout al tocar) */}
        <div className="min-h-[58px] p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs transition-colors">
          {activePoint1 ? (
            <div className="w-full flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {activePoint1.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {activePoint1.category}
                </span>
                <span className="text-[11px] text-slate-400">
                  Stock: {activePoint1.item.quantity} {activePoint1.item.unit}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  Aporte: <strong className={themeColors.text}>{activePoint1.chart1NutrientLabel}</strong>
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  Valor/g: <strong>${activePoint1.pricePerGramCOP} COP</strong>
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">
                  Total despensa: {activePoint1.totalNutrientInStock.toLocaleString()} {themeColors.unitUnit}
                </span>
                <button
                  onClick={() => onSelectProduct(activePoint1.item)}
                  className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-semibold ml-1"
                >
                  <span>Ver ficha</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Toca o haz clic sobre cualquier punto para ver su aporte nutricional y valor por gramo.</span>
            </div>
          )}
        </div>

        {/* SVG Plano Cartesiano */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chart1Width} ${chart1Height}`}
            className="w-full h-auto min-w-[500px] select-none"
          >
            {/* Fondo del área de datos */}
            <rect
              x={pad1.left}
              y={pad1.top}
              width={plot1W}
              height={plot1H}
              className="fill-slate-50/40 dark:fill-slate-950/30 stroke-slate-200 dark:stroke-slate-800"
              strokeWidth="1"
              rx="6"
            />

            {/* Líneas horizontales de cuadrícula (Eje Y: Precio por gramo) */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const y = pad1.top + plot1H * (1 - ratio);
              const val = Math.round(maxPricePerGram1 * ratio);
              return (
                <g key={idx}>
                  <line
                    x1={pad1.left}
                    y1={y}
                    x2={pad1.left + plot1W}
                    y2={y}
                    stroke="currentColor"
                    className="text-slate-200/80 dark:text-slate-800/80"
                    strokeWidth="1"
                    strokeDasharray={ratio === 0 || ratio === 1 ? 'none' : '3 3'}
                  />
                  <text
                    x={pad1.left - 8}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[9px] fill-slate-400 font-sans font-normal"
                  >
                    ${val}/g
                  </text>
                </g>
              );
            })}

            {/* Líneas verticales de cuadrícula (Eje X: Aporte Nutricional) */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const x = pad1.left + plot1W * ratio;
              const val = Math.round(maxNutrient1 * ratio);
              return (
                <g key={idx}>
                  <line
                    x1={x}
                    y1={pad1.top}
                    x2={x}
                    y2={pad1.top + plot1H}
                    stroke="currentColor"
                    className="text-slate-200/80 dark:text-slate-800/80"
                    strokeWidth="1"
                    strokeDasharray={ratio === 0 || ratio === 1 ? 'none' : '3 3'}
                  />
                  <text
                    x={x}
                    y={pad1.top + plot1H + 16}
                    textAnchor="middle"
                    className="text-[9px] fill-slate-400 font-sans font-normal"
                  >
                    {val} {themeColors.unitUnit}
                  </text>
                </g>
              );
            })}

            {/* Líneas divisorias de referencia (Mediana) */}
            <line
              x1={pad1.left + plot1W * 0.45}
              y1={pad1.top}
              x2={pad1.left + plot1W * 0.45}
              y2={pad1.top + plot1H}
              stroke="currentColor"
              className="text-slate-300 dark:text-slate-700"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <line
              x1={pad1.left}
              y1={pad1.top + plot1H * 0.5}
              x2={pad1.left + plot1W}
              y2={pad1.top + plot1H * 0.5}
              stroke="currentColor"
              className="text-slate-300 dark:text-slate-700"
              strokeWidth="1"
              strokeDasharray="4 4"
            />

            {/* Cuadrantes de orientación */}
            <text
              x={pad1.left + plot1W - 8}
              y={pad1.top + plot1H - 8}
              textAnchor="end"
              className="text-[8.5px] fill-emerald-600/70 dark:fill-emerald-400/70 font-sans font-normal"
            >
              ★ Cuadrante Óptimo (Alto Aporte / Bajo $/g)
            </text>

            {/* Títulos de Ejes limpios */}
            <text
              x={pad1.left + plot1W / 2}
              y={chart1Height - 8}
              textAnchor="middle"
              className="text-[10px] font-medium fill-slate-500 dark:fill-slate-400 font-sans"
            >
              Aporte de {themeColors.unitTitle} →
            </text>
            <text
              x={-(pad1.top + plot1H / 2)}
              y={14}
              transform="rotate(-90)"
              textAnchor="middle"
              className="text-[10px] font-medium fill-slate-500 dark:fill-slate-400 font-sans"
            >
              Valor del Gramo ($ COP / g) →
            </text>

            {/* Puntos en el plano cartesiano */}
            {processedPoints.map((pt, i) => {
              const { x, y } = getChart1Coords(pt);
              const isSelected = activePoint1?.item.id === pt.item.id;

              return (
                <g
                  key={pt.item.id || i}
                  className="cursor-pointer"
                  onMouseEnter={() => setSelectedPointChart1(pt)}
                  onClick={() => {
                    setSelectedPointChart1(pt);
                    onSelectProduct(pt.item);
                  }}
                >
                  {/* Zona táctil amplia invisible para facilidad en pantallas táctiles */}
                  <circle cx={x} cy={y} r={14} fill="transparent" />

                  {/* Halo sutil para el punto activo */}
                  {isSelected && (
                    <circle
                      cx={x}
                      cy={y}
                      r={9}
                      fill={themeColors.dotColor}
                      opacity={0.25}
                      pointerEvents="none"
                    />
                  )}

                  {/* Punto visible pequeño y refinado */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 5 : 3.5}
                    fill={themeColors.dotColor}
                    stroke="#ffffff"
                    strokeWidth={1.5}
                    pointerEvents="none"
                    className="transition-all duration-150"
                  />

                  {/* Etiqueta del producto solo para el punto seleccionado */}
                  {isSelected && (
                    <text
                      x={x}
                      y={y - 8}
                      textAnchor="middle"
                      className="text-[9px] font-medium fill-slate-800 dark:fill-slate-200 pointer-events-none drop-shadow-xs"
                    >
                      {pt.name.slice(0, 18)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. RANKING CENTRAL: MAYOR APORTE DEL NUTRIENTE EN TU ALACENA               */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-xs">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              {themeColors.rankingTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Productos líderes en tu despensa ordenados de mayor a menor según su aporte total acumulado.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {sortedRanking.length} alimentos registrados
          </span>
        </div>

        {sortedRanking.length === 0 ? (
          <p className="text-xs text-slate-400 py-3">
            No hay alimentos disponibles con este macronutriente en tu despensa.
          </p>
        ) : (
          <div className="space-y-2">
            {sortedRanking.map((pt) => {
              const pct =
                totalNutrientSum > 0 ? (pt.totalNutrientInStock / totalNutrientSum) * 100 : 0;
              return (
                <div
                  key={pt.item.id}
                  onClick={() => onSelectProduct(pt.item)}
                  className="p-3 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 transition cursor-pointer group space-y-1"
                >
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                        {pt.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {pt.category}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        ({pt.item.quantity} {pt.item.unit})
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-400">${pt.pricePerGramCOP} COP/g</span>
                      <span className={`font-semibold ${themeColors.text}`}>
                        {pt.totalNutrientInStock.toLocaleString()} {themeColors.unitUnit} ({pct.toFixed(1)}%)
                      </span>
                    </div>
                  </div>

                  {/* Barra de progreso */}
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, Math.max(3, pct))}%`,
                        backgroundColor: themeColors.dotColor,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
