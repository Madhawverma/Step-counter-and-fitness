import React, { useContext } from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { clearAllData } from '../storage/database';
import { FitnessContext } from '../context/FitnessContext';
import colors from '../constants/colors';

export default function SettingsScreen() {
  
  const handleClearData = () => {
    Alert.alert('Clear Local Data', 'Are you sure you want to delete all fitness records? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { clearAllData(); Alert.alert("Cleared", "All local data deleted."); } }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Settings</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Privacy</Text>
          <TouchableOpacity style={[styles.item, styles.destructive]} onPress={handleClearData}>
            <Text style={styles.destructiveText}>Clear Local Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.item}>
            <Text style={styles.text}>FITSTEP v1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 20 },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 10, textTransform: 'uppercase', fontWeight: '600' },
  item: { backgroundColor: colors.card, padding: 16, borderRadius: 12 },
  text: { fontSize: 16, color: colors.text },
  destructive: { borderLeftWidth: 4, borderLeftColor: colors.danger },
  destructiveText: { fontSize: 16, color: colors.danger, fontWeight: '600' }
});