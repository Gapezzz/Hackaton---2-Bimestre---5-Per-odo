import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { salvarPalpite } from '../services/api';
import { colors } from '../theme';
import { formatarData, partidaIniciou } from '../utils/partidas';

export default function RegistrarPalpiteScreen({ route, navigation }) {
  const { partida, palpite } = route.params;
  const [mandante, setMandante] = useState(palpite ? String(palpite.golsMandanteAposta) : '');
  const [visitante, setVisitante] = useState(palpite ? String(palpite.golsVisitanteAposta) : '');
  const [salvando, setSalvando] = useState(false);

  const enviar = async () => {
    if (partidaIniciou(partida)) {
      Alert.alert('Palpite bloqueado', 'A partida já iniciou e não aceita alterações.');
      return;
    }
    const golsM = Number(mandante);
    const golsV = Number(visitante);
    if (!Number.isInteger(golsM) || !Number.isInteger(golsV) || golsM < 0 || golsV < 0) {
      Alert.alert('Placar inválido', 'Informe números inteiros iguais ou maiores que zero.');
      return;
    }
    setSalvando(true);
    try {
      await salvarPalpite(partida.id, golsM, golsV);
      Alert.alert('Palpite salvo!', 'A lista será atualizada com o novo placar.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      const bloqueio = err.response?.status === 422;
      Alert.alert(bloqueio ? 'Partida iniciada' : 'Não foi possível salvar', err.message);
    } finally { setSalvando(false); }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.content}>
        <Text style={styles.phase}>{partida.fase} · {formatarData(partida.dataHora)}</Text>
        <Text style={styles.title}>Qual será o placar?</Text>
        <View style={styles.teams}>
          <View style={styles.team}><Text style={styles.teamName}>{partida.mandante}</Text>
            <TextInput style={styles.input} value={mandante} onChangeText={setMandante} keyboardType="number-pad" maxLength={2} placeholder="0" placeholderTextColor={colors.muted} /></View>
          <Text style={styles.x}>×</Text>
          <View style={styles.team}><Text style={styles.teamName}>{partida.visitante}</Text>
            <TextInput style={styles.input} value={visitante} onChangeText={setVisitante} keyboardType="number-pad" maxLength={2} placeholder="0" placeholderTextColor={colors.muted} /></View>
        </View>
        <Text style={styles.rule}>Você pode editar este palpite até o horário de início da partida.</Text>
        <TouchableOpacity style={[styles.button, salvando && styles.disabled]} onPress={enviar} disabled={salvando}>
          <Text style={styles.buttonText}>{salvando ? 'Salvando...' : palpite ? 'Atualizar palpite' : 'Confirmar palpite'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, justifyContent: 'center', padding: 24, gap: 24 },
  phase: { color: colors.primary, fontWeight: '800', textAlign: 'center' },
  title: { color: colors.text, fontWeight: '900', fontSize: 27, textAlign: 'center' },
  teams: { flexDirection: 'row', alignItems: 'flex-end', gap: 14 },
  team: { flex: 1, gap: 12 }, teamName: { color: colors.text, textAlign: 'center', fontWeight: '800', minHeight: 40 },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 16, color: colors.text, textAlign: 'center', fontSize: 36, fontWeight: '900', paddingVertical: 16 },
  x: { color: colors.muted, fontSize: 28, paddingBottom: 20 },
  rule: { color: colors.muted, textAlign: 'center', lineHeight: 20 },
  button: { backgroundColor: colors.primary, borderRadius: 12, padding: 16, alignItems: 'center' },
  disabled: { opacity: 0.6 }, buttonText: { color: colors.primaryDark, fontWeight: '900', fontSize: 16 },
});
