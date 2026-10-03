export const calculateDistance = (steps, strideLengthMeters = 0.76) => {
  const distanceMeters = steps * strideLengthMeters;
  return distanceMeters / 1000;
};
