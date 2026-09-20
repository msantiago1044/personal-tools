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
  Alert
} from 'react-native';
import { supabase, signInWithGoogleMobile } from './src/lib/supabase';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'hub' | 'finance'>('hub');

  // Estados financieros
  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [timeFilter, setTimeFilter] = useState<'dia' | 'semana' | 'mes' | 'ano'>('mes');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Formulario de transacción rápida
  const [txType, setTxType] = useState<'ingreso' | 'salida' | 'transferencia'>('salida');
  const [txAmount, setTxAmount] = useState('');
  const [txDesc, setTxDesc] = useState('');
  const [txAccount, setTxAccount] = useState('');

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

    const { data: txs } = await supabase
      .from('transactions')
      .select('*, account:accounts!transactions_account_id_fkey(name)')
      .order('date', { ascending: false })
      .limit(20);
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
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Cargando Personal Tools...</Text>
      </View>
    );
  }

  // 1. Pantalla de Login Móvil
  if (!session) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loginContent}>
          <View style={styles.logoBadge}>
            <Text style={{ fontSize: 36 }}>💎</Text>
          </View>
          <Text style={styles.loginTitle}>Personal Tools</Text>
          <Text style={styles.loginSubtitle}>
            Suite privada de productividad y finanzas personales móviles.
          </Text>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={() => signInWithGoogleMobile()}
          >
            <Text style={styles.googleButtonText}>Continuar con Google</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 2. Módulo de Finanzas Móvil
  if (currentView === 'finance') {
    const totalIncome = transactions
      .filter((t) => t.type === 'ingreso')
      .reduce((s, t) => s + Number(t.amount), 0);
    const totalExpense = transactions
      .filter((t) => t.type === 'salida')
      .reduce((s, t) => s + Number(t.amount), 0);

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        {/* Top Header */}
        <View style={styles.mobileHeader}>
          <TouchableOpacity onPress={() => setCurrentView('hub')} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Hub</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Finanzas Diarias</Text>
          <TouchableOpacity
            onPress={() => setIsModalOpen(true)}
            style={styles.newTxButton}
          >
            <Text style={styles.newTxButtonText}>+ Nuevo</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
          {/* Selector de tiempo */}
          <View style={styles.filterRow}>
            {(['dia', 'semana', 'mes', 'ano'] as const).map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => setTimeFilter(f)}
                style={[styles.filterChip, timeFilter === f && styles.filterChipActive]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    timeFilter === f && styles.filterChipTextActive,
                  ]}
                >
                  {f === 'ano' ? 'Año' : f === 'dia' ? 'Día' : f.charAt(0).toUpperCase() + f.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tarjetas de Balance */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Balance Neto del Mes</Text>
            <Text style={[styles.balanceValue, { color: totalIncome >= totalExpense ? '#3B82F6' : '#EF4444' }]}>
              ${(totalIncome - totalExpense).toFixed(2)}
            </Text>
            <View style={styles.balanceSplit}>
              <View>
                <Text style={styles.splitLabel}>Ingresos</Text>
                <Text style={[styles.splitValue, { color: '#10B981' }]}>+${totalIncome.toFixed(2)}</Text>
              </View>
              <View>
                <Text style={styles.splitLabel}>Gastos</Text>
                <Text style={[styles.splitValue, { color: '#EF4444' }]}>-${totalExpense.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          {/* Cuentas */}
          <Text style={styles.sectionTitle}>Tus Cuentas</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
            {accounts.map((acc) => (
              <View key={acc.id} style={styles.accountPill}>
                <Text style={styles.accountIcon}>
                  {acc.type === 'tarjeta' ? '💳' : acc.type === 'efectivo' ? '💵' : '🏦'}
                </Text>
                <Text style={styles.accountName}>{acc.name}</Text>
                <Text style={styles.accountBalance}>${Number(acc.initial_balance).toFixed(2)}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Últimos Movimientos */}
          <Text style={styles.sectionTitle}>Últimos Movimientos</Text>
          {transactions.map((tx) => (
            <View key={tx.id} style={styles.txRow}>
              <View>
                <Text style={styles.txDesc}>{tx.description || tx.type}</Text>
                <Text style={styles.txMeta}>{tx.date} • {tx.account?.name || 'Cuenta'}</Text>
              </View>
              <Text
                style={[
                  styles.txAmount,
                  { color: tx.type === 'ingreso' ? '#10B981' : tx.type === 'salida' ? '#EF4444' : '#3B82F6' },
                ]}
              >
                {tx.type === 'salida' ? '-' : tx.type === 'ingreso' ? '+' : ''}${Number(tx.amount).toFixed(2)}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Modal de Registro */}
        <Modal visible={isModalOpen} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Nuevo Movimiento</Text>

              {/* Selector tipo */}
              <View style={styles.modalTypeRow}>
                {(['salida', 'ingreso', 'transferencia'] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setTxType(t)}
                    style={[styles.modalTypeBtn, txType === t && styles.modalTypeBtnActive]}
                  >
                    <Text style={[styles.modalTypeText, txType === t && styles.modalTypeTextActive]}>
                      {t === 'salida' ? '- Gasto' : t === 'ingreso' ? '+ Ingreso' : '⇄ Transf.'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                placeholder="Monto (ej. 25.50)"
                placeholderTextColor="#64748B"
                keyboardType="numeric"
                value={txAmount}
                onChangeText={setTxAmount}
                style={styles.input}
              />

              <TextInput
                placeholder="Descripción (opcional)"
                placeholderTextColor="#64748B"
                value={txDesc}
                onChangeText={setTxDesc}
                style={styles.input}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity onPress={() => setIsModalOpen(false)} style={styles.cancelBtn}>
                  <Text style={styles.cancelBtnText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveTx} style={styles.saveBtn}>
                  <Text style={styles.saveBtnText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  // 3. Tool Hub Móvil (Launcher)
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.hubHeader}>
        <View>
          <Text style={styles.hubGreeting}>Hola, {session.user.email?.split('@')[0]}</Text>
          <Text style={styles.hubSub}>Selecciona tu herramienta de hoy</Text>
        </View>
        <TouchableOpacity onPress={() => supabase.auth.signOut()} style={styles.logoutBtn}>
          <Text style={styles.logoutBtnText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {/* Tool 1: Finanzas (Activa) */}
        <TouchableOpacity
          style={styles.toolCardActive}
          onPress={() => setCurrentView('finance')}
        >
          <View style={styles.toolIconWrap}>
            <Text style={{ fontSize: 24 }}>📊</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.toolCardTitle}>Finanzas & Gastos</Text>
              <View style={styles.badgeActive}>
                <Text style={styles.badgeText}>ACTIVO</Text>
              </View>
            </View>
            <Text style={styles.toolCardDesc}>
              Control de flujo de caja, cuentas bancarias, tarjetas y presupuestos.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Tool 2: Inversiones */}
        <View style={styles.toolCardDisabled}>
          <Text style={{ fontSize: 24 }}>📈</Text>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.toolCardTitleDisabled}>Inversiones & Activos</Text>
            <Text style={styles.toolCardDesc}>Próximamente en Personal Tools.</Text>
          </View>
        </View>

        {/* Tool 3: Metas */}
        <View style={styles.toolCardDisabled}>
          <Text style={{ fontSize: 24 }}>🎯</Text>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.toolCardTitleDisabled}>Metas de Ahorro</Text>
            <Text style={styles.toolCardDesc}>Próximamente en Personal Tools.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#030712' },
  centerContainer: { flex: 1, backgroundColor: '#030712', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#94A3B8', marginTop: 12, fontSize: 13 },
  loginContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  logoBadge: { width: 70, height: 70, borderRadius: 20, backgroundColor: '#064E3B', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  loginTitle: { fontSize: 26, fontWeight: '800', color: '#FFFFFF' },
  loginSubtitle: { fontSize: 13, color: '#94A3B8', textAlign: 'center', marginTop: 8, marginBottom: 32, lineHeight: 20 },
  googleButton: { backgroundColor: '#FFFFFF', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 14, width: '100%', alignItems: 'center' },
  googleButtonText: { color: '#0F172A', fontWeight: '700', fontSize: 15 },
  hubHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#1E293B' },
  hubGreeting: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  hubSub: { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  logoutBtn: { backgroundColor: '#1E293B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  logoutBtnText: { color: '#F87171', fontSize: 12, fontWeight: '600' },
  toolCardActive: { backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#10B981', padding: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  toolCardDisabled: { backgroundColor: '#0B0F19', borderWidth: 1, borderColor: '#1E293B', padding: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12, opacity: 0.6 },
  toolIconWrap: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#064E3B', justifyContent: 'center', alignItems: 'center' },
  toolCardTitle: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  toolCardTitleDisabled: { color: '#94A3B8', fontWeight: '600', fontSize: 15 },
  toolCardDesc: { color: '#64748B', fontSize: 12, marginTop: 4 },
  badgeActive: { backgroundColor: '#064E3B', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  badgeText: { color: '#34D399', fontSize: 9, fontWeight: '800' },
  mobileHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderColor: '#1E293B' },
  backButton: { padding: 6 },
  backButtonText: { color: '#10B981', fontWeight: '600', fontSize: 13 },
  headerTitle: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  newTxButton: { backgroundColor: '#10B981', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  newTxButtonText: { color: '#030712', fontWeight: '700', fontSize: 12 },
  filterRow: { flexDirection: 'row', backgroundColor: '#0F172A', padding: 4, borderRadius: 12, marginBottom: 16 },
  filterChip: { flex: 1, paddingVertical: 6, alignItems: 'center', borderRadius: 8 },
  filterChipActive: { backgroundColor: '#10B981' },
  filterChipText: { color: '#94A3B8', fontSize: 12, fontWeight: '600' },
  filterChipTextActive: { color: '#030712', fontWeight: '800' },
  balanceCard: { backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#1E293B', padding: 18, borderRadius: 20, marginBottom: 20 },
  balanceLabel: { color: '#94A3B8', fontSize: 12, fontWeight: '600' },
  balanceValue: { fontSize: 28, fontWeight: '900', marginTop: 4 },
  balanceSplit: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderColor: '#1E293B' },
  splitLabel: { color: '#64748B', fontSize: 11 },
  splitValue: { fontSize: 15, fontWeight: '700', marginTop: 2 },
  sectionTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginBottom: 10 },
  accountPill: { backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#1E293B', padding: 12, borderRadius: 14, marginRight: 10, minWidth: 120 },
  accountIcon: { fontSize: 18 },
  accountName: { color: '#FFFFFF', fontSize: 12, fontWeight: '600', marginTop: 4 },
  accountBalance: { color: '#10B981', fontSize: 13, fontWeight: '800', marginTop: 2 },
  txRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0F172A', padding: 12, borderRadius: 12, marginBottom: 8 },
  txDesc: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  txMeta: { color: '#64748B', fontSize: 11, marginTop: 2 },
  txAmount: { fontSize: 14, fontWeight: '800' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#1E293B', padding: 20, borderRadius: 24 },
  modalTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', marginBottom: 14 },
  modalTypeRow: { flexDirection: 'row', backgroundColor: '#030712', padding: 3, borderRadius: 10, marginBottom: 14 },
  modalTypeBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  modalTypeBtnActive: { backgroundColor: '#1E293B' },
  modalTypeText: { color: '#94A3B8', fontSize: 12, fontWeight: '600' },
  modalTypeTextActive: { color: '#10B981', fontWeight: '800' },
  input: { backgroundColor: '#030712', borderWidth: 1, borderColor: '#1E293B', borderRadius: 12, padding: 12, color: '#FFFFFF', fontSize: 14, marginBottom: 12 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 6 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 16 },
  cancelBtnText: { color: '#94A3B8', fontWeight: '600' },
  saveBtn: { backgroundColor: '#10B981', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
  saveBtnText: { color: '#030712', fontWeight: '800' }
});
