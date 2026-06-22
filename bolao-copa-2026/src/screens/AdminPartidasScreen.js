import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { listarPartidas } from '../services/api';
import { excluirPartidaAdmin, salvarPartidaAdmin, salvarResultadoAdmin } from '../services/adminApi';
import PartidaCard from '../components/PartidaCard';
import ScreenState from '../components/ScreenState';
import { colors } from '../theme';

const vazio = { id: '', fase: 'Fase de Grupos', mandante: '', visitante: '', dataHora: '', estadio: '' };
export default function AdminPartidasScreen() {
  const [partidas, setPartidas] = useState([]);
  const [form, setForm] = useState(vazio);
  const [resultado, setResultado] = useState(null);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const carregar = useCallback(async () => {
    setError('');
    try { setPartidas((await listarPartidas()).data || []); } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, []);
  useFocusEffect(useCallback(() => { carregar(); }, [carregar]));
  const editar = (p) => { setForm({ ...p, id: String(p.id), dataHora: p.dataHora?.slice(0, 16) }); setModal(true); };
  const salvar = async () => {
    if (!form.mandante || !form.visitante || !form.dataHora || !form.estadio) return Alert.alert('Campos obrigatórios', 'Preencha todos os dados da partida.');
    try {
      await salvarPartidaAdmin(form);
      setModal(false); setForm(vazio); await carregar();
      Alert.alert('Pronto', 'Partida salva com sucesso.');
    } catch (err) { Alert.alert('Erro', err.message); }
  };
  const lancar = async () => {
    if (resultado.golsMandante === '' || resultado.golsVisitante === '') return;
    try {
      await salvarResultadoAdmin(resultado.id, Number(resultado.golsMandante), Number(resultado.golsVisitante));
      setResultado(null); await carregar(); Alert.alert('Resultado salvo', 'A pontuação dos palpites foi atualizada.');
    } catch (err) { Alert.alert('Erro', err.message); }
  };
  const excluir = (p) => Alert.alert('Excluir partida', `${p.mandante} × ${p.visitante}?`, [
    { text: 'Cancelar' }, { text: 'Excluir', style: 'destructive', onPress: async () => {
      try { await excluirPartidaAdmin(p.id); await carregar(); } catch (err) { Alert.alert('Erro', err.message); }
    }},
  ]);
  return <View style={styles.container}>
    <TouchableOpacity style={styles.add} onPress={() => { setForm(vazio); setModal(true); }}><Text style={styles.addText}>+ Nova partida</Text></TouchableOpacity>
    <ScreenState loading={loading} error={error} onRetry={carregar} />
    {!loading && !error && <FlatList data={partidas} keyExtractor={(i) => String(i.id)} contentContainerStyle={styles.list}
      renderItem={({ item }) => <View style={styles.item}><PartidaCard partida={item} />
        <View style={styles.actions}>
          <Action label="Placar" onPress={() => setResultado({ id: item.id, golsMandante: item.golsMandante == null ? '' : String(item.golsMandante), golsVisitante: item.golsVisitante == null ? '' : String(item.golsVisitante) })} />
          <Action label="Editar" onPress={() => editar(item)} />
          <Action label="Excluir" danger onPress={() => excluir(item)} />
        </View></View>} />}
    <Modal visible={modal} animationType="slide" onRequestClose={() => setModal(false)}>
      <ScrollView style={styles.modal} contentContainerStyle={styles.form}>
        <Text style={styles.title}>{form.id ? 'Editar partida' : 'Nova partida'}</Text>
        {['fase', 'mandante', 'visitante', 'dataHora', 'estadio'].map((campo) =>
          <TextInput key={campo} style={styles.input} placeholder={campo === 'dataHora' ? 'Data: 2026-06-25T18:00' : campo}
            placeholderTextColor={colors.muted} value={String(form[campo] || '')} onChangeText={(v) => setForm({ ...form, [campo]: v })} />)}
        <TouchableOpacity style={styles.save} onPress={salvar}><Text style={styles.saveText}>Salvar partida</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setModal(false)}><Text style={styles.cancel}>Cancelar</Text></TouchableOpacity>
      </ScrollView>
    </Modal>
    <Modal visible={!!resultado} transparent animationType="fade" onRequestClose={() => setResultado(null)}>
      <View style={styles.overlay}><View style={styles.resultBox}><Text style={styles.title}>Lançar resultado</Text>
        <View style={styles.scoreRow}><TextInput style={styles.scoreInput} keyboardType="number-pad" value={resultado?.golsMandante || ''} onChangeText={(v) => setResultado({ ...resultado, golsMandante: v })} />
          <Text style={styles.x}>×</Text><TextInput style={styles.scoreInput} keyboardType="number-pad" value={resultado?.golsVisitante || ''} onChangeText={(v) => setResultado({ ...resultado, golsVisitante: v })} /></View>
        <TouchableOpacity style={styles.save} onPress={lancar}><Text style={styles.saveText}>Confirmar resultado</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setResultado(null)}><Text style={styles.cancel}>Cancelar</Text></TouchableOpacity>
      </View></View>
    </Modal>
  </View>;
}
const Action = ({ label, onPress, danger }) => <TouchableOpacity style={[styles.action, danger && styles.danger]} onPress={onPress}><Text style={styles.actionText}>{label}</Text></TouchableOpacity>;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background }, list: { padding: 14, gap: 14, paddingBottom: 30 }, item: { gap: 8 },
  add: { margin: 14, marginBottom: 0, backgroundColor: colors.primary, borderRadius: 11, padding: 13, alignItems: 'center' }, addText: { fontWeight: '900', color: colors.primaryDark },
  actions: { flexDirection: 'row', gap: 8 }, action: { flex: 1, backgroundColor: colors.info, padding: 9, borderRadius: 8, alignItems: 'center' }, danger: { backgroundColor: colors.danger }, actionText: { color: '#fff', fontWeight: '800' },
  modal: { flex: 1, backgroundColor: colors.background }, form: { padding: 22, gap: 13, justifyContent: 'center', flexGrow: 1 },
  title: { color: colors.text, fontSize: 23, fontWeight: '900', textAlign: 'center' },
  input: { backgroundColor: colors.surface, color: colors.text, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 14 },
  save: { backgroundColor: colors.primary, padding: 14, borderRadius: 10, alignItems: 'center' }, saveText: { color: colors.primaryDark, fontWeight: '900' }, cancel: { color: colors.muted, textAlign: 'center', padding: 10 },
  overlay: { flex: 1, backgroundColor: '#0009', justifyContent: 'center', padding: 24 }, resultBox: { backgroundColor: colors.surface, padding: 20, borderRadius: 16, gap: 16 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }, scoreInput: { backgroundColor: colors.background, color: colors.text, width: 80, padding: 15, borderRadius: 12, textAlign: 'center', fontSize: 28, fontWeight: '900' }, x: { color: colors.muted, fontSize: 24 },
});
