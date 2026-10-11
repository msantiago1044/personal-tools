export type NoteColorKey =
  | 'default'
  | 'coral'
  | 'peach'
  | 'sand'
  | 'mint'
  | 'sage'
  | 'fog'
  | 'storm'
  | 'dusk'
  | 'blossom'
  | 'clay';

export interface NoteColorConfig {
  key: NoteColorKey;
  name: string;
  bgLight: string;
  bgDark: string;
  borderLight: string;
  borderDark: string;
  dotColor: string;
}

export const NOTE_COLORS: Record<NoteColorKey, NoteColorConfig> = {
  default: {
    key: 'default',
    name: 'Por defecto',
    bgLight: 'bg-white',
    bgDark: 'dark:bg-slate-900',
    borderLight: 'border-slate-200/90',
    borderDark: 'dark:border-slate-800/80',
    dotColor: '#94a3b8',
  },
  sand: {
    key: 'sand',
    name: 'Arena cálido',
    bgLight: 'bg-amber-50/90',
    bgDark: 'dark:bg-amber-950/40',
    borderLight: 'border-amber-200',
    borderDark: 'dark:border-amber-800/60',
    dotColor: '#fbbf24',
  },
  peach: {
    key: 'peach',
    name: 'Melocotón',
    bgLight: 'bg-orange-50/90',
    bgDark: 'dark:bg-orange-950/40',
    borderLight: 'border-orange-200',
    borderDark: 'dark:border-orange-800/60',
    dotColor: '#fb923c',
  },
  coral: {
    key: 'coral',
    name: 'Coral suave',
    bgLight: 'bg-rose-50/90',
    bgDark: 'dark:bg-rose-950/40',
    borderLight: 'border-rose-200',
    borderDark: 'dark:border-rose-800/60',
    dotColor: '#f87171',
  },
  blossom: {
    key: 'blossom',
    name: 'Cerezo',
    bgLight: 'bg-pink-50/90',
    bgDark: 'dark:bg-pink-950/40',
    borderLight: 'border-pink-200',
    borderDark: 'dark:border-pink-800/60',
    dotColor: '#f472b6',
  },
  dusk: {
    key: 'dusk',
    name: 'Lavanda',
    bgLight: 'bg-purple-50/90',
    bgDark: 'dark:bg-purple-950/40',
    borderLight: 'border-purple-200',
    borderDark: 'dark:border-purple-800/60',
    dotColor: '#c084fc',
  },
  storm: {
    key: 'storm',
    name: 'Índigo nocturno',
    bgLight: 'bg-indigo-50/90',
    bgDark: 'dark:bg-indigo-950/40',
    borderLight: 'border-indigo-200',
    borderDark: 'dark:border-indigo-800/60',
    dotColor: '#818cf8',
  },
  fog: {
    key: 'fog',
    name: 'Cielo claro',
    bgLight: 'bg-sky-50/90',
    bgDark: 'dark:bg-sky-950/40',
    borderLight: 'border-sky-200',
    borderDark: 'dark:border-sky-800/60',
    dotColor: '#38bdf8',
  },
  sage: {
    key: 'sage',
    name: 'Salvia / Turquesa',
    bgLight: 'bg-teal-50/90',
    bgDark: 'dark:bg-teal-950/40',
    borderLight: 'border-teal-200',
    borderDark: 'dark:border-teal-800/60',
    dotColor: '#2dd4bf',
  },
  mint: {
    key: 'mint',
    name: 'Menta fresca',
    bgLight: 'bg-emerald-50/90',
    bgDark: 'dark:bg-emerald-950/40',
    borderLight: 'border-emerald-200',
    borderDark: 'dark:border-emerald-800/60',
    dotColor: '#34d399',
  },
  clay: {
    key: 'clay',
    name: 'Arcilla / Tierra',
    bgLight: 'bg-stone-100/90',
    bgDark: 'dark:bg-stone-900/60',
    borderLight: 'border-stone-300',
    borderDark: 'dark:border-stone-800',
    dotColor: '#a8a29e',
  },
};

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  is_checklist: boolean;
  checklist_items: ChecklistItem[];
  color: NoteColorKey;
  is_pinned: boolean;
  is_archived: boolean;
  is_trashed: boolean;
  tags: string[];
  reminder?: string | null;
  created_at: string;
  updated_at: string;
}

export type NoteTab = 'notes' | 'reminders' | 'archived' | 'trash';
export type NoteLayout = 'grid' | 'list';
