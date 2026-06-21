import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { login } from "../services/api";

export default function LoginScreen({ navigation }) {
  const { salvarSessao } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert("Campos obrigatórios", "Preencha e-mail e senha.");
      return;
    }

    setCarregando(true);
    try {
      const { data } = await login(email.trim(), senha);
      salvarSessao({
        id: data.id,
        nome: data.nome,
        perfil: data.perfil,
        token: data.token,
      });
      // Navigator auto-switches to AppStack on session save
    } catch (err) {
      const msg = err.response?.data?.message || "E-mail ou senha inválidos.";
      Alert.alert("Erro ao entrar", msg);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.inner}>
        <Text style={styles.titulo}>⚽ Bolão Copa 2026</Text>
        <Text style={styles.subtitulo}>Entre na sua conta</Text>

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
          placeholder="Senha"
          placeholderTextColor="#6B7280"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
        <TouchableOpacity
          onPress={async () => {
            try {
              const r = await fetch(
                "http://192.168.18.6:8082/api/autenticacao/cadastro",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    nome: "Teste",
                    email: "teste@teste.com",
                    senha: "123456",
                  }),
                },
              );
              Alert.alert("status", String(r.status));
            } catch (e) {
              Alert.alert("erro", e.message);
            }
          }}
        >
          <Text style={{ color: "white", marginTop: 20 }}>testar conexão</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botao, carregando && styles.botaoDesabilitado]}
          onPress={handleLogin}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="#0A1628" />
          ) : (
            <Text style={styles.botaoTexto}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
          <Text style={styles.link}>
            Não tem conta? <Text style={styles.linkDestaque}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A1628" },
  inner: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 14,
  },
  titulo: {
    fontSize: 30,
    fontWeight: "800",
    color: "#F0C040",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 15,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#1A2740",
    color: "#F9FAFB",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#2D3F5C",
  },
  botao: {
    backgroundColor: "#F0C040",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 6,
  },
  botaoDesabilitado: { opacity: 0.6 },
  botaoTexto: { color: "#0A1628", fontWeight: "700", fontSize: 16 },
  link: { color: "#9CA3AF", textAlign: "center", marginTop: 8 },
  linkDestaque: { color: "#F0C040", fontWeight: "600" },
});
