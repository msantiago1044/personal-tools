import React, { useState, useMemo } from 'react';
import { Account, Category, Transaction } from '../../../../packages/shared/src/types';
import { useModalBackHandler } from '../../lib/useModalBackHandler';
import {
  Download,
  FileSpreadsheet,
  FileCode,
  Calendar,
  Filter,
  Check,
  X,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ExportTransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  currencyCode?: string;
  currencySymbol?: string;
  // Filtros iniciales si vienen de la vista principal
  initialDateFrom?: string;
  initialDateTo?: string;
  initialType?: string;
  initialCategoryId?: string;
  initialAccountId?: string;
  initialSearch?: string;
}

type DatePreset = 'all' | 'this_month' | 'prev_month' | 'last_30_days' | 'this_year' | 'custom';
type ExportFormat = 'csv' | 'json';

export const ExportTransactionsModal: React.FC<ExportTransactionsModalProps> = ({
  isOpen,
  onClose,
  transactions,
  accounts,
  categories,
  currencyCode = 'USD',
  currencySymbol = '$',
  initialDateFrom = '',
  initialDateTo = '',
  initialType = 'todos',
  initialCategoryId = 'todas',
  initialAccountId = 'todas',
  initialSearch = '',
}) => {
  // Estados de filtros internos del modal
  const [dateFrom, setDateFrom] = useState<string>(initialDateFrom);
  const [dateTo, setDateTo] = useState<string>(initialDateTo);
  const [preset, setPreset] = useState<DatePreset>(() => {
    if (initialDateFrom || initialDateTo) return 'custom';
    return 'this_month';
  });

  const [typeFilter, setTypeFilter] = useState<string>(initialType);
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategoryId);
  const [accountFilter, setAccountFilter] = useState<string>(initialAccountId);
  const [searchFilter, setSearchFilter] = useState<string>(initialSearch);
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  useModalBackHandler({
    isOpen,
    onClose,
    modalId: 'export_transactions_modal',
  });

  // Inicializar fechas según el preset por defecto si no venían prefijadas
  React.useEffect(() => {
    if (isOpen) {
      setDownloadSuccess(false);
      if (initialDateFrom || initialDateTo) {
        setDateFrom(initialDateFrom);
        setDateTo(initialDateTo);
        setPreset('custom');
      } else {
        applyPreset('this_month');
      }
      setTypeFilter(initialType);
      setCategoryFilter(initialCategoryId);
      setAccountFilter(initialAccountId);
      setSearchFilter(initialSearch);
    }
  }, [isOpen, initialDateFrom, initialDateTo, initialType, initialCategoryId, initialAccountId, initialSearch]);

  const applyPreset = (newPreset: DatePreset) => {
    setPreset(newPreset);
    const now = new Date();

    if (newPreset === 'all') {
      setDateFrom('');
      setDateTo('');
    } else if (newPreset === 'this_month') {
      const from = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
      const to = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      setDateFrom(from);
      setDateTo(to);
    } else if (newPreset === 'prev_month') {
      const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      const from = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}-01`;
      const to = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
      setDateFrom(from);
      setDateTo(to);
    } else if (newPreset === 'last_30_days') {
      const d30 = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
      const from = `${d30.getFullYear()}-${String(d30.getMonth() + 1).padStart(2, '0')}-${String(d30.getDate()).padStart(2, '0')}`;
      const to = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      setDateFrom(from);
      setDateTo(to);
    } else if (newPreset === 'this_year') {
      const from = `${now.getFullYear()}-01-01`;
      const to = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      setDateFrom(from);
      setDateTo(to);
    }
  };

  // Movimientos filtrados para la exportación
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Filtro de fecha
      if (dateFrom && tx.date < dateFrom) return false;
      if (dateTo && tx.date > dateTo) return false;

      // Filtro de tipo
      if (typeFilter !== 'todos' && tx.type !== typeFilter) return false;

      // Filtro de categoría
      if (categoryFilter !== 'todas' && tx.category_id !== categoryFilter) return false;

      // Filtro de cuenta (origen o destino)
      if (accountFilter !== 'todas') {
        const matchesSource = tx.account_id === accountFilter;
        const matchesDest = tx.destination_account_id === accountFilter;
        if (!matchesSource && !matchesDest) return false;
      }

      // Filtro de búsqueda
      if (searchFilter.trim()) {
        const term = searchFilter.toLowerCase();
        const descMatch = tx.description?.toLowerCase().includes(term);
        const catMatch = tx.category?.name.toLowerCase().includes(term);
        const accMatch = tx.account?.name.toLowerCase().includes(term);
        if (!descMatch && !catMatch && !accMatch) return false;
      }

      return true;
    });
  }, [transactions, dateFrom, dateTo, typeFilter, categoryFilter, accountFilter, searchFilter]);

  // Resumen cuantitativo para vista previa en el modal
  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;

    for (const tx of filteredTransactions) {
      if (tx.type === 'ingreso') {
        income += tx.amount;
      } else if (tx.type === 'salida') {
        expense += tx.amount;
      }
    }

    return {
      totalIncome: income,
      totalExpense: expense,
      netBalance: income - expense,
      count: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  if (!isOpen) return null;

  const escapeCsv = (val: unknown): string => {
    if (val === null || val === undefined) return '';
    const str = String(val).trim();
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const handleExport = () => {
    if (filteredTransactions.length === 0) return;

    let filenameBase = 'movimientos';
    if (dateFrom && dateTo) {
      filenameBase += `_${dateFrom}_al_${dateTo}`;
    } else if (dateFrom) {
      filenameBase += `_desde_${dateFrom}`;
    } else if (dateTo) {
      filenameBase += `_hasta_${dateTo}`;
    } else {
      filenameBase += `_todos_${new Date().toISOString().split('T')[0]}`;
    }

    if (format === 'csv') {
      const headers = [
        'Fecha',
        'Tipo',
        'Descripción',
        'Monto',
        'Moneda',
        'Categoría',
        'Cuenta Origen',
        'Cuenta Destino',
        'ID Transacción',
      ];

      const rows = filteredTransactions.map((tx) => {
        let tipoLegible = 'Gasto';
        if (tx.type === 'ingreso') tipoLegible = 'Ingreso';
        if (tx.type === 'transferencia') tipoLegible = 'Transferencia';

        return [
          tx.date,
          tipoLegible,
          tx.description || '',
          tx.amount.toFixed(2),
          currencyCode,
          tx.category?.name || (tx.type === 'transferencia' ? 'Transferencia' : 'Sin Categoría'),
          tx.account?.name || '',
          tx.destination_account?.name || '',
          tx.id,
        ];
      });

      // UTF-8 BOM (\uFEFF) para compatibilidad perfecta con Microsoft Excel y caracteres con tilde/ñ
      const csvString =
        '\uFEFF' +
        [headers.map(escapeCsv).join(','), ...rows.map((r) => r.map(escapeCsv).join(','))].join('\r\n');

      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      triggerDownload(blob, `${filenameBase}.csv`);
    } else {
      // Exportación en formato JSON
      const exportJson = {
        meta: {
          app: 'Personal Tools - Suite & Finanzas',
          version: '1.0',
          export_date: new Date().toISOString(),
          currency: currencyCode,
          filters_applied: {
            date_from: dateFrom || null,
            date_to: dateTo || null,
            type: typeFilter,
            account: accountFilter !== 'todas' ? accounts.find((a) => a.id === accountFilter)?.name : 'Todas',
            category: categoryFilter !== 'todas' ? categories.find((c) => c.id === categoryFilter)?.name : 'Todas',
            search: searchFilter || null,
          },
          summary: {
            total_records: summary.count,
            total_income: summary.totalIncome,
            total_expense: summary.totalExpense,
            net_balance: summary.netBalance,
          },
        },
        transactions: filteredTransactions.map((tx) => ({
          id: tx.id,
          date: tx.date,
          type: tx.type,
          amount: tx.amount,
          currency: currencyCode,
          description: tx.description || null,
          category: tx.category ? { id: tx.category.id, name: tx.category.name, color: tx.category.color } : null,
          account: tx.account ? { id: tx.account.id, name: tx.account.name, type: tx.account.type } : null,
          destination_account: tx.destination_account
            ? { id: tx.destination_account.id, name: tx.destination_account.name, type: tx.destination_account.type }
            : null,
          created_at: tx.created_at,
        })),
      };

      const jsonString = JSON.stringify(exportJson, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
      triggerDownload(blob, `${filenameBase}.json`);
    }

    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 4000);
  };

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl text-slate-900 dark:text-slate-100 h-[92dvh] sm:h-auto max-h-[92dvh] sm:max-h-[88vh] flex flex-col overflow-hidden transition-colors">
        {/* Indicador táctil superior para celulares (Drag Handle) */}
        <div className="w-full flex justify-center pt-2.5 pb-1 sm:hidden bg-slate-50 dark:bg-slate-900/90 border-b border-slate-100 dark:border-slate-800/60">
          <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Cabecera Fija */}
        <div className="sticky top-0 z-20 flex justify-between items-start p-4 sm:p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Exportar Movimientos
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Descarga tus transacciones filtradas por fechas, cuentas y categorías.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition min-w-[44px] min-h-[44px] flex items-center justify-center -mr-1 -mt-1 active:scale-95"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo Scrolleable */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-5 -webkit-overflow-scrolling-touch">
          {/* Notificación de éxito */}
          {downloadSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <Check className="w-4 h-4 shrink-0" />
              <span>¡Archivo generado y descargado exitosamente en tu navegador!</span>
            </div>
          )}

          {/* 1. SELECCIÓN DE RANGO DE FECHAS */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-500" />
              <span>Rango de Fechas</span>
            </label>

            {/* Chips de presets rápidos */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'this_month' as DatePreset, label: 'Este Mes' },
                { id: 'prev_month' as DatePreset, label: 'Mes Anterior' },
                { id: 'last_30_days' as DatePreset, label: 'Últimos 30 días' },
                { id: 'this_year' as DatePreset, label: 'Este Año' },
                { id: 'all' as DatePreset, label: 'Todo el Historial' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPreset(p.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                    preset === p.id
                      ? 'bg-emerald-500 text-white font-semibold shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Inputs de fecha Desde / Hasta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Desde</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setPreset('custom');
                  }}
                  className="bg-transparent text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
                />
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hasta</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setPreset('custom');
                  }}
                  className="bg-transparent text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. FILTROS AVANZADOS OPCIONALES */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-blue-500" />
              <span>Filtros Adicionales</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Tipo */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Tipo</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  <option value="todos">Todos los tipos</option>
                  <option value="ingreso">Solo Ingresos</option>
                  <option value="salida">Solo Gastos</option>
                  <option value="transferencia">Solo Transferencias</option>
                </select>
              </div>

              {/* Cuenta */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Cuenta</label>
                <select
                  value={accountFilter}
                  onChange={(e) => setAccountFilter(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  <option value="todas">Todas las cuentas</option>
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Categoría */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Categoría</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  <option value="todas">Todas las categorías</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 3. SELECCIÓN DE FORMATO */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              Formato de Archivo
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition ${
                  format === 'csv'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div
                  className={`p-2 rounded-xl ${
                    format === 'csv'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Excel / CSV</span>
                    {format === 'csv' && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Hojas de cálculo con UTF-8 BOM
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat('json')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition ${
                  format === 'json'
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div
                  className={`p-2 rounded-xl ${
                    format === 'json'
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  <FileCode className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>JSON</span>
                    {format === 'json' && <Check className="w-3.5 h-3.5 text-blue-500" />}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Estructura raw con metadatos
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* 4. TARJETA RESUMEN / VISTA PREVIA */}
          <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Vista Previa del Export</span>
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-0.5 rounded-full">
                {summary.count} {summary.count === 1 ? 'movimiento' : 'movimientos'}
              </span>
            </div>

            {summary.count > 0 ? (
              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/80">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Ingresos</div>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    +{currencySymbol}
                    {summary.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Gastos</div>
                  <div className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                    -{currencySymbol}
                    {summary.totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Balance Neto</div>
                  <div
                    className={`text-xs font-bold mt-0.5 ${
                      summary.netBalance >= 0
                        ? 'text-slate-900 dark:text-white'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {currencySymbol}
                    {summary.netBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 dark:text-slate-400 py-1 text-center">
                No hay movimientos que coincidan con estos filtros y rango de fechas.
              </div>
            )}
          </div>
        </div>

        {/* Acciones Fijas (Sticky Footer) */}
        <div className="sticky bottom-0 z-20 flex items-center justify-end gap-2.5 p-4 sm:px-6 sm:py-3.5 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 shrink-0 safe-bottom">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition min-h-[44px]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={summary.count === 0}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition min-h-[44px] ${
              summary.count > 0
                ? 'bg-emerald-500 hover:bg-emerald-400 text-white dark:text-slate-950 active:scale-95'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>
              Descargar {summary.count} {summary.count === 1 ? 'movimiento' : 'movimientos'} (
              {format.toUpperCase()})
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
