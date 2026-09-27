import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Account, Category, TransactionType } from '../../../../packages/shared/src/types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  categories: Category[];
  onSuccess: () => void;
  currencySymbol?: string;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  accounts,
  categories,
  onSuccess,
  currencySymbol = '$',
}) => {
  const [type, setType] = useState<TransactionType>('salida');
  const [amount, setAmount] = useState<string>('');
  const [accountId, setAccountId] = useState<string>(accounts[0]?.id || '');
  const [destinationAccountId, setDestinationAccountId] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredCategories = categories.filter((cat) => cat.type === type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage('Por favor ingresa un monto válido mayor a 0.');
      return;
    }

    if (!accountId) {
      setErrorMessage('Debes seleccionar una cuenta de origen.');
      return;
    }

    if (type === 'transferencia') {
      if (!destinationAccountId) {
        setErrorMessage('Debes seleccionar la cuenta de destino para la transferencia.');
        return;
      }
      if (accountId === destinationAccountId) {
        setErrorMessage('La cuenta de destino no puede ser la misma que la cuenta de origen.');
        return;
      }
    } else {
      if (!categoryId) {
        setErrorMessage('Debes seleccionar una categoría.');
        return;
      }
    }

    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('No hay una sesión activa de usuario.');

      const payload = {
        user_id: user.id,
        type,
        amount: parsedAmount,
        account_id: accountId,
        destination_account_id: type === 'transferencia' ? destinationAccountId : null,
        category_id: type === 'transferencia' ? null : categoryId,
        description: description.trim() || null,
        date,
      };

      const { error } = await supabase.from('transactions').insert(payload);

      if (error) throw error;

      setAmount('');
      setDescription('');
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al guardar el movimiento.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 transition-colors">
        {/* Cabecera */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Nuevo Movimiento</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Selector de Tipo (Gasto, Ingreso, Transferencia) */}
        <div className="grid grid-cols-3 gap-1.5 mt-4 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              setType('salida');
              setCategoryId('');
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition ${
              type === 'salida'
                ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-500/40 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Gasto
          </button>
          <button
            type="button"
            onClick={() => {
              setType('ingreso');
              setCategoryId('');
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition ${
              type === 'ingreso'
                ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/40 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Ingreso
          </button>
          <button
            type="button"
            onClick={() => {
              setType('transferencia');
              setCategoryId('');
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition ${
              type === 'transferencia'
                ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-500/40 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Transferencia
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* Monto */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Monto</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base font-bold">$</span>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-4 py-2.5 text-base font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition"
              />
            </div>
          </div>

          {/* Cuentas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {type === 'transferencia' ? 'Cuenta Origen' : 'Cuenta'}
              </label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-500 transition"
              >
                <option value="" className="bg-white dark:bg-slate-900">Seleccionar cuenta...</option>
                {accounts.map((acc) => {
                  const bal = acc.current_balance ?? acc.initial_balance;
                  const balFormatted = bal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                  return (
                    <option key={acc.id} value={acc.id} className="bg-white dark:bg-slate-900">
                      {acc.name} · {currencySymbol}{balFormatted}
                    </option>
                  );
                })}
              </select>
            </div>

            {type === 'transferencia' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Cuenta Destino
                </label>
                <select
                  value={destinationAccountId}
                  onChange={(e) => setDestinationAccountId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500 transition"
                >
                  <option value="" className="bg-white dark:bg-slate-900">Seleccionar destino...</option>
                  {accounts
                    .filter((acc) => acc.id !== accountId)
                    .map((acc) => {
                      const bal = acc.current_balance ?? acc.initial_balance;
                      const balFormatted = bal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                      return (
                        <option key={acc.id} value={acc.id} className="bg-white dark:bg-slate-900">
                          {acc.name} · {currencySymbol}{balFormatted}
                        </option>
                      );
                    })}
                </select>
              </div>
            )}

            {/* Categoría (solo si no es transferencia) */}
            {type !== 'transferencia' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Categoría</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-500 transition"
                >
                  <option value="" className="bg-white dark:bg-slate-900">Seleccionar categoría...</option>
                  {filteredCategories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-white dark:bg-slate-900">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Fecha</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-500 transition"
            />
          </div>

          {/* Descripción opcional */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Descripción</label>
            <input
              type="text"
              placeholder="Detalle o nota opcional..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-500 transition"
            />
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs disabled:opacity-50 transition"
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
