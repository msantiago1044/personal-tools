import React, { useState, useRef, useEffect } from 'react';
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
  ListTodo,
  Plus,
  Trash2,
  Tag,
  X,
  CheckSquare,
  Square,
} from 'lucide-react';

interface QuickNoteCreatorProps {
  onSave: (noteData: Omit<Note, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  availableTags?: string[];
}

export const QuickNoteCreator: React.FC<QuickNoteCreatorProps> = ({
  onSave,
  availableTags = [],
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isChecklist, setIsChecklist] = useState(false);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [color, setColor] = useState<NoteColorKey>('default');
  const [isPinned, setIsPinned] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const nextItemInputRef = useRef<HTMLInputElement>(null);

  // Click outside para cerrar y guardar automáticamente
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isExpanded) {
          handleCloseAndSave();
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, title, content, checklistItems, color, isPinned, tags, isChecklist]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setIsChecklist(false);
    setChecklistItems([]);
    setColor('default');
    setIsPinned(false);
    setTags([]);
    setTagInput('');
    setShowTagInput(false);
    setIsExpanded(false);
  };

  const handleCloseAndSave = () => {
    const hasTitle = title.trim().length > 0;
    const hasContent = content.trim().length > 0;
    const hasItems = checklistItems.some((item) => item.text.trim().length > 0);

    if (hasTitle || hasContent || hasItems) {
      // Filtrar items vacíos
      const cleanItems = checklistItems.filter((i) => i.text.trim().length > 0);

      onSave({
        title: title.trim(),
        content: isChecklist ? '' : content.trim(),
        is_checklist: isChecklist,
        checklist_items: cleanItems,
        color,
        is_pinned: isPinned,
        is_archived: false,
        is_trashed: false,
        tags,
        reminder: null,
      });
    }
    resetForm();
  };

  const startChecklistMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsChecklist(true);
    if (checklistItems.length === 0) {
      setChecklistItems([{ id: generateId('item'), text: '', completed: false }]);
    }
    setIsExpanded(true);
  };

  const handleAddItem = () => {
    setChecklistItems((prev) => [
      ...prev,
      { id: generateId('item'), text: '', completed: false },
    ]);
  };

  const handleItemChange = (id: string, text: string) => {
    setChecklistItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, text } : item))
    );
  };

  const handleItemToggle = (id: string) => {
    setChecklistItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setChecklistItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleItemKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
      setTimeout(() => {
        nextItemInputRef.current?.focus();
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

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const colorConfig = NOTE_COLORS[color];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 my-4" ref={containerRef}>
      <div
        className={`rounded-2xl transition-all duration-200 border shadow-sm ${
          colorConfig.bgLight
        } ${colorConfig.bgDark} ${colorConfig.borderLight} ${colorConfig.borderDark} ${
          isExpanded ? 'shadow-md' : 'hover:shadow-md cursor-text'
        }`}
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        {!isExpanded ? (
          // Vista Colapsada (Estilo clásico Keep)
          <div className="flex items-center justify-between px-5 py-3.5">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 select-none">
              Añade una nota...
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={startChecklistMode}
                title="Nueva lista de tareas"
                className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition"
              >
                <ListTodo className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        ) : (
          // Vista Expandida (Editor en línea)
          <div className="p-4 sm:p-5 flex flex-col gap-3">
            {/* Cabecera: Título y Pin */}
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título"
                className="w-full text-base sm:text-lg font-bold bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setIsPinned(!isPinned)}
                title={isPinned ? 'Desfijar nota' : 'Fijar nota al inicio'}
                className={`p-2 rounded-full transition ${
                  isPinned
                    ? 'text-amber-500 bg-amber-500/10'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10'
                }`}
              >
                <Pin className={`w-4.5 h-4.5 ${isPinned ? 'fill-amber-500' : ''}`} />
              </button>
            </div>

            {/* Cuerpo: Texto normal o Lista de casillas */}
            {!isChecklist ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escribe una nota..."
                rows={3}
                className="w-full bg-transparent resize-none outline-none text-sm leading-relaxed text-slate-800 dark:text-slate-200 placeholder:text-slate-400 font-normal"
              />
            ) : (
              <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto pr-1">
                {checklistItems.map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-2 group">
                    <button
                      type="button"
                      onClick={() => handleItemToggle(item.id)}
                      className="text-slate-400 hover:text-emerald-500 transition"
                    >
                      {item.completed ? (
                        <CheckSquare className="w-4.5 h-4.5 text-emerald-500" />
                      ) : (
                        <Square className="w-4.5 h-4.5" />
                      )}
                    </button>
                    <input
                      ref={idx === checklistItems.length - 1 ? nextItemInputRef : undefined}
                      type="text"
                      value={item.text}
                      onChange={(e) => handleItemChange(item.id, e.target.value)}
                      onKeyDown={(e) => handleItemKeyDown(e, idx)}
                      placeholder="Elemento de lista..."
                      className={`flex-1 bg-transparent text-sm outline-none ${
                        item.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 py-1.5 transition self-start"
                >
                  <Plus className="w-3.5 h-3.5" /> Añadir elemento
                </button>
              </div>
            )}

            {/* Etiquetas añadidas */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-[11px] font-medium bg-black/5 dark:bg-white/10 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-rose-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Input para agregar etiquetas */}
            {showTagInput && (
              <div className="flex items-center gap-2 p-1.5 bg-black/5 dark:bg-white/5 rounded-xl text-xs">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Escribe una etiqueta y pulsa Enter..."
                  className="flex-1 bg-transparent outline-none text-slate-800 dark:text-slate-200"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-2 py-0.5 bg-emerald-500 text-white rounded-md text-[11px] font-semibold"
                >
                  Agregar
                </button>
              </div>
            )}

            {/* Barra de Herramientas Inferior */}
            <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5">
              <div className="flex items-center gap-1">
                {/* Selector de color */}
                <ColorPalettePicker
                  selectedColor={color}
                  onSelectColor={setColor}
                  buttonSize="sm"
                />

                {/* Alternar modo lista de casillas */}
                <button
                  type="button"
                  onClick={() => {
                    if (!isChecklist) {
                      setIsChecklist(true);
                      if (checklistItems.length === 0) {
                        const initial = content
                          .split('\n')
                          .filter((l) => l.trim())
                          .map((line) => ({
                            id: generateId('item'),
                            text: line,
                            completed: false,
                          }));
                        setChecklistItems(
                          initial.length > 0
                            ? initial
                            : [{ id: generateId('item'), text: '', completed: false }]
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
                  className={`p-2 rounded-full transition ${
                    isChecklist
                      ? 'text-emerald-600 bg-emerald-500/10'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-black/5 dark:hover:bg-white/10'
                  }`}
                >
                  <ListTodo className="w-4 h-4" />
                </button>

                {/* Botón de añadir etiqueta */}
                <button
                  type="button"
                  onClick={() => setShowTagInput(!showTagInput)}
                  title="Añadir etiqueta"
                  className={`p-2 rounded-full transition ${
                    showTagInput
                      ? 'text-emerald-600 bg-emerald-500/10'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-black/5 dark:hover:bg-white/10'
                  }`}
                >
                  <Tag className="w-4 h-4" />
                </button>
              </div>

              {/* Botón Cerrar / Guardar */}
              <button
                type="button"
                onClick={handleCloseAndSave}
                className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition shadow-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
