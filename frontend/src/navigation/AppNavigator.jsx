import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ActivityScreen from '../screens/ActivityScreen';
import HistoryScreen from '../screens/HistoryScreen';
import GoalsScreen from '../screens/GoalsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import colors from '../constants/colors';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: '#1e293b', borderTopWidth: 0, height: 70, paddingBottom: 15, paddingTop: 10 },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') return <Ionicons name="home" size={24} color={color} />;
          if (route.name === 'Activity') return <MaterialCommunityIcons name="shoe-print" size={24} color={color} />;
          if (route.name === 'History') return <Ionicons name="bar-chart" size={24} color={color} />;
          if (route.name === 'Goals') return <MaterialCommunityIcons name="target" size={24} color={color} />;
          if (route.name === 'Profile') return <Ionicons name="person" size={24} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Activity" component={ActivityScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Goals" component={GoalsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}