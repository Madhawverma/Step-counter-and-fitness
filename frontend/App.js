import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { FitnessProvider } from './src/context/FitnessContext';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <FitnessProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <AppNavigator />
      </NavigationContainer>
    </FitnessProvider>
  );
}