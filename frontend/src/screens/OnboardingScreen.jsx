import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { FitnessContext } from '../context/FitnessContext';
import colors from '../constants/colors';

export default function OnboardingScreen({ navigation }) {
  const { updateProfile } = useContext(FitnessContext);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  const handleNext = () => {
    const w = parseFloat(weight) || 70;
    const h = parseFloat(height) || 170;
    const strideLength = h * 0.414 / 100; // rough estimation of stride length in meters
    updateProfile({ weight: w, height: h, strideLength });
    navigation.replace('Permission');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to FITSTEP!</Text>
        <Text style={styles.subtitle}>Let's get to know you better to calculate calories and distance accurately.</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput style={styles.input} keyboardType="numeric" placeholder="e.g. 70" placeholderTextColor="#aaa" value={weight} onChangeText={setWeight} />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Height (cm)</Text>
          <TextInput style={styles.input} keyboardType="numeric" placeholder="e.g. 170" placeholderTextColor="#aaa" value={height} onChangeText={setHeight} />
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleNext}>
          <Text style={styles.btnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: colors.text, marginBottom: 10 },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: 40, lineHeight: 24 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, color: colors.text, marginBottom: 8, fontWeight: '600' },
  input: { backgroundColor: colors.card, borderRadius: 12, padding: 16, fontSize: 18, color: colors.text },
  btn: { backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});