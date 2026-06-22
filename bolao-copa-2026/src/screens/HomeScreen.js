import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { buscarMinhaPosicao, listarMeusPalpites, listarProximasPartidas } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';
import PartidaCard from '../components/PartidaCard';
import ScreenState from '../components/ScreenState';

export default function HomeScreen({ navigation }) {
  const { usuario } = useAuth();
  const [partidas, setPartidas] = useState([]);
  const [resumo, setResumo] = useState(null);
  const [palpites, setPalpites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const carregar = useCallback(async (silencioso = false) => {
    if (!silencioso) setLoading(true);
    setError('');
    try {
      const [proximas, posicao, meus] = await Promise.all([
        listarProximasPartidas(), buscarMinhaPosicao(), listarMeusPalpites(),
      ]);
      setPartidas(proximas.data || []);
      setResumo(posicao.data);
      setPalpites(meus.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { carregar(); }, [carregar]));
  const atualizar = () => { setRefreshing(true); carregar(true); };
  const palpiteDaPartida = (id) => palpites.find((item) => item.partida?.id === id);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={atualizar} tintColor={colors.primary} />}>
      <Text style={styles.hello}>Olá, {usuario?.nome?.split(' ')[0]} 👋</Text>
      <Text style={styles.subtitle}>Seus jogos e sua posição em um só lugar.</Text>
      <ScreenState loading={loading} error={error} onRetry={carregar} />
      {!loading && !error && (
        <>
          <View style={styles.summary}>
            <View><Text style={styles.summaryLabel}>Sua posição</Text><Text style={styles.summaryValue}>#{resumo?.posicao ?? '–'}</Text></View>
            <View><Text style={styles.summaryLabel}>Pontos</Text><Text style={styles.summaryValue}>{resumo?.pontuacaoTotal ?? 0}</Text></View>
            <View><Text style={styles.summaryLabel}>Placares exatos</Text><Text style={styles.summaryValue}>{resumo?.placaresExatos ?? 0}</Text></View>
          </View>
          <View style={styles.sectionTop}>
            <Text style={styles.sectionTitle}>Próximas partidas</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PartidasTab')}><Text style={styles.link}>Ver todas</Text></TouchableOpacity>
          </View>
          {partidas.length === 0
            ? <Text style={styles.empty}>Nenhuma partida aberta no momento.</Text>
            : partidas.map((partida) => (
              <PartidaCard key={partida.id} partida={partida} palpite={palpiteDaPartida(partida.id)}
                onPress={() => navigation.navigate('PartidasTab', { screen: 'DetalhesPartida', params: { partidaId: partida.id } })} />
            ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 18, paddingBottom: 36, gap: 14 },
  hello: { color: colors.text, fontSize: 27, fontWeight: '900', marginTop: 8 },
  subtitle: { color: colors.muted, marginTop: -8 },
  summary: { backgroundColor: colors.primary, borderRadius: 18, padding: 18, flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { color: '#4B3B05', fontSize: 11, fontWeight: '700' },
  summaryValue: { color: colors.primaryDark, fontSize: 24, fontWeight: '900', marginTop: 4 },
  sectionTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  sectionTitle: { color: colors.text, fontSize: 19, fontWeight: '900' },
  link: { color: colors.primary, fontWeight: '800' },
  empty: { color: colors.muted, textAlign: 'center', padding: 30 },
});
