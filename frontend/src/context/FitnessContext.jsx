import React, { createContext, useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';
import { getDailySteps, saveDailySteps, getProfile, getGoals, saveProfile, saveGoals } from '../storage/database';
import { checkPedometerAvailability, requestPedometerPermission } from '../services/StepCounterService';
import { calculateDistance } from '../utils/distanceCalculator';
import { calculateCalories } from '../utils/calorieCalculator';
import { getTodayDateString } from '../utils/dateUtils';
import { getDeviceId, syncDailySteps as apiSyncSteps, fetchGoal, updateGoal as apiUpdateGoal, fetchProfile as apiFetchProfile, updateProfile as apiUpdateProfile } from '../services/api';

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
  let syncTimeout = null;

  useEffect(() => {
    loadUserData();
    setupSensor();
    return () => { 
        if (pedometerSub) pedometerSub.remove(); 
        if (syncTimeout) clearTimeout(syncTimeout);
    };
  }, []);

  const loadUserData = async () => {
    // 1. Load Local Data First
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

    // 2. Fetch from Backend (Background Sync)
    try {
        const deviceId = await getDeviceId();
        const goalData = await fetchGoal(deviceId);
        if (goalData?.success && goalData?.data) {
            setDailyGoal(goalData.data.dailyStepsGoal);
            saveGoals({ dailyStepsGoal: goalData.data.dailyStepsGoal });
        }
        
        const profileData = await apiFetchProfile(deviceId);
        if (profileData?.success && profileData?.data) {
            setUserProfile(profileData.data);
            saveProfile(profileData.data);
        }
    } catch (error) {
        console.log('Error syncing from backend initially:', error.message);
    }
  };

  const syncToBackend = async (data) => {
    try {
      const deviceId = await getDeviceId();
      await apiSyncSteps({
        deviceId,
        date: today,
        steps: data.steps,
        distance: data.distance,
        calories: data.calories,
        activeMinutes: data.activeMinutes
      });
    } catch (e) {
      console.log('Error syncing steps to backend', e.message);
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

          const stepData = {
            date: today,
            steps: totalSteps,
            distance: dist,
            calories: cals,
            activeMinutes: mins,
            goal: currentGoals.dailyStepsGoal
          };
          
          saveDailySteps(stepData);

          // Debounce Backend Sync (Sync every 10 seconds of continuous walking max)
          if (syncTimeout) clearTimeout(syncTimeout);
          syncTimeout = setTimeout(() => {
              syncToBackend(stepData);
          }, 10000);
        });
      }
    }
  };
  
  const updateProfile = async (newProfile) => { 
      saveProfile(newProfile); 
      setUserProfile(newProfile); 
      try {
          const deviceId = await getDeviceId();
          await apiUpdateProfile({ deviceId, ...newProfile });
      } catch (e) {
          console.log('Failed to sync profile', e.message);
      }
  };
  
  const updateGoals = async (newGoals) => { 
      saveGoals(newGoals); 
      setDailyGoal(newGoals.dailyStepsGoal); 
      try {
          const deviceId = await getDeviceId();
          await apiUpdateGoal({ deviceId, ...newGoals });
      } catch (e) {
          console.log('Failed to sync goals', e.message);
      }
  };

  return (
    <FitnessContext.Provider value={{ steps, distance, calories, activeMinutes, dailyGoal, userProfile, sensorAvailable, permissionStatus, updateProfile, updateGoals }}>
      {children}
    </FitnessContext.Provider>
  );
};
