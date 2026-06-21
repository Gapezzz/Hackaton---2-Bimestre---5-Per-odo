import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { editarPerfil, excluirConta, logout } from '../services/api';

export default function PerfilScreen() {
  const { usuario, salvarSessao, encerrarSessao } = useAuth();
  const [nome, setNome] = useState(usuario?.nome || '');
  const [fotoUrl, setFotoUrl] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);

  const handleSalvar = async () => {
    if (!nome.trim()) {
      Alert.alert('Campo obrigatório', 'O nome não pode ficar vazio.');
      return;
    }
    setSalvando(true);
    try {
      await editarPerfil(nome.trim(), fotoUrl.trim() || null);
      salvarSessao({ ...usuario, nome: nome.trim() });
      setModoEdicao(false);
      Alert.alert('Salvo!', 'Perfil atualizado com sucesso.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Não foi possível salvar.';
      Alert.alert('Erro', msg);
    } finally {
      setSalvando(false);
    }
  };

  const handleLogout = async () => {
    try { await logout(); } catch (_) {}
    encerrarSessao();
  };

  const handleExcluirConta = () => {
    Alert.alert(
      'Excluir conta',
      'Esta ação é permanente e não pode ser desfeita. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir', style: 'destructive',
          onPress: async () => {
            try {
              await excluirConta();
              encerrarSessao();
            } catch (err) {
              Alert.alert('Erro', 'Não foi possível excluir a conta.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      {/* Avatar placeholder */}
      <View style={styles.avatar}>
        <Text style={styles.avatarLetra}>
          {usuario?.nome?.[0]?.toUpperCase() || '?'}
        </Text>
      </View>

      {!modoEdicao ? (
        <>
          <Text style={styles.nomeLabel}>{usuario?.nome}</Text>
          <Text style={styles.perfilBadge}>{usuario?.perfil === 'ADMIN' ? '🛡 Admin' : '👤 Usuário'}</Text>

          <TouchableOpacity style={styles.botao} onPress={() => setModoEdicao(true)}>
            <Text style={styles.botaoTexto}>Editar perfil</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
            placeholderTextColor="#6B7280"
          />

          <Text style={styles.label}>URL da foto (opcional)</Text>
          <TextInput
            style={styles.input}
            value={fotoUrl}
            onChangeText={setFotoUrl}
            placeholder="https://..."
            placeholderTextColor="#6B7280"
            autoCapitalize="none"
            keyboardType="url"
          />

          <View style={styles.rowBotoes}>
            <TouchableOpacity
              style={[styles.botao, styles.botaoSecundario, { flex: 1 }]}
              onPress={() => { setModoEdicao(false); setNome(usuario?.nome || ''); }}
            >
              <Text style={[styles.botaoTexto, { color: '#9CA3AF' }]}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botao, { flex: 1 }, salvando && styles.botaoDesabilitado]}
              onPress={handleSalvar}
              disabled={salvando}
            >
              {salvando
                ? <ActivityIndicator color="#0A1628" />
                : <Text style={styles.botaoTexto}>Salvar</Text>
              }
            </TouchableOpacity>
          </View>
        </>
      )}

      <View style={styles.divisor} />

      <TouchableOpacity style={styles.botaoLogout} onPress={handleLogout}>
        <Text style={styles.botaoLogoutTexto}>Sair da conta</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleExcluirConta}>
        <Text style={styles.linkPerigo}>Excluir minha conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628' },
  inner: {
    alignItems: 'center', paddingHorizontal: 28,
    paddingTop: 40, paddingBottom: 60, gap: 14,
  },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#F0C040', alignItems: 'center',
    justifyContent: 'center', marginBottom: 8,
  },
  avatarLetra: { fontSize: 38, fontWeight: '800', color: '#0A1628' },
  nomeLabel: { fontSize: 22, fontWeight: '700', color: '#F9FAFB' },
  perfilBadge: { fontSize: 13, color: '#9CA3AF', marginBottom: 8 },
  label: { alignSelf: 'flex-start', color: '#9CA3AF', fontSize: 13, marginBottom: -6 },
  input: {
    width: '100%', backgroundColor: '#1A2740', color: '#F9FAFB',
    borderRadius: 10, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, borderWidth: 1, borderColor: '#2D3F5C',
  },
  rowBotoes: { flexDirection: 'row', gap: 12, width: '100%' },
  botao: {
    backgroundColor: '#F0C040', borderRadius: 10,
    paddingVertical: 14, alignItems: 'center', width: '100%',
  },
  botaoSecundario: { backgroundColor: '#1A2740', borderWidth: 1, borderColor: '#2D3F5C' },
  botaoDesabilitado: { opacity: 0.6 },
  botaoTexto: { color: '#0A1628', fontWeight: '700', fontSize: 15 },
  divisor: { width: '100%', height: 1, backgroundColor: '#1A2740', marginVertical: 8 },
  botaoLogout: {
    width: '100%', borderRadius: 10, paddingVertical: 14,
    alignItems: 'center', borderWidth: 1, borderColor: '#2D3F5C',
    backgroundColor: '#1A2740',
  },
  botaoLogoutTexto: { color: '#F9FAFB', fontWeight: '600', fontSize: 15 },
  linkPerigo: { color: '#EF4444', fontSize: 13, marginTop: 4 },
});
