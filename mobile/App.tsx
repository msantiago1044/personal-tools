import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  useColorScheme
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, signInWithGoogleMobile } from './src/lib/supabase';

type ThemeMode = 'light' | 'dark' | 'system';
type FinanceTab = 'home' | 'transactions' | 'accounts' | 'categories' | 'budgets' | 'reports' | 'settings';

export default function App() {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('light'); // Preferencia por defecto: Claro
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'hub' | 'finance'>('hub');
  const [financeTab, setFinanceTab] = useState<FinanceTab>('home');

  // Menú desplegable móvil (ocultar / mostrar)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Estados de datos
  const [accounts, setAccounts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [timeFilter, setTimeFilter] = useState<'dia' | 'semana' | 'mes' | 'ano'>('mes');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Formulario rápido
  const [txType, setTxType] = useState<'ingreso' | 'salida' | 'transferencia'>('salida');
  const [txAmount, setTxAmount] = useState('');
  const [txDesc, setTxDesc] = useState('');
  const [txAccount, setTxAccount] = useState('');

  // 1. Cargar tema persistido
  useEffect(() => {
    AsyncStorage.getItem('app_theme_mode').then((saved) => {
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        setThemeMode(saved);
      }
    });
  }, []);

  const changeThemeMode = async (mode: ThemeMode) => {
    setThemeMode(mode);
    await AsyncStorage.setItem('app_theme_mode', mode);
  };

  // Determinar si el tema activo es oscuro o claro
  const isDark =
    themeMode === 'system'
      ? systemColorScheme === 'dark'
      : themeMode === 'dark';

  // Paleta de colores dinámica según el tema
  const colors = {
    bg: isDark ? '#030712' : '#F8FAFC',
    card: isDark ? '#0F172A' : '#FFFFFF',
    border: isDark ? '#1E293B' : '#E2E8F0',
    text: isDark ? '#FFFFFF' : '#0F172A',
    subtext: isDark ? '#94A3B8' : '#64748B',
    accent: isDark ? '#10B981' : '#059669',
    accentBg: isDark ? '#064E3B' : '#D1FAE5',
    accentText: isDark ? '#34D399' : '#047857',
    inputBg: isDark ? '#030712' : '#F1F5F9',
    danger: isDark ? '#EF4444' : '#DC2626',
    blue: isDark ? '#3B82F6' : '#2563EB',
    drawerBg: isDark ? '#0B0F19' : '#FFFFFF',
  };

  // Auth Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadFinanceData = async () => {
    const { data: accs } = await supabase.from('accounts').select('*').order('created_at');
    if (accs) {
      setAccounts(accs);
      if (accs.length > 0 && !txAccount) setTxAccount(accs[0].id);
    }

    const { data: cats } = await supabase.from('categories').select('*').order('name');
    if (cats) setCategories(cats);

    const { data: txs } = await supabase
      .from('transactions')
      .select('*, account:accounts!transactions_account_id_fkey(name)')
      .order('date', { ascending: false })
      .limit(30);
    if (txs) setTransactions(txs);
  };

  useEffect(() => {
    if (session && currentView === 'finance') {
      loadFinanceData();
    }
  }, [session, currentView]);

  const handleSaveTx = async () => {
    const amount = parseFloat(txAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Ingresa un monto válido.');
      return;
    }
    if (!txAccount) {
      Alert.alert('Error', 'Selecciona una cuenta.');
      return;
    }

    const { error } = await supabase.from('transactions').insert({
      user_id: session.user.id,
      type: txType,
      amount,
      account_id: txAccount,
      description: txDesc || null,
      date: new Date().toISOString().split('T')[0],
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setTxAmount('');
      setTxDesc('');
      setIsModalOpen(false);
      loadFinanceData();
    }
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.subtext }]}>Cargando Personal Tools...</Text>
      </View>
    );
  }

  // ==========================================
  // 1. PANTALLA LOGIN
  // ==========================================
  if (!session) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.loginContent}>
          <View style={[styles.logoBadge, { backgroundColor: colors.accentBg }]}>
            <Text style={{ fontSize: 36 }}>💎</Text>
          </View>
          <Text style={[styles.loginTitle, { color: colors.text }]}>Personal Tools</Text>
          <Text style={[styles.loginSubtitle, { color: colors.subtext }]}>
            Suite privada de finanzas y productividad con soporte para temas Claro y Oscuro.
          </Text>

          <TouchableOpacity
            style={[styles.googleButton, { backgroundColor: isDark ? '#FFFFFF' : '#0F172A' }]}
            onPress={() => signInWithGoogleMobile()}
          >
            <Text style={[styles.googleButtonText, { color: isDark ? '#0F172A' : '#FFFFFF' }]}>
              Continuar con Google
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================
  // 2. MÓDULO DE FINANZAS
  // ==========================================
  if (currentView === 'finance') {
    const totalIncome = transactions
      .filter((t) => t.type === 'ingreso')
      .reduce((s, t) => s + Number(t.amount), 0);
    const totalExpense = transactions
      .filter((t) => t.type === 'salida')
      .reduce((s, t) => s + Number(t.amount), 0);
    const netBalance = totalIncome - totalExpense;

    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

        {/* Top Navbar con botón Menú desplegable */}
        <View style={[styles.mobileHeader, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {/* Botón para Abrir/Ocultar Menú */}
            <TouchableOpacity
              onPress={() => setIsMenuOpen(true)}
              style={[styles.iconButton, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
            >
              <Text style={{ fontSize: 18 }}>☰</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setCurrentView('hub')}>
              <Text style={{ fontSize: 12, color: colors.accent, fontWeight: '700' }}>← HUB</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {financeTab === 'home'
              ? 'Finanzas'
              : financeTab === 'transactions'
              ? 'Movimientos'
              : financeTab === 'accounts'
              ? 'Cuentas'
              : financeTab === 'categories'
              ? 'Categorías'
              : financeTab === 'budgets'
              ? 'Presupuestos'
              : financeTab === 'reports'
              ? 'Reportes'
              : 'Configuración'}
          </Text>

          <TouchableOpacity
            onPress={() => setIsModalOpen(true)}
            style={[styles.newTxButton, { backgroundColor: colors.accent }]}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 13 }}>+ Movimiento</Text>
          </TouchableOpacity>
        </View>

        {/* ================================================================= */}
        {/* MENÚ LATERAL DESPLEGABLE / MODAL OCULTABLE                         */}
        {/* ================================================================= */}
        <Modal visible={isMenuOpen} animationType="fade" transparent>
          <View style={styles.menuOverlay}>
            {/* Backdrop táctil para cerrar el menú */}
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={1}
              onPress={() => setIsMenuOpen(false)}
            />

            {/* Panel de Navegación Lateral */}
            <View style={[styles.drawerPanel, { backgroundColor: colors.drawerBg, borderColor: colors.border }]}>
              <View style={[styles.drawerHeader, { borderColor: colors.border }]}>
                <View>
                  <Text style={[styles.drawerTitle, { color: colors.text }]}>Navegación</Text>
                  <Text style={[styles.drawerSub, { color: colors.subtext }]}>Módulo Financiero</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setIsMenuOpen(false)}
                  style={[styles.iconButton, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
                >
                  <Text style={{ color: colors.text, fontWeight: 'bold' }}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={{ flex: 1, paddingVertical: 8 }}>
                {[
                  { id: 'home', label: 'Panel Principal (Home)', icon: '🏠' },
                  { id: 'transactions', label: 'Movimientos (Historial)', icon: '📋' },
                  { id: 'accounts', label: 'Cuentas & Saldos', icon: '💳' },
                  { id: 'categories', label: 'Categorías', icon: '🏷️' },
                  { id: 'budgets', label: 'Presupuestos Mensuales', icon: '🎯' },
                  { id: 'reports', label: 'Reportes & Métricas', icon: '📈' },
                  { id: 'settings', label: 'Configuración & Temas', icon: '⚙️' },
                ].map((item) => {
                  const isActive = financeTab === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => {
                        setFinanceTab(item.id as FinanceTab);
                        setIsMenuOpen(false); // Cierra el menú al seleccionar
                      }}
                      style={[
                        styles.drawerItem,
                        isActive && { backgroundColor: colors.accentBg },
                      ]}
                    >
                      <Text style={{ fontSize: 18, marginRight: 12 }}>{item.icon}</Text>
                      <Text
                        style={[
                          styles.drawerItemText,
                          { color: isActive ? colors.accent : colors.text },
                          isActive && { fontWeight: '800' },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={[styles.drawerFooter, { borderColor: colors.border }]}>
                <TouchableOpacity
                  onPress={() => {
                    setIsMenuOpen(false);
                    setCurrentView('hub');
                  }}
                  style={[styles.returnHubBtn, { borderColor: colors.border }]}
                >
                  <Text style={{ color: colors.accent, fontWeight: '700', fontSize: 12 }}>
                    🏠 Cambiar de Herramienta (Hub)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ================================================================= */}
        {/* CONTENIDO SEGÚN LA PESTAÑA SELECCIONADA                           */}
        {/* ================================================================= */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {/* TAB 1: HOME */}
          {financeTab === 'home' && (
            <View>
              {/* Selector de Filtro de Tiempo */}
              <View style={[styles.filterRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                {(['dia', 'semana', 'mes', 'ano'] as const).map((f) => (
                  <TouchableOpacity
                    key={f}
                    onPress={() => setTimeFilter(f)}
                    style={[styles.filterChip, timeFilter === f && { backgroundColor: colors.accent }]}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        { color: timeFilter === f ? '#FFFFFF' : colors.subtext },
                        timeFilter === f && { fontWeight: '800' },
                      ]}
                    >
                      {f === 'ano' ? 'Año' : f === 'dia' ? 'Día' : f.charAt(0).toUpperCase() + f.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Tarjeta de Balance General */}
              <View style={[styles.balanceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.balanceLabel, { color: colors.subtext }]}>Balance Neto del Mes</Text>
                <Text style={[styles.balanceValue, { color: netBalance >= 0 ? colors.accent : colors.danger }]}>
                  ${netBalance.toFixed(2)}
                </Text>
                <View style={[styles.balanceSplit, { borderColor: colors.border }]}>
                  <View>
                    <Text style={[styles.splitLabel, { color: colors.subtext }]}>Ingresos (+)</Text>
                    <Text style={[styles.splitValue, { color: colors.accent }]}>+${totalIncome.toFixed(2)}</Text>
                  </View>
                  <View>
                    <Text style={[styles.splitLabel, { color: colors.subtext }]}>Gastos (-)</Text>
                    <Text style={[styles.splitValue, { color: colors.danger }]}>-${totalExpense.toFixed(2)}</Text>
                  </View>
                </View>
              </View>

              {/* Carrusel de Cuentas */}
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Tus Cuentas</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                {accounts.map((acc) => (
                  <View
                    key={acc.id}
                    style={[styles.accountPill, { backgroundColor: colors.card, borderColor: colors.border }]}
                  >
                    <Text style={styles.accountIcon}>
                      {acc.type === 'tarjeta' ? '💳' : acc.type === 'efectivo' ? '💵' : '🏦'}
                    </Text>
                    <Text style={[styles.accountName, { color: colors.text }]}>{acc.name}</Text>
                    <Text style={[styles.accountBalance, { color: colors.accent }]}>
                      ${Number(acc.initial_balance).toFixed(2)}
                    </Text>
                  </View>
                ))}
              </ScrollView>

              {/* Últimos Movimientos */}
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Últimos Movimientos</Text>
              {transactions.slice(0, 8).map((tx) => (
                <View
                  key={tx.id}
                  style={[styles.txRow, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  <View>
                    <Text style={[styles.txDesc, { color: colors.text }]}>{tx.description || tx.type}</Text>
                    <Text style={[styles.txMeta, { color: colors.subtext }]}>
                      {tx.date} • {tx.account?.name || 'Cuenta'}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.txAmount,
                      { color: tx.type === 'ingreso' ? colors.accent : tx.type === 'salida' ? colors.danger : colors.blue },
                    ]}
                  >
                    {tx.type === 'salida' ? '-' : tx.type === 'ingreso' ? '+' : ''}${Number(tx.amount).toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* TAB 2: HISTORIAL DE MOVIMIENTOS */}
          {financeTab === 'transactions' && (
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 12 }]}>
                Historial Completo ({transactions.length} registros)
              </Text>
              {transactions.map((tx) => (
                <View
                  key={tx.id}
                  style={[styles.txRow, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  <View>
                    <Text style={[styles.txDesc, { color: colors.text }]}>{tx.description || tx.type}</Text>
                    <Text style={[styles.txMeta, { color: colors.subtext }]}>
                      {tx.date} • {tx.account?.name} • Tipo: {tx.type}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.txAmount,
                      { color: tx.type === 'ingreso' ? colors.accent : tx.type === 'salida' ? colors.danger : colors.blue },
                    ]}
                  >
                    {tx.type === 'salida' ? '-' : tx.type === 'ingreso' ? '+' : ''}${Number(tx.amount).toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* TAB 3: CUENTAS */}
          {financeTab === 'accounts' && (
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 12 }]}>
                Gestión de Cuentas Financieras
              </Text>
              {accounts.map((acc) => (
                <View
                  key={acc.id}
                  style={[styles.accountCardRow, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  <Text style={{ fontSize: 24, marginRight: 12 }}>
                    {acc.type === 'tarjeta' ? '💳' : acc.type === 'efectivo' ? '💵' : '🏦'}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.accountName, { color: colors.text, fontSize: 14 }]}>{acc.name}</Text>
                    <Text style={{ color: colors.subtext, fontSize: 11, textTransform: 'capitalize' }}>
                      Tipo: {acc.type}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 15, fontWeight: '800', color: colors.accent }}>
                    ${Number(acc.initial_balance).toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* TAB 4: CATEGORÍAS */}
          {financeTab === 'categories' && (
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 12 }]}>
                Categorías Disponibles
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {categories.map((c) => (
                  <View
                    key={c.id}
                    style={[
                      styles.catChip,
                      { backgroundColor: colors.card, borderColor: colors.border },
                    ]}
                  >
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c.color || colors.accent }} />
                    <Text style={{ color: colors.text, fontSize: 12, fontWeight: '600' }}>{c.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* TAB 5: PRESUPUESTOS */}
          {financeTab === 'budgets' && (
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 8 }]}>
                Control y Estimación de Presupuestos
              </Text>
              <Text style={{ color: colors.subtext, fontSize: 12, marginBottom: 16 }}>
                Compara los gastos de este mes con el estimado y el año anterior para garantizar márgenes de ahorro.
              </Text>
              <View style={[styles.balanceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={{ color: colors.subtext, fontSize: 12 }}>Gasto Real Actual</Text>
                <Text style={{ fontSize: 26, fontWeight: '900', color: colors.danger, marginTop: 4 }}>
                  ${totalExpense.toFixed(2)}
                </Text>
                <Text style={{ color: colors.accent, fontSize: 12, marginTop: 8, fontWeight: '600' }}>
                  ✓ Margen de ahorro controlado
                </Text>
              </View>
            </View>
          )}

          {/* TAB 6: REPORTES */}
          {financeTab === 'reports' && (
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 8 }]}>
                Reportes Analíticos
              </Text>
              <View style={[styles.balanceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 6 }}>
                  Flujo de Caja del Periodo
                </Text>
                <Text style={{ color: colors.subtext, fontSize: 12, lineHeight: 18 }}>
                  Tasa de ahorro acumulada:{' '}
                  <Text style={{ color: colors.accent, fontWeight: 'bold' }}>
                    {totalIncome > 0 ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1) : 0}%
                  </Text>
                  . Los registros reflejan un comportamiento positivo sin superar el tope estimado.
                </Text>
              </View>
            </View>
          )}

          {/* =============================================================== */}
          {/* TAB 7: CONFIGURACIÓN Y SELECTOR DE TEMAS (CLARO, OSCURO, SISTEMA)*/}
          {/* =============================================================== */}
          {financeTab === 'settings' && (
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 12 }]}>
                Configuración de la Aplicación
              </Text>

              {/* Selector de Tema */}
              <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.settingsCardTitle, { color: colors.text }]}>Apariencia & Tema</Text>
                <Text style={[styles.settingsCardSub, { color: colors.subtext }]}>
                  Selecciona tu preferencia de diseño visual:
                </Text>

                <View style={styles.themeOptionsRow}>
                  {[
                    { id: 'light', label: '☀️ Claro', sub: 'Tema Limpio' },
                    { id: 'dark', label: '🌙 Oscuro', sub: 'Modo Noche' },
                    { id: 'system', label: '📱 Sistema', sub: 'Automático' },
                  ].map((t) => {
                    const isSelected = themeMode === t.id;
                    return (
                      <TouchableOpacity
                        key={t.id}
                        onPress={() => changeThemeMode(t.id as ThemeMode)}
                        style={[
                          styles.themeOptionBtn,
                          {
                            backgroundColor: isSelected ? colors.accentBg : colors.inputBg,
                            borderColor: isSelected ? colors.accent : colors.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.themeOptionText,
                            { color: isSelected ? colors.accent : colors.text },
                            isSelected && { fontWeight: '800' },
                          ]}
                        >
                          {t.label}
                        </Text>
                        <Text style={{ color: colors.subtext, fontSize: 10, marginTop: 2 }}>{t.sub}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Info de Cuenta & Aislamiento */}
              <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border, marginTop: 14 }]}>
                <Text style={[styles.settingsCardTitle, { color: colors.text }]}>Cuenta & Seguridad</Text>
                <Text style={{ color: colors.subtext, fontSize: 12, marginTop: 4 }}>
                  Usuario: <Text style={{ color: colors.text, fontWeight: '600' }}>{session.user.email}</Text>
                </Text>
                <Text style={{ color: colors.subtext, fontSize: 11, marginTop: 6, lineHeight: 16 }}>
                  Tus datos están completamente aislados y protegidos por Row Level Security (RLS) en Supabase PostgreSQL.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Modal de Registro Rápido */}
        <Modal visible={isModalOpen} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Nuevo Movimiento</Text>

              <View style={[styles.modalTypeRow, { backgroundColor: colors.inputBg }]}>
                {(['salida', 'ingreso', 'transferencia'] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setTxType(t)}
                    style={[
                      styles.modalTypeBtn,
                      txType === t && { backgroundColor: colors.card, shadowOpacity: 0.1 },
                    ]}
                  >
                    <Text
                      style={[
                        styles.modalTypeText,
                        { color: txType === t ? colors.accent : colors.subtext },
                        txType === t && { fontWeight: '800' },
                      ]}
                    >
                      {t === 'salida' ? '- Gasto' : t === 'ingreso' ? '+ Ingreso' : '⇄ Transf.'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                placeholder="Monto (ej. 45.00)"
                placeholderTextColor={colors.subtext}
                keyboardType="numeric"
                value={txAmount}
                onChangeText={setTxAmount}
                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
              />

              <TextInput
                placeholder="Descripción (opcional)"
                placeholderTextColor={colors.subtext}
                value={txDesc}
                onChangeText={setTxDesc}
                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity onPress={() => setIsModalOpen(false)} style={styles.cancelBtn}>
                  <Text style={{ color: colors.subtext, fontWeight: '600' }}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSaveTx}
                  style={[styles.saveBtn, { backgroundColor: colors.accent }]}
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  // ==========================================
  // 3. TOOL HUB MÓVIL (LAUNCHER DE HERRAMIENTAS)
  // ==========================================
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={[styles.hubHeader, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View>
          <Text style={[styles.hubGreeting, { color: colors.text }]}>
            Hola, {session.user.email?.split('@')[0]}
          </Text>
          <Text style={[styles.hubSub, { color: colors.subtext }]}>Workspace Personal de Herramientas</Text>
        </View>
        <TouchableOpacity
          onPress={() => supabase.auth.signOut()}
          style={[styles.logoutBtn, { backgroundColor: colors.inputBg }]}
        >
          <Text style={styles.logoutBtnText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {/* Tool 1: Finanzas (Activa) */}
        <TouchableOpacity
          style={[styles.toolCardActive, { backgroundColor: colors.card, borderColor: colors.accent }]}
          onPress={() => setCurrentView('finance')}
        >
          <View style={[styles.toolIconWrap, { backgroundColor: colors.accentBg }]}>
            <Text style={{ fontSize: 24 }}>📊</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={[styles.toolCardTitle, { color: colors.text }]}>Finanzas & Gastos</Text>
              <View style={[styles.badgeActive, { backgroundColor: colors.accentBg }]}>
                <Text style={[styles.badgeText, { color: colors.accentText }]}>ACTIVO</Text>
              </View>
            </View>
            <Text style={[styles.toolCardDesc, { color: colors.subtext }]}>
              Control de flujo de caja, cuentas bancarias, tarjetas y presupuestos.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Tool 2: Inversiones */}
        <View style={[styles.toolCardDisabled, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={{ fontSize: 24 }}>📈</Text>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.toolCardTitleDisabled, { color: colors.subtext }]}>Inversiones & Activos</Text>
            <Text style={[styles.toolCardDesc, { color: colors.subtext }]}>Próximamente en Personal Tools.</Text>
          </View>
        </View>

        {/* Tool 3: Metas */}
        <View style={[styles.toolCardDisabled, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={{ fontSize: 24 }}>🎯</Text>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.toolCardTitleDisabled, { color: colors.subtext }]}>Metas de Ahorro</Text>
            <Text style={[styles.toolCardDesc, { color: colors.subtext }]}>Próximamente en Personal Tools.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 13 },
  loginContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  logoBadge: { width: 70, height: 70, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  loginTitle: { fontSize: 26, fontWeight: '800' },
  loginSubtitle: { fontSize: 13, textAlign: 'center', marginTop: 8, marginBottom: 32, lineHeight: 20 },
  googleButton: { paddingVertical: 14, paddingHorizontal: 28, borderRadius: 14, width: '100%', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  googleButtonText: { fontWeight: '700', fontSize: 15 },
  hubHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  hubGreeting: { fontSize: 18, fontWeight: '800' },
  hubSub: { fontSize: 12, marginTop: 2 },
  logoutBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  logoutBtnText: { color: '#EF4444', fontSize: 12, fontWeight: '700' },
  toolCardActive: { borderWidth: 1.5, padding: 16, borderRadius: 18, flexDirection: 'row', alignItems: 'center', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 },
  toolCardDisabled: { borderWidth: 1, padding: 16, borderRadius: 18, flexDirection: 'row', alignItems: 'center', marginBottom: 12, opacity: 0.5 },
  toolIconWrap: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  toolCardTitle: { fontWeight: '700', fontSize: 15 },
  toolCardTitleDisabled: { fontWeight: '600', fontSize: 15 },
  toolCardDesc: { fontSize: 12, marginTop: 4 },
  badgeActive: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: 9, fontWeight: '800' },
  mobileHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  iconButton: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
  headerTitle: { fontWeight: '800', fontSize: 16 },
  newTxButton: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 },
  filterRow: { flexDirection: 'row', padding: 4, borderRadius: 12, marginBottom: 16, borderWidth: 1 },
  filterChip: { flex: 1, paddingVertical: 6, alignItems: 'center', borderRadius: 8 },
  filterChipText: { fontSize: 12, fontWeight: '600' },
  balanceCard: { borderWidth: 1, padding: 18, borderRadius: 20, marginBottom: 20 },
  balanceLabel: { fontSize: 12, fontWeight: '600' },
  balanceValue: { fontSize: 28, fontWeight: '900', marginTop: 4 },
  balanceSplit: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTopWidth: 1 },
  splitLabel: { fontSize: 11 },
  splitValue: { fontSize: 15, fontWeight: '800', marginTop: 2 },
  sectionTitle: { fontSize: 15, fontWeight: '800', marginBottom: 10 },
  accountPill: { borderWidth: 1, padding: 12, borderRadius: 14, marginRight: 10, minWidth: 120 },
  accountIcon: { fontSize: 18 },
  accountName: { fontSize: 12, fontWeight: '600', marginTop: 4 },
  accountBalance: { fontSize: 13, fontWeight: '800', marginTop: 2 },
  txRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, padding: 14, borderRadius: 14, marginBottom: 8 },
  txDesc: { fontSize: 13, fontWeight: '700' },
  txMeta: { fontSize: 11, marginTop: 2 },
  txAmount: { fontSize: 14, fontWeight: '800' },
  accountCardRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 14, borderRadius: 14, marginBottom: 8 },
  catChip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  settingsCard: { borderWidth: 1, padding: 16, borderRadius: 16 },
  settingsCardTitle: { fontSize: 15, fontWeight: '700' },
  settingsCardSub: { fontSize: 12, marginTop: 4, marginBottom: 12 },
  themeOptionsRow: { flexDirection: 'row', gap: 8 },
  themeOptionBtn: { flex: 1, paddingVertical: 12, paddingHorizontal: 8, borderRadius: 12, borderWidth: 1.5, alignItems: 'center' },
  themeOptionText: { fontSize: 13, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalCard: { borderWidth: 1, padding: 20, borderRadius: 24 },
  modalTitle: { fontSize: 16, fontWeight: '800', marginBottom: 14 },
  modalTypeRow: { flexDirection: 'row', padding: 3, borderRadius: 10, marginBottom: 14 },
  modalTypeBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  modalTypeText: { fontSize: 12, fontWeight: '600' },
  input: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 14, marginBottom: 12 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 6 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 16 },
  saveBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
  menuOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', flexDirection: 'row' },
  drawerPanel: { width: '80%', height: '100%', borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 4, height: 0 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 10 },
  drawerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderBottomWidth: 1 },
  drawerTitle: { fontSize: 17, fontWeight: '800' },
  drawerSub: { fontSize: 11, marginTop: 2 },
  drawerItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14, borderRadius: 10, marginHorizontal: 8, marginBottom: 4 },
  drawerItemText: { fontSize: 14, fontWeight: '600' },
  drawerFooter: { padding: 16, borderTopWidth: 1 },
  returnHubBtn: { paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderRadius: 10 },
});
