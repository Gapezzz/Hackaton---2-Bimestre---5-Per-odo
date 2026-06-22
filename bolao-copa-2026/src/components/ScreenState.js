import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme';

export default function ScreenState({ loading, error, empty, onRetry }) {
  if (loading) return <View style={styles.box}><ActivityIndicator color={colors.primary} size="large" /></View>;
  if (error) {
    return (
      <View style={styles.box}>
        <Text style={styles.title}>Não foi possível carregar</Text>
        <Text style={styles.text}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={onRetry}>
          <Text style={styles.buttonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (empty) return <View style={styles.box}><Text style={styles.text}>{empty}</Text></View>;
  return null;
}

const styles = StyleSheet.create({
  box: { flex: 1, minHeight: 240, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 12 },
  title: { color: colors.text, fontWeight: '800', fontSize: 17 },
  text: { color: colors.muted, textAlign: 'center', lineHeight: 20 },
  button: { backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 11 },
  buttonText: { color: colors.primaryDark, fontWeight: '800' },
});
