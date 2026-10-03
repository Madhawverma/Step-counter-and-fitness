import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StepCounterCard({ steps, goal }) {
  const progress = Math.min((steps / goal) * 100, 100).toFixed(1);
  return (
    <View style={styles.card}>
      <Text style={styles.stepsText}>{steps.toLocaleString()}</Text>
      <Text style={styles.label}>STEPS TODAY</Text>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Progress: {progress}%</Text>
        <Text style={styles.goalText}>Goal: {goal.toLocaleString()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFF', borderRadius: 20, padding: 24, marginVertical: 10, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  stepsText: { fontSize: 64, fontWeight: '800', color: '#007AFF' },
  label: { fontSize: 16, color: '#8E8E93', fontWeight: '600', marginTop: 8 },
  progressContainer: { marginTop: 20, alignItems: 'center' },
  progressText: { fontSize: 18, fontWeight: '600', color: '#34C759' },
  goalText: { fontSize: 14, color: '#8E8E93', marginTop: 4 },
});
