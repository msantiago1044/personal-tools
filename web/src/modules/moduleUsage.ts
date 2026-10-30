import { ModuleManifest } from './moduleRegistry';
import { supabase } from '../lib/supabase';

export type ModuleSortMode = 'most_used' | 'recent' | 'default';

export interface ModuleUsageStats {
  count: number;
  lastOpened: number; // Unix timestamp en ms
  history?: number[]; // Historial de marcas de tiempo (Unix timestamp en ms) con las horas exactas de entrada
  pinned?: boolean;
  pinnedUpdatedAt?: number;
}

export type ModuleUsageMap = Record<string, ModuleUsageStats>;

const STORAGE_PREFIX = 'pt_module_usage_';
const SORT_PREF_KEY = 'pt_module_sort_preference';

let syncDebounceTimer: ReturnType<typeof setTimeout> | null = null;
const lastRecordedTimeByModule: Record<string, number> = {};

let syncInFlightPromise: Promise<ModuleUsageMap> | null = null;
let pendingSyncAfterInFlight = false;
let pendingSyncUserKey: string | undefined = undefined;

interface AuthTokenUserInfo {
  id?: string;
  email?: string;
}

function getAuthTokenUserInfo(): AuthTokenUserInfo {
  if (typeof window === 'undefined') return {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        ((key.startsWith('sb-') && key.endsWith('-auth-token')) ||
          key === 'pt_supabase_session_backup_v1' ||
          key === 'personal_tools_session_backup')
      ) {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          const userObj = parsed?.user || parsed?.currentSession?.user;
          const id = typeof userObj?.id === 'string' && userObj.id.trim() !== '' ? userObj.id.trim() : undefined;
          const email =
            typeof userObj?.email === 'string' && userObj.email.trim() !== '' ? userObj.email.trim() : undefined;
          if (id || email) {
            return { id, email };
          }
        }
      }
    }
  } catch {}
  return {};
}

function normalizeKeySegment(rawKey: string): string {
  return rawKey.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, '_');
}

function resolveUserKey(userKey?: string): string {
  const { id, email } = getAuthTokenUserInfo();
  const trimmed = userKey?.trim() || '';

  // Preferir siempre el UUID del usuario autenticado como clave canónica (consistente con ToolHub)
  if (id) {
    if (!trimmed || trimmed.toLowerCase() === 'default') {
      return id;
    }
    if (email && trimmed.toLowerCase() === email.toLowerCase()) {
      return id;
    }
  }

  if (trimmed && trimmed.toLowerCase() !== 'default') {
    return trimmed;
  }

  return id || email || 'default';
}

function getStorageKey(userKey?: string): string {
  const resolved = resolveUserKey(userKey);
  const normalized = normalizeKeySegment(resolved);
  return `${STORAGE_PREFIX}${normalized}`;
}

function dispatchUsageUpdatedEvent(): void {
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent('module_usage_updated'));
    } catch {}
  }
}

/**
 * Migra y fusiona registros locales guardados bajo claves antiguas (email o 'default')
 * hacia la clave canónica del usuario (UUID), preservando deltas no sincronizados e historial.
 */
function migrateAndMergeLegacyKeys(userKey?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const canonicalUserKey = resolveUserKey(userKey);
    if (!canonicalUserKey || canonicalUserKey === 'default') return;

    const canonicalStorageKey = `${STORAGE_PREFIX}${normalizeKeySegment(canonicalUserKey)}`;
    const canonicalBaselineKey = `pt_module_usage_synced_${canonicalStorageKey}`;

    const { id, email } = getAuthTokenUserInfo();
    const candidateRawKeys = new Set<string>(['default']);
    if (email) candidateRawKeys.add(email);
    if (id && id !== canonicalUserKey) candidateRawKeys.add(id);
    if (userKey && userKey.trim() !== '' && userKey.trim() !== canonicalUserKey) {
      candidateRawKeys.add(userKey.trim());
    }

    const legacyStorageKeys: string[] = [];
    for (const rawCandidate of candidateRawKeys) {
      const candidateStorageKey = `${STORAGE_PREFIX}${normalizeKeySegment(rawCandidate)}`;
      if (candidateStorageKey !== canonicalStorageKey && localStorage.getItem(candidateStorageKey)) {
        legacyStorageKeys.push(candidateStorageKey);
      }
    }

    if (legacyStorageKeys.length === 0) return;

    let primaryStats: ModuleUsageMap = {};
    let primaryBaseline: ModuleUsageMap = {};

    try {
      const rawPrim = localStorage.getItem(canonicalStorageKey);
      if (rawPrim) {
        const parsed = JSON.parse(rawPrim);
        if (parsed && typeof parsed === 'object') primaryStats = parsed;
      }
    } catch {}

    try {
      const rawPrimBase = localStorage.getItem(canonicalBaselineKey);
      if (rawPrimBase) {
        const parsed = JSON.parse(rawPrimBase);
        if (parsed && typeof parsed === 'object') primaryBaseline = parsed;
      }
    } catch {}

    let didModify = false;

    for (const legacyStorageKey of legacyStorageKeys) {
      const legacyBaselineKey = `pt_module_usage_synced_${legacyStorageKey}`;
      let legacyStats: ModuleUsageMap = {};
      let legacyBaseline: ModuleUsageMap = {};

      try {
        const rawLeg = localStorage.getItem(legacyStorageKey);
        if (rawLeg) {
          const parsed = JSON.parse(rawLeg);
          if (parsed && typeof parsed === 'object') legacyStats = parsed;
        }
      } catch {}

      try {
        const rawLegBase = localStorage.getItem(legacyBaselineKey);
        if (rawLegBase) {
          const parsed = JSON.parse(rawLegBase);
          if (parsed && typeof parsed === 'object') legacyBaseline = parsed;
        }
      } catch {}

      for (const [modId, legItem] of Object.entries(legacyStats)) {
        if (!legItem || typeof legItem !== 'object') continue;
        const primItem = primaryStats[modId] || { count: 0, lastOpened: 0, pinned: false };
        const primBaseItem = primaryBaseline[modId] || { count: 0, lastOpened: 0 };
        const legBaseItem = legacyBaseline[modId] || { count: 0, lastOpened: 0 };

        const syncedBaseCount = Math.max(primBaseItem.count || 0, legBaseItem.count || 0);
        const primUnsynced = Math.max(0, (primItem.count || 0) - (primBaseItem.count || 0));
        const legUnsynced = Math.max(0, (legItem.count || 0) - (legBaseItem.count || 0));

        const mergedHistory = Array.from(
          new Set([...(primItem.history || []), ...(legItem.history || [])])
        )
          .sort((a, b) => a - b)
          .slice(-100);

        const mergedCount = Math.max(
          syncedBaseCount + primUnsynced + legUnsynced,
          primItem.count || 0,
          legItem.count || 0,
          mergedHistory.length
        );

        const mergedLastOpened = Math.max(primItem.lastOpened || 0, legItem.lastOpened || 0);

        let mergedPinned = !!primItem.pinned;
        if (primItem.pinnedUpdatedAt && legItem.pinnedUpdatedAt) {
          mergedPinned =
            primItem.pinnedUpdatedAt >= legItem.pinnedUpdatedAt ? !!primItem.pinned : !!legItem.pinned;
        } else {
          mergedPinned = !!primItem.pinned || !!legItem.pinned;
        }
        const mergedPinnedUpdatedAt = Math.max(primItem.pinnedUpdatedAt || 0, legItem.pinnedUpdatedAt || 0);

        primaryStats[modId] = {
          count: mergedCount,
          lastOpened: mergedLastOpened,
          pinned: mergedPinned,
          ...(mergedPinnedUpdatedAt > 0 ? { pinnedUpdatedAt: mergedPinnedUpdatedAt } : {}),
          history: mergedHistory,
        };

        if (syncedBaseCount > 0 || primBaseItem.lastOpened || legBaseItem.lastOpened) {
          primaryBaseline[modId] = {
            count: syncedBaseCount,
            lastOpened: Math.max(primBaseItem.lastOpened || 0, legBaseItem.lastOpened || 0),
          };
        }

        didModify = true;
      }

      localStorage.removeItem(legacyStorageKey);
      localStorage.removeItem(legacyBaselineKey);
    }

    if (didModify) {
      localStorage.setItem(canonicalStorageKey, JSON.stringify(primaryStats));
      if (Object.keys(primaryBaseline).length > 0) {
        localStorage.setItem(canonicalBaselineKey, JSON.stringify(primaryBaseline));
      }
    }
  } catch (e) {
    console.warn('Error migrando claves de estadísticas de módulos:', e);
  }
}

/**
 * Obtiene el mapa completo de estadísticas de uso para el usuario actual (Lectura síncrona de caché)
 */
export function getModuleUsageStats(userKey?: string): ModuleUsageMap {
  try {
    migrateAndMergeLegacyKeys(userKey);
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
  const lastTime = lastRecordedTimeByModule[moduleId] || 0;
  // Evitar doble conteo del mismo módulo si ToolHub y App disparan en milisegundos de diferencia
  if (now - lastTime < 600) {
    return;
  }
  lastRecordedTimeByModule[moduleId] = now;

  const resolvedKey = resolveUserKey(userKey);
  const stats = getModuleUsageStats(resolvedKey);
  const current = stats[moduleId] || { count: 0, lastOpened: 0, pinned: false };
  const prevHistory = Array.isArray(current.history) ? current.history : [];
  // Almacenar el timestamp actual y conservar los últimos 100 accesos
  const updatedHistory = [...prevHistory, now].slice(-100);

  stats[moduleId] = {
    ...current,
    count: (current.count || 0) + 1,
    lastOpened: now,
    history: updatedHistory,
  };

  saveModuleUsageStats(stats, resolvedKey);
  dispatchUsageUpdatedEvent();
  scheduleCloudSync(resolvedKey);
}

/**
 * Fija o desfija un módulo en la parte superior (Pin/Favorito) y sincroniza
 */
export function togglePinModule(moduleId: string, userKey?: string): boolean {
  if (!moduleId) return false;
  const resolvedKey = resolveUserKey(userKey);
  const stats = getModuleUsageStats(resolvedKey);
  const current = stats[moduleId] || { count: 0, lastOpened: 0, pinned: false };
  const newPinned = !current.pinned;
  const now = Date.now();

  stats[moduleId] = {
    ...current,
    pinned: newPinned,
    pinnedUpdatedAt: now,
  };

  saveModuleUsageStats(stats, resolvedKey);
  dispatchUsageUpdatedEvent();
  scheduleCloudSync(resolvedKey);
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
async function performSyncModuleUsageWithCloud(userKey?: string): Promise<ModuleUsageMap> {
  const initialResolvedKey = resolveUserKey(userKey);

  try {
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return getModuleUsageStats(initialResolvedKey);
    }

    const resolvedKey = user.id || initialResolvedKey;
    migrateAndMergeLegacyKeys(resolvedKey);

    const storageKey = getStorageKey(resolvedKey);
    const baselineKey = `pt_module_usage_synced_${storageKey}`;

    // Leer localStats y baselineStats DESPUÉS de await getUser() para no sobrescribir
    // aperturas de módulos ocurridas mientras getUser() estaba en vuelo por red
    const snapshotLocalStats = getModuleUsageStats(resolvedKey);

    let baselineStats: ModuleUsageMap = {};
    try {
      const rawBase = localStorage.getItem(baselineKey);
      if (rawBase) baselineStats = JSON.parse(rawBase);
    } catch {}

    const remoteStats: ModuleUsageMap = (user.user_metadata?.module_usage_stats as ModuleUsageMap) || {};
    const remoteSortPref = user.user_metadata?.module_sort_preference as ModuleSortMode | undefined;

    if (remoteSortPref && ['most_used', 'recent', 'default'].includes(remoteSortPref)) {
      localStorage.setItem(SORT_PREF_KEY, remoteSortPref);
    }

    const merged: ModuleUsageMap = { ...remoteStats };
    let hasRemoteDifference = false;

    // 1. Integrar deltas locales de este dispositivo
    for (const [modId, localItem] of Object.entries(snapshotLocalStats)) {
      const baseItem = baselineStats[modId] || { count: 0, lastOpened: 0 };
      const deltaCount = Math.max(0, (localItem.count || 0) - (baseItem.count || 0));

      const remoteItem = merged[modId] || { count: 0, lastOpened: 0, pinned: false };

      // Fusionar historial sin duplicados, cronológicamente y acotando a los últimos 100 registros
      const mergedHistory = Array.from(
        new Set([...(localItem.history || []), ...(remoteItem.history || [])])
      )
        .sort((a, b) => a - b)
        .slice(-100);

      const newCount = Math.max(
        (remoteItem.count || 0) + deltaCount,
        localItem.count || 0,
        mergedHistory.length
      );
      const newLastOpened = Math.max(remoteItem.lastOpened || 0, localItem.lastOpened || 0);

      let newPinned = !!remoteItem.pinned;
      if (localItem.pinnedUpdatedAt && remoteItem.pinnedUpdatedAt) {
        newPinned =
          localItem.pinnedUpdatedAt >= remoteItem.pinnedUpdatedAt ? !!localItem.pinned : !!remoteItem.pinned;
      } else if (localItem.pinned !== undefined) {
        newPinned = !!localItem.pinned || !!remoteItem.pinned;
      }

      const newPinnedUpdatedAt = Math.max(localItem.pinnedUpdatedAt || 0, remoteItem.pinnedUpdatedAt || 0);

      const historyChanged =
        mergedHistory.length !== (remoteItem.history?.length || 0) ||
        (mergedHistory.length > 0 &&
          mergedHistory[mergedHistory.length - 1] !==
            (remoteItem.history ? remoteItem.history[remoteItem.history.length - 1] : 0));

      if (
        newCount !== remoteItem.count ||
        newLastOpened !== remoteItem.lastOpened ||
        newPinned !== remoteItem.pinned ||
        historyChanged
      ) {
        hasRemoteDifference = true;
      }

      merged[modId] = {
        count: newCount,
        lastOpened: newLastOpened,
        pinned: newPinned,
        ...(newPinnedUpdatedAt > 0 ? { pinnedUpdatedAt: newPinnedUpdatedAt } : {}),
        history: mergedHistory,
      };
    }

    // 2. Módulos que existen en la nube pero aún no en local
    for (const [modId, remoteItem] of Object.entries(remoteStats)) {
      if (!merged[modId]) {
        merged[modId] = { ...remoteItem };
        hasRemoteDifference = true;
      }
    }

    // 3. Si hay usos locales nuevos o la nube estaba vacía, persistir en Supabase
    let updateSucceeded = true;
    if (hasRemoteDifference || !user.user_metadata?.module_usage_stats) {
      const { error: updateErr } = await supabase.auth.updateUser({
        data: {
          module_usage_stats: merged,
          module_sort_preference: getStoredSortPreference(),
        },
      });
      if (updateErr) {
        updateSucceeded = false;
        console.warn('[moduleUsage] Error actualizando user_metadata en Supabase:', updateErr);
      }
    }

    // 4. Re-leer el almacenamiento local por si el usuario abrió otro módulo mientras updateUser estaba en vuelo
    const latestLocalStats = getModuleUsageStats(resolvedKey);
    const finalLocalStats: ModuleUsageMap = { ...merged };
    let hasMidFlightIncrement = false;

    for (const [modId, latestItem] of Object.entries(latestLocalStats)) {
      const snapItem = snapshotLocalStats[modId] || { count: 0, lastOpened: 0 };
      const midFlightDelta = Math.max(0, (latestItem.count || 0) - (snapItem.count || 0));
      const mergedItem = finalLocalStats[modId] || { count: 0, lastOpened: 0, pinned: false };

      if (
        midFlightDelta > 0 ||
        (latestItem.lastOpened || 0) > (mergedItem.lastOpened || 0) ||
        (latestItem.pinnedUpdatedAt || 0) > (mergedItem.pinnedUpdatedAt || 0)
      ) {
        if (midFlightDelta > 0) hasMidFlightIncrement = true;
        const combinedHistory = Array.from(
          new Set([...(mergedItem.history || []), ...(latestItem.history || [])])
        )
          .sort((a, b) => a - b)
          .slice(-100);

        const latestPinnedWins = (latestItem.pinnedUpdatedAt || 0) > (mergedItem.pinnedUpdatedAt || 0);

        finalLocalStats[modId] = {
          ...mergedItem,
          count: Math.max((mergedItem.count || 0) + midFlightDelta, latestItem.count || 0),
          lastOpened: Math.max(mergedItem.lastOpened || 0, latestItem.lastOpened || 0),
          pinned: latestPinnedWins ? !!latestItem.pinned : !!mergedItem.pinned,
          ...((latestPinnedWins ? latestItem.pinnedUpdatedAt : mergedItem.pinnedUpdatedAt)
            ? { pinnedUpdatedAt: Math.max(mergedItem.pinnedUpdatedAt || 0, latestItem.pinnedUpdatedAt || 0) }
            : {}),
          history: combinedHistory,
        };
      }
    }

    saveModuleUsageStats(finalLocalStats, resolvedKey);

    // Solo avanzar la línea base (baseline) si el guardado en Supabase fue exitoso
    if (updateSucceeded) {
      try {
        localStorage.setItem(baselineKey, JSON.stringify(merged));
      } catch {}
    }

    dispatchUsageUpdatedEvent();

    if (hasMidFlightIncrement) {
      scheduleCloudSync(resolvedKey);
    }

    return finalLocalStats;
  } catch (err) {
    console.warn('[moduleUsage] Error al sincronizar estadísticas en la nube:', err);
    return getModuleUsageStats(initialResolvedKey);
  }
}

/**
 * Sincroniza las estadísticas locales con la nube en Supabase Auth (user_metadata).
 * Serializa peticiones concurrentes para evitar condiciones de carrera entre dispositivos/pestañas.
 */
export async function syncModuleUsageWithCloud(userKey?: string): Promise<ModuleUsageMap> {
  if (syncInFlightPromise) {
    pendingSyncAfterInFlight = true;
    if (userKey) pendingSyncUserKey = userKey;
    return syncInFlightPromise;
  }

  syncInFlightPromise = (async () => {
    try {
      let result = await performSyncModuleUsageWithCloud(userKey);
      while (pendingSyncAfterInFlight) {
        const nextKey = pendingSyncUserKey || userKey;
        pendingSyncAfterInFlight = false;
        pendingSyncUserKey = undefined;
        result = await performSyncModuleUsageWithCloud(nextKey);
      }
      return result;
    } finally {
      syncInFlightPromise = null;
    }
  })();

  return syncInFlightPromise;
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
    syncDebounceTimer = null;
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

export interface ModuleAccessLogItem {
  moduleId: string;
  timestamp: number;
  dateStr: string;   // 'YYYY-MM-DD' en hora local
  timeStr: string;   // 'HH:mm' en hora local
  hour: number;      // 0 - 23
}

/**
 * Determina si un timestamp corresponde a la fecha de hoy (en hora local del usuario)
 */
export function hasVisitedModuleToday(timestamp?: number): boolean {
  if (!timestamp || timestamp <= 0) return false;
  const visitDate = new Date(timestamp);
  const now = new Date();
  return (
    visitDate.getFullYear() === now.getFullYear() &&
    visitDate.getMonth() === now.getMonth() &&
    visitDate.getDate() === now.getDate()
  );
}

/**
 * Formatea un timestamp a hora local legible (ej: "07:30" o "Hoy 07:30")
 */
export function formatExactTime(timestamp?: number, includeDate = false): string | null {
  if (!timestamp || timestamp <= 0) return null;
  const d = new Date(timestamp);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;

  if (!includeDate) return timeStr;

  const todayStr = new Date().toISOString().slice(0, 10);
  const itemDateStr = d.toISOString().slice(0, 10);

  if (todayStr === itemDateStr) {
    return `Hoy ${timeStr}`;
  }
  return `${d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} ${timeStr}`;
}

/**
 * Retorna la cronología detallada de todas las entradas a módulos con fecha y hora exacta.
 * Si se pasa `targetDate`, filtra únicamente los accesos de ese día en hora local.
 */
export function getModuleAccessTimeline(
  userKey?: string,
  targetDate?: Date
): ModuleAccessLogItem[] {
  const stats = getModuleUsageStats(userKey);
  const items: ModuleAccessLogItem[] = [];

  let targetDateFilter: string | null = null;
  if (targetDate) {
    const y = targetDate.getFullYear();
    const m = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    targetDateFilter = `${y}-${m}-${day}`;
  }

  for (const [moduleId, modStats] of Object.entries(stats)) {
    const timestamps = Array.isArray(modStats.history) && modStats.history.length > 0
      ? modStats.history
      : (modStats.lastOpened ? [modStats.lastOpened] : []);

    for (const ts of timestamps) {
      const d = new Date(ts);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${day}`;

      if (targetDateFilter && dateStr !== targetDateFilter) {
        continue;
      }

      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');

      items.push({
        moduleId,
        timestamp: ts,
        dateStr,
        timeStr: `${hours}:${minutes}`,
        hour: d.getHours(),
      });
    }
  }

  return items.sort((a, b) => a.timestamp - b.timestamp);
}

