import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { listarSelecoes } from '../services/api';
import { excluirSelecaoAdmin, salvarSelecaoAdmin } from '../services/adminApi';
import ScreenState from '../components/ScreenState';
import { colors } from '../theme';

const vazio = { id: '', nome: '', codigoFifa: '', urlBandeira: '', grupo: '' };
export default function AdminSelecoesScreen() {
  const [itens, setItens] = useState([]); const [form, setForm] = useState(vazio);
  const [modal, setModal] = useState(false); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const carregar = useCallback(async () => { try { setItens((await listarSelecoes()).data || []); setError(''); } catch (e) { setError(e.message); } finally { setLoading(false); } }, []);
  useFocusEffect(useCallback(() => { carregar(); }, [carregar]));
  const salvar = async () => {
    if (!form.nome || form.codigoFifa.length !== 3) return Alert.alert('Dados inválidos', 'Informe o nome e um código FIFA de três letras.');
    try { await salvarSelecaoAdmin({ ...form, codigoFifa: form.codigoFifa.toUpperCase() }); setModal(false); await carregar(); }
    catch (e) { Alert.alert('Erro', e.message); }
  };
  const excluir = (item) => Alert.alert('Excluir seleção', item.nome, [{ text: 'Cancelar' }, { text: 'Excluir', style: 'destructive', onPress: async () => {
    try { await excluirSelecaoAdmin(item.id); await carregar(); } catch (e) { Alert.alert('Erro', e.message); }
  }}]);
  return <View style={styles.container}>
    <TouchableOpacity style={styles.add} onPress={() => { setForm(vazio); setModal(true); }}><Text style={styles.addText}>+ Nova seleção</Text></TouchableOpacity>
    <ScreenState loading={loading} error={error} onRetry={carregar} />
    {!loading && !error && <FlatList data={itens} keyExtractor={(i) => String(i.id)} contentContainerStyle={styles.list}
      renderItem={({ item }) => <View style={styles.row}>
        {item.urlBandeira ? <Image source={{ uri: item.urlBandeira }} style={styles.flag} /> : <View style={styles.flag} />}
        <View style={styles.info}><Text style={styles.name}>{item.nome}</Text><Text style={styles.meta}>{item.codigoFifa} · Grupo {item.grupo || '–'}</Text></View>
        <TouchableOpacity onPress={() => { setForm({ ...item, id: String(item.id) }); setModal(true); }}><Text style={styles.edit}>Editar</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => excluir(item)}><Text style={styles.delete}>Excluir</Text></TouchableOpacity>
      </View>} />}
    <Modal visible={modal} animationType="slide" onRequestClose={() => setModal(false)}>
      <View style={styles.modal}><Text style={styles.title}>{form.id ? 'Editar seleção' : 'Nova seleção'}</Text>
        {['nome', 'codigoFifa', 'urlBandeira', 'grupo'].map((campo) => <TextInput key={campo} style={styles.input} placeholder={campo} placeholderTextColor={colors.muted}
          autoCapitalize={campo === 'codigoFifa' || campo === 'grupo' ? 'characters' : 'sentences'} value={form[campo] || ''} onChangeText={(v) => setForm({ ...form, [campo]: v })} />)}
        <TouchableOpacity style={styles.add} onPress={salvar}><Text style={styles.addText}>Salvar seleção</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setModal(false)}><Text style={styles.cancel}>Cancelar</Text></TouchableOpacity>
      </View>
    </Modal>
  </View>;
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background }, add: { margin: 14, backgroundColor: colors.primary, padding: 13, borderRadius: 10, alignItems: 'center' }, addText: { color: colors.primaryDark, fontWeight: '900' },
  list: { padding: 14, gap: 9 }, row: { backgroundColor: colors.surface, borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  flag: { width: 38, height: 28, borderRadius: 4, backgroundColor: colors.surfaceAlt }, info: { flex: 1 }, name: { color: colors.text, fontWeight: '800' }, meta: { color: colors.muted, fontSize: 12 },
  edit: { color: colors.info, fontWeight: '800' }, delete: { color: colors.danger, fontWeight: '800' },
  modal: { flex: 1, backgroundColor: colors.background, padding: 24, justifyContent: 'center', gap: 13 }, title: { color: colors.text, fontSize: 24, fontWeight: '900', textAlign: 'center' },
  input: { backgroundColor: colors.surface, color: colors.text, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 14 }, cancel: { color: colors.muted, textAlign: 'center' },
});
