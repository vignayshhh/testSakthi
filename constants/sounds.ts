export interface Sound {
  id: string;
  name: string;
  description: string;
  fileName: string;
}

export const SOUNDS: Sound[] = [
  {
    id: 'chime',
    name: 'Gentle Chime',
    description: 'Soft bell tones',
    fileName: 'chime.mp3'
  },
  {
    id: 'birds',
    name: 'Morning Birds',
    description: 'Peaceful chirping',
    fileName: 'birds.mp3'
  },
  {
    id: 'piano',
    name: 'Soft Piano',
    description: 'Calming melody',
    fileName: 'piano.mp3'
  },
  {
    id: 'windchimes',
    name: 'Wind Chimes',
    description: 'Soothing tones',
    fileName: 'windchimes.mp3'
  },
  {
    id: 'water',
    name: 'Water Drops',
    description: 'Gentle rhythm',
    fileName: 'water.mp3'
  }
];
