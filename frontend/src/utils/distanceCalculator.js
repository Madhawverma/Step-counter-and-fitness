export const calculateDistance = (steps, strideLengthM = 0.76) => {
  return (steps * strideLengthM) / 1000;
};