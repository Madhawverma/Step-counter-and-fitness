import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';

export default function StatCard({ label, value, unit }) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label} {unit ? `(${unit})` : ''}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { flex: 1, backgroundColor: colors.card, borderRadius: 16, padding: 16, margin: 4, alignItems: 'center', elevation: 2 },
  value: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  label: { fontSize: 12, color: colors.textSecondary, marginTop: 4, textTransform: 'uppercase' }
});