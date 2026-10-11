import React, { useState, useRef, useEffect } from 'react';
import { NOTE_COLORS, NoteColorKey } from '../types/note.types';
import { Palette, Check } from 'lucide-react';

interface ColorPalettePickerProps {
  selectedColor: NoteColorKey;
  onSelectColor: (color: NoteColorKey) => void;
  className?: string;
  buttonSize?: 'sm' | 'md';
}

export const ColorPalettePicker: React.FC<ColorPalettePickerProps> = ({
  selectedColor,
  onSelectColor,
  className = '',
  buttonSize = 'sm',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const colorKeys = Object.keys(NOTE_COLORS) as NoteColorKey[];

  return (
    <div className={`relative inline-block ${className}`} ref={popoverRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        title="Cambiar color de fondo"
        className={`rounded-full flex items-center justify-center transition-colors text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-black/5 dark:hover:bg-white/10 ${
          buttonSize === 'sm' ? 'w-8 h-8' : 'w-9 h-9'
        }`}
      >
        <Palette className={buttonSize === 'sm' ? 'w-4 h-4' : 'w-4.5 h-4.5'} />
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute z-50 left-0 bottom-full mb-2 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl flex flex-wrap gap-1.5 w-[216px] animate-in fade-in zoom-in-95 duration-100"
        >
          {colorKeys.map((key) => {
            const config = NOTE_COLORS[key];
            const isSelected = selectedColor === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  onSelectColor(key);
                  setIsOpen(false);
                }}
                title={config.name}
                className="w-7 h-7 rounded-full flex items-center justify-center border transition-transform hover:scale-110 relative"
                style={{
                  backgroundColor: config.dotColor,
                  borderColor: isSelected ? '#0f172a' : 'transparent',
                }}
              >
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-slate-900 drop-shadow-xs" strokeWidth={3} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
