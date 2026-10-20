import React from 'react';

export interface ModuleProps {
  user?: any;
  onBackToHub: () => void;
}

export interface ModuleManifest {
  id: string;
  name: string;
  shortName?: string;
  description: string;
  emoji: string;
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

const HebrewSrsModule = React.lazy(() =>
  import('../pages/hebrew_srs/HebrewSrsModule').then((m) => ({ default: m.HebrewSrsModule }))
);

const SleepModule = React.lazy(() =>
  import('../pages/sleep/SleepModule').then((m) => ({ default: m.SleepModule }))
);

const PirkeiAvotModule = React.lazy(() =>
  import('../pages/pirkei_avot/PirkeiAvotModule').then((m) => ({ default: m.PirkeiAvotModule }))
);

const ParashaModule = React.lazy(() =>
  import('../pages/parasha/ParashaModule').then((m) => ({ default: m.ParashaModule }))
);

const AssetsModule = React.lazy(() =>
  import('../pages/assets/AssetsModule').then((m) => ({ default: m.AssetsModule }))
);


/**
 * Registro Central Desacoplado de Módulos (Architecture RFC - OCP)
 * Para añadir un nuevo módulo, solo regístralo en esta lista.
 */
export const MODULE_REGISTRY: ModuleManifest[] = [
  {
    id: 'parasha',
    name: 'Parashá Semanal',
    shortName: 'Parashá',
    description: 'Lectura diaria de la Torá (Diáspora) aliyá por aliyá.',
    emoji: '📜',
    icon: 'book-open',
    route: '/parasha',
    hashAliases: ['parasha', 'tora', 'shavua'],
    status: 'active',
    badge: 'Diáspora',
    component: ParashaModule,
  },
  {
    id: 'finance',
    name: 'Finanzas',
    shortName: 'Finanzas',
    description: 'Flujo de caja, cuentas y presupuestos.',
    emoji: '📊',
    icon: 'wallet',
    route: '/finance/home',
    hashAliases: ['finance'],
    status: 'active',
    badge: 'Principal',
    component: FinanceModule,
  },
  {
    id: 'assets',
    name: 'Patrimonio & Activos',
    shortName: 'Patrimonio',
    description: 'Inventario de bienes tangibles, depreciación, patrimonio neto y amortización de deudas.',
    emoji: '🏛️',
    icon: 'landmark',
    route: '/assets',
    hashAliases: ['assets', 'patrimonio', 'bienes', 'activos'],
    status: 'active',
    badge: 'Nuevo',
    component: AssetsModule,
  },
  {
    id: 'pantry',
    name: 'Despensa & Mercado',
    shortName: 'Despensa',
    description: 'Inventario, escaneo de facturas y nutrición.',
    emoji: '🛒',
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
    shortName: 'Tehilim',
    description: '150 salmos con hebreo, fonética y traducción.',
    emoji: '🕊️',
    icon: 'book-open',
    route: '/tehilim',
    hashAliases: ['tehilim'],
    status: 'active',
    component: TehilimModule,
  },
  {
    id: 'pirkei_avot',
    name: 'Pirkei Avot',
    shortName: 'Pirkei Avot',
    description: 'Ética de los Padres con hebreo, fonética y traducción.',
    emoji: '🏛️',
    icon: 'book-open',
    route: '/pirkei-avot',
    hashAliases: ['pirkei-avot', 'avot', 'padres'],
    status: 'active',
    badge: 'Mishná',
    component: PirkeiAvotModule,
  },
  {
    id: 'dwg_viewer',
    name: 'Planos CAD',
    shortName: 'Planos CAD',
    description: 'Visor de archivos DWG y DXF con capas y regla.',
    emoji: '📐',
    icon: 'layers',
    route: '/cad-viewer',
    hashAliases: ['cad', 'dwg'],
    status: 'active',
    component: DwgViewerModule,
  },
  {
    id: 'emotions',
    name: 'Emociones',
    shortName: 'Emociones',
    description: 'Registro de estado de ánimo, bienestar y balance diario.',
    emoji: '✨',
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
    shortName: 'Notas',
    description: 'Notas rápidas, listas de tareas, colores y etiquetas.',
    emoji: '📝',
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
    shortName: 'PGN 3PU-15',
    description: 'Preparación intensiva al mérito: 40 clases, microlearning y simulacros.',
    emoji: '⚖️',
    icon: 'scale',
    route: '/pgn',
    hashAliases: ['pgn', 'concurso', '3pu15', 'merito'],
    status: 'active',
    badge: 'Mérito 2026',
    component: PgnPrepModule,
  },
  {
    id: 'hebrew_srs',
    name: 'Hebreo Bíblico SRS',
    shortName: 'Hebreo SRS',
    description: 'Decodificación de Niqqud, evaluación psicométrica y repetición espaciada.',
    emoji: '📖',
    icon: 'book-open',
    route: '/hebrew-srs',
    hashAliases: ['hebrew', 'hebreo', 'srs', 'niqqud'],
    status: 'active',
    badge: 'Niqqud Lab',
    component: HebrewSrsModule,
  },
  {
    id: 'sleep',
    name: 'Sueño & Descanso',
    shortName: 'Sueño',
    description: 'Registro de horarios de sueño, duración, calidad (1 al 5) y correlación anímica.',
    emoji: '🌙',
    icon: 'moon',
    route: '/sleep',
    hashAliases: ['sleep', 'sueno', 'descanso', 'dormir'],
    status: 'active',
    badge: 'Bienestar',
    component: SleepModule,
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
