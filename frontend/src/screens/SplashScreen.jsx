import React, { useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { FitnessContext } from '../context/FitnessContext';
import colors from '../constants/colors';

export default function SplashScreen({ navigation }) {
  const { userProfile, permissionStatus } = useContext(FitnessContext);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      // Logic for routing
      if (!userProfile) {
        navigation.replace('Onboarding');
      } else if (permissionStatus !== 'granted') {
        navigation.replace('Permission');
      } else {
        navigation.replace('Main');
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [userProfile, permissionStatus]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoIcon}>👟</Text>
        </View>
        <Text style={styles.title}>FITSTEP</Text>
        <Text style={styles.subtitle}>Every step counts</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  logoCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  logoIcon: { fontSize: 50 },
  title: { fontSize: 36, fontWeight: 'bold', color: colors.text, letterSpacing: 2 },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginTop: 8 }
});