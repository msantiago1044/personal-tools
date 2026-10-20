import React from 'react';
import {
  Landmark,
  TrendingUp,
  Wallet,
  CreditCard,
  Building,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  PieChart,
} from 'lucide-react';
import { Asset } from '../../../../../packages/shared/src/types';

interface NetWorthDashboardTabProps {
  summary: {
    totalAssetsValue: number;
    totalPurchaseCost: number;
    totalDepreciation: number;
    totalCashLiquidity: number;
    totalLiabilities: number;
    totalGrossAssets: number;
    netWorth: number;
    debtToAssetRatio: number;
  };
  assets: Asset[];
  onGoToInventory: () => void;
  onGoToDebts: () => void;
}

export const NetWorthDashboardTab: React.FC<NetWorthDashboardTabProps> = ({
  summary,
  assets,
  onGoToInventory,
  onGoToDebts,
}) => {
  // Desglose por categorías para la barra de distribución
  const categoryTotals = React.useMemo(() => {
    const map: Record<string, number> = {
      inmueble: 0,
      vehiculo: 0,
      enseres: 0,
      tecnologia: 0,
      inversion: 0,
    };
    assets.forEach((a) => {
      const val = Number(a.current_value) || 0;
      if (map[a.category] !== undefined) {
        map[a.category] += val;
      } else {
        map['enseres'] += val;
      }
    });
    return map;
  }, [assets]);

  const totalWealth = summary.totalGrossAssets || 1; // Evitar división por cero

  const getHealthBadge = (ratio: number) => {
    if (ratio <= 20) {
      return { label: 'Excelente Salud (< 20%)', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' };
    }
    if (ratio <= 45) {
      return { label: 'Apalancamiento Moderado', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
    }
    return { label: 'Nivel Alto de Deuda', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' };
  };

  const health = getHealthBadge(summary.debtToAssetRatio);

  return (
    <div className="space-y-6">
      {/* Hero: Tarjeta Principal de Patrimonio Neto */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-800 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Landmark className="w-4 h-4" />
                <span>Patrimonio Neto Total (Net Worth)</span>
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-mono tracking-tight mt-2 text-white">
                ${summary.netWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                Representa tu riqueza real: todo lo que posees (bienes valorados + dinero disponible) restando tus deudas.
              </p>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${health.color}`}>
                {health.label}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Ratio Deuda/Activo: {summary.debtToAssetRatio}%
              </span>
            </div>
          </div>

          {/* Ecuación Visual */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Activos Tangibles */}
            <div
              onClick={onGoToInventory}
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-blue-400" />
                  <span>Bienes & Activos</span>
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <span className="text-xl font-bold font-mono text-white block mt-1.5">
                +${summary.totalAssetsValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-[11px] text-slate-400">
                {assets.length} bienes inventariados
              </span>
            </div>

            {/* Liquidez en Finanzas */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Liquidez en Cuentas</span>
                </span>
              </div>
              <span className="text-xl font-bold font-mono text-white block mt-1.5">
                +${summary.totalCashLiquidity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-[11px] text-slate-400">
                Bancos y efectivo de Finanzas
              </span>
            </div>

            {/* Deudas y Pasivos */}
            <div
              onClick={onGoToDebts}
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-rose-400" />
                  <span>Deudas & Pasivos</span>
                </span>
                <ArrowDownRight className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <span className="text-xl font-bold font-mono text-rose-400 block mt-1.5">
                -${summary.totalLiabilities.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-[11px] text-slate-400">
                Tarjetas y préstamos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Composición de la Riqueza (Barra Proporcional) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-500" />
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">
              Distribución de tus Activos Totales
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Total Bruto: ${summary.totalGrossAssets.toLocaleString('en-US', { minimumFractionDigits: 0 })}
          </span>
        </div>

        {/* Barra segmentada */}
        <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
          {categoryTotals.inmueble > 0 && (
            <div
              title={`Inmuebles: $${categoryTotals.inmueble.toLocaleString()}`}
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${(categoryTotals.inmueble / totalWealth) * 100}%` }}
            />
          )}
          {categoryTotals.vehiculo > 0 && (
            <div
              title={`Vehículos: $${categoryTotals.vehiculo.toLocaleString()}`}
              className="h-full bg-indigo-500 transition-all"
              style={{ width: `${(categoryTotals.vehiculo / totalWealth) * 100}%` }}
            />
          )}
          {categoryTotals.enseres > 0 && (
            <div
              title={`Enseres y Hogar: $${categoryTotals.enseres.toLocaleString()}`}
              className="h-full bg-amber-500 transition-all"
              style={{ width: `${(categoryTotals.enseres / totalWealth) * 100}%` }}
            />
          )}
          {categoryTotals.tecnologia > 0 && (
            <div
              title={`Tecnología: $${categoryTotals.tecnologia.toLocaleString()}`}
              className="h-full bg-purple-500 transition-all"
              style={{ width: `${(categoryTotals.tecnologia / totalWealth) * 100}%` }}
            />
          )}
          {summary.totalCashLiquidity > 0 && (
            <div
              title={`Liquidez: $${summary.totalCashLiquidity.toLocaleString()}`}
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${(summary.totalCashLiquidity / totalWealth) * 100}%` }}
            />
          )}
        </div>

        {/* Leyenda de la barra */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-slate-600 dark:text-slate-400">
              Inmuebles ({Math.round((categoryTotals.inmueble / totalWealth) * 100)}%)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="text-slate-600 dark:text-slate-400">
              Vehículos ({Math.round((categoryTotals.vehiculo / totalWealth) * 100)}%)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600 dark:text-slate-400">
              Hogar & Enseres ({Math.round((categoryTotals.enseres / totalWealth) * 100)}%)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span className="text-slate-600 dark:text-slate-400">
              Tecnología ({Math.round((categoryTotals.tecnologia / totalWealth) * 100)}%)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-400">
              Liquidez ({Math.round((summary.totalCashLiquidity / totalWealth) * 100)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Tarjeta de Sabiduría Contable */}
      <div className="p-5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3.5">
        <Sparkles className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
            ¿Por qué medir tu Patrimonio y no solo tus ingresos?
          </h4>
          <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 mt-1 leading-relaxed">
            Una persona puede tener altos ingresos pero un patrimonio negativo si gasta más de lo que adquiere en bienes o acumula deudas costosas.
            Al registrar compras duraderas (cama, nevera, vehículo, inmuebles), reconoces el valor residual de lo que posees y puedes planificar tu libertad financiera con certeza.
          </p>
        </div>
      </div>
    </div>
  );
};
