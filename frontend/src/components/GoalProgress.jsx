import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';

export default function GoalProgress({ steps, goal }) {
  const pct = Math.min((steps / goal) * 100, 100).toFixed(1);
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Daily Goal</Text>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${pct}%` }]} />
      </View>
      <View style={styles.footer}>
        <Text style={styles.text}>{steps} / {goal} steps</Text>
        <Text style={styles.text}>{pct}% completed</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: 20, padding: 20, marginVertical: 10, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  title: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 15 },
  barBackground: { height: 12, backgroundColor: colors.background, borderRadius: 6, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 6 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  text: { fontSize: 14, color: colors.textSecondary }
});