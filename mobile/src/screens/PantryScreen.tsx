import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { PantryItem, GroceryReceipt, ProductPriceHistory, PantryEntropyMetrics } from '../types';

interface PantryScreenProps {
  user: any;
  onBack: () => void;
  isDark: boolean;
}

type MobileTab = 'scanner' | 'prices' | 'inventory' | 'entropy';

const CATEGORIES = [
  'Todas',
  'Proteínas',
  'Lácteos',
  'Granos & Cereales',
  'Frutas & Verduras',
  'Aseo & Limpieza',
  'Snacks & Bebidas',
  'Despensa',
];

// Configuración de Modelos Gratuitos de Google Gemini (Menor consumo de tokens y 1,500 req/día gratis)
const FREE_TIER_MODELS = ['gemini-flash-lite-latest', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'];

// Muestras de prueba para móvil
const MOBILE_SAMPLE_RECEIPTS = [
  {
    store_name: 'Almacenes Éxito',
    total_amount: 112000,
    purchase_date: new Date().toISOString().split('T')[0],
    items: [
      {
        name: 'Pechuga de Pollo 1kg',
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
        name: 'Huevos AA x30',
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
        name: 'Arroz Diana 1kg',
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
        name: 'Tomate Chonto',
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
        name: 'Detergente Líquido',
        category: 'Aseo & Limpieza',
        quantity: 1,
        unit: 'litro',
        unit_price: 12800,
        total_price: 12800,
        shelf_life_days: 365,
        calories_per_unit: 0,
        protein_g: 0,
        carbs_g: 0,
        fat_g: 0,
      },
    ],
  },
];

export const PantryScreen: React.FC<PantryScreenProps> = ({ user, onBack, isDark }) => {
  const [activeTab, setActiveTab] = useState<MobileTab>('scanner');
  const [items, setItems] = useState<PantryItem[]>([]);
  const [receipts, setReceipts] = useState<GroceryReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  // Manual modal
  const [showManualModal, setShowManualModal] = useState(false);
  const [manName, setManName] = useState('');
  const [manCat, setManCat] = useState('Proteínas');
  const [manQty, setManQty] = useState('1');
  const [manPrice, setManPrice] = useState('');
  const [manDays, setManDays] = useState('10');
  const [manCal, setManCal] = useState('250');

  // AI Modal (Gemini Flash-Lite)
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTextReceipt, setAiTextReceipt] = useState('');
  const [isProcessingAi, setIsProcessingAi] = useState(false);

  // Colors
  const colors = {
    bg: isDark ? '#030712' : '#F8FAFC',
    card: isDark ? '#0F172A' : '#FFFFFF',
    border: isDark ? '#1E293B' : '#E2E8F0',
    text: isDark ? '#FFFFFF' : '#0F172A',
    subtext: isDark ? '#94A3B8' : '#64748B',
    accent: '#10B981',
    accentBg: isDark ? '#064E3B' : '#D1FAE5',
    accentText: isDark ? '#34D399' : '#047857',
    inputBg: isDark ? '#030712' : '#F1F5F9',
    danger: '#EF4444',
    warning: '#F59E0B',
    blue: '#3B82F6',
  };

  // 1. Cargar datos
  const loadData = async () => {
    setLoading(true);
    try {
      const { data: dbItems, error: itemsErr } = await supabase
        .from('pantry_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!itemsErr && dbItems) {
        setItems(dbItems);
        await AsyncStorage.setItem(`mobile_pantry_items_${user.id}`, JSON.stringify(dbItems));
      } else {
        const stored = await AsyncStorage.getItem(`mobile_pantry_items_${user.id}`);
        if (stored) setItems(JSON.parse(stored));
      }

      const { data: dbRcs, error: rcErr } = await supabase
        .from('grocery_receipts')
        .select('*')
        .eq('user_id', user.id)
        .order('purchase_date', { ascending: false });

      if (!rcErr && dbRcs) {
        setReceipts(dbRcs);
        await AsyncStorage.setItem(`mobile_grocery_receipts_${user.id}`, JSON.stringify(dbRcs));
      } else {
        const storedRc = await AsyncStorage.getItem(`mobile_grocery_receipts_${user.id}`);
        if (storedRc) setReceipts(JSON.parse(storedRc));
      }
    } catch (e) {
      console.warn('Error cargando despensa en móvil:', e);
      const stored = await AsyncStorage.getItem(`mobile_pantry_items_${user.id}`);
      if (stored) setItems(JSON.parse(stored));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const persistItemsLocally = async (newItems: PantryItem[], newRcs?: GroceryReceipt[]) => {
    await AsyncStorage.setItem(`mobile_pantry_items_${user.id}`, JSON.stringify(newItems));
    if (newRcs) {
      await AsyncStorage.setItem(`mobile_grocery_receipts_${user.id}`, JSON.stringify(newRcs));
    }
  };

  // 2. Consumir producto
  const handleConsume = async (item: PantryItem, full: boolean = false) => {
    const today = new Date();
    const purchaseDate = new Date(item.purchase_date);
    const daysSince = Math.max(1, Math.round((today.getTime() - purchaseDate.getTime()) / (1000 * 86400)));

    const updatedQty = full ? 0 : Math.max(0, item.quantity - 1);
    const updatedStatus = updatedQty <= 0 ? 'agotado' : 'consumiendo';

    const updated: PantryItem = {
      ...item,
      quantity: updatedQty,
      status: updatedStatus,
      consumed_at: updatedQty <= 0 ? today.toISOString() : item.consumed_at,
      consumption_days: updatedQty <= 0 ? daysSince : item.consumption_days,
      updated_at: today.toISOString(),
    };

    const newItems = items.map((i) => (i.id === item.id ? updated : i));
    setItems(newItems);
    persistItemsLocally(newItems);

    try {
      await supabase
        .from('pantry_items')
        .update({
          quantity: updated.quantity,
          status: updated.status,
          consumed_at: updated.consumed_at,
          consumption_days: updated.consumption_days,
          updated_at: updated.updated_at,
        })
        .eq('id', item.id);
    } catch (e) {
      console.warn('Supabase update warning');
    }
  };

  // 3. Eliminar producto
  const handleDeleteItem = (id: string) => {
    Alert.alert('Eliminar Producto', '¿Deseas quitar este producto de tu despensa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          const newItems = items.filter((i) => i.id !== id);
          setItems(newItems);
          persistItemsLocally(newItems);
          try {
            await supabase.from('pantry_items').delete().eq('id', id);
          } catch (e) {
            console.warn('Supabase delete warning');
          }
        },
      },
    ]);
  };

  // 4. Cargar factura de prueba en móvil
  const handleLoadSample = async () => {
    const sample = MOBILE_SAMPLE_RECEIPTS[0];
    const receiptId = 'rc_' + Date.now();
    const newReceipt: GroceryReceipt = {
      id: receiptId,
      user_id: user.id,
      store_name: sample.store_name,
      purchase_date: sample.purchase_date,
      total_amount: sample.total_amount,
      items_count: sample.items.length,
      created_at: new Date().toISOString(),
    };

    const newItems: PantryItem[] = sample.items.map((it, idx) => ({
      id: 'item_' + Date.now() + '_' + idx,
      user_id: user.id,
      receipt_id: receiptId,
      name: it.name,
      category: it.category,
      quantity: it.quantity,
      initial_quantity: it.quantity,
      unit: it.unit,
      unit_price: it.unit_price,
      total_price: it.total_price,
      purchase_date: sample.purchase_date,
      shelf_life_days: it.shelf_life_days,
      calories_per_unit: it.calories_per_unit,
      total_calories: it.calories_per_unit * it.quantity,
      protein_g: it.protein_g,
      carbs_g: it.carbs_g,
      fat_g: it.fat_g,
      status: 'disponible',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const updatedItems = [...newItems, ...items];
    const updatedRcs = [newReceipt, ...receipts];
    setItems(updatedItems);
    setReceipts(updatedRcs);
    persistItemsLocally(updatedItems, updatedRcs);

    // Intentar subir a Supabase
    try {
      await supabase.from('grocery_receipts').insert([newReceipt]);
      await supabase.from('pantry_items').insert(newItems);
    } catch (e) {
      console.warn('Error guardando en Supabase, guardado en AsyncStorage');
    }

    Alert.alert('¡Factura Registrada!', `Se han cargado ${newItems.length} productos a tu despensa.`);
    setActiveTab('inventory');
  };

  // 4b. Procesar texto de factura con Gemini Flash-Lite (Modo Gratuito)
  const handleProcessAiText = async () => {
    if (!aiTextReceipt.trim()) {
      Alert.alert('Texto vacío', 'Pega o escribe los productos de tu factura o compra.');
      return;
    }

    const key = ((globalThis as any).process?.env?.EXPO_PUBLIC_GEMINI_API_KEY as string) || '';
    if (!key) {
      Alert.alert(
        'Gemini API Key',
        'Configura tu EXPO_PUBLIC_GEMINI_API_KEY en mobile/.env o sube tus recibos en la versión Web.'
      );
      return;
    }

    setIsProcessingAi(true);

    const systemPrompt = `Eres un sistema experto en despensa, OCR y nutricion para compras de supermercado.
Analiza el siguiente texto de compra o factura y extrae TODOS los productos en JSON estructurado.
Texto de compra:
"""${aiTextReceipt.trim()}"""

Responde UNICAMENTE con un JSON con la estructura:
{
  "store_name": "Nombre del supermercado o 'Mercado General'",
  "total_amount": 0,
  "items": [
    {
      "name": "Nombre normalizado del producto",
      "category": "Proteínas | Lácteos | Granos & Cereales | Frutas & Verduras | Aseo & Limpieza | Snacks & Bebidas | Despensa",
      "quantity": 1,
      "unit": "kg | litro | unidad | paquete | lata",
      "unit_price": 0,
      "total_price": 0,
      "shelf_life_days": 7,
      "calories_per_unit": 100,
      "protein_g": 0,
      "carbs_g": 0,
      "fat_g": 0
    }
  ]
}`;

    const requestBody = {
      contents: [{ parts: [{ text: systemPrompt }] }],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: 'application/json',
      },
    };

    let parsedResult: any = null;
    let lastErr: any = null;

    for (const model of FREE_TIER_MODELS) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
          }
        );

        if (!response.ok) {
          if (response.status === 503 || response.status === 429 || response.status === 404) {
            continue;
          }
          throw new Error(`Error en modelo ${model} (${response.status})`);
        }

        const json = await response.json();
        const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const cleanText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
          parsedResult = JSON.parse(cleanText);
          break;
        }
      } catch (e: any) {
        lastErr = e;
      }
    }

    setIsProcessingAi(false);

    if (!parsedResult || !parsedResult.items || parsedResult.items.length === 0) {
      Alert.alert('Error IA', lastErr?.message || 'No se pudieron extraer productos. Verifica el texto ingresado.');
      return;
    }

    const receiptId = 'rc_' + Date.now();
    const newReceipt: GroceryReceipt = {
      id: receiptId,
      user_id: user.id,
      store_name: parsedResult.store_name || 'Mercado Inteligente IA',
      purchase_date: new Date().toISOString().split('T')[0],
      total_amount: parsedResult.total_amount || parsedResult.items.reduce((s: number, i: any) => s + (i.total_price || 0), 0),
      items_count: parsedResult.items.length,
      created_at: new Date().toISOString(),
    };

    const newItems: PantryItem[] = parsedResult.items.map((it: any, idx: number) => ({
      id: 'item_' + Date.now() + '_' + idx,
      user_id: user.id,
      receipt_id: receiptId,
      name: it.name,
      category: it.category || 'Despensa',
      quantity: it.quantity || 1,
      initial_quantity: it.quantity || 1,
      unit: it.unit || 'unidad',
      unit_price: it.unit_price || 0,
      total_price: it.total_price || (it.unit_price ? it.unit_price * (it.quantity || 1) : 0),
      purchase_date: new Date().toISOString().split('T')[0],
      shelf_life_days: it.shelf_life_days || 14,
      calories_per_unit: it.calories_per_unit || 0,
      total_calories: (it.calories_per_unit || 0) * (it.quantity || 1),
      protein_g: it.protein_g || 0,
      carbs_g: it.carbs_g || 0,
      fat_g: it.fat_g || 0,
      status: 'disponible',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const updatedItems = [...newItems, ...items];
    const updatedRcs = [newReceipt, ...receipts];
    setItems(updatedItems);
    setReceipts(updatedRcs);
    persistItemsLocally(updatedItems, updatedRcs);

    try {
      await supabase.from('grocery_receipts').insert([newReceipt]);
      await supabase.from('pantry_items').insert(newItems);
    } catch (e) {
      console.warn('Guardado en AsyncStorage local');
    }

    setAiTextReceipt('');
    setShowAiModal(false);
    Alert.alert('¡Procesado con Éxito!', `Se agregaron ${newItems.length} productos con análisis nutricional y entropía.`);
    setActiveTab('inventory');
  };

  // 5. Guardar producto manual
  const handleSaveManual = async () => {
    if (!manName.trim()) {
      Alert.alert('Campo requerido', 'Ingresa el nombre del producto.');
      return;
    }
    const qty = parseFloat(manQty) || 1;
    const price = parseFloat(manPrice) || 0;
    const days = parseInt(manDays) || 14;
    const cals = parseFloat(manCal) || 0;

    const newItem: PantryItem = {
      id: 'item_' + Date.now(),
      user_id: user.id,
      name: manName.trim(),
      category: manCat,
      quantity: qty,
      initial_quantity: qty,
      unit: 'unidad',
      unit_price: price,
      total_price: price * qty,
      purchase_date: new Date().toISOString().split('T')[0],
      shelf_life_days: days,
      calories_per_unit: cals,
      total_calories: cals * qty,
      protein_g: 0,
      carbs_g: 0,
      fat_g: 0,
      status: 'disponible',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const newItems = [newItem, ...items];
    setItems(newItems);
    persistItemsLocally(newItems);

    try {
      await supabase.from('pantry_items').insert([newItem]);
    } catch (e) {
      console.warn('Supabase insert error');
    }

    setManName('');
    setManPrice('');
    setShowManualModal(false);
  };

  // 6. Métricas y KPIs
  const activeItems = useMemo(
    () => items.filter((i) => i.status === 'disponible' || i.status === 'consumiendo'),
    [items]
  );

  const totalCalories = useMemo(
    () => activeItems.reduce((acc, it) => acc + (it.calories_per_unit * it.quantity), 0),
    [activeItems]
  );

  // Entropía de despensa simple y robusta
  const entropyScore = useMemo(() => {
    if (activeItems.length === 0) return 0;
    const today = new Date();
    let scoreAcc = 0;
    activeItems.forEach((it) => {
      const pDate = new Date(it.purchase_date);
      const days = Math.max(0, Math.floor((today.getTime() - pDate.getTime()) / (1000 * 86400)));
      const ratio = Math.min(1.5, days / (it.shelf_life_days || 14));
      scoreAcc += ratio;
    });
    return Math.min(100, Math.round((scoreAcc / activeItems.length) * 60));
  }, [activeItems]);

  // Radar de precios
  const priceTrends = useMemo(() => {
    const grouped: Record<string, PantryItem[]> = {};
    items.forEach((it) => {
      const k = it.name.toLowerCase().trim();
      if (!grouped[k]) grouped[k] = [];
      grouped[k].push(it);
    });

    const res: Array<{ name: string; current: number; prev?: number; diff?: number }> = [];
    Object.values(grouped).forEach((group) => {
      group.sort((a, b) => new Date(a.purchase_date).getTime() - new Date(b.purchase_date).getTime());
      const latest = group[group.length - 1];
      let prevPrice: number | undefined;
      let diffPct: number | undefined;
      if (group.length > 1) {
        prevPrice = group[group.length - 2].unit_price;
        if (prevPrice > 0) {
          diffPct = Number((((latest.unit_price - prevPrice) / prevPrice) * 100).toFixed(1));
        }
      }
      res.push({
        name: latest.name,
        current: latest.unit_price,
        prev: prevPrice,
        diff: diffPct,
      });
    });
    return res;
  }, [items]);

  const filteredItems = useMemo(() => {
    return activeItems.filter((it) => {
      const mSearch = it.name.toLowerCase().includes(searchTerm.toLowerCase());
      const mCat = selectedCategory === 'Todas' || it.category === selectedCategory;
      return mSearch && mCat;
    });
  }, [activeItems, searchTerm, selectedCategory]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header móvil */}
      <View style={[styles.header, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TouchableOpacity
            onPress={onBack}
            style={[styles.backBtn, { borderColor: colors.border, backgroundColor: colors.inputBg }]}
          >
            <Text style={{ fontSize: 12, fontWeight: '700', color: colors.accent }}>← HUB</Text>
          </TouchableOpacity>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Despensa & Mercado IA</Text>
            <Text style={[styles.headerSub, { color: colors.subtext }]}>
              {activeItems.length} en stock • {Math.round(totalCalories).toLocaleString()} kcal
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setShowManualModal(true)}
          style={[styles.addBtn, { backgroundColor: colors.accent }]}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 12 }}>+ Añadir</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs Móviles */}
      <View style={[styles.tabsRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {[
          { id: 'scanner', label: '📸 Factura IA' },
          { id: 'prices', label: '📈 Precios' },
          { id: 'inventory', label: '🧺 Despensa' },
          { id: 'entropy', label: '⚛️ Entropía' },
        ].map((t) => (
          <TouchableOpacity
            key={t.id}
            onPress={() => setActiveTab(t.id as MobileTab)}
            style={[
              styles.tabBtn,
              activeTab === t.id && { backgroundColor: colors.accentBg, borderColor: colors.accent },
            ]}
          >
            <Text
              style={[
                styles.tabBtnText,
                { color: activeTab === t.id ? colors.accentText : colors.subtext },
                activeTab === t.id && { fontWeight: '800' },
              ]}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* PESTAÑA: DESPENSA */}
      {activeTab === 'inventory' && (
        <ScrollView style={{ flex: 1, padding: 14 }}>
          {/* Barra de búsqueda */}
          <TextInput
            placeholder="Buscar producto..."
            placeholderTextColor={colors.subtext}
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={[styles.searchInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
          />

          {/* Categorías chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            {CATEGORIES.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setSelectedCategory(c)}
                style={[
                  styles.catChip,
                  {
                    backgroundColor: selectedCategory === c ? colors.accent : colors.card,
                    borderColor: selectedCategory === c ? colors.accent : colors.border,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '600',
                    color: selectedCategory === c ? '#FFFFFF' : colors.text,
                  }}
                >
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {filteredItems.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={{ fontSize: 32, textAlign: 'center', marginBottom: 8 }}>🧺</Text>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No hay productos en esta vista</Text>
              <Text style={[styles.emptyDesc, { color: colors.subtext }]}>
                Escanea una factura o carga una de prueba para comenzar a controlar tu despensa.
              </Text>
              <TouchableOpacity
                onPress={handleLoadSample}
                style={[styles.sampleBtn, { backgroundColor: colors.accentBg, borderColor: colors.accent }]}
              >
                <Text style={{ color: colors.accentText, fontWeight: '700', fontSize: 12 }}>
                  ⚡ Cargar Factura de Prueba (1-Click)
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredItems.map((item) => {
              const today = new Date();
              const pDate = new Date(item.purchase_date);
              const days = Math.max(0, Math.floor((today.getTime() - pDate.getTime()) / (1000 * 86400)));
              const shelfLife = item.shelf_life_days || 14;
              const isUrgent = days >= shelfLife * 0.75;

              return (
                <View
                  key={item.id}
                  style={[styles.productCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1, paddingRight: 8 }}>
                      <Text style={[styles.productName, { color: colors.text }]}>{item.name}</Text>
                      <Text style={[styles.productMeta, { color: colors.subtext }]}>
                        {item.category} • {item.quantity} {item.unit} • ${Number(item.unit_price).toLocaleString()}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.badgeUrgency,
                        { backgroundColor: isUrgent ? '#FEE2E2' : colors.accentBg },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: '800',
                          color: isUrgent ? colors.danger : colors.accentText,
                        }}
                      >
                        {isUrgent ? 'Consumir ya' : `${Math.max(0, shelfLife - days)}d`}
                      </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.border }}>
                    <Text style={{ fontSize: 11, color: colors.warning, fontWeight: '700' }}>
                      🔥 {Math.round(item.calories_per_unit * item.quantity)} kcal
                    </Text>

                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      <TouchableOpacity
                        onPress={() => handleConsume(item, false)}
                        style={[styles.consumeBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
                      >
                        <Text style={{ fontSize: 11, fontWeight: '700', color: colors.text }}>-1 Consumir</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleConsume(item, true)}
                        style={[styles.consumeBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
                      >
                        <Text style={{ fontSize: 11, fontWeight: '700', color: colors.subtext }}>Agotar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteItem(item.id)}
                        style={{ padding: 6 }}
                      >
                        <Text style={{ fontSize: 12 }}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}

      {/* PESTAÑA: ESCÁNER / SUBIR FACTURA */}
      {activeTab === 'scanner' && (
        <ScrollView style={{ flex: 1, padding: 16 }}>
          <View style={[styles.scannerBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: 8 }}>🧾</Text>
            <Text style={[styles.scannerTitle, { color: colors.text }]}>Registrar Factura de Mercado</Text>
            <Text style={[styles.scannerSub, { color: colors.subtext }]}>
              Almacena automáticamente cada producto de la factura para llevar el control de consumo, calorías y precios.
            </Text>

            {/* Banner de Modelo Gratuito Activo */}
            <View style={{ backgroundColor: colors.accentBg, padding: 12, borderRadius: 14, marginBottom: 16, width: '100%' }}>
              <Text style={{ color: colors.accentText, fontWeight: '800', fontSize: 13 }}>
                ⚡ Gemini Flash-Lite Activo (Modo Gratuito)
              </Text>
              <Text style={{ color: colors.subtext, fontSize: 11, marginTop: 3, lineHeight: 16 }}>
                1,500 peticiones diarias gratis. Consumo mínimo de tokens con respuestas estructuradas instantáneas.
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setShowAiModal(true)}
              style={[styles.scanActionBtn, { backgroundColor: colors.accent, marginBottom: 10 }]}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 14 }}>
                ✨ Extraer con IA Gemini Flash-Lite
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLoadSample}
              style={[styles.scanActionBtn, { backgroundColor: colors.inputBg, borderWidth: 1, borderColor: colors.border, marginBottom: 10 }]}
            >
              <Text style={{ color: colors.text, fontWeight: '700', fontSize: 13 }}>
                📋 Cargar Factura de Ejemplo Éxito
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  'Escaneo con Foto OCR',
                  'Para fotos y OCR visual de tiquetes físicos con Gemini Vision, puedes usar la cámara en la versión Web.'
                );
              }}
              style={[styles.scanActionBtn, { backgroundColor: colors.inputBg, borderWidth: 1, borderColor: colors.border }]}
            >
              <Text style={{ color: colors.subtext, fontWeight: '600', fontSize: 13 }}>
                📷 Capturar con Foto (Web Vision)
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* PESTAÑA: ENTROPÍA & NUTRICIÓN */}
      {activeTab === 'entropy' && (
        <ScrollView style={{ flex: 1, padding: 16 }}>
          {/* Card Entropía */}
          <View style={[styles.entropyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={{ fontSize: 11, fontWeight: '800', color: colors.subtext, textTransform: 'uppercase' }}>
              Termodinámica de la Despensa
            </Text>
            <Text style={[styles.entropyScore, { color: entropyScore < 30 ? colors.accent : colors.warning }]}>
              {entropyScore}%
            </Text>
            <Text style={[styles.entropyDesc, { color: colors.text }]}>
              {entropyScore < 30
                ? '✨ Entropía Baja: Alimentos frescos, óptima rotación y cero desperdicio.'
                : '⚠️ Entropía Moderada: Revisa los productos próximos a su límite de días recomendados.'}
            </Text>
          </View>

          {/* Card Nutrición */}
          <View style={[styles.entropyCard, { backgroundColor: colors.card, borderColor: colors.border, marginTop: 12 }]}>
            <Text style={{ fontSize: 11, fontWeight: '800', color: colors.subtext, textTransform: 'uppercase' }}>
              Reservas Energéticas en Hogar
            </Text>
            <Text style={[styles.entropyScore, { color: colors.warning }]}>
              {Math.round(totalCalories).toLocaleString()} kcal
            </Text>
            <Text style={[styles.entropyDesc, { color: colors.text }]}>
              Aprox. {Math.round(totalCalories / 2000)} días de autonomía calórica para un adulto (base 2,000 kcal/día).
            </Text>
          </View>
        </ScrollView>
      )}

      {/* PESTAÑA: RADAR DE PRECIOS */}
      {activeTab === 'prices' && (
        <ScrollView style={{ flex: 1, padding: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '800', color: colors.text, marginBottom: 10 }}>
            Radar de Precios (¿Sube o Baja?)
          </Text>

          {priceTrends.length === 0 ? (
            <Text style={{ fontSize: 12, color: colors.subtext }}>No hay productos suficientes para comparar.</Text>
          ) : (
            priceTrends.map((p, i) => (
              <View
                key={i}
                style={[styles.priceRow, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.priceProdName, { color: colors.text }]}>{p.name}</Text>
                  <Text style={{ fontSize: 11, color: colors.subtext }}>
                    Actual: ${p.current.toLocaleString()} {p.prev ? `• Anterior: $${p.prev.toLocaleString()}` : ''}
                  </Text>
                </View>

                {p.diff !== undefined ? (
                  <View
                    style={[
                      styles.trendBadge,
                      { backgroundColor: p.diff > 0 ? '#FEE2E2' : '#DCFCE7' },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: '800',
                        color: p.diff > 0 ? colors.danger : colors.accentText,
                      }}
                    >
                      {p.diff > 0 ? `▲ +${p.diff}%` : `▼ ${p.diff}%`}
                    </Text>
                  </View>
                ) : (
                  <Text style={{ fontSize: 10, color: colors.subtext }}>1 compra</Text>
                )}
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* MODAL: AÑADIR MANUAL */}
      <Modal visible={showManualModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Nuevo Producto a Despensa</Text>

            <TextInput
              placeholder="Nombre del producto (ej. Avena, Leche)"
              placeholderTextColor={colors.subtext}
              value={manName}
              onChangeText={setManName}
              style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
            />

            <TextInput
              placeholder="Precio Unitario ($)"
              placeholderTextColor={colors.subtext}
              keyboardType="numeric"
              value={manPrice}
              onChangeText={setManPrice}
              style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
            />

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput
                placeholder="Cantidad (ej. 2)"
                placeholderTextColor={colors.subtext}
                keyboardType="numeric"
                value={manQty}
                onChangeText={setManQty}
                style={[styles.input, { flex: 1, backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
              />
              <TextInput
                placeholder="Vida útil (días)"
                placeholderTextColor={colors.subtext}
                keyboardType="numeric"
                value={manDays}
                onChangeText={setManDays}
                style={[styles.input, { flex: 1, backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setShowManualModal(false)} style={styles.cancelBtn}>
                <Text style={{ color: colors.subtext, fontWeight: '600' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveManual}
                style={[styles.saveBtn, { backgroundColor: colors.accent }]}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL: PROCESAR CON IA GEMINI FLASH-LITE (GRATIS) */}
      <Modal visible={showAiModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <View>
                <Text style={[styles.modalTitle, { color: colors.text, marginBottom: 2 }]}>
                  ✨ Extraer Mercado con IA
                </Text>
                <Text style={{ color: colors.accentText, fontSize: 11, fontWeight: '700' }}>
                  Gemini Flash-Lite • Modelo Gratuito
                </Text>
              </View>
              <TouchableOpacity onPress={() => !isProcessingAi && setShowAiModal(false)}>
                <Text style={{ fontSize: 18, color: colors.subtext }}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 12, color: colors.subtext, marginBottom: 10, lineHeight: 16 }}>
              Pega o escribe los productos de tu tiquete o mercado. La IA calculará automáticamente categorías, calorías, macros, precios y vida útil.
            </Text>

            <TextInput
              multiline
              numberOfLines={5}
              placeholder="ejemplo:&#10;1kg pechuga de pollo $18.000&#10;2 bolsas de leche alquería $9.000&#10;1 cubeta huevos AA $19.000&#10;3 atunes lomitos $16.500"
              placeholderTextColor={colors.subtext}
              value={aiTextReceipt}
              onChangeText={setAiTextReceipt}
              editable={!isProcessingAi}
              style={[
                styles.input,
                {
                  height: 110,
                  textAlignVertical: 'top',
                  backgroundColor: colors.inputBg,
                  borderColor: colors.border,
                  color: colors.text,
                  fontSize: 12,
                },
              ]}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setShowAiModal(false)}
                disabled={isProcessingAi}
                style={styles.cancelBtn}
              >
                <Text style={{ color: colors.subtext, fontWeight: '600' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleProcessAiText}
                disabled={isProcessingAi}
                style={[styles.saveBtn, { backgroundColor: colors.accent, opacity: isProcessingAi ? 0.7 : 1 }]}
              >
                {isProcessingAi ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>Analizar con IA (Gratis)</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  backBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
  headerTitle: { fontSize: 16, fontWeight: '800' },
  headerSub: { fontSize: 11, marginTop: 1 },
  addBtn: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 },
  tabsRow: { flexDirection: 'row', padding: 6, borderBottomWidth: 1 },
  tabBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8, borderWidth: 1, borderColor: 'transparent' },
  tabBtnText: { fontSize: 11, fontWeight: '600' },
  searchInput: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, fontSize: 13, marginBottom: 10 },
  catChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, marginRight: 6 },
  productCard: { borderWidth: 1, padding: 14, borderRadius: 16, marginBottom: 10 },
  productName: { fontSize: 14, fontWeight: '800' },
  productMeta: { fontSize: 11, marginTop: 2 },
  badgeUrgency: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  consumeBtn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1 },
  emptyCard: { borderWidth: 1, padding: 24, borderRadius: 20, alignItems: 'center', marginTop: 20 },
  emptyTitle: { fontSize: 15, fontWeight: '800', textAlign: 'center' },
  emptyDesc: { fontSize: 12, textAlign: 'center', marginTop: 4, marginBottom: 16 },
  sampleBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  scannerBox: { borderWidth: 1, padding: 24, borderRadius: 24, alignItems: 'center' },
  scannerTitle: { fontSize: 17, fontWeight: '800', textAlign: 'center' },
  scannerSub: { fontSize: 12, textAlign: 'center', marginTop: 6, marginBottom: 20, lineHeight: 18 },
  scanActionBtn: { width: '100%', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  entropyCard: { borderWidth: 1, padding: 20, borderRadius: 20 },
  entropyScore: { fontSize: 32, fontWeight: '900', marginVertical: 6 },
  entropyDesc: { fontSize: 12, lineHeight: 18 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, padding: 14, borderRadius: 14, marginBottom: 8 },
  priceProdName: { fontSize: 13, fontWeight: '700' },
  trendBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalCard: { borderWidth: 1, padding: 20, borderRadius: 24 },
  modalTitle: { fontSize: 16, fontWeight: '800', marginBottom: 14 },
  input: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 13, marginBottom: 10 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 6 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 16 },
  saveBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
});
