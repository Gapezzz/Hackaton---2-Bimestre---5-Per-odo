import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { buscarDashboardAdmin } from '../services/adminApi';
import ScreenState from '../components/ScreenState';
import { colors } from '../theme';

export default function AdminDashboardScreen() {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const carregar = useCallback(async () => {
    setError('');
    try { setDados(await buscarDashboardAdmin()); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);
  useFocusEffect(useCallback(() => { carregar(); }, [carregar]));
  const cards = dados ? [
    ['Usuários', dados.totalUsuarios, colors.info],
    ['Palpites', dados.totalPalpites, colors.success],
    ['Partidas pendentes', dados.partidasPendentes, colors.primary],
    ['Ativos em 24h', dados.usuariosAtivos24h, '#A78BFA'],
  ] : [];
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); carregar(); }} tintColor={colors.primary} />}>
      <Text style={styles.title}>Painel administrativo</Text>
      <Text style={styles.subtitle}>Gerencie o bolão diretamente pelo aplicativo.</Text>
      <ScreenState loading={loading} error={error} onRetry={carregar} />
      <View style={styles.grid}>{cards.map(([label, value, color]) =>
        <View key={label} style={[styles.card, { borderLeftColor: color }]}>
          <Text style={styles.label}>{label}</Text><Text style={[styles.value, { color }]}>{value}</Text>
        </View>)}</View>
      <View style={styles.notice}><Text style={styles.noticeTitle}>Perfil ADMIN</Text>
        <Text style={styles.noticeText}>Você pode cadastrar e editar dados, lançar resultados e administrar participantes.</Text></View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background }, content: { padding: 18, gap: 14 },
  title: { color: colors.text, fontSize: 27, fontWeight: '900' }, subtitle: { color: colors.muted, marginTop: -8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '47%', backgroundColor: colors.surface, borderRadius: 14, padding: 16, borderLeftWidth: 4 },
  label: { color: colors.muted, fontSize: 12, fontWeight: '700' }, value: { fontSize: 30, fontWeight: '900', marginTop: 5 },
  notice: { backgroundColor: colors.surfaceAlt, borderRadius: 14, padding: 16, marginTop: 6 },
  noticeTitle: { color: colors.primary, fontWeight: '900' }, noticeText: { color: colors.muted, marginTop: 5, lineHeight: 20 },
});
