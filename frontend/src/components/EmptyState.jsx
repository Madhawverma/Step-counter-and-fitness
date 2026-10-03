import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';

export default function EmptyState({ message }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message || 'No data available.'}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { fontSize: 16, color: colors.textSecondary, textAlign: 'center' }
});