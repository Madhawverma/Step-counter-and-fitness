import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FitnessContext } from './src/context/FitnessContext';

import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import PermissionScreen from './src/screens/PermissionScreen';
import AppNavigator from './src/navigation/AppNavigator';

// Custom lightweight navigator since we don't have Stack navigator
export default function MainFlow() {
  const { userProfile, permissionStatus } = useContext(FitnessContext);
  const [currentRoute, setCurrentRoute] = useState('Splash');

  const navigation = {
    replace: (route) => setCurrentRoute(route)
  };

  if (currentRoute === 'Splash') {
    return <SplashScreen navigation={navigation} />;
  }
  if (currentRoute === 'Onboarding') {
    return <OnboardingScreen navigation={navigation} />;
  }
  if (currentRoute === 'Permission') {
    return <PermissionScreen navigation={navigation} />;
  }
  
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}