import React from 'react';
import { NavigationContainer } from '@react-navigation/bottom-tabs'; // using bottom-tabs? No, we need native-stack
// Wait, we can just use normal App structure if we change AppNavigator
// Since we don't have native-stack installed, we might just use conditional rendering for now or install it.
// Let's use simple conditional rendering in App to avoid installing more things.
import { FitnessProvider } from './src/context/FitnessContext';
import MainFlow from './MainFlow';

export default function App() {
  return (
    <FitnessProvider>
      <MainFlow />
    </FitnessProvider>
  );
}