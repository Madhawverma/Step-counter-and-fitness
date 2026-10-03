import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { FitnessContext } from '../context/FitnessContext';
import colors from '../constants/colors';

export default function ProfileScreen() {
  const { userProfile, updateProfile } = useContext(FitnessContext);
  const [weight, setWeight] = useState(userProfile?.weight?.toString() || '70');
  const [stride, setStride] = useState(userProfile?.strideLength?.toString() || '0.76');

  const handleSave = () => {
    const w = parseFloat(weight);
    const s = parseFloat(stride);
    if (w > 0 && s > 0) {
      updateProfile({ ...userProfile, weight: w, strideLength: s });
      Alert.alert('Success', 'Profile updated');
    } else {
      Alert.alert('Error', 'Invalid values');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Weight (kg)</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={weight} onChangeText={setWeight} />
        
        <Text style={styles.label}>Stride Length (meters)</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={stride} onChangeText={setStride} />
        
        <TouchableOpacity style={styles.btn} onPress={handleSave}>
          <Text style={styles.btnText}>Save Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 20 },
  card: { backgroundColor: colors.card, padding: 20, borderRadius: 20, elevation: 3 },
  label: { fontSize: 16, color: colors.textSecondary, marginBottom: 5 },
  input: { borderBottomWidth: 1, borderColor: colors.border, fontSize: 18, paddingVertical: 8, color: colors.text, marginBottom: 20 },
  btn: { backgroundColor: colors.primary, padding: 15, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});