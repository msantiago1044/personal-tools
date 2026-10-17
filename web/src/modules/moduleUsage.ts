import { ModuleManifest } from './moduleRegistry';
import { supabase } from '../lib/supabase';

export type ModuleSortMode = 'most_used' | 'recent' | 'default';

export interface ModuleUsageStats {
  count: number;
  lastOpened: number; // Unix timestamp en ms
  pinned?: boolean;
  pinnedUpdatedAt?: number;
}

export type ModuleUsageMap = Record<string, ModuleUsageStats>;

const STORAGE_PREFIX = 'pt_module_usage_';
const SORT_PREF_KEY = 'pt_module_sort_preference';

let syncDebounceTimer: ReturnType<typeof setTimeout> | null = null;
let lastRecordedTime = 0;
let lastRecordedModule = '';

function resolveUserKey(userKey?: string): string {
  if (userKey && userKey.trim() !== '') return userKey;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          const email = parsed?.user?.email || parsed?.user?.id;
          if (email) return email;
        }
      }
    }
  } catch {}
  return 'default';
}

function getStorageKey(userKey?: string): string {
  const resolved = resolveUserKey(userKey);
  const normalized = resolved.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, '_');
  return `${STORAGE_PREFIX}${normalized}`;
}

/**
 * Obtiene el mapa completo de estadísticas de uso para el usuario actual (Lectura síncrona de caché)
 */
export function getModuleUsageStats(userKey?: string): ModuleUsageMap {
  try {
    const raw = localStorage.getItem(getStorageKey(userKey));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (e) {
    console.warn('Error leyendo estadísticas de uso de módulos:', e);
    return {};
  }
}

/**
 * Guarda las estadísticas de uso en caché local
 */
function saveModuleUsageStats(stats: ModuleUsageMap, userKey?: string): void {
  try {
    localStorage.setItem(getStorageKey(userKey), JSON.stringify(stats));
  } catch (e) {
    console.warn('Error guardando estadísticas de uso de módulos:', e);
  }
}

/**
 * Registra una apertura de un módulo (incrementa contador, actualiza fecha y programa sincronización cloud)
 */
export function recordModuleUsage(moduleId: string, userKey?: string): void {
  if (!moduleId || moduleId === 'hub') return;
  const now = Date.now();
  // Evitar doble conteo si ToolHub y App disparan en milisegundos de diferencia
  if (moduleId === lastRecordedModule && now - lastRecordedTime < 600) {
    return;
  }
  lastRecordedTime = now;
  lastRecordedModule = moduleId;

  const stats = getModuleUsageStats(userKey);
  const current = stats[moduleId] || { count: 0, lastOpened: 0, pinned: false };

  stats[moduleId] = {
    ...current,
    count: (current.count || 0) + 1,
    lastOpened: now,
  };

  saveModuleUsageStats(stats, userKey);
  scheduleCloudSync(userKey);
}

/**
 * Fija o desfija un módulo en la parte superior (Pin/Favorito) y sincroniza
 */
export function togglePinModule(moduleId: string, userKey?: string): boolean {
  if (!moduleId) return false;
  const stats = getModuleUsageStats(userKey);
  const current = stats[moduleId] || { count: 0, lastOpened: 0, pinned: false };
  const newPinned = !current.pinned;
  const now = Date.now();

  stats[moduleId] = {
    ...current,
    pinned: newPinned,
    pinnedUpdatedAt: now,
  };

  saveModuleUsageStats(stats, userKey);
  scheduleCloudSync(userKey);
  return newPinned;
}

/**
 * Obtiene la preferencia de ordenación guardada por el usuario
 */
export function getStoredSortPreference(): ModuleSortMode {
  try {
    const saved = localStorage.getItem(SORT_PREF_KEY);
    if (saved === 'most_used' || saved === 'recent' || saved === 'default') {
      return saved;
    }
  } catch (e) {
    // ignorar error en storage
  }
  return 'most_used'; // Por defecto: más usados primero
}

/**
 * Guarda la preferencia de ordenación del usuario
 */
export function setStoredSortPreference(mode: ModuleSortMode, userKey?: string): void {
  try {
    localStorage.setItem(SORT_PREF_KEY, mode);
    scheduleCloudSync(userKey);
  } catch (e) {
    console.warn('Error guardando preferencia de orden de módulos:', e);
  }
}

/**
 * Sincroniza las estadísticas locales con la nube en Supabase Auth (user_metadata).
 * Realiza una unión inteligente por deltas para sumar los usos realizados en móvil y en web
 * sin sobrescribir ni perder el historial de ningún dispositivo.
 */
export async function syncModuleUsageWithCloud(userKey?: string): Promise<ModuleUsageMap> {
  const resolvedKey = resolveUserKey(userKey);
  const storageKey = getStorageKey(resolvedKey);
  const baselineKey = `pt_module_usage_synced_${storageKey}`;

  const localStats = getModuleUsageStats(resolvedKey);

  let baselineStats: ModuleUsageMap = {};
  try {
    const rawBase = localStorage.getItem(baselineKey);
    if (rawBase) baselineStats = JSON.parse(rawBase);
  } catch {}

  try {
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      return localStats;
    }

    const remoteStats: ModuleUsageMap = (user.user_metadata?.module_usage_stats as ModuleUsageMap) || {};
    const remoteSortPref = user.user_metadata?.module_sort_preference as ModuleSortMode | undefined;

    if (remoteSortPref && ['most_used', 'recent', 'default'].includes(remoteSortPref)) {
      localStorage.setItem(SORT_PREF_KEY, remoteSortPref);
    }

    const merged: ModuleUsageMap = { ...remoteStats };
    let hasRemoteDifference = false;

    // 1. Integrar deltas locales de este dispositivo
    for (const [modId, localItem] of Object.entries(localStats)) {
      const baseItem = baselineStats[modId] || { count: 0, lastOpened: 0 };
      const deltaCount = Math.max(0, (localItem.count || 0) - (baseItem.count || 0));

      const remoteItem = merged[modId] || { count: 0, lastOpened: 0, pinned: false };
      const newCount = (remoteItem.count || 0) + deltaCount;
      const newLastOpened = Math.max(remoteItem.lastOpened || 0, localItem.lastOpened || 0);

      let newPinned = !!remoteItem.pinned;
      if (localItem.pinnedUpdatedAt && remoteItem.pinnedUpdatedAt) {
        newPinned = localItem.pinnedUpdatedAt >= remoteItem.pinnedUpdatedAt ? !!localItem.pinned : !!remoteItem.pinned;
      } else if (localItem.pinned !== undefined) {
        newPinned = !!localItem.pinned || !!remoteItem.pinned;
      }

      const newPinnedUpdatedAt = Math.max(localItem.pinnedUpdatedAt || 0, remoteItem.pinnedUpdatedAt || 0);

      if (
        newCount !== remoteItem.count ||
        newLastOpened !== remoteItem.lastOpened ||
        newPinned !== remoteItem.pinned
      ) {
        hasRemoteDifference = true;
      }

      merged[modId] = {
        count: newCount,
        lastOpened: newLastOpened,
        pinned: newPinned,
        ...(newPinnedUpdatedAt > 0 ? { pinnedUpdatedAt: newPinnedUpdatedAt } : {}),
      };
    }

    // 2. Módulos que existen en la nube pero aún no en local
    for (const [modId, remoteItem] of Object.entries(remoteStats)) {
      if (!merged[modId]) {
        merged[modId] = { ...remoteItem };
        hasRemoteDifference = true;
      }
    }

    // 3. Guardar en local y registrar nueva línea base de sincronización
    saveModuleUsageStats(merged, resolvedKey);
    try {
      localStorage.setItem(baselineKey, JSON.stringify(merged));
    } catch {}

    // 4. Si hay usos locales nuevos o la nube estaba vacía, persistir en Supabase
    if (hasRemoteDifference || !user.user_metadata?.module_usage_stats) {
      await supabase.auth.updateUser({
        data: {
          module_usage_stats: merged,
          module_sort_preference: getStoredSortPreference(),
        },
      });
    }

    return merged;
  } catch (err) {
    console.warn('[moduleUsage] Error al sincronizar estadísticas en la nube:', err);
    return localStats;
  }
}

/**
 * Programa una sincronización con la nube con debounce para no saturar peticiones
 */
export function scheduleCloudSync(userKey?: string, delayMs = 1200): void {
  if (typeof window === 'undefined') return;
  if (syncDebounceTimer) {
    clearTimeout(syncDebounceTimer);
  }
  syncDebounceTimer = setTimeout(() => {
    syncModuleUsageWithCloud(userKey).catch(() => {});
  }, delayMs);
}

/**
 * Ordena la lista de módulos según el modo seleccionado y las estadísticas de uso.
 * Los módulos fijados ('pinned') se posicionan prioritariamente en la parte superior.
 */
export function sortModules(
  modules: ModuleManifest[],
  sortMode: ModuleSortMode,
  stats: ModuleUsageMap
): ModuleManifest[] {
  const originalIndices = new Map<string, number>();
  modules.forEach((mod, idx) => originalIndices.set(mod.id, idx));

  return [...modules].sort((a, b) => {
    const statsA = stats[a.id] || { count: 0, lastOpened: 0, pinned: false };
    const statsB = stats[b.id] || { count: 0, lastOpened: 0, pinned: false };

    // 1. Módulos fijados primero
    const pinnedA = !!statsA.pinned;
    const pinnedB = !!statsB.pinned;
    if (pinnedA && !pinnedB) return -1;
    if (!pinnedA && pinnedB) return 1;

    // 2. Criterio según el modo
    if (sortMode === 'most_used') {
      const diffCount = (statsB.count || 0) - (statsA.count || 0);
      if (diffCount !== 0) return diffCount;

      const diffOpened = (statsB.lastOpened || 0) - (statsA.lastOpened || 0);
      if (diffOpened !== 0) return diffOpened;
    } else if (sortMode === 'recent') {
      const diffOpened = (statsB.lastOpened || 0) - (statsA.lastOpened || 0);
      if (diffOpened !== 0) return diffOpened;
    }

    // 3. Desempate final o modo 'default': mantener el orden original del manifiesto
    const idxA = originalIndices.get(a.id) ?? 0;
    const idxB = originalIndices.get(b.id) ?? 0;
    return idxA - idxB;
  });
}

/**
 * Formatea un timestamp a texto relativo amigable
 */
export function formatRelativeTime(timestamp?: number): string | null {
  if (!timestamp || timestamp <= 0) return null;
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'Hace un momento';
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
  if (diffHours < 24) return `Hace ${diffHours} h`;
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} d`;
  return new Date(timestamp).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}
