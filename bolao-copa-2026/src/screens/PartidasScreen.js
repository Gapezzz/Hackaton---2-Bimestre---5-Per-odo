import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { listarPartidas } from '../services/api';
import { colors } from '../theme';
import PartidaCard from '../components/PartidaCard';
import ScreenState from '../components/ScreenState';

const fases = ['', 'Grupos', 'Oitavas', 'Quartas', 'Semi', 'Final'];
const status = [{ label: 'Todas', value: undefined }, { label: 'Abertas', value: false }, { label: 'Encerradas', value: true }];

export default function PartidasScreen({ navigation }) {
  const [partidas, setPartidas] = useState([]);
  const [fase, setFase] = useState('');
  const [encerrada, setEncerrada] = useState(undefined);
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const carregar = useCallback(async (silencioso = false) => {
    if (!silencioso) setLoading(true);
    setError('');
    try {
      const { data: resposta } = await listarPartidas({ fase, encerrada, data: data.trim() });
      setPartidas(resposta || []);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); setRefreshing(false); }
  }, [fase, encerrada, data]);

  useFocusEffect(useCallback(() => { carregar(); }, [carregar]));

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        <Text style={styles.label}>Fase</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {fases.map((item) => <Chip key={item || 'todas'} label={item || 'Todas'} active={fase === item} onPress={() => setFase(item)} />)}
        </ScrollView>
        <Text style={styles.label}>Status</Text>
        <View style={styles.chips}>{status.map((item) => <Chip key={item.label} label={item.label} active={encerrada === item.value} onPress={() => setEncerrada(item.value)} />)}</View>
        <View style={styles.dateRow}>
          <TextInput style={styles.input} placeholder="Data: AAAA-MM-DD" placeholderTextColor={colors.muted}
            value={data} onChangeText={setData} keyboardType="numbers-and-punctuation" />
          <TouchableOpacity style={styles.apply} onPress={() => carregar()}><Text style={styles.applyText}>Filtrar</Text></TouchableOpacity>
        </View>
      </View>
      <ScreenState loading={loading} error={error} empty={!loading && !error && !partidas.length ? 'Nenhuma partida encontrada com esses filtros.' : ''} onRetry={carregar} />
      {!loading && !error && (
        <FlatList data={partidas} keyExtractor={(item) => String(item.id)} contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); carregar(true); }} tintColor={colors.primary} />}
          renderItem={({ item }) => <PartidaCard partida={item} onPress={() => navigation.navigate('DetalhesPartida', { partidaId: item.id })} />} />
      )}
    </View>
  );
}

const Chip = ({ label, active, onPress }) => (
  <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
    <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
  </TouchableOpacity>
);
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  filters: { padding: 14, gap: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { color: colors.muted, fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  chips: { flexDirection: 'row', gap: 8 },
  chip: { backgroundColor: colors.surface, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.muted, fontWeight: '700', fontSize: 12 },
  chipTextActive: { color: colors.primaryDark },
  dateRow: { flexDirection: 'row', gap: 8 },
  input: { flex: 1, backgroundColor: colors.surface, color: colors.text, borderRadius: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: colors.border },
  apply: { backgroundColor: colors.primary, borderRadius: 10, justifyContent: 'center', paddingHorizontal: 16 },
  applyText: { color: colors.primaryDark, fontWeight: '900' },
  list: { padding: 14, paddingBottom: 30, gap: 12 },
});
