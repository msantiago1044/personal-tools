import React, { useState, useEffect, useRef, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import {
  PantryItem,
  GroceryReceipt,
  PantryItemStatus,
  ProductPriceHistory,
} from '../../../../packages/shared/src/types';
import {
  parseReceiptWithGemini,
  calculatePantryEntropy,
  calculatePriceTrends,
  calculateConsumptionVelocity,
  ExtractedReceiptData,
  FREE_TIER_MODELS,
} from '../../lib/pantryAiEngine';
import {
  ShoppingBag,
  Camera,
  Upload,
  Flame,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  Check,
  AlertTriangle,
  Trash2,
  Plus,
  Search,
  Calendar,
  Layers,
  Activity,
  ArrowLeft,
  Sparkles,
  Key,
  X,
  RefreshCw,
  Clock,
  Info,
  DollarSign,
  Utensils,
  ChevronRight,
  ShieldCheck,
  Save,
  FileText,
  Pencil,
} from 'lucide-react';
import { PriceEvolutionModal } from '../../components/pantry/PriceEvolutionModal';
import { ProductDetailModal } from '../../components/pantry/ProductDetailModal';
import { NutritionAnalytics } from '../../components/pantry/NutritionAnalytics';

interface PantryModuleProps {
  user: any;
  onBackToHub: () => void;
}

type ActiveTab = 'scanner' | 'receipts' | 'prices' | 'inventory' | 'nutrition' | 'entropy';

const CATEGORIES = [
  'Todas',
  'Proteínas',
  'Lácteos',
  'Granos & Cereales',
  'Frutas & Verduras',
  'Aseo & Limpieza',
  'Mascotas',
  'Snacks & Bebidas',
  'Condimentos & Aceites',
  'Panadería',
  'Despensa',
];

export const PantryModule: React.FC<PantryModuleProps> = ({ user, onBackToHub }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('scanner');
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [receipts, setReceipts] = useState<GroceryReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'disponible' | 'agotado'>('disponible');

  // Modal API Key
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(
    localStorage.getItem('gemini_api_key') ||
    (import.meta as any).env?.VITE_GEMINI_API_KEY ||
    ''
  );
  const [apiKeySavedNotice, setApiKeySavedNotice] = useState(false);

  // Escáner & Cámara
  const [scannerMode, setScannerMode] = useState<'upload' | 'camera'>('upload');
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Factura seleccionada para ver/editar detalle y productos
  const [selectedReceipt, setSelectedReceipt] = useState<GroceryReceipt | null>(null);
  const [editingReceiptData, setEditingReceiptData] = useState<GroceryReceipt | null>(null);
  const [receiptEditItems, setReceiptEditItems] = useState<PantryItem[]>([]);
  const [isSavingReceiptChanges, setIsSavingReceiptChanges] = useState(false);
  const [receiptSavedNotice, setReceiptSavedNotice] = useState(false);

  // Producto seleccionado para ver historial y evolución de precios
  const [selectedPriceProduct, setSelectedPriceProduct] = useState<ProductPriceHistory | null>(null);

  // Producto seleccionado en despensa para ver ventana flotante (Nutrición, Consumo & ISA)
  const [selectedPantryItemDetail, setSelectedPantryItemDetail] = useState<PantryItem | null>(null);
  const [openModalInEditMode, setOpenModalInEditMode] = useState(false);

  // Datos extraídos listos para revisar antes de guardar
  const [extractedData, setExtractedData] = useState<ExtractedReceiptData | null>(null);
  const [savingReceipt, setSavingReceipt] = useState(false);

  // Modal de Nuevo Producto Manual
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualCategory, setManualCategory] = useState('Proteínas');
  const [manualQty, setManualQty] = useState('1');
  const [manualUnit, setManualUnit] = useState('unidad');
  const [manualPrice, setManualPrice] = useState('');
  const [manualShelfLife, setManualShelfLife] = useState('14');
  const [manualCalories, setManualCalories] = useState('200');

  // Modal de Confirmación de Borrado
  const [itemToDelete, setItemToDelete] = useState<PantryItem | null>(null);
  const [receiptToDelete, setReceiptToDelete] = useState<GroceryReceipt | null>(null);

  // 1. CARGA DE DATOS (SUPABASE CON FALLBACK A LOCALSTORAGE)
  const loadData = async () => {
    setLoading(true);
    try {
      // Intentar cargar de Supabase
      const { data: dbItems, error: itemsErr } = await supabase
        .from('pantry_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const { data: dbReceipts, error: rcErr } = await supabase
        .from('grocery_receipts')
        .select('*')
        .eq('user_id', user.id)
        .order('purchase_date', { ascending: false });

      if (!itemsErr && dbItems) {
        setPantryItems(dbItems);
        localStorage.setItem(`pantry_items_${user.id}`, JSON.stringify(dbItems));
      } else {
        // Fallback a localStorage
        const local = localStorage.getItem(`pantry_items_${user.id}`);
        if (local) setPantryItems(JSON.parse(local));
      }

      if (!rcErr && dbReceipts) {
        setReceipts(dbReceipts);
        localStorage.setItem(`pantry_receipts_${user.id}`, JSON.stringify(dbReceipts));
      } else {
        const localRc = localStorage.getItem(`pantry_receipts_${user.id}`);
        if (localRc) setReceipts(JSON.parse(localRc));
      }
    } catch (e) {
      console.error('Error cargando despensa:', e);
      const local = localStorage.getItem(`pantry_items_${user.id}`);
      if (local) setPantryItems(JSON.parse(local));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user.id]);

  // Guardar en Storage local de respaldo
  const persistLocally = (newItems: PantryItem[], newReceipts: GroceryReceipt[]) => {
    localStorage.setItem(`pantry_items_${user.id}`, JSON.stringify(newItems));
    localStorage.setItem(`pantry_receipts_${user.id}`, JSON.stringify(newReceipts));
  };

  // 2. CÁLCULOS ANALÍTICOS (ENTROPÍA, CALORÍAS, PRECIOS, VELOCIDAD)
  const entropyMetrics = useMemo(() => calculatePantryEntropy(pantryItems), [pantryItems]);
  const priceTrends = useMemo(() => calculatePriceTrends(pantryItems), [pantryItems]);
  const consumptionVelocities = useMemo(() => calculateConsumptionVelocity(pantryItems), [pantryItems]);

  const activeItems = useMemo(
    () => pantryItems.filter((i) => i.status === 'disponible' || i.status === 'consumiendo'),
    [pantryItems]
  );

  const totalCaloriesAvailable = useMemo(() => {
    return activeItems.reduce((acc, item) => acc + (Number(item.total_calories) || (item.calories_per_unit * item.quantity)), 0);
  }, [activeItems]);

  const totalProteinG = useMemo(() => {
    return activeItems.reduce((acc, item) => acc + ((Number(item.protein_g) || 0) * item.quantity), 0);
  }, [activeItems]);

  const totalCarbsG = useMemo(() => {
    return activeItems.reduce((acc, item) => acc + ((Number(item.carbs_g) || 0) * item.quantity), 0);
  }, [activeItems]);

  const totalFatG = useMemo(() => {
    return activeItems.reduce((acc, item) => acc + ((Number(item.fat_g) || 0) * item.quantity), 0);
  }, [activeItems]);

  const totalStockValue = useMemo(() => {
    return activeItems.reduce((acc, item) => acc + Number(item.total_price || item.unit_price * item.quantity), 0);
  }, [activeItems]);

  // 3. ACCIONES DE CONSUMO (CONSUMIR 1 UNIDAD O AGOTAR)
  const handleConsumeItem = async (item: PantryItem, full: boolean = false) => {
    const today = new Date();
    const purchaseDate = new Date(item.purchase_date);
    const daysSincePurchase = Math.max(1, Math.round((today.getTime() - purchaseDate.getTime()) / (1000 * 86400)));

    let updatedQuantity = full ? 0 : Math.max(0, item.quantity - 1);
    let updatedStatus: PantryItemStatus = updatedQuantity <= 0 ? 'agotado' : 'consumiendo';

    const updatedItem: PantryItem = {
      ...item,
      quantity: updatedQuantity,
      status: updatedStatus,
      consumed_at: updatedQuantity <= 0 ? today.toISOString() : item.consumed_at,
      consumption_days: updatedQuantity <= 0 ? daysSincePurchase : item.consumption_days,
      updated_at: today.toISOString(),
    };

    // Actualizar estado local
    const newItems = pantryItems.map((i) => (i.id === item.id ? updatedItem : i));
    setPantryItems(newItems);
    persistLocally(newItems, receipts);

    // Actualizar en Supabase
    try {
      await supabase
        .from('pantry_items')
        .update({
          quantity: updatedItem.quantity,
          status: updatedItem.status,
          consumed_at: updatedItem.consumed_at,
          consumption_days: updatedItem.consumption_days,
          updated_at: updatedItem.updated_at,
        })
        .eq('id', item.id);
    } catch (e) {
      console.warn('Supabase update warning, guardado localmente');
    }
  };

  // Auto-agotar productos existentes al comprar nuevamente el mismo producto
  const autoDepletePreviousPurchases = async (
    newPurchases: { name: string; purchase_date?: string }[],
    currentItemsList: PantryItem[]
  ): Promise<PantryItem[]> => {
    if (!newPurchases.length) return currentItemsList;

    const namesToDeplete = new Set(
      newPurchases
        .map((p) => p.name.trim().toLowerCase())
        .filter((n) => n.length > 0)
    );

    const today = new Date();
    const updatedList: PantryItem[] = [];
    const depletedIds: string[] = [];

    for (const item of currentItemsList) {
      const normName = (item.name || '').trim().toLowerCase();
      const isActive = item.status === 'disponible' || item.status === 'consumiendo';

      if (isActive && namesToDeplete.has(normName)) {
        // Al comprarlo nuevamente, el lote previo se marca como agotado automáticamente
        const purchaseDate = new Date(item.purchase_date);
        const daysSincePurchase = Math.max(1, Math.round((today.getTime() - purchaseDate.getTime()) / (1000 * 86400)));
        const depletedItem: PantryItem = {
          ...item,
          quantity: 0,
          status: 'agotado',
          consumed_at: today.toISOString(),
          consumption_days: daysSincePurchase,
          updated_at: today.toISOString(),
        };
        updatedList.push(depletedItem);
        depletedIds.push(item.id);
      } else {
        updatedList.push(item);
      }
    }

    if (depletedIds.length > 0) {
      try {
        await supabase
          .from('pantry_items')
          .update({
            quantity: 0,
            status: 'agotado',
            consumed_at: today.toISOString(),
            updated_at: today.toISOString(),
          })
          .in('id', depletedIds);
      } catch (err) {
        console.warn('Advertencia actualizando productos auto-agotados en Supabase:', err);
      }
    }

    return updatedList;
  };

  // Modificar cantidad, unidad, precio o datos de un producto individual
  const handleUpdateIndividualItem = async (updatedItem: PantryItem) => {
    const newItems = pantryItems.map((i) => (i.id === updatedItem.id ? updatedItem : i));
    setPantryItems(newItems);
    persistLocally(newItems, receipts);
    setSelectedPantryItemDetail(updatedItem);

    try {
      await supabase
        .from('pantry_items')
        .update({
          name: updatedItem.name,
          category: updatedItem.category,
          quantity: updatedItem.quantity,
          unit: updatedItem.unit,
          unit_price: updatedItem.unit_price,
          total_price: updatedItem.total_price || (updatedItem.unit_price * updatedItem.quantity),
          shelf_life_days: updatedItem.shelf_life_days,
          calories_per_unit: Number(updatedItem.calories_per_unit) || 0,
          total_calories: Number(updatedItem.total_calories) || (Number(updatedItem.calories_per_unit) * Number(updatedItem.quantity)) || 0,
          protein_g: Number(updatedItem.protein_g) || 0,
          carbs_g: Number(updatedItem.carbs_g) || 0,
          fat_g: Number(updatedItem.fat_g) || 0,
          status: updatedItem.status,
          updated_at: updatedItem.updated_at,
        })
        .eq('id', updatedItem.id);
    } catch (err) {
      console.warn('Error sincronizando actualización individual en Supabase:', err);
    }
  };

  // 4. BORRAR PRODUCTO
  const confirmDeleteItem = async () => {
    if (!itemToDelete) return;
    const newItems = pantryItems.filter((i) => i.id !== itemToDelete.id);
    setPantryItems(newItems);
    persistLocally(newItems, receipts);

    try {
      await supabase.from('pantry_items').delete().eq('id', itemToDelete.id);
    } catch (e) {
      console.warn('Supabase delete error');
    }
    setItemToDelete(null);
  };

  // 5. ESCANEAR CON CÁMARA
  const startCamera = async () => {
    try {
      setCameraActive(true);
      setScanError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Error abriendo cámara:', err);
      setScanError('No se pudo acceder a la cámara. Por favor permite los permisos o sube una imagen.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      stopCamera();
      processReceiptImage(dataUrl);
    }
  };

  // 6. PROCESAR IMAGEN DE FACTURA (FILE O CÁMARA)
  const processReceiptImage = async (base64Image: string) => {
    setIsScanning(true);
    setScanError(null);
    try {
      const apiKey = localStorage.getItem('gemini_api_key') || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
      const result = await parseReceiptWithGemini(base64Image, apiKey);
      setExtractedData(result);
    } catch (err: any) {
      console.error('Error procesando factura:', err);
      setScanError(
        err.message || 'Error procesando la imagen. Verifica que sea legible o configura tu API Key de Gemini.'
      );
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        processReceiptImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // 7. GESTIÓN Y EDICIÓN DE FACTURAS Y PRODUCTOS
  const openReceiptDetails = (rc: GroceryReceipt) => {
    setSelectedReceipt(rc);
    setEditingReceiptData({ ...rc });
    const items = pantryItems.filter((i) => i.receipt_id === rc.id);
    setReceiptEditItems(JSON.parse(JSON.stringify(items)));
    setReceiptSavedNotice(false);
  };

  const closeReceiptDetails = () => {
    setSelectedReceipt(null);
    setEditingReceiptData(null);
    setReceiptEditItems([]);
    setReceiptSavedNotice(false);
  };

  const handleUpdateReceiptItem = (index: number, field: keyof PantryItem, value: any) => {
    setReceiptEditItems((prev) => {
      const next = [...prev];
      const item = { ...next[index], [field]: value };

      if (field === 'quantity' || field === 'unit_price') {
        const q = field === 'quantity' ? Number(value) || 0 : Number(item.quantity) || 0;
        const u = field === 'unit_price' ? Number(value) || 0 : Number(item.unit_price) || 0;
        item.total_price = q * u;
        item.total_calories = (Number(item.calories_per_unit) || 0) * q;
      }

      if (field === 'calories_per_unit') {
        item.total_calories = (Number(value) || 0) * (Number(item.quantity) || 0);
      }

      next[index] = item;
      return next;
    });
  };

  const handleAddProductToReceipt = () => {
    if (!editingReceiptData) return;
    const newItem: PantryItem = {
      id: crypto.randomUUID(),
      user_id: user.id,
      receipt_id: editingReceiptData.id,
      name: '',
      category: 'Despensa',
      quantity: 1,
      initial_quantity: 1,
      unit: 'un',
      unit_price: 0,
      total_price: 0,
      purchase_date: editingReceiptData.purchase_date || new Date().toISOString().split('T')[0],
      shelf_life_days: 14,
      calories_per_unit: 0,
      total_calories: 0,
      protein_g: 0,
      carbs_g: 0,
      fat_g: 0,
      status: 'disponible',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setReceiptEditItems((prev) => [...prev, newItem]);
  };

  const handleRemoveProductFromReceipt = (index: number) => {
    setReceiptEditItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveReceiptChanges = async () => {
    if (!selectedReceipt || !editingReceiptData) return;
    setIsSavingReceiptChanges(true);

    try {
      const calculatedTotal = receiptEditItems.reduce(
        (acc, it) => acc + (Number(it.total_price) || (Number(it.unit_price) * Number(it.quantity)) || 0),
        0
      );
      const updatedReceipt: GroceryReceipt = {
        ...editingReceiptData,
        total_amount: calculatedTotal > 0 ? calculatedTotal : editingReceiptData.total_amount,
        items_count: receiptEditItems.length,
      };

      try {
        await supabase.from('grocery_receipts').upsert({
          id: updatedReceipt.id,
          user_id: updatedReceipt.user_id,
          store_name: updatedReceipt.store_name,
          purchase_date: updatedReceipt.purchase_date,
          total_amount: updatedReceipt.total_amount,
          items_count: updatedReceipt.items_count,
          notes: updatedReceipt.notes,
        });

        const originalItemIds = pantryItems
          .filter((it) => it.receipt_id === selectedReceipt.id)
          .map((it) => it.id);
        const currentItemIds = new Set(receiptEditItems.map((it) => it.id));
        const deletedItemIds = originalItemIds.filter((id) => !currentItemIds.has(id));

        if (deletedItemIds.length > 0) {
          await supabase.from('pantry_items').delete().in('id', deletedItemIds);
        }

        if (receiptEditItems.length > 0) {
          await supabase.from('pantry_items').upsert(
            receiptEditItems.map((it) => ({
              id: it.id,
              user_id: user.id,
              receipt_id: updatedReceipt.id,
              name: it.name || 'Producto sin nombre',
              category: it.category || 'Despensa',
              quantity: Number(it.quantity) || 0,
              initial_quantity: Number(it.initial_quantity) || Number(it.quantity) || 0,
              unit: it.unit || 'un',
              unit_price: Number(it.unit_price) || 0,
              total_price: Number(it.total_price) || (Number(it.unit_price) * Number(it.quantity)) || 0,
              purchase_date: updatedReceipt.purchase_date || it.purchase_date,
              shelf_life_days: Number(it.shelf_life_days) || 14,
              calories_per_unit: Number(it.calories_per_unit) || 0,
              total_calories: Number(it.total_calories) || (Number(it.calories_per_unit) * Number(it.quantity)) || 0,
              protein_g: Number(it.protein_g) || 0,
              carbs_g: Number(it.carbs_g) || 0,
              fat_g: Number(it.fat_g) || 0,
              status: it.status || 'disponible',
              updated_at: new Date().toISOString(),
            }))
          );
        }
      } catch (dbErr) {
        console.warn('Error sincronizando con Supabase, respaldando localmente:', dbErr);
      }

      const newReceipts = receipts.map((r) => (r.id === updatedReceipt.id ? updatedReceipt : r));
      const remainingItems = pantryItems.filter((it) => it.receipt_id !== selectedReceipt.id);
      const updatedRemaining = await autoDepletePreviousPurchases(receiptEditItems, remainingItems);
      const newItems = [...receiptEditItems, ...updatedRemaining];

      setReceipts(newReceipts);
      setPantryItems(newItems);
      persistLocally(newItems, newReceipts);

      setSelectedReceipt(updatedReceipt);
      setEditingReceiptData(updatedReceipt);
      setReceiptSavedNotice(true);
      setTimeout(() => setReceiptSavedNotice(false), 3000);
    } catch (err) {
      console.error('Error guardando cambios de factura:', err);
    } finally {
      setIsSavingReceiptChanges(false);
    }
  };

  // 8. GUARDAR FACTURA Y PRODUCTOS EXTRACTADOS EN LA BASE DE DATOS
  const handleSaveExtractedReceipt = async () => {
    if (!extractedData) return;
    setSavingReceipt(true);

    try {
      const receiptId = crypto.randomUUID();
      const newReceipt: GroceryReceipt = {
        id: receiptId,
        user_id: user.id,
        store_name: extractedData.store_name,
        purchase_date: extractedData.purchase_date,
        total_amount: extractedData.total_amount,
        items_count: extractedData.items.length,
        notes: `Método: ${extractedData.payment_method || 'General'}`,
        created_at: new Date().toISOString(),
      };

      const newItemsToAdd: PantryItem[] = extractedData.items.map((item) => {
        const itemId = crypto.randomUUID();
        const totalCals = item.calories_per_unit * item.quantity;
        return {
          id: itemId,
          user_id: user.id,
          receipt_id: receiptId,
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          initial_quantity: item.quantity,
          unit: item.unit,
          unit_price: item.unit_price,
          total_price: item.total_price || item.unit_price * item.quantity,
          purchase_date: extractedData.purchase_date,
          shelf_life_days: item.shelf_life_days,
          calories_per_unit: item.calories_per_unit,
          total_calories: totalCals,
          protein_g: item.protein_g,
          carbs_g: item.carbs_g,
          fat_g: item.fat_g,
          status: 'disponible',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      });

      // Guardar en Supabase
      try {
        await supabase.from('grocery_receipts').insert({
          id: newReceipt.id,
          user_id: newReceipt.user_id,
          store_name: newReceipt.store_name,
          purchase_date: newReceipt.purchase_date,
          total_amount: newReceipt.total_amount,
          items_count: newReceipt.items_count,
          notes: newReceipt.notes,
        });

        await supabase.from('pantry_items').insert(
          newItemsToAdd.map((it) => ({
            id: it.id,
            user_id: it.user_id,
            receipt_id: it.receipt_id,
            name: it.name,
            category: it.category,
            quantity: it.quantity,
            initial_quantity: it.initial_quantity,
            unit: it.unit,
            unit_price: it.unit_price,
            total_price: it.total_price,
            purchase_date: it.purchase_date,
            shelf_life_days: it.shelf_life_days,
            calories_per_unit: it.calories_per_unit,
            total_calories: it.total_calories,
            protein_g: it.protein_g,
            carbs_g: it.carbs_g,
            fat_g: it.fat_g,
            status: it.status,
          }))
        );
      } catch (dbErr) {
        console.warn('Error en Supabase al insertar factura, guardando localmente:', dbErr);
      }

      // Actualizar estado local
      const updatedReceipts = [newReceipt, ...receipts];
      // Si se compró nuevamente el producto, el lote anterior se marca como agotado
      const depletedExistingItems = await autoDepletePreviousPurchases(newItemsToAdd, pantryItems);
      const updatedItems = [...newItemsToAdd, ...depletedExistingItems];
      setReceipts(updatedReceipts);
      setPantryItems(updatedItems);
      persistLocally(updatedItems, updatedReceipts);

      setExtractedData(null);
      setActiveTab('inventory');
    } catch (e: any) {
      console.error('Error guardando factura:', e);
      setScanError('Error guardando la factura: ' + e.message);
    } finally {
      setSavingReceipt(false);
    }
  };

  // 9. GUARDAR PRODUCTO MANUAL
  const handleSaveManualItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) return;

    const qty = parseFloat(manualQty.replace(',', '.')) || 1;
    const price = parseFloat(manualPrice.replace(',', '.')) || 0;
    const shelfLife = parseInt(manualShelfLife) || 14;
    const cal = parseFloat(manualCalories.replace(',', '.')) || 0;

    const newItem: PantryItem = {
      id: crypto.randomUUID(),
      user_id: user.id,
      name: manualName.trim(),
      category: manualCategory,
      quantity: qty,
      initial_quantity: qty,
      unit: manualUnit,
      unit_price: price,
      total_price: price * qty,
      purchase_date: new Date().toISOString().split('T')[0],
      shelf_life_days: shelfLife,
      calories_per_unit: cal,
      total_calories: cal * qty,
      protein_g: 0,
      carbs_g: 0,
      fat_g: 0,
      status: 'disponible',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const depletedExistingItems = await autoDepletePreviousPurchases([newItem], pantryItems);
    const newItems = [newItem, ...depletedExistingItems];
    setPantryItems(newItems);
    persistLocally(newItems, receipts);

    try {
      await supabase.from('pantry_items').insert({
        id: newItem.id,
        user_id: newItem.user_id,
        name: newItem.name,
        category: newItem.category,
        quantity: newItem.quantity,
        initial_quantity: newItem.initial_quantity,
        unit: newItem.unit,
        unit_price: newItem.unit_price,
        total_price: newItem.total_price,
        purchase_date: newItem.purchase_date,
        shelf_life_days: newItem.shelf_life_days,
        calories_per_unit: newItem.calories_per_unit,
        total_calories: newItem.total_calories,
        status: newItem.status,
      });
    } catch (e) {
      console.warn('Error insertando manual en Supabase');
    }

    setManualName('');
    setManualPrice('');
    setShowManualModal(false);
  };

  // Filtrado de productos en despensa
  const filteredItems = useMemo(() => {
    return pantryItems.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory === 'Todas' || item.category === selectedCategory;
      const matchStatus =
        statusFilter === 'todos'
          ? true
          : statusFilter === 'disponible'
          ? item.status === 'disponible' || item.status === 'consumiendo'
          : item.status === 'agotado';
      return matchSearch && matchCat && matchStatus;
    });
  }, [pantryItems, searchTerm, selectedCategory, statusFilter]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* 1. TOP HEADER & BARRA DE ACCIONES */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHub}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition flex items-center gap-1.5 text-xs font-semibold"
              title="Volver al Hub"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Hub</span>
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-lg text-emerald-600 dark:text-emerald-400">
                🛒
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Despensa & Mercado
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Inventario, facturas y nutrición
                </p>
              </div>
            </div>
          </div>

          {/* Botones de acción rápida */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('scanner')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-xs transition"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Escanear</span>
            </button>

            <button
              onClick={() => setShowManualModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 transition"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Agregar</span>
            </button>

            <button
              onClick={() => setShowApiKeyModal(true)}
              title="API Key Gemini"
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition"
            >
              <Key className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Resumen KPI Rápido */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
              <span>Despensa Activa</span>
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <p className="text-lg font-black text-slate-900 dark:text-white">
              {activeItems.length}{' '}
              <span className="text-xs font-medium text-slate-400">productos</span>
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
              <span>Energía Disponible</span>
              <Flame className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <p className="text-lg font-black text-amber-600 dark:text-amber-400">
              {Math.round(totalCaloriesAvailable).toLocaleString()}{' '}
              <span className="text-xs font-medium text-slate-400">kcal</span>
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
              <span>Entropía Despensa</span>
              <Zap className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <p
                className={`text-lg font-black ${
                  entropyMetrics.entropy_score < 30
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : entropyMetrics.entropy_score < 60
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {entropyMetrics.entropy_score}%
              </p>
              <span className="text-[10px] uppercase font-bold text-slate-400">
                {entropyMetrics.freshness_level}
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
              <span>Valor en Inventario</span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <p className="text-lg font-black text-slate-900 dark:text-white">
              ${' '}
              {totalStockValue.toLocaleString('es-ES', {
                maximumFractionDigits: 0,
              })}
            </p>
          </div>
        </div>
      </header>

      {/* 2. BARRA DE PESTAÑAS */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex gap-1 overflow-x-auto py-2 no-scrollbar">
          {[
            { id: 'scanner', label: 'Escáner', icon: Camera },
            { id: 'receipts', label: 'Facturas', icon: Layers, count: receipts.length },
            { id: 'prices', label: 'Precios', icon: TrendingUp },
            { id: 'inventory', label: 'Despensa', icon: ShoppingBag, count: activeItems.length },
            { id: 'nutrition', label: 'Nutrición', icon: Flame },
            { id: 'entropy', label: 'Consumo', icon: Zap },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as ActiveTab);
                  if (tab.id !== 'scanner') stopCamera();
                  if (tab.id !== 'receipts') closeReceiptDetails();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                  isCurrent
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isCurrent
                        ? 'bg-emerald-200/60 dark:bg-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3. CONTENIDO PRINCIPAL POR PESTAÑA */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        {/* ========================================================================= */}
        {/* PESTAÑA 1: MI DESPENSA (INVENTARIO ACTIVO)                                */}
        {/* ========================================================================= */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            {/* Filtros y Búsqueda */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar en despensa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setStatusFilter('disponible')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    statusFilter === 'disponible'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  En Stock ({activeItems.length})
                </button>
                <button
                  onClick={() => setStatusFilter('agotado')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    statusFilter === 'agotado'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Consumidos ({pantryItems.filter((i) => i.status === 'agotado').length})
                </button>
                <button
                  onClick={() => setStatusFilter('todos')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    statusFilter === 'todos'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Todos ({pantryItems.length})
                </button>
              </div>
            </div>

            {/* Categorías Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid de Productos */}
            {filteredItems.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-3xl mx-auto mb-4">
                  🧺
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  No hay productos registrados en esta vista
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                  Toma una foto a tu factura de mercado para que la IA extraiga los alimentos, precios y calorías
                  automáticamente, o añade uno manualmente.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setActiveTab('scanner')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Escanear Factura</span>
                  </button>
                  <button
                    onClick={() => setShowManualModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Añadir Manualmente</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item) => {
                  const today = new Date();
                  const pDate = new Date(item.purchase_date);
                  const daysInPantry = Math.max(0, Math.floor((today.getTime() - pDate.getTime()) / (1000 * 86400)));
                  const shelfLife = item.shelf_life_days || 14;
                  const ratio = Math.min(1.0, daysInPantry / shelfLife);

                  let urgencyColor = 'bg-emerald-500';
                  let urgencyText = 'Fresco';
                  if (ratio >= 1.0) {
                    urgencyColor = 'bg-rose-500';
                    urgencyText = 'Vencido / Consumir ya';
                  } else if (ratio >= 0.7) {
                    urgencyColor = 'bg-amber-500';
                    urgencyText = 'Prioritario';
                  }

                  const isConsumed = item.status === 'agotado';

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedPantryItemDetail(item)}
                      className={`p-5 rounded-3xl border transition flex flex-col justify-between cursor-pointer group ${
                        isConsumed
                          ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60 opacity-60 hover:opacity-100 hover:border-slate-400'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-500 shadow-sm hover:shadow-md'
                      }`}
                    >
                      <div>
                        {/* Cabecera de la tarjeta */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {item.category}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${urgencyColor}`}
                          >
                            {isConsumed ? 'Agotado' : urgencyText}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                          {item.name}
                        </h4>

                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {item.quantity} {item.unit}
                          </span>
                          <span>•</span>
                          <span>${Number(item.unit_price || 0).toLocaleString()} c/u</span>
                        </div>

                        {/* Barra de frescura y degradación */}
                        {!isConsumed && (
                          <div className="space-y-1 mb-4 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                            <div className="flex justify-between text-[11px] text-slate-500">
                              <span>Vida útil: {daysInPantry} / {shelfLife} días</span>
                              <span className="font-bold text-slate-700 dark:text-slate-300">
                                {Math.max(0, shelfLife - daysInPantry)} días restantes
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${urgencyColor}`}
                                style={{ width: `${Math.min(100, ratio * 100)}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Métricas Nutricionales */}
                        <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300 mb-4">
                          <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                            <Flame className="w-3 h-3" />
                            {Math.round(item.calories_per_unit * item.quantity)} kcal
                          </span>
                          {item.protein_g > 0 && <span>• {item.protein_g}g Prot</span>}
                          {item.carbs_g > 0 && <span>• {item.carbs_g}g Carb</span>}
                        </div>
                      </div>

                      {/* Pie de la tarjeta interactivo: Abre ventana flotante al hacer clic */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Nutrición & ISA</span>
                          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                        </div>

                        {!isConsumed ? (
                          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => {
                                setSelectedPantryItemDetail(item);
                                setOpenModalInEditMode(true);
                              }}
                              title="Modificar cantidad, unidad o precio"
                              className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleConsumeItem(item, true)}
                              title="Marcar como agotado"
                              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 transition"
                            >
                              Agotar
                            </button>
                            <button
                              onClick={() => setItemToDelete(item)}
                              className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition"
                              title="Eliminar producto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div
                            className="flex items-center gap-1.5 text-xs text-slate-400"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>Consumido en {item.consumption_days || '—'}d</span>
                            <button
                              onClick={() => {
                                setSelectedPantryItemDetail(item);
                                setOpenModalInEditMode(true);
                              }}
                              title="Modificar producto"
                              className="p-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setItemToDelete(item)}
                              className="text-slate-400 hover:text-rose-500 transition p-1"
                              title="Eliminar producto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 2: ESCÁNER DE FACTURAS (CÁMARA / FOTO / IA)                      */}
        {/* ========================================================================= */}
        {activeTab === 'scanner' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Escáner de Facturas Inteligente</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Toma una foto con tu cámara o sube una imagen de tu factura de compra.
              </p>
            </div>

            {/* Selector de modo */}
            <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  setScannerMode('upload');
                  stopCamera();
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  scannerMode === 'upload'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Subir Imagen</span>
              </button>

              <button
                onClick={() => {
                  setScannerMode('camera');
                  startCamera();
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  scannerMode === 'camera'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Cámara en Vivo</span>
              </button>
            </div>

            {/* Error banner si hubo problema */}
            {scanError && (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-500/30 rounded-2xl text-xs text-rose-800 dark:text-rose-300 space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Atención en el escaneo</span>
                </div>
                <p>{scanError}</p>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setShowApiKeyModal(true)}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold"
                  >
                    Configurar Gemini API Key
                  </button>
                </div>
              </div>
            )}

            {/* Loading / Scanning */}
            {isScanning && (
              <div className="p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-center space-y-3">
                <div className="w-12 h-12 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Analizando factura con Gemini Vision OCR...
                </h4>
                <p className="text-xs text-slate-400">
                  Extrayendo supermercado, productos, precios, estimando vida útil y perfiles calóricos.
                </p>
              </div>
            )}

            {/* Modo Cámara en Vivo */}
            {scannerMode === 'camera' && !isScanning && !extractedData && (
              <div className="bg-slate-950 rounded-3xl overflow-hidden relative border border-slate-800 flex flex-col items-center p-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full max-h-96 object-cover rounded-2xl"
                />
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={capturePhoto}
                    className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg flex items-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Capturar y Procesar Factura</span>
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-4 py-3 rounded-2xl bg-slate-800 text-slate-300 font-semibold text-xs"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Modo Subir Imagen */}
            {scannerMode === 'upload' && !isScanning && !extractedData && (
              <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-3xl bg-white dark:bg-slate-900 text-center transition">
                <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-3xl mx-auto mb-4">
                  🧾
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  Arrastra o selecciona la foto de tu factura
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
                  Soporta formatos JPG, PNG y WebP. La IA reconocerá los productos, precios y datos nutricionales.
                </p>
                <label className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md cursor-pointer transition">
                  <Upload className="w-4 h-4" />
                  <span>Seleccionar Archivo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* VISTA PREVIA Y CONFIRMACIÓN DE LOS PRODUCTOS EXTRAÍDOS */}
            {extractedData && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                      Extracción completada con éxito
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Revisión de Factura: {extractedData.store_name}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setExtractedData(null)}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                    >
                      Descartar
                    </button>
                    <button
                      onClick={handleSaveExtractedReceipt}
                      disabled={savingReceipt}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>{savingReceipt ? 'Guardando...' : 'Confirmar & Guardar en Despensa'}</span>
                    </button>
                  </div>
                </div>

                {/* Datos generales de la factura */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Supermercado</label>
                    <input
                      type="text"
                      value={extractedData.store_name}
                      onChange={(e) => setExtractedData({ ...extractedData, store_name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Fecha de Compra</label>
                    <input
                      type="date"
                      value={extractedData.purchase_date}
                      onChange={(e) => setExtractedData({ ...extractedData, purchase_date: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Total Pagado ($)</label>
                    <input
                      type="number"
                      value={extractedData.total_amount}
                      onChange={(e) =>
                        setExtractedData({ ...extractedData, total_amount: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-emerald-600"
                    />
                  </div>
                </div>

                {/* Tabla de Productos Extraídos */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                        <th className="py-2.5 px-2">Producto</th>
                        <th className="py-2.5 px-2">Categoría</th>
                        <th className="py-2.5 px-2 text-center">Cant.</th>
                        <th className="py-2.5 px-2 text-right">Precio U.</th>
                        <th className="py-2.5 px-2 text-right">Total</th>
                        <th className="py-2.5 px-2 text-center">Vida Útil</th>
                        <th className="py-2.5 px-2 text-right">Calorías U.</th>
                        <th className="py-2.5 px-2 text-center">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {extractedData.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="py-2.5 px-2">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => {
                                const newItems = [...extractedData.items];
                                newItems[idx].name = e.target.value;
                                setExtractedData({ ...extractedData, items: newItems });
                              }}
                              className="w-full bg-transparent font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-b border-emerald-500"
                            />
                          </td>
                          <td className="py-2.5 px-2">
                            <select
                              value={item.category}
                              onChange={(e) => {
                                const newItems = [...extractedData.items];
                                newItems[idx].category = e.target.value;
                                setExtractedData({ ...extractedData, items: newItems });
                              }}
                              className="bg-transparent text-slate-600 dark:text-slate-300 font-medium focus:outline-none"
                            >
                              {CATEGORIES.filter((c) => c !== 'Todas').map((c) => (
                                <option key={c} value={c} className="dark:bg-slate-900">
                                  {c}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <input
                              type="number"
                              step="any"
                              value={item.quantity}
                              onChange={(e) => {
                                const newItems = [...extractedData.items];
                                const raw = String(e.target.value).replace(',', '.');
                                newItems[idx].quantity = parseFloat(raw) || 0;
                                newItems[idx].total_price = newItems[idx].quantity * newItems[idx].unit_price;
                                setExtractedData({ ...extractedData, items: newItems });
                              }}
                              className="w-12 text-center bg-transparent font-bold text-slate-800 dark:text-slate-200"
                            />
                          </td>
                          <td className="py-2.5 px-2 text-right">
                            <input
                              type="number"
                              step="any"
                              value={item.unit_price}
                              onChange={(e) => {
                                const newItems = [...extractedData.items];
                                const raw = String(e.target.value).replace(',', '.');
                                newItems[idx].unit_price = parseFloat(raw) || 0;
                                newItems[idx].total_price = newItems[idx].quantity * newItems[idx].unit_price;
                                setExtractedData({ ...extractedData, items: newItems });
                              }}
                              className="w-20 text-right bg-transparent text-slate-700 dark:text-slate-300"
                            />
                          </td>
                          <td className="py-2.5 px-2 text-right font-bold text-emerald-600">
                            ${Number(item.total_price || item.unit_price * item.quantity).toLocaleString()}
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <span className="text-[11px] text-slate-500">{item.shelf_life_days}d</span>
                          </td>
                          <td className="py-2.5 px-2 text-right text-amber-600 font-bold">
                            {item.calories_per_unit} kcal
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <button
                              onClick={() => {
                                const newItems = extractedData.items.filter((_, i) => i !== idx);
                                setExtractedData({ ...extractedData, items: newItems });
                              }}
                              className="text-slate-400 hover:text-rose-500 p-1 rounded"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 3: ENTROPÍA & DESPERDICIO (TERMODINÁMICA DE LA DESPENSA)           */}
        {/* ========================================================================= */}
        {activeTab === 'entropy' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                      Termodinámica de la Despensa
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    Índice de Entropía & Eficiencia de Alimentos
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                    La entropía cuantifica el desorden, el estancamiento y la degradación irreversible de los alimentos
                    en tu hogar. Un valor bajo (0-30%) indica un flujo óptimo, alimentos frescos y cero desperdicio.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 min-w-[200px]">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-2xl font-black text-blue-600 dark:text-blue-400">
                    {entropyMetrics.entropy_score}%
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold">Estado Global</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase">
                      Frescura {entropyMetrics.freshness_level}
                    </p>
                  </div>
                </div>
              </div>

              {/* Barra termómetro de Entropía */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-emerald-600 dark:text-emerald-400">0% Óptimo (Frescura Total)</span>
                  <span className="text-amber-500">50% Moderado</span>
                  <span className="text-rose-500">100% Alta Entropía (Riesgo Vencimiento)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full transition-all duration-500 ${
                      entropyMetrics.entropy_score < 30
                        ? 'bg-emerald-500'
                        : entropyMetrics.entropy_score < 60
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${entropyMetrics.entropy_score}%` }}
                  />
                </div>
              </div>

              {/* Diagnósticos y Consejos Inteligentes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="p-5 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-500/20 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Alimentos con Alta Entropía (Consumir Hoy)</span>
                  </div>
                  {entropyMetrics.risk_items_count === 0 && entropyMetrics.expired_items_count === 0 ? (
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      No tienes alimentos en riesgo crítico de vencerse. ¡Excelente rotación!
                    </p>
                  ) : (
                    <div className="space-y-1 pt-1 text-xs text-slate-700 dark:text-slate-300">
                      {entropyMetrics.recommendations.map((rec, i) => (
                        <p key={i} className="leading-relaxed">
                          {rec}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Métricas de Rotación & Cero Desperdicio</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tasa de Rotación Histórica:</span>
                      <strong className="font-bold">{entropyMetrics.turnover_rate_pct}%</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Ítems Vencidos / Descartados:</span>
                      <strong className="font-bold text-rose-500">{entropyMetrics.expired_items_count}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Ítems en Riesgo de Descomposición:</span>
                      <strong className="font-bold text-amber-500">{entropyMetrics.risk_items_count}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Velocidad de Consumo (En cuánto tiempo se agotan) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Velocidad & Tiempo de Consumo por Alimento
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Promedio de días que tarda tu hogar en consumir cada producto antes de que se agote.
                </p>
              </div>

              {consumptionVelocities.length === 0 ? (
                <p className="text-xs text-slate-400 py-4">
                  Registra consumos en la despensa para calcular tus tiempos de duración promedio.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {consumptionVelocities.map((v) => (
                    <div
                      key={v.product_name}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 space-y-2 text-xs"
                    >
                      <div className="flex justify-between items-start">
                        <strong className="font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
                          {v.product_name}
                        </strong>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {v.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-black text-sm">
                        <Clock className="w-4 h-4" />
                        <span>Dura aprox. {v.average_days_to_consume} días</span>
                      </div>
                      {v.estimated_depletion_date && (
                        <p className="text-[11px] text-slate-500">
                          Agotamiento estimado: <strong className="text-slate-700 dark:text-slate-300">{v.estimated_depletion_date}</strong>
                        </p>
                      )}
                      {v.is_low_stock && (
                        <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/40 p-1 rounded border border-amber-500/20">
                          ⚠️ Reabastecimiento recomendado
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 4: CALORÍAS & NUTRICIÓN (RESERVAS ENERGÉTICAS DEL HOGAR)          */}
        {/* ========================================================================= */}
        {activeTab === 'nutrition' && (
          <NutritionAnalytics
            pantryItems={pantryItems}
            totalCaloriesAvailable={totalCaloriesAvailable}
            totalProteinG={totalProteinG}
            totalCarbsG={totalCarbsG}
            totalFatG={totalFatG}
            onSelectProduct={(item) => setSelectedPantryItemDetail(item)}
          />
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 5: RADAR DE PRECIOS (¿SUBE O BAJA EL PRODUCTO?)                    */}
        {/* ========================================================================= */}
        {activeTab === 'prices' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Radar de Precios: ¿Sube o Baja el Producto?
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Seguimiento de inflación personal y variaciones de costo en compras sucesivas a lo largo del tiempo.
              </p>
            </div>

            {priceTrends.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-3xl mx-auto mb-4">
                  📊
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  Sin suficientes registros para comparar precios
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                  A medida que escanees facturas de compras en diferentes fechas, el radar calculará automáticamente
                  si los productos subieron o bajaron de costo.
                </p>
                <button
                  onClick={() => setActiveTab('scanner')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                >
                  Escanear Factura para Comenzar
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {priceTrends.map((trend) => {
                  const isUp = trend.trend === 'up';
                  const isDown = trend.trend === 'down';

                  return (
                    <div
                      key={trend.product_name}
                      onClick={() => setSelectedPriceProduct(trend)}
                      className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 rounded-3xl space-y-3 shadow-sm hover:shadow-md cursor-pointer transition group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                            {trend.category}
                          </span>

                          {trend.price_change_pct !== undefined ? (
                            <span
                              className={`flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-full ${
                                isUp
                                  ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                                  : isDown
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                              }`}
                            >
                              {isUp ? (
                                <TrendingUp className="w-3 h-3" />
                              ) : isDown ? (
                                <TrendingDown className="w-3 h-3" />
                              ) : (
                                <Minus className="w-3 h-3" />
                              )}
                              <span>
                                {isUp ? '+' : ''}
                                {trend.price_change_pct}% {isUp ? 'Subió' : isDown ? 'Bajó' : 'Estable'}
                              </span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-semibold">1 compra registrada</span>
                          )}
                        </div>

                        <h4 className="text-base font-bold text-slate-900 dark:text-white leading-tight group-hover:text-emerald-600 transition">
                          {trend.product_name}
                        </h4>

                        <div className="pt-2 flex items-baseline justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 font-semibold">Precio Actual</span>
                            <p className="text-lg font-black text-slate-900 dark:text-white">
                              ${trend.current_price.toLocaleString()}
                            </p>
                          </div>
                          {trend.previous_price && (
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 font-semibold">Compra Anterior</span>
                              <p className="text-xs font-semibold text-slate-500 line-through">
                                ${trend.previous_price.toLocaleString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Historial de compras registradas y llamada a la acción */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-[10px] uppercase tracking-wider">Historial:</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[10.5px] group-hover:underline flex items-center gap-0.5">
                            <span>Ver gráfica</span>
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                          </span>
                        </div>
                        {trend.history.slice(-3).map((h, i) => (
                          <div key={i} className="flex justify-between">
                            <span>{h.date}</span>
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                              ${h.price.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 6: HISTORIAL DE FACTURAS REGISTRADAS                             */}
        {/* ========================================================================= */}
        {activeTab === 'receipts' && (
          <div className="space-y-6">
            {selectedReceipt && editingReceiptData ? (
              <div className="space-y-6 animate-in fade-in">
                {/* 1. BARRA SUPERIOR DE ACCIONES DE FACTURA */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={closeReceiptDetails}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Volver a Facturas</span>
                    </button>
                    {receiptSavedNotice && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/30 animate-in fade-in">
                        <Check className="w-3.5 h-3.5" />
                        <span>Factura y productos guardados</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAddProductToReceipt}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Agregar Producto</span>
                    </button>
                    <button
                      onClick={handleSaveReceiptChanges}
                      disabled={isSavingReceiptChanges}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSavingReceiptChanges ? 'Guardando...' : 'Guardar Cambios'}</span>
                    </button>
                  </div>
                </div>

                {/* 2. DATOS DE CABECERA DE LA FACTURA */}
                <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        Factura: {editingReceiptData.store_name || 'Sin especificar'}
                      </h3>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {receiptEditItems.length} {receiptEditItems.length === 1 ? 'producto' : 'productos'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                        Supermercado / Tienda
                      </label>
                      <input
                        type="text"
                        value={editingReceiptData.store_name}
                        onChange={(e) =>
                          setEditingReceiptData({ ...editingReceiptData, store_name: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                        placeholder="Ej: Éxito, D1, Jumbo..."
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                        Fecha de Compra
                      </label>
                      <input
                        type="date"
                        value={editingReceiptData.purchase_date}
                        onChange={(e) =>
                          setEditingReceiptData({ ...editingReceiptData, purchase_date: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                        Notas / Medio de Pago
                      </label>
                      <input
                        type="text"
                        value={editingReceiptData.notes || ''}
                        onChange={(e) =>
                          setEditingReceiptData({ ...editingReceiptData, notes: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                        placeholder="Ej: Efectivo, Tarjeta, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                        Total Registrado Factura ($)
                      </label>
                      <input
                        type="number"
                        value={editingReceiptData.total_amount}
                        onChange={(e) =>
                          setEditingReceiptData({
                            ...editingReceiptData,
                            total_amount: Number(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-black text-right focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. TABLA EDITABLE DE PRODUCTOS */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-1 gap-1">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Productos de la Factura
                      </h4>
                      <p className="text-xs text-slate-400">
                        Modifica directamente en la tabla los nombres, categorías, cantidades, precios unitarios y estados.
                      </p>
                    </div>
                    <button
                      onClick={handleAddProductToReceipt}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-500 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Añadir fila</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                          <th className="py-3 px-3 text-center w-10">#</th>
                          <th className="py-3 px-3 min-w-[200px]">Producto</th>
                          <th className="py-3 px-3 min-w-[150px]">Categoría</th>
                          <th className="py-3 px-3 w-20">Cant.</th>
                          <th className="py-3 px-3 w-24">Unidad</th>
                          <th className="py-3 px-3 w-28 text-right">Precio Unit. ($)</th>
                          <th className="py-3 px-3 w-28 text-right">Subtotal ($)</th>
                          <th className="py-3 px-3 w-32">Estado</th>
                          <th className="py-3 px-3 text-center w-12">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {receiptEditItems.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="py-8 text-center text-slate-400 text-xs">
                              No hay productos registrados en esta factura.{' '}
                              <button
                                onClick={handleAddProductToReceipt}
                                className="text-emerald-600 font-bold hover:underline"
                              >
                                Haz clic aquí para agregar uno
                              </button>
                            </td>
                          </tr>
                        ) : (
                          receiptEditItems.map((item, idx) => (
                            <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                              <td className="py-2.5 px-3 text-center text-slate-400 text-[11px] font-mono">
                                {idx + 1}
                              </td>
                              <td className="py-2.5 px-3">
                                <input
                                  type="text"
                                  value={item.name}
                                  onChange={(e) => handleUpdateReceiptItem(idx, 'name', e.target.value)}
                                  placeholder="Nombre del producto"
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                />
                              </td>
                              <td className="py-2.5 px-3">
                                <select
                                  value={item.category}
                                  onChange={(e) => handleUpdateReceiptItem(idx, 'category', e.target.value)}
                                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                >
                                  {CATEGORIES.filter((c) => c !== 'Todas').map((cat) => (
                                    <option key={cat} value={cat}>
                                      {cat}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="py-2.5 px-3">
                                <input
                                  type="number"
                                  min="0"
                                  step="any"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleUpdateReceiptItem(idx, 'quantity', Number(e.target.value) || 0)
                                  }
                                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold text-center focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                />
                              </td>
                              <td className="py-2.5 px-3">
                                <input
                                  type="text"
                                  value={item.unit}
                                  onChange={(e) => handleUpdateReceiptItem(idx, 'unit', e.target.value)}
                                  placeholder="un, kg..."
                                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium text-center focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                />
                              </td>
                              <td className="py-2.5 px-3">
                                <input
                                  type="number"
                                  min="0"
                                  step="any"
                                  value={item.unit_price}
                                  onChange={(e) =>
                                    handleUpdateReceiptItem(idx, 'unit_price', Number(e.target.value) || 0)
                                  }
                                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium text-right focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                />
                              </td>
                              <td className="py-2.5 px-3">
                                <input
                                  type="number"
                                  min="0"
                                  step="any"
                                  value={item.total_price}
                                  onChange={(e) =>
                                    handleUpdateReceiptItem(idx, 'total_price', Number(e.target.value) || 0)
                                  }
                                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold text-right focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                />
                              </td>
                              <td className="py-2.5 px-3">
                                <select
                                  value={item.status}
                                  onChange={(e) =>
                                    handleUpdateReceiptItem(idx, 'status', e.target.value as PantryItemStatus)
                                  }
                                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-semibold focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                >
                                  <option value="disponible">En Stock</option>
                                  <option value="consumiendo">Consumiendo</option>
                                  <option value="agotado">Agotado</option>
                                  <option value="vencido">Vencido</option>
                                </select>
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <button
                                  onClick={() => handleRemoveProductFromReceipt(idx)}
                                  title="Eliminar producto de factura"
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pie de tabla con totales y botón sincronizar */}
                  <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 gap-3">
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-slate-500">
                        Total productos en tabla:{' '}
                        <strong className="text-slate-900 dark:text-white">{receiptEditItems.length}</strong>
                      </span>
                      <span className="text-slate-500">
                        Suma productos:{' '}
                        <strong className="text-emerald-600 dark:text-emerald-400 font-black">
                          $
                          {receiptEditItems
                            .reduce(
                              (acc, it) =>
                                acc +
                                (Number(it.total_price) || (Number(it.unit_price) * Number(it.quantity)) || 0),
                              0
                            )
                            .toLocaleString()}
                        </strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const sum = receiptEditItems.reduce(
                            (acc, it) =>
                              acc +
                              (Number(it.total_price) || (Number(it.unit_price) * Number(it.quantity)) || 0),
                            0
                          );
                          setEditingReceiptData({
                            ...editingReceiptData,
                            total_amount: sum,
                          });
                        }}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        Sincronizar Total
                      </button>
                      <button
                        onClick={handleSaveReceiptChanges}
                        disabled={isSavingReceiptChanges}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isSavingReceiptChanges ? 'Guardando...' : 'Guardar Factura'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* LISTADO DE FACTURAS REGISTRADAS */
              <>
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Historial de Facturas de Compra</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Haz clic sobre cualquier factura para entrar a verla y modificar sus productos.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('scanner')}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Nueva Factura</span>
                  </button>
                </div>

                {receipts.length === 0 ? (
                  <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                    <p className="text-xs text-slate-400">No hay facturas registradas aún.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {receipts.map((rc) => (
                      <div
                        key={rc.id}
                        onClick={() => openReceiptDetails(rc)}
                        className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 rounded-3xl space-y-3 shadow-sm cursor-pointer transition group"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                              Factura de Mercado
                            </span>
                            <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition">
                              {rc.store_name}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{rc.purchase_date}</span>
                              <span>•</span>
                              <span>{rc.items_count} productos</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <span className="text-base font-black text-slate-900 dark:text-white">
                                ${Number(rc.total_amount).toLocaleString()}
                              </span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition" />
                          </div>
                        </div>

                        {rc.notes && <p className="text-xs text-slate-500 italic">{rc.notes}</p>}

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px] group-hover:underline flex items-center gap-1">
                            <span>Modificar productos de esta factura</span>
                            <span>➔</span>
                          </span>
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (confirm('¿Eliminar esta factura y sus ítems asociados?')) {
                                const newRcs = receipts.filter((r) => r.id !== rc.id);
                                const newItems = pantryItems.filter((i) => i.receipt_id !== rc.id);
                                setReceipts(newRcs);
                                setPantryItems(newItems);
                                persistLocally(newItems, newRcs);
                                try {
                                  await supabase.from('grocery_receipts').delete().eq('id', rc.id);
                                } catch (err) {
                                  console.warn('Error borrando en Supabase');
                                }
                              }
                            }}
                            className="text-slate-400 hover:text-rose-500 font-semibold transition flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL: CONFIGURACIÓN GEMINI API KEY                                       */}
      {/* ========================================================================= */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-emerald-600 font-bold">
                <Key className="w-5 h-5" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Gemini Vision API Key</h3>
              </div>
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              El sistema utiliza por defecto los <strong>modelos gratuitos de Google AI Studio</strong> con menor consumo de tokens y cuota amplia (hasta 1,500 peticiones diarias gratis).
            </p>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-emerald-800 dark:text-emerald-300">
                <span className="font-bold">Modelo activo sin costo:</span> Gemini Flash-Lite (Google AI). Consumo mínimo de tokens, respuesta instantánea y soporte multimodal para lectura de facturas.
              </div>
            </div>

            {apiKeySavedNotice && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>¡API Key guardada con éxito!</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-400">Tu API Key (Google AI Studio)</label>
              <input
                type="password"
                placeholder="AIzaSy... o AQ.Ab8..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
              />
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>Modelos en cascada:</span>
              <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                {FREE_TIER_MODELS.join(' → ')}
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  localStorage.setItem('gemini_api_key', apiKeyInput.trim());
                  setApiKeySavedNotice(true);
                  setTimeout(() => {
                    setApiKeySavedNotice(false);
                    setShowApiKeyModal(false);
                  }, 1200);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
              >
                Guardar Clave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NUEVO PRODUCTO MANUAL                                              */}
      {/* ========================================================================= */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Añadir Producto Manual a Despensa</h3>
              <button
                onClick={() => setShowManualModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManualItem} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Nombre del Alimento / Producto</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Manzanas Verdes, Avena, Leche Deslactosada"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Categoría</label>
                  <select
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  >
                    {CATEGORIES.filter((c) => c !== 'Todas').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Unidad</label>
                  <input
                    type="text"
                    value={manualUnit}
                    onChange={(e) => setManualUnit(e.target.value)}
                    placeholder="unidad, kg, litro, paquete"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Cantidad</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={manualQty}
                    onChange={(e) => setManualQty(e.target.value.replace(/[^0-9.,]/g, ''))}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Precio Unitario ($)</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="ej. 4500"
                    value={manualPrice}
                    onChange={(e) => setManualPrice(e.target.value.replace(/[^0-9.,]/g, ''))}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Vida Útil (Días)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={manualShelfLife}
                    onChange={(e) => setManualShelfLife(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Calorías Est. (kcal)</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={manualCalories}
                    onChange={(e) => setManualCalories(e.target.value.replace(/[^0-9.,]/g, ''))}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-amber-500 font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
                >
                  Guardar en Despensa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CONFIRMACIÓN BORRAR PRODUCTO                                       */}
      {/* ========================================================================= */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-500 font-bold">
              <Trash2 className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">¿Eliminar producto?</h3>
            </div>
            <p className="text-xs text-slate-400">
              ¿Deseas eliminar <strong className="text-slate-800 dark:text-slate-200">{itemToDelete.name}</strong> de
              tu despensa?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteItem}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL FLOTANTE: HISTORIAL DE COMPRA, EVOLUCIÓN DE PRECIO Y GRÁFICA LINEAL */}
      {/* ========================================================================= */}
      {selectedPriceProduct && (
        <PriceEvolutionModal
          productTrend={selectedPriceProduct}
          pantryItems={pantryItems}
          receipts={receipts}
          onClose={() => setSelectedPriceProduct(null)}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL FLOTANTE: NUTRICIÓN, CONSUMO, LOS 4 PILARES DEL ISA & PRECIO/GRAMO  */}
      {/* ========================================================================= */}
      {selectedPantryItemDetail && (
        <ProductDetailModal
          item={selectedPantryItemDetail}
          initialEditMode={openModalInEditMode}
          onClose={() => {
            setSelectedPantryItemDetail(null);
            setOpenModalInEditMode(false);
          }}
          onConsume={handleConsumeItem}
          onUpdateItem={handleUpdateIndividualItem}
        />
      )}
    </div>
  );
};
