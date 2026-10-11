import React, { useState, useEffect, useRef } from 'react';
import {
  Note,
  ChecklistItem,
  NoteColorKey,
  NOTE_COLORS,
} from '../types/note.types';
import { ColorPalettePicker } from './ColorPalettePicker';
import { generateId } from '../services/notesService';
import {
  Pin,
  Archive,
  ArchiveRestore,
  Trash2,
  Copy,
  Plus,
  X,
  ListTodo,
  Tag,
  CheckSquare,
  Square,
  Clock,
} from 'lucide-react';

interface NoteEditorModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export const NoteEditorModal: React.FC<NoteEditorModalProps> = ({
  note,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  onDuplicate,
  onToggleArchive,
  onTogglePin,
}) => {
  if (!isOpen || !note) return null;

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isChecklist, setIsChecklist] = useState(note.is_checklist);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(
    note.checklist_items || []
  );
  const [color, setColor] = useState<NoteColorKey>(note.color || 'default');
  const [tags, setTags] = useState<string[]>(note.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  const nextItemRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setIsChecklist(note.is_checklist);
    setChecklistItems(note.checklist_items || []);
    setColor(note.color || 'default');
    setTags(note.tags || []);
  }, [note]);

  const handleSaveAndClose = () => {
    const cleanItems = checklistItems.filter((i) => i.text.trim().length > 0);
    onUpdate(note.id, {
      title: title.trim(),
      content: isChecklist ? '' : content.trim(),
      is_checklist: isChecklist,
      checklist_items: cleanItems,
      color,
      tags,
    });
    onClose();
  };

  const handleAddItem = () => {
    setChecklistItems((prev) => [
      ...prev,
      { id: generateId('item'), text: '', completed: false },
    ]);
  };

  const handleItemChange = (id: string, text: string) => {
    setChecklistItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, text } : i))
    );
  };

  const handleItemToggle = (id: string) => {
    setChecklistItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, completed: !i.completed } : i))
    );
  };

  const handleRemoveItem = (id: string) => {
    setChecklistItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleItemKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
      setTimeout(() => {
        nextItemRef.current?.focus();
      }, 50);
    } else if (e.key === 'Backspace' && checklistItems[index]?.text === '') {
      if (checklistItems.length > 1) {
        e.preventDefault();
        handleRemoveItem(checklistItems[index].id);
      }
    }
  };

  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const cleanTag = tagInput.trim().replace(/^#/, '').toLowerCase();
    if (cleanTag && !tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((item) => item !== t));
  };

  const colorConfig = NOTE_COLORS[color];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={handleSaveAndClose}
      />

      <div
        className={`relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl p-5 sm:p-6 shadow-2xl border transition-all duration-200 z-10 ${
          colorConfig.bgLight
        } ${colorConfig.bgDark} ${colorConfig.borderLight} ${colorConfig.borderDark}`}
      >
        {/* Cabecera del modal: Título y Botón Pin */}
        <div className="flex items-center justify-between gap-3 pb-2 border-b border-black/5 dark:border-white/5">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título de la nota"
            className="w-full text-lg sm:text-xl font-bold bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={() => onTogglePin(note.id)}
            title={note.is_pinned ? 'Desfijar' : 'Fijar nota'}
            className={`p-2 rounded-full transition ${
              note.is_pinned
                ? 'text-amber-500 bg-amber-500/10'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            <Pin className={`w-5 h-5 ${note.is_pinned ? 'fill-amber-500' : ''}`} />
          </button>
        </div>

        {/* Cuerpo del modal (Scrollable) */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {!isChecklist ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe tus notas aquí..."
              rows={8}
              className="w-full bg-transparent resize-none outline-none text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200 placeholder:text-slate-400 font-normal"
            />
          ) : (
            <div className="flex flex-col gap-2">
              {checklistItems.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-2 group">
                  <button
                    type="button"
                    onClick={() => handleItemToggle(item.id)}
                    className="text-slate-400 hover:text-emerald-500 transition"
                  >
                    {item.completed ? (
                      <CheckSquare className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                  <input
                    ref={idx === checklistItems.length - 1 ? nextItemRef : undefined}
                    type="text"
                    value={item.text}
                    onChange={(e) => handleItemChange(item.id, e.target.value)}
                    onKeyDown={(e) => handleItemKeyDown(e, idx)}
                    placeholder="Elemento de lista..."
                    className={`flex-1 bg-transparent text-sm sm:text-base outline-none ${
                      item.completed
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 transition opacity-60 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 py-2 self-start hover:underline"
              >
                <Plus className="w-4 h-4" /> Añadir elemento
              </button>
            </div>
          )}

          {/* Etiquetas */}
          <div className="pt-2 border-t border-black/5 dark:border-white/5">
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs font-medium bg-black/5 dark:bg-white/10 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-full"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-500 ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <button
                type="button"
                onClick={() => setShowTagInput(!showTagInput)}
                className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-1 rounded-full border border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-500 transition"
              >
                <Tag className="w-3 h-3" /> Añadir etiqueta
              </button>
            </div>

            {showTagInput && (
              <div className="flex items-center gap-2 p-1.5 bg-black/5 dark:bg-white/5 rounded-xl text-xs max-w-sm">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Nombre de etiqueta..."
                  className="flex-1 bg-transparent outline-none text-slate-800 dark:text-slate-200"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-2.5 py-1 bg-emerald-500 text-white rounded-md text-[11px] font-semibold"
                >
                  Añadir
                </button>
              </div>
            )}
          </div>

          {/* Fecha de actualización */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span>
              Editado el {new Date(note.updated_at).toLocaleDateString()} a las{' '}
              {new Date(note.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Pie del modal: Barra de Herramientas */}
        <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <ColorPalettePicker
              selectedColor={color}
              onSelectColor={setColor}
              buttonSize="md"
            />

            <button
              type="button"
              onClick={() => {
                if (!isChecklist) {
                  setIsChecklist(true);
                  if (checklistItems.length === 0) {
                    const lines = content
                      .split('\n')
                      .filter((l) => l.trim())
                      .map((l) => ({ id: generateId('item'), text: l, completed: false }));
                    setChecklistItems(
                      lines.length > 0 ? lines : [{ id: generateId('item'), text: '', completed: false }]
                    );
                  }
                } else {
                  setIsChecklist(false);
                  if (!content && checklistItems.length > 0) {
                    setContent(checklistItems.map((i) => i.text).join('\n'));
                  }
                }
              }}
              title={isChecklist ? 'Convertir a texto' : 'Convertir a casillas de verificación'}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition"
            >
              <ListTodo className="w-4.5 h-4.5" />
            </button>

            <button
              type="button"
              onClick={() => onToggleArchive(note.id)}
              title={note.is_archived ? 'Desarchivar' : 'Archivar'}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition"
            >
              {note.is_archived ? (
                <ArchiveRestore className="w-4.5 h-4.5" />
              ) : (
                <Archive className="w-4.5 h-4.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                onDuplicate(note.id);
                onClose();
              }}
              title="Duplicar nota"
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition"
            >
              <Copy className="w-4.5 h-4.5" />
            </button>

            <button
              type="button"
              onClick={() => {
                onDelete(note.id);
                onClose();
              }}
              title="Mover a papelera"
              className="p-2 text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleSaveAndClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs sm:text-sm font-semibold hover:opacity-90 transition shadow-sm"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
