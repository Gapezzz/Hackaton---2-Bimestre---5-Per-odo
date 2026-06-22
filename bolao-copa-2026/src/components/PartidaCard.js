import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme';
import { formatarData, placarReal, statusDaPartida } from '../utils/partidas';

const Team = ({ nome, foto }) => (
  <View style={styles.team}>
    {foto ? <Image source={{ uri: foto }} style={styles.flag} /> : <View style={styles.flagFallback}><Text>⚽</Text></View>}
    <Text style={styles.teamName} numberOfLines={1}>{nome}</Text>
  </View>
);

export default function PartidaCard({ partida, onPress, palpite }) {
  const status = statusDaPartida(partida);
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.top}>
        <Text style={styles.phase}>{partida.fase}</Text>
        <Text style={[styles.status, styles[status.tone]]}>{status.label}</Text>
      </View>
      <Text style={styles.date}>{formatarData(partida.dataHora)} · {partida.estadio}</Text>
      <View style={styles.match}>
        <Team nome={partida.mandante} foto={partida.fotoMandante} />
        <Text style={styles.score}>{placarReal(partida)}</Text>
        <Team nome={partida.visitante} foto={partida.fotoVisitante} />
      </View>
      {palpite && (
        <View style={styles.guess}>
          <Text style={styles.guessText}>Seu palpite: {palpite.golsMandanteAposta} × {palpite.golsVisitanteAposta}</Text>
          <Text style={styles.points}>{palpite.pontuacaoObtida ?? 0} pts</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, gap: 10 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  phase: { color: colors.primary, fontWeight: '800', fontSize: 12, textTransform: 'uppercase' },
  status: { fontSize: 11, fontWeight: '800' },
  success: { color: colors.success }, danger: { color: colors.danger }, info: { color: colors.info },
  date: { color: colors.muted, fontSize: 12 },
  match: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  team: { flex: 1, alignItems: 'center', gap: 7 },
  flag: { width: 38, height: 38, borderRadius: 19 },
  flagFallback: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  teamName: { color: colors.text, fontWeight: '700', textAlign: 'center', maxWidth: 110 },
  score: { color: colors.text, fontSize: 19, fontWeight: '900' },
  guess: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between' },
  guessText: { color: colors.muted, fontWeight: '600' },
  points: { color: colors.primary, fontWeight: '900' },
});
