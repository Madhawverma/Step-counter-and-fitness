import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import ActivityCard from '../components/ActivityCard';
import EmptyState from '../components/EmptyState';
import { FitnessContext } from '../context/FitnessContext';
import colors from '../constants/colors';

export default function ActivityScreen() {
  const { steps, activeMinutes, calories } = useContext(FitnessContext);
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Today's Activity</Text>
        {steps > 0 ? (
          <ActivityCard type="Walking" duration={activeMinutes} steps={steps} calories={Math.round(calories)} />
        ) : (
          <EmptyState message="No activity recorded today." />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 20 }
});