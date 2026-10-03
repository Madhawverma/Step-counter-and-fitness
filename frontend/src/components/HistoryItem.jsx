import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';

export default function HistoryItem({ item }) {
  return (
    <View style={styles.card}>
      <Text style={styles.date}>{item.date}</Text>
      <View style={styles.row}>
        <Text style={styles.stat}>{item.steps} Steps</Text>
        <Text style={styles.stat}>{item.calories.toFixed(0)} kcal</Text>
        <Text style={styles.stat}>{item.distance.toFixed(2)} km</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, padding: 16, borderRadius: 12, marginBottom: 10, elevation: 1 },
  date: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  stat: { fontSize: 14, color: colors.primary, fontWeight: '500' }
});