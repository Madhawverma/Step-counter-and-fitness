import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';

export default function WeeklyChart({ data }) {
  if (!data || data.length === 0) return null;
  const maxSteps = Math.max(...data.map(d => d.steps), 1);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Overview</Text>
      <View style={styles.chart}>
        {data.slice(0, 7).map((item, i) => {
          const heightPct = (item.steps / maxSteps) * 100;
          return (
            <View key={i} style={styles.barCol}>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { height: `${heightPct}%` }]} />
              </View>
              <Text style={styles.day}>{new Date(item.date).toLocaleDateString('en-US', {weekday:'short'})}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { backgroundColor: colors.card, padding: 20, borderRadius: 20, marginVertical: 10, elevation: 3 },
  title: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 20 },
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 150 },
  barCol: { alignItems: 'center' },
  barBg: { width: 24, height: 120, backgroundColor: colors.background, borderRadius: 12, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { width: '100%', backgroundColor: colors.secondary, borderRadius: 12 },
  day: { marginTop: 8, fontSize: 12, color: colors.textSecondary }
});