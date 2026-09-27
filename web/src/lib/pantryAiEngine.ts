import { PantryItem, GroceryReceipt, ProductPriceHistory, PantryEntropyMetrics } from '../../../packages/shared/src/types';

export interface ExtractedReceiptData {
  store_name: string;
  purchase_date: string;
  total_amount: number;
  payment_method?: string;
  items: Array<{
    name: string;
    category: string;
    quantity: number;
    unit: string;
    unit_price: number;
    total_price: number;
    shelf_life_days: number;
    calories_per_unit: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  }>;
}

// ============================================================================
// 1. FACTURAS DE EJEMPLO REALISTAS PARA PRUEBAS SIN API KEY
// ============================================================================
export const SAMPLE_RECEIPTS: Array<{ label: string; data: ExtractedReceiptData }> = [
  {
    label: 'Éxito - Mercado Completo Semanal',
    data: {
      store_name: 'Almacenes Éxito',
      purchase_date: new Date().toISOString().split('T')[0],
      total_amount: 142500,
      payment_method: 'Tarjeta Débito',
      items: [
        {
          name: 'Pechuga de Pollo Fresca',
          category: 'Proteínas',
          quantity: 2,
          unit: 'kg',
          unit_price: 18500,
          total_price: 37000,
          shelf_life_days: 4,
          calories_per_unit: 1650,
          protein_g: 62,
          carbs_g: 0,
          fat_g: 7,
        },
        {
          name: 'Leche Entera Alquería',
          category: 'Lácteos',
          quantity: 4,
          unit: 'litro',
          unit_price: 4600,
          total_price: 18400,
          shelf_life_days: 8,
          calories_per_unit: 610,
          protein_g: 32,
          carbs_g: 48,
          fat_g: 33,
        },
        {
          name: 'Huevos AA x30 Santa Reyes',
          category: 'Proteínas',
          quantity: 1,
          unit: 'paquete',
          unit_price: 21500,
          total_price: 21500,
          shelf_life_days: 28,
          calories_per_unit: 2100,
          protein_g: 180,
          carbs_g: 15,
          fat_g: 150,
        },
        {
          name: 'Arroz Diana Tradicional',
          category: 'Granos & Cereales',
          quantity: 3,
          unit: 'kg',
          unit_price: 4900,
          total_price: 14700,
          shelf_life_days: 180,
          calories_per_unit: 3600,
          protein_g: 70,
          carbs_g: 800,
          fat_g: 8,
        },
        {
          name: 'Tomate Chonto Maduro',
          category: 'Frutas & Verduras',
          quantity: 2,
          unit: 'kg',
          unit_price: 3800,
          total_price: 7600,
          shelf_life_days: 6,
          calories_per_unit: 180,
          protein_g: 9,
          carbs_g: 39,
          fat_g: 2,
        },
        {
          name: 'Manzana Roja Royal Gala',
          category: 'Frutas & Verduras',
          quantity: 1.5,
          unit: 'kg',
          unit_price: 8900,
          total_price: 13350,
          shelf_life_days: 12,
          calories_per_unit: 520,
          protein_g: 3,
          carbs_g: 140,
          fat_g: 2,
        },
        {
          name: 'Avena en Hojuelas Quaker',
          category: 'Granos & Cereales',
          quantity: 1,
          unit: 'paquete',
          unit_price: 6800,
          total_price: 6800,
          shelf_life_days: 120,
          calories_per_unit: 1520,
          protein_g: 50,
          carbs_g: 260,
          fat_g: 28,
        },
        {
          name: 'Detergente Líquido Axion',
          category: 'Aseo & Limpieza',
          quantity: 1,
          unit: 'litro',
          unit_price: 23150,
          total_price: 23150,
          shelf_life_days: 365,
          calories_per_unit: 0,
          protein_g: 0,
          carbs_g: 0,
          fat_g: 0,
        },
      ],
    },
  },
  {
    label: 'D1 - Despensa & Básicos',
    data: {
      store_name: 'Tiendas D1',
      purchase_date: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0],
      total_amount: 68400,
      payment_method: 'Efectivo',
      items: [
        {
          name: 'Leche Entera Alquería',
          category: 'Lácteos',
          quantity: 3,
          unit: 'litro',
          unit_price: 4300,
          total_price: 12900,
          shelf_life_days: 8,
          calories_per_unit: 610,
          protein_g: 32,
          carbs_g: 48,
          fat_g: 33,
        },
        {
          name: 'Atún en Agua Van Camps',
          category: 'Proteínas',
          quantity: 4,
          unit: 'lata',
          unit_price: 6200,
          total_price: 24800,
          shelf_life_days: 730,
          calories_per_unit: 140,
          protein_g: 32,
          carbs_g: 0,
          fat_g: 1.5,
        },
        {
          name: 'Aceite Vegetal 1L',
          category: 'Condimentos & Aceites',
          quantity: 1,
          unit: 'litro',
          unit_price: 11900,
          total_price: 11900,
          shelf_life_days: 240,
          calories_per_unit: 8000,
          protein_g: 0,
          carbs_g: 0,
          fat_g: 900,
        },
        {
          name: 'Pasta Spaghetti Doria',
          category: 'Granos & Cereales',
          quantity: 4,
          unit: 'paquete',
          unit_price: 2700,
          total_price: 10800,
          shelf_life_days: 365,
          calories_per_unit: 900,
          protein_g: 30,
          carbs_g: 180,
          fat_g: 4,
        },
        {
          name: 'Café Molido Matiz',
          category: 'Snacks & Bebidas',
          quantity: 1,
          unit: 'paquete',
          unit_price: 8000,
          total_price: 8000,
          shelf_life_days: 180,
          calories_per_unit: 20,
          protein_g: 1,
          carbs_g: 4,
          fat_g: 0.5,
        },
      ],
    },
  },
];

// ============================================================================
// 2. PARSER OCR DE FACTURAS CON GEMINI VISION (MODELOS GRATUITOS FLASH-LITE)
// ============================================================================
// Modelos gratuitos de Google con menor consumo de tokens y mayor cuota gratuita
export const FREE_TIER_MODELS = [
  'gemini-flash-lite-latest', // Modelo oficial gratuito de menor consumo y mayor velocidad
  'gemini-3.5-flash-lite',    // Respaldo gratuito ultrarrápido
  'gemini-3.1-flash-lite',    // Respaldo secundario de cuota ligera
];

export async function parseReceiptWithGemini(
  base64Image: string,
  apiKey?: string
): Promise<ExtractedReceiptData> {
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  const key =
    apiKey?.trim() ||
    localStorage.getItem('gemini_api_key')?.trim() ||
    envKey?.trim() ||
    '';

  if (!key) {
    throw new Error(
      'No se encontró una API Key de Gemini configurada. Por favor ingresa tu API Key en la configuración del módulo o usa la opción "Factura de Ejemplo" para probar.'
    );
  }

  // Limpiar base64 header si viene con data URL
  const cleanBase64 = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
  const mimeType = base64Image.startsWith('data:image/png')
    ? 'image/png'
    : base64Image.startsWith('data:image/webp')
    ? 'image/webp'
    : 'image/jpeg';

  const systemInstruction = `
Eres un sistema experto en Visión por Computadora, OCR y Nutrición para facturas de supermercado (Colombia, Latinoamérica e internacional).
Analiza detalladamente la imagen de la factura de compra o recibo de mercado y extrae TODOS los productos comprados en formato JSON estructurado.

Debes responder ÚNICAMENTE con un JSON válido sin bloques markdown adicionales o con markdown \`\`\`json.
Estructura esperada:
{
  "store_name": "Nombre de la tienda o supermercado (ej. Éxito, D1, Carulla, Ara, Jumbo, Walmart, etc.)",
  "purchase_date": "YYYY-MM-DD (fecha de la factura; si no es visible, usa la fecha de hoy)",
  "total_amount": 0.00,
  "payment_method": "Efectivo / Tarjeta / etc.",
  "items": [
    {
      "name": "Nombre limpio y reconocible del producto en español",
      "category": "Proteínas | Lácteos | Granos & Cereales | Frutas & Verduras | Aseo & Limpieza | Mascotas | Snacks & Bebidas | Condimentos & Aceites | Panadería | Despensa",
      "quantity": 1,
      "unit": "unidad | kg | g | litro | ml | paquete | lata",
      "unit_price": 0.00,
      "total_price": 0.00,
      "shelf_life_days": 7, // Días estimados de vida útil en nevera/despensa antes de vencerse o descomponerse
      "calories_per_unit": 250, // Calorías estimadas (kcal) por unidad/paquete comprado
      "protein_g": 10, // Proteínas estimadas en gramos
      "carbs_g": 20, // Carbohidratos en gramos
      "fat_g": 5 // Grasas en gramos
    }
  ]
}

Reglas clave:
1. Normaliza los nombres de productos (ej. si dice "LECH ENT ALG 1L" pon "Leche Entera Alquería 1L").
2. Estima razonablemente las calorías y macronutrientes según las tablas nutricionales estándar para cada alimento humano. Para productos de aseo, mascotas o no comestibles para humanos, pon 0 calorías y 0 macros.
3. Estima "shelf_life_days" considerando si es alimento perecedero (carnes/aves: 3-5 días, lácteos: 7-10 días, frutas/verduras: 5-14 días, no perecederos/enlatados: 180-720 días, aseo: 365 días, mascotas: 180 días).
`;

  const requestBody = {
    contents: [
      {
        parts: [
          { text: systemInstruction },
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json',
    },
  };

  let lastError: any = null;

  // Cascada de modelos gratuitos para garantizar disponibilidad continua
  for (const model of FREE_TIER_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        lastError = new Error(
          errorData?.error?.message || `Error en el modelo ${model} (Código ${response.status})`
        );
        // Si el modelo está sobrecargado (503/429) o no disponible (404), intentamos el siguiente modelo gratuito
        if (response.status === 503 || response.status === 429 || response.status === 404) {
          console.warn(`Modelo ${model} no disponible (${response.status}), probando siguiente modelo gratuito...`);
          continue;
        } else {
          throw lastError;
        }
      }

      const jsonRes = await response.json();
      const textOutput = jsonRes?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!textOutput) {
        throw new Error('No se pudo extraer texto de la factura recibida.');
      }

      // Parsear JSON limpio
      const cleanedText = textOutput.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanedText) as ExtractedReceiptData;
      return parsed;
    } catch (err: any) {
      lastError = err;
      console.warn(`Fallo al consultar ${model}:`, err.message);
    }
  }

  throw lastError || new Error('No se pudo procesar la factura con los modelos gratuitos de Gemini.');
}

// ============================================================================
// 3. CÁLCULO DE ENTROPÍA DE LA DESPENSA (DESPERDICIO, ROTACIÓN & RIESGO)
// ============================================================================
export function calculatePantryEntropy(items: PantryItem[]): PantryEntropyMetrics {
  const activeItems = items.filter((i) => i.status === 'disponible' || i.status === 'consumiendo');
  const consumedItems = items.filter((i) => i.status === 'agotado');

  if (activeItems.length === 0 && consumedItems.length === 0) {
    return {
      entropy_score: 0,
      freshness_level: 'alta',
      risk_items_count: 0,
      expired_items_count: 0,
      turnover_rate_pct: 100,
      recommendations: ['Tu despensa está vacía. Escanea tu primera factura para comenzar el control inteligente.'],
    };
  }

  const today = new Date();
  let totalWeightedDegradation = 0;
  let totalActiveCost = 0;
  let riskItemsCount = 0;
  let expiredItemsCount = 0;
  const recommendations: string[] = [];

  activeItems.forEach((item) => {
    const cost = item.total_price || item.unit_price * item.quantity || 1;
    totalActiveCost += cost;

    // Días transcurridos desde la compra
    const purchaseDate = new Date(item.purchase_date);
    const diffTime = Math.max(0, today.getTime() - purchaseDate.getTime());
    const daysInPantry = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Degradación relativa (0 = recién comprado, 1.0 = alcanzó vida útil estimada, >1.0 = vencido)
    const shelfLife = Math.max(1, item.shelf_life_days || 14);
    const degradationRatio = daysInPantry / shelfLife;

    if (degradationRatio >= 1.0) {
      expiredItemsCount++;
      recommendations.push(
        `⚠️ ${item.name}: Ha superado su vida útil estimada (${daysInPantry} días en despensa). Revisa su estado o descártalo.`
      );
    } else if (degradationRatio >= 0.7) {
      riskItemsCount++;
      const daysLeft = Math.max(0, shelfLife - daysInPantry);
      recommendations.push(
        `🚨 ${item.name}: Le quedan aprox. ${daysLeft} días de frescura recomendada. ¡Prioriza consumirlo hoy!`
      );
    }

    // Ponderación de entropía: mayor costo e impacto aumentan la entropía del sistema
    const boundedDegradation = Math.min(2.0, degradationRatio);
    totalWeightedDegradation += boundedDegradation * cost;
  });

  // Tasa de rotación: proporción de ítems consumidos a tiempo vs total histórico
  const totalTracked = activeItems.length + consumedItems.length;
  const turnoverRate = totalTracked > 0 ? (consumedItems.length / totalTracked) * 100 : 100;

  // Score de Entropía (0 a 100):
  // 0% = Despensa recién abastecida, rotación continua y frescura máxima (Baja Entropía)
  // 100% = Alta descomposición, estancamiento y riesgo de pérdida económica (Alta Entropía)
  let rawScore = 0;
  if (totalActiveCost > 0) {
    const avgDegradation = totalWeightedDegradation / totalActiveCost; // entre 0.0 y ~2.0
    rawScore = Math.min(100, Math.round(avgDegradation * 60 + (expiredItemsCount * 12)));
  }

  let freshnessLevel: 'alta' | 'media' | 'baja' | 'critica' = 'alta';
  if (rawScore > 75 || expiredItemsCount > 2) {
    freshnessLevel = 'critica';
  } else if (rawScore > 50 || riskItemsCount > 2) {
    freshnessLevel = 'baja';
  } else if (rawScore > 25) {
    freshnessLevel = 'media';
  }

  if (recommendations.length === 0) {
    recommendations.push('✨ Excelente gestión: Tu despensa tiene baja entropía y todos los alimentos están frescos.');
  }

  return {
    entropy_score: rawScore,
    freshness_level: freshnessLevel,
    risk_items_count: riskItemsCount,
    expired_items_count: expiredItemsCount,
    turnover_rate_pct: Math.round(turnoverRate),
    recommendations: recommendations.slice(0, 5),
  };
}

// ============================================================================
// 4. RADAR DE PRECIOS: ¿SUBE O BAJA EL PRODUCTO? (INFLACIÓN Y TENDENCIAS)
// ============================================================================
export function calculatePriceTrends(items: PantryItem[]): ProductPriceHistory[] {
  const grouped: Record<string, PantryItem[]> = {};

  // Agrupar productos normalizando el nombre
  items.forEach((item) => {
    const key = item.name.toLowerCase().trim();
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item);
  });

  const trends: ProductPriceHistory[] = [];

  Object.entries(grouped).forEach(([_, groupItems]) => {
    // Ordenar cronológicamente
    groupItems.sort(
      (a, b) => new Date(a.purchase_date).getTime() - new Date(b.purchase_date).getTime()
    );

    const history = groupItems.map((g) => ({
      date: g.purchase_date,
      price: Number(g.unit_price) || 0,
      store: g.category || 'Mercado',
    }));

    const latest = groupItems[groupItems.length - 1];
    const currentPrice = Number(latest.unit_price) || 0;

    let previousPrice: number | undefined;
    let priceChangePct: number | undefined;
    let trend: 'up' | 'down' | 'stable' = 'stable';

    if (groupItems.length > 1) {
      const prev = groupItems[groupItems.length - 2];
      previousPrice = Number(prev.unit_price) || 0;
      if (previousPrice > 0) {
        priceChangePct = Number((((currentPrice - previousPrice) / previousPrice) * 100).toFixed(1));
        if (priceChangePct > 1) trend = 'up';
        else if (priceChangePct < -1) trend = 'down';
        else trend = 'stable';
      }
    }

    trends.push({
      product_name: latest.name,
      category: latest.category,
      history,
      current_price: currentPrice,
      previous_price: previousPrice,
      price_change_pct: priceChangePct,
      trend,
    });
  });

  // Ordenar por productos que más han variado
  return trends.sort((a, b) => Math.abs(b.price_change_pct || 0) - Math.abs(a.price_change_pct || 0));
}

// ============================================================================
// 5. VELOCIDAD Y TIEMPO DE CONSUMO (EN CUÁNTO TIEMPO SE AGOTA)
// ============================================================================
export interface ConsumptionVelocity {
  product_name: string;
  category: string;
  average_days_to_consume: number;
  consumed_batches: number;
  estimated_depletion_date?: string;
  is_low_stock: boolean;
}

export function calculateConsumptionVelocity(items: PantryItem[]): ConsumptionVelocity[] {
  const grouped: Record<string, { consumed: number[]; activeDays: number[]; latestActive?: PantryItem }> = {};

  items.forEach((item) => {
    const key = item.name.toLowerCase().trim();
    if (!grouped[key]) {
      grouped[key] = { consumed: [], activeDays: [] };
    }

    if (item.status === 'agotado' && item.consumption_days) {
      grouped[key].consumed.push(item.consumption_days);
    } else if (item.status === 'disponible' || item.status === 'consumiendo') {
      grouped[key].latestActive = item;
      const today = new Date();
      const pDate = new Date(item.purchase_date);
      const days = Math.max(0, Math.floor((today.getTime() - pDate.getTime()) / (1000 * 86400)));
      grouped[key].activeDays.push(days);
    }
  });

  const velocities: ConsumptionVelocity[] = [];

  Object.entries(grouped).forEach(([_, data]) => {
    const hasHistory = data.consumed.length > 0;
    const avgDays = hasHistory
      ? Math.round(data.consumed.reduce((a, b) => a + b, 0) / data.consumed.length)
      : data.latestActive?.shelf_life_days || 14;

    let estimatedDepletion: string | undefined;
    let isLowStock = false;

    if (data.latestActive) {
      const pDate = new Date(data.latestActive.purchase_date);
      const estDate = new Date(pDate.getTime() + avgDays * 86400000);
      estimatedDepletion = estDate.toISOString().split('T')[0];

      // Alerta si faltan menos de 2 días para agotarse o ya venció
      const daysLeft = Math.floor((estDate.getTime() - Date.now()) / (1000 * 86400));
      if (daysLeft <= 2) {
        isLowStock = true;
      }

      velocities.push({
        product_name: data.latestActive.name,
        category: data.latestActive.category,
        average_days_to_consume: avgDays,
        consumed_batches: data.consumed.length,
        estimated_depletion_date: estimatedDepletion,
        is_low_stock: isLowStock,
      });
    }
  });

  return velocities.sort((a, b) => a.average_days_to_consume - b.average_days_to_consume);
}
