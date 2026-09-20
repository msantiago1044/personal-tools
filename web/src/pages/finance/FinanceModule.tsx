import React, { useState, useEffect } from 'react';
import { supabase, signOut } from '../../lib/supabase';
import { Account, Category, Transaction } from '../../../../packages/shared/src/types';
import { TransactionModal } from '../../components/finance/TransactionModal';
import { BudgetGaugeCard } from '../../components/finance/BudgetGaugeCard';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  SlidersHorizontal,
  Calendar,
  Layers,
  PieChart,
  Settings,
  PlusCircle,
  Search,
  Filter,
  ArrowLeft,
  LogOut,
  ChevronDown,
  Check,
  TrendingUp,
  CreditCard,
  Banknote,
  PiggyBank
} from 'lucide-react';

interface FinanceModuleProps {
  onBackToHub: () => void;
  user: any;
}

type TabType = 'home' | 'transactions' | 'accounts' | 'categories' | 'budgets' | 'reports_date' | 'reports_category' | 'settings';
type TimeFilter = 'dia' | 'semana' | 'mes' | 'ano' | 'todo';

export const FinanceModule: React.FC<FinanceModuleProps> = ({ onBackToHub, user }) => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('mes');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]); // empty = all accounts
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal de registro rápido
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Widgets configurables del Home
  const [showConfigWidgets, setShowConfigWidgets] = useState<boolean>(false);
  const [activeWidgets, setActiveWidgets] = useState({
    dailyCashflow: true,
    monthlyBalance: true,
    recentTransactions: true,
    budgetGauge: true,
    accountCards: true,
  });

  // Filtros avanzados para la pestaña de movimientos
  const [txSearch, setTxSearch] = useState<string>('');
  const [txTypeFilter, setTxTypeFilter] = useState<string>('todos');
  const [txCategoryFilter, setTxCategoryFilter] = useState<string>('todas');
  const [txAccountFilter, setTxAccountFilter] = useState<string>('todas');

  // Formulario nueva cuenta
  const [newAccountName, setNewAccountName] = useState<string>('');
  const [newAccountType, setNewAccountType] = useState<Account['type']>('efectivo');
  const [newAccountInitial, setNewAccountInitial] = useState<string>('0');
  const [accountFormOpen, setAccountFormOpen] = useState<boolean>(false);

  // Formulario nueva categoría
  const [newCatName, setNewCatName] = useState<string>('');
  const [newCatType, setNewCatType] = useState<Category['type']>('salida');
  const [newCatColor, setNewCatColor] = useState<string>('#3B82F6');
  const [categoryFormOpen, setCategoryFormOpen] = useState<boolean>(false);

  // Cargar datos
  const loadAllData = async () => {
    setLoading(true);
    try {
      // 1. Cuentas
      const { data: accData } = await supabase.from('accounts').select('*').order('created_at');
      if (accData) setAccounts(accData);

      // 2. Categorías
      const { data: catData } = await supabase.from('categories').select('*').order('name');
      if (catData) setCategories(catData);

      // 3. Movimientos
      const { data: txData } = await supabase
        .from('transactions')
        .select(`
          *,
          account:accounts!transactions_account_id_fkey(id, name, type, color),
          destination_account:accounts!transactions_destination_account_id_fkey(id, name, type, color),
          category:categories(id, name, type, icon, color)
        `)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (txData) setTransactions(txData);
    } catch (err) {
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Filtrado de transacciones según cuenta seleccionada y filtro temporal
  const filteredTransactions = transactions.filter((tx) => {
    // Filtro por cuenta
    if (selectedAccountIds.length > 0) {
      const matchSource = selectedAccountIds.includes(tx.account_id);
      const matchDest = tx.destination_account_id ? selectedAccountIds.includes(tx.destination_account_id) : false;
      if (!matchSource && !matchDest) return false;
    }

    // Filtro por tiempo
    if (timeFilter !== 'todo') {
      const txDate = new Date(tx.date);
      const now = new Date();
      if (timeFilter === 'dia') {
        const todayStr = now.toISOString().split('T')[0];
        if (tx.date !== todayStr) return false;
      } else if (timeFilter === 'semana') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        if (txDate < weekAgo) return false;
      } else if (timeFilter === 'mes') {
        if (txDate.getMonth() !== now.getMonth() || txDate.getFullYear() !== now.getFullYear()) {
          return false;
        }
      } else if (timeFilter === 'ano') {
        if (txDate.getFullYear() !== now.getFullYear()) return false;
      }
    }

    return true;
  });

  // Métricas financieras calculadas
  const totalIncome = filteredTransactions
    .filter((tx) => tx.type === 'ingreso')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const totalExpense = filteredTransactions
    .filter((tx) => tx.type === 'salida')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const netBalance = totalIncome - totalExpense;

  // Toggle de selector de cuentas
  const toggleAccountFilter = (accId: string) => {
    if (selectedAccountIds.includes(accId)) {
      setSelectedAccountIds(selectedAccountIds.filter((id) => id !== accId));
    } else {
      setSelectedAccountIds([...selectedAccountIds, accId]);
    }
  };

  const selectAllAccounts = () => setSelectedAccountIds([]);

  // Crear cuenta
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountName.trim()) return;
    await supabase.from('accounts').insert({
      user_id: user.id,
      name: newAccountName.trim(),
      type: newAccountType,
      initial_balance: parseFloat(newAccountInitial) || 0,
      color: '#3B82F6',
    });
    setNewAccountName('');
    setNewAccountInitial('0');
    setAccountFormOpen(false);
    loadAllData();
  };

  // Crear categoría
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await supabase.from('categories').insert({
      user_id: user.id,
      name: newCatName.trim(),
      type: newCatType,
      color: newCatColor,
      icon: 'tag',
    });
    setNewCatName('');
    setCategoryFormOpen(false);
    loadAllData();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar de Navegación */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Header con botón para volver al HUB */}
          <div className="p-4 border-b border-slate-800">
            <button
              onClick={onBackToHub}
              className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition mb-3"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Hub de Apps</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white leading-tight">Finanzas Diarias</h2>
                <span className="text-[10px] text-emerald-400 font-medium">Módulo Activo</span>
              </div>
            </div>
          </div>

          {/* Menú de Módulos */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'home'
                  ? 'bg-emerald-500/15 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Panel Principal (Home)</span>
            </button>

            <button
              onClick={() => setActiveTab('transactions')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'transactions'
                  ? 'bg-emerald-500/15 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Movimientos (Historial)</span>
            </button>

            <button
              onClick={() => setActiveTab('accounts')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'accounts'
                  ? 'bg-emerald-500/15 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Cuentas</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'categories'
                  ? 'bg-emerald-500/15 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <PieChart className="w-4 h-4" />
              <span>Categorías</span>
            </button>

            <button
              onClick={() => setActiveTab('budgets')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'budgets'
                  ? 'bg-emerald-500/15 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <PiggyBank className="w-4 h-4" />
              <span>Presupuestos</span>
            </button>

            <div className="pt-2 pb-1 px-3 text-[10px] uppercase font-bold tracking-wider text-slate-500">
              Reportes & Analíticas
            </div>

            <button
              onClick={() => setActiveTab('reports_date')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'reports_date'
                  ? 'bg-emerald-500/15 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Reporte por Fecha</span>
            </button>

            <button
              onClick={() => setActiveTab('reports_category')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'reports_category'
                  ? 'bg-emerald-500/15 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Reporte por Categoría</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'settings'
                  ? 'bg-emerald-500/15 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Configuración</span>
            </button>
          </nav>
        </div>

        {/* Footer del usuario */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
          <div className="truncate pr-2">
            <p className="text-xs font-bold text-white truncate">{user.email}</p>
            <p className="text-[10px] text-slate-400">Google Account</p>
          </div>
          <button
            onClick={() => signOut()}
            title="Cerrar sesión"
            className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* =================================================================== */}
        {/* 1. SECCIÓN HOME (PANEL PRINCIPAL)                                  */}
        {/* =================================================================== */}
        {activeTab === 'home' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            {/* Barra superior de controles del Home */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4">
              {/* Filtro rápido temporal (Día, Semana, Mes, Año, Todo) */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {(['dia', 'semana', 'mes', 'ano', 'todo'] as TimeFilter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setTimeFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                      timeFilter === f
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {f === 'ano' ? 'Año' : f === 'dia' ? 'Día' : f}
                  </button>
                ))}
              </div>

              {/* Botón de configuración del Home (Widgets Dinámicos) y Botón de Registro Rápido */}
              <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
                <button
                  onClick={() => setShowConfigWidgets(!showConfigWidgets)}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Configurar Widgets</span>
                </button>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Nuevo Movimiento</span>
                </button>
              </div>
            </div>

            {/* Panel desplegable para activar/desactivar widgets dinámicos */}
            {showConfigWidgets && (
              <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 animate-in fade-in">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
                  Personalizar Tarjetas del Home
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {Object.entries(activeWidgets).map(([key, val]) => (
                    <label
                      key={key}
                      className="flex items-center gap-2 cursor-pointer bg-slate-950 p-2.5 rounded-xl border border-slate-800"
                    >
                      <input
                        type="checkbox"
                        checked={val}
                        onChange={() =>
                          setActiveWidgets({
                            ...activeWidgets,
                            [key]: !val,
                          })
                        }
                        className="rounded text-emerald-500 focus:ring-0"
                      />
                      <span className="capitalize text-slate-300">
                        {key === 'dailyCashflow'
                          ? 'Flujo de Caja'
                          : key === 'monthlyBalance'
                          ? 'Balance General'
                          : key === 'recentTransactions'
                          ? 'Últimos Registros'
                          : key === 'budgetGauge'
                          ? 'Presupuestos'
                          : 'Tarjetas de Cuentas'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Selector de Cuentas (Filtrar por tarjetas, efectivo o ahorros, todas o selección múltiple) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Cuentas Activas ({selectedAccountIds.length === 0 ? 'Todas' : `${selectedAccountIds.length} seleccionadas`})
                </span>
                <button
                  onClick={selectAllAccounts}
                  className={`text-xs ${
                    selectedAccountIds.length === 0 ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Ver Todas
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {accounts.map((acc) => {
                  const isSelected = selectedAccountIds.includes(acc.id);
                  return (
                    <button
                      key={acc.id}
                      onClick={() => toggleAccountFilter(acc.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span>
                        {acc.type === 'tarjeta' ? '💳' : acc.type === 'efectivo' ? '💵' : '🏦'}
                      </span>
                      <span>{acc.name}</span>
                      {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Widgets Dinámicos: Tarjetas de Balance */}
            {activeWidgets.monthlyBalance && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Ingresos */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-medium text-slate-400">Total Ingresos</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <ArrowDownLeft className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-emerald-400 mt-2">
                    ${totalIncome.toFixed(2)}
                  </h3>
                  <span className="text-[10px] text-slate-500 mt-1 block">Filtrado por: {timeFilter}</span>
                </div>

                {/* Salidas */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-medium text-slate-400">Total Salidas (Gastos)</span>
                    <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-rose-400 mt-2">
                    ${totalExpense.toFixed(2)}
                  </h3>
                  <span className="text-[10px] text-slate-500 mt-1 block">Filtrado por: {timeFilter}</span>
                </div>

                {/* Flujo Neto */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-medium text-slate-400">Balance Neto</span>
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        netBalance >= 0
                          ? 'bg-blue-500/10 text-blue-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <h3
                    className={`text-2xl font-black mt-2 ${
                      netBalance >= 0 ? 'text-blue-400' : 'text-rose-400'
                    }`}
                  >
                    ${netBalance.toFixed(2)}
                  </h3>
                  <span className="text-[10px] text-slate-500 mt-1 block">Flujo de caja neto acumulado</span>
                </div>
              </div>
            )}

            {/* Widget: Medidor de Presupuestos y comparativa año anterior */}
            {activeWidgets.budgetGauge && (
              <BudgetGaugeCard
                year={new Date().getFullYear()}
                month={new Date().getMonth() + 1}
              />
            )}

            {/* Widget: Últimos Movimientos */}
            {activeWidgets.recentTransactions && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">Últimos Movimientos</h3>
                  <button
                    onClick={() => setActiveTab('transactions')}
                    className="text-xs text-emerald-400 hover:underline font-semibold"
                  >
                    Ver historial completo ➔
                  </button>
                </div>

                <div className="divide-y divide-slate-800">
                  {filteredTransactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                            tx.type === 'ingreso'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : tx.type === 'salida'
                              ? 'bg-rose-500/10 text-rose-400'
                              : 'bg-blue-500/10 text-blue-400'
                          }`}
                        >
                          {tx.type === 'ingreso' ? (
                            <ArrowDownLeft className="w-5 h-5" />
                          ) : tx.type === 'salida' ? (
                            <ArrowUpRight className="w-5 h-5" />
                          ) : (
                            <ArrowLeftRight className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {tx.description || (tx.type === 'transferencia' ? 'Transferencia' : tx.category?.name || 'Movimiento')}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {tx.date} • {tx.account?.name}{' '}
                            {tx.destination_account && `➔ ${tx.destination_account.name}`}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-sm font-black ${
                          tx.type === 'ingreso'
                            ? 'text-emerald-400'
                            : tx.type === 'salida'
                            ? 'text-rose-400'
                            : 'text-blue-400'
                        }`}
                      >
                        {tx.type === 'salida' ? '-' : tx.type === 'ingreso' ? '+' : ''}${Number(tx.amount).toFixed(2)}
                      </span>
                    </div>
                  ))}

                  {filteredTransactions.length === 0 && (
                    <div className="py-8 text-center text-slate-500 text-sm">
                      No hay transacciones registradas bajo los filtros actuales.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* 2. SECCIÓN MOVIMIENTOS (HISTORIAL CON FILTROS AVANZADOS)            */}
        {/* =================================================================== */}
        {activeTab === 'transactions' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Historial de Movimientos</h2>
                <p className="text-sm text-slate-400">Filtrado, ordenamiento y búsqueda de todas tus transacciones.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Nuevo Movimiento</span>
              </button>
            </div>

            {/* Filtros avanzados */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
              {/* Buscador */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Buscar descripción..."
                  value={txSearch}
                  onChange={(e) => setTxSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Filtro Tipo */}
              <select
                value={txTypeFilter}
                onChange={(e) => setTxTypeFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
              >
                <option value="todos">Todos los tipos</option>
                <option value="ingreso">Solo Ingresos</option>
                <option value="salida">Solo Salidas</option>
                <option value="transferencia">Solo Transferencias</option>
              </select>

              {/* Filtro Categoría */}
              <select
                value={txCategoryFilter}
                onChange={(e) => setTxCategoryFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
              >
                <option value="todas">Todas las categorías</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Filtro Cuenta */}
              <select
                value={txAccountFilter}
                onChange={(e) => setTxAccountFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
              >
                <option value="todas">Todas las cuentas</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tabla de Movimientos */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Fecha</th>
                    <th className="p-4">Tipo</th>
                    <th className="p-4">Descripción</th>
                    <th className="p-4">Cuenta</th>
                    <th className="p-4">Categoría</th>
                    <th className="p-4 text-right">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {transactions
                    .filter((tx) => {
                      if (txSearch && !tx.description?.toLowerCase().includes(txSearch.toLowerCase())) return false;
                      if (txTypeFilter !== 'todos' && tx.type !== txTypeFilter) return false;
                      if (txCategoryFilter !== 'todas' && tx.category_id !== txCategoryFilter) return false;
                      if (txAccountFilter !== 'todas' && tx.account_id !== txAccountFilter && tx.destination_account_id !== txAccountFilter) return false;
                      return true;
                    })
                    .map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-4 text-xs text-slate-400 whitespace-nowrap">{tx.date}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              tx.type === 'ingreso'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : tx.type === 'salida'
                                ? 'bg-rose-500/20 text-rose-300'
                                : 'bg-blue-500/20 text-blue-300'
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-white">{tx.description || '—'}</td>
                        <td className="p-4 text-xs text-slate-300">
                          {tx.account?.name}{' '}
                          {tx.destination_account && `➔ ${tx.destination_account.name}`}
                        </td>
                        <td className="p-4 text-xs text-slate-400">
                          {tx.category ? (
                            <span className="flex items-center gap-1.5">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: tx.category.color }}
                              />
                              {tx.category.name}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td
                          className={`p-4 text-right font-black text-sm ${
                            tx.type === 'ingreso'
                              ? 'text-emerald-400'
                              : tx.type === 'salida'
                              ? 'text-rose-400'
                              : 'text-blue-400'
                          }`}
                        >
                          {tx.type === 'salida' ? '-' : tx.type === 'ingreso' ? '+' : ''}${Number(tx.amount).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 3. SECCIÓN CUENTAS (CRUD)                                          */}
        {/* =================================================================== */}
        {activeTab === 'accounts' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Mis Cuentas</h2>
                <p className="text-sm text-slate-400">Administra tus tarjetas, efectivo y cuentas bancarias.</p>
              </div>
              <button
                onClick={() => setAccountFormOpen(!accountFormOpen)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{accountFormOpen ? 'Cerrar Formulario' : 'Agregar Cuenta'}</span>
              </button>
            </div>

            {/* Formulario desplegable */}
            {accountFormOpen && (
              <form onSubmit={handleCreateAccount} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white">Nueva Cuenta Financiera</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Nombre</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Tarjeta Débito BBVA"
                      value={newAccountName}
                      onChange={(e) => setNewAccountName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Tipo</label>
                    <select
                      value={newAccountType}
                      onChange={(e) => setNewAccountType(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    >
                      <option value="efectivo">Efectivo</option>
                      <option value="tarjeta">Tarjeta</option>
                      <option value="ahorro">Ahorro</option>
                      <option value="inversion">Inversión</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Saldo Inicial</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newAccountInitial}
                      onChange={(e) => setNewAccountInitial(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                </div>
                <button type="submit" className="px-5 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl">
                  Guardar Cuenta
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {accounts.map((acc) => (
                <div key={acc.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-2xl mb-2 block">
                        {acc.type === 'tarjeta' ? '💳' : acc.type === 'efectivo' ? '💵' : '🏦'}
                      </span>
                      <h4 className="text-base font-bold text-white">{acc.name}</h4>
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{acc.type}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Saldo Inicial:</span>
                    <span className="font-bold text-white">${Number(acc.initial_balance).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 4. SECCIÓN CATEGORÍAS (CRUD)                                       */}
        {/* =================================================================== */}
        {activeTab === 'categories' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Categorías</h2>
                <p className="text-sm text-slate-400">Personaliza tus categorías para clasificar ingresos y gastos.</p>
              </div>
              <button
                onClick={() => setCategoryFormOpen(!categoryFormOpen)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{categoryFormOpen ? 'Cerrar' : 'Nueva Categoría'}</span>
              </button>
            </div>

            {categoryFormOpen && (
              <form onSubmit={handleCreateCategory} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white">Crear Categoría</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Nombre</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Suscripciones, Gimnasio..."
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Tipo</label>
                    <select
                      value={newCatType}
                      onChange={(e) => setNewCatType(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    >
                      <option value="salida">Salida (Gasto)</option>
                      <option value="ingreso">Ingreso</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Color</label>
                    <input
                      type="color"
                      value={newCatColor}
                      onChange={(e) => setNewCatColor(e.target.value)}
                      className="w-full h-9 bg-slate-950 border border-slate-800 rounded-xl p-1 cursor-pointer"
                    />
                  </div>
                </div>
                <button type="submit" className="px-5 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl">
                  Guardar Categoría
                </button>
              </form>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {categories.map((c) => (
                <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                  <div>
                    <p className="text-sm font-bold text-white">{c.name}</p>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 capitalize">{c.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 5. SECCIÓN PRESUPUESTOS (GAUGE & YoY COMPARISON)                   */}
        {/* =================================================================== */}
        {activeTab === 'budgets' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold text-white">Presupuestos Mensuales</h2>
              <p className="text-sm text-slate-400">
                Tope de gasto estimado por categoría, comparativa con el año anterior y medidores de ahorro.
              </p>
            </div>
            <BudgetGaugeCard year={new Date().getFullYear()} month={new Date().getMonth() + 1} />
          </div>
        )}

        {/* =================================================================== */}
        {/* 6. REPORTES POR FECHA & POR CATEGORÍA                               */}
        {/* =================================================================== */}
        {(activeTab === 'reports_date' || activeTab === 'reports_category') && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {activeTab === 'reports_date' ? 'Reporte Analítico por Fecha' : 'Reporte Analítico por Categoría'}
              </h2>
              <p className="text-sm text-slate-400">
                Distribución porcentual de egresos e ingresos bajo condiciones temporales avanzadas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Desglose por categorías */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <h3 className="text-base font-bold text-white mb-4">Distribución de Salidas</h3>
                <div className="space-y-3">
                  {categories
                    .filter((c) => c.type === 'salida')
                    .map((cat) => {
                      const totalCat = transactions
                        .filter((tx) => tx.type === 'salida' && tx.category_id === cat.id)
                        .reduce((sum, tx) => sum + Number(tx.amount), 0);
                      const pct = totalExpense > 0 ? ((totalCat / totalExpense) * 100).toFixed(1) : '0';

                      return (
                        <div key={cat.id} className="text-xs space-y-1">
                          <div className="flex justify-between text-slate-300">
                            <span className="flex items-center gap-1.5 font-semibold">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                              {cat.name}
                            </span>
                            <span className="font-bold text-white">
                              ${totalCat.toFixed(2)} ({pct}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${pct}%`, backgroundColor: cat.color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Resumen de Flujo de Caja */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white mb-2">Diagnóstico Financiero</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Tu tasa de ahorro actual es de{' '}
                    <strong className="text-emerald-400">
                      {totalIncome > 0 ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1) : 0}%
                    </strong>
                    . Mantener los gastos por debajo del 80% te permite cumplir tus objetivos del año sin recurrir a endeudamiento.
                  </p>
                </div>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 mt-6 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Ingresos Registrados:</span>
                    <span className="font-bold text-emerald-400">${totalIncome.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Salidas Registradas:</span>
                    <span className="font-bold text-rose-400">${totalExpense.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-white pt-2 border-t border-slate-800 font-bold">
                    <span>Superávit / Déficit:</span>
                    <span className={netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      ${netBalance.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 7. SECCIÓN CONFIGURACIÓN                                           */}
        {/* =================================================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold text-white">Configuración de la Aplicación</h2>
              <p className="text-sm text-slate-400">Preferencias de visualización, moneda y políticas de privacidad.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Formato de Moneda</label>
                <select className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white w-full sm:w-64">
                  <option value="USD">USD ($) - Dólar Estadounidense</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="COP">COP ($) - Peso Colombiano</option>
                  <option value="MXN">MXN ($) - Peso Mexicano</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <h4 className="text-sm font-bold text-white mb-1">Aislamiento de Datos & Privacidad</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tu cuenta está protegida con Row Level Security (RLS) en PostgreSQL. Ni siquiera otros usuarios
                  registrados pueden consultar tus transacciones, presupuestos o balances.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <h4 className="text-sm font-bold text-white mb-1">Términos y Condiciones</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Esta plataforma fue diseñada como suite modular personal para uso privado y empresarial bajo demanda.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal de Registro Rápido */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        accounts={accounts}
        categories={categories}
        onSuccess={() => loadAllData()}
      />
    </div>
  );
};
