import { supabase } from '../../../lib/supabase';
import { Note, ChecklistItem, NoteColorKey } from '../types/note.types';

const STORAGE_PREFIX = 'pt_notes_v1_';

function getStorageKey(userId: string): string {
  return `${STORAGE_PREFIX}${userId || 'local'}`;
}

export function generateId(prefix = 'nt'): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function getCachedNotes(userId: string): Note[] {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('[NotesService] Error leyendo caché local:', err);
    return [];
  }
}

export function setCachedNotes(userId: string, notes: Note[]): void {
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(notes));
  } catch (err) {
    console.warn('[NotesService] Error guardando caché local:', err);
  }
}

/**
 * Obtiene todas las notas del usuario (con fallback local)
 */
export async function fetchNotes(userId: string): Promise<Note[]> {
  const cached = getCachedNotes(userId);

  try {
    const { data, error } = await supabase
      .from('user_notes')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (!error && data) {
      const mappedNotes: Note[] = data.map((row: any) => ({
        id: row.id,
        user_id: row.user_id,
        title: row.title || '',
        content: row.content || '',
        is_checklist: Boolean(row.is_checklist),
        checklist_items: Array.isArray(row.checklist_items) ? row.checklist_items : [],
        color: (row.color || 'default') as NoteColorKey,
        is_pinned: Boolean(row.is_pinned),
        is_archived: Boolean(row.is_archived),
        is_trashed: Boolean(row.is_trashed),
        tags: Array.isArray(row.tags) ? row.tags : [],
        reminder: row.reminder || null,
        created_at: row.created_at || new Date().toISOString(),
        updated_at: row.updated_at || new Date().toISOString(),
      }));

      setCachedNotes(userId, mappedNotes);
      return mappedNotes;
    }
  } catch (err) {
    console.warn('[NotesService] Supabase no disponible o tabla user_notes en preparación. Usando local storage:', err);
  }

  // Si no hay notas aún en caché ni en Supabase, podemos suministrar un par de notas de bienvenida tipo Keep
  if (cached.length === 0) {
    const welcomeNotes: Note[] = [
      {
        id: generateId(),
        user_id: userId,
        title: '¡Bienvenido a Notas & Keep! 📌',
        content: 'Este módulo funciona como Google Keep:\n• Notas rápidas con colores\n• Fijar tus notas importantes arriba\n• Listas de tareas tachables\n• Búsqueda instantánea y etiquetas',
        is_checklist: false,
        checklist_items: [],
        color: 'sand',
        is_pinned: true,
        is_archived: false,
        is_trashed: false,
        tags: ['bienvenida', 'tutorial'],
        reminder: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: generateId(),
        user_id: userId,
        title: 'Lista de pendientes de hoy ✅',
        content: '',
        is_checklist: true,
        checklist_items: [
          { id: generateId('item'), text: 'Probar el cambio de color de las notas', completed: true },
          { id: generateId('item'), text: 'Fijar una nota importante con la chincheta', completed: false },
          { id: generateId('item'), text: 'Crear una etiqueta para clasificar notas', completed: false },
          { id: generateId('item'), text: 'Organizar mis tareas diarias', completed: false },
        ],
        color: 'mint',
        is_pinned: false,
        is_archived: false,
        is_trashed: false,
        tags: ['tareas', 'hoy'],
        reminder: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    setCachedNotes(userId, welcomeNotes);
    return welcomeNotes;
  }

  return cached;
}

/**
 * Guarda o actualiza una nota con sincronización optimista
 */
export async function saveNote(
  userId: string,
  noteData: Omit<Note, 'id' | 'user_id' | 'created_at' | 'updated_at'> & { id?: string }
): Promise<Note> {
  const now = new Date().toISOString();
  const id = noteData.id || generateId();

  const noteToSave: Note = {
    id,
    user_id: userId,
    title: noteData.title || '',
    content: noteData.content || '',
    is_checklist: Boolean(noteData.is_checklist),
    checklist_items: noteData.checklist_items || [],
    color: noteData.color || 'default',
    is_pinned: Boolean(noteData.is_pinned),
    is_archived: Boolean(noteData.is_archived),
    is_trashed: Boolean(noteData.is_trashed),
    tags: noteData.tags || [],
    reminder: noteData.reminder || null,
    created_at: now,
    updated_at: now,
  };

  // 1. Guardado optimista en caché local
  const current = getCachedNotes(userId);
  const exists = current.findIndex((n) => n.id === id);
  let updatedList: Note[];
  if (exists >= 0) {
    noteToSave.created_at = current[exists].created_at;
    updatedList = [...current];
    updatedList[exists] = noteToSave;
  } else {
    updatedList = [noteToSave, ...current];
  }
  setCachedNotes(userId, updatedList);

  // 2. Sincronización asíncrona con Supabase
  try {
    const payload = {
      id: noteToSave.id,
      user_id: userId,
      title: noteToSave.title,
      content: noteToSave.content,
      is_checklist: noteToSave.is_checklist,
      checklist_items: noteToSave.checklist_items,
      color: noteToSave.color,
      is_pinned: noteToSave.is_pinned,
      is_archived: noteToSave.is_archived,
      is_trashed: noteToSave.is_trashed,
      tags: noteToSave.tags,
      reminder: noteToSave.reminder,
      updated_at: noteToSave.updated_at,
    };

    await supabase.from('user_notes').upsert(payload, { onConflict: 'id' });
  } catch (err) {
    console.warn('[NotesService] Sincronización remota postergada:', err);
  }

  return noteToSave;
}

/**
 * Actualiza propiedades específicas de una nota
 */
export async function updateNotePartial(
  userId: string,
  noteId: string,
  partial: Partial<Note>
): Promise<Note | null> {
  const current = getCachedNotes(userId);
  const index = current.findIndex((n) => n.id === noteId);
  if (index === -1) return null;

  const updated: Note = {
    ...current[index],
    ...partial,
    updated_at: new Date().toISOString(),
  };

  current[index] = updated;
  setCachedNotes(userId, current);

  try {
    await supabase
      .from('user_notes')
      .update({
        ...partial,
        updated_at: updated.updated_at,
      })
      .eq('id', noteId)
      .eq('user_id', userId);
  } catch (err) {
    console.warn('[NotesService] Error actualizando en Supabase:', err);
  }

  return updated;
}

/**
 * Elimina una nota permanentemente
 */
export async function deleteNotePermanent(userId: string, noteId: string): Promise<void> {
  const current = getCachedNotes(userId);
  const filtered = current.filter((n) => n.id !== noteId);
  setCachedNotes(userId, filtered);

  try {
    await supabase.from('user_notes').delete().eq('id', noteId).eq('user_id', userId);
  } catch (err) {
    console.warn('[NotesService] Error eliminando en Supabase:', err);
  }
}

/**
 * Vacía la papelera por completo
 */
export async function emptyTrashNotes(userId: string): Promise<void> {
  const current = getCachedNotes(userId);
  const remaining = current.filter((n) => !n.is_trashed);
  setCachedNotes(userId, remaining);

  try {
    await supabase.from('user_notes').delete().eq('is_trashed', true).eq('user_id', userId);
  } catch (err) {
    console.warn('[NotesService] Error vaciando papelera en Supabase:', err);
  }
}
