import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';

export default function ActiveTimeCard({ minutes }) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{hrs}h {mins}m</Text>
      <Text style={styles.label}>ACTIVE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, backgroundColor: colors.card, borderRadius: 20, padding: 24, marginHorizontal: 5, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  value: { fontSize: 32, fontWeight: '700', color: colors.success },
  label: { fontSize: 14, color: colors.textSecondary, fontWeight: '600', marginTop: 8 },
});