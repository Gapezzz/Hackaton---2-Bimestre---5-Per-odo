import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PlaceholderScreen({ route }) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🚧</Text>
      <Text style={styles.texto}>{route.name} em construção</Text>
      <Text style={styles.sub}>Este módulo será implementado em breve.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#0A1628',
    alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  emoji: { fontSize: 48 },
  texto: { fontSize: 18, fontWeight: '700', color: '#F9FAFB' },
  sub: { fontSize: 13, color: '#6B7280' },
});
