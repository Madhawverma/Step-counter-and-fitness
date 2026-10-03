const fs = require('fs');
const path = require('path');

const files = {
  'frontend/package.json': `{
  "name": "fitstep",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "@react-native-async-storage/async-storage": "1.23.1",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "@react-navigation/native": "^6.1.9",
    "expo": "~51.0.8",
    "expo-sensors": "~13.0.9",
    "expo-sqlite": "~14.0.3",
    "expo-status-bar": "~1.12.1",
    "react": "18.2.0",
    "react-native": "0.74.1",
    "react-native-safe-area-context": "4.10.1",
    "react-native-screens": "3.31.1"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0"
  },
  "private": true
}`,
  'frontend/app.json': `{
  "expo": {
    "name": "FITSTEP",
    "slug": "fitstep",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "infoPlist": {
        "NSMotionUsageDescription": "FITSTEP needs access to your device motion to count your steps accurately."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "permissions": [
        "ACTIVITY_RECOGNITION"
      ]
    }
  }
}`,
  'frontend/App.js': `import React from 'react';
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
}`,
  'frontend/src/storage/database.js': `import * as SQLite from 'expo-sqlite';

// Open or create database
const db = SQLite.openDatabaseSync('fitstep.db');

export const initDB = () => {
  try {
    db.execSync(\`
      CREATE TABLE IF NOT EXISTS DailySteps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT UNIQUE,
        steps INTEGER DEFAULT 0,
        distance REAL DEFAULT 0,
        calories REAL DEFAULT 0,
        activeMinutes INTEGER DEFAULT 0,
        goal INTEGER DEFAULT 10000,
        createdAt TEXT,
        updatedAt TEXT
      );
    \`);
    console.log("Database initialized");
  } catch (error) {
    console.error("Error initializing DB:", error);
  }
};

export const getDailySteps = (date) => {
  try {
    const result = db.getFirstSync('SELECT * FROM DailySteps WHERE date = ?', [date]);
    return result;
  } catch (error) {
    console.error("Error getting daily steps:", error);
    return null;
  }
};

export const saveDailySteps = (data) => {
  try {
    const { date, steps, distance, calories, activeMinutes, goal } = data;
    const now = new Date().toISOString();
    
    const existing = getDailySteps(date);
    if (existing) {
      db.runSync(
        'UPDATE DailySteps SET steps = ?, distance = ?, calories = ?, activeMinutes = ?, updatedAt = ? WHERE date = ?',
        [steps, distance, calories, activeMinutes, now, date]
      );
    } else {
      db.runSync(
        'INSERT INTO DailySteps (date, steps, distance, calories, activeMinutes, goal, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [date, steps, distance, calories, activeMinutes, goal, now, now]
      );
    }
  } catch (error) {
    console.error("Error saving daily steps:", error);
  }
};
`,
  'frontend/src/services/StepCounterService.js': `import { Pedometer } from 'expo-sensors';

export const isPedometerAvailable = async () => {
  try {
    return await Pedometer.isAvailableAsync();
  } catch (error) {
    return false;
  }
};

export const requestPedometerPermissions = async () => {
  try {
    const { status } = await Pedometer.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    return false;
  }
};
`,
  'frontend/src/context/FitnessContext.js': `import React, { createContext, useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';
import { initDB, getDailySteps, saveDailySteps } from '../storage/database';
import { isPedometerAvailable, requestPedometerPermissions } from '../services/StepCounterService';
import { calculateDistance } from '../utils/distanceCalculator';
import { calculateCalories } from '../utils/calorieCalculator';

export const FitnessContext = createContext();

export const FitnessProvider = ({ children }) => {
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const [isAvailable, setIsAvailable] = useState(null);
  const [goal, setGoal] = useState(10000);
  
  const today = new Date().toISOString().split('T')[0];
  let pedometerSubscription = null;

  useEffect(() => {
    initDB();
    loadTodayData();
    setupPedometer();

    return () => {
      if (pedometerSubscription) {
        pedometerSubscription.remove();
      }
    };
  }, []);

  const loadTodayData = () => {
    const data = getDailySteps(today);
    if (data) {
      setSteps(data.steps);
      setDistance(data.distance);
      setCalories(data.calories);
      setGoal(data.goal || 10000);
    } else {
      saveDailySteps({ date: today, steps: 0, distance: 0, calories: 0, activeMinutes: 0, goal: 10000 });
    }
  };

  const setupPedometer = async () => {
    const available = await isPedometerAvailable();
    setIsAvailable(available);

    if (available) {
      const hasPermission = await requestPedometerPermissions();
      if (hasPermission) {
        let initialSteps = steps; 
        
        pedometerSubscription = Pedometer.watchStepCount(result => {
          const totalSteps = initialSteps + result.steps;
          const dist = calculateDistance(totalSteps, 0.76);
          const cals = calculateCalories(totalSteps, 70); 

          setSteps(totalSteps);
          setDistance(dist);
          setCalories(cals);

          saveDailySteps({
            date: today,
            steps: totalSteps,
            distance: dist,
            calories: cals,
            activeMinutes: Math.floor(totalSteps / 100), 
            goal
          });
        });
      }
    }
  };

  return (
    <FitnessContext.Provider value={{ steps, distance, calories, goal, isAvailable }}>
      {children}
    </FitnessContext.Provider>
  );
};
`,
  'frontend/src/utils/distanceCalculator.js': `export const calculateDistance = (steps, strideLengthMeters = 0.76) => {
  const distanceMeters = steps * strideLengthMeters;
  return distanceMeters / 1000;
};
`,
  'frontend/src/utils/calorieCalculator.js': `export const calculateCalories = (steps, weightKg = 70) => {
  const caloriesPerStep = 0.04 * (weightKg / 70);
  return steps * caloriesPerStep;
};
`,
  'frontend/src/navigation/AppNavigator.js': `import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ActivityScreen from '../screens/ActivityScreen';
import HistoryScreen from '../screens/HistoryScreen';
import GoalsScreen from '../screens/GoalsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#007AFF' }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Activity" component={ActivityScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Goals" component={GoalsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
`,
  'frontend/src/screens/HomeScreen.js': `import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { FitnessContext } from '../context/FitnessContext';

export default function HomeScreen() {
  const { steps, distance, calories, goal, isAvailable } = useContext(FitnessContext);

  const progress = Math.min((steps / goal) * 100, 100).toFixed(1);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>FITSTEP</Text>
        {isAvailable === false && <Text style={styles.warning}>Sensor Unavailable</Text>}
      </View>

      <View style={styles.card}>
        <Text style={styles.stepsText}>{steps.toLocaleString()}</Text>
        <Text style={styles.stepsLabel}>STEPS TODAY</Text>
        
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Progress: {progress}%</Text>
          <Text style={styles.goalText}>Goal: {goal.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.card, styles.statCard]}>
          <Text style={styles.statValue}>{calories.toFixed(0)}</Text>
          <Text style={styles.statLabel}>KCAL</Text>
        </View>
        <View style={[styles.card, styles.statCard]}>
          <Text style={styles.statValue}>{distance.toFixed(2)}</Text>
          <Text style={styles.statLabel}>KM</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    padding: 16,
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  warning: {
    color: '#FF3B30',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  stepsText: {
    fontSize: 64,
    fontWeight: '800',
    color: '#007AFF',
  },
  stepsLabel: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '600',
    marginTop: 8,
  },
  progressContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34C759',
  },
  goalText: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '600',
    marginTop: 8,
  }
});
`,
  'frontend/src/screens/ActivityScreen.js': `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ActivityScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Activity Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: 'bold' }
});
`,
  'frontend/src/screens/HistoryScreen.js': `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>History Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: 'bold' }
});
`,
  'frontend/src/screens/GoalsScreen.js': `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GoalsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Goals Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: 'bold' }
});
`,
  'frontend/src/screens/SettingsScreen.js': `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: 'bold' }
});
`
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join('c:/New folder (4)/Step-Counter', filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
}
console.log('Successfully generated core frontend files.');
