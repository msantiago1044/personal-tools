import { useState, useEffect, useMemo, useCallback } from 'react';
import { Asset, DebtDetail, Account } from '../../../../../packages/shared/src/types';
import {
  fetchAssets,
  saveAsset,
  deleteAsset,
  fetchFinanceAccounts,
  fetchDebtDetails,
  saveDebtDetail,
} from '../services/assetsService';
import { calculateAssetDepreciation } from '../lib/depreciationEngine';

export function useAssetsData(userId: string) {
  const [rawAssets, setRawAssets] = useState<Asset[]>([]);
  const [debts, setDebts] = useState<DebtDetail[]>([]);
  const [financeAccounts, setFinanceAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Recarga sincronizada de datos
  const refreshData = useCallback(async () => {
    setLoading(true);
    const [loadedAssets, loadedAccounts, loadedDebts] = await Promise.all([
      fetchAssets(userId),
      fetchFinanceAccounts(userId),
      fetchDebtDetails(userId),
    ]);
    setRawAssets(loadedAssets);
    setFinanceAccounts(loadedAccounts);
    setDebts(loadedDebts);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Activos con cálculos dinámicos de depreciación a la fecha actual
  const assets = useMemo(() => {
    const now = new Date();
    return rawAssets.map((asset) => {
      const dep = calculateAssetDepreciation(asset, now);
      return {
        ...asset,
        current_value: dep.currentValue,
        depreciated_amount: dep.depreciatedAmount,
        age_months: dep.ageMonths,
        remaining_life_months: dep.remainingLifeMonths,
      };
    });
  }, [rawAssets]);

  // Cálculos consolidados de Patrimonio
  const summary = useMemo(() => {
    // 1. Valor total de bienes tangibles e inversiones
    const totalAssetsValue = assets
      .filter((a) => a.is_active)
      .reduce((sum, a) => sum + (a.current_value || 0), 0);

    const totalPurchaseCost = assets
      .filter((a) => a.is_active)
      .reduce((sum, a) => sum + Number(a.purchase_price || 0), 0);

    const totalDepreciation = totalPurchaseCost - totalAssetsValue;

    // 2. Liquidez disponible en Finanzas (cuentas de efectivo, ahorro, corriente)
    const liquidAccounts = financeAccounts.filter(
      (acc) => acc.type === 'efectivo' || acc.type === 'ahorro' || (acc.type === 'tarjeta' && (acc.current_balance || 0) > 0)
    );
    const totalCashLiquidity = liquidAccounts.reduce(
      (sum, acc) => sum + Math.max(0, Number(acc.current_balance ?? acc.initial_balance ?? 0)),
      0
    );

    // 3. Pasivos y Deudas (deudas explícitas o cuentas con saldo negativo)
    const cardLiabilities = financeAccounts
      .filter((acc) => acc.type === 'tarjeta' && (acc.current_balance || 0) < 0)
      .reduce((sum, acc) => sum + Math.abs(Number(acc.current_balance || 0)), 0);

    const explicitDebtsTotal = debts.reduce((sum, d) => sum + Number(d.current_balance || 0), 0);
    const totalLiabilities = Math.max(cardLiabilities, explicitDebtsTotal);

    // 4. Patrimonio Neto
    const totalGrossAssets = totalAssetsValue + totalCashLiquidity;
    const netWorth = totalGrossAssets - totalLiabilities;
    const debtToAssetRatio = totalGrossAssets > 0 ? (totalLiabilities / totalGrossAssets) * 100 : 0;

    return {
      totalAssetsValue,
      totalPurchaseCost,
      totalDepreciation,
      totalCashLiquidity,
      totalLiabilities,
      totalGrossAssets,
      netWorth,
      debtToAssetRatio: Math.round(debtToAssetRatio * 10) / 10,
    };
  }, [assets, financeAccounts, debts]);

  // Manejo de activos
  const handleSaveAsset = async (assetData: Partial<Asset>) => {
    const saved = await saveAsset(assetData, userId);
    if (saved) {
      setRawAssets((prev) => {
        const idx = prev.findIndex((a) => a.id === saved.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = saved;
          return next;
        }
        return [saved, ...prev];
      });
    }
    return saved;
  };

  const handleDeleteAsset = async (assetId: string) => {
    const ok = await deleteAsset(assetId, userId);
    if (ok) {
      setRawAssets((prev) => prev.filter((a) => a.id !== assetId));
    }
    return ok;
  };

  // Manejo de deudas
  const handleSaveDebt = async (debtData: Partial<DebtDetail>) => {
    const saved = await saveDebtDetail(debtData, userId);
    setDebts((prev) => {
      const idx = prev.findIndex((d) => d.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [...prev, saved];
    });
    return saved;
  };

  return {
    assets,
    debts,
    financeAccounts,
    summary,
    loading,
    refreshData,
    handleSaveAsset,
    handleDeleteAsset,
    handleSaveDebt,
  };
}
