import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { listarMeusPalpites } from '../services/api';
import { colors } from '../theme';
import PartidaCard from '../components/PartidaCard';
import ScreenState from '../components/ScreenState';

export default function MeusPalpitesScreen({ navigation }) {
  const [palpites, setPalpites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const carregar = useCallback(async (silencioso = false) => {
    if (!silencioso) setLoading(true);
    setError('');
    try { const { data } = await listarMeusPalpites(); setPalpites(data || []); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);
  useFocusEffect(useCallback(() => { carregar(); }, [carregar]));
  return (
    <View style={styles.container}>
      <ScreenState loading={loading} error={error} empty={!loading && !error && !palpites.length ? 'Você ainda não registrou palpites.' : ''} onRetry={carregar} />
      {!loading && !error && <FlatList data={palpites} keyExtractor={(item) => String(item.id)} contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); carregar(true); }} tintColor={colors.primary} />}
        renderItem={({ item }) => <PartidaCard partida={item.partida} palpite={item}
          onPress={() => navigation.navigate('DetalhesPartida', { partidaId: item.partida.id })} />} />}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: 14, paddingBottom: 30, gap: 12 },
});
