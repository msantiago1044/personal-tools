import React, { useState, useEffect, useMemo } from 'react';
import { supabase, signOut } from '../../lib/supabase';
import { Account, Category, Transaction } from '../../../../packages/shared/src/types';
import { TransactionModal } from '../../components/finance/TransactionModal';
import { BudgetGaugeCard } from '../../components/finance/BudgetGaugeCard';
import { DownloadApkModal } from '../../components/DownloadApkModal';
import { ThemeMode, getStoredTheme, applyTheme } from '../../lib/theme';
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
  Check,
  TrendingUp,
  TrendingDown,
  CreditCard,
  PiggyBank,
  PanelLeftClose,
  PanelLeft,
  Sun,
  Moon,
  Laptop,
  Eye,
  EyeOff,
  Smartphone
} from 'lucide-react';

interface FinanceModuleProps {
  onBackToHub: () => void;
  user: any;
}

type TabType = 'home' | 'transactions' | 'accounts' | 'categories' | 'budgets' | 'reports_date' | 'reports_category' | 'settings';
type TimeFilter = 'dia' | 'semana' | 'mes' | 'ano' | 'todo';

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'Dólar Estadounidense ($)' },
  { code: 'EUR', symbol: '€', name: 'Euro (€)' },
  { code: 'COP', symbol: '$', name: 'Peso Colombiano ($)' },
  { code: 'MXN', symbol: '$', name: 'Peso Mexicano ($)' },
  { code: 'ARS', symbol: '$', name: 'Peso Argentino ($)' },
  { code: 'CLP', symbol: '$', name: 'Peso Chileno ($)' },
  { code: 'PEN', symbol: 'S/', name: 'Sol Peruano (S/)' },
  { code: 'GBP', symbol: '£', name: 'Libra Esterlina (£)' },
];

export const FinanceModule: React.FC<FinanceModuleProps> = ({ onBackToHub, user }) => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('mes');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Menú colapsable / expandible
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);

  // Selector de tema
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme());

  // Configuraciones de usuario completas y persistidas
  const [currencyCode, setCurrencyCode] = useState<string>(
    localStorage.getItem('currency_code') || 'USD'
  );
  const [currencySymbol, setCurrencySymbol] = useState<string>(
    localStorage.getItem('currency_symbol') || '$'
  );
  const [decimals, setDecimals] = useState<number>(
    Number(localStorage.getItem('currency_decimals')) || 2
  );
  const [hideBalances, setHideBalances] = useState<boolean>(
    localStorage.getItem('hide_balances') === 'true'
  );
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // Formateador de moneda dinámico
  const formatMoney = (amount: number | string) => {
    if (hideBalances) return '••••••';
    const num = Number(amount) || 0;
    const formattedNum = num.toLocaleString('es-ES', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return `${currencySymbol} ${formattedNum}`;
  };

  // Guardar configuración en Supabase y localStorage
  const handleSaveSettings = async (code: string, symbol: string, decs: number) => {
    setCurrencyCode(code);
    setCurrencySymbol(symbol);
    setDecimals(decs);

    localStorage.setItem('currency_code', code);
    localStorage.setItem('currency_symbol', symbol);
    localStorage.setItem('currency_decimals', String(decs));

    try {
      await supabase
        .from('profiles')
        .update({
          currency_code: code,
          currency_symbol: symbol,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    } catch (err) {
      console.error('Error al guardar configuración en Supabase:', err);
    }
  };

  const toggleHideBalances = () => {
    const next = !hideBalances;
    setHideBalances(next);
    localStorage.setItem('hide_balances', String(next));
  };

  // Modal de registro rápido
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Widgets configurables del Home con persistencia
  const DEFAULT_ACTIVE_WIDGETS = {
    dailyCashflow: true,
    monthlyBalance: true,
    recentTransactions: true,
    budgetGauge: true,
    accountCards: true,
  };

  type ActiveWidgetsState = typeof DEFAULT_ACTIVE_WIDGETS;

  const [showConfigWidgets, setShowConfigWidgets] = useState<boolean>(false);
  const [activeWidgets, setActiveWidgets] = useState<ActiveWidgetsState>(() => {
    try {
      const saved = localStorage.getItem('finance_active_widgets');
      if (saved) {
        return { ...DEFAULT_ACTIVE_WIDGETS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Error al recuperar finance_active_widgets de localStorage:', e);
    }
    return DEFAULT_ACTIVE_WIDGETS;
  });

  const handleToggleWidget = async (key: keyof ActiveWidgetsState) => {
    const updated = {
      ...activeWidgets,
      [key]: !activeWidgets[key],
    };
    setActiveWidgets(updated);

    try {
      localStorage.setItem('finance_active_widgets', JSON.stringify(updated));

      // Sincronizar en Supabase profiles.home_widgets
      if (user?.id) {
        const widgetKeyMap: Record<string, string> = {
          dailyCashflow: 'daily_cashflow',
          monthlyBalance: 'monthly_balance',
          recentTransactions: 'recent_transactions',
          budgetGauge: 'budget_gauge',
          accountCards: 'account_cards',
        };

        const activeList = Object.entries(updated)
          .filter(([_, active]) => active)
          .map(([k]) => widgetKeyMap[k] || k);

        await supabase
          .from('profiles')
          .update({
            home_widgets: activeList,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
      }
    } catch (err) {
      console.error('Error al guardar configuración de widgets:', err);
    }
  };

  // Filtros avanzados
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

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Perfil y preferencias
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (profile) {
        if (profile.currency_code) {
          setCurrencyCode(profile.currency_code);
          localStorage.setItem('currency_code', profile.currency_code);
        }
        if (profile.currency_symbol) {
          setCurrencySymbol(profile.currency_symbol);
          localStorage.setItem('currency_symbol', profile.currency_symbol);
        }
        if (profile.home_widgets && !localStorage.getItem('finance_active_widgets')) {
          if (Array.isArray(profile.home_widgets)) {
            const list = profile.home_widgets as string[];
            const loadedWidgets: ActiveWidgetsState = {
              dailyCashflow: list.includes('daily_cashflow') || list.includes('dailyCashflow'),
              monthlyBalance: list.includes('monthly_balance') || list.includes('monthlyBalance'),
              recentTransactions: list.includes('recent_transactions') || list.includes('recentTransactions'),
              budgetGauge: list.includes('budget_gauge') || list.includes('budgetGauge'),
              accountCards: list.includes('account_cards') || list.includes('accountCards'),
            };
            setActiveWidgets(loadedWidgets);
            localStorage.setItem('finance_active_widgets', JSON.stringify(loadedWidgets));
          }
        }
      }

      const { data: accData } = await supabase.from('accounts').select('*').order('created_at');
      if (accData) setAccounts(accData);

      const { data: catData } = await supabase.from('categories').select('*').order('name');
      if (catData) setCategories(catData);

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

  // Cálculo de saldos acumulados por cuenta en tiempo real (restando de origen y sumando a destino)
  const accountsWithBalances = useMemo(() => {
    return accounts.map((acc) => {
      let currentBalance = Number(acc.initial_balance) || 0;
      let totalIngresos = 0;
      let totalSalidas = 0;
      let totalTransferenciasEntrantes = 0;
      let totalTransferenciasSalientes = 0;

      for (const tx of transactions) {
        const amt = Number(tx.amount) || 0;
        if (tx.type === 'ingreso' && tx.account_id === acc.id) {
          currentBalance += amt;
          totalIngresos += amt;
        } else if (tx.type === 'salida' && tx.account_id === acc.id) {
          currentBalance -= amt;
          totalSalidas += amt;
        } else if (tx.type === 'transferencia') {
          if (tx.account_id === acc.id) {
            currentBalance -= amt; // Resta de la cuenta origen
            totalTransferenciasSalientes += amt;
          }
          if (tx.destination_account_id === acc.id) {
            currentBalance += amt; // Suma a la cuenta destino
            totalTransferenciasEntrantes += amt;
          }
        }
      }

      return {
        ...acc,
        current_balance: currentBalance,
        total_ingresos: totalIngresos,
        total_salidas: totalSalidas,
        total_transferencias_entrantes: totalTransferenciasEntrantes,
        total_transferencias_salientes: totalTransferenciasSalientes,
      };
    });
  }, [accounts, transactions]);

  // Saldo total de todas las cuentas o de las cuentas seleccionadas
  const totalPortfolioBalance = useMemo(() => {
    const list = selectedAccountIds.length > 0
      ? accountsWithBalances.filter((a) => selectedAccountIds.includes(a.id))
      : accountsWithBalances;
    return list.reduce((sum, a) => sum + (a.current_balance || 0), 0);
  }, [accountsWithBalances, selectedAccountIds]);

  const filteredTransactions = transactions.filter((tx) => {
    if (selectedAccountIds.length > 0) {
      const matchSource = selectedAccountIds.includes(tx.account_id);
      const matchDest = tx.destination_account_id ? selectedAccountIds.includes(tx.destination_account_id) : false;
      if (!matchSource && !matchDest) return false;
    }

    if (timeFilter !== 'todo') {
      const [y, m, d] = tx.date.split('-').map(Number);
      const txDate = new Date(y, m - 1, d);
      const now = new Date();
      const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (timeFilter === 'dia') {
        if (
          txDate.getFullYear() !== todayDate.getFullYear() ||
          txDate.getMonth() !== todayDate.getMonth() ||
          txDate.getDate() !== todayDate.getDate()
        ) {
          return false;
        }
      } else if (timeFilter === 'semana') {
        const weekAgo = new Date(todayDate);
        weekAgo.setDate(todayDate.getDate() - 7);
        if (txDate < weekAgo || txDate > todayDate) return false;
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

  const { totalIncome, totalExpense, totalTransfersIn, totalTransfersOut } = useMemo(() => {
    let income = 0;
    let expense = 0;
    let transfersIn = 0;
    let transfersOut = 0;

    for (const tx of filteredTransactions) {
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'ingreso') {
        income += amt;
      } else if (tx.type === 'salida') {
        expense += amt;
      } else if (tx.type === 'transferencia') {
        if (selectedAccountIds.length === 0) {
          // Balance General (todas las cuentas): refleja el ingreso en la cuenta destino (+) y la salida en la cuenta origen (-)
          income += amt;
          transfersIn += amt;
          expense += amt;
          transfersOut += amt;
        } else {
          const isSourceSelected = selectedAccountIds.includes(tx.account_id);
          const isDestSelected = tx.destination_account_id ? selectedAccountIds.includes(tx.destination_account_id) : false;

          if (isDestSelected && !isSourceSelected) {
            // Transferencia recibida en la cuenta seleccionada (+)
            income += amt;
            transfersIn += amt;
          } else if (isSourceSelected && !isDestSelected) {
            // Transferencia enviada desde la cuenta seleccionada (-)
            expense += amt;
            transfersOut += amt;
          } else if (isSourceSelected && isDestSelected) {
            // Ambas cuentas seleccionadas
            income += amt;
            transfersIn += amt;
            expense += amt;
            transfersOut += amt;
          }
        }
      }
    }

    return {
      totalIncome: income,
      totalExpense: expense,
      totalTransfersIn: transfersIn,
      totalTransfersOut: transfersOut,
    };
  }, [filteredTransactions, selectedAccountIds]);

  const netBalance = totalIncome - totalExpense;

  // Cálculo de datos para el widget de Flujo de Caja (entradas, salidas y saldo neto diario)
  const cashflowData = useMemo(() => {
    const now = new Date();
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    const dateSet = new Set<string>();
    filteredTransactions.forEach((tx) => {
      if (tx.date) dateSet.add(tx.date);
    });

    // Asegurar al menos los últimos 7 días hasta hoy para una visualización consistente
    for (let i = 0; i < 7; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      dateSet.add(ds);
    }

    const sortedDates = Array.from(dateSet).sort().slice(-7);

    const days = sortedDates.map((dateStr) => {
      const [y, m, d] = dateStr.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      const isToday =
        dateObj.getFullYear() === now.getFullYear() &&
        dateObj.getMonth() === now.getMonth() &&
        dateObj.getDate() === now.getDate();

      const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      const isYesterday =
        dateObj.getFullYear() === yesterday.getFullYear() &&
        dateObj.getMonth() === yesterday.getMonth() &&
        dateObj.getDate() === yesterday.getDate();

      const label = isToday ? 'Hoy' : isYesterday ? 'Ayer' : `${dayNames[dateObj.getDay()]} ${dateObj.getDate()}`;

      return {
        dateStr,
        label,
        income: 0,
        expense: 0,
        net: 0,
      };
    });

    for (const tx of filteredTransactions) {
      const dayItem = days.find((d) => d.dateStr === tx.date);
      if (!dayItem) continue;

      const amt = Number(tx.amount) || 0;
      if (tx.type === 'ingreso') {
        dayItem.income += amt;
      } else if (tx.type === 'salida') {
        dayItem.expense += amt;
      } else if (tx.type === 'transferencia') {
        if (selectedAccountIds.length === 0) {
          dayItem.income += amt;
          dayItem.expense += amt;
        } else {
          const isSourceSelected = selectedAccountIds.includes(tx.account_id);
          const isDestSelected = tx.destination_account_id ? selectedAccountIds.includes(tx.destination_account_id) : false;
          if (isDestSelected && !isSourceSelected) {
            dayItem.income += amt;
          } else if (isSourceSelected && !isDestSelected) {
            dayItem.expense += amt;
          } else if (isSourceSelected && isDestSelected) {
            dayItem.income += amt;
            dayItem.expense += amt;
          }
        }
      }
    }

    days.forEach((d) => {
      d.net = d.income - d.expense;
    });

    const maxVal = Math.max(...days.map((d) => Math.max(d.income, d.expense)), 1);
    const totalPeriodNet = days.reduce((sum, d) => sum + d.net, 0);
    const totalPeriodIncome = days.reduce((sum, d) => sum + d.income, 0);
    const totalPeriodExpense = days.reduce((sum, d) => sum + d.expense, 0);
    const avgDailyNet = days.length > 0 ? totalPeriodNet / days.length : 0;

    return {
      days,
      maxVal,
      totalPeriodNet,
      totalPeriodIncome,
      totalPeriodExpense,
      avgDailyNet,
    };
  }, [filteredTransactions, selectedAccountIds]);

  const toggleAccountFilter = (accId: string) => {
    if (selectedAccountIds.includes(accId)) {
      setSelectedAccountIds(selectedAccountIds.filter((id) => id !== accId));
    } else {
      setSelectedAccountIds([...selectedAccountIds, accId]);
    }
  };

  const selectAllAccounts = () => setSelectedAccountIds([]);

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-200">
      {/* Sidebar Colapsable */}
      <aside
        className={`bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between shrink-0 transition-all duration-300 ${
          sidebarCollapsed ? 'md:w-20' : 'md:w-64'
        } ${mobileMenuOpen ? 'block fixed inset-y-0 left-0 z-50 w-64 shadow-2xl' : 'hidden md:flex'}`}
      >
        <div>
          {/* Header del Sidebar */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                  <Wallet className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight truncate">
                    Finanzas
                  </h2>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    {currencyCode} ({currencySymbol})
                  </span>
                </div>
              </div>
            )}

            {sidebarCollapsed && (
              <div className="mx-auto w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
                <Wallet className="w-5 h-5" />
              </div>
            )}

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? 'Expandir menú' : 'Ocultar menú'}
              className="hidden md:flex p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            >
              {sidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          </div>

          {/* Botón Volver al HUB */}
          <div className="p-3">
            <button
              onClick={onBackToHub}
              title="Volver al Hub de Aplicaciones"
              className={`w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition ${
                sidebarCollapsed ? 'justify-center' : ''
              }`}
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Volver al Hub</span>}
            </button>
          </div>

          {/* Navegación */}
          <nav className="px-3 space-y-1">
            {[
              { id: 'home', label: 'Panel Principal', icon: Layers },
              { id: 'transactions', label: 'Movimientos', icon: ArrowLeftRight },
              { id: 'accounts', label: 'Cuentas', icon: CreditCard },
              { id: 'categories', label: 'Categorías', icon: PieChart },
              { id: 'budgets', label: 'Presupuestos', icon: PiggyBank },
              { id: 'reports_date', label: 'Por Fecha', icon: Calendar },
              { id: 'reports_category', label: 'Por Categoría', icon: Filter },
              { id: 'settings', label: 'Configuración', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as TabType);
                    setMobileMenuOpen(false);
                  }}
                  title={item.label}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    sidebarCollapsed ? 'justify-center' : ''
                  } ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Botón Descargar APK Android en Sidebar */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setShowDownloadModal(true)}
            title="Descargar App Android (.APK)"
            className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 transition shadow-sm ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <Smartphone className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Descargar App (.APK)</span>}
          </button>
        </div>

        {/* Footer del usuario */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="truncate pr-2">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.email}</p>
              <p className="text-[10px] text-slate-500">Google Account</p>
            </div>
          )}
          <button
            onClick={() => signOut()}
            title="Cerrar sesión"
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/10 text-slate-600 dark:text-slate-400 hover:text-rose-500 transition mx-auto"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Backdrop en móvil */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Contenido Principal */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Top Header con controles rápidos */}
        <div className="max-w-6xl mx-auto flex items-center justify-between pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
            >
              ☰
            </button>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white capitalize">
              {activeTab === 'home'
                ? 'Panel Principal'
                : activeTab === 'transactions'
                ? 'Historial de Movimientos'
                : activeTab === 'accounts'
                ? 'Cuentas'
                : activeTab === 'categories'
                ? 'Categorías'
                : activeTab === 'budgets'
                ? 'Presupuestos'
                : activeTab === 'reports_date'
                ? 'Reporte por Fecha'
                : activeTab === 'reports_category'
                ? 'Reporte por Categoría'
                : 'Configuración del Sistema'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Botón Descargar App Android */}
            <button
              onClick={() => setShowDownloadModal(true)}
              title="Descargar App Nativa Android (.APK)"
              className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 shadow-sm transition text-xs font-semibold"
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">App APK</span>
            </button>

            {/* Botón Ocultar/Mostrar Saldos (Modo Discreto) */}
            <button
              onClick={toggleHideBalances}
              title={hideBalances ? 'Mostrar saldos' : 'Ocultar saldos'}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 shadow-sm transition"
            >
              {hideBalances ? <EyeOff className="w-4 h-4 text-amber-500" /> : <Eye className="w-4 h-4" />}
            </button>

            {/* Selector de Tema Rápido */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <button
                onClick={() => handleThemeChange('light')}
                title="Tema Claro"
                className={`p-1.5 rounded-lg text-xs transition ${
                  theme === 'light'
                    ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                title="Tema Oscuro"
                className={`p-1.5 rounded-lg text-xs transition ${
                  theme === 'dark'
                    ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Moon className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleThemeChange('system')}
                title="Tema del Sistema"
                className={`p-1.5 rounded-lg text-xs transition ${
                  theme === 'system'
                    ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Laptop className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 1. SECCIÓN HOME */}
        {activeTab === 'home' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            {/* Controles del Home */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                {(['dia', 'semana', 'mes', 'ano', 'todo'] as TimeFilter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setTimeFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                      timeFilter === f
                        ? 'bg-emerald-500 text-white dark:text-slate-950 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {f === 'ano' ? 'Año' : f === 'dia' ? 'Día' : f}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
                <button
                  onClick={() => setShowConfigWidgets(!showConfigWidgets)}
                  className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 transition"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Configurar Widgets</span>
                </button>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white dark:text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-md transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Nuevo Movimiento</span>
                </button>
              </div>
            </div>

            {/* Panel de Widgets Dinámicos */}
            {showConfigWidgets && (
              <div className="bg-white dark:bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 shadow-sm animate-in fade-in">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Personalizar Tarjetas del Home
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium">
                    (Se guarda automáticamente en tu cuenta)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
                  {Object.entries(activeWidgets).map(([key, val]) => (
                    <label
                      key={key}
                      className="flex items-center gap-2 cursor-pointer bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition"
                    >
                      <input
                        type="checkbox"
                        checked={val}
                        onChange={() => handleToggleWidget(key as keyof ActiveWidgetsState)}
                        className="rounded text-emerald-500 focus:ring-0 cursor-pointer"
                      />
                      <span className="capitalize text-slate-700 dark:text-slate-300 font-medium select-none">
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

            {/* Selector de Cuentas / Tarjetas de Cuentas */}
            {activeWidgets.accountCards && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm animate-in fade-in">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Cuentas ({selectedAccountIds.length === 0 ? 'Todas' : `${selectedAccountIds.length} seleccionadas`})
                    </span>
                    <span className="text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-lg flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-500">Saldo Total:</span>
                      <strong className="font-bold">{formatMoney(totalPortfolioBalance)}</strong>
                    </span>
                  </div>
                  <button
                    onClick={selectAllAccounts}
                    className={`text-xs ${
                      selectedAccountIds.length === 0
                        ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Ver Todas
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {accountsWithBalances.map((acc) => {
                    const isSelected = selectedAccountIds.includes(acc.id);
                    const bal = acc.current_balance ?? acc.initial_balance;
                    return (
                      <button
                        key={acc.id}
                        onClick={() => toggleAccountFilter(acc.id)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-sm">
                          {acc.type === 'tarjeta' ? '💳' : acc.type === 'efectivo' ? '💵' : '🏦'}
                        </span>
                        <div className="flex flex-col text-left">
                          <span className="leading-tight">{acc.name}</span>
                          <span
                            className={`text-[10px] leading-tight font-bold ${
                              bal < 0 ? 'text-rose-500 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {formatMoney(bal)}
                          </span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 ml-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Widget de Flujo de Caja */}
            {activeWidgets.dailyCashflow && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm animate-in fade-in transition-all">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-5">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Flujo de Caja
                      </h3>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                          cashflowData.totalPeriodNet >= 0
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'
                            : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60'
                        }`}
                      >
                        {cashflowData.totalPeriodNet >= 0 ? (
                          <TrendingUp className="w-3.5 h-3.5" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5" />
                        )}
                        {cashflowData.totalPeriodNet >= 0 ? 'Superávit / Flujo Positivo' : 'Déficit / Flujo Negativo'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Dinámica de entradas y salidas recientes ({timeFilter === 'ano' ? 'Año' : timeFilter === 'dia' ? 'Día' : timeFilter})
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                      <span>Entradas</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                      <span>Salidas</span>
                    </div>
                  </div>
                </div>

                {/* Métricas clave de flujo */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Entradas Registradas</span>
                    <span className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400">
                      +{formatMoney(cashflowData.totalPeriodIncome)}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Salidas Registradas</span>
                    <span className="text-sm sm:text-base font-black text-rose-600 dark:text-rose-400">
                      -{formatMoney(cashflowData.totalPeriodExpense)}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Flujo Neto Total</span>
                    <span
                      className={`text-sm sm:text-base font-black ${
                        cashflowData.totalPeriodNet >= 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {cashflowData.totalPeriodNet >= 0 ? '+' : ''}
                      {formatMoney(cashflowData.totalPeriodNet)}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Promedio Diario</span>
                    <span
                      className={`text-sm sm:text-base font-black ${
                        cashflowData.avgDailyNet >= 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {cashflowData.avgDailyNet >= 0 ? '+' : ''}
                      {formatMoney(cashflowData.avgDailyNet)}
                    </span>
                  </div>
                </div>

                {/* Gráfico comparativo de barras de flujo diario */}
                <div>
                  <div className="h-44 flex items-end justify-between gap-1.5 sm:gap-3 pt-6 pb-2 border-b border-slate-100 dark:border-slate-800">
                    {cashflowData.days.map((d) => {
                      const incHeight = Math.round((d.income / cashflowData.maxVal) * 100);
                      const expHeight = Math.round((d.expense / cashflowData.maxVal) * 100);
                      return (
                        <div key={d.dateStr} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                          {/* Tooltip flotante con detalle de valores al hover */}
                          <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[10px] font-semibold py-1 px-2.5 rounded-lg pointer-events-none z-20 whitespace-nowrap shadow-lg">
                            <div className="text-emerald-400 dark:text-emerald-600 font-bold">+ {formatMoney(d.income)}</div>
                            <div className="text-rose-400 dark:text-rose-600 font-bold">- {formatMoney(d.expense)}</div>
                            <div className="font-extrabold border-t border-slate-700 dark:border-slate-200 mt-0.5 pt-0.5">
                              Neto: {d.net >= 0 ? '+' : ''}{formatMoney(d.net)}
                            </div>
                          </div>

                          {/* Barras de Entradas y Salidas */}
                          <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-full">
                            <div
                              className="w-2.5 sm:w-4 bg-emerald-500 rounded-t-md transition-all duration-300 hover:brightness-110"
                              style={{ height: `${Math.max(incHeight > 0 ? incHeight : 4, 4)}%` }}
                              title={`Entradas: ${formatMoney(d.income)}`}
                            />
                            <div
                              className="w-2.5 sm:w-4 bg-rose-500 rounded-t-md transition-all duration-300 hover:brightness-110"
                              style={{ height: `${Math.max(expHeight > 0 ? expHeight : 4, 4)}%` }}
                              title={`Salidas: ${formatMoney(d.expense)}`}
                            />
                          </div>

                          {/* Etiqueta de la fecha */}
                          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-2 truncate w-full text-center">
                            {d.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Balance General con Moneda Dinámica */}
            {activeWidgets.monthlyBalance && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Ingresos</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <ArrowDownLeft className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
                    {formatMoney(totalIncome)}
                  </h3>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Filtrado por: {timeFilter}
                    {totalTransfersIn > 0 && ` • Inc. +${formatMoney(totalTransfersIn)} transf.`}
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Salidas (Gastos)</span>
                    <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2">
                    {formatMoney(totalExpense)}
                  </h3>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Filtrado por: {timeFilter}
                    {totalTransfersOut > 0 && ` • Inc. -${formatMoney(totalTransfersOut)} transf.`}
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Balance Neto</span>
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        netBalance >= 0
                          ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <h3
                    className={`text-2xl font-black mt-2 ${
                      netBalance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {formatMoney(netBalance)}
                  </h3>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Moneda activa: {currencyCode} ({currencySymbol})
                  </span>
                </div>
              </div>
            )}

            {/* Medidor de Presupuesto */}
            {activeWidgets.budgetGauge && (
              <BudgetGaugeCard
                year={new Date().getFullYear()}
                month={new Date().getMonth() + 1}
              />
            )}

            {/* Últimos Movimientos */}
            {activeWidgets.recentTransactions && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Últimos Movimientos</h3>
                  <button
                    onClick={() => setActiveTab('transactions')}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                  >
                    Ver historial completo ➔
                  </button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredTransactions.slice(0, 5).map((tx) => {
                    const isTransfer = tx.type === 'transferencia';
                    const isSourceSelected =
                      selectedAccountIds.length > 0 && selectedAccountIds.includes(tx.account_id);
                    const isDestSelected =
                      selectedAccountIds.length > 0 && tx.destination_account_id
                        ? selectedAccountIds.includes(tx.destination_account_id)
                        : false;

                    let amountPrefix = '';
                    let amountColor = 'text-blue-600 dark:text-blue-400';
                    let iconBg = 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400';
                    let IconComponent = ArrowLeftRight;

                    if (tx.type === 'ingreso') {
                      amountPrefix = '+';
                      amountColor = 'text-emerald-600 dark:text-emerald-400';
                      iconBg = 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
                      IconComponent = ArrowDownLeft;
                    } else if (tx.type === 'salida') {
                      amountPrefix = '-';
                      amountColor = 'text-rose-600 dark:text-rose-400';
                      iconBg = 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400';
                      IconComponent = ArrowUpRight;
                    } else if (isTransfer) {
                      if (isSourceSelected && !isDestSelected) {
                        amountPrefix = '-';
                        amountColor = 'text-rose-600 dark:text-rose-400';
                        iconBg = 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400';
                        IconComponent = ArrowUpRight;
                      } else if (isDestSelected && !isSourceSelected) {
                        amountPrefix = '+';
                        amountColor = 'text-emerald-600 dark:text-emerald-400';
                        iconBg = 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
                        IconComponent = ArrowDownLeft;
                      }
                    }

                    return (
                      <div key={tx.id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${iconBg}`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                              {tx.description ||
                                (tx.type === 'transferencia' ? 'Transferencia' : tx.category?.name || 'Movimiento')}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {tx.date} •{' '}
                              {isTransfer && selectedAccountIds.length === 0 ? (
                                <>
                                  <span className="text-rose-500 dark:text-rose-400 font-semibold">{tx.account?.name} (-)</span>
                                  {' ➔ '}
                                  <span className="text-emerald-500 dark:text-emerald-400 font-semibold">{tx.destination_account?.name} (+)</span>
                                </>
                              ) : (
                                <>
                                  {tx.account?.name}{' '}
                                  {tx.destination_account && (
                                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                                      ➔ {tx.destination_account.name}
                                    </span>
                                  )}
                                </>
                              )}
                            </p>
                          </div>
                        </div>

                        {isTransfer && selectedAccountIds.length === 0 ? (
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1.5 text-xs font-black">
                              <span className="text-rose-600 dark:text-rose-400">-{formatMoney(tx.amount)}</span>
                              <span className="text-slate-300 dark:text-slate-600 font-normal">/</span>
                              <span className="text-emerald-600 dark:text-emerald-400">+{formatMoney(tx.amount)}</span>
                            </div>
                            <span className="text-[10px] text-slate-400">Transferencia</span>
                          </div>
                        ) : (
                          <span className={`text-sm font-black ${amountColor}`}>
                            {amountPrefix}{formatMoney(tx.amount)}
                          </span>
                        )}
                      </div>
                    );
                  })}

                  {filteredTransactions.length === 0 && (
                    <div className="py-8 text-center text-slate-400 text-sm">
                      No hay transacciones registradas bajo los filtros actuales.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. HISTORIAL DE MOVIMIENTOS */}
        {activeTab === 'transactions' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Historial de Movimientos</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {transactions.length} movimientos registrados en {currencyCode} ({currencySymbol}).
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-emerald-500 hover:bg-emerald-400 text-white dark:text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Nuevo Movimiento</span>
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-4 gap-3 shadow-sm">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar descripción..."
                  value={txSearch}
                  onChange={(e) => setTxSearch(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <select
                value={txTypeFilter}
                onChange={(e) => setTxTypeFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="todos">Todos los tipos</option>
                <option value="ingreso">Solo Ingresos</option>
                <option value="salida">Solo Salidas</option>
                <option value="transferencia">Solo Transferencias</option>
              </select>

              <select
                value={txCategoryFilter}
                onChange={(e) => setTxCategoryFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="todas">Todas las categorías</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={txAccountFilter}
                onChange={(e) => setTxAccountFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="todas">Todas las cuentas</option>
                {accountsWithBalances.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({formatMoney(a.current_balance ?? a.initial_balance)})
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-4">Fecha</th>
                    <th className="p-4">Tipo</th>
                    <th className="p-4">Descripción</th>
                    <th className="p-4">Cuenta</th>
                    <th className="p-4">Categoría</th>
                    <th className="p-4 text-right">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                  {transactions
                    .filter((tx) => {
                      if (txSearch && !tx.description?.toLowerCase().includes(txSearch.toLowerCase())) return false;
                      if (txTypeFilter !== 'todos' && tx.type !== txTypeFilter) return false;
                      if (txCategoryFilter !== 'todas' && tx.category_id !== txCategoryFilter) return false;
                      if (txAccountFilter !== 'todas' && tx.account_id !== txAccountFilter && tx.destination_account_id !== txAccountFilter) return false;
                      return true;
                    })
                    .map((tx) => {
                      const isTransfer = tx.type === 'transferencia';
                      const isSourceSelected =
                        txAccountFilter !== 'todas' && tx.account_id === txAccountFilter;
                      const isDestSelected =
                        txAccountFilter !== 'todas' && tx.destination_account_id === txAccountFilter;

                      let amountPrefix = '';
                      let amountColor = 'text-blue-600 dark:text-blue-400';

                      if (tx.type === 'ingreso') {
                        amountPrefix = '+';
                        amountColor = 'text-emerald-600 dark:text-emerald-400';
                      } else if (tx.type === 'salida') {
                        amountPrefix = '-';
                        amountColor = 'text-rose-600 dark:text-rose-400';
                      } else if (isTransfer) {
                        if (isSourceSelected && !isDestSelected) {
                          amountPrefix = '-';
                          amountColor = 'text-rose-600 dark:text-rose-400';
                        } else if (isDestSelected && !isSourceSelected) {
                          amountPrefix = '+';
                          amountColor = 'text-emerald-600 dark:text-emerald-400';
                        }
                      }

                      return (
                        <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                          <td className="p-4 text-xs text-slate-400 whitespace-nowrap">{tx.date}</td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                tx.type === 'ingreso'
                                  ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                                  : tx.type === 'salida'
                                  ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300'
                                  : 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300'
                              }`}
                            >
                              {tx.type}
                            </span>
                          </td>
                          <td className="p-4 font-semibold text-slate-900 dark:text-white">{tx.description || '—'}</td>
                          <td className="p-4 text-xs text-slate-500 dark:text-slate-300">
                            {isTransfer && txAccountFilter === 'todas' ? (
                              <>
                                <span className="text-rose-500 dark:text-rose-400 font-semibold">{tx.account?.name} (-)</span>
                                {' ➔ '}
                                <span className="text-emerald-500 dark:text-emerald-400 font-semibold">{tx.destination_account?.name} (+)</span>
                              </>
                            ) : (
                              <>
                                {tx.account?.name}{' '}
                                {tx.destination_account && (
                                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                                    ➔ {tx.destination_account.name}
                                  </span>
                                )}
                              </>
                            )}
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
                          <td className="p-4 text-right font-black text-sm">
                            {isTransfer && txAccountFilter === 'todas' ? (
                              <div className="flex items-center justify-end gap-1.5 text-xs">
                                <span className="text-rose-600 dark:text-rose-400">-{formatMoney(tx.amount)}</span>
                                <span className="text-slate-300 dark:text-slate-600 font-normal">/</span>
                                <span className="text-emerald-600 dark:text-emerald-400">+{formatMoney(tx.amount)}</span>
                              </div>
                            ) : (
                              <span className={amountColor}>
                                {amountPrefix}{formatMoney(tx.amount)}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. SECCIÓN CUENTAS */}
        {activeTab === 'accounts' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Mis Cuentas</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Saldos calculados en tiempo real en {currencyCode} ({currencySymbol}).
                </p>
              </div>
              <button
                onClick={() => setAccountFormOpen(!accountFormOpen)}
                className="bg-emerald-500 hover:bg-emerald-400 text-white dark:text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{accountFormOpen ? 'Cerrar' : 'Agregar Cuenta'}</span>
              </button>
            </div>

            {/* Banner de Resumen Consolidado */}
            <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-blue-500/10 border border-emerald-500/20 rounded-3xl p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
                  Patrimonio Total en Cuentas
                </span>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                  {formatMoney(accountsWithBalances.reduce((sum, a) => sum + (a.current_balance || 0), 0))}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Suma total de {accountsWithBalances.length} cuentas registradas con transferencias e ingresos/salidas aplicados.
                </p>
              </div>
            </div>

            {accountFormOpen && (
              <form onSubmit={handleCreateAccount} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Nueva Cuenta</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Nombre</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Débito Principal"
                      value={newAccountName}
                      onChange={(e) => setNewAccountName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Tipo</label>
                    <select
                      value={newAccountType}
                      onChange={(e) => setNewAccountType(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                    >
                      <option value="efectivo">Efectivo</option>
                      <option value="tarjeta">Tarjeta</option>
                      <option value="ahorro">Ahorro</option>
                      <option value="inversion">Inversión</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Saldo Inicial ({currencySymbol})</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newAccountInitial}
                      onChange={(e) => setNewAccountInitial(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                <button type="submit" className="px-5 py-2 bg-emerald-500 text-white dark:text-slate-950 font-bold text-xs rounded-xl">
                  Guardar Cuenta
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {accountsWithBalances.map((acc) => {
                const bal = acc.current_balance ?? acc.initial_balance;
                return (
                  <div
                    key={acc.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-3xl">
                          {acc.type === 'tarjeta' ? '💳' : acc.type === 'efectivo' ? '💵' : '🏦'}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                          {acc.type}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">{acc.name}</h4>

                      {/* Saldo Actual destacado */}
                      <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                          Saldo Actual
                        </span>
                        <h3
                          className={`text-2xl font-black ${
                            bal >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {formatMoney(bal)}
                        </h3>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-500 dark:text-slate-400">
                        <span>Saldo Inicial:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {formatMoney(acc.initial_balance)}
                        </span>
                      </div>
                      {acc.total_ingresos > 0 && (
                        <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                          <span>Ingresos recibidos:</span>
                          <span className="font-semibold">+{formatMoney(acc.total_ingresos)}</span>
                        </div>
                      )}
                      {acc.total_salidas > 0 && (
                        <div className="flex justify-between text-rose-600 dark:text-rose-400">
                          <span>Gastos pagados:</span>
                          <span className="font-semibold">-{formatMoney(acc.total_salidas)}</span>
                        </div>
                      )}
                      {acc.total_transferencias_entrantes > 0 && (
                        <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                          <span>Transf. recibidas (+):</span>
                          <span className="font-semibold">+{formatMoney(acc.total_transferencias_entrantes)}</span>
                        </div>
                      )}
                      {acc.total_transferencias_salientes > 0 && (
                        <div className="flex justify-between text-rose-600 dark:text-rose-400">
                          <span>Transf. enviadas (-):</span>
                          <span className="font-semibold">-{formatMoney(acc.total_transferencias_salientes)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. SECCIÓN CATEGORÍAS */}
        {activeTab === 'categories' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Categorías</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Clasifica tus gastos e ingresos con colores personalizados.</p>
              </div>
              <button
                onClick={() => setCategoryFormOpen(!categoryFormOpen)}
                className="bg-emerald-500 hover:bg-emerald-400 text-white dark:text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{categoryFormOpen ? 'Cerrar' : 'Nueva Categoría'}</span>
              </button>
            </div>

            {categoryFormOpen && (
              <form onSubmit={handleCreateCategory} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Crear Categoría</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Nombre</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Gimnasio, Mascotas..."
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Tipo</label>
                    <select
                      value={newCatType}
                      onChange={(e) => setNewCatType(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                    >
                      <option value="salida">Salida (Gasto)</option>
                      <option value="ingreso">Ingreso</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Color</label>
                    <input
                      type="color"
                      value={newCatColor}
                      onChange={(e) => setNewCatColor(e.target.value)}
                      className="w-full h-9 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-1 cursor-pointer"
                    />
                  </div>
                </div>
                <button type="submit" className="px-5 py-2 bg-emerald-500 text-white dark:text-slate-950 font-bold text-xs rounded-xl">
                  Guardar Categoría
                </button>
              </form>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {categories.map((c) => (
                <div key={c.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{c.name}</p>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 capitalize">{c.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. SECCIÓN PRESUPUESTOS */}
        {activeTab === 'budgets' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Presupuestos Mensuales</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Comparativa con el año anterior en {currencyCode} ({currencySymbol}).
              </p>
            </div>
            <BudgetGaugeCard year={new Date().getFullYear()} month={new Date().getMonth() + 1} />
          </div>
        )}

        {/* 6. REPORTES */}
        {(activeTab === 'reports_date' || activeTab === 'reports_category') && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {activeTab === 'reports_date' ? 'Reporte por Rango de Fechas' : 'Reporte Analítico por Categoría'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Distribución porcentual en {currencyCode}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Distribución de Gastos</h3>
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
                          <div className="flex justify-between text-slate-600 dark:text-slate-300">
                            <span className="flex items-center gap-1.5 font-semibold">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                              {cat.name}
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {formatMoney(totalCat)} ({pct}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
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

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Diagnóstico de Ahorro</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Tu tasa de ahorro actual es de{' '}
                    <strong className="text-emerald-600 dark:text-emerald-400">
                      {totalIncome > 0 ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1) : 0}%
                    </strong>
                    .
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800/80 mt-6 space-y-2">
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Ingresos Registrados:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatMoney(totalIncome)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Salidas Registradas:</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">{formatMoney(totalExpense)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800 font-bold">
                    <span>Balance Neto:</span>
                    <span className={netBalance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                      {formatMoney(netBalance)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. CONFIGURACIÓN COMPLETA CON GUARDADO REAL */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Configuración del Sistema</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Personaliza la divisa, formato numérico y preferencias visuales.
              </p>
            </div>

            {savedNotice && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs font-bold animate-in fade-in flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>¡Configuración guardada y sincronizada con éxito en tu cuenta!</span>
              </div>
            )}

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-sm">
              {/* 1. Selector de Moneda Dinámico */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Moneda Principal ({currencyCode} - {currencySymbol})
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {CURRENCIES.map((curr) => {
                    const isSelected = currencyCode === curr.code;
                    return (
                      <button
                        key={curr.code}
                        type="button"
                        onClick={() => handleSaveSettings(curr.code, curr.symbol, decimals)}
                        className={`p-3 rounded-2xl border-2 text-left transition ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 font-bold'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-950'
                        }`}
                      >
                        <p className={`text-xs ${isSelected ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-900 dark:text-white'}`}>
                          {curr.code} ({curr.symbol})
                        </p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{curr.name}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Decimales */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Formato de Decimales
                </label>
                <div className="flex gap-3">
                  {[
                    { val: 2, label: `2 Decimales (${currencySymbol} 1.250,00)` },
                    { val: 0, label: `Sin Decimales (${currencySymbol} 1.250)` },
                  ].map((d) => (
                    <button
                      key={d.val}
                      type="button"
                      onClick={() => handleSaveSettings(currencyCode, currencySymbol, d.val)}
                      className={`px-4 py-2.5 rounded-xl border-2 text-xs font-semibold transition ${
                        decimals === d.val
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-bold'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Selector de Temas */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                  Apariencia & Tema Visual
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'light', title: '☀️ Claro', desc: 'Fondo nítido y luminoso (Recomendado)', color: 'border-amber-500' },
                    { id: 'dark', title: '🌙 Oscuro', desc: 'Fondo profundo modo noche', color: 'border-blue-500' },
                    { id: 'system', title: '💻 Sistema', desc: 'Sigue el tema de tu dispositivo', color: 'border-emerald-500' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleThemeChange(t.id as ThemeMode)}
                      className={`p-4 rounded-2xl border-2 text-left transition ${
                        theme === t.id
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-950'
                      }`}
                    >
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{t.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Aislamiento & Privacidad */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Aislamiento & Privacidad Multi-tenant</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Usuario autenticado: <strong className="text-slate-800 dark:text-slate-200">{user.email}</strong>. Cada ajuste de moneda se sincroniza directamente en tu registro de la tabla <code className="text-emerald-600 dark:text-emerald-400">profiles</code> en Supabase PostgreSQL.
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
        accounts={accountsWithBalances}
        categories={categories}
        currencySymbol={currencySymbol}
        onSuccess={() => loadAllData()}
      />

      {/* Modal de Descarga de APK Oficial */}
      <DownloadApkModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
      />
    </div>
  );
};
