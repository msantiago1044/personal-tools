import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Note,
  ChecklistItem,
  NoteColorKey,
  NoteTab,
  NoteLayout,
} from '../types/note.types';
import {
  fetchNotes,
  saveNote,
  updateNotePartial,
  deleteNotePermanent,
  emptyTrashNotes,
  generateId,
} from '../services/notesService';

export function useNotesData(userId: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<NoteTab>('notes');
  const [layout, setLayout] = useState<NoteLayout>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<NoteColorKey | null>(null);

  // Carga inicial
  const refreshNotes = useCallback(async () => {
    setLoading(true);
    const data = await fetchNotes(userId);
    setNotes(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refreshNotes();
  }, [refreshNotes]);

  // Colección de todas las etiquetas únicas existentes en notas no enviadas a papelera
  const allTags = useMemo(() => {
    const set = new Set<string>();
    notes.forEach((note) => {
      if (!note.is_trashed && Array.isArray(note.tags)) {
        note.tags.forEach((tag) => {
          if (tag.trim()) set.add(tag.trim().toLowerCase());
        });
      }
    });
    return Array.from(set).sort();
  }, [notes]);

  // Filtrado reactivo de notas
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      // 1. Filtro por pestaña
      if (activeTab === 'notes') {
        if (note.is_trashed || note.is_archived) return false;
      } else if (activeTab === 'archived') {
        if (note.is_trashed || !note.is_archived) return false;
      } else if (activeTab === 'trash') {
        if (!note.is_trashed) return false;
      } else if (activeTab === 'reminders') {
        if (note.is_trashed || note.is_archived || !note.reminder) return false;
      }

      // 2. Filtro por tag
      if (selectedTag) {
        const hasTag = note.tags?.some((t) => t.toLowerCase() === selectedTag.toLowerCase());
        if (!hasTag) return false;
      }

      // 3. Filtro por color
      if (selectedColor && selectedColor !== 'default') {
        if (note.color !== selectedColor) return false;
      }

      // 4. Filtro por búsqueda de texto
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = note.title.toLowerCase().includes(q);
        const inContent = note.content.toLowerCase().includes(q);
        const inItems = note.checklist_items?.some((item) =>
          item.text.toLowerCase().includes(q)
        );
        const inTags = note.tags?.some((t) => t.toLowerCase().includes(q));

        if (!inTitle && !inContent && !inItems && !inTags) return false;
      }

      return true;
    });
  }, [notes, activeTab, selectedTag, selectedColor, searchQuery]);

  // División entre fijadas (pinned) y otras notas (para la pestaña principal)
  const { pinnedNotes, otherNotes } = useMemo(() => {
    if (activeTab !== 'notes') {
      return { pinnedNotes: [], otherNotes: filteredNotes };
    }
    const pinned: Note[] = [];
    const other: Note[] = [];
    filteredNotes.forEach((n) => {
      if (n.is_pinned) pinned.push(n);
      else other.push(n);
    });
    return { pinnedNotes: pinned, otherNotes: other };
  }, [filteredNotes, activeTab]);

  // Acciones
  const handleCreateNote = async (
    noteData: Omit<Note, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => {
    const created = await saveNote(userId, noteData);
    setNotes((prev) => [created, ...prev]);
    return created;
  };

  const handleUpdateNote = async (
    noteId: string,
    updates: Partial<Note>
  ) => {
    // Actualización optimista local
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, ...updates, updated_at: new Date().toISOString() } : n))
    );
    await updateNotePartial(userId, noteId, updates);
  };

  const handleTogglePin = async (noteId: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;
    const newPinned = !note.is_pinned;
    // Si se fija, desarchivar si estaba archivada
    await handleUpdateNote(noteId, { is_pinned: newPinned, is_archived: false });
  };

  const handleToggleArchive = async (noteId: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;
    const newArchived = !note.is_archived;
    // Si se archiva, quitar chincheta
    await handleUpdateNote(noteId, {
      is_archived: newArchived,
      is_pinned: newArchived ? false : note.is_pinned,
    });
  };

  const handleMoveToTrash = async (noteId: string) => {
    await handleUpdateNote(noteId, {
      is_trashed: true,
      is_pinned: false,
    });
  };

  const handleRestoreFromTrash = async (noteId: string) => {
    await handleUpdateNote(noteId, {
      is_trashed: false,
    });
  };

  const handleDeletePermanent = async (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    await deleteNotePermanent(userId, noteId);
  };

  const handleEmptyTrash = async () => {
    setNotes((prev) => prev.filter((n) => !n.is_trashed));
    await emptyTrashNotes(userId);
  };

  const handleToggleChecklistItem = async (noteId: string, itemId: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;
    const updatedItems = note.checklist_items.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    await handleUpdateNote(noteId, { checklist_items: updatedItems });
  };

  const handleSetNoteColor = async (noteId: string, color: NoteColorKey) => {
    await handleUpdateNote(noteId, { color });
  };

  const handleDuplicateNote = async (noteId: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;
    const duplicatedData: Omit<Note, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
      title: note.title ? `${note.title} (Copia)` : 'Copia',
      content: note.content,
      is_checklist: note.is_checklist,
      checklist_items: note.checklist_items.map((item) => ({ ...item, id: generateId('item') })),
      color: note.color,
      is_pinned: false,
      is_archived: false,
      is_trashed: false,
      tags: [...note.tags],
      reminder: null,
    };
    await handleCreateNote(duplicatedData);
  };

  return {
    notes,
    loading,
    activeTab,
    setActiveTab,
    layout,
    setLayout,
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    selectedColor,
    setSelectedColor,
    allTags,
    pinnedNotes,
    otherNotes,
    filteredNotes,
    refreshNotes,
    handleCreateNote,
    handleUpdateNote,
    handleTogglePin,
    handleToggleArchive,
    handleMoveToTrash,
    handleRestoreFromTrash,
    handleDeletePermanent,
    handleEmptyTrash,
    handleToggleChecklistItem,
    handleSetNoteColor,
    handleDuplicateNote,
  };
}
