export interface Meal {
  id: string;
  name: string;
  time: string;
  hour: number;
  minute: number;
  description: string;
  icon: string;
  color: string;
}

export const MEALS: Meal[] = [
  {
    id: 'breakfast',
    name: 'Breakfast',
    time: '8:00 AM',
    hour: 8,
    minute: 0,
    description: 'Start your day right',
    icon: 'sunny',
    color: '#FF9F43'
  },
  {
    id: 'lunch',
    name: 'Lunch',
    time: '1:00 PM',
    hour: 13,
    minute: 0,
    description: 'Midday fuel',
    icon: 'restaurant',
    color: '#EE5A6F'
  },
  {
    id: 'snacks',
    name: 'Snacks',
    time: '6:00 PM',
    hour: 18,
    minute: 0,
    description: 'Evening refreshment',
    icon: 'cafe',
    color: '#F39C12'
  },
  {
    id: 'dinner',
    name: 'Dinner',
    time: '8:00 PM',
    hour: 20,
    minute: 0,
    description: 'Evening nourishment',
    icon: 'moon',
    color: '#9B59B6'
  }
];
