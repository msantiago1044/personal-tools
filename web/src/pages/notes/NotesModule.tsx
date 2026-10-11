import React, { useState } from 'react';
import { ModuleProps } from '../../modules/moduleRegistry';
import { ThemeMode, getStoredTheme, applyTheme } from '../../lib/theme';
import { useNotesData } from './hooks/useNotesData';
import { Note } from './types/note.types';
import { NotesHeader } from './components/NotesHeader';
import { QuickNoteCreator } from './components/QuickNoteCreator';
import { NoteCard } from './components/NoteCard';
import { NoteEditorModal } from './components/NoteEditorModal';
import { StickyNote, Archive, Trash2, Pin } from 'lucide-react';

export const NotesModule: React.FC<ModuleProps> = ({ user, onBackToHub }) => {
  const userId = user?.id || 'local_user';
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme());
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const {
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
  } = useNotesData(userId);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const trashedCount = notes.filter((n) => n.is_trashed).length;

  const renderGridOrList = (items: Note[]) => {
    const layoutClass =
      layout === 'grid'
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start'
        : 'max-w-2xl mx-auto flex flex-col gap-3';

    return (
      <div className={layoutClass}>
        {items.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onClick={() => setEditingNote(note)}
            onTogglePin={handleTogglePin}
            onToggleArchive={handleToggleArchive}
            onMoveToTrash={handleMoveToTrash}
            onRestore={handleRestoreFromTrash}
            onDeletePermanent={handleDeletePermanent}
            onColorChange={handleSetNoteColor}
            onToggleChecklistItem={handleToggleChecklistItem}
            onDuplicate={handleDuplicateNote}
            isTrashView={activeTab === 'trash'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Cabecera Interactiva */}
      <NotesHeader
        onBackToHub={onBackToHub}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        layout={layout}
        onLayoutChange={setLayout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        allTags={allTags}
        selectedTag={selectedTag}
        onTagSelect={setSelectedTag}
        selectedColor={selectedColor}
        onColorSelect={setSelectedColor}
        theme={theme}
        onThemeChange={handleThemeChange}
        onEmptyTrash={handleEmptyTrash}
        trashCount={trashedCount}
      />

      {/* Contenido Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 pb-20">
        {/* Barra superior de creación rápida (solo en pestaña notas) */}
        {activeTab === 'notes' && (
          <QuickNoteCreator
            onSave={handleCreateNote}
            availableTags={allTags}
          />
        )}

        {/* Estado de carga */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-xs">Sincronizando notas...</span>
          </div>
        ) : filteredNotes.length === 0 ? (
          /* Estado vacío contextual */
          <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-2xl mb-4 border border-slate-200 dark:border-slate-800">
              {activeTab === 'notes' ? (
                <StickyNote className="w-8 h-8 text-slate-400" />
              ) : activeTab === 'archived' ? (
                <Archive className="w-8 h-8 text-slate-400" />
              ) : (
                <Trash2 className="w-8 h-8 text-slate-400" />
              )}
            </div>
            <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm sm:text-base">
              {activeTab === 'notes'
                ? searchQuery || selectedTag || selectedColor
                  ? 'No se encontraron notas con estos filtros'
                  : 'Aún no tienes notas. ¡Crea tu primera nota arriba!'
                : activeTab === 'archived'
                ? 'No tienes notas archivadas'
                : 'La papelera está vacía'}
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              {activeTab === 'notes'
                ? 'Las notas que crees se guardarán aquí y se sincronizarán automáticamente.'
                : activeTab === 'archived'
                ? 'Las notas que archives se guardarán aquí para mantener limpio tu tablero.'
                : 'Las notas eliminadas van a la papelera antes de ser borradas definitivamente.'}
            </p>
          </div>
        ) : activeTab === 'notes' ? (
          /* Pestaña Principal: Notas Fijadas y Otras */
          <div className="space-y-8 mt-2">
            {pinnedNotes.length > 0 && (
              <section>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 px-1">
                  <Pin className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>Fijadas ({pinnedNotes.length})</span>
                </div>
                {renderGridOrList(pinnedNotes)}
              </section>
            )}

            {otherNotes.length > 0 && (
              <section>
                {pinnedNotes.length > 0 && (
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 px-1">
                    <span>Otras ({otherNotes.length})</span>
                  </div>
                )}
                {renderGridOrList(otherNotes)}
              </section>
            )}
          </div>
        ) : (
          /* Pestañas Archivadas o Papelera */
          <div className="mt-4">
            {renderGridOrList(filteredNotes)}
          </div>
        )}
      </main>

      {/* Modal de edición completa */}
      <NoteEditorModal
        note={editingNote}
        isOpen={Boolean(editingNote)}
        onClose={() => setEditingNote(null)}
        onUpdate={handleUpdateNote}
        onDelete={handleMoveToTrash}
        onDuplicate={handleDuplicateNote}
        onToggleArchive={handleToggleArchive}
        onTogglePin={handleTogglePin}
      />
    </div>
  );
};
