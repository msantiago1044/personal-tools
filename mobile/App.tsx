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
  Switch,
  useColorScheme
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, signInWithGoogleMobile } from './src/lib/supabase';

type ThemeMode = 'light' | 'dark' | 'system';
type FinanceTab = 'home' | 'transactions' | 'accounts' | 'categories' | 'budgets' | 'reports' | 'settings';

interface AppSettings {
  currency_code: string;
  currency_symbol: string;
  decimals: number;
  hide_balances: boolean;
  budget_alerts: boolean;
  confirm_before_save: boolean;
  default_time_filter: 'dia' | 'semana' | 'mes' | 'ano';
}

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'Dólar Estadounidense ($)' },
  { code: 'EUR', symbol: '€', name: 'Euro (€)' },
  { code: 'COP', symbol: '$', name: 'Peso Colombiano ($)' },
  { code: 'MXN', symbol: '$', name: 'Peso Mexicano ($)' },
  { code: 'ARS', symbol: '$', name: 'Peso Argentino ($)' },
  { code: 'CLP', symbol: '$', name: 'Peso Chileno ($)' },
  { code: 'PEN', symbol: 'S/', name: 'Sol Peruano (S/)' },
  { code: 'GBP', symbol: '£', name: 'Libra Esterlina (£)' },
];

export default function App() {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'hub' | 'finance'>('hub');
  const [financeTab, setFinanceTab] = useState<FinanceTab>('home');

  // Menú desplegable móvil (ocultar / mostrar)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Configuraciones de usuario completas
  const [settings, setSettings] = useState<AppSettings>({
    currency_code: 'USD',
    currency_symbol: '$',
    decimals: 2,
    hide_balances: false,
    budget_alerts: true,
    confirm_before_save: false,
    default_time_filter: 'mes',
  });
  const [savingSettings, setSavingSettings] = useState(false);

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

  // 1. Cargar tema y configuraciones persistidas
  useEffect(() => {
    AsyncStorage.getItem('app_theme_mode').then((saved) => {
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        setThemeMode(saved);
      }
    });

    AsyncStorage.getItem('app_settings').then((saved) => {
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSettings((prev) => ({ ...prev, ...parsed }));
          if (parsed.default_time_filter) {
            setTimeFilter(parsed.default_time_filter);
          }
        } catch (e) {
          console.error(e);
        }
      }
    });
  }, []);

  const changeThemeMode = async (mode: ThemeMode) => {
    setThemeMode(mode);
    await AsyncStorage.setItem('app_theme_mode', mode);
  };

  const isDark =
    themeMode === 'system'
      ? systemColorScheme === 'dark'
      : themeMode === 'dark';

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

  // Formateador de dinero dinámico según settings
  const formatMoney = (amount: number | string) => {
    if (settings.hide_balances) return '••••••';
    const num = Number(amount) || 0;
    const formattedNum = num.toLocaleString('es-ES', {
      minimumFractionDigits: settings.decimals,
      maximumFractionDigits: settings.decimals,
    });
    return `${settings.currency_symbol} ${formattedNum}`;
  };

  // Auth Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Cargar perfil y configuración desde Supabase
  const loadUserProfile = async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profile) {
      setSettings((prev) => ({
        ...prev,
        currency_code: profile.currency_code || prev.currency_code,
        currency_symbol: profile.currency_symbol || prev.currency_symbol,
      }));
    }
  };

  // Guardar configuración en Supabase y AsyncStorage
  const handleSaveSettings = async (updated: Partial<AppSettings>) => {
    const newConfig = { ...settings, ...updated };
    setSettings(newConfig);
    setSavingSettings(true);

    try {
      // 1. Guardar localmente
      await AsyncStorage.setItem('app_settings', JSON.stringify(newConfig));

      // 2. Guardar en Supabase si hay sesión
      if (session?.user) {
        await supabase
          .from('profiles')
          .update({
            currency_code: newConfig.currency_code,
            currency_symbol: newConfig.currency_symbol,
            updated_at: new Date().toISOString(),
          })
          .eq('id', session.user.id);
      }

      Alert.alert('Configuración Guardada', 'Tus preferencias y formato de moneda se han aplicado en toda la aplicación.');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudo guardar la configuración.');
    } finally {
      setSavingSettings(false);
    }
  };

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

    const performSave = async () => {
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

    if (settings.confirm_before_save) {
      Alert.alert(
        'Confirmar Movimiento',
        `¿Deseas registrar este ${txType} por ${settings.currency_symbol} ${amount}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Guardar', onPress: performSave },
        ]
      );
    } else {
      performSave();
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

  // 1. PANTALLA LOGIN
  if (!session) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

        {/* Selector de tema en esquina superior derecha de Login */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 24, paddingTop: 16 }}>
          <View style={[styles.loginThemeToggle, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {[
              { id: 'light', label: '☀️' },
              { id: 'dark', label: '🌙' },
              { id: 'system', label: '📱' },
            ].map((t) => (
              <TouchableOpacity
                key={t.id}
                onPress={() => changeThemeMode(t.id as ThemeMode)}
                style={[
                  styles.loginThemeBtn,
                  themeMode === t.id && { backgroundColor: colors.accentBg },
                ]}
              >
                <Text style={{ fontSize: 13 }}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.loginContent}>
          <View style={[styles.logoBadge, { backgroundColor: colors.accentBg }]}>
            <Text style={{ fontSize: 36 }}>💎</Text>
          </View>
          <Text style={[styles.loginTitle, { color: colors.text }]}>Personal Tools</Text>
          <Text style={[styles.loginSubtitle, { color: colors.subtext }]}>
            Suite privada de finanzas y productividad con soporte completo para temas Claro y Oscuro.
          </Text>

          <TouchableOpacity
            style={[
              styles.googleButton,
              {
                backgroundColor: isDark ? '#FFFFFF' : '#0F172A',
                borderWidth: isDark ? 0 : 1,
                borderColor: colors.border,
              },
            ]}
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

  // 2. MÓDULO DE FINANZAS
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

        {/* Top Navbar */}
        <View style={[styles.mobileHeader, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
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

          {/* Botón de ocultar/mostrar saldo (Modo discreto) y botón Nuevo */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <TouchableOpacity
              onPress={() => handleSaveSettings({ hide_balances: !settings.hide_balances })}
              style={[styles.iconButton, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
              title={settings.hide_balances ? 'Mostrar saldos' : 'Ocultar saldos'}
            >
              <Text style={{ fontSize: 14 }}>{settings.hide_balances ? '👁️' : '🙈'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsModalOpen(true)}
              style={[styles.newTxButton, { backgroundColor: colors.accent }]}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 13 }}>+ Mov.</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* MENÚ LATERAL DESPLEGABLE */}
        <Modal visible={isMenuOpen} animationType="fade" transparent>
          <View style={styles.menuOverlay}>
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={1}
              onPress={() => setIsMenuOpen(false)}
            />

            <View style={[styles.drawerPanel, { backgroundColor: colors.drawerBg, borderColor: colors.border }]}>
              <View style={[styles.drawerHeader, { borderColor: colors.border }]}>
                <View>
                  <Text style={[styles.drawerTitle, { color: colors.text }]}>Navegación</Text>
                  <Text style={[styles.drawerSub, { color: colors.subtext }]}>
                    Moneda activa: {settings.currency_code} ({settings.currency_symbol})
                  </Text>
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
                  { id: 'settings', label: 'Configuración & Moneda', icon: '⚙️' },
                ].map((item) => {
                  const isActive = financeTab === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => {
                        setFinanceTab(item.id as FinanceTab);
                        setIsMenuOpen(false);
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
                {/* Selector rápido de tema en el menú lateral */}
                <View style={{ marginBottom: 12 }}>
                  <Text style={{ color: colors.subtext, fontSize: 10, fontWeight: '700', letterSpacing: 0.5, marginBottom: 8 }}>
                    APARIENCIA & TEMA
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    {[
                      { id: 'light', label: '☀️ Claro' },
                      { id: 'dark', label: '🌙 Oscuro' },
                      { id: 'system', label: '📱 Auto' },
                    ].map((t) => (
                      <TouchableOpacity
                        key={t.id}
                        onPress={() => changeThemeMode(t.id as ThemeMode)}
                        style={[
                          styles.drawerThemeChip,
                          {
                            backgroundColor: themeMode === t.id ? colors.accentBg : colors.inputBg,
                            borderColor: themeMode === t.id ? colors.accent : colors.border,
                          },
                        ]}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: themeMode === t.id ? '800' : '600',
                            color: themeMode === t.id ? colors.accent : colors.text,
                          }}
                        >
                          {t.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    setIsMenuOpen(false);
                    setCurrentView('hub');
                  }}
                  style={[styles.returnHubBtn, { borderColor: colors.border, backgroundColor: colors.inputBg }]}
                >
                  <Text style={{ color: colors.accent, fontWeight: '700', fontSize: 12 }}>
                    🏠 Cambiar de Herramienta (Hub)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* CONTENIDO PRINCIPAL */}
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

              {/* Tarjeta de Balance General con Moneda Dinámica */}
              <View style={[styles.balanceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={[styles.balanceLabel, { color: colors.subtext }]}>Balance Neto ({timeFilter})</Text>
                  <Text style={{ fontSize: 11, color: colors.accent, fontWeight: '700' }}>
                    {settings.currency_code}
                  </Text>
                </View>

                <Text style={[styles.balanceValue, { color: netBalance >= 0 ? colors.accent : colors.danger }]}>
                  {formatMoney(netBalance)}
                </Text>

                <View style={[styles.balanceSplit, { borderColor: colors.border }]}>
                  <View>
                    <Text style={[styles.splitLabel, { color: colors.subtext }]}>Ingresos (+)</Text>
                    <Text style={[styles.splitValue, { color: colors.accent }]}>
                      +{formatMoney(totalIncome)}
                    </Text>
                  </View>
                  <View>
                    <Text style={[styles.splitLabel, { color: colors.subtext }]}>Gastos (-)</Text>
                    <Text style={[styles.splitValue, { color: colors.danger }]}>
                      -{formatMoney(totalExpense)}
                    </Text>
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
                      {formatMoney(acc.initial_balance)}
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
                    {tx.type === 'salida' ? '-' : tx.type === 'ingreso' ? '+' : ''}{formatMoney(tx.amount)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* TAB 2: HISTORIAL */}
          {financeTab === 'transactions' && (
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 12 }]}>
                Historial ({transactions.length} registros en {settings.currency_code})
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
                    {tx.type === 'salida' ? '-' : tx.type === 'ingreso' ? '+' : ''}{formatMoney(tx.amount)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* TAB 3: CUENTAS */}
          {financeTab === 'accounts' && (
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 12 }]}>
                Gestión de Cuentas ({settings.currency_symbol})
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
                    {formatMoney(acc.initial_balance)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* TAB 4: CATEGORÍAS */}
          {financeTab === 'categories' && (
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 12 }]}>
                Categorías Registradas
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
                Presupuesto y Control de Gastos
              </Text>
              <View style={[styles.balanceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={{ color: colors.subtext, fontSize: 12 }}>Salidas Totales Registradas</Text>
                <Text style={{ fontSize: 26, fontWeight: '900', color: colors.danger, marginTop: 4 }}>
                  {formatMoney(totalExpense)}
                </Text>
                <Text style={{ color: colors.accent, fontSize: 12, marginTop: 8, fontWeight: '600' }}>
                  ✓ Moneda de cálculo: {settings.currency_code}
                </Text>
              </View>
            </View>
          )}

          {/* TAB 6: REPORTES */}
          {financeTab === 'reports' && (
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 8 }]}>
                Reportes Financieros
              </Text>
              <View style={[styles.balanceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 6 }}>
                  Rendimiento del Flujo de Caja
                </Text>
                <Text style={{ color: colors.subtext, fontSize: 12, lineHeight: 18 }}>
                  Tasa de ahorro acumulada:{' '}
                  <Text style={{ color: colors.accent, fontWeight: 'bold' }}>
                    {totalIncome > 0 ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1) : 0}%
                  </Text>
                  . Flujo neto registrado en {settings.currency_code}: {formatMoney(netBalance)}.
                </Text>
              </View>
            </View>
          )}

          {/* =============================================================== */}
          {/* TAB 7: CONFIGURACIÓN AVANZADA & GESTIÓN DE MONEDA Y PREFERENCIAS */}
          {/* =============================================================== */}
          {financeTab === 'settings' && (
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 12 }]}>
                Configuración del Sistema
              </Text>

              {/* 1. Moneda Principal */}
              <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border, marginBottom: 14 }]}>
                <Text style={[styles.settingsCardTitle, { color: colors.text }]}>Moneda Principal ({settings.currency_code})</Text>
                <Text style={[styles.settingsCardSub, { color: colors.subtext }]}>
                  Selecciona la divisa para tus balances y transacciones:
                </Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {CURRENCIES.map((curr) => {
                    const isSelected = settings.currency_code === curr.code;
                    return (
                      <TouchableOpacity
                        key={curr.code}
                        onPress={() =>
                          handleSaveSettings({
                            currency_code: curr.code,
                            currency_symbol: curr.symbol,
                          })
                        }
                        style={[
                          styles.currencyChip,
                          {
                            backgroundColor: isSelected ? colors.accentBg : colors.inputBg,
                            borderColor: isSelected ? colors.accent : colors.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.currencyChipText,
                            { color: isSelected ? colors.accent : colors.text },
                            isSelected && { fontWeight: '800' },
                          ]}
                        >
                          {curr.code} ({curr.symbol})
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* 2. Decimales y Formato */}
              <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border, marginBottom: 14 }]}>
                <Text style={[styles.settingsCardTitle, { color: colors.text }]}>Decimales de Moneda</Text>
                <Text style={[styles.settingsCardSub, { color: colors.subtext }]}>
                  ¿Deseas mostrar centavos/decimales en los montos?
                </Text>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                  {[
                    { val: 2, label: `2 Decimales (${settings.currency_symbol} 1.250,00)` },
                    { val: 0, label: `Sin Decimales (${settings.currency_symbol} 1.250)` },
                  ].map((d) => (
                    <TouchableOpacity
                      key={d.val}
                      onPress={() => handleSaveSettings({ decimals: d.val })}
                      style={[
                        styles.decimalChip,
                        {
                          backgroundColor: settings.decimals === d.val ? colors.accentBg : colors.inputBg,
                          borderColor: settings.decimals === d.val ? colors.accent : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: settings.decimals === d.val ? colors.accent : colors.text,
                          fontWeight: settings.decimals === d.val ? '800' : '500',
                        }}
                      >
                        {d.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* 3. Filtro Temporal Predeterminado */}
              <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border, marginBottom: 14 }]}>
                <Text style={[styles.settingsCardTitle, { color: colors.text }]}>Periodo Inicial al Abrir</Text>
                <Text style={[styles.settingsCardSub, { color: colors.subtext }]}>
                  Periodo que se carga por defecto al entrar al Home:
                </Text>

                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {(['dia', 'semana', 'mes', 'ano'] as const).map((p) => {
                    const isSelected = settings.default_time_filter === p;
                    return (
                      <TouchableOpacity
                        key={p}
                        onPress={() => handleSaveSettings({ default_time_filter: p })}
                        style={[
                          styles.periodChip,
                          {
                            backgroundColor: isSelected ? colors.accentBg : colors.inputBg,
                            borderColor: isSelected ? colors.accent : colors.border,
                          },
                        ]}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            color: isSelected ? colors.accent : colors.text,
                            fontWeight: isSelected ? '800' : '500',
                            textTransform: 'capitalize',
                          }}
                        >
                          {p === 'ano' ? 'Año' : p === 'dia' ? 'Día' : p}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* 4. Interruptores de Preferencias */}
              <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border, marginBottom: 14 }]}>
                <Text style={[styles.settingsCardTitle, { color: colors.text }]}>Privacidad & Alertas</Text>

                {/* Ocultar saldos */}
                <View style={styles.switchRow}>
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={[styles.switchTitle, { color: colors.text }]}>Ocultar Saldos (Modo Discreto)</Text>
                    <Text style={[styles.switchSub, { color: colors.subtext }]}>Muestra asteriscos en lugar de los números en público.</Text>
                  </View>
                  <Switch
                    value={settings.hide_balances}
                    onValueChange={(val) => handleSaveSettings({ hide_balances: val })}
                    thumbColor={settings.hide_balances ? colors.accent : '#94A3B8'}
                  />
                </View>

                {/* Confirmar antes de guardar */}
                <View style={[styles.switchRow, { borderTopWidth: 1, borderColor: colors.border, paddingTop: 12 }]}>
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={[styles.switchTitle, { color: colors.text }]}>Confirmar Movimientos</Text>
                    <Text style={[styles.switchSub, { color: colors.subtext }]}>Pide confirmación emergente antes de guardar cada registro.</Text>
                  </View>
                  <Switch
                    value={settings.confirm_before_save}
                    onValueChange={(val) => handleSaveSettings({ confirm_before_save: val })}
                    thumbColor={settings.confirm_before_save ? colors.accent : '#94A3B8'}
                  />
                </View>
              </View>

              {/* 5. Selector de Temas */}
              <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border, marginBottom: 14 }]}>
                <Text style={[styles.settingsCardTitle, { color: colors.text }]}>Apariencia & Tema</Text>
                <Text style={[styles.settingsCardSub, { color: colors.subtext }]}>Elige tu preferencia visual:</Text>

                <View style={styles.themeOptionsRow}>
                  {[
                    { id: 'light', label: '☀️ Claro', sub: 'Limpio' },
                    { id: 'dark', label: '🌙 Oscuro', sub: 'Noche' },
                    { id: 'system', label: '📱 Sistema', sub: 'Auto' },
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

              {/* 6. Info de Cuenta */}
              <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.settingsCardTitle, { color: colors.text }]}>Cuenta & Sincronización</Text>
                <Text style={{ color: colors.subtext, fontSize: 12, marginTop: 4 }}>
                  Usuario: <Text style={{ color: colors.text, fontWeight: '700' }}>{session.user.email}</Text>
                </Text>
                <Text style={{ color: colors.subtext, fontSize: 11, marginTop: 6, lineHeight: 16 }}>
                  Sincronizado con Supabase Cloud. Cada cambio en tu moneda o perfil se respalda de forma segura en PostgreSQL con RLS.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Modal de Registro Rápido con Moneda Dinámica */}
        <Modal visible={isModalOpen} animationType="slide" transparent>
          <View style={[styles.modalOverlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.75)' : 'rgba(15,23,42,0.5)' }]}>
            <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Nuevo Movimiento ({settings.currency_symbol})
              </Text>

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

              {/* Selector de cuenta para el movimiento */}
              <Text style={{ fontSize: 11, fontWeight: '700', color: colors.subtext, marginBottom: 6 }}>
                CUENTA:
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                {accounts.map((acc) => {
                  const isSelected = txAccount === acc.id || (!txAccount && accounts[0]?.id === acc.id);
                  return (
                    <TouchableOpacity
                      key={acc.id}
                      onPress={() => setTxAccount(acc.id)}
                      style={[
                        styles.modalAccChip,
                        {
                          backgroundColor: isSelected ? colors.accentBg : colors.inputBg,
                          borderColor: isSelected ? colors.accent : colors.border,
                        },
                      ]}
                    >
                      <Text style={{ fontSize: 13, marginRight: 4 }}>
                        {acc.type === 'tarjeta' ? '💳' : acc.type === 'efectivo' ? '💵' : '🏦'}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: isSelected ? colors.accent : colors.text,
                          fontWeight: isSelected ? '800' : '600',
                        }}
                      >
                        {acc.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={{ position: 'relative', marginBottom: 12 }}>
                <TextInput
                  placeholder={`Monto en ${settings.currency_code} (ej. 45.00)`}
                  placeholderTextColor={colors.subtext}
                  keyboardType="numeric"
                  value={txAmount}
                  onChangeText={setTxAmount}
                  style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
                />
              </View>

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

  // 3. TOOL HUB MÓVIL
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

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {/* Selector de tema rápido en Hub */}
          <View style={[styles.loginThemeToggle, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            {[
              { id: 'light', label: '☀️' },
              { id: 'dark', label: '🌙' },
              { id: 'system', label: '📱' },
            ].map((t) => (
              <TouchableOpacity
                key={t.id}
                onPress={() => changeThemeMode(t.id as ThemeMode)}
                style={[
                  styles.loginThemeBtn,
                  themeMode === t.id && { backgroundColor: colors.accentBg },
                ]}
              >
                <Text style={{ fontSize: 12 }}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => supabase.auth.signOut()}
            style={[styles.logoutBtn, { backgroundColor: colors.inputBg }]}
          >
            <Text style={styles.logoutBtnText}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
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

        <View style={[styles.toolCardDisabled, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={{ fontSize: 24 }}>📈</Text>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.toolCardTitleDisabled, { color: colors.subtext }]}>Inversiones & Activos</Text>
            <Text style={[styles.toolCardDesc, { color: colors.subtext }]}>Próximamente en Personal Tools.</Text>
          </View>
        </View>

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
  settingsCardTitle: { fontSize: 15, fontWeight: '800' },
  settingsCardSub: { fontSize: 12, marginTop: 4, marginBottom: 12 },
  currencyChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5 },
  currencyChipText: { fontSize: 12, fontWeight: '600' },
  decimalChip: { flex: 1, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1.5, alignItems: 'center' },
  periodChip: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10, borderWidth: 1.5 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  switchTitle: { fontSize: 13, fontWeight: '700' },
  switchSub: { fontSize: 11, marginTop: 2 },
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
  drawerThemeChip: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8, borderWidth: 1 },
  returnHubBtn: { paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderRadius: 10 },
  loginThemeToggle: { flexDirection: 'row', padding: 3, borderRadius: 12, borderWidth: 1 },
  loginThemeBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  modalAccChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5, marginRight: 8 },
});
