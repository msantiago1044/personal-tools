import { SidurTefila } from '../types';
import { SHAJARIT_DATA } from './sidurShajaritData';
import { MINJA_DATA } from './sidurMinjaData';
import { ARVIT_DATA } from './sidurArvitData';
import { BIRKAT_HAMAZON_DATA } from './sidurBirkatHamazonData';
import { ORACIONES_DIARIAS_DATA } from './sidurDiariasData';

export { SHAJARIT_DATA } from './sidurShajaritData';
export { MINJA_DATA } from './sidurMinjaData';
export { ARVIT_DATA } from './sidurArvitData';
export { BIRKAT_HAMAZON_DATA } from './sidurBirkatHamazonData';
export { ORACIONES_DIARIAS_DATA } from './sidurDiariasData';

/**
 * Liturgia Completa de Días de Jol (Semana Hábil)
 * Tradición y Rito Sefardí-Marroquí (Núsaj Kehilot Maroko)
 * 100% íntegra: textos completos sin abreviaturas ni elipsis (...).
 * Incluye: Hebreo con Niqqud Masorético, Fonética Masorética Marroquí y Español Fiel.
 */
export const SIDUR_MOROCCO_TEFILOT: SidurTefila[] = [
  SHAJARIT_DATA,
  MINJA_DATA,
  ARVIT_DATA,
  BIRKAT_HAMAZON_DATA,
  ORACIONES_DIARIAS_DATA,
];
