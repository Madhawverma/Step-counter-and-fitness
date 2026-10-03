import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';

export default function CircularProgress({ progress, size = 120, strokeWidth = 10 }) {
  const radius = (size - strokeWidth) / 2;
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2, borderWidth: strokeWidth, borderColor: colors.background }]}>
      <View style={[styles.progress, { width: size, height: size, borderRadius: size / 2, borderBottomWidth: strokeWidth, borderLeftWidth: strokeWidth, borderColor: colors.primary, transform: [{ rotate: `${(progress / 100) * 360}deg` }] }]} />
      <View style={styles.center}>
        <Text style={styles.text}>{Math.round(progress)}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center', position: 'relative' },
  progress: { position: 'absolute', borderTopWidth: 0, borderRightWidth: 0 },
  center: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24, fontWeight: 'bold', color: colors.primary }
});