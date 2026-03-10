import { MEALS } from '../constants/meals';

export function getNextMeal() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  for (const meal of MEALS) {
    const mealTimeInMinutes = meal.hour * 60 + meal.minute;
    if (mealTimeInMinutes > currentTimeInMinutes) {
      return meal.id;
    }
  }

  // If no meal is ahead today, return the first meal (breakfast)
  return MEALS[0].id;
}

export function getMealIcon(mealId: string, isAlarm: boolean = false) {
  const meal = MEALS.find(m => m.id === mealId);
  if (!meal) return 'restaurant';
  
  // For alarm screen, determine icon based on current time
  if (isAlarm) {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'sunny';
    if (hour >= 12 && hour < 17) return 'restaurant';
    if (hour >= 17 && hour < 20) return 'cafe';
    return 'moon';
  }
  
  return meal.icon;
}
