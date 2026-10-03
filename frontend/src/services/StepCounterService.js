import { Pedometer } from 'expo-sensors';

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
