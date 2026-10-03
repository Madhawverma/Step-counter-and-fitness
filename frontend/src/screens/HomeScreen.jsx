import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { FitnessContext } from '../context/FitnessContext';
import StepCounterCard from '../components/StepCounterCard';
import CalorieCard from '../components/CalorieCard';
import DistanceCard from '../components/DistanceCard';

export default function HomeScreen() {
  const { steps, distance, calories, goal, isAvailable } = useContext(FitnessContext);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>FITSTEP</Text>
        {isAvailable === false && <Text style={styles.warning}>Sensor Unavailable</Text>}
      </View>

      <StepCounterCard steps={steps} goal={goal} />

      <View style={styles.statsRow}>
        <CalorieCard calories={calories} />
        <DistanceCard distance={distance} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7', padding: 16 },
  header: { paddingVertical: 20, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1C1C1E' },
  warning: { color: '#FF3B30', marginTop: 8 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
});
