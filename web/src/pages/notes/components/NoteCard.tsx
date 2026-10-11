import React from 'react';
import {
  Note,
  NOTE_COLORS,
  NoteColorKey,
} from '../types/note.types';
import { ColorPalettePicker } from './ColorPalettePicker';
import {
  Pin,
  Archive,
  ArchiveRestore,
  Trash2,
  Copy,
  RotateCcw,
  CheckSquare,
  Square,
  Check,
} from 'lucide-react';

interface NoteCardProps {
  note: Note;
  onClick: () => void;
  onTogglePin?: (id: string) => void;
  onToggleArchive?: (id: string) => void;
  onMoveToTrash?: (id: string) => void;
  onRestore?: (id: string) => void;
  onDeletePermanent?: (id: string) => void;
  onColorChange?: (id: string, color: NoteColorKey) => void;
  onToggleChecklistItem?: (noteId: string, itemId: string) => void;
  onDuplicate?: (id: string) => void;
  isTrashView?: boolean;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onClick,
  onTogglePin,
  onToggleArchive,
  onMoveToTrash,
  onRestore,
  onDeletePermanent,
  onColorChange,
  onToggleChecklistItem,
  onDuplicate,
  isTrashView = false,
}) => {
  const [copied, setCopied] = React.useState(false);
  const colorConfig = NOTE_COLORS[note.color || 'default'];

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    let textToCopy = '';
    if (note.title) textToCopy += `${note.title}\n\n`;
    if (note.is_checklist) {
      textToCopy += note.checklist_items
        .map((i) => `[${i.completed ? 'x' : ' '}] ${i.text}`)
        .join('\n');
    } else {
      textToCopy += note.content;
    }
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const completedCount = note.checklist_items?.filter((i) => i.completed).length || 0;
  const totalItems = note.checklist_items?.length || 0;

  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl p-4 sm:p-5 transition-all duration-200 border cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md ${
        colorConfig.bgLight
      } ${colorConfig.bgDark} ${colorConfig.borderLight} ${colorConfig.borderDark}`}
    >
      <div>
        {/* Cabecera de la Tarjeta: Título y Pin */}
        <div className="flex items-start justify-between gap-2 mb-2">
          {note.title ? (
            <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white leading-tight break-words">
              {note.title}
            </h3>
          ) : (
            <div />
          )}

          {!isTrashView && onTogglePin && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(note.id);
              }}
              title={note.is_pinned ? 'Desfijar' : 'Fijar nota'}
              className={`p-1.5 rounded-full transition-opacity duration-150 ${
                note.is_pinned
                  ? 'opacity-100 text-amber-500 bg-amber-500/10'
                  : 'opacity-70 sm:opacity-0 sm:group-hover:opacity-100 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10'
              }`}
            >
              <Pin className={`w-4 h-4 ${note.is_pinned ? 'fill-amber-500' : ''}`} />
            </button>
          )}
        </div>

        {/* Contenido de la Tarjeta */}
        {note.is_checklist ? (
          <div className="flex flex-col gap-1.5 mb-3 text-xs sm:text-sm">
            {note.checklist_items.slice(0, 6).map((item) => (
              <div
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleChecklistItem?.(note.id, item.id);
                }}
                className="flex items-center gap-2 group/item cursor-pointer py-0.5"
              >
                <div className="text-slate-400 hover:text-emerald-500 transition">
                  {item.completed ? (
                    <CheckSquare className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={`flex-1 break-words line-clamp-1 ${
                    item.completed
                      ? 'line-through text-slate-400 dark:text-slate-500'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {item.text || 'Sin texto'}
                </span>
              </div>
            ))}
            {totalItems > 6 && (
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
                + {totalItems - 6} elementos más ({completedCount}/{totalItems} completados)
              </span>
            )}
          </div>
        ) : (
          note.content && (
            <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words mb-3 line-clamp-8">
              {note.content}
            </p>
          )
        )}

        {/* Etiquetas (Tags) */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-slate-600 dark:text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Barra de Acciones Inferior (Hover Keep) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-slate-500 dark:text-slate-400 transition-opacity duration-150 ${
          isTrashView ? 'opacity-100' : 'opacity-100 sm:opacity-0 sm:group-hover:opacity-100'
        }`}
      >
        {!isTrashView ? (
          <>
            <div className="flex items-center gap-0.5">
              {onColorChange && (
                <ColorPalettePicker
                  selectedColor={note.color}
                  onSelectColor={(c) => onColorChange(note.id, c)}
                  buttonSize="sm"
                />
              )}

              {onToggleArchive && (
                <button
                  type="button"
                  onClick={() => onToggleArchive(note.id)}
                  title={note.is_archived ? 'Desarchivar' : 'Archivar'}
                  className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 hover:text-slate-800 dark:hover:text-slate-100 transition"
                >
                  {note.is_archived ? (
                    <ArchiveRestore className="w-4 h-4" />
                  ) : (
                    <Archive className="w-4 h-4" />
                  )}
                </button>
              )}

              {onDuplicate && (
                <button
                  type="button"
                  onClick={() => onDuplicate(note.id)}
                  title="Duplicar nota"
                  className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 hover:text-slate-800 dark:hover:text-slate-100 transition"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={handleCopy}
                title={copied ? 'Copiado al portapapeles' : 'Copiar texto'}
                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 hover:text-slate-800 dark:hover:text-slate-100 transition"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {onMoveToTrash && (
              <button
                type="button"
                onClick={() => onMoveToTrash(note.id)}
                title="Mover a papelera"
                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 hover:text-rose-500 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </>
        ) : (
          <div className="flex items-center justify-between w-full">
            <button
              type="button"
              onClick={() => onRestore?.(note.id)}
              title="Restaurar nota"
              className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restaurar
            </button>
            <button
              type="button"
              onClick={() => onDeletePermanent?.(note.id)}
              title="Eliminar permanentemente"
              className="p-1.5 text-rose-500 hover:text-rose-600 rounded-full transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
