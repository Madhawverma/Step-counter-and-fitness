import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';

export default function ActivityCard({ type, duration, steps, calories }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.type}>{type}</Text>
        <Text style={styles.duration}>{duration} min</Text>
      </View>
      <View style={styles.stats}>
        <Text style={styles.stat}>{steps} Steps</Text>
        <Text style={styles.stat}>{calories} kcal</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  type: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  duration: { fontSize: 16, color: colors.textSecondary },
  stats: { flexDirection: 'row', justifyContent: 'space-between' },
  stat: { fontSize: 14, color: colors.primary, fontWeight: '600' }
});