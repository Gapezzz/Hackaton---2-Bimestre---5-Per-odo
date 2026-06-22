import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { buscarPartida, listarMeusPalpites } from '../services/api';
import PartidaCard from '../components/PartidaCard';
import ScreenState from '../components/ScreenState';
import { colors } from '../theme';
import { partidaIniciou } from '../utils/partidas';

export default function DetalhesPartidaScreen({ route, navigation }) {
  const { partidaId } = route.params;
  const [partida, setPartida] = useState(null);
  const [palpite, setPalpite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const carregar = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [detalhe, meus] = await Promise.all([buscarPartida(partidaId), listarMeusPalpites()]);
      setPartida(detalhe.data);
      setPalpite((meus.data || []).find((item) => item.partida?.id === partidaId) || null);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [partidaId]);
  useFocusEffect(useCallback(() => { carregar(); }, [carregar]));
  const bloqueada = partida ? partidaIniciou(partida) : true;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenState loading={loading} error={error} onRetry={carregar} />
      {partida && !loading && (
        <>
          <PartidaCard partida={partida} palpite={palpite} />
          <View style={styles.info}>
            <Text style={styles.title}>Informações da partida</Text>
            <Text style={styles.line}>Estádio: <Text style={styles.value}>{partida.estadio}</Text></Text>
            <Text style={styles.line}>Fase: <Text style={styles.value}>{partida.fase}</Text></Text>
            <Text style={styles.line}>Palpite: <Text style={styles.value}>{palpite ? `${palpite.golsMandanteAposta} × ${palpite.golsVisitanteAposta}` : 'Ainda não registrado'}</Text></Text>
          </View>
          <TouchableOpacity disabled={bloqueada} style={[styles.button, bloqueada && styles.disabled]}
            onPress={() => navigation.navigate('RegistrarPalpite', { partida, palpite })}>
            <Text style={styles.buttonText}>{bloqueada ? 'Palpites bloqueados' : palpite ? 'Editar palpite' : 'Registrar palpite'}</Text>
          </TouchableOpacity>
          {bloqueada && <Text style={styles.warning}>A partida já iniciou. O palpite não pode mais ser criado ou alterado.</Text>}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 18, gap: 16 },
  info: { backgroundColor: colors.surface, padding: 17, borderRadius: 16, gap: 10, borderWidth: 1, borderColor: colors.border },
  title: { color: colors.text, fontWeight: '900', fontSize: 17, marginBottom: 4 },
  line: { color: colors.muted }, value: { color: colors.text, fontWeight: '700' },
  button: { backgroundColor: colors.primary, borderRadius: 12, padding: 15, alignItems: 'center' },
  disabled: { opacity: 0.45 }, buttonText: { color: colors.primaryDark, fontWeight: '900', fontSize: 16 },
  warning: { color: colors.danger, textAlign: 'center', lineHeight: 19 },
});
