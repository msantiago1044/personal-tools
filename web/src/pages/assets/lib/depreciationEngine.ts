import { Asset, AssetCategory, DepreciationMethod } from '../../../../../packages/shared/src/types';

export interface DepreciationResult {
  currentValue: number;
  depreciatedAmount: number;
  ageMonths: number;
  remainingLifeMonths: number;
  percentageRemaining: number;
}

/**
 * Devuelve configuraciones predeterminadas lógicas para cada tipo de activo
 */
export function getDefaultCategorySettings(category: AssetCategory): {
  usefulLifeMonths: number;
  depreciationMethod: DepreciationMethod;
  salvagePercentage: number;
  defaultAnnualRate: number;
} {
  switch (category) {
    case 'enseres':
      // Cama, nevera, muebles, almohadas: vida útil 5 a 10 años, valor residual ~10%
      return {
        usefulLifeMonths: 84, // 7 años
        depreciationMethod: 'lineal',
        salvagePercentage: 10,
        defaultAnnualRate: 0,
      };
    case 'tecnologia':
      // Laptops, smartphones: vida útil 3 años, depreciación rápida
      return {
        usefulLifeMonths: 36, // 3 años
        depreciationMethod: 'anual_pct',
        salvagePercentage: 5,
        defaultAnnualRate: 25, // 25% anual
      };
    case 'vehiculo':
      // Autos, motos: vida útil 10 años, depreciación ~12% anual
      return {
        usefulLifeMonths: 120, // 10 años
        depreciationMethod: 'anual_pct',
        salvagePercentage: 15,
        defaultAnnualRate: 12, // 12% anual
      };
    case 'inmueble':
      // Inmuebles: vida útil larga, plusvalía anual estimada ~4%
      return {
        usefulLifeMonths: 360, // 30 años
        depreciationMethod: 'apreciacion',
        salvagePercentage: 100,
        defaultAnnualRate: 4, // +4% anual
      };
    case 'inversion':
      return {
        usefulLifeMonths: 120,
        depreciationMethod: 'ninguna',
        salvagePercentage: 100,
        defaultAnnualRate: 0,
      };
    case 'otro':
    default:
      return {
        usefulLifeMonths: 60, // 5 años
        depreciationMethod: 'lineal',
        salvagePercentage: 0,
        defaultAnnualRate: 0,
      };
  }
}

/**
 * Calcula la depreciación o apreciación actual de un activo a una fecha determinada.
 */
export function calculateAssetDepreciation(asset: Asset, asOfDate: Date = new Date()): DepreciationResult {
  const purchaseDate = new Date(asset.purchase_date);
  
  // Calcular meses de diferencia
  const yearDiff = asOfDate.getFullYear() - purchaseDate.getFullYear();
  const monthDiff = asOfDate.getMonth() - purchaseDate.getMonth();
  const dayDiff = asOfDate.getDate() - purchaseDate.getDate();
  
  let rawMonths = yearDiff * 12 + monthDiff;
  if (dayDiff < 0) {
    rawMonths -= 0.5; // Ajuste si aún no cumple el día completo del mes
  }
  const ageMonths = Math.max(0, rawMonths);
  const ageYears = ageMonths / 12;

  const cost = Number(asset.purchase_price) || 0;
  const salvageValue = Math.min(cost, Math.max(0, Number(asset.salvage_value) || 0));
  const usefulLife = Math.max(1, Number(asset.useful_life_months) || 12);
  const annualRate = Math.max(0, Number(asset.annual_rate) || 0) / 100;

  let currentValue = cost;

  switch (asset.depreciation_method) {
    case 'lineal': {
      // (Costo - Residual) / Meses
      const depreciableAmount = Math.max(0, cost - salvageValue);
      const monthlyDepreciation = depreciableAmount / usefulLife;
      const totalDepreciated = monthlyDepreciation * ageMonths;
      currentValue = Math.max(salvageValue, cost - totalDepreciated);
      break;
    }

    case 'anual_pct': {
      // P * (1 - r)^t
      if (annualRate > 0) {
        currentValue = cost * Math.pow(1 - annualRate, ageYears);
      }
      currentValue = Math.max(salvageValue, currentValue);
      break;
    }

    case 'apreciacion': {
      // P * (1 + r)^t (Plusvalía)
      if (annualRate > 0) {
        currentValue = cost * Math.pow(1 + annualRate, ageYears);
      }
      break;
    }

    case 'ninguna':
    default:
      currentValue = cost;
      break;
  }

  // Redondear a 2 decimales
  currentValue = Math.round(currentValue * 100) / 100;
  const depreciatedAmount = Math.round((cost - currentValue) * 100) / 100;
  const remainingLifeMonths = Math.max(0, Math.round(usefulLife - ageMonths));
  
  let percentageRemaining = 100;
  if (cost > 0) {
    percentageRemaining = Math.max(0, Math.min(100, Math.round((currentValue / cost) * 100)));
  }

  return {
    currentValue,
    depreciatedAmount,
    ageMonths: Math.round(ageMonths * 10) / 10,
    remainingLifeMonths,
    percentageRemaining,
  };
}
