import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { buscarMinhaPosicao, listarRanking } from '../services/api';
import { colors } from '../theme';
import ScreenState from '../components/ScreenState';

export default function RankingScreen() {
  const [itens, setItens] = useState([]);
  const [minhaPosicao, setMinhaPosicao] = useState(null);
  const [pagina, setPagina] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mais, setMais] = useState(true);
  const [error, setError] = useState('');

  const carregar = useCallback(async (paginaAlvo = 0, anexar = false) => {
    if (!anexar && !refreshing) setLoading(true);
    setError('');
    try {
      const [ranking, posicao] = await Promise.all([listarRanking(paginaAlvo, 50), buscarMinhaPosicao()]);
      const novos = ranking.data || [];
      setItens((atuais) => anexar ? [...atuais, ...novos] : novos);
      setMinhaPosicao(posicao.data);
      setPagina(paginaAlvo);
      setMais(novos.length === 50);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); setRefreshing(false); }
  }, [refreshing]);

  useFocusEffect(useCallback(() => { carregar(0); }, []));
  const atualizar = () => { setRefreshing(true); carregar(0); };
  return (
    <View style={styles.container}>
      {minhaPosicao && <View style={styles.mine}>
        <Text style={styles.mineLabel}>Sua posição</Text>
        <Text style={styles.minePosition}>#{minhaPosicao.posicao}</Text>
        <Text style={styles.minePoints}>{minhaPosicao.pontuacaoTotal} pontos · {minhaPosicao.placaresExatos} placares exatos</Text>
      </View>}
      <ScreenState loading={loading} error={error} empty={!loading && !error && !itens.length ? 'O ranking ainda está vazio.' : ''} onRetry={() => carregar(0)} />
      {!loading && !error && <FlatList data={itens} keyExtractor={(item) => String(item.usuarioId)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={atualizar} tintColor={colors.primary} />}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <View style={[styles.row, item.euSou && styles.rowMine]}>
          <Text style={styles.position}>#{item.posicao}</Text>
          <View style={styles.avatar}><Text style={styles.avatarText}>{item.nome?.[0]?.toUpperCase()}</Text></View>
          <View style={styles.person}><Text style={styles.name}>{item.nome}{item.euSou ? ' (você)' : ''}</Text><Text style={styles.exact}>{item.quantidadePlacaresExatos} placares exatos</Text></View>
          <Text style={styles.points}>{item.pontuacaoTotal}</Text>
        </View>}
        ListFooterComponent={mais ? <TouchableOpacity style={styles.more} onPress={() => carregar(pagina + 1, true)}><Text style={styles.moreText}>Carregar mais 50</Text></TouchableOpacity> : null} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  mine: { backgroundColor: colors.primary, margin: 14, padding: 16, borderRadius: 16 },
  mineLabel: { color: '#4B3B05', fontWeight: '800', fontSize: 12 }, minePosition: { color: colors.primaryDark, fontWeight: '900', fontSize: 28 },
  minePoints: { color: '#4B3B05', fontWeight: '700' },
  list: { paddingHorizontal: 14, paddingBottom: 30, gap: 8 },
  row: { backgroundColor: colors.surface, borderRadius: 13, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: colors.border },
  rowMine: { borderColor: colors.primary, backgroundColor: '#26334A' },
  position: { color: colors.primary, width: 38, fontWeight: '900' },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.text, fontWeight: '900' }, person: { flex: 1 },
  name: { color: colors.text, fontWeight: '800' }, exact: { color: colors.muted, fontSize: 11, marginTop: 2 },
  points: { color: colors.primary, fontSize: 18, fontWeight: '900' },
  more: { alignItems: 'center', padding: 18 }, moreText: { color: colors.primary, fontWeight: '800' },
});
