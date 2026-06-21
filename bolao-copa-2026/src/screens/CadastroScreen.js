import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView,
  Platform, Alert, ScrollView,
} from 'react-native';
import { cadastrar } from '../services/api';

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleCadastro = async () => {
    if (!nome.trim() || !email.trim() || !senha || !confirmarSenha) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos.');
      return;
    }
    if (senha.length < 6) {
      Alert.alert('Senha fraca', 'A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Senhas diferentes', 'As senhas não coincidem.');
      return;
    }

    setCarregando(true);
    try {
      await cadastrar(nome.trim(), email.trim(), senha);
      Alert.alert(
        'Conta criada!',
        'Cadastro realizado com sucesso. Faça login para continuar.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (err) {
      console.log('status:', err.response?.status);
      console.log('data:', JSON.stringify(err.response?.data));
     console.log('message:', err.message);
     Alert.alert('Erro no cadastro', JSON.stringify(err.response?.data) || err.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>⚽ Bolão Copa 2026</Text>
        <Text style={styles.subtitulo}>Crie sua conta</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          placeholderTextColor="#6B7280"
          autoCapitalize="words"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#6B7280"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha (mín. 6 caracteres)"
          placeholderTextColor="#6B7280"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar senha"
          placeholderTextColor="#6B7280"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />

        <TouchableOpacity
          style={[styles.botao, carregando && styles.botaoDesabilitado]}
          onPress={handleCadastro}
          disabled={carregando}
        >
          {carregando
            ? <ActivityIndicator color="#0A1628" />
            : <Text style={styles.botaoTexto}>Criar conta</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Já tem conta? <Text style={styles.linkDestaque}>Entrar</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628' },
  inner: {
    flexGrow: 1, justifyContent: 'center',
    paddingHorizontal: 28, paddingVertical: 40, gap: 14,
  },
  titulo: {
    fontSize: 30, fontWeight: '800',
    color: '#F0C040', textAlign: 'center', marginBottom: 4,
  },
  subtitulo: {
    fontSize: 15, color: '#9CA3AF',
    textAlign: 'center', marginBottom: 20,
  },
  input: {
    backgroundColor: '#1A2740', color: '#F9FAFB',
    borderRadius: 10, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, borderWidth: 1, borderColor: '#2D3F5C',
  },
  botao: {
    backgroundColor: '#F0C040', borderRadius: 10,
    paddingVertical: 15, alignItems: 'center', marginTop: 6,
  },
  botaoDesabilitado: { opacity: 0.6 },
  botaoTexto: { color: '#0A1628', fontWeight: '700', fontSize: 16 },
  link: { color: '#9CA3AF', textAlign: 'center', marginTop: 8 },
  linkDestaque: { color: '#F0C040', fontWeight: '600' },
});
