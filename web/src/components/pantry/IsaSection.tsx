import React, { useState, useMemo } from 'react';
import {
  Globe,
  Droplet,
  Cloud,
  Sprout,
  DollarSign,
  Award,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Search,
  ArrowUpDown,
  HelpCircle,
  Sparkles,
  Layers,
  FoldVertical,
  UnfoldVertical,
  Tag,
  Scale,
} from 'lucide-react';
import { PantryItem } from '../../../../packages/shared/src/types';
import { getFoodIntelligence, FoodIntelligenceData } from '../../lib/pantryFoodIntelligence';

interface IsaSectionProps {
  pantryItems: PantryItem[];
  onSelectProduct: (item: PantryItem) => void;
}

export type IsaSortOption =
  | 'isa_desc'
  | 'isa_asc'
  | 'water_asc'
  | 'carbon_asc'
  | 'efficiency_desc'
  | 'name_asc';

export type IsaGradeFilter = 'all' | 'A+' | 'A' | 'B' | 'C' | 'D';
export type IsaGroupByOption = 'none' | 'grade' | 'category' | 'balance';

export interface ProcessedIsaItem {
  item: PantryItem;
  intel: FoodIntelligenceData;
  isaScore: number;
  isaGrade: 'A+' | 'A' | 'B' | 'C' | 'D';
}

interface IsaGroupData {
  id: string;
  title: string;
  subtitle?: string;
  badgeText?: string;
  badgeStyle?: string;
  items: ProcessedIsaItem[];
  avgIsa: number;
  avgGrade: 'A+' | 'A' | 'B' | 'C' | 'D';
  totalWaterLiters: number;
  totalCarbonKg: number;
}

export const IsaSection: React.FC<IsaSectionProps> = ({ pantryItems, onSelectProduct }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<IsaGradeFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<IsaSortOption>('isa_desc');
  const [groupBy, setGroupBy] = useState<IsaGroupByOption>('none');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Filtrar artículos comestibles activos y calcular su ISA
  const processedItems: ProcessedIsaItem[] = useMemo(() => {
    const active = pantryItems.filter((i) => i.status !== 'agotado');
    const results: ProcessedIsaItem[] = [];

    for (const item of active) {
      const cat = (item.category || '').toLowerCase();
      const name = (item.name || '').toLowerCase();

      // Excluir aseo, limpieza y mascotas
      const isNonFood =
        cat.includes('aseo') ||
        cat.includes('limpieza') ||
        cat.includes('higiene') ||
        cat.includes('mascota') ||
        cat.includes('perro') ||
        cat.includes('gato') ||
        [
          'jabon', 'detergente', 'limpido', 'cloro', 'papel higienico', 'shampoo',
          'crema dental', 'varsol', 'suavizante', 'chunky', 'ringo', 'arena gato'
        ].some((kw) => name.includes(kw));

      if (isNonFood) continue;

      const intel = getFoodIntelligence(item);
      results.push({
        item,
        intel,
        isaScore: intel.isaScore,
        isaGrade: intel.isaGrade,
      });
    }

    return results;
  }, [pantryItems]);

  // Lista de categorías únicas para el filtro
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    processedItems.forEach((p) => {
      if (p.item.category) set.add(p.item.category);
    });
    return Array.from(set);
  }, [processedItems]);

  // Métricas globales del ISA para la despensa
  const globalMetrics = useMemo(() => {
    if (processedItems.length === 0) {
      return {
        avgIsa: 0,
        avgGrade: 'B' as const,
        countAplus: 0,
        countA: 0,
        countB: 0,
        countC: 0,
        countD: 0,
        totalWaterLiters: 0,
        totalCarbonKg: 0,
      };
    }

    let sumIsa = 0;
    let countAplus = 0;
    let countA = 0;
    let countB = 0;
    let countC = 0;
    let countD = 0;
    let totalWater = 0;
    let totalCarbon = 0;

    for (const p of processedItems) {
      sumIsa += p.isaScore;
      if (p.isaGrade === 'A+') countAplus++;
      else if (p.isaGrade === 'A') countA++;
      else if (p.isaGrade === 'B') countB++;
      else if (p.isaGrade === 'C') countC++;
      else countD++;

      const kg = (p.intel.economics.totalItemGrams || 1000) / 1000;
      totalWater += (p.intel.isa.waterLitersPerKg || 1000) * kg;
      totalCarbon += (p.intel.isa.carbonKgCO2ePerKg || 1.5) * kg;
    }

    const avgIsa = Math.round(sumIsa / processedItems.length);
    let avgGrade: 'A+' | 'A' | 'B' | 'C' | 'D' = 'B';
    if (avgIsa >= 85) avgGrade = 'A+';
    else if (avgIsa >= 70) avgGrade = 'A';
    else if (avgIsa >= 50) avgGrade = 'B';
    else if (avgIsa >= 35) avgGrade = 'C';
    else avgGrade = 'D';

    return {
      avgIsa,
      avgGrade,
      countAplus,
      countA,
      countB,
      countC,
      countD,
      totalWaterLiters: Math.round(totalWater),
      totalCarbonKg: Math.round(totalCarbon * 10) / 10,
    };
  }, [processedItems]);

  // Filtrado y ordenamiento de la lista
  const filteredAndSortedItems = useMemo(() => {
    let list = [...processedItems];

    // Búsqueda por texto
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => p.item.name.toLowerCase().includes(q));
    }

    // Filtro por grado
    if (gradeFilter !== 'all') {
      list = list.filter((p) => p.isaGrade === gradeFilter);
    }

    // Filtro por categoría
    if (categoryFilter !== 'all') {
      list = list.filter((p) => p.item.category === categoryFilter);
    }

    // Ordenamiento
    list.sort((a, b) => {
      switch (sortBy) {
        case 'isa_desc':
          return b.isaScore - a.isaScore;
        case 'isa_asc':
          return a.isaScore - b.isaScore;
        case 'water_asc':
          return a.intel.isa.waterLitersPerKg - b.intel.isa.waterLitersPerKg;
        case 'carbon_asc':
          return a.intel.isa.carbonKgCO2ePerKg - b.intel.isa.carbonKgCO2ePerKg;
        case 'efficiency_desc':
          return b.intel.economics.economicScore - a.intel.economics.economicScore;
        case 'name_asc':
          return a.item.name.localeCompare(b.item.name);
        default:
          return b.isaScore - a.isaScore;
      }
    });

    return list;
  }, [processedItems, searchQuery, gradeFilter, categoryFilter, sortBy]);

  // Estilos y badges según grado ISA
  const getGradeStyle = (grade: string) => {
    switch (grade) {
      case 'A+':
        return {
          badge: 'bg-emerald-500 text-white shadow-emerald-500/20 shadow-md ring-2 ring-emerald-400',
          pill: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-500/30',
          border: 'border-emerald-500/40 hover:border-emerald-500',
          barColor: '#10b981',
          label: 'Excelente',
        };
      case 'A':
        return {
          badge: 'bg-teal-600 text-white shadow-teal-500/20 shadow-md',
          pill: 'bg-teal-100 text-teal-800 dark:bg-teal-950/70 dark:text-teal-300 border-teal-500/30',
          border: 'border-teal-500/40 hover:border-teal-500',
          barColor: '#0d9488',
          label: 'Favorable',
        };
      case 'B':
        return {
          badge: 'bg-blue-600 text-white shadow-blue-500/20 shadow-md',
          pill: 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-500/30',
          border: 'border-blue-500/30 hover:border-blue-500',
          barColor: '#3b82f6',
          label: 'Equilibrado',
        };
      case 'C':
        return {
          badge: 'bg-amber-500 text-white shadow-amber-500/20 shadow-md',
          pill: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-500/30',
          border: 'border-amber-500/30 hover:border-amber-500',
          barColor: '#f59e0b',
          label: 'Desfavorable',
        };
      default:
        return {
          badge: 'bg-rose-500 text-white shadow-rose-500/20 shadow-md',
          pill: 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-500/30',
          border: 'border-rose-500/30 hover:border-rose-500',
          barColor: '#f43f5e',
          label: 'Crítico / Ineficiente',
        };
    }
  };

  const currentGradeStyle = getGradeStyle(globalMetrics.avgGrade);

  // AGRUPACIÓN DINÁMICA DE PRODUCTOS
  const groupedData: IsaGroupData[] = useMemo(() => {
    if (groupBy === 'none') return [];

    const map = new Map<string, ProcessedIsaItem[]>();

    filteredAndSortedItems.forEach((pi) => {
      let key = '';
      if (groupBy === 'grade') {
        key = pi.isaGrade;
      } else if (groupBy === 'category') {
        key = pi.item.category || 'Otros';
      } else if (groupBy === 'balance') {
        key = pi.intel.nutriEcoBalance || 'Equilibrado';
      }
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(pi);
    });

    const groups: IsaGroupData[] = [];

    if (groupBy === 'grade') {
      const predefinedGrades: Array<{
        grade: 'A+' | 'A' | 'B' | 'C' | 'D';
        title: string;
        subtitle: string;
      }> = [
        {
          grade: 'A+',
          title: 'Grado A+ • Sobresaliente',
          subtitle: 'Máximo triple impacto: nutrición densa, mínima huella ecológica y alto rendimiento por peso.',
        },
        {
          grade: 'A',
          title: 'Grado A • Favorable',
          subtitle: 'Alimentos eficientes con bajo impacto y aporte nutricional limpio.',
        },
        {
          grade: 'B',
          title: 'Grado B • Equilibrado',
          subtitle: 'Alimentos estándar de consumo diario en la canasta básica familiar.',
        },
        {
          grade: 'C',
          title: 'Grado C • Desfavorable',
          subtitle: 'Mayor huella de agua/carbono o baja densidad de nutrientes útiles.',
        },
        {
          grade: 'D',
          title: 'Grado D • Crítico',
          subtitle: 'Alto impacto ecológico y bajo retorno nutricional por peso pagado.',
        },
      ];

      predefinedGrades.forEach(({ grade, title, subtitle }) => {
        const items = map.get(grade) || [];
        if (items.length > 0) {
          const sumScore = items.reduce((acc, it) => acc + it.isaScore, 0);
          const avgIsa = Math.round(sumScore / items.length);
          const style = getGradeStyle(grade);

          let totalWater = 0;
          let totalCarbon = 0;
          items.forEach((it) => {
            const kg = (it.intel.economics.totalItemGrams || 1000) / 1000;
            totalWater += (it.intel.isa.waterLitersPerKg || 1000) * kg;
            totalCarbon += (it.intel.isa.carbonKgCO2ePerKg || 1.5) * kg;
          });

          groups.push({
            id: `grade-${grade}`,
            title,
            subtitle,
            badgeText: `${grade} (${items.length} productos)`,
            badgeStyle: style.badge,
            items,
            avgIsa,
            avgGrade: grade,
            totalWaterLiters: Math.round(totalWater),
            totalCarbonKg: Math.round(totalCarbon * 10) / 10,
          });
        }
      });
    } else if (groupBy === 'category') {
      // Ordenar categorías por cantidad de productos
      const sortedKeys = Array.from(map.keys()).sort((a, b) => (map.get(b)?.length || 0) - (map.get(a)?.length || 0));

      sortedKeys.forEach((cat) => {
        const items = map.get(cat) || [];
        if (items.length > 0) {
          const sumScore = items.reduce((acc, it) => acc + it.isaScore, 0);
          const avgIsa = Math.round(sumScore / items.length);

          let avgGrade: 'A+' | 'A' | 'B' | 'C' | 'D' = 'B';
          if (avgIsa >= 85) avgGrade = 'A+';
          else if (avgIsa >= 70) avgGrade = 'A';
          else if (avgIsa >= 50) avgGrade = 'B';
          else if (avgIsa >= 35) avgGrade = 'C';
          else avgGrade = 'D';

          const style = getGradeStyle(avgGrade);

          let totalWater = 0;
          let totalCarbon = 0;
          items.forEach((it) => {
            const kg = (it.intel.economics.totalItemGrams || 1000) / 1000;
            totalWater += (it.intel.isa.waterLitersPerKg || 1000) * kg;
            totalCarbon += (it.intel.isa.carbonKgCO2ePerKg || 1.5) * kg;
          });

          groups.push({
            id: `cat-${cat}`,
            title: `Categoría: ${cat}`,
            subtitle: `Evaluación de sostenibilidad en los alimentos pertenecientes a ${cat}.`,
            badgeText: `${items.length} productos`,
            badgeStyle: style.badge,
            items,
            avgIsa,
            avgGrade,
            totalWaterLiters: Math.round(totalWater),
            totalCarbonKg: Math.round(totalCarbon * 10) / 10,
          });
        }
      });
    } else if (groupBy === 'balance') {
      const balanceOrder = ['Excelente', 'Favorable', 'Equilibrado', 'Desfavorable', 'Crítico'];

      balanceOrder.forEach((bal) => {
        const items = map.get(bal) || [];
        if (items.length > 0) {
          const sumScore = items.reduce((acc, it) => acc + it.isaScore, 0);
          const avgIsa = Math.round(sumScore / items.length);

          let avgGrade: 'A+' | 'A' | 'B' | 'C' | 'D' = 'B';
          if (avgIsa >= 85) avgGrade = 'A+';
          else if (avgIsa >= 70) avgGrade = 'A';
          else if (avgIsa >= 50) avgGrade = 'B';
          else if (avgIsa >= 35) avgGrade = 'C';
          else avgGrade = 'D';

          const style = getGradeStyle(avgGrade);

          let totalWater = 0;
          let totalCarbon = 0;
          items.forEach((it) => {
            const kg = (it.intel.economics.totalItemGrams || 1000) / 1000;
            totalWater += (it.intel.isa.waterLitersPerKg || 1000) * kg;
            totalCarbon += (it.intel.isa.carbonKgCO2ePerKg || 1.5) * kg;
          });

          groups.push({
            id: `bal-${bal}`,
            title: `Balance: ${bal}`,
            subtitle: `Alimentos clasificados bajo el estado nutricional y ecológico "${bal}".`,
            badgeText: `${items.length} productos`,
            badgeStyle: style.badge,
            items,
            avgIsa,
            avgGrade,
            totalWaterLiters: Math.round(totalWater),
            totalCarbonKg: Math.round(totalCarbon * 10) / 10,
          });
        }
      });
    }

    return groups;
  }, [groupBy, filteredAndSortedItems]);

  const toggleGroupCollapse = (groupId: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const toggleCollapseAll = () => {
    if (groupedData.length === 0) return;
    const allCollapsed = groupedData.every((g) => !!collapsedGroups[g.id]);
    if (allCollapsed) {
      setCollapsedGroups({});
    } else {
      const next: Record<string, boolean> = {};
      groupedData.forEach((g) => {
        next[g.id] = true;
      });
      setCollapsedGroups(next);
    }
  };

  // Render individual item card
  const renderItemCard = (pi: ProcessedIsaItem, idx: number) => {
    const style = getGradeStyle(pi.isaGrade);
    const { intel, item } = pi;

    return (
      <div
        key={item.id || idx}
        onClick={() => onSelectProduct(item)}
        className={`p-4 md:p-5 bg-white dark:bg-slate-900 border ${style.border} rounded-3xl shadow-xs hover:shadow-md transition cursor-pointer group space-y-3`}
      >
        {/* Cabecera del Alimento */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            {/* Badge de posición y grado */}
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-lg ${style.badge} shrink-0`}
            >
              {pi.isaGrade}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-400 font-bold">#{idx + 1}</span>
                <h4 className="text-sm md:text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                  {item.name}
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                  {item.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Stock en alacena:{' '}
                <strong className="text-slate-700 dark:text-slate-300">
                  {item.quantity} {item.unit}
                </strong>
                {intel.economics.totalPriceCOP
                  ? ` (~$${intel.economics.totalPriceCOP.toLocaleString()} COP)`
                  : ''}
              </p>
            </div>
          </div>

          {/* Puntaje y Barra ISA */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-right">
              <div className="flex items-baseline gap-1 justify-end">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {pi.isaScore}
                </span>
                <span className="text-xs text-slate-400">/100</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.pill}`}>
                {intel.nutriEcoBalance}
              </span>
            </div>

            <div className="w-20 md:w-28 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden hidden sm:block">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${pi.isaScore}%`,
                  backgroundColor: style.barColor,
                }}
              />
            </div>

            <div className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950/60 text-slate-400 group-hover:text-emerald-600 transition">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Explicación de Balance Nutri-Ecológico */}
        {intel.balanceExplanation && (
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80">
            {intel.balanceExplanation}
          </p>
        )}

        {/* Micro-Indicadores de los 4 Pilares del ISA */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1 text-[11px]">
          {/* Pilar 1: Agua */}
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60">
            <Droplet className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px]">Huella Hídrica</span>
              <strong className="text-slate-800 dark:text-slate-200">
                {intel.isa.waterLitersPerKg.toLocaleString()} L/kg
              </strong>{' '}
              <span className="text-[9px] text-slate-400">({intel.isa.waterCategory})</span>
            </div>
          </div>

          {/* Pilar 2: Carbono */}
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60">
            <Cloud className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px]">Emisiones CO₂</span>
              <strong className="text-slate-800 dark:text-slate-200">
                {intel.isa.carbonKgCO2ePerKg} kg CO₂e
              </strong>{' '}
              <span className="text-[9px] text-slate-400">({intel.isa.carbonLevel})</span>
            </div>
          </div>

          {/* Pilar 3: Suelo */}
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60">
            <Sprout className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px]">Presión Suelo</span>
              <strong className="text-slate-800 dark:text-slate-200">
                {intel.isa.landUseM2PerKg} m²/kg
              </strong>{' '}
              <span className="text-[9px] text-slate-400">(Riesgo {intel.isa.soilDegradationRisk})</span>
            </div>
          </div>

          {/* Pilar 4: Eficiencia Económica */}
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px]">Costo Nutricional</span>
              <strong className="text-slate-800 dark:text-slate-200">
                ${intel.economics.pricePerNutrientGramCOP} COP/g
              </strong>{' '}
              <span className="text-[9px] text-slate-400">({intel.economics.economicNutritionalEfficiency})</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ========================================================================= */}
      {/* 1. CABECERA & INTRODUCCIÓN AL ISA                                         */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
                Triple Equilibrio: Nutrición • Ecosistema • Economía
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>Índice de Sostenibilidad Alimentaria (ISA)</span>
              <button
                onClick={() => setShowInfoModal(true)}
                title="¿Cómo funciona el ISA?"
                className="text-slate-400 hover:text-emerald-600 transition"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
              El ISA califica cada alimento de tu despensa de 0 a 100 evaluando simultáneamente su{' '}
              <strong className="text-slate-700 dark:text-slate-300">densidad nutricional limpia (40%)</strong>, su{' '}
              <strong className="text-slate-700 dark:text-slate-300">huella ecológica de agua, carbono y suelo (35%)</strong>, y su{' '}
              <strong className="text-slate-700 dark:text-slate-300">costo por gramo de nutriente útil (25%)</strong>.
            </p>
          </div>

          {/* Medidor Global Promedio */}
          <div className="p-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 rounded-2xl border border-emerald-500/20 flex items-center gap-4 min-w-[220px]">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${currentGradeStyle.badge}`}
            >
              {globalMetrics.avgGrade}
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Promedio Despensa</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {globalMetrics.avgIsa}
                <span className="text-xs font-normal text-slate-400">/100</span>
              </p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentGradeStyle.pill}`}>
                {currentGradeStyle.label}
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* 2. KPIS DE IMPACTO ECOLÓGICO & DISTRIBUCIÓN POR GRADOS                   */}
        {/* ======================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Card 1: Alimentos Líderes A+/A */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Líderes Sostenibles (A+/A)</span>
              <Award className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-xl font-black text-slate-900 dark:text-white">
              {globalMetrics.countAplus + globalMetrics.countA}{' '}
              <span className="text-xs font-normal text-slate-400">
                ({Math.round(((globalMetrics.countAplus + globalMetrics.countA) / (processedItems.length || 1)) * 100)}%)
              </span>
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              {globalMetrics.countAplus} con Grado A+ • {globalMetrics.countA} con Grado A
            </p>
          </div>

          {/* Card 2: Alimentos B (Estándar) */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Balance Equilibrado (B)</span>
              <Scale className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-xl font-black text-slate-900 dark:text-white">
              {globalMetrics.countB}{' '}
              <span className="text-xs font-normal text-slate-400">
                ({Math.round((globalMetrics.countB / (processedItems.length || 1)) * 100)}%)
              </span>
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              Canasta básica regular
            </p>
          </div>

          {/* Card 3: Huella Hídrica Total */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Huella Hídrica en Stock</span>
              <Droplet className="w-4 h-4 text-cyan-500" />
            </div>
            <p className="text-xl font-black text-slate-900 dark:text-white">
              {globalMetrics.totalWaterLiters.toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-400">L agua</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              Agua virtual contenida en despensa
            </p>
          </div>

          {/* Card 4: Alimentos en Observación C/D */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>En Observación (C/D)</span>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            </div>
            <p className="text-xl font-black text-rose-600 dark:text-rose-400">
              {globalMetrics.countC + globalMetrics.countD}{' '}
              <span className="text-xs font-normal text-slate-400">
                ({Math.round(((globalMetrics.countC + globalMetrics.countD) / (processedItems.length || 1)) * 100)}%)
              </span>
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              Alta huella o bajo retorno nutricional
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BARRA DE HERRAMIENTAS: BÚSQUEDA, FILTROS, AGRUPACIÓN Y ORDEN           */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Buscador */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar alimento por nombre..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Filtros y Ordenamiento */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Filtro por Grado */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-xs">
              {(['all', 'A+', 'A', 'B', 'C', 'D'] as IsaGradeFilter[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setGradeFilter(g)}
                  className={`px-2.5 py-1 rounded-xl font-bold transition text-[11px] ${
                    gradeFilter === g
                      ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {g === 'all' ? 'Todos' : g}
                </button>
              ))}
            </div>

            {/* Ordenar por */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as IsaSortOption)}
                className="px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="isa_desc">Mayor ISA (Más Sostenible)</option>
                <option value="isa_asc">Menor ISA (Mayor Impacto)</option>
                <option value="water_asc">Menor Huella Hídrica (Agua)</option>
                <option value="carbon_asc">Menor Huella de Carbono</option>
                <option value="efficiency_desc">Mayor Retorno por Peso ($)</option>
                <option value="name_asc">Nombre A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Barra de Agrupación (Control de Grupos) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-xs flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 pl-2 pr-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-emerald-500" />
              <span>Agrupar por:</span>
            </span>
            <button
              onClick={() => setGroupBy('none')}
              className={`px-3 py-1 rounded-xl font-bold transition text-[11px] ${
                groupBy === 'none'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Sin agrupar
            </button>
            <button
              onClick={() => setGroupBy('grade')}
              className={`px-3 py-1 rounded-xl font-bold transition text-[11px] ${
                groupBy === 'grade'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Grado ISA (A+, A, B, C, D)
            </button>
            <button
              onClick={() => setGroupBy('category')}
              className={`px-3 py-1 rounded-xl font-bold transition text-[11px] ${
                groupBy === 'category'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Categoría
            </button>
            <button
              onClick={() => setGroupBy('balance')}
              className={`px-3 py-1 rounded-xl font-bold transition text-[11px] ${
                groupBy === 'balance'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Balance Nutri-Ecológico
            </button>
          </div>

          {/* Acciones de colapsar / expandir cuando está agrupado */}
          {groupBy !== 'none' && groupedData.length > 0 && (
            <button
              onClick={toggleCollapseAll}
              className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-emerald-600 flex items-center gap-1 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition"
            >
              {groupedData.every((g) => !!collapsedGroups[g.id]) ? (
                <>
                  <UnfoldVertical className="w-3.5 h-3.5" />
                  <span>Expandir todos los grupos</span>
                </>
              ) : (
                <>
                  <FoldVertical className="w-3.5 h-3.5" />
                  <span>Colapsar todos los grupos</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. LISTADO DE PRODUCTOS (PLANO O AGRUPADO)                                */}
      {/* ========================================================================= */}
      {filteredAndSortedItems.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <Globe className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No se encontraron alimentos con estos filtros
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Intenta limpiar el buscador o seleccionar otro grado ISA.
          </p>
        </div>
      ) : groupBy === 'none' ? (
        // VISTA PLANA SIN AGRUPAR
        <div className="space-y-3">
          {filteredAndSortedItems.map((pi, idx) => renderItemCard(pi, idx))}
        </div>
      ) : (
        // VISTA AGRUPADA EN SECCIONES / CONTENEDORES
        <div className="space-y-6">
          {groupedData.map((group) => {
            const isCollapsed = !!collapsedGroups[group.id];
            const groupGradeStyle = getGradeStyle(group.avgGrade);

            return (
              <div
                key={group.id}
                className="bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-4 md:p-6 space-y-4 transition"
              >
                {/* Cabecera del Grupo */}
                <div
                  onClick={() => toggleGroupCollapse(group.id)}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 group-hover:text-emerald-600 transition shrink-0"
                    >
                      {isCollapsed ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronUp className="w-4 h-4" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                          {group.title}
                        </h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            group.badgeStyle || groupGradeStyle.badge
                          }`}
                        >
                          {group.badgeText || `${group.items.length} productos`}
                        </span>
                      </div>
                      {group.subtitle && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {group.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Resumen de Métricas del Grupo */}
                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                        Promedio Grupo
                      </span>
                      <div className="flex items-baseline gap-1 justify-end">
                        <strong className="text-base font-black text-slate-900 dark:text-white">
                          {group.avgIsa}
                        </strong>
                        <span className="text-[10px] text-slate-400">/100</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${groupGradeStyle.pill}`}>
                          {groupGradeStyle.label}
                        </span>
                      </div>
                    </div>

                    <div className="hidden sm:block text-right border-l border-slate-200 dark:border-slate-800 pl-4">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                        Huella Hídrica Total
                      </span>
                      <strong className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
                        {group.totalWaterLiters.toLocaleString()} L
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Lista de Alimentos dentro del Grupo */}
                {!isCollapsed && (
                  <div className="space-y-3 pt-2 animate-in fade-in duration-200">
                    {group.items.map((pi, idx) => renderItemCard(pi, idx))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL EDUCATIVO: ¿CÓMO SE CALCULA EL ISA?                                 */}
      {/* ========================================================================= */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-2xl">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Metodología del Índice de Sostenibilidad Alimentaria (ISA)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Triple equilibrio para compras conscientes y saludables
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                El <strong className="text-slate-900 dark:text-white font-bold">ISA (0 a 100 puntos)</strong> es una métrica desarrollada para evaluar la calidad integral de los alimentos combinando tres dimensiones complementarias:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-500/20 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>1. Nutrición (40%)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Premia alimentos naturales ricos en proteína, fibra y micronutrientes esenciales. Penaliza sellos de azúcares o sodio.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-500/20 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-cyan-800 dark:text-cyan-300">
                    <Droplet className="w-4 h-4 text-cyan-600" />
                    <span>2. Ecosistema (35%)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Mide el agua dulce consumida (L/kg), emisiones de gases invernadero (CO₂e) y la degradación del suelo agrícola.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-500/20 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-blue-800 dark:text-blue-300">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                    <span>3. Economía (25%)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Calcula el precio pagado por cada gramo de nutriente real aprovechable ($ COP/g). Premia el máximo retorno por peso gastado.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white">Escala de Calificación:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px]">
                  <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold">
                    A+ (85-100)<br /><span className="font-normal text-[10px]">Excelente</span>
                  </div>
                  <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 font-bold">
                    A (70-84)<br /><span className="font-normal text-[10px]">Favorable</span>
                  </div>
                  <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 font-bold">
                    B (50-69)<br /><span className="font-normal text-[10px]">Equilibrado</span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 font-bold">
                    C (35-49)<br /><span className="font-normal text-[10px]">Desfavorable</span>
                  </div>
                  <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 font-bold">
                    D (&lt;35)<br /><span className="font-normal text-[10px]">Crítico</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
