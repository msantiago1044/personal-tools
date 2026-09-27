/**
 * MOTOR DE INFERENCIA DE PRESENTACIÓN FÍSICA Y UNIDADES DE PRODUCTO
 * Calibrado para supermercados de Colombia (D1, Éxito, Ara, Jumbo, Olímpica, Carulla, Zapatoca, etc.)
 *
 * Deduce el peso, volumen, cantidad real, unidad estándar (ml, g, kg, un)
 * y perfil nutricional por porción a partir del nombre comercial del producto,
 * el precio total pagado en caja ($ COP) y la tienda.
 */

export interface InferredProductPresentation {
  name: string;
  category: string;
  quantity: number;
  unit: 'mililitros' | 'gramos' | 'litros' | 'kg' | 'unidades' | 'latas' | 'paquete';
  unit_price: number;
  total_price: number;
  shelf_life_days: number;
  serving_size: string;
  calories_per_unit: number; // Calorías por porción
  total_calories: number; // Calorías de todo el empaque
  protein_g: number; // Proteína por porción
  carbs_g: number; // Carbohidratos por porción
  fat_g: number; // Grasas por porción
  is_human_food: boolean;
  confidence: 'explicit_text' | 'price_and_store_inferred' | 'heuristic_default';
  explanation: string;
}

export function inferProductPhysicalPresentation(
  rawName: string,
  totalPriceCOP: number,
  storeName?: string,
  existingUnit?: string,
  existingQty?: number
): InferredProductPresentation {
  const cleanName = (rawName || '').toLowerCase().trim();
  const price = totalPriceCOP > 0 ? totalPriceCOP : 0;

  // 1. REVISAR SI EL NOMBRE YA CONTIENE EL GRAMAJE O VOLUMEN EXPLÍCITO
  const matchExplicitMl = cleanName.match(/(\d+(?:[.,]\d+)?)\s*(ml|mililitros|cc|cm3)\b/i);
  const matchExplicitL = cleanName.match(/(\d+(?:[.,]\d+)?)\s*(l|lt|lts|litro|litros)\b/i);
  const matchExplicitKg = cleanName.match(/(\d+(?:[.,]\d+)?)\s*(kg|kilo|kilos|kilogramo)\b/i);
  const matchExplicitG = cleanName.match(/(\d+(?:[.,]\d+)?)\s*(g|gr|grs|gramo|gramos)\b/i);
  const matchExplicitLb = cleanName.match(/(\d+(?:[.,]\d+)?)\s*(lb|lbs|libra|libras)\b/i);
  const matchExplicitUnits = cleanName.match(/x\s*(\d+)\b|(\d+)\s*(un|und|unidades|piezas|rollos|sobres|latas)\b/i);

  if (matchExplicitMl) {
    const ml = parseFloat(matchExplicitMl[1].replace(',', '.'));
    return buildPresentation({
      name: rawName,
      quantity: ml,
      unit: 'mililitros',
      price,
      cleanName,
      confidence: 'explicit_text',
      explanation: `Extraído directamente del empaque (${ml} ml).`,
    });
  }

  if (matchExplicitL) {
    const l = parseFloat(matchExplicitL[1].replace(',', '.'));
    const ml = l * 1000;
    return buildPresentation({
      name: rawName,
      quantity: ml >= 1000 ? ml : l,
      unit: ml >= 1000 ? 'mililitros' : 'litros',
      price,
      cleanName,
      confidence: 'explicit_text',
      explanation: `Extraído directamente del empaque (${l} L = ${ml} ml).`,
    });
  }

  if (matchExplicitKg) {
    const kg = parseFloat(matchExplicitKg[1].replace(',', '.'));
    const g = kg * 1000;
    return buildPresentation({
      name: rawName,
      quantity: g,
      unit: 'gramos',
      price,
      cleanName,
      confidence: 'explicit_text',
      explanation: `Extraído directamente del empaque (${kg} kg = ${g} g).`,
    });
  }

  if (matchExplicitG) {
    const g = parseFloat(matchExplicitG[1].replace(',', '.'));
    return buildPresentation({
      name: rawName,
      quantity: g,
      unit: 'gramos',
      price,
      cleanName,
      confidence: 'explicit_text',
      explanation: `Extraído directamente del empaque (${g} g).`,
    });
  }

  if (matchExplicitLb) {
    const lb = parseFloat(matchExplicitLb[1].replace(',', '.'));
    const g = lb * 500;
    return buildPresentation({
      name: rawName,
      quantity: g,
      unit: 'gramos',
      price,
      cleanName,
      confidence: 'explicit_text',
      explanation: `Extraído directamente del empaque (${lb} libras = ${g} g).`,
    });
  }

  if (matchExplicitUnits) {
    const un = parseInt(matchExplicitUnits[1] || matchExplicitUnits[2] || '1', 10);
    return buildPresentation({
      name: rawName,
      quantity: un,
      unit: 'unidades',
      price,
      cleanName,
      confidence: 'explicit_text',
      explanation: `Extraído directamente del empaque (${un} unidades).`,
    });
  }

  // 2. INFERENCIA INTELIGENTE POR CATEGORÍA DE PRODUCTO, PRECIO ($ COP) Y TIENDA COLOMBIANA

  // --- ACEITES Y GRASAS CULINARIAS ---
  if (cleanName.includes('aceite')) {
    let inferredMl = 1000;
    let desc = 'Botella de 1 Litro';

    if (price >= 42000) {
      // Garrafa grande típica en Colombia (ej. Premier, Gourmet, Diana $48,000 - $55,000 COP)
      inferredMl = 2700;
      desc = 'Garrafa grande de 2,700 ml / 3 Litros';
    } else if (price >= 24000) {
      // Garrafa mediana o aceite de oliva (1,500 - 2,000 ml)
      inferredMl = 1500;
      desc = 'Garrafa mediana de 1,500 ml';
    } else if (price >= 9000) {
      // Botella estándar (900 - 1,000 ml)
      inferredMl = 1000;
      desc = 'Botella estándar de 1,000 ml';
    } else {
      // Cojín o botella pequeña (450 - 500 ml)
      inferredMl = 500;
      desc = 'Cojín económico de 500 ml';
    }

    const unitPrice = Math.round((price / inferredMl) * 100) / 100;
    const servings = Math.round(inferredMl / 15);
    const calsPerServing = 125;
    const totalCals = servings * calsPerServing;

    return {
      name: rawName,
      category: 'Condimentos & Aceites',
      quantity: inferredMl,
      unit: 'mililitros',
      unit_price: unitPrice,
      total_price: price,
      shelf_life_days: 180,
      serving_size: '1 cucharada (14g / 15ml)',
      calories_per_unit: calsPerServing,
      total_calories: totalCals,
      protein_g: 0,
      carbs_g: 0,
      fat_g: 14,
      is_human_food: true,
      confidence: 'price_and_store_inferred',
      explanation: `Por el precio ($${price.toLocaleString()} COP), corresponde a ${desc}.`,
    };
  }

  // --- ARROZ ---
  if (cleanName.includes('arroz')) {
    let inferredGrams = 1000;
    let desc = 'Bolsa de 1 kg';

    if (price >= 18000) {
      inferredGrams = 5000; // 5 kg
      desc = 'Bolsa familiar de 5 kg (5,000 g)';
    } else if (price >= 9000) {
      inferredGrams = 2500; // 2.5 kg o bolsa de 5 libras
      desc = 'Bolsa de 2,500 g (5 libras)';
    } else if (price >= 3200) {
      inferredGrams = 1000; // 1 kg
      desc = 'Bolsa estándar de 1,000 g (1 kg)';
    } else {
      inferredGrams = 500; // 1 libra
      desc = 'Bolsa de 500 g (1 libra)';
    }

    const unitPrice = Math.round((price / inferredGrams) * 100) / 100;
    const servings = Math.round(inferredGrams / 50);
    const calsPerServing = 180;

    return {
      name: rawName,
      category: 'Granos & Cereales',
      quantity: inferredGrams,
      unit: 'gramos',
      unit_price: unitPrice,
      total_price: price,
      shelf_life_days: 365,
      serving_size: '1 porción (50g crudo / 100g cocido)',
      calories_per_unit: calsPerServing,
      total_calories: servings * calsPerServing,
      protein_g: 3.5,
      carbs_g: 40,
      fat_g: 0.5,
      is_human_food: true,
      confidence: 'price_and_store_inferred',
      explanation: `Por el precio ($${price.toLocaleString()} COP), corresponde a ${desc}.`,
    };
  }

  // --- LECHE Y BEBIDAS LÁCTEAS ---
  if (cleanName.includes('leche') && !cleanName.includes('condensada') && !cleanName.includes('crema')) {
    let inferredMl = 1100;
    let desc = 'Bolsa de 1,100 ml';

    if (price >= 19000) {
      inferredMl = 6000;
      desc = 'Pack x 6 bolsas (6,000 ml)';
    } else if (price >= 12000) {
      inferredMl = 3300;
      desc = 'Pack x 3 bolsas (3,300 ml)';
    } else if (price >= 3200) {
      inferredMl = 1100;
      desc = 'Bolsa estándar de 1,100 ml / 1 Litro';
    } else {
      inferredMl = 900;
      desc = 'Bolsa personal de 900 ml';
    }

    const unitPrice = Math.round((price / inferredMl) * 100) / 100;
    const servings = Math.round(inferredMl / 200);
    const calsPerServing = 120;

    return {
      name: rawName,
      category: 'Lácteos & Huevos',
      quantity: inferredMl,
      unit: 'mililitros',
      unit_price: unitPrice,
      total_price: price,
      shelf_life_days: 10,
      serving_size: '1 vaso (200ml)',
      calories_per_unit: calsPerServing,
      total_calories: servings * calsPerServing,
      protein_g: 6.2,
      carbs_g: 9.6,
      fat_g: 6.4,
      is_human_food: true,
      confidence: 'price_and_store_inferred',
      explanation: `Por el precio ($${price.toLocaleString()} COP), corresponde a ${desc}.`,
    };
  }

  // --- HUEVOS ---
  if (cleanName.includes('huevo') || cleanName.includes('huevos')) {
    let inferredUnits = 30;
    let desc = 'Panal / cubeta x 30 unidades';

    if (price >= 14000) {
      inferredUnits = 30;
      desc = 'Panal de 30 huevos AA / AAA';
    } else if (price >= 8000) {
      inferredUnits = 15;
      desc = 'Cubeta de 12 o 15 huevos';
    } else {
      inferredUnits = 6;
      desc = 'Canastilla de 6 huevos';
    }

    const unitPrice = Math.round((price / inferredUnits) * 100) / 100;

    return {
      name: rawName,
      category: 'Lácteos & Huevos',
      quantity: inferredUnits,
      unit: 'unidades',
      unit_price: unitPrice,
      total_price: price,
      shelf_life_days: 28,
      serving_size: '1 huevo (50g)',
      calories_per_unit: 75,
      total_calories: inferredUnits * 75,
      protein_g: 6.3,
      carbs_g: 0.6,
      fat_g: 5.0,
      is_human_food: true,
      confidence: 'price_and_store_inferred',
      explanation: `Por el precio ($${price.toLocaleString()} COP), corresponde a ${desc}.`,
    };
  }

  // --- PECHUGA DE POLLO, POLLO Y CARNES FRESCAS ---
  if (cleanName.includes('pechuga') || cleanName.includes('pollo') || cleanName.includes('carne') || cleanName.includes('res') || cleanName.includes('cerdo') || cleanName.includes('molida')) {
    const isChicken = cleanName.includes('pechuga') || cleanName.includes('pollo');
    let inferredGrams = 1000;
    let desc = 'Bandeja de 1,000 g (1 kg)';

    if (price >= 25000) {
      inferredGrams = isChicken ? 2000 : 1200;
      desc = `Porción grande de ${inferredGrams} g`;
    } else if (price >= 13000) {
      inferredGrams = 1000; // 1 kg
      desc = 'Bandeja de 1,000 g (1 kg)';
    } else if (price >= 6000) {
      inferredGrams = 500; // 500 g / 1 libra
      desc = 'Bandeja de 500 g (1 libra)';
    } else {
      inferredGrams = 350;
      desc = 'Porción individual de 350 g';
    }

    const unitPrice = Math.round((price / inferredGrams) * 100) / 100;
    const servings = Math.round(inferredGrams / 125);
    const calsPerServing = isChicken ? 165 : 210;

    return {
      name: rawName,
      category: 'Proteínas & Carnes',
      quantity: inferredGrams,
      unit: 'gramos',
      unit_price: unitPrice,
      total_price: price,
      shelf_life_days: 4,
      serving_size: '1 filete o porción (125g)',
      calories_per_unit: calsPerServing,
      total_calories: servings * calsPerServing,
      protein_g: isChicken ? 31 : 26,
      carbs_g: 0,
      fat_g: isChicken ? 3.6 : 11,
      is_human_food: true,
      confidence: 'price_and_store_inferred',
      explanation: `Por el precio ($${price.toLocaleString()} COP), corresponde a ${desc}.`,
    };
  }

  // --- PASTAS (ESPAGUETI, TORNILLOS, CONCHAS, DORIA) ---
  if (cleanName.includes('pasta') || cleanName.includes('espagueti') || cleanName.includes('spaghetti') || cleanName.includes('doria') || cleanName.includes('macarron')) {
    let inferredGrams = 500;
    let desc = 'Bolsa de 500 g';

    if (price >= 7000) {
      inferredGrams = 1000;
      desc = 'Paquete de 1,000 g (1 kg)';
    } else if (price >= 2800) {
      inferredGrams = 500;
      desc = 'Paquete de 500 g (1 libra)';
    } else {
      inferredGrams = 250;
      desc = 'Paquete de 250 g';
    }

    const unitPrice = Math.round((price / inferredGrams) * 100) / 100;
    const servings = Math.round(inferredGrams / 80);

    return {
      name: rawName,
      category: 'Granos & Cereales',
      quantity: inferredGrams,
      unit: 'gramos',
      unit_price: unitPrice,
      total_price: price,
      shelf_life_days: 365,
      serving_size: '1 porción (80g)',
      calories_per_unit: 280,
      total_calories: servings * 280,
      protein_g: 10,
      carbs_g: 58,
      fat_g: 1.5,
      is_human_food: true,
      confidence: 'price_and_store_inferred',
      explanation: `Por el precio ($${price.toLocaleString()} COP), corresponde a ${desc}.`,
    };
  }

  // --- LEGUMBRES SECAS (LENTEJAS, FRIJOL, GARBANZO) ---
  if (cleanName.includes('lenteja') || cleanName.includes('frijol') || cleanName.includes('garbanzo') || cleanName.includes('arveja')) {
    let inferredGrams = 500;
    let desc = 'Bolsa de 500 g (1 libra)';

    if (price >= 6500) {
      inferredGrams = 1000;
      desc = 'Bolsa de 1,000 g (1 kg)';
    } else {
      inferredGrams = 500;
      desc = 'Bolsa de 500 g (1 libra)';
    }

    const unitPrice = Math.round((price / inferredGrams) * 100) / 100;
    const servings = Math.round(inferredGrams / 60);

    return {
      name: rawName,
      category: 'Granos & Cereales',
      quantity: inferredGrams,
      unit: 'gramos',
      unit_price: unitPrice,
      total_price: price,
      shelf_life_days: 365,
      serving_size: '1 porción (60g crudo / 120g cocido)',
      calories_per_unit: 200,
      total_calories: servings * 200,
      protein_g: 14,
      carbs_g: 34,
      fat_g: 0.8,
      is_human_food: true,
      confidence: 'price_and_store_inferred',
      explanation: `Por el precio ($${price.toLocaleString()} COP), corresponde a ${desc}.`,
    };
  }

  // --- ATÚN Y ENLATADOS ---
  if (cleanName.includes('atun') || cleanName.includes('atún') || cleanName.includes('sardina')) {
    let inferredGrams = 160;
    let desc = '1 lata de 160 g';

    if (price >= 13000) {
      inferredGrams = 480;
      desc = 'Pack x 3 latas (480 g)';
    } else {
      inferredGrams = 160;
      desc = '1 lata estándar de 160 g';
    }

    const unitPrice = Math.round((price / inferredGrams) * 100) / 100;

    return {
      name: rawName,
      category: 'Proteínas & Carnes',
      quantity: inferredGrams,
      unit: 'gramos',
      unit_price: unitPrice,
      total_price: price,
      shelf_life_days: 720,
      serving_size: '1 lata drenada (~110g)',
      calories_per_unit: 140,
      total_calories: Math.round((inferredGrams / 160) * 140),
      protein_g: 28,
      carbs_g: 0,
      fat_g: 2.5,
      is_human_food: true,
      confidence: 'price_and_store_inferred',
      explanation: `Por el precio ($${price.toLocaleString()} COP), corresponde a ${desc}.`,
    };
  }

  // --- PAN TAJADO Y PANADERÍA ---
  if (cleanName.includes('pan') && (cleanName.includes('tajado') || cleanName.includes('bimbo') || cleanName.includes('comapan') || cleanName.includes('artesanal'))) {
    let inferredGrams = 450;
    let desc = 'Bolsa de 450 g a 500 g';

    if (price >= 8000) {
      inferredGrams = 600;
      desc = 'Pan tajado familiar (600 g)';
    } else {
      inferredGrams = 450;
      desc = 'Pan tajado estándar (450 g)';
    }

    const unitPrice = Math.round((price / inferredGrams) * 100) / 100;
    const servings = Math.round(inferredGrams / 50);

    return {
      name: rawName,
      category: 'Panadería & Harinas',
      quantity: inferredGrams,
      unit: 'gramos',
      unit_price: unitPrice,
      total_price: price,
      shelf_life_days: 14,
      serving_size: '2 rebanadas (50g)',
      calories_per_unit: 130,
      total_calories: servings * 130,
      protein_g: 4.5,
      carbs_g: 25,
      fat_g: 1.5,
      is_human_food: true,
      confidence: 'price_and_store_inferred',
      explanation: `Por el precio ($${price.toLocaleString()} COP), corresponde a ${desc}.`,
    };
  }

  // --- CAFÉ MOLIDO O INSTANTÁNEO ---
  if (cleanName.includes('cafe') || cleanName.includes('café')) {
    let inferredGrams = 500;
    let desc = 'Bolsa de 500 g (1 libra)';

    if (price >= 18000) {
      inferredGrams = 500; // Café especial o 500g Juan Valdez
      desc = 'Bolsa de café especial 500 g';
    } else if (price >= 8000) {
      inferredGrams = 500;
      desc = 'Bolsa estándar de 500 g (1 libra)';
    } else {
      inferredGrams = 250;
      desc = 'Bolsa de 250 g';
    }

    const unitPrice = Math.round((price / inferredGrams) * 100) / 100;

    return {
      name: rawName,
      category: 'Despensa',
      quantity: inferredGrams,
      unit: 'gramos',
      unit_price: unitPrice,
      total_price: price,
      shelf_life_days: 180,
      serving_size: '1 taza preparada (5g café)',
      calories_per_unit: 2,
      total_calories: 200,
      protein_g: 0.2,
      carbs_g: 0.3,
      fat_g: 0,
      is_human_food: true,
      confidence: 'price_and_store_inferred',
      explanation: `Por el precio ($${price.toLocaleString()} COP), corresponde a ${desc}.`,
    };
  }

  // --- ALIMENTOS PARA MASCOTAS (NO COMESTIBLES PARA HUMANOS) ---
  if (cleanName.includes('perro') || cleanName.includes('gato') || cleanName.includes('canamor') || cleanName.includes('chunky') || cleanName.includes('ringo') || cleanName.includes('mirringo') || cleanName.includes('dog chow') || cleanName.includes('cat chow') || cleanName.includes('whiskas') || cleanName.includes('pedigree')) {
    let inferredGrams = 2000;
    if (price >= 30000) inferredGrams = 4000;
    else if (price >= 15000) inferredGrams = 2000;
    else inferredGrams = 1000;

    const unitPrice = Math.round((price / inferredGrams) * 100) / 100;

    return {
      name: rawName,
      category: 'Mascotas',
      quantity: inferredGrams,
      unit: 'gramos',
      unit_price: unitPrice,
      total_price: price,
      shelf_life_days: 180,
      serving_size: 'Porción mascota (100g)',
      calories_per_unit: 0,
      total_calories: 0,
      protein_g: 0,
      carbs_g: 0,
      fat_g: 0,
      is_human_food: false,
      confidence: 'price_and_store_inferred',
      explanation: `Alimento para mascotas (~${inferredGrams} g). No aporta calorías a la nutrición humana.`,
    };
  }

  // --- ASEO Y LIMPIEZA DEL HOGAR ---
  if (cleanName.includes('jabon') || cleanName.includes('jabón') || cleanName.includes('detergente') || cleanName.includes('clorox') || cleanName.includes('limpido') || cleanName.includes('suavizante') || cleanName.includes('lavaplatos') || cleanName.includes('papel') || cleanName.includes('crema dental') || cleanName.includes('shampoo')) {
    let inferredQty = 1;
    let inferredUnit: 'unidades' | 'gramos' | 'mililitros' = 'unidades';

    if (cleanName.includes('jabon') || cleanName.includes('jabón')) {
      inferredQty = 300;
      inferredUnit = 'gramos';
    } else if (cleanName.includes('clorox') || cleanName.includes('limpido') || cleanName.includes('suavizante')) {
      inferredQty = price >= 8000 ? 2000 : 1000;
      inferredUnit = 'mililitros';
    } else if (cleanName.includes('detergente')) {
      inferredQty = price >= 12000 ? 2000 : 1000;
      inferredUnit = 'gramos';
    }

    const unitPrice = Math.round((price / inferredQty) * 100) / 100;

    return {
      name: rawName,
      category: 'Aseo & Limpieza',
      quantity: inferredQty,
      unit: inferredUnit,
      unit_price: unitPrice,
      total_price: price,
      shelf_life_days: 365,
      serving_size: 'Uso de limpieza',
      calories_per_unit: 0,
      total_calories: 0,
      protein_g: 0,
      carbs_g: 0,
      fat_g: 0,
      is_human_food: false,
      confidence: 'price_and_store_inferred',
      explanation: 'Artículo de aseo/limpieza. Sin calorías nutricionales.',
    };
  }

  // 3. HEURÍSTICA POR DEFECTO PARA CUALQUIER OTRO PRODUCTO
  const finalQty = existingQty && existingQty > 0 ? existingQty : 1;
  const finalUnit: any = existingUnit || 'un';
  const unitPrice = price > 0 ? Math.round((price / finalQty) * 100) / 100 : 0;

  return {
    name: rawName,
    category: 'Despensa',
    quantity: finalQty,
    unit: finalUnit,
    unit_price: unitPrice,
    total_price: price,
    shelf_life_days: 14,
    serving_size: '1 porción estándar',
    calories_per_unit: 100,
    total_calories: finalQty * 100,
    protein_g: 2,
    carbs_g: 15,
    fat_g: 2,
    is_human_food: true,
    confidence: 'heuristic_default',
    explanation: 'Presentación estándar estimada por precio base.',
  };
}

// Helper interno para formatear productos con unidades explícitas
function buildPresentation(args: {
  name: string;
  quantity: number;
  unit: 'mililitros' | 'gramos' | 'litros' | 'kg' | 'unidades' | 'latas' | 'paquete';
  price: number;
  cleanName: string;
  confidence: 'explicit_text' | 'price_and_store_inferred' | 'heuristic_default';
  explanation: string;
}): InferredProductPresentation {
  const { name, quantity, unit, price, cleanName, confidence, explanation } = args;
  const isCookingOil = cleanName.includes('aceite');
  const isRice = cleanName.includes('arroz');
  const isMilk = cleanName.includes('leche');
  const isMeat = cleanName.includes('pollo') || cleanName.includes('carne') || cleanName.includes('res') || cleanName.includes('pechuga');
  const isPasta = cleanName.includes('pasta') || cleanName.includes('doria');

  let category = 'Despensa';
  let serving_size = '1 porción';
  let calsPerServing = 100;
  let protein_g = 2;
  let carbs_g = 15;
  let fat_g = 2;
  let shelfLife = 14;

  if (isCookingOil) {
    category = 'Condimentos & Aceites';
    serving_size = '1 cucharada (14g / 15ml)';
    calsPerServing = 125;
    fat_g = 14;
    protein_g = 0;
    carbs_g = 0;
    shelfLife = 180;
  } else if (isRice) {
    category = 'Granos & Cereales';
    serving_size = '1 porción (50g crudo / 100g cocido)';
    calsPerServing = 180;
    protein_g = 3.5;
    carbs_g = 40;
    fat_g = 0.5;
    shelfLife = 365;
  } else if (isMilk) {
    category = 'Lácteos & Huevos';
    serving_size = '1 vaso (200ml)';
    calsPerServing = 120;
    protein_g = 6.2;
    carbs_g = 9.6;
    fat_g = 6.4;
    shelfLife = 10;
  } else if (isMeat) {
    category = 'Proteínas & Carnes';
    serving_size = '1 porción (125g)';
    calsPerServing = 175;
    protein_g = 28;
    carbs_g = 0;
    fat_g = 6;
    shelfLife = 4;
  } else if (isPasta) {
    category = 'Granos & Cereales';
    serving_size = '1 porción (80g)';
    calsPerServing = 280;
    protein_g = 10;
    carbs_g = 58;
    fat_g = 1.5;
    shelfLife = 365;
  }

  const unit_price = quantity > 0 && price > 0 ? Math.round((price / quantity) * 100) / 100 : 0;
  const approxServings =
    unit === 'mililitros'
      ? Math.max(1, Math.round(quantity / 15))
      : unit === 'gramos'
      ? Math.max(1, Math.round(quantity / 50))
      : Math.max(1, Math.round(quantity));

  return {
    name,
    category,
    quantity,
    unit,
    unit_price,
    total_price: price,
    shelf_life_days: shelfLife,
    serving_size,
    calories_per_unit: calsPerServing,
    total_calories: approxServings * calsPerServing,
    protein_g,
    carbs_g,
    fat_g,
    is_human_food: true,
    confidence,
    explanation,
  };
}
