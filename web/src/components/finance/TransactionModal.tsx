import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Account, Category, TransactionType } from '../../../../packages/shared/src/types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  categories: Category[];
  onSuccess: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  accounts,
  categories,
  onSuccess,
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

  // Filtrar categorías según el tipo seleccionado
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

      // Resetear campos y cerrar
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100">
        {/* Cabecera */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">Registrar Movimiento</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Selector de Tipo (Ingreso, Salida, Transferencia) */}
        <div className="grid grid-cols-3 gap-2 mt-4 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setType('salida');
              setCategoryId('');
            }}
            className={`py-2 text-sm font-semibold rounded-lg transition ${
              type === 'salida'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            - Salida
          </button>
          <button
            type="button"
            onClick={() => {
              setType('ingreso');
              setCategoryId('');
            }}
            className={`py-2 text-sm font-semibold rounded-lg transition ${
              type === 'ingreso'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            + Ingreso
          </button>
          <button
            type="button"
            onClick={() => {
              setType('transferencia');
              setCategoryId('');
            }}
            className={`py-2 text-sm font-semibold rounded-lg transition ${
              type === 'transferencia'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ⇄ Transferencia
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Monto */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Monto</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">$</span>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 py-3 text-lg font-bold text-white focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {/* Cuentas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                {type === 'transferencia' ? 'Cuenta de Salida (Origen)' : 'Cuenta'}
              </label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition"
              >
                <option value="">Selecciona cuenta...</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.type})
                  </option>
                ))}
              </select>
            </div>

            {type === 'transferencia' && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Cuenta de Ingreso (Destino)
                </label>
                <select
                  value={destinationAccountId}
                  onChange={(e) => setDestinationAccountId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition"
                >
                  <option value="">Selecciona destino...</option>
                  {accounts
                    .filter((acc) => acc.id !== accountId)
                    .map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.type})
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* Categoría (solo si no es transferencia) */}
            {type !== 'transferencia' && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Categoría</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition"
                >
                  <option value="">Selecciona categoría...</option>
                  {filteredCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Fecha automática (con opción de editar) */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Fecha</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Descripción opcional */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Descripción (opcional)</label>
            <input
              type="text"
              placeholder="Ej. Almuerzo de trabajo, Taxi, Pago quincena..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition"
            >
              {isLoading ? 'Guardando...' : 'Guardar Movimiento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
