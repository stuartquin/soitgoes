export const formatHours = (hours: number): string => {
  return hours.toFixed(2).replace(".", ":");
};
