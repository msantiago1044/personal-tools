import { supabase } from '../../../lib/supabase';
import { Asset, DebtDetail, NetWorthSnapshot, Account } from '../../../../../packages/shared/src/types';

const LOCAL_STORAGE_ASSETS_KEY = 'patrimonio_assets_cache';
const LOCAL_STORAGE_DEBTS_KEY = 'patrimonio_debts_cache';

/**
 * Carga la lista de activos del usuario desde Supabase con respaldo local
 */
export async function fetchAssets(userId: string): Promise<Asset[]> {
  try {
    if (!userId || userId === 'local_user') {
      const cached = localStorage.getItem(LOCAL_STORAGE_ASSETS_KEY);
      return cached ? JSON.parse(cached) : [];
    }

    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('user_id', userId)
      .order('purchase_date', { ascending: false });

    if (error) {
      console.warn('Error al consultar tabla assets en Supabase (usando caché local si existe):', error.message);
      const cached = localStorage.getItem(`${LOCAL_STORAGE_ASSETS_KEY}_${userId}`);
      return cached ? JSON.parse(cached) : [];
    }

    if (data) {
      localStorage.setItem(`${LOCAL_STORAGE_ASSETS_KEY}_${userId}`, JSON.stringify(data));
      return data as Asset[];
    }
  } catch (err) {
    console.warn('Excepción al cargar activos, recurriendo a localStorage:', err);
    const cached = localStorage.getItem(`${LOCAL_STORAGE_ASSETS_KEY}_${userId}`);
    if (cached) return JSON.parse(cached);
  }

  return [];
}

/**
 * Guarda o actualiza un activo
 */
export async function saveAsset(asset: Partial<Asset>, userId: string): Promise<Asset | null> {
  const assetId = asset.id || crypto.randomUUID();
  const payload: Asset = {
    id: assetId,
    user_id: userId,
    name: asset.name || 'Sin nombre',
    category: asset.category || 'enseres',
    location: asset.location || '',
    purchase_date: asset.purchase_date || new Date().toISOString().split('T')[0],
    purchase_price: Number(asset.purchase_price) || 0,
    currency: asset.currency || 'USD',
    depreciation_method: asset.depreciation_method || 'lineal',
    useful_life_months: Number(asset.useful_life_months) || 60,
    salvage_value: Number(asset.salvage_value) || 0,
    annual_rate: Number(asset.annual_rate) || 0,
    warranty_expiration: asset.warranty_expiration || undefined,
    serial_number: asset.serial_number || undefined,
    image_url: asset.image_url || undefined,
    notes: asset.notes || '',
    is_active: asset.is_active ?? true,
    created_at: asset.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Guardar en Supabase
  try {
    if (userId && userId !== 'local_user') {
      const { error } = await supabase.from('assets').upsert(payload);
      if (error) {
        console.warn('No se pudo guardar activo en Supabase (guardando en caché local):', error.message);
      }
    }
  } catch (err) {
    console.warn('Error en red/Supabase al guardar activo:', err);
  }

  // Actualizar caché local
  try {
    const key = `${LOCAL_STORAGE_ASSETS_KEY}_${userId}`;
    const cached = localStorage.getItem(key);
    const list: Asset[] = cached ? JSON.parse(cached) : [];
    const idx = list.findIndex((a) => a.id === assetId);
    if (idx >= 0) {
      list[idx] = payload;
    } else {
      list.unshift(payload);
    }
    localStorage.setItem(key, JSON.stringify(list));
  } catch (err) {
    console.error('Error guardando en localStorage:', err);
  }

  return payload;
}

/**
 * Elimina un activo
 */
export async function deleteAsset(assetId: string, userId: string): Promise<boolean> {
  try {
    if (userId && userId !== 'local_user') {
      await supabase.from('assets').delete().eq('id', assetId).eq('user_id', userId);
    }
  } catch (err) {
    console.warn('Error eliminando en Supabase:', err);
  }

  try {
    const key = `${LOCAL_STORAGE_ASSETS_KEY}_${userId}`;
    const cached = localStorage.getItem(key);
    if (cached) {
      const list: Asset[] = JSON.parse(cached);
      const updated = list.filter((a) => a.id !== assetId);
      localStorage.setItem(key, JSON.stringify(updated));
    }
  } catch (err) {
    console.error('Error actualizando caché tras borrado:', err);
  }

  return true;
}

/**
 * Obtiene las cuentas del módulo de finanzas para calcular liquidez y deudas
 */
export async function fetchFinanceAccounts(userId: string): Promise<Account[]> {
  try {
    if (!userId || userId === 'local_user') return [];

    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (error) {
      console.warn('Error al consultar accounts de finanzas:', error.message);
      return [];
    }
    return (data as Account[]) || [];
  } catch (err) {
    console.warn('Excepción al cargar accounts:', err);
    return [];
  }
}

/**
 * Obtiene o inicializa los detalles de deudas (debt_details)
 */
export async function fetchDebtDetails(userId: string): Promise<DebtDetail[]> {
  try {
    if (!userId || userId === 'local_user') {
      const cached = localStorage.getItem(LOCAL_STORAGE_DEBTS_KEY);
      return cached ? JSON.parse(cached) : [];
    }

    const { data, error } = await supabase
      .from('debt_details')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.warn('Error al consultar debt_details en Supabase:', error.message);
      const cached = localStorage.getItem(`${LOCAL_STORAGE_DEBTS_KEY}_${userId}`);
      return cached ? JSON.parse(cached) : [];
    }

    if (data) {
      localStorage.setItem(`${LOCAL_STORAGE_DEBTS_KEY}_${userId}`, JSON.stringify(data));
      return data as DebtDetail[];
    }
  } catch (err) {
    console.warn('Excepción al cargar deudas:', err);
    const cached = localStorage.getItem(`${LOCAL_STORAGE_DEBTS_KEY}_${userId}`);
    if (cached) return JSON.parse(cached);
  }

  return [];
}

/**
 * Guarda o actualiza un detalle de deuda
 */
export async function saveDebtDetail(debt: Partial<DebtDetail>, userId: string): Promise<DebtDetail> {
  const debtId = debt.id || crypto.randomUUID();
  const payload: DebtDetail = {
    id: debtId,
    user_id: userId,
    account_id: debt.account_id || null,
    name: debt.name || 'Deuda sin nombre',
    current_balance: Number(debt.current_balance) || 0,
    interest_rate_annual: Number(debt.interest_rate_annual) || 0,
    minimum_payment: Number(debt.minimum_payment) || 0,
    due_day: debt.due_day ? Number(debt.due_day) : undefined,
    created_at: debt.created_at || new Date().toISOString(),
  };

  try {
    if (userId && userId !== 'local_user') {
      await supabase.from('debt_details').upsert(payload);
    }
  } catch (err) {
    console.warn('Error guardando debt_detail en Supabase:', err);
  }

  try {
    const key = `${LOCAL_STORAGE_DEBTS_KEY}_${userId}`;
    const cached = localStorage.getItem(key);
    const list: DebtDetail[] = cached ? JSON.parse(cached) : [];
    const idx = list.findIndex((d) => d.id === debtId);
    if (idx >= 0) {
      list[idx] = payload;
    } else {
      list.push(payload);
    }
    localStorage.setItem(key, JSON.stringify(list));
  } catch (err) {
    console.error('Error guardando en caché:', err);
  }

  return payload;
}
