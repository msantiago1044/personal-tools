import { describe, it, expect } from 'vitest';
import {
  isNonFoodItem,
  isEdibleItem,
  calculateFoodMacroTotals,
  getFoodIntelligence,
} from '../pantryFoodIntelligence';
import { inferProductPhysicalPresentation } from '../productPresentationInferrer';
import { PantryItem } from '../../../../packages/shared/src/types';

describe('Pantry Edible Filtering & Food Intelligence', () => {
  it('correctly classifies non-edible household and pet items', () => {
    expect(isNonFoodItem({ name: 'Lavalozas Líquido', category: 'Aseo & Limpieza' })).toBe(true);
    expect(isNonFoodItem({ name: 'Lavalozas Líquido 500ml', category: 'Despensa' })).toBe(true);
    expect(isNonFoodItem({ name: 'Crema Dental Colgate Total 12', category: 'Aseo & Limpieza' })).toBe(true);
    expect(isNonFoodItem({ name: 'Detergente en Polvo Ariel 2000g' })).toBe(true);
    expect(isNonFoodItem({ name: 'Suavizante Suavitel 1000ml' })).toBe(true);
    expect(isNonFoodItem({ name: 'Alimento para Perro Ringo Croquetas', category: 'Mascotas' })).toBe(true);
    expect(isNonFoodItem({ name: 'Arena para Gato Sanitaria' })).toBe(true);
  });

  it('correctly classifies edible human food items', () => {
    expect(isEdibleItem({ name: 'Leche en Polvo', category: 'Lácteos' })).toBe(true);
    expect(isEdibleItem({ name: 'Lonchera Surtida', category: 'Snacks & Bebidas' })).toBe(true);
    expect(isEdibleItem({ name: 'Arroz Blanco Diana 1000g', category: 'Granos & Cereales' })).toBe(true);
    expect(isEdibleItem({ name: 'Pechuga de Pollo Fileteada', category: 'Proteínas' })).toBe(true);
    expect(isEdibleItem({ name: 'Manzanas Rojas', category: 'Frutas & Verduras' })).toBe(true);
  });

  it('calculates 0 calories and isHumanFood=false for non-food in calculateFoodMacroTotals', () => {
    const lavalozas: PantryItem = {
      id: 'item-1',
      user_id: 'user-1',
      name: 'Lavalozas Líquido',
      category: 'Aseo & Limpieza',
      initial_quantity: 500,
      quantity: 500,
      unit: 'mililitros',
      unit_price: 12.6,
      total_price: 6300,
      purchase_date: '2026-10-01',
      created_at: '2026-10-01T00:00:00.000Z',
      shelf_life_days: 730,
      calories_per_unit: 250, // Corrupted/outdated value
      total_calories: 250,
      protein_g: 2,
      carbs_g: 15,
      fat_g: 0,
      status: 'disponible',
    };

    const macros = calculateFoodMacroTotals(lavalozas);
    expect(macros.isHumanFood).toBe(false);
    expect(macros.totalCalories).toBe(0);
    expect(macros.totalProteinG).toBe(0);
    expect(macros.totalCarbsG).toBe(0);
  });

  it('returns 0 calories and non-food profile in getFoodIntelligence for non-edible items', () => {
    const cremaDental: PantryItem = {
      id: 'item-2',
      user_id: 'user-1',
      name: 'Crema Dental',
      category: 'Aseo & Limpieza',
      initial_quantity: 1,
      quantity: 1,
      unit: 'unidades',
      unit_price: 9950,
      total_price: 9950,
      purchase_date: '2026-10-01',
      created_at: '2026-10-01T00:00:00.000Z',
      shelf_life_days: 730,
      calories_per_unit: 100, // Corrupted/outdated value
      total_calories: 100,
      protein_g: 0,
      carbs_g: 0,
      fat_g: 0,
      status: 'disponible',
    };

    const intel = getFoodIntelligence(cremaDental);
    expect(intel.nutrition.totalPackageCalories).toBe(0);
    expect(intel.nutrition.calories).toBe(0);
    expect(intel.nutrition.protein_g).toBe(0);
    expect(intel.nutrition.carbs_g).toBe(0);
  });

  it('infers non-food presentation with 0 calories in inferProductPhysicalPresentation', () => {
    const inferredLavalozas = inferProductPhysicalPresentation('Lavalozas Líquido 500ml', 6300);
    expect(inferredLavalozas.is_human_food).toBe(false);
    expect(inferredLavalozas.calories_per_unit).toBe(0);
    expect(inferredLavalozas.total_calories).toBe(0);
    expect(inferredLavalozas.category).toBe('Aseo & Limpieza');

    const inferredCrema = inferProductPhysicalPresentation('Crema Dental 1 un', 9950);
    expect(inferredCrema.is_human_food).toBe(false);
    expect(inferredCrema.calories_per_unit).toBe(0);
    expect(inferredCrema.total_calories).toBe(0);
    expect(inferredCrema.category).toBe('Aseo & Limpieza');
  });
});
