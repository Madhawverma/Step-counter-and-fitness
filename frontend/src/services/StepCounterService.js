import { Pedometer } from 'expo-sensors';
export const checkPedometerAvailability = async () => {
  try { return await Pedometer.isAvailableAsync(); } catch (e) { return false; }
};
export const requestPedometerPermission = async () => {
  try { const { status } = await Pedometer.requestPermissionsAsync(); return status === 'granted'; } catch (e) { return false; }
};
