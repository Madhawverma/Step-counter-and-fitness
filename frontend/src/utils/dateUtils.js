export const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};