import React, { useState, useMemo } from 'react';
import {
  Flame,
  Heart,
  Droplet,
  Zap,
  DollarSign,
  TrendingUp,
  Activity,
  Calendar,
  Sparkles,
  Info,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { PantryItem } from '../../../../packages/shared/src/types';
import { getFoodIntelligence } from '../../lib/pantryFoodIntelligence';

export type NutritionMode = 'calories' | 'protein' | 'carbs' | 'fat';
export type RecommendationPeriod = 'daily' | 'biweekly';

interface NutritionAnalyticsProps {
  pantryItems: PantryItem[];
  totalCaloriesAvailable: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatG: number;
  onSelectProduct: (item: PantryItem) => void;
}

// Recomendación estándar de ingesta de alimentos basada en guías ICBF / OMS
const getRecommendedPortionGrams = (item: PantryItem): { dailyG: number; desc: string } => {
  const name = (item.name || '').toLowerCase();
  const cat = (item.category || '').toLowerCase();

  if (name.includes('huevo')) {
    return { dailyG: 60, desc: '1 a 2 unidades diarias (~60-120g)' };
  }
  if (
    name.includes('pollo') ||
    name.includes('carne') ||
    name.includes('res') ||
    name.includes('cerdo') ||
    name.includes('pescado') ||
    name.includes('atun') ||
    name.includes('atún')
  ) {
    return { dailyG: 150, desc: '1 porción magra diaria (~150g)' };
  }
  if (
    name.includes('lenteja') ||
    name.includes('frijol') ||
    name.includes('fríjol') ||
    name.includes('garbanzo')
  ) {
    return { dailyG: 80, desc: '1 porción de leguminosa seca (~80g)' };
  }
  if (
    name.includes('arroz') ||
    name.includes('pasta') ||
    name.includes('avena') ||
    name.includes('quinoa')
  ) {
    return { dailyG: 100, desc: '1 porción de cereal complejo (~100g)' };
  }
  if (name.includes('leche') || name.includes('yogur') || name.includes('kumis')) {
    return { dailyG: 250, desc: '1 vaso de lácteo (~250ml)' };
  }
  if (name.includes('queso')) {
    return { dailyG: 50, desc: '1 tajada de queso fresco (~50g)' };
  }
  if (name.includes('aceite') || name.includes('oliva')) {
    return { dailyG: 20, desc: 'Grasa culinaria saludable (~20ml)' };
  }
  if (
    name.includes('fruta') ||
    name.includes('manzana') ||
    name.includes('banano') ||
    name.includes('naranja') ||
    name.includes('arandano') ||
    name.includes('pera') ||
    name.includes('fresa')
  ) {
    return { dailyG: 200, desc: '2 porciones de fruta fresca (~200g)' };
  }
  if (
    name.includes('verdura') ||
    name.includes('tomate') ||
    name.includes('cebolla') ||
    name.includes('zanahoria') ||
    name.includes('ahuyama') ||
    name.includes('espinaca') ||
    name.includes('lechuga') ||
    name.includes('brocoli')
  ) {
    return { dailyG: 250, desc: 'Hortalizas y verduras (~250g)' };
  }
  if (name.includes('pan') || name.includes('arepa')) {
    return { dailyG: 80, desc: '1 a 2 unidades diarias (~80g)' };
  }
  if (cat.includes('proteína') || cat.includes('proteina')) {
    return { dailyG: 150, desc: 'Porción proteica diaria (~150g)' };
  }
  if (cat.includes('lácteo') || cat.includes('lacteo')) {
    return { dailyG: 200, desc: 'Porción láctea (~200g)' };
  }
  if (cat.includes('fruta') || cat.includes('verdura')) {
    return { dailyG: 200, desc: 'Porción de frescos (~200g)' };
  }
  if (cat.includes('grano') || cat.includes('cereal')) {
    return { dailyG: 90, desc: 'Porción de grano integral (~90g)' };
  }

  return { dailyG: 100, desc: 'Consumo estándar balanceado (~100g)' };
};

interface ProcessedFoodPoint {
  item: PantryItem;
  name: string;
  category: string;
  pricePerGramCOP: number;
  nutrientAmount: number; // kcal, g proteína, g carb o g grasa
  nutrientLabel: string;
  totalNutrientInStock: number;
  recommendedGrams: number;
  recommendedCostCOP: number;
  servingDesc: string;
  daysOfCoverage: number;
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

  // Período de recomendación para el segundo plano cartesiano: Diario (1d) o Quincenal (15d)
  const [recommendationPeriod, setRecommendationPeriod] =
    useState<RecommendationPeriod>('biweekly');

  // Puntos hover interactivos para tooltips en los dos planos cartesianos
  const [hoveredPointChart1, setHoveredPointChart1] = useState<ProcessedFoodPoint | null>(null);
  const [hoveredPointChart2, setHoveredPointChart2] = useState<ProcessedFoodPoint | null>(null);

  // Filtrar solo ítems activos disponibles o en consumo
  const activeItems = useMemo(() => {
    return pantryItems.filter((i) => i.status !== 'agotado');
  }, [pantryItems]);

  // Procesar métricas completas de cada alimento para los planos cartesianos y rankings
  const processedPoints: ProcessedFoodPoint[] = useMemo(() => {
    return activeItems.map((item) => {
      const intel = getFoodIntelligence(item);
      const economics = intel.economics;
      const nutrition = intel.nutrition;

      const pPerGram = economics.pricePerGramCOP > 0 ? economics.pricePerGramCOP : 5; // fallback razonable

      // Determinar aporte nutricional según el modo seleccionado
      let nutrientVal = 0;
      let nutrientLbl = '';
      let totalNutrient = 0;

      if (activeMode === 'calories') {
        nutrientVal = Math.round(nutrition.calories || item.calories_per_unit || 100);
        nutrientLbl = `${nutrientVal} kcal/porc.`;
        totalNutrient = Math.round(
          item.total_calories || (item.calories_per_unit || nutrition.calories) * item.quantity
        );
      } else if (activeMode === 'protein') {
        nutrientVal = Math.round((nutrition.protein_g || item.protein_g || 0) * 10) / 10;
        nutrientLbl = `${nutrientVal}g Prot.`;
        totalNutrient = Math.round((item.protein_g || nutrition.protein_g || 0) * item.quantity);
      } else if (activeMode === 'carbs') {
        nutrientVal = Math.round((nutrition.carbs_g || item.carbs_g || 0) * 10) / 10;
        nutrientLbl = `${nutrientVal}g Carb.`;
        totalNutrient = Math.round((item.carbs_g || nutrition.carbs_g || 0) * item.quantity);
      } else {
        // 'fat'
        nutrientVal = Math.round((nutrition.fat_g || item.fat_g || 0) * 10) / 10;
        nutrientLbl = `${nutrientVal}g Grasa`;
        totalNutrient = Math.round((item.fat_g || nutrition.fat_g || 0) * item.quantity);
      }

      // Recomendación de ingesta
      const portion = getRecommendedPortionGrams(item);
      const recGrams =
        recommendationPeriod === 'daily' ? portion.dailyG : portion.dailyG * 15;
      const recCost = Math.round(recGrams * pPerGram);

      // Cobertura estimada con el stock actual
      const currentStockGrams = economics.estimatedWeightGrams * item.quantity;
      const daysCoverage = portion.dailyG > 0 ? Math.round((currentStockGrams / portion.dailyG) * 10) / 10 : 0;

      return {
        item,
        name: item.name,
        category: item.category,
        pricePerGramCOP: pPerGram,
        nutrientAmount: nutrientVal,
        nutrientLabel: nutrientLbl,
        totalNutrientInStock: totalNutrient,
        recommendedGrams: recGrams,
        recommendedCostCOP: recCost,
        servingDesc: portion.desc,
        daysOfCoverage: daysCoverage,
      };
    });
  }, [activeItems, activeMode, recommendationPeriod]);

  // Lista ordenada de mayor a menor según el nutriente activo
  const sortedRanking = useMemo(() => {
    return [...processedPoints]
      .filter((p) => p.totalNutrientInStock > 0 || p.nutrientAmount > 0)
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

  // ==========================================================================
  // CONFIGURACIÓN DEL PLANO CARTESIANO 1: VALOR GRAMO ($/g) VS APORTE NUTRICIONAL
  // ==========================================================================
  const chart1Width = 650;
  const chart1Height = 360;
  const pad1 = { top: 35, right: 35, bottom: 55, left: 65 };
  const plot1W = chart1Width - pad1.left - pad1.right;
  const plot1H = chart1Height - pad1.top - pad1.bottom;

  const maxNutrient1 = useMemo(() => {
    const maxVal = Math.max(...processedPoints.map((p) => p.nutrientAmount), 10);
    return Math.ceil(maxVal * 1.15);
  }, [processedPoints]);

  const maxPricePerGram1 = useMemo(() => {
    const maxVal = Math.max(...processedPoints.map((p) => p.pricePerGramCOP), 15);
    return Math.ceil(maxVal * 1.2);
  }, [processedPoints]);

  const getChart1Coords = (p: ProcessedFoodPoint) => {
    const x = pad1.left + (Math.max(0, p.nutrientAmount) / maxNutrient1) * plot1W;
    const y = pad1.top + plot1H - (Math.max(0, p.pricePerGramCOP) / maxPricePerGram1) * plot1H;
    return { x, y };
  };

  // ==========================================================================
  // CONFIGURACIÓN DEL PLANO CARTESIANO 2: GRAMO RECOMENDADO VS VALOR DE ESA CANTIDAD
  // ==========================================================================
  const chart2Width = 650;
  const chart2Height = 360;
  const pad2 = { top: 35, right: 35, bottom: 55, left: 75 };
  const plot2W = chart2Width - pad2.left - pad2.right;
  const plot2H = chart2Height - pad2.top - pad2.bottom;

  const maxRecommendedGrams2 = useMemo(() => {
    const maxVal = Math.max(...processedPoints.map((p) => p.recommendedGrams), 200);
    return Math.ceil(maxVal * 1.15);
  }, [processedPoints]);

  const maxRecommendedCost2 = useMemo(() => {
    const maxVal = Math.max(...processedPoints.map((p) => p.recommendedCostCOP), 1000);
    return Math.ceil(maxVal * 1.2);
  }, [processedPoints]);

  const getChart2Coords = (p: ProcessedFoodPoint) => {
    const x = pad2.left + (Math.max(0, p.recommendedGrams) / maxRecommendedGrams2) * plot2W;
    const y = pad2.top + plot2H - (Math.max(0, p.recommendedCostCOP) / maxRecommendedCost2) * plot2H;
    return { x, y };
  };

  // Color de acento según el modo nutricional
  const themeColors = {
    calories: {
      accent: 'amber',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-500',
      bgActive: 'bg-amber-500/15 dark:bg-amber-950/40 border-amber-500',
      dotColor: '#f59e0b',
      fillGrad: '#fbbf24',
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
      unitTitle: 'Calórico (kcal)',
      rankingTitle: 'Mayor Aporte Calórico en tu Alacena',
      unitUnit: 'kcal',
    },
    protein: {
      accent: 'rose',
      text: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-500',
      bgActive: 'bg-rose-500/15 dark:bg-rose-950/40 border-rose-500',
      dotColor: '#f43f5e',
      fillGrad: '#fb7185',
      badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
      unitTitle: 'de Proteínas (g)',
      rankingTitle: 'Mayor Aporte de Proteína en tu Alacena',
      unitUnit: 'g Prot',
    },
    carbs: {
      accent: 'orange',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-500',
      bgActive: 'bg-amber-500/15 dark:bg-amber-950/40 border-amber-500',
      dotColor: '#ea580c',
      fillGrad: '#fb923c',
      badge: 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300',
      unitTitle: 'de Carbohidratos (g)',
      rankingTitle: 'Mayor Aporte de Carbohidratos en tu Alacena',
      unitUnit: 'g Carb',
    },
    fat: {
      accent: 'blue',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-500',
      bgActive: 'bg-blue-500/15 dark:bg-blue-950/40 border-blue-500',
      dotColor: '#3b82f6',
      fillGrad: '#60a5fa',
      badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300',
      unitTitle: 'de Grasas Saludables (g)',
      rankingTitle: 'Mayor Aporte de Grasas Saludables en tu Alacena',
      unitUnit: 'g Grasa',
    },
  }[activeMode];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ========================================================================= */}
      {/* 1. FILA DE SELECCIÓN Y DIVISIONES INTERACTIVAS: ENERGÍA | PROT | CARBS | GRASAS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* División 1: Energía Total en Despensa (Al darle clic restaura la vista de calorías) */}
        <div
          onClick={() => setActiveMode('calories')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between ${
            activeMode === 'calories'
              ? 'bg-gradient-to-br from-amber-500/20 via-white to-transparent dark:from-amber-950/40 dark:via-slate-900 border-amber-500 ring-2 ring-amber-500/30'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-400'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] uppercase font-black tracking-wider text-amber-600 dark:text-amber-400">
              Energía Total
            </span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {Math.round(totalCaloriesAvailable).toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-400">kcal</span>
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Equivale a aprox.{' '}
            <strong className="text-slate-800 dark:text-slate-200">
              {Math.round(totalCaloriesAvailable / 2000)} días
            </strong>{' '}
            de autonomía (2,000 kcal/día).
          </p>
          <div className="pt-2 flex justify-between items-center text-[10px] font-bold">
            <span className={activeMode === 'calories' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}>
              {activeMode === 'calories' ? '● Filtro Activo' : 'Clic para filtrar'}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* División 2: Proteínas */}
        <div
          onClick={() => setActiveMode('protein')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between ${
            activeMode === 'protein'
              ? 'bg-gradient-to-br from-rose-500/20 via-white to-transparent dark:from-rose-950/40 dark:via-slate-900 border-rose-500 ring-2 ring-rose-500/30'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-rose-400'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] uppercase font-black tracking-wider text-rose-500">
              Proteínas
            </span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {Math.round(totalProteinG).toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-400">g</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Carne, pollo, atún, huevos, leguminosas.
          </p>
          <div className="pt-2 flex justify-between items-center text-[10px] font-bold">
            <span className={activeMode === 'protein' ? 'text-rose-500' : 'text-slate-400'}>
              {activeMode === 'protein' ? '● Filtro Activo' : 'Clic para filtrar'}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* División 3: Carbohidratos */}
        <div
          onClick={() => setActiveMode('carbs')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between ${
            activeMode === 'carbs'
              ? 'bg-gradient-to-br from-amber-500/20 via-white to-transparent dark:from-amber-950/40 dark:via-slate-900 border-amber-500 ring-2 ring-amber-500/30'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-400'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] uppercase font-black tracking-wider text-amber-500">
              Carbohidratos
            </span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {Math.round(totalCarbsG).toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-400">g</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Arroz, avena, pasta, tubérculos, frutas.
          </p>
          <div className="pt-2 flex justify-between items-center text-[10px] font-bold">
            <span className={activeMode === 'carbs' ? 'text-amber-500' : 'text-slate-400'}>
              {activeMode === 'carbs' ? '● Filtro Activo' : 'Clic para filtrar'}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* División 4: Grasas Saludables */}
        <div
          onClick={() => setActiveMode('fat')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between ${
            activeMode === 'fat'
              ? 'bg-gradient-to-br from-blue-500/20 via-white to-transparent dark:from-blue-950/40 dark:via-slate-900 border-blue-500 ring-2 ring-blue-500/30'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] uppercase font-black tracking-wider text-blue-500">
              Grasas Saludables
            </span>
            <Droplet className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {Math.round(totalFatG).toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-400">g</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Aceites, lácteos enteros, frutos secos.
          </p>
          <div className="pt-2 flex justify-between items-center text-[10px] font-bold">
            <span className={activeMode === 'fat' ? 'text-blue-500' : 'text-slate-400'}>
              {activeMode === 'fat' ? '● Filtro Activo' : 'Clic para filtrar'}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PRIMER PLANO CARTESIANO: VALOR POR GRAMO ($/g) VS APORTE NUTRICIONAL   */}
      {/* ========================================================================= */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Plano Cartesiano: Valor por Gramo ($/g) vs. Aporte {themeColors.unitTitle}
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Eje X: Aporte Nutricional • Eje Y: Precio por Gramo ($ COP/g). El cuadrante inferior derecho refleja el mayor rendimiento nutricional por peso gastado.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-xl ${themeColors.badge}`}>
              Filtrado por: {activeMode.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Notificación Hover flotante */}
        {hoveredPointChart1 && (
          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <strong className="font-bold text-slate-900 dark:text-white">
                {hoveredPointChart1.name}
              </strong>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {hoveredPointChart1.category}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`font-black ${themeColors.text}`}>
                Aporte: {hoveredPointChart1.nutrientLabel}
              </span>
              <span>•</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                ${hoveredPointChart1.pricePerGramCOP} COP / g
              </span>
              <button
                onClick={() => onSelectProduct(hoveredPointChart1.item)}
                className="text-[11px] underline text-slate-400 hover:text-slate-600 dark:hover:text-white font-semibold ml-1"
              >
                Ver ficha completa ↗
              </button>
            </div>
          </div>
        )}

        {/* Gráfico SVG Plano Cartesiano 1 */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chart1Width} ${chart1Height}`}
            className="w-full h-auto min-w-[550px] select-none"
          >
            {/* Fondo y Cuadrícula */}
            <rect
              x={pad1.left}
              y={pad1.top}
              width={plot1W}
              height={plot1H}
              className="fill-slate-50/50 dark:fill-slate-950/40 stroke-slate-200 dark:stroke-slate-800"
              strokeWidth="1"
              rx="8"
            />

            {/* Líneas de cuadrícula horizontal (Eje Y: Precio por gramo) */}
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
                    className="text-slate-200 dark:text-slate-800/80"
                    strokeWidth="1"
                    strokeDasharray={ratio === 0 || ratio === 1 ? 'none' : '3 3'}
                  />
                  <text
                    x={pad1.left - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[10px] fill-slate-400 font-mono font-medium"
                  >
                    ${val}/g
                  </text>
                </g>
              );
            })}

            {/* Líneas de cuadrícula vertical (Eje X: Aporte Nutricional) */}
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
                    className="text-slate-200 dark:text-slate-800/80"
                    strokeWidth="1"
                    strokeDasharray={ratio === 0 || ratio === 1 ? 'none' : '3 3'}
                  />
                  <text
                    x={x}
                    y={pad1.top + plot1H + 20}
                    textAnchor="middle"
                    className="text-[10px] fill-slate-400 font-mono font-medium"
                  >
                    {val} {themeColors.unitUnit}
                  </text>
                </g>
              );
            })}

            {/* Líneas divisorias de Cuadrantes (Mediana / Centro de Referencia) */}
            <line
              x1={pad1.left + plot1W * 0.45}
              y1={pad1.top}
              x2={pad1.left + plot1W * 0.45}
              y2={pad1.top + plot1H}
              stroke="currentColor"
              className="text-slate-300 dark:text-slate-700"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <line
              x1={pad1.left}
              y1={pad1.top + plot1H * 0.5}
              x2={pad1.left + plot1W}
              y2={pad1.top + plot1H * 0.5}
              stroke="currentColor"
              className="text-slate-300 dark:text-slate-700"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Etiquetas de Cuadrantes */}
            <text
              x={pad1.left + plot1W - 8}
              y={pad1.top + plot1H - 10}
              textAnchor="end"
              className="text-[9px] font-bold fill-emerald-600/70 dark:fill-emerald-400/70 uppercase tracking-wider"
            >
              ★ Cuadrante Óptimo (Alto Aporte / Bajo $/g)
            </text>
            <text
              x={pad1.left + 10}
              y={pad1.top + 18}
              textAnchor="start"
              className="text-[9px] font-bold fill-rose-500/60 uppercase tracking-wider"
            >
              ⚠ Cuadrante Ineficiente (Bajo Aporte / Alto $/g)
            </text>

            {/* Ejes con títulos */}
            <text
              x={pad1.left + plot1W / 2}
              y={chart1Height - 12}
              textAnchor="middle"
              className="text-[11px] font-bold fill-slate-600 dark:fill-slate-300 uppercase tracking-wider"
            >
              Aporte de {themeColors.unitTitle} →
            </text>
            <text
              x={-(pad1.top + plot1H / 2)}
              y={18}
              transform="rotate(-90)"
              textAnchor="middle"
              className="text-[11px] font-bold fill-slate-600 dark:fill-slate-300 uppercase tracking-wider"
            >
              Valor del Gramo ($ COP / g) →
            </text>

            {/* Puntos en el plano cartesiano */}
            {processedPoints.map((pt, i) => {
              const { x, y } = getChart1Coords(pt);
              const isHovered = hoveredPointChart1?.item.id === pt.item.id;

              return (
                <g
                  key={pt.item.id || i}
                  className="cursor-pointer transition-transform duration-150"
                  onMouseEnter={() => setHoveredPointChart1(pt)}
                  onMouseLeave={() => setHoveredPointChart1(null)}
                  onClick={() => onSelectProduct(pt.item)}
                >
                  {isHovered && (
                    <circle
                      cx={x}
                      cy={y}
                      r={14}
                      fill={themeColors.dotColor}
                      opacity={0.25}
                      className="animate-pulse"
                    />
                  )}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 7.5 : 5.5}
                    fill={themeColors.dotColor}
                    stroke="#ffffff"
                    strokeWidth={2}
                    className="transition-all duration-200"
                  />
                  {/* Texto de nombre sobre los puntos clave */}
                  {(isHovered || pt.nutrientAmount > maxNutrient1 * 0.5) && (
                    <text
                      x={x}
                      y={y - 10}
                      textAnchor="middle"
                      className="text-[9px] font-bold fill-slate-700 dark:fill-slate-200 pointer-events-none drop-shadow-xs"
                    >
                      {pt.name.slice(0, 14)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. RANKING ORDENADO: MAYOR APORTE EN TU ALACENA (SEGUNDO COMPONENTE)      */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {themeColors.rankingTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ordenado de mayor a menor según el aporte total acumulado en tu despensa.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            {sortedRanking.length} alimentos líderes
          </span>
        </div>

        {sortedRanking.length === 0 ? (
          <p className="text-xs text-slate-400 py-4">
            No hay productos registrados con este macronutriente en tu despensa.
          </p>
        ) : (
          <div className="space-y-2.5">
            {sortedRanking.map((pt) => {
              const pct = totalNutrientSum > 0 ? (pt.totalNutrientInStock / totalNutrientSum) * 100 : 0;
              return (
                <div
                  key={pt.item.id}
                  onClick={() => onSelectProduct(pt.item)}
                  className="p-3.5 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 transition cursor-pointer group space-y-1.5"
                >
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                        {pt.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {pt.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        ({pt.item.quantity} {pt.item.unit})
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-400">
                        ${pt.pricePerGramCOP} COP/g
                      </span>
                      <span className={`font-black ${themeColors.text}`}>
                        {pt.totalNutrientInStock.toLocaleString()} {themeColors.unitUnit} ({pct.toFixed(1)}%)
                      </span>
                    </div>
                  </div>

                  {/* Barra de Progreso proporcional */}
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500`}
                      style={{
                        width: `${Math.min(100, Math.max(4, pct))}%`,
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

      {/* ========================================================================= */}
      {/* 4. SEGUNDO PLANO CARTESIANO: GRAMO RECOMENDADO VS COSTO DE ESA CANTIDAD   */}
      {/* ========================================================================= */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Plano Cartesiano: Cantidad Recomendada de Consumo vs. Valor Presupuestal ($)
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Eje X: Gramos recomendados en dieta balanceada ({recommendationPeriod === 'daily' ? 'Diario' : 'Quincenal (15 días)'}) • Eje Y: Costo económico de esa porción recomendada ($ COP).
            </p>
          </div>

          {/* Selector de Temporalidad: Diario vs Quincenal */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setRecommendationPeriod('daily')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                recommendationPeriod === 'daily'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Consumo Diario (1d)
            </button>
            <button
              onClick={() => setRecommendationPeriod('biweekly')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                recommendationPeriod === 'biweekly'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Consumo Quincenal (15d)
            </button>
          </div>
        </div>

        {/* Notificación Hover flotante para Plano 2 */}
        {hoveredPointChart2 && (
          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs animate-in fade-in">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <strong className="font-bold text-slate-900 dark:text-white">
                  {hoveredPointChart2.name}
                </strong>
                <span className="text-[10px] text-slate-400">({hoveredPointChart2.servingDesc})</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Tu stock actual cubre aprox.{' '}
                <strong className="text-slate-700 dark:text-slate-300 font-bold">
                  {hoveredPointChart2.daysOfCoverage} días
                </strong>{' '}
                de consumo recomendado.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Recomendado: {hoveredPointChart2.recommendedGrams.toLocaleString()}g
              </span>
              <span>•</span>
              <span className="font-black text-emerald-600 dark:text-emerald-400">
                Costo estimado: ${hoveredPointChart2.recommendedCostCOP.toLocaleString()} COP
              </span>
              <button
                onClick={() => onSelectProduct(hoveredPointChart2.item)}
                className="text-[11px] underline text-slate-400 hover:text-slate-600 dark:hover:text-white font-semibold ml-1"
              >
                Ver ficha ↗
              </button>
            </div>
          </div>
        )}

        {/* Gráfico SVG Plano Cartesiano 2 */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chart2Width} ${chart2Height}`}
            className="w-full h-auto min-w-[550px] select-none"
          >
            {/* Fondo y Cuadrícula */}
            <rect
              x={pad2.left}
              y={pad2.top}
              width={plot2W}
              height={plot2H}
              className="fill-slate-50/50 dark:fill-slate-950/40 stroke-slate-200 dark:stroke-slate-800"
              strokeWidth="1"
              rx="8"
            />

            {/* Líneas horizontales de cuadrícula (Eje Y: Costo presupuestal de la recomendación en $) */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const y = pad2.top + plot2H * (1 - ratio);
              const val = Math.round(maxRecommendedCost2 * ratio);
              return (
                <g key={idx}>
                  <line
                    x1={pad2.left}
                    y1={y}
                    x2={pad2.left + plot2W}
                    y2={y}
                    stroke="currentColor"
                    className="text-slate-200 dark:text-slate-800/80"
                    strokeWidth="1"
                    strokeDasharray={ratio === 0 || ratio === 1 ? 'none' : '3 3'}
                  />
                  <text
                    x={pad2.left - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[10px] fill-slate-400 font-mono font-medium"
                  >
                    ${val.toLocaleString()}
                  </text>
                </g>
              );
            })}

            {/* Líneas verticales de cuadrícula (Eje X: Gramos recomendados) */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const x = pad2.left + plot2W * ratio;
              const val = Math.round(maxRecommendedGrams2 * ratio);
              return (
                <g key={idx}>
                  <line
                    x1={x}
                    y1={pad2.top}
                    x2={x}
                    y2={pad2.top + plot2H}
                    stroke="currentColor"
                    className="text-slate-200 dark:text-slate-800/80"
                    strokeWidth="1"
                    strokeDasharray={ratio === 0 || ratio === 1 ? 'none' : '3 3'}
                  />
                  <text
                    x={x}
                    y={pad2.top + plot2H + 20}
                    textAnchor="middle"
                    className="text-[10px] fill-slate-400 font-mono font-medium"
                  >
                    {val.toLocaleString()}g
                  </text>
                </g>
              );
            })}

            {/* Ejes con títulos */}
            <text
              x={pad2.left + plot2W / 2}
              y={chart2Height - 12}
              textAnchor="middle"
              className="text-[11px] font-bold fill-slate-600 dark:fill-slate-300 uppercase tracking-wider"
            >
              Gramos recomendados en dieta balanceada ({recommendationPeriod === 'daily' ? 'Diario' : 'Quincenal 15d'}) →
            </text>
            <text
              x={-(pad2.top + plot2H / 2)}
              y={20}
              transform="rotate(-90)"
              textAnchor="middle"
              className="text-[11px] font-bold fill-slate-600 dark:fill-slate-300 uppercase tracking-wider"
            >
              Valor / Costo de esa cantidad ($ COP) →
            </text>

            {/* Puntos en el plano cartesiano 2 */}
            {processedPoints.map((pt, i) => {
              const { x, y } = getChart2Coords(pt);
              const isHovered = hoveredPointChart2?.item.id === pt.item.id;

              return (
                <g
                  key={pt.item.id || i}
                  className="cursor-pointer transition-transform duration-150"
                  onMouseEnter={() => setHoveredPointChart2(pt)}
                  onMouseLeave={() => setHoveredPointChart2(null)}
                  onClick={() => onSelectProduct(pt.item)}
                >
                  {isHovered && (
                    <circle
                      cx={x}
                      cy={y}
                      r={14}
                      fill="#10b981"
                      opacity={0.25}
                      className="animate-pulse"
                    />
                  )}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 7.5 : 5.5}
                    fill="#10b981"
                    stroke="#ffffff"
                    strokeWidth={2}
                    className="transition-all duration-200"
                  />
                  {(isHovered || pt.recommendedGrams > maxRecommendedGrams2 * 0.4) && (
                    <text
                      x={x}
                      y={y - 10}
                      textAnchor="middle"
                      className="text-[9px] font-bold fill-slate-700 dark:fill-slate-200 pointer-events-none drop-shadow-xs"
                    >
                      {pt.name.slice(0, 14)} (${pt.recommendedCostCOP.toLocaleString()})
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};
