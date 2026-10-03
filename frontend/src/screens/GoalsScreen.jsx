import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { FitnessContext } from '../context/FitnessContext';
import colors from '../constants/colors';

export default function GoalsScreen() {
  const { dailyGoal, updateGoals } = useContext(FitnessContext);
  const [goalInput, setGoalInput] = useState(dailyGoal.toString());

  const handleSave = () => {
    const num = parseInt(goalInput, 10);
    if (!isNaN(num) && num > 0) {
      updateGoals({ dailyStepsGoal: num });
      Alert.alert('Success', 'Goals updated successfully');
    } else {
      Alert.alert('Error', 'Please enter a valid number');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Goals</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Daily Steps Goal</Text>
        <TextInput 
          style={styles.input} 
          keyboardType="numeric" 
          value={goalInput} 
          onChangeText={setGoalInput} 
        />
        <TouchableOpacity style={styles.btn} onPress={handleSave}>
          <Text style={styles.btnText}>Save Goal</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 20 },
  card: { backgroundColor: colors.card, padding: 20, borderRadius: 20, elevation: 3 },
  label: { fontSize: 16, color: colors.textSecondary, marginBottom: 10 },
  input: { borderBottomWidth: 1, borderColor: colors.border, fontSize: 24, paddingVertical: 10, color: colors.text, marginBottom: 20 },
  btn: { backgroundColor: colors.primary, padding: 15, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});