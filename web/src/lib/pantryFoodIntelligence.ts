import { PantryItem } from '../../../packages/shared/src/types';

export interface FoodNutritionalProfile {
  servingSize: string;
  calories: number;
  totalPackageCalories?: number;
  protein_g: number;
  carbs_g: number;
  sugar_g: number;
  fiber_g: number;
  fat_g: number;
  saturated_fat_g: number;
  sodium_mg: number;
  micronutrients: Array<{ name: string; amount: string; pctDailyValue?: number }>;
  colombianWarningLabels: Array<
    'EXCESO EN AZÚCARES' | 'EXCESO EN SODIO' | 'EXCESO EN GRASAS SATURADAS' | 'EXCESO EN GRASAS TRANS' | 'CONTIENE EDULCORANTES'
  >;
  isNaturalFood: boolean;
  storageAdvice: string;
}

export interface IsaFootprintMetrics {
  // 1. Huella Hídrica (Litros de agua requeridos para su cultivo/elaboración por kg o unidad)
  waterLitersPerKg: number;
  waterCategory: 'Baja' | 'Moderada' | 'Alta' | 'Extrema';
  waterEquivalence: string;

  // 2. Presión y Degradación de Suelo (m2 de tierra agrícola requerida y grado de impacto)
  landUseM2PerKg: number;
  soilDegradationRisk: 'Bajo' | 'Moderado' | 'Alto' | 'Muy Alto';
  soilImpactDetail: string;

  // 3. Huella de Carbono y Emisiones GEI (kg CO2e por kg de producto)
  carbonKgCO2ePerKg: number;
  carbonLevel: 'Bajo' | 'Moderado' | 'Alto';
  carbonEquivalenceKmCar: number;

  // 4. Tasa de Entropía del Sistema Doméstico (Desorden biológico y riesgo de desperdicio)
  entropyScore: number; // 0 - 100
  entropyLevel: 'Baja' | 'Media' | 'Alta';
  perishabilityRisk: string;
  packagingImpact: string;
  entropyExplanation: string;
}

export interface EconomicNutritionalMetrics {
  // Precio por gramo nutricional y eficiencia económica del alimento
  pricePerUnitCOP: number;
  totalPriceCOP?: number;
  totalItemGrams?: number;
  totalItemMl?: number;
  estimatedWeightGrams: number;
  pricePerGramCOP: number;
  pricePerMlCOP?: number;
  pricePer100gCOP?: number;
  pricePer100mlCOP?: number;
  pricePerServingCOP?: number;
  totalServings?: number;
  pricePerProteinGramCOP: number; // $ COP por gramo de proteína neta
  pricePerNutrientGramCOP: number; // $ COP por gramo de nutriente útil (proteína + fibra + carbohidratos limpios)
  economicNutritionalEfficiency: 'Excelente' | 'Alta' | 'Moderada' | 'Baja' | 'Ineficiente';
  economicScore: number; // 0 a 100
  economicExplanation: string;
}

export interface FoodIntelligenceData {
  productName: string;
  category: string;
  nutrition: FoodNutritionalProfile;
  isa: IsaFootprintMetrics;
  economics: EconomicNutritionalMetrics;
  // Índice ISA General (0 a 100) ponderando Nutrición, Recursos Naturales y Precio por Gramo Nutricional
  isaScore: number; // Mayor = más sostenible, nutritivo y accesible (100 = óptimo)
  isaGrade: 'A+' | 'A' | 'B' | 'C' | 'D';
  nutriEcoBalance: 'Excelente' | 'Favorable' | 'Equilibrado' | 'Desfavorable';
  balanceExplanation: string;
}

// ============================================================================
// BASE DE CONOCIMIENTO ALIMENTARIO, ECOLÓGICO E ISA (CALIBRADA PARA COLOMBIA)
// ============================================================================
interface KnownFoodDefinition {
  keywords: string[];
  category: string;
  servingSize: string;
  cals100g: number;
  prot100g: number;
  carbs100g: number;
  sugar100g: number;
  fiber100g: number;
  fat100g: number;
  satFat100g: number;
  sodium100g: number;
  micronutrients: Array<{ name: string; amount: string; pctDailyValue?: number }>;
  isNatural: boolean;
  warnings?: Array<'EXCESO EN AZÚCARES' | 'EXCESO EN SODIO' | 'EXCESO EN GRASAS SATURADAS' | 'EXCESO EN GRASAS TRANS' | 'CONTIENE EDULCORANTES'>;
  storage: string;
  waterL: number;
  landM2: number;
  soilRisk: 'Bajo' | 'Moderado' | 'Alto' | 'Muy Alto';
  co2Kg: number;
  shelfLifeTypicalDays: number;
  packaging: string;
}

const KNOWN_FOODS: KnownFoodDefinition[] = [
  // Hortalizas y Verduras
  {
    keywords: ['ahuyama', 'auyama', 'calabaza'],
    category: 'Frutas & Verduras',
    servingSize: '100g crudo',
    cals100g: 26,
    prot100g: 1.0,
    carbs100g: 6.5,
    sugar100g: 2.8,
    fiber100g: 0.5,
    fat100g: 0.1,
    satFat100g: 0.05,
    sodium100g: 1,
    micronutrients: [
      { name: 'Vitamina A (Betacarotenos)', amount: '426 µg', pctDailyValue: 47 },
      { name: 'Vitamina C', amount: '9 mg', pctDailyValue: 10 },
      { name: 'Potasio', amount: '340 mg', pctDailyValue: 7 },
    ],
    isNatural: true,
    storage: 'Lugar fresco y ventilado; una vez cortada refrigerar en recipiente hermético (máx 7 días).',
    waterL: 336, // Huella hídrica L/kg
    landM2: 0.4,
    soilRisk: 'Bajo',
    co2Kg: 0.4,
    shelfLifeTypicalDays: 14,
    packaging: 'A granel / Malla vegetal (baja entropía)',
  },
  {
    keywords: ['ajo', 'ajos'],
    category: 'Frutas & Verduras',
    servingSize: '1 diente (3g) o 100g',
    cals100g: 149,
    prot100g: 6.4,
    carbs100g: 33.1,
    sugar100g: 1.0,
    fiber100g: 2.1,
    fat100g: 0.5,
    satFat100g: 0.1,
    sodium100g: 17,
    micronutrients: [
      { name: 'Allicina (Compuesto bioactivo)', amount: 'Alta', pctDailyValue: 100 },
      { name: 'Vitamina B6', amount: '1.2 mg', pctDailyValue: 70 },
      { name: 'Manganeso', amount: '1.7 mg', pctDailyValue: 73 },
    ],
    isNatural: true,
    storage: 'Ambiente seco, oscuro y fresco (15°C-18°C). No refrigerar entero para evitar brotes.',
    waterL: 589,
    landM2: 0.6,
    soilRisk: 'Bajo',
    co2Kg: 0.5,
    shelfLifeTypicalDays: 60,
    packaging: 'Malla / Granel',
  },
  {
    keywords: ['tomate', 'chonto', 'milano'],
    category: 'Frutas & Verduras',
    servingSize: '1 unidad mediana (120g)',
    cals100g: 18,
    prot100g: 0.9,
    carbs100g: 3.9,
    sugar100g: 2.6,
    fiber100g: 1.2,
    fat100g: 0.2,
    satFat100g: 0.03,
    sodium100g: 5,
    micronutrients: [
      { name: 'Licopeno (Antioxidante)', amount: '3025 µg' },
      { name: 'Vitamina C', amount: '14 mg', pctDailyValue: 15 },
      { name: 'Potasio', amount: '237 mg', pctDailyValue: 5 },
    ],
    isNatural: true,
    storage: 'Temperatura ambiente lejos del sol directo; refrigerar solo cuando esté muy maduro.',
    waterL: 214,
    landM2: 0.3,
    soilRisk: 'Bajo',
    co2Kg: 1.1,
    shelfLifeTypicalDays: 8,
    packaging: 'A granel',
  },
  {
    keywords: ['cebolla', 'cabezona', 'junca'],
    category: 'Frutas & Verduras',
    servingSize: '100g',
    cals100g: 40,
    prot100g: 1.1,
    carbs100g: 9.3,
    sugar100g: 4.2,
    fiber100g: 1.7,
    fat100g: 0.1,
    satFat100g: 0.04,
    sodium100g: 4,
    micronutrients: [
      { name: 'Quercetina (Flavonoide)', amount: '15 mg' },
      { name: 'Vitamina C', amount: '7.4 mg', pctDailyValue: 8 },
    ],
    isNatural: true,
    storage: 'Lugar seco, aireado y sin humedad. Separada de las papas.',
    waterL: 272,
    landM2: 0.3,
    soilRisk: 'Bajo',
    co2Kg: 0.5,
    shelfLifeTypicalDays: 20,
    packaging: 'A granel',
  },
  {
    keywords: ['papa', 'pastusa', 'criolla', 'sabana'],
    category: 'Frutas & Verduras',
    servingSize: '1 unidad mediana (150g)',
    cals100g: 77,
    prot100g: 2.0,
    carbs100g: 17.5,
    sugar100g: 0.8,
    fiber100g: 2.2,
    fat100g: 0.1,
    satFat100g: 0.03,
    sodium100g: 6,
    micronutrients: [
      { name: 'Potasio', amount: '421 mg', pctDailyValue: 9 },
      { name: 'Vitamina C', amount: '19.7 mg', pctDailyValue: 22 },
    ],
    isNatural: true,
    storage: 'Oscuro y seco; evitar luz solar para no generar solanina verde.',
    waterL: 287,
    landM2: 0.5,
    soilRisk: 'Moderado',
    co2Kg: 0.4,
    shelfLifeTypicalDays: 25,
    packaging: 'Costal o bolsa de papel',
  },
  // Frutas
  {
    keywords: ['arandanos', 'arándanos', 'blueberry'],
    category: 'Frutas & Verduras',
    servingSize: '1 taza (148g)',
    cals100g: 57,
    prot100g: 0.7,
    carbs100g: 14.5,
    sugar100g: 9.9,
    fiber100g: 2.4,
    fat100g: 0.3,
    satFat100g: 0.03,
    sodium100g: 1,
    micronutrients: [
      { name: 'Antocianinas (Antioxidante)', amount: '163 mg' },
      { name: 'Vitamina K', amount: '19.3 µg', pctDailyValue: 16 },
      { name: 'Vitamina C', amount: '9.7 mg', pctDailyValue: 11 },
    ],
    isNatural: true,
    storage: 'Refrigerar sin lavar (entre 2°C y 5°C); lavar solo antes de consumir.',
    waterL: 845,
    landM2: 1.2,
    soilRisk: 'Bajo',
    co2Kg: 1.2,
    shelfLifeTypicalDays: 12,
    packaging: 'Clamshell plástico transparente',
  },
  {
    keywords: ['banano', 'plátano maduro', 'guineo', 'bano maduro'],
    category: 'Frutas & Verduras',
    servingSize: '1 unidad mediana (118g)',
    cals100g: 89,
    prot100g: 1.1,
    carbs100g: 22.8,
    sugar100g: 12.2,
    fiber100g: 2.6,
    fat100g: 0.3,
    satFat100g: 0.1,
    sodium100g: 1,
    micronutrients: [
      { name: 'Potasio', amount: '358 mg', pctDailyValue: 8 },
      { name: 'Vitamina B6', amount: '0.4 mg', pctDailyValue: 24 },
      { name: 'Magnesio', amount: '27 mg', pctDailyValue: 6 },
    ],
    isNatural: true,
    storage: 'Ambiente fresco, colgado o separado. No refrigerar si está verde.',
    waterL: 790,
    landM2: 0.7,
    soilRisk: 'Bajo',
    co2Kg: 0.8,
    shelfLifeTypicalDays: 7,
    packaging: 'Cáscara biodegradable natural (Cero empaque)',
  },
  {
    keywords: ['aguacate', 'hass'],
    category: 'Frutas & Verduras',
    servingSize: '1/3 de unidad (50g)',
    cals100g: 160,
    prot100g: 2.0,
    carbs100g: 8.5,
    sugar100g: 0.7,
    fiber100g: 6.7,
    fat100g: 14.7,
    satFat100g: 2.1,
    sodium100g: 7,
    micronutrients: [
      { name: 'Ácido Fólico', amount: '81 µg', pctDailyValue: 20 },
      { name: 'Grasa Monoinsaturada (Ácido Oleico)', amount: '9.8 g' },
      { name: 'Potasio', amount: '485 mg', pctDailyValue: 10 },
    ],
    isNatural: true,
    storage: 'Ambiente hasta madurar; refrigerar maduro hasta por 5 días.',
    waterL: 1981,
    landM2: 1.8,
    soilRisk: 'Moderado',
    co2Kg: 1.3,
    shelfLifeTypicalDays: 8,
    packaging: 'A granel',
  },
  // Proteínas & Carnes
  {
    keywords: ['pollo', 'pechuga', 'muslo', 'alas'],
    category: 'Proteínas',
    servingSize: '1 filete o porción (100g cocido)',
    cals100g: 165,
    prot100g: 31.0,
    carbs100g: 0,
    sugar100g: 0,
    fiber100g: 0,
    fat100g: 3.6,
    satFat100g: 1.0,
    sodium100g: 74,
    micronutrients: [
      { name: 'Niacina (B3)', amount: '13.7 mg', pctDailyValue: 86 },
      { name: 'Fósforo', amount: '228 mg', pctDailyValue: 18 },
      { name: 'Selenio', amount: '27.6 µg', pctDailyValue: 50 },
    ],
    isNatural: true,
    storage: 'Refrigerar a <4°C máx 2 días; congelar a -18°C hasta 6 meses.',
    waterL: 4325,
    landM2: 12.2,
    soilRisk: 'Moderado',
    co2Kg: 6.9,
    shelfLifeTypicalDays: 4,
    packaging: 'Bandeja icopor / película plástica',
  },
  {
    keywords: ['carne', 'res', 'molida', 'lomo', 'costilla'],
    category: 'Proteínas',
    servingSize: '100g cocido',
    cals100g: 250,
    prot100g: 26.0,
    carbs100g: 0,
    sugar100g: 0,
    fiber100g: 0,
    fat100g: 15.0,
    satFat100g: 6.0,
    sodium100g: 72,
    micronutrients: [
      { name: 'Hierro Hemo', amount: '2.6 mg', pctDailyValue: 14 },
      { name: 'Zinc', amount: '6.3 mg', pctDailyValue: 57 },
      { name: 'Vitamina B12', amount: '2.6 µg', pctDailyValue: 108 },
    ],
    isNatural: true,
    warnings: ['EXCESO EN GRASAS SATURADAS'],
    storage: 'Congelador a -18°C o consumir en 48 horas en refrigeración.',
    waterL: 15415, // Huella hídrica extrema de la ganadería
    landM2: 326.0,
    soilRisk: 'Muy Alto',
    co2Kg: 27.0, // Alta huella de carbono
    shelfLifeTypicalDays: 4,
    packaging: 'Bandeja / Papel encerado',
  },
  {
    keywords: ['huevo', 'huevos'],
    category: 'Proteínas',
    servingSize: '1 huevo (50g)',
    cals100g: 143,
    prot100g: 12.6,
    carbs100g: 0.7,
    sugar100g: 0.4,
    fiber100g: 0,
    fat100g: 9.5,
    satFat100g: 3.1,
    sodium100g: 142,
    micronutrients: [
      { name: 'Colina', amount: '294 mg', pctDailyValue: 53 },
      { name: 'Vitamina D', amount: '2 µg', pctDailyValue: 10 },
      { name: 'Luteína & Zeaxantina', amount: '503 µg' },
    ],
    isNatural: true,
    storage: 'Lugar fresco sin cambios bruscos de temperatura; no lavar antes de guardar.',
    waterL: 3265, // ~196 L por huevo individual
    landM2: 6.3,
    soilRisk: 'Bajo',
    co2Kg: 4.8,
    shelfLifeTypicalDays: 30,
    packaging: 'Cubeta de cartón reciclable (Baja entropía)',
  },
  {
    keywords: ['atun', 'atún', 'sardinas'],
    category: 'Proteínas',
    servingSize: '1 lata drenada (80g)',
    cals100g: 130,
    prot100g: 28.0,
    carbs100g: 0,
    sugar100g: 0,
    fiber100g: 0,
    fat100g: 1.5,
    satFat100g: 0.4,
    sodium100g: 350,
    micronutrients: [
      { name: 'Omega-3 (EPA/DHA)', amount: '230 mg' },
      { name: 'Selenio', amount: '80 µg', pctDailyValue: 145 },
    ],
    isNatural: false,
    warnings: ['EXCESO EN SODIO'],
    storage: 'Alacena a temperatura ambiente; una vez abierta pasar a recipiente de vidrio y refrigerar.',
    waterL: 1950,
    landM2: 2.1,
    soilRisk: 'Bajo',
    co2Kg: 6.1,
    shelfLifeTypicalDays: 730,
    packaging: 'Lata de hojalata 100% reciclable',
  },
  // Lácteos
  {
    keywords: ['leche', 'alqueria', 'colanta', 'alpina', 'deslactosada'],
    category: 'Lácteos',
    servingSize: '1 vaso (200ml)',
    cals100g: 61,
    prot100g: 3.2,
    carbs100g: 4.8,
    sugar100g: 4.8,
    fiber100g: 0,
    fat100g: 3.3,
    satFat100g: 2.1,
    sodium100g: 44,
    micronutrients: [
      { name: 'Calcio', amount: '120 mg', pctDailyValue: 12 },
      { name: 'Vitamina B12', amount: '0.45 µg', pctDailyValue: 19 },
      { name: 'Fósforo', amount: '93 mg', pctDailyValue: 9 },
    ],
    isNatural: true,
    storage: 'Refrigerar inmediatamente entre 2°C y 4°C tras abrir; consumir en máx 4 días.',
    waterL: 1020, // 1.020 L de agua por litro de leche
    landM2: 8.9,
    soilRisk: 'Moderado',
    co2Kg: 3.0,
    shelfLifeTypicalDays: 8,
    packaging: 'Bolsa de polietileno o Tetrapak',
  },
  {
    keywords: ['queso', 'quesito', 'cuajada', 'mozzarella'],
    category: 'Lácteos',
    servingSize: '1 tajada (30g)',
    cals100g: 280,
    prot100g: 22.0,
    carbs100g: 2.2,
    sugar100g: 1.0,
    fiber100g: 0,
    fat100g: 20.0,
    satFat100g: 12.0,
    sodium100g: 620,
    micronutrients: [
      { name: 'Calcio', amount: '680 mg', pctDailyValue: 68 },
      { name: 'Fósforo', amount: '450 mg', pctDailyValue: 45 },
    ],
    isNatural: false,
    warnings: ['EXCESO EN GRASAS SATURADAS', 'EXCESO EN SODIO'],
    storage: 'Refrigerador cubierto en papel vegetal o recipiente cerrado para evitar secado.',
    waterL: 5060,
    landM2: 21.0,
    soilRisk: 'Alto',
    co2Kg: 13.5,
    shelfLifeTypicalDays: 15,
    packaging: 'Plástico al vacío',
  },
  // Granos & Cereales
  {
    keywords: ['arroz', 'diana', 'roba', 'floricer'],
    category: 'Granos & Cereales',
    servingSize: '1/2 taza cocido (100g) o 45g crudo',
    cals100g: 360,
    prot100g: 7.1,
    carbs100g: 80.0,
    sugar100g: 0.1,
    fiber100g: 1.3,
    fat100g: 0.7,
    satFat100g: 0.2,
    sodium100g: 2,
    micronutrients: [
      { name: 'Tiamina (B1)', amount: '0.4 mg', pctDailyValue: 33 },
      { name: 'Hierro', amount: '4.2 mg', pctDailyValue: 23 },
    ],
    isNatural: true,
    storage: 'Lugar fresco, seco y hermético para evitar gorgojos; vida útil prolongada.',
    waterL: 2497, // Cultivo inundado
    landM2: 2.8,
    soilRisk: 'Moderado',
    co2Kg: 2.7, // Emisiones de metano en arrozales
    shelfLifeTypicalDays: 365,
    packaging: 'Bolsa plástica sellada',
  },
  {
    keywords: ['lenteja', 'lentejas', 'frijol', 'frijoles', 'garbanzo', 'garbanzos'],
    category: 'Granos & Cereales',
    servingSize: '1/2 taza cocida (100g)',
    cals100g: 352,
    prot100g: 24.6,
    carbs100g: 63.4,
    sugar100g: 2.0,
    fiber100g: 10.7,
    fat100g: 1.1,
    satFat100g: 0.2,
    sodium100g: 6,
    micronutrients: [
      { name: 'Hierro', amount: '6.5 mg', pctDailyValue: 36 },
      { name: 'Folato (Ácido Fólico)', amount: '479 µg', pctDailyValue: 120 },
      { name: 'Potasio', amount: '969 mg', pctDailyValue: 21 },
    ],
    isNatural: true,
    storage: 'Frasco hermético en lugar oscuro y seco.',
    waterL: 3970,
    landM2: 3.5,
    soilRisk: 'Bajo', // Las legumbres fijan nitrógeno de forma natural, mejorando el suelo
    co2Kg: 0.9, // Muy bajas emisiones
    shelfLifeTypicalDays: 365,
    packaging: 'Bolsa de polietileno',
  },
  {
    keywords: ['pasta', 'spaghetti', 'fideos', 'doria', 'macarrones'],
    category: 'Granos & Cereales',
    servingSize: '80g crudo (1 plato)',
    cals100g: 371,
    prot100g: 13.0,
    carbs100g: 74.0,
    sugar100g: 2.5,
    fiber100g: 3.2,
    fat100g: 1.5,
    satFat100g: 0.3,
    sodium100g: 5,
    micronutrients: [
      { name: 'Hierro', amount: '3.6 mg', pctDailyValue: 20 },
      { name: 'Ácido Fólico', amount: '168 µg', pctDailyValue: 42 },
    ],
    isNatural: true,
    storage: 'Alacena en ambiente seco.',
    waterL: 1849,
    landM2: 1.7,
    soilRisk: 'Bajo',
    co2Kg: 1.4,
    shelfLifeTypicalDays: 365,
    packaging: 'Bolsa plástica',
  },
  {
    keywords: ['pan', 'tajado', 'bimbo', 'artesanal'],
    category: 'Panadería',
    servingSize: '2 tajadas (50g)',
    cals100g: 265,
    prot100g: 9.0,
    carbs100g: 49.0,
    sugar100g: 5.0,
    fiber100g: 2.7,
    fat100g: 3.2,
    satFat100g: 0.7,
    sodium100g: 490,
    micronutrients: [
      { name: 'Calcio', amount: '120 mg', pctDailyValue: 12 },
      { name: 'Hierro', amount: '2.5 mg', pctDailyValue: 14 },
    ],
    isNatural: false,
    warnings: ['EXCESO EN SODIO'],
    storage: 'Bolsa cerrada en lugar fresco; para extender vida útil congelar rebanadas.',
    waterL: 1608,
    landM2: 1.9,
    soilRisk: 'Bajo',
    co2Kg: 1.6,
    shelfLifeTypicalDays: 14,
    packaging: 'Bolsa plástica con alambre / clip',
  },
  // Condimentos & Aceites
  {
    keywords: ['aceite', 'premier', 'girasol', 'oliva', 'canola', 'vegetal', 'maiz', 'maíz', 'soya', 'palma'],
    category: 'Condimentos & Aceites',
    servingSize: '1 cucharada (14g / 15ml)',
    cals100g: 884, // ~124 kcal por cucharada de 14g / 15ml
    prot100g: 0,
    carbs100g: 0,
    sugar100g: 0,
    fiber100g: 0,
    fat100g: 100, // 100% lípidos
    satFat100g: 14,
    sodium100g: 0,
    micronutrients: [
      { name: 'Vitamina E (Alfa-tocoferol)', amount: '14.8 mg', pctDailyValue: 99 },
      { name: 'Ácidos Grasos Monoinsaturados (Omega-9)', amount: '60 g' },
      { name: 'Ácidos Grasos Poliinsaturados (Omega-6)', amount: '26 g' },
    ],
    isNatural: true,
    storage: 'Lugar fresco, oscuro y seco; tapar herméticamente para evitar oxidación.',
    waterL: 1800,
    landM2: 2.4,
    soilRisk: 'Moderado',
    co2Kg: 2.9,
    shelfLifeTypicalDays: 365,
    packaging: 'Botella PET reciclable',
  },
  {
    keywords: ['mantequilla', 'margarina', 'ghee'],
    category: 'Condimentos & Aceites',
    servingSize: '1 porción (10g)',
    cals100g: 717,
    prot100g: 0.9,
    carbs100g: 0.1,
    sugar100g: 0.1,
    fiber100g: 0,
    fat100g: 81.1,
    satFat100g: 51.4,
    sodium100g: 11,
    micronutrients: [
      { name: 'Vitamina A', amount: '684 µg', pctDailyValue: 76 },
    ],
    isNatural: true,
    warnings: ['EXCESO EN GRASAS SATURADAS'],
    storage: 'Refrigerado entre 2°C y 6°C.',
    waterL: 5553,
    landM2: 8.7,
    soilRisk: 'Alto',
    co2Kg: 9.2,
    shelfLifeTypicalDays: 90,
    packaging: 'Papel encerado / tarrina',
  },
  {
    keywords: ['sal', 'refisal'],
    category: 'Condimentos & Aceites',
    servingSize: '1 pizca (1g)',
    cals100g: 0,
    prot100g: 0,
    carbs100g: 0,
    sugar100g: 0,
    fiber100g: 0,
    fat100g: 0,
    satFat100g: 0,
    sodium100g: 38758,
    micronutrients: [
      { name: 'Sodio', amount: '38.8 g' },
      { name: 'Yodo', amount: '2000 µg', pctDailyValue: 1333 },
    ],
    isNatural: true,
    warnings: ['EXCESO EN SODIO'],
    storage: 'Lugar seco en salero hermético.',
    waterL: 5,
    landM2: 0.1,
    soilRisk: 'Bajo',
    co2Kg: 0.1,
    shelfLifeTypicalDays: 1800,
    packaging: 'Bolsa plástica',
  },
  // Mascotas (no comestible para humanos)
  {
    keywords: ['perro', 'gato', 'mascota', 'pedigree', 'dog chow', 'cat chow', 'whiskas', 'ringo', 'filpo', 'chunky'],
    category: 'Mascotas',
    servingSize: 'Porción para mascota',
    cals100g: 0,
    prot100g: 0,
    carbs100g: 0,
    sugar100g: 0,
    fiber100g: 0,
    fat100g: 0,
    satFat100g: 0,
    sodium100g: 0,
    micronutrients: [],
    isNatural: false,
    storage: 'Lugar fresco y seco alejado de roedores e insectos.',
    waterL: 800,
    landM2: 1.0,
    soilRisk: 'Moderado',
    co2Kg: 1.5,
    shelfLifeTypicalDays: 180,
    packaging: 'Bolsa multicapa',
  },
  // Aseo & Limpieza (manejo de productos de despensa no alimenticios)
  {
    keywords: ['detergente', 'jabon', 'jabón', 'limpido', 'límpido', 'cloro', 'papel'],
    category: 'Aseo & Limpieza',
    servingSize: '1 dosis / porción de uso doméstico',
    cals100g: 0,
    prot100g: 0,
    carbs100g: 0,
    sugar100g: 0,
    fiber100g: 0,
    fat100g: 0,
    satFat100g: 0,
    sodium100g: 0,
    micronutrients: [],
    isNatural: false,
    storage: 'Fuera del alcance de niños y alimentos. Lugar seco y ventilado.',
    waterL: 450,
    landM2: 0.2,
    soilRisk: 'Alto',
    co2Kg: 2.1,
    shelfLifeTypicalDays: 730,
    packaging: 'Envase plástico rígido o bolsa doypack',
  },
];

// ============================================================================
// MOTOR DE CÁLCULO E INFERENCIA NUTRI-ECO E ISA
// ============================================================================
export function getFoodIntelligence(item: PantryItem): FoodIntelligenceData {
  const cleanName = item.name.toLowerCase().trim();

  // 1. Buscar coincidencia en la base de datos de alimentos
  let matched = KNOWN_FOODS.find((kf) =>
    kf.keywords.some((kw) => cleanName.includes(kw))
  );

  // 2. Si no coincide exactamente, inferir por categoría y datos existentes
  const category = item.category || 'Despensa';
  const u = (item.unit || '').toLowerCase().trim();
  const qty = Math.max(0.001, Number(item.quantity) || 1);

  // Detección estricta de unidades
  const isMl = u === 'ml' || u.includes('mili') || u.includes('mililitro') || u === 'cc' || u === 'cm3';
  const isLiter = !isMl && (u === 'l' || u === 'lt' || u.includes('litro'));
  const isKg = u.startsWith('kg') || u.includes('kilo') || u.includes('kilogramo');
  const isGrams = !isKg && (u === 'g' || u === 'gr' || u.includes('gram'));
  const isLb = u.includes('lb') || u.includes('libra');

  // Gramaje total real del producto en despensa
  let totalItemGrams = 250;
  const density = cleanName.includes('aceite') ? 0.92 : cleanName.includes('leche') ? 1.03 : 1.0;

  if (isGrams || isMl) {
    totalItemGrams = Math.max(1, Math.round(qty * density));
  } else if (isKg || isLiter) {
    totalItemGrams = Math.max(1, Math.round(qty * 1000 * density));
  } else if (isLb) {
    totalItemGrams = Math.max(1, Math.round(qty * 500));
  } else {
    // Buscar si el nombre incluye peso explícito (ej. "2700ml", "1000g")
    const matchedGrams = cleanName.match(/(\d+)\s*(g|gr|gramos|ml|mililitros|cc)/i);
    const matchedKg = cleanName.match(/(\d+(?:\.\d+)?)\s*(kg|kilos|litros|l)\b/i);
    if (matchedGrams) {
      totalItemGrams = Math.max(1, Math.round(parseFloat(matchedGrams[1]) * density * qty));
    } else if (matchedKg) {
      totalItemGrams = Math.max(1, Math.round(parseFloat(matchedKg[1]) * 1000 * density * qty));
    } else {
      totalItemGrams = (matched?.servingSize ? 250 : 200) * qty;
    }
  }

  // Precios: sincronizar total_price y unit_price
  let totalPriceCOP = Number(item.total_price) || 0;
  if (totalPriceCOP <= 0 && Number(item.unit_price) > 0) {
    // Si unit_price es pequeño (ej. 19.26 por ml), el total es unit_price * qty
    // Si unit_price ya era el precio total del envase (ej. 52000), usarlo como total
    if (Number(item.unit_price) > 1000 && qty > 50) {
      totalPriceCOP = Number(item.unit_price);
    } else {
      totalPriceCOP = Math.round(Number(item.unit_price) * qty * 100) / 100;
    }
  }
  const unitPriceCOP = qty > 0 && totalPriceCOP > 0 ? totalPriceCOP / qty : Number(item.unit_price) || 0;

  let servingSize = matched?.servingSize || '100g o 1 porción';

  // Gramos de la porción oficial
  let servingGrams = 100;
  if (servingSize.includes('14g') || servingSize.includes('15ml')) servingGrams = 14;
  else if (servingSize.includes('10g')) servingGrams = 10;
  else if (servingSize.includes('50g')) servingGrams = 50;
  else if (servingSize.includes('80g')) servingGrams = 80;
  else if (servingSize.includes('120g')) servingGrams = 120;
  else if (servingSize.includes('250ml') || servingSize.includes('250g')) servingGrams = 250;

  // Macronutrientes por 100g
  // IMPORTANTE: NO USAR || 4 o || 15 porque para aceites y otros alimentos 0g es el valor real
  const prot100g =
    item.protein_g !== undefined && item.protein_g !== null && !isNaN(Number(item.protein_g))
      ? Number(item.protein_g)
      : matched?.prot100g !== undefined
      ? matched.prot100g
      : category.includes('Proteína')
      ? 20
      : 0;

  const carbs100g =
    item.carbs_g !== undefined && item.carbs_g !== null && !isNaN(Number(item.carbs_g))
      ? Number(item.carbs_g)
      : matched?.carbs100g !== undefined
      ? matched.carbs100g
      : category.includes('Grano') || category.includes('Pan')
      ? 50
      : 0;

  const fat100g =
    item.fat_g !== undefined && item.fat_g !== null && !isNaN(Number(item.fat_g))
      ? Number(item.fat_g)
      : matched?.fat100g !== undefined
      ? matched.fat100g
      : category.includes('Aceite')
      ? 100
      : 0;

  // Calorías por 100g
  let cals100g = 0;
  if (Number(item.total_calories) > 0 && totalItemGrams > 0) {
    cals100g = Math.round((Number(item.total_calories) / totalItemGrams) * 100);
  } else if (Number(item.calories_per_unit) > 0) {
    if (Number(item.calories_per_unit) > 800) {
      // Si el número es el total de todo el empaque (ej. 22410 kcal para 2700ml):
      cals100g = totalItemGrams > 0 ? Math.round((Number(item.calories_per_unit) / totalItemGrams) * 100) : matched?.cals100g || 150;
    } else if (servingGrams > 0 && servingGrams < 90 && Number(item.calories_per_unit) < 400) {
      // Si es el valor de 1 porción pequeña (ej. 125 kcal para 14g de aceite)
      cals100g = Math.round((Number(item.calories_per_unit) / servingGrams) * 100);
    } else {
      cals100g = Number(item.calories_per_unit);
    }
  } else if (matched?.cals100g !== undefined) {
    cals100g = matched.cals100g;
  } else {
    // Estimación Atwater: 4 kcal/g prot + 4 kcal/g carb + 9 kcal/g grasa
    cals100g = Math.round((prot100g * 4) + (carbs100g * 4) + (fat100g * 9));
    if (cals100g <= 0 && !cleanName.includes('sal') && !cleanName.includes('agua')) cals100g = 50;
  }

  // Valores oficiales de la porción oficial de etiqueta
  const cals = Math.round((cals100g / 100) * servingGrams);
  const totalPackageCalories =
    Number(item.total_calories) > 0
      ? Math.round(Number(item.total_calories))
      : Number(item.calories_per_unit) > 800
      ? Math.round(Number(item.calories_per_unit))
      : totalItemGrams > 0
      ? Math.round((cals100g / 100) * totalItemGrams)
      : Math.round(cals * qty);

  const prot =
    item.protein_g !== undefined && item.protein_g !== null && !isNaN(Number(item.protein_g))
      ? Number(item.protein_g)
      : Math.round(((prot100g / 100) * servingGrams) * 10) / 10;

  const carbs =
    item.carbs_g !== undefined && item.carbs_g !== null && !isNaN(Number(item.carbs_g))
      ? Number(item.carbs_g)
      : Math.round(((carbs100g / 100) * servingGrams) * 10) / 10;

  const fat =
    item.fat_g !== undefined && item.fat_g !== null && !isNaN(Number(item.fat_g))
      ? Number(item.fat_g)
      : Math.round(((fat100g / 100) * servingGrams) * 10) / 10;

  const sugar =
    item.sugar_g !== undefined && item.sugar_g !== null && !isNaN(Number(item.sugar_g))
      ? Number(item.sugar_g)
      : matched?.sugar100g !== undefined
      ? Math.round(((matched.sugar100g / 100) * servingGrams) * 10) / 10
      : 0;

  const fiber =
    item.fiber_g !== undefined && item.fiber_g !== null && !isNaN(Number(item.fiber_g))
      ? Number(item.fiber_g)
      : matched?.fiber100g !== undefined
      ? Math.round(((matched.fiber100g / 100) * servingGrams) * 10) / 10
      : 0;

  const satFat =
    item.saturated_fat_g !== undefined && item.saturated_fat_g !== null && !isNaN(Number(item.saturated_fat_g))
      ? Number(item.saturated_fat_g)
      : matched?.satFat100g !== undefined
      ? Math.round(((matched.satFat100g / 100) * servingGrams) * 10) / 10
      : Math.round(fat * 0.2 * 10) / 10;

  const sodium =
    item.sodium_mg !== undefined && item.sodium_mg !== null && !isNaN(Number(item.sodium_mg))
      ? Number(item.sodium_mg)
      : matched?.sodium100g !== undefined
      ? Math.round((matched.sodium100g / 100) * servingGrams)
      : 0;
  const isNatural = matched ? matched.isNatural : !cleanName.includes('paquete') && !cleanName.includes('snack');
  const storageAdvice = matched?.storage || 'Mantener en lugar fresco, seco y protegido de la luz directa.';
  const micronutrients = matched?.micronutrients || [
    { name: 'Energía Celular', amount: `${Math.round(cals)} kcal` },
    { name: 'Macronutrientes equilibrados', amount: 'Aporte base' },
  ];

  // 3. Determinar sellos de advertencia colombianos (Resolución 810/2021 y 2492/2022)
  const warnings: Array<
    'EXCESO EN AZÚCARES' | 'EXCESO EN SODIO' | 'EXCESO EN GRASAS SATURADAS' | 'EXCESO EN GRASAS TRANS' | 'CONTIENE EDULCORANTES'
  > = [];

  if (matched?.warnings) {
    warnings.push(...matched.warnings);
  } else if (!isNatural) {
    // Umbrales MinSalud Colombia por 100g de sólidos:
    // Azúcares añadidos: >= 10% del total de energía proveniente de azúcares libres
    if (sugar >= 10) warnings.push('EXCESO EN AZÚCARES');
    // Sodio: >= 300 mg por 100g
    if (sodium >= 300) warnings.push('EXCESO EN SODIO');
    // Grasas saturadas: >= 10% del total de energía de grasas saturadas (~4.5g / 100g)
    if (satFat >= 4.5) warnings.push('EXCESO EN GRASAS SATURADAS');
  }

  // 4. Determinar métricas de consumo de recursos (ISA Pillars)
  let waterL = matched?.waterL || 800;
  let landM2 = matched?.landM2 || 1.5;
  let soilRisk = matched?.soilRisk || 'Moderado';
  let co2Kg = matched?.co2Kg || 1.8;
  let packaging = matched?.packaging || 'Empaque estándar reciclable';

  if (!matched) {
    if (category.includes('Proteína')) {
      waterL = cleanName.includes('res') || cleanName.includes('carne') ? 15400 : 4500;
      landM2 = 25.0;
      soilRisk = 'Alto';
      co2Kg = 12.0;
    } else if (category.includes('Lácteo')) {
      waterL = 2500;
      landM2 = 9.0;
      soilRisk = 'Moderado';
      co2Kg = 4.5;
    } else if (category.includes('Fruta') || category.includes('Verdura')) {
      waterL = 500;
      landM2 = 0.6;
      soilRisk = 'Bajo';
      co2Kg = 0.6;
    } else if (category.includes('Grano')) {
      waterL = 2200;
      landM2 = 2.5;
      soilRisk = 'Bajo';
      co2Kg = 1.5;
    } else if (category.includes('Aseo')) {
      waterL = 400;
      landM2 = 0.2;
      soilRisk = 'Alto';
      co2Kg = 2.5;
    }
  }

  // Clasificación hídrica
  let waterCategory: 'Baja' | 'Moderada' | 'Alta' | 'Extrema' = 'Baja';
  if (waterL > 10000) waterCategory = 'Extrema';
  else if (waterL > 3000) waterCategory = 'Alta';
  else if (waterL > 1000) waterCategory = 'Moderada';

  const waterEquivalence =
    waterL > 10000
      ? `Equivale al agua de ~${Math.round(waterL / 100)} duchas de 5 minutos por cada kg.`
      : waterL > 3000
      ? `Equivale al consumo de agua potable de 1 persona durante ${Math.round(waterL / 2)} días.`
      : `Huella hídrica eficiente (~${waterL} L/kg).`;

  // Equivalencia CO2 en km de automóvil
  const carbonEquivalenceKmCar = Math.round((co2Kg / 0.18) * 10) / 10; // Auto promedio emite ~0.18 kg CO2/km

  // 5. Tasa de Entropía del Sistema Doméstico
  const shelfLife = item.shelf_life_days || matched?.shelfLifeTypicalDays || 14;
  let entropyScore = 20; // 0 (baja entropía) a 100 (alta entropía)
  let entropyLevel: 'Baja' | 'Media' | 'Alta' = 'Baja';
  let perishabilityRisk = 'Estable en alacena';

  if (shelfLife <= 5) {
    entropyScore = 85;
    entropyLevel = 'Alta';
    perishabilityRisk = 'Alta perecibilidad (<5 días). Si no se consume rápido genera pérdida energética y desperdicio.';
  } else if (shelfLife <= 15) {
    entropyScore = 50;
    entropyLevel = 'Media';
    perishabilityRisk = 'Vida útil moderada. Requiere monitoreo regular en la despensa.';
  } else {
    entropyScore = 20;
    entropyLevel = 'Baja';
    perishabilityRisk = 'Alta estabilidad biológica y orden energético preservado en el tiempo.';
  }

  const entropyExplanation = `Al ingresar a tu despensa, este producto aporta un nivel de entropía ${entropyLevel.toLowerCase()} debido a su tiempo de vida útil (${shelfLife} días) y composición de empaque (${packaging}).`;

  // 6. CÁLCULO DE EFICIENCIA ECONÓMICA & PRECIO POR GRAMO NUTRICIONAL
  // Usamos el totalItemGrams, totalPriceCOP y unitPriceCOP ya determinados con exactitud y densidad
  const pricePerGramCOP =
    totalItemGrams > 0 && totalPriceCOP > 0
      ? Math.round((totalPriceCOP / totalItemGrams) * 100) / 100
      : 0;

  // Gramos de nutrientes útiles por 100g (proteína + fibra + carbohidratos limpios + lípidos esenciales en aceites)
  const cleanCarbs100g = isNatural ? Math.max(0, carbs - sugar) : Math.max(0, carbs - sugar * 1.5);
  let usefulNutrients100g = prot100g + fiber * 1.5 + (cleanCarbs100g * 0.25);
  if (cleanName.includes('aceite') || category.includes('Aceite')) {
    usefulNutrients100g = 20; // Ácidos grasos monoinsaturados/poliinsaturados esenciales y vitamina E
  }
  usefulNutrients100g = Math.max(0.1, usefulNutrients100g);

  // Proteína total en gramos en todo el stock disponible
  const totalProteinGramsInStock = (prot100g / 100) * totalItemGrams;
  const totalUsefulNutrientGrams = (usefulNutrients100g / 100) * totalItemGrams;

  // Costo por gramo de proteína neta (solo si el alimento aporta proteína real)
  const pricePerProteinGramCOP =
    totalProteinGramsInStock > 0 && totalPriceCOP > 0
      ? Math.round(totalPriceCOP / totalProteinGramsInStock)
      : 0;

  // Costo por gramo de nutriente útil
  const pricePerNutrientGramCOP =
    totalUsefulNutrientGrams > 0 && totalPriceCOP > 0
      ? Math.round(totalPriceCOP / totalUsefulNutrientGrams)
      : Math.round(pricePerGramCOP);

  // Peso unitario estimado para visualización (g)
  const estimatedWeightGrams =
    isGrams || isMl ? Math.round((totalItemGrams / qty) * 100) / 100 : Math.round(totalItemGrams / qty);

  // Equivalencias volumétricas y de porción
  const totalItemMl = isMl
    ? Math.round(qty)
    : isLiter
    ? Math.round(qty * 1000)
    : Math.round(totalItemGrams / density);

  const pricePerMlCOP =
    totalItemMl > 0 && totalPriceCOP > 0
      ? Math.round((totalPriceCOP / totalItemMl) * 100) / 100
      : undefined;

  const pricePer100gCOP = pricePerGramCOP > 0 ? Math.round(pricePerGramCOP * 100) : undefined;
  const pricePer100mlCOP = pricePerMlCOP ? Math.round(pricePerMlCOP * 100) : undefined;
  const pricePerServingCOP =
    pricePerGramCOP > 0 && servingGrams > 0 ? Math.round(pricePerGramCOP * servingGrams) : undefined;
  const totalServings =
    totalItemGrams > 0 && servingGrams > 0 ? Math.round(totalItemGrams / servingGrams) : undefined;

  // Score de Eficiencia Económica (0 a 100)
  // Menor precio por gramo de nutriente útil = Mayor retorno biológico por peso gastado ($ COP)
  let economicScore = 70; // neutro si no hay precio registrado
  let economicNutritionalEfficiency: 'Excelente' | 'Alta' | 'Moderada' | 'Baja' | 'Ineficiente' = 'Moderada';
  let economicExplanation = '';

  if (totalPriceCOP > 0 && pricePerNutrientGramCOP > 0) {
    if (prot100g === 0 && (cleanName.includes('aceite') || category.includes('Aceite'))) {
      economicScore = 85;
      economicNutritionalEfficiency = 'Alta';
      economicExplanation = `Aporte energético y lipídico (~$${pricePerGramCOP} COP por gramo). No aporta proteína para masa muscular, pero es una fuente concentrada de energía culinaria (~$${pricePerNutrientGramCOP} COP/g de lípidos y vitamina E).`;
    } else if (pricePerNutrientGramCOP <= 40) {
      economicScore = 95;
      economicNutritionalEfficiency = 'Excelente';
      economicExplanation = `Costo-beneficio nutricional sobresaliente (~$${pricePerNutrientGramCOP} COP por gramo de nutriente útil). Es un pilar de máximo rendimiento para el presupuesto familiar.`;
    } else if (pricePerNutrientGramCOP <= 90) {
      economicScore = 85;
      economicNutritionalEfficiency = 'Alta';
      economicExplanation = `Alta eficiencia económica (~$${pricePerNutrientGramCOP} COP por gramo nutricional). Aporta densidad biológica a un costo muy accesible.`;
    } else if (pricePerNutrientGramCOP <= 180) {
      economicScore = 70;
      economicNutritionalEfficiency = 'Moderada';
      economicExplanation = `Costo moderado por gramo de nutriente (~$${pricePerNutrientGramCOP} COP/g). Valor estándar para alimentos frescos o proteicos de calidad.`;
    } else if (pricePerNutrientGramCOP <= 350) {
      economicScore = 50;
      economicNutritionalEfficiency = 'Baja';
      economicExplanation = `Costo nutricional elevado (~$${pricePerNutrientGramCOP} COP/g). Requiere mayor inversión económica por cada gramo de macronutriente aprovechable.`;
    } else {
      economicScore = 30;
      economicNutritionalEfficiency = 'Ineficiente';
      economicExplanation = `Baja eficiencia nutricional por peso gastado (~$${pricePerNutrientGramCOP} COP/g). Alta prima económica con aporte nutricional reducido o calorías vacías.`;
    }
  } else {
    economicExplanation = 'Precio no especificado o en base cero. Se asume un valor de referencia neutro.';
  }

  // 7. CÁLCULO DEL ÍNDICE ISA INTEGRAL (Nutrición + Ecosistema + Precio por Gramo Nutricional)
  // Ponderación: 40% Densidad Nutricional, 35% Huella Ecológica (100 - carga), 25% Eficiencia Económica por gramo
  let nutritionScore = 0;
  nutritionScore += Math.min(35, prot * 1.5);
  nutritionScore += Math.min(20, fiber * 4);
  nutritionScore += Math.min(25, (cals / 300) * 15);
  if (isNatural) nutritionScore += 15;
  nutritionScore -= warnings.length * 10;
  nutritionScore = Math.max(10, Math.min(100, nutritionScore));

  let ecoBurden = 0;
  ecoBurden += Math.min(35, (waterL / 8000) * 35);
  ecoBurden += Math.min(30, (co2Kg / 15) * 30);
  ecoBurden += Math.min(20, (landM2 / 30) * 20);
  ecoBurden += (entropyScore / 100) * 15;
  ecoBurden = Math.max(10, Math.min(100, ecoBurden));

  const ecoScore = Math.max(0, 100 - ecoBurden);

  // Triple equilibrio: Nutrición (40%), Recursos naturales (35%), Precio/gramo nutricional (25%)
  let rawIsa = Math.round(nutritionScore * 0.40 + ecoScore * 0.35 + economicScore * 0.25);
  rawIsa = Math.max(15, Math.min(99, rawIsa));

  let isaGrade: 'A+' | 'A' | 'B' | 'C' | 'D' = 'B';
  let nutriEcoBalance: 'Excelente' | 'Favorable' | 'Equilibrado' | 'Desfavorable' = 'Equilibrado';
  let balanceExplanation = '';

  if (rawIsa >= 85) {
    isaGrade = 'A+';
    nutriEcoBalance = 'Excelente';
    balanceExplanation =
      'Excelente equilibrio: Gran densidad nutricional, baja huella sobre recursos naturales y un precio por gramo de nutriente sumamente eficiente.';
  } else if (rawIsa >= 70) {
    isaGrade = 'A';
    nutriEcoBalance = 'Favorable';
    balanceExplanation =
      'Equilibrio favorable: Alimento nutritivo con huella hídrica y ecológica controlada y costo por gramo nutricional accesible.';
  } else if (rawIsa >= 50) {
    isaGrade = 'B';
    nutriEcoBalance = 'Equilibrado';
    balanceExplanation =
      'Equilibrio moderado: Aporta nutrientes necesarios pero con una huella de recursos o un costo por gramo apreciable.';
  } else if (rawIsa >= 35) {
    isaGrade = 'C';
    nutriEcoBalance = 'Desfavorable';
    balanceExplanation =
      'Equilibrio desfavorable: Carga elevada de agua/emisiones o costo por gramo de nutriente desproporcionado respecto a su aporte neto.';
  } else {
    isaGrade = 'D';
    nutriEcoBalance = 'Desfavorable';
    balanceExplanation =
      'Alto impacto ecológico / Ineficiencia: Gran huella sobre recursos naturales, sellos de advertencia o costo excesivo por nutriente útil.';
  }

  return {
    productName: item.name,
    category,
    nutrition: {
      servingSize,
      calories: Math.round(cals),
      totalPackageCalories,
      protein_g: Math.round(prot * 10) / 10,
      carbs_g: Math.round(carbs * 10) / 10,
      sugar_g: Math.round(sugar * 10) / 10,
      fiber_g: Math.round(fiber * 10) / 10,
      fat_g: Math.round(fat * 10) / 10,
      saturated_fat_g: Math.round(satFat * 10) / 10,
      sodium_mg: Math.round(sodium),
      micronutrients,
      colombianWarningLabels: warnings,
      isNaturalFood: isNatural,
      storageAdvice,
    },
    isa: {
      waterLitersPerKg: waterL,
      waterCategory,
      waterEquivalence,
      landUseM2PerKg: landM2,
      soilDegradationRisk: soilRisk,
      soilImpactDetail: `Requiere aprox. ${landM2} m² de superficie agrícola por kg producido con riesgo de degradación edáfica ${soilRisk.toLowerCase()}.`,
      carbonKgCO2ePerKg: co2Kg,
      carbonLevel: co2Kg > 10 ? 'Alto' : co2Kg > 2.5 ? 'Moderado' : 'Bajo',
      carbonEquivalenceKmCar,
      entropyScore,
      entropyLevel,
      perishabilityRisk,
      packagingImpact: packaging,
      entropyExplanation,
    },
    economics: {
      pricePerUnitCOP: Math.round(unitPriceCOP * 100) / 100,
      totalPriceCOP: Math.round(totalPriceCOP),
      totalItemGrams,
      totalItemMl,
      estimatedWeightGrams,
      pricePerGramCOP,
      pricePerMlCOP,
      pricePer100gCOP,
      pricePer100mlCOP,
      pricePerServingCOP,
      totalServings,
      pricePerProteinGramCOP,
      pricePerNutrientGramCOP,
      economicNutritionalEfficiency,
      economicScore,
      economicExplanation,
    },
    isaScore: rawIsa,
    isaGrade,
    nutriEcoBalance,
    balanceExplanation,
  };
}
