export const calculateCalories = (steps, weightKg = 70) => {
  const caloriesPerStep = 0.04 * (weightKg / 70);
  return steps * caloriesPerStep;
};