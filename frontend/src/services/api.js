import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

import Constants from 'expo-constants';

const debuggerHost = Constants.expoConfig?.hostUri;
const localhost = debuggerHost ? debuggerHost.split(':')[0] : 'localhost';
const API_URL = `http://${localhost}:5000/api`;


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getDeviceId = async () => {
    try {
        let deviceId = await AsyncStorage.getItem('deviceId');
        if (!deviceId) {
            // Generate a simple unique ID for this device if not exists
            deviceId = 'device_' + Math.random().toString(36).substring(2, 15);
            await AsyncStorage.setItem('deviceId', deviceId);
        }
        return deviceId;
    } catch (e) {
        return 'unknown_device';
    }
};

// Goals APIs
export const fetchGoal = async (deviceId) => {
    const res = await api.get(`/goals/${deviceId}`);
    return res.data;
};

export const updateGoal = async (goalData) => {
    const res = await api.post(`/goals/set`, goalData);
    return res.data;
};

// Steps APIs
export const syncDailySteps = async (stepData) => {
    const res = await api.post(`/steps/sync`, stepData);
    return res.data;
};

export const fetchStepsHistory = async (deviceId) => {
    const res = await api.get(`/steps/history/${deviceId}`);
    return res.data;
};

// User Profile APIs
export const fetchProfile = async (deviceId) => {
    const res = await api.get(`/user/${deviceId}`);
    return res.data;
};

export const updateProfile = async (profileData) => {
    const res = await api.post(`/user/sync`, profileData);
    return res.data;
};

export default api;
