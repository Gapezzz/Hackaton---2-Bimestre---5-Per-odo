import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { alternarStatusUsuario, criarUsuarioAdmin, editarUsuarioAdmin, excluirUsuarioAdmin, listarUsuariosAdmin } from '../services/adminApi';
import ScreenState from '../components/ScreenState';
import { colors } from '../theme';

const vazio = { id: '', nome: '', email: '', senha: '', perfil: 'USER' };
export default function AdminUsuariosScreen() {
  const [itens, setItens] = useState([]); const [form, setForm] = useState(vazio);
  const [modal, setModal] = useState(false); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const carregar = useCallback(async () => { try { setItens(await listarUsuariosAdmin()); setError(''); } catch (e) { setError(e.message); } finally { setLoading(false); } }, []);
  useFocusEffect(useCallback(() => { carregar(); }, [carregar]));
  const salvar = async () => {
    if (!form.nome || !form.email || (!form.id && form.senha.length < 6)) return Alert.alert('Dados inválidos', 'Preencha os campos; a senha deve ter ao menos seis caracteres.');
    try {
      if (form.id) await editarUsuarioAdmin(form.id, { nome: form.nome, email: form.email, perfil: form.perfil });
      else await criarUsuarioAdmin(form);
      setModal(false); await carregar();
    } catch (e) { Alert.alert('Erro', e.message); }
  };
  const executar = async (acao, id) => { try { await acao(id); await carregar(); } catch (e) { Alert.alert('Erro', e.message); } };
  const excluir = (u) => Alert.alert('Excluir usuário', `Excluir ${u.nome} permanentemente?`, [{ text: 'Cancelar' }, { text: 'Excluir', style: 'destructive', onPress: () => executar(excluirUsuarioAdmin, u.id) }]);
  return <View style={styles.container}>
    <TouchableOpacity style={styles.add} onPress={() => { setForm(vazio); setModal(true); }}><Text style={styles.addText}>+ Novo usuário</Text></TouchableOpacity>
    <ScreenState loading={loading} error={error} empty={!loading && !error && !itens.length ? 'Nenhum usuário encontrado.' : ''} onRetry={carregar} />
    {!loading && !error && <FlatList data={itens} keyExtractor={(i) => String(i.id)} contentContainerStyle={styles.list}
      renderItem={({ item }) => <View style={styles.card}>
        <View style={styles.top}><View style={styles.avatar}><Text style={styles.avatarText}>{item.nome?.[0]}</Text></View>
          <View style={styles.info}><Text style={styles.name}>{item.nome}</Text><Text style={styles.email}>{item.email}</Text>
            <Text style={[styles.status, { color: item.ativo ? colors.success : colors.danger }]}>{item.perfil} · {item.ativo ? 'Ativo' : 'Bloqueado'}</Text></View></View>
        <View style={styles.actions}>
          <Action label="Editar" onPress={() => { setForm({ ...item, id: String(item.id), senha: '' }); setModal(true); }} />
          <Action label={item.ativo ? 'Bloquear' : 'Ativar'} onPress={() => executar(alternarStatusUsuario, item.id)} />
          <Action label="Excluir" danger onPress={() => excluir(item)} />
        </View>
      </View>} />}
    <Modal visible={modal} animationType="slide" onRequestClose={() => setModal(false)}>
      <View style={styles.modal}><Text style={styles.title}>{form.id ? 'Editar usuário' : 'Novo usuário'}</Text>
        <TextInput style={styles.input} placeholder="Nome" placeholderTextColor={colors.muted} value={form.nome} onChangeText={(v) => setForm({ ...form, nome: v })} />
        <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor={colors.muted} autoCapitalize="none" keyboardType="email-address" value={form.email} onChangeText={(v) => setForm({ ...form, email: v })} />
        {!form.id && <TextInput style={styles.input} placeholder="Senha inicial" placeholderTextColor={colors.muted} secureTextEntry value={form.senha} onChangeText={(v) => setForm({ ...form, senha: v })} />}
        <Text style={styles.label}>Perfil</Text><View style={styles.profileRow}>
          {['USER', 'ADMIN'].map((p) => <TouchableOpacity key={p} style={[styles.profile, form.perfil === p && styles.profileActive]} onPress={() => setForm({ ...form, perfil: p })}><Text style={[styles.profileText, form.perfil === p && styles.profileTextActive]}>{p}</Text></TouchableOpacity>)}
        </View>
        <TouchableOpacity style={styles.add} onPress={salvar}><Text style={styles.addText}>Salvar usuário</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setModal(false)}><Text style={styles.cancel}>Cancelar</Text></TouchableOpacity>
      </View>
    </Modal>
  </View>;
}
const Action = ({ label, onPress, danger }) => <TouchableOpacity style={[styles.action, danger && styles.danger]} onPress={onPress}><Text style={styles.actionText}>{label}</Text></TouchableOpacity>;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background }, add: { margin: 14, backgroundColor: colors.primary, padding: 13, borderRadius: 10, alignItems: 'center' }, addText: { color: colors.primaryDark, fontWeight: '900' },
  list: { padding: 14, gap: 10 }, card: { backgroundColor: colors.surface, borderRadius: 14, padding: 14, gap: 12 }, top: { flexDirection: 'row', gap: 11 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' }, avatarText: { color: colors.primary, fontWeight: '900', fontSize: 18 },
  info: { flex: 1 }, name: { color: colors.text, fontWeight: '900' }, email: { color: colors.muted, fontSize: 12 }, status: { fontSize: 11, fontWeight: '800', marginTop: 3 },
  actions: { flexDirection: 'row', gap: 7 }, action: { flex: 1, backgroundColor: colors.info, padding: 8, borderRadius: 8, alignItems: 'center' }, danger: { backgroundColor: colors.danger }, actionText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  modal: { flex: 1, backgroundColor: colors.background, padding: 24, justifyContent: 'center', gap: 13 }, title: { color: colors.text, fontSize: 24, fontWeight: '900', textAlign: 'center' },
  input: { backgroundColor: colors.surface, color: colors.text, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 14 }, label: { color: colors.muted, fontWeight: '800' },
  profileRow: { flexDirection: 'row', gap: 10 }, profile: { flex: 1, borderWidth: 1, borderColor: colors.border, padding: 12, borderRadius: 9, alignItems: 'center' }, profileActive: { backgroundColor: colors.primary }, profileText: { color: colors.muted, fontWeight: '900' }, profileTextActive: { color: colors.primaryDark }, cancel: { color: colors.muted, textAlign: 'center' },
});
