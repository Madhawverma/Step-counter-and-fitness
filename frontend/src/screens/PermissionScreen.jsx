import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { FitnessContext } from '../context/FitnessContext';
import colors from '../constants/colors';

export default function PermissionScreen({ navigation }) {
  const { requestSensorPermissions } = useContext(FitnessContext);

  const handleAllow = async () => {
    if (requestSensorPermissions) {
      await requestSensorPermissions();
    }
    navigation.replace('Main');
  };

  const handleSkip = () => {
    navigation.replace('Main');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🏃</Text>
        </View>
        <Text style={styles.title}>Step Tracking</Text>
        <Text style={styles.subtitle}>FITSTEP needs access to your physical activity sensor to count your steps in the background.</Text>
        
        <View style={styles.btnContainer}>
          <TouchableOpacity style={styles.btnPrimary} onPress={handleAllow}>
            <Text style={styles.btnPrimaryText}>Allow Access</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSecondary} onPress={handleSkip}>
            <Text style={styles.btnSecondaryText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  iconContainer: { width: 120, height: 120, borderRadius: 60, backgroundColor: colors.card, justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  icon: { fontSize: 60 },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 16, textAlign: 'center' },
  subtitle: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: 40 },
  btnContainer: { width: '100%' },
  btnPrimary: { backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  btnPrimaryText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  btnSecondary: { padding: 16, alignItems: 'center' },
  btnSecondaryText: { color: colors.textSecondary, fontSize: 16, fontWeight: '600' }
});