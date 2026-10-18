import { supabase } from './supabase';
import { PirkeiAvotBookmark, PirkeiAvotProgress } from '../../../packages/shared/src/types';
import { PIRKEI_AVOT_DATA } from '../../../packages/shared/src/data/pirkeiAvotData';

const LAST_PROMPT_KEY = 'last_pirkei_avot_prompt_time';
const BOOKMARK_KEY_PREFIX = 'pirkei_avot_bookmark_';
const PROGRESS_KEY_PREFIX = 'pirkei_avot_progress_';
const DAILY_READ_KEY_PREFIX = 'pirkei_avot_daily_read_';
const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

/**
 * Obtiene la clave de fecha local (YYYY-MM-DD)
 */
export function getLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Resuelve de forma unificada el identificador de usuario para evitar
 * discrepancias entre UUID de Supabase, correo electrónico o estado de sesión local.
 */
export function resolvePirkeiAvotUserId(userId?: string): string {
  if (userId && userId.trim() !== '') return userId.trim();
  if (typeof window === 'undefined') return 'guest';
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          const id = parsed?.user?.id || parsed?.user?.email;
          if (id) return id;
        }
      }
    }
  } catch {}
  return 'guest';
}

/**
 * Obtiene el marcador actual de lectura (dónde quedó el usuario).
 * Si no existe marcador previo, retorna por defecto Capítulo 1, Mishná 1.
 * Soporta migración transparente desde claves previas (correo o invitado).
 */
export function getStoredPirkeiAvotBookmark(userId?: string): PirkeiAvotBookmark {
  const defaultBookmark: PirkeiAvotBookmark = {
    chapter: 1,
    mishna: 1,
    updated_at: new Date().toISOString(),
    completed: false,
  };

  if (typeof window === 'undefined') return defaultBookmark;

  const resolved = resolvePirkeiAvotUserId(userId);
  const primaryKey = `${BOOKMARK_KEY_PREFIX}${resolved}`;
  let stored = localStorage.getItem(primaryKey);

  // Fallback / Migración si se guardó con correo o con 'guest'
  if (!stored && userId && userId !== resolved) {
    stored = localStorage.getItem(`${BOOKMARK_KEY_PREFIX}${userId}`);
    if (stored) {
      localStorage.setItem(primaryKey, stored);
    }
  }
  if (!stored && resolved !== 'guest') {
    stored = localStorage.getItem(`${BOOKMARK_KEY_PREFIX}guest`);
  }

  if (!stored) return defaultBookmark;

  try {
    const parsed = JSON.parse(stored) as PirkeiAvotBookmark;
    if (parsed.chapter && parsed.mishna) {
      return parsed;
    }
  } catch (e) {
    console.warn('Error leyendo marcador de Pirkei Avot:', e);
  }

  return defaultBookmark;
}

/**
 * Verifica si el usuario ya ha leído Pirkei Avot el día de hoy
 */
export function hasReadPirkeiAvotToday(userId?: string): boolean {
  if (typeof window === 'undefined') return false;

  const resolved = resolvePirkeiAvotUserId(userId);
  const dateKey = getLocalDateKey();

  // 1. Bandera explícita en localStorage de hoy (comprobando ID resuelto y alternativo)
  if (localStorage.getItem(`${DAILY_READ_KEY_PREFIX}${dateKey}_${resolved}`) === 'true') {
    return true;
  }
  if (userId && userId !== resolved && localStorage.getItem(`${DAILY_READ_KEY_PREFIX}${dateKey}_${userId}`) === 'true') {
    return true;
  }
  if (localStorage.getItem(`${DAILY_READ_KEY_PREFIX}${dateKey}_guest`) === 'true') {
    return true;
  }

  // 2. Comprobar timestamp en el progreso de capítulos
  const progressMap = getStoredPirkeiAvotProgress(resolved);
  for (const prog of Object.values(progressMap)) {
    if (prog.last_read_at) {
      try {
        const readDateKey = getLocalDateKey(new Date(prog.last_read_at));
        if (readDateKey === dateKey) {
          localStorage.setItem(`${DAILY_READ_KEY_PREFIX}${dateKey}_${resolved}`, 'true');
          return true;
        }
      } catch {}
    }

    // Comprobar lecturas individuales de mishnayot hoy
    if (prog.mishna_last_read) {
      for (const mishnaTimestamp of Object.values(prog.mishna_last_read)) {
        if (mishnaTimestamp) {
          try {
            if (getLocalDateKey(new Date(mishnaTimestamp)) === dateKey) {
              localStorage.setItem(`${DAILY_READ_KEY_PREFIX}${dateKey}_${resolved}`, 'true');
              return true;
            }
          } catch {}
        }
      }
    }
  }

  // 3. Comprobar si el marcador fue actualizado hoy por lectura activa
  const bookmark = getStoredPirkeiAvotBookmark(resolved);
  if (bookmark.updated_at) {
    try {
      const bmDateKey = getLocalDateKey(new Date(bookmark.updated_at));
      if (bmDateKey === dateKey && (bookmark.chapter > 1 || bookmark.mishna > 1 || bookmark.completed)) {
        return true;
      }
    } catch {}
  }

  return false;
}

/**
 * Guarda la posición de lectura (capítulo y mishná) tanto localmente como en Supabase.
 */
export async function savePirkeiAvotBookmark(
  bookmark: PirkeiAvotBookmark,
  userId?: string
): Promise<void> {
  if (typeof window === 'undefined') return;

  const resolved = resolvePirkeiAvotUserId(userId);
  const primaryKey = `${BOOKMARK_KEY_PREFIX}${resolved}`;
  localStorage.setItem(primaryKey, JSON.stringify(bookmark));
  if (userId && userId !== resolved) {
    localStorage.setItem(`${BOOKMARK_KEY_PREFIX}${userId}`, JSON.stringify(bookmark));
  }

  // Registrar lectura de hoy
  const dateKey = getLocalDateKey();
  localStorage.setItem(`${DAILY_READ_KEY_PREFIX}${dateKey}_${resolved}`, 'true');

  const cloudUid = resolved !== 'guest' ? resolved : userId;
  if (cloudUid && cloudUid !== 'guest') {
    try {
      const { error } = await supabase.from('pirkei_avot_bookmarks').upsert({
        user_id: cloudUid,
        chapter: bookmark.chapter,
        mishna: bookmark.mishna,
        completed: bookmark.completed || false,
        updated_at: bookmark.updated_at || new Date().toISOString(),
      });
      if (error) {
        console.warn('Nota: bookmark guardado localmente (Supabase:', error.message, ')');
      }
    } catch (err) {
      console.warn('Nota: bookmark guardado localmente (Supabase:', err, ')');
    }
  }

  // Notificar al sistema para actualizar UI en tiempo real
  window.dispatchEvent(new CustomEvent('pirkei_avot_updated', { detail: { bookmark } }));
}

/**
 * Obtiene el mapa de progreso de capítulos leídos desde almacenamiento local.
 * Soporta migración transparente si existían datos bajo correo o 'guest'.
 */
export function getStoredPirkeiAvotProgress(userId?: string): Record<number, PirkeiAvotProgress> {
  if (typeof window === 'undefined') return {};
  const resolved = resolvePirkeiAvotUserId(userId);
  const primaryKey = `${PROGRESS_KEY_PREFIX}${resolved}`;
  let stored = localStorage.getItem(primaryKey);

  if (!stored && userId && userId !== resolved) {
    stored = localStorage.getItem(`${PROGRESS_KEY_PREFIX}${userId}`);
    if (stored) {
      localStorage.setItem(primaryKey, stored);
    }
  }
  if (!stored && resolved !== 'guest') {
    stored = localStorage.getItem(`${PROGRESS_KEY_PREFIX}guest`);
  }

  if (!stored) return {};
  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

/**
 * Estadísticas de lectura para una Mishná individual
 */
export interface MishnaReadingStats {
  count: number;
  lastReadAt?: string;
  wasReadLastYear: boolean;
  wasReadThisYear: boolean;
  lastReadYear?: number;
  isCompleted: boolean;
}

/**
 * Obtiene las estadísticas de lectura acumulada y anual de una mishná
 */
export function getMishnaStats(
  progress: PirkeiAvotProgress | undefined,
  mishnaNumber: number
): MishnaReadingStats {
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  if (!progress) {
    return {
      count: 0,
      wasReadLastYear: false,
      wasReadThisYear: false,
      isCompleted: false,
    };
  }

  const isCompleted = progress.completed_mishnayot?.includes(mishnaNumber) || false;
  const count = progress.mishna_counts?.[mishnaNumber] || (isCompleted ? 1 : 0);
  const lastReadAt = progress.mishna_last_read?.[mishnaNumber] || (isCompleted ? progress.last_read_at : undefined);

  let lastReadYear: number | undefined = undefined;
  if (lastReadAt) {
    try {
      lastReadYear = new Date(lastReadAt).getFullYear();
    } catch {}
  }

  const years = Object.keys(progress.years_history || {}).filter((yr) =>
    progress.years_history?.[yr]?.includes(mishnaNumber)
  );

  const wasReadThisYear = years.includes(String(currentYear)) || lastReadYear === currentYear;
  const wasReadLastYear = years.includes(String(lastYear)) || lastReadYear === lastYear;

  return {
    count,
    lastReadAt,
    wasReadLastYear,
    wasReadThisYear,
    lastReadYear,
    isCompleted,
  };
}

/**
 * Guarda el progreso de una mishná o capítulo con conteo acumulado y por año
 */
export async function savePirkeiAvotProgress(
  chapterNum: number,
  completedMishnayot: number[],
  userId?: string,
  mishnaJustRead?: number
): Promise<Record<number, PirkeiAvotProgress>> {
  const currentMap = getStoredPirkeiAvotProgress(userId);
  const chapterData = PIRKEI_AVOT_DATA.find((c) => c.chapter === chapterNum);
  const totalMishnayot = chapterData ? chapterData.mishnayot.length : 1;
  const isCompleted = completedMishnayot.length >= totalMishnayot;
  const now = new Date();
  const nowISO = now.toISOString();
  const currentYearStr = String(now.getFullYear());
  const dateKey = getLocalDateKey(now);

  const prev = currentMap[chapterNum] || {
    chapter_number: chapterNum,
    completed_mishnayot: [],
    completed_count: 0,
    is_completed: false,
    mishna_counts: {},
    mishna_last_read: {},
    years_history: {},
    cycle: 1,
  };

  const mishnaCounts = { ...(prev.mishna_counts || {}) };
  const mishnaLastRead = { ...(prev.mishna_last_read || {}) };
  const yearsHistory = { ...(prev.years_history || {}) };
  const currentYearList = new Set(yearsHistory[currentYearStr] || []);

  if (mishnaJustRead !== undefined) {
    mishnaCounts[mishnaJustRead] = (mishnaCounts[mishnaJustRead] || 0) + 1;
    mishnaLastRead[mishnaJustRead] = nowISO;
    currentYearList.add(mishnaJustRead);
  } else {
    completedMishnayot.forEach((m) => {
      mishnaCounts[m] = (mishnaCounts[m] || 0) + 1;
      mishnaLastRead[m] = nowISO;
      currentYearList.add(m);
    });
  }

  yearsHistory[currentYearStr] = Array.from(currentYearList).sort((a, b) => a - b);

  const updated: PirkeiAvotProgress = {
    chapter_number: chapterNum,
    completed_mishnayot: Array.from(new Set(completedMishnayot)).sort((a, b) => a - b),
    completed_count: isCompleted && !prev.is_completed ? prev.completed_count + 1 : prev.completed_count,
    is_completed: isCompleted,
    last_read_at: nowISO,
    mishna_counts: mishnaCounts,
    mishna_last_read: mishnaLastRead,
    years_history: yearsHistory,
    cycle: prev.cycle || 1,
  };

  const resolved = resolvePirkeiAvotUserId(userId);
  const newMap = { ...currentMap, [chapterNum]: updated };
  if (typeof window !== 'undefined') {
    const primaryKey = `${PROGRESS_KEY_PREFIX}${resolved}`;
    localStorage.setItem(primaryKey, JSON.stringify(newMap));
    if (userId && userId !== resolved) {
      localStorage.setItem(`${PROGRESS_KEY_PREFIX}${userId}`, JSON.stringify(newMap));
    }
    localStorage.setItem(`${DAILY_READ_KEY_PREFIX}${dateKey}_${resolved}`, 'true');
  }

  const cloudUid = resolved !== 'guest' ? resolved : userId;
  if (cloudUid && cloudUid !== 'guest') {
    try {
      const { error } = await supabase.from('pirkei_avot_progress').upsert({
        user_id: cloudUid,
        chapter_number: chapterNum,
        completed_mishnayot: updated.completed_mishnayot,
        completed_count: updated.completed_count,
        is_completed: updated.is_completed,
        mishna_counts: updated.mishna_counts,
        mishna_last_read: updated.mishna_last_read,
        years_history: updated.years_history,
        cycle: updated.cycle,
        last_read_at: nowISO,
      });
      if (error) {
        console.warn('Nota: progreso guardado localmente (Supabase:', error.message, ')');
      }
    } catch (e) {
      console.warn('Nota: Progreso de Pirkei Avot guardado localmente');
    }
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('pirkei_avot_updated', { detail: { progress: newMap } }));
  }

  return newMap;
}

/**
 * Mezcla inteligentemente el progreso de capítulos y mishnayot entre local y remoto.
 * Une las mishnayot leídas en ambos dispositivos (Laptop + Celular), preservando conteos y fechas.
 */
export function mergePirkeiAvotProgressMaps(
  localMap: Record<number, PirkeiAvotProgress>,
  remoteMap: Record<number, PirkeiAvotProgress>
): {
  merged: Record<number, PirkeiAvotProgress>;
  chaptersToUpload: PirkeiAvotProgress[];
} {
  const merged: Record<number, PirkeiAvotProgress> = {};
  const chaptersToUpload: PirkeiAvotProgress[] = [];

  for (let ch = 1; ch <= 6; ch++) {
    const local = localMap[ch];
    const remote = remoteMap[ch];

    if (!local && !remote) continue;

    if (!local && remote) {
      merged[ch] = { ...remote };
      continue;
    }

    if (local && !remote) {
      merged[ch] = { ...local };
      chaptersToUpload.push(local);
      continue;
    }

    if (local && remote) {
      const chapterDef = PIRKEI_AVOT_DATA.find((c) => c.chapter === ch);
      const totalMishnayot = chapterDef ? chapterDef.mishnayot.length : 1;

      // Unión de mishnayot completadas sin duplicados
      const completedSet = new Set([
        ...(local.completed_mishnayot || []),
        ...(remote.completed_mishnayot || []),
      ]);
      const mergedCompleted = Array.from(completedSet).sort((a, b) => a - b);
      const isCompleted =
        mergedCompleted.length >= totalMishnayot ||
        local.is_completed ||
        remote.is_completed ||
        false;

      // Combinar conteos individuales de mishnayot (tomar el máximo)
      const mishnaCounts: Record<number, number> = {};
      const allCountKeys = new Set([
        ...Object.keys(local.mishna_counts || {}).map(Number),
        ...Object.keys(remote.mishna_counts || {}).map(Number),
        ...mergedCompleted,
      ]);

      allCountKeys.forEach((m) => {
        const lCount = local.mishna_counts?.[m] || 0;
        const rCount = remote.mishna_counts?.[m] || 0;
        const baseCount = mergedCompleted.includes(m) ? 1 : 0;
        mishnaCounts[m] = Math.max(lCount, rCount, baseCount);
      });

      // Combinar última fecha de lectura por mishná (la más reciente)
      const mishnaLastRead: Record<number, string> = {};
      const allReadKeys = new Set([
        ...Object.keys(local.mishna_last_read || {}).map(Number),
        ...Object.keys(remote.mishna_last_read || {}).map(Number),
      ]);

      allReadKeys.forEach((m) => {
        const lDate = local.mishna_last_read?.[m];
        const rDate = remote.mishna_last_read?.[m];
        if (lDate && rDate) {
          mishnaLastRead[m] =
            new Date(rDate).getTime() >= new Date(lDate).getTime() ? rDate : lDate;
        } else {
          mishnaLastRead[m] = (rDate || lDate)!;
        }
      });

      // Combinar historial de años
      const yearsHistory: Record<string, number[]> = {};
      const allYears = new Set([
        ...Object.keys(local.years_history || {}),
        ...Object.keys(remote.years_history || {}),
      ]);

      allYears.forEach((yr) => {
        const lList = local.years_history?.[yr] || [];
        const rList = remote.years_history?.[yr] || [];
        yearsHistory[yr] = Array.from(new Set([...lList, ...rList])).sort((a, b) => a - b);
      });

      // Fecha más reciente de lectura de capítulo
      const lTime = local.last_read_at ? new Date(local.last_read_at).getTime() : 0;
      const rTime = remote.last_read_at ? new Date(remote.last_read_at).getTime() : 0;
      const newestLastRead = rTime >= lTime ? (remote.last_read_at || local.last_read_at) : (local.last_read_at || remote.last_read_at);

      const mergedChapter: PirkeiAvotProgress = {
        chapter_number: ch,
        completed_mishnayot: mergedCompleted,
        completed_count: Math.max(local.completed_count || 0, remote.completed_count || 0, isCompleted ? 1 : 0),
        is_completed: isCompleted,
        mishna_counts: mishnaCounts,
        mishna_last_read: mishnaLastRead,
        years_history: yearsHistory,
        cycle: Math.max(local.cycle || 1, remote.cycle || 1),
        last_read_at: newestLastRead,
      };

      merged[ch] = mergedChapter;

      // Determinar si la nube necesita actualizarse con este merge
      const remoteCompletedSet = new Set(remote.completed_mishnayot || []);
      const hasNewCompleted = mergedCompleted.some((m) => !remoteCompletedSet.has(m));
      const hasNewCompletionStatus = isCompleted !== remote.is_completed;
      const isLocalNewer = lTime > rTime;

      if (hasNewCompleted || hasNewCompletionStatus || isLocalNewer) {
        chaptersToUpload.push(mergedChapter);
      }
    }
  }

  return { merged, chaptersToUpload };
}

/**
 * Sincroniza bidireccionalmente el progreso y marcador de Pirkei Avot con Supabase.
 * Actualiza y fusiona (merge) inmediatamente para que móvil y web compartan la misma información sin discrepancias.
 */
export async function syncPirkeiAvotWithCloud(userId?: string): Promise<{
  bookmark: PirkeiAvotBookmark;
  progressMap: Record<number, PirkeiAvotProgress>;
  hasReadToday: boolean;
}> {
  const resolved = resolvePirkeiAvotUserId(userId);
  const localBm = getStoredPirkeiAvotBookmark(resolved);
  const localProg = getStoredPirkeiAvotProgress(resolved);

  const cloudUid = resolved !== 'guest' ? resolved : (userId && userId !== 'guest' ? userId : undefined);

  if (!cloudUid || typeof window === 'undefined') {
    return {
      bookmark: localBm,
      progressMap: localProg,
      hasReadToday: hasReadPirkeiAvotToday(resolved),
    };
  }

  let finalBm = localBm;
  let finalProg = { ...localProg };

  try {
    // 1. Sincronizar y unificar marcador (bookmark)
    const { data: remoteBookmark } = await supabase
      .from('pirkei_avot_bookmarks')
      .select('*')
      .eq('user_id', cloudUid)
      .maybeSingle();

    if (remoteBookmark) {
      const remoteTime = new Date(remoteBookmark.updated_at || 0).getTime();
      const localTime = new Date(localBm.updated_at || 0).getTime();
      const isLocalDefault = localBm.chapter === 1 && localBm.mishna === 1 && !localBm.completed;

      const remoteIsMoreAdvanced =
        remoteBookmark.chapter > localBm.chapter ||
        (remoteBookmark.chapter === localBm.chapter && remoteBookmark.mishna > localBm.mishna);

      if (remoteTime >= localTime || isLocalDefault || remoteIsMoreAdvanced) {
        finalBm = {
          chapter: remoteBookmark.chapter,
          mishna: remoteBookmark.mishna,
          completed: remoteBookmark.completed || false,
          updated_at: remoteBookmark.updated_at,
        };
        localStorage.setItem(`${BOOKMARK_KEY_PREFIX}${resolved}`, JSON.stringify(finalBm));
      } else if (localTime > remoteTime && !isLocalDefault) {
        // El local es más reciente / avanzado, subir a la nube
        await supabase.from('pirkei_avot_bookmarks').upsert({
          user_id: cloudUid,
          chapter: localBm.chapter,
          mishna: localBm.mishna,
          completed: localBm.completed || false,
          updated_at: localBm.updated_at,
        });
      }
    } else if (localBm.chapter > 1 || localBm.mishna > 1 || localBm.completed) {
      // No existe en la nube aún, subir local
      await supabase.from('pirkei_avot_bookmarks').upsert({
        user_id: cloudUid,
        chapter: localBm.chapter,
        mishna: localBm.mishna,
        completed: localBm.completed || false,
        updated_at: localBm.updated_at,
      });
    }

    // 2. Sincronizar y MEZCLAR progreso de capítulos
    const { data: remoteProgress } = await supabase
      .from('pirkei_avot_progress')
      .select('*')
      .eq('user_id', cloudUid);

    const remoteMap: Record<number, PirkeiAvotProgress> = {};
    if (remoteProgress && remoteProgress.length > 0) {
      remoteProgress.forEach((item: any) => {
        remoteMap[item.chapter_number] = {
          chapter_number: item.chapter_number,
          completed_mishnayot: item.completed_mishnayot || [],
          completed_count: item.completed_count || 0,
          is_completed: item.is_completed || false,
          last_read_at: item.last_read_at,
          mishna_counts: item.mishna_counts || {},
          mishna_last_read: item.mishna_last_read || {},
          years_history: item.years_history || {},
          cycle: item.cycle || 1,
        };
      });
    }

    // Fusión bidireccional (merge de leídos en laptop y celular)
    const { merged, chaptersToUpload } = mergePirkeiAvotProgressMaps(localProg, remoteMap);
    finalProg = merged;

    // Guardar progreso combinado localmente
    localStorage.setItem(`${PROGRESS_KEY_PREFIX}${resolved}`, JSON.stringify(finalProg));

    // Subir a Supabase los capítulos con novedades combinadas
    if (chaptersToUpload.length > 0) {
      for (const chap of chaptersToUpload) {
        try {
          await supabase.from('pirkei_avot_progress').upsert({
            user_id: cloudUid,
            chapter_number: chap.chapter_number,
            completed_mishnayot: chap.completed_mishnayot,
            completed_count: chap.completed_count,
            is_completed: chap.is_completed,
            mishna_counts: chap.mishna_counts,
            mishna_last_read: chap.mishna_last_read,
            years_history: chap.years_history,
            cycle: chap.cycle,
            last_read_at: chap.last_read_at,
          });
        } catch (err) {
          console.warn('[PirkeiAvot] Error subiendo capítulo combinado a Supabase:', err);
        }
      }
    }

    // 3. Registrar bandera de hoy si cualquier dispositivo leyó hoy
    const dateKey = getLocalDateKey();
    let readTodayFound = false;

    for (const prog of Object.values(finalProg)) {
      if (prog.last_read_at) {
        try {
          if (getLocalDateKey(new Date(prog.last_read_at)) === dateKey) {
            readTodayFound = true;
            break;
          }
        } catch {}
      }
      if (prog.mishna_last_read) {
        for (const t of Object.values(prog.mishna_last_read)) {
          if (t) {
            try {
              if (getLocalDateKey(new Date(t)) === dateKey) {
                readTodayFound = true;
                break;
              }
            } catch {}
          }
        }
        if (readTodayFound) break;
      }
    }

    if (!readTodayFound && finalBm.updated_at) {
      try {
        if (getLocalDateKey(new Date(finalBm.updated_at)) === dateKey && (finalBm.chapter > 1 || finalBm.mishna > 1 || finalBm.completed)) {
          readTodayFound = true;
        }
      } catch {}
    }

    if (readTodayFound) {
      localStorage.setItem(`${DAILY_READ_KEY_PREFIX}${dateKey}_${resolved}`, 'true');
    }
  } catch (err) {
    console.warn('[PirkeiAvot] Error sincronizando con Supabase:', err);
  }

  const hasRead = hasReadPirkeiAvotToday(resolved);

  window.dispatchEvent(
    new CustomEvent('pirkei_avot_updated', {
      detail: { bookmark: finalBm, progress: finalProg, hasReadToday: hasRead },
    })
  );

  return {
    bookmark: finalBm,
    progressMap: finalProg,
    hasReadToday: hasRead,
  };
}

/**
 * Verifica si la hora actual corresponde a Mediodía o Tarde (12:00 a 19:59).
 */
export function isMiddayOrAfternoon(): { inWindow: boolean; greeting: string } {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 12 && hour < 14) {
    return { inWindow: true, greeting: 'Pausa de Mediodía' };
  } else if (hour >= 14 && hour < 20) {
    return { inWindow: true, greeting: 'Reflexión de la Tarde' };
  }

  return { inWindow: false, greeting: '' };
}

/**
 * Evalúa sincrónicamente si se debe sugerir la lectura de Pirkei Avot.
 * Si ya leyó hoy, retorna shouldPrompt: false.
 */
export function shouldPromptPirkeiAvot(userId?: string): {
  shouldPrompt: boolean;
  bookmark: PirkeiAvotBookmark;
  greeting: string;
} {
  const defaultRes = {
    shouldPrompt: false,
    bookmark: getStoredPirkeiAvotBookmark(userId),
    greeting: '',
  };

  if (typeof window === 'undefined') return defaultRes;

  const { inWindow, greeting } = isMiddayOrAfternoon();
  if (!inWindow) return defaultRes;

  // Si ya leyó hoy, no interrumpir al usuario
  if (hasReadPirkeiAvotToday(userId)) {
    return defaultRes;
  }

  const lastPrompt = localStorage.getItem(LAST_PROMPT_KEY);
  if (lastPrompt) {
    const lastTime = parseInt(lastPrompt, 10);
    if (!isNaN(lastTime)) {
      const diff = Date.now() - lastTime;
      if (diff < FOUR_HOURS_MS) {
        return defaultRes; // Ya se sugirió recientemente en esta tarde
      }
    }
  }

  return {
    shouldPrompt: true,
    bookmark: getStoredPirkeiAvotBookmark(userId),
    greeting,
  };
}

/**
 * Evalúa asincrónicamente con previa sincronización en la nube si se debe sugerir Pirkei Avot.
 * Garantiza que si el usuario leyó en laptop u otro dispositivo, el celular reconozca
 * inmediatamente que ya leyó y dónde quedó.
 */
export async function shouldPromptPirkeiAvotAsync(userId?: string): Promise<{
  shouldPrompt: boolean;
  bookmark: PirkeiAvotBookmark;
  greeting: string;
}> {
  if (!userId || typeof window === 'undefined') {
    return shouldPromptPirkeiAvot(userId);
  }

  // Sincronizar primero con la nube
  const { bookmark, hasReadToday } = await syncPirkeiAvotWithCloud(userId);

  const { inWindow, greeting } = isMiddayOrAfternoon();
  if (!inWindow) {
    return { shouldPrompt: false, bookmark, greeting: '' };
  }

  // Si ya leyó hoy en cualquier dispositivo, NO molestar
  if (hasReadToday) {
    return { shouldPrompt: false, bookmark, greeting: '' };
  }

  const lastPrompt = localStorage.getItem(LAST_PROMPT_KEY);
  if (lastPrompt) {
    const lastTime = parseInt(lastPrompt, 10);
    if (!isNaN(lastTime)) {
      const diff = Date.now() - lastTime;
      if (diff < FOUR_HOURS_MS) {
        return { shouldPrompt: false, bookmark, greeting: '' };
      }
    }
  }

  return {
    shouldPrompt: true,
    bookmark,
    greeting,
  };
}

/**
 * Marca que el usuario cerró o aceptó la sugerencia para no insistir en 4 horas.
 */
export function markPirkeiAvotPromptDismissed(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LAST_PROMPT_KEY, Date.now().toString());
}
