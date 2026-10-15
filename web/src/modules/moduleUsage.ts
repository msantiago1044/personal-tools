import { ModuleManifest } from './moduleRegistry';

export type ModuleSortMode = 'most_used' | 'recent' | 'default';

export interface ModuleUsageStats {
  count: number;
  lastOpened: number; // Unix timestamp en ms
  pinned?: boolean;
}

export type ModuleUsageMap = Record<string, ModuleUsageStats>;

const STORAGE_PREFIX = 'pt_module_usage_';
const SORT_PREF_KEY = 'pt_module_sort_preference';

function getStorageKey(userKey?: string): string {
  const normalized = (userKey || 'default').trim().toLowerCase().replace(/[^a-z0-9_.-]/g, '_');
  return `${STORAGE_PREFIX}${normalized}`;
}

/**
 * Obtiene el mapa completo de estadísticas de uso para el usuario actual
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
 * Guarda las estadísticas de uso para el usuario actual
 */
function saveModuleUsageStats(stats: ModuleUsageMap, userKey?: string): void {
  try {
    localStorage.setItem(getStorageKey(userKey), JSON.stringify(stats));
  } catch (e) {
    console.warn('Error guardando estadísticas de uso de módulos:', e);
  }
}

/**
 * Registra una apertura de un módulo (incrementa contador y actualiza fecha)
 */
export function recordModuleUsage(moduleId: string, userKey?: string): void {
  if (!moduleId || moduleId === 'hub') return;
  const stats = getModuleUsageStats(userKey);
  const current = stats[moduleId] || { count: 0, lastOpened: 0, pinned: false };

  stats[moduleId] = {
    ...current,
    count: (current.count || 0) + 1,
    lastOpened: Date.now(),
  };

  saveModuleUsageStats(stats, userKey);
}

/**
 * Fija o desfija un módulo en la parte superior (Pin/Favorito)
 */
export function togglePinModule(moduleId: string, userKey?: string): boolean {
  if (!moduleId) return false;
  const stats = getModuleUsageStats(userKey);
  const current = stats[moduleId] || { count: 0, lastOpened: 0, pinned: false };
  const newPinned = !current.pinned;

  stats[moduleId] = {
    ...current,
    pinned: newPinned,
  };

  saveModuleUsageStats(stats, userKey);
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
export function setStoredSortPreference(mode: ModuleSortMode): void {
  try {
    localStorage.setItem(SORT_PREF_KEY, mode);
  } catch (e) {
    console.warn('Error guardando preferencia de orden de módulos:', e);
  }
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
  // Mapa de índices originales para desempate estable
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

      // Desempate por última apertura
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
