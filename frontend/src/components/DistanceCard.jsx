import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DistanceCard({ distance }) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{distance.toFixed(2)}</Text>
      <Text style={styles.label}>KM</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, backgroundColor: '#FFF', borderRadius: 20, padding: 24, marginHorizontal: 5, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  value: { fontSize: 32, fontWeight: '700', color: '#5856D6' },
  label: { fontSize: 14, color: '#8E8E93', fontWeight: '600', marginTop: 8 },
});
