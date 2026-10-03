import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { FitnessContext } from '../context/FitnessContext';

export default function HomeScreen() {
  const { steps, distance, calories, goal, isAvailable } = useContext(FitnessContext);

  const progress = Math.min((steps / goal) * 100, 100).toFixed(1);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>FITSTEP</Text>
        {isAvailable === false && <Text style={styles.warning}>Sensor Unavailable</Text>}
      </View>

      <View style={styles.card}>
        <Text style={styles.stepsText}>{steps.toLocaleString()}</Text>
        <Text style={styles.stepsLabel}>STEPS TODAY</Text>
        
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Progress: {progress}%</Text>
          <Text style={styles.goalText}>Goal: {goal.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.card, styles.statCard]}>
          <Text style={styles.statValue}>{calories.toFixed(0)}</Text>
          <Text style={styles.statLabel}>KCAL</Text>
        </View>
        <View style={[styles.card, styles.statCard]}>
          <Text style={styles.statValue}>{distance.toFixed(2)}</Text>
          <Text style={styles.statLabel}>KM</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    padding: 16,
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  warning: {
    color: '#FF3B30',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  stepsText: {
    fontSize: 64,
    fontWeight: '800',
    color: '#007AFF',
  },
  stepsLabel: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '600',
    marginTop: 8,
  },
  progressContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34C759',
  },
  goalText: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '600',
    marginTop: 8,
  }
});
