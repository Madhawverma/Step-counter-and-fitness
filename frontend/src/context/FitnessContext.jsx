import React, { createContext, useState, useEffect } from 'react';
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
