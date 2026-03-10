import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const KEYS = {
  PRINCESS_MODE: '@sakthicare_princess_mode',
  SELECTED_SOUND: '@sakthicare_selected_sound',
};

// In-memory fallback for web/development
const memoryStorage: { [key: string]: string } = {};

const isWeb = Platform.OS === 'web';

export async function getPrincessMode(): Promise<boolean> {
  try {
    if (isWeb) {
      return memoryStorage[KEYS.PRINCESS_MODE] === 'true';
    }
    const value = await AsyncStorage.getItem(KEYS.PRINCESS_MODE);
    return value === 'true';
  } catch (error) {
    // Silent fail for web preview
    return false;
  }
}

export async function setPrincessMode(enabled: boolean): Promise<void> {
  try {
    if (isWeb) {
      memoryStorage[KEYS.PRINCESS_MODE] = enabled.toString();
      return;
    }
    await AsyncStorage.setItem(KEYS.PRINCESS_MODE, enabled.toString());
  } catch (error) {
    // Silent fail for web preview
  }
}

export async function getSelectedSound(): Promise<string> {
  try {
    if (isWeb) {
      return memoryStorage[KEYS.SELECTED_SOUND] || 'chime';
    }
    const value = await AsyncStorage.getItem(KEYS.SELECTED_SOUND);
    return value || 'chime';
  } catch (error) {
    return 'chime';
  }
}

export async function setSelectedSound(soundId: string): Promise<void> {
  try {
    if (isWeb) {
      memoryStorage[KEYS.SELECTED_SOUND] = soundId;
      return;
    }
    await AsyncStorage.setItem(KEYS.SELECTED_SOUND, soundId);
  } catch (error) {
    // Silent fail for web preview
  }
}
