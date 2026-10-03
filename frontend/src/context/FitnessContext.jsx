import React, { createContext, useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';
import { getDailySteps, saveDailySteps, getProfile, getGoals, saveProfile, saveGoals } from '../storage/database';
import { checkPedometerAvailability, requestPedometerPermission } from '../services/StepCounterService';
import { calculateDistance } from '../utils/distanceCalculator';
import { calculateCalories } from '../utils/calorieCalculator';
import { getTodayDateString } from '../utils/dateUtils';

export const FitnessContext = createContext();

export const FitnessProvider = ({ children }) => {
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const [activeMinutes, setActiveMinutes] = useState(0);
  
  const [dailyGoal, setDailyGoal] = useState(10000);
  const [userProfile, setUserProfile] = useState(null);
  
  const [sensorAvailable, setSensorAvailable] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);
  
  const today = getTodayDateString();
  let pedometerSub = null;

  useEffect(() => {
    loadUserData();
    setupSensor();
    return () => { if (pedometerSub) pedometerSub.remove(); };
  }, []);

  const loadUserData = () => {
    const profile = getProfile() || { weight: 70, strideLength: 0.76 };
    setUserProfile(profile);
    const goals = getGoals() || { dailyStepsGoal: 10000 };
    setDailyGoal(goals.dailyStepsGoal);
    
    const todayData = getDailySteps(today);
    if (todayData) {
      setSteps(todayData.steps);
      setDistance(todayData.distance);
      setCalories(todayData.calories);
      setActiveMinutes(todayData.activeMinutes);
    } else {
      saveDailySteps({ date: today, steps: 0, distance: 0, calories: 0, activeMinutes: 0, goal: goals.dailyStepsGoal });
    }
  };

  const setupSensor = async () => {
    const isAvail = await checkPedometerAvailability();
    setSensorAvailable(isAvail);
    if (isAvail) {
      const perm = await requestPedometerPermission();
      setPermissionStatus(perm ? 'granted' : 'denied');
      if (perm) {
        let initialSteps = steps;
        pedometerSub = Pedometer.watchStepCount(result => {
          const currentProfile = getProfile() || { weight: 70, strideLength: 0.76 };
          const currentGoals = getGoals() || { dailyStepsGoal: 10000 };
          const totalSteps = initialSteps + result.steps;
          const dist = calculateDistance(totalSteps, currentProfile.strideLength);
          const cals = calculateCalories(totalSteps, currentProfile.weight);
          const mins = Math.floor(totalSteps / 100);

          setSteps(totalSteps);
          setDistance(dist);
          setCalories(cals);
          setActiveMinutes(mins);

          saveDailySteps({
            date: today,
            steps: totalSteps,
            distance: dist,
            calories: cals,
            activeMinutes: mins,
            goal: currentGoals.dailyStepsGoal
          });
        });
      }
    }
  };
  
  const updateProfile = (newProfile) => { saveProfile(newProfile); setUserProfile(newProfile); };
  const updateGoals = (newGoals) => { saveGoals(newGoals); setDailyGoal(newGoals.dailyStepsGoal); };

  return (
    <FitnessContext.Provider value={{ steps, distance, calories, activeMinutes, dailyGoal, userProfile, sensorAvailable, permissionStatus, updateProfile, updateGoals }}>
      {children}
    </FitnessContext.Provider>
  );
};
