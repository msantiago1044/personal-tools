import React, { useState } from 'react';
import {
  ArrowLeft,
  Landmark,
  Package,
  Zap,
  Sun,
  Moon,
  Laptop,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { ModuleProps } from '../../modules/moduleRegistry';
import { ThemeMode, getStoredTheme, applyTheme } from '../../lib/theme';
import { useAssetsData } from './hooks/useAssetsData';
import { Asset } from '../../../../packages/shared/src/types';
import { NetWorthDashboardTab } from './components/NetWorthDashboardTab';
import { AssetInventoryTab } from './components/AssetInventoryTab';
import { DebtSnowballTab } from './components/DebtSnowballTab';
import { AssetFormModal } from './components/AssetFormModal';

type ActiveTab = 'dashboard' | 'inventory' | 'debts';

export const AssetsModule: React.FC<ModuleProps> = ({ user, onBackToHub }) => {
  const userId = user?.id || 'local_user';
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assetToEdit, setAssetToEdit] = useState<Asset | null>(null);

  const {
    assets,
    debts,
    financeAccounts,
    summary,
    loading,
    refreshData,
    handleSaveAsset,
    handleDeleteAsset,
    handleSaveDebt,
  } = useAssetsData(userId);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const openCreateModal = () => {
    setAssetToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (asset: Asset) => {
    setAssetToEdit(asset);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Barra de Navegación Superior */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHub}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Volver al Launcher"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Hub</span>
            </button>

            <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🏛️</span>
              <div>
                <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">
                  Patrimonio & Activos
                </h1>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  Contabilidad Patrimonial, Bienes y Amortización
                </span>
              </div>
            </div>
          </div>

          {/* Selector de Pestañas (Desktop) */}
          <div className="hidden md:flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Dashboard Patrimonio</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'inventory'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Inventario de Bienes</span>
            </button>

            <button
              onClick={() => setActiveTab('debts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'debts'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Plan de Deudas</span>
            </button>
          </div>

          {/* Acciones Rápidas & Tema */}
          <div className="flex items-center gap-2">
            <button
              onClick={refreshData}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Refrescar datos"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-500' : ''}`} />
            </button>

            {/* Alternador de tema */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => handleThemeChange('light')}
                className={`p-1.5 rounded-lg transition-all ${
                  theme === 'light'
                    ? 'bg-white dark:bg-slate-700 text-amber-500 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
                title="Modo claro"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`p-1.5 rounded-lg transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-700 text-blue-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
                title="Modo oscuro"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Barra de pestañas móvil */}
        <div className="md:hidden flex items-center border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'dashboard'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-500'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'inventory'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-500'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Inventario ({assets.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('debts')}
            className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'debts'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-500'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Deudas</span>
          </button>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <NetWorthDashboardTab
            summary={summary}
            assets={assets}
            onGoToInventory={() => setActiveTab('inventory')}
            onGoToDebts={() => setActiveTab('debts')}
          />
        )}

        {activeTab === 'inventory' && (
          <AssetInventoryTab
            assets={assets}
            onOpenCreateModal={openCreateModal}
            onEditAsset={openEditModal}
            onDeleteAsset={handleDeleteAsset}
          />
        )}

        {activeTab === 'debts' && (
          <DebtSnowballTab
            debts={debts}
            financeAccounts={financeAccounts}
            onSaveDebt={handleSaveDebt}
          />
        )}
      </main>

      {/* Modal de Creación / Edición de Activo */}
      <AssetFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAsset}
        assetToEdit={assetToEdit}
      />
    </div>
  );
};
