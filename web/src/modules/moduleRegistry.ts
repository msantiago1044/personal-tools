import React from 'react';

export interface ModuleProps {
  user?: any;
  onBackToHub: () => void;
}

export interface ModuleManifest {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  hashAliases: string[];
  status: 'active' | 'beta' | 'coming_soon';
  badge?: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
}

/**
 * Carga perezosa (Code-Splitting) obligatoria para todos los módulos de la suite.
 * Garantiza que el bundle inicial del Launcher / Hub sea ultra liviano (< 90 kB).
 */
const FinanceModule = React.lazy(() =>
  import('../pages/finance/FinanceModule').then((m) => ({ default: m.FinanceModule }))
);

const PantryModule = React.lazy(() =>
  import('../pages/pantry/PantryModule').then((m) => ({ default: m.PantryModule }))
);

const TehilimModule = React.lazy(() =>
  import('../pages/tehilim/TehilimModule').then((m) => ({ default: m.TehilimModule }))
);

const DwgViewerModule = React.lazy(() =>
  import('../pages/cad/DwgViewerModule').then((m) => ({ default: m.DwgViewerModule }))
);

const EmocionesModule = React.lazy(() =>
  import('../pages/emotions/EmocionesModule').then((m) => ({ default: m.EmocionesModule }))
);

const NotesModule = React.lazy(() =>
  import('../pages/notes/NotesModule').then((m) => ({ default: m.NotesModule }))
);

const PgnPrepModule = React.lazy(() =>
  import('../pages/pgn/PgnPrepModule').then((m) => ({ default: m.PgnPrepModule }))
);

/**
 * Registro Central Desacoplado de Módulos (Architecture RFC - OCP)
 * Para añadir un nuevo módulo, solo regístralo en esta lista.
 */
export const MODULE_REGISTRY: ModuleManifest[] = [
  {
    id: 'finance',
    name: 'Finanzas',
    description: 'Flujo de caja, cuentas y presupuestos.',
    icon: 'wallet',
    route: '/finance/home',
    hashAliases: ['finance'],
    status: 'active',
    badge: 'Principal',
    component: FinanceModule,
  },
  {
    id: 'pantry',
    name: 'Despensa & Mercado',
    description: 'Inventario, escaneo de facturas y nutrición.',
    icon: 'shopping-bag',
    route: '/pantry',
    hashAliases: ['pantry', 'mercado'],
    status: 'active',
    badge: 'IA Vision',
    component: PantryModule,
  },
  {
    id: 'tehilim',
    name: 'Tehilim',
    description: '150 salmos con hebreo, fonética y traducción.',
    icon: 'book-open',
    route: '/tehilim',
    hashAliases: ['tehilim'],
    status: 'active',
    component: TehilimModule,
  },
  {
    id: 'dwg_viewer',
    name: 'Planos CAD',
    description: 'Visor de archivos DWG y DXF con capas y regla.',
    icon: 'layers',
    route: '/cad-viewer',
    hashAliases: ['cad', 'dwg'],
    status: 'active',
    component: DwgViewerModule,
  },
  {
    id: 'emotions',
    name: 'Emociones',
    description: 'Registro de estado de ánimo, bienestar y balance diario.',
    icon: 'smile',
    route: '/emotions',
    hashAliases: ['emocion', 'emotion', 'emotions'],
    status: 'active',
    badge: 'Bienestar',
    component: EmocionesModule,
  },
  {
    id: 'notes',
    name: 'Notas & Keep',
    description: 'Notas rápidas, listas de tareas, colores y etiquetas.',
    icon: 'sticky-note',
    route: '/notes',
    hashAliases: ['notes', 'notas', 'keep'],
    status: 'active',
    badge: 'Nuevo',
    component: NotesModule,
  },
  {
    id: 'pgn',
    name: 'Concurso PGN 3PU-15',
    description: 'Preparación intensiva al mérito: 40 clases, microlearning y simulacros.',
    icon: 'scale',
    route: '/pgn',
    hashAliases: ['pgn', 'concurso', '3pu15', 'merito'],
    status: 'active',
    badge: 'Mérito 2026',
    component: PgnPrepModule,
  },
];

/**
 * Busca un módulo registrado según el hash actual del navegador
 */
export function findModuleByHash(hash: string): ModuleManifest | null {
  const normalized = hash.toLowerCase().replace(/^#\/?/, '');
  if (!normalized || normalized === 'hub') return null;

  for (const mod of MODULE_REGISTRY) {
    if (mod.hashAliases.some((alias) => normalized.includes(alias))) {
      return mod;
    }
  }
  return null;
}

/**
 * Busca un módulo registrado por su identificador único
 */
export function getModuleById(id: string): ModuleManifest | null {
  return MODULE_REGISTRY.find((m) => m.id === id) || null;
}
