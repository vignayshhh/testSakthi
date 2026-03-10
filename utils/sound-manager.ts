import { Audio } from "expo-av";
import { Platform, Vibration } from "react-native";
import { getSelectedSound } from "./storage";

// Sound configuration for maximum reliability
const SOUND_CONFIG = {
  VOLUME: 1.0,
  MAX_VOLUME: 1.0,
  FADE_IN_DURATION: 500,
  LOOPING: true,
  SHOULD_PLAY: true,
  ANDROID_AUDIO_MODE: {
    allowsRecordingIOS: false,
    staysActiveInBackground: true,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
  },
};

// Fallback sound files in order of preference
const FALLBACK_SOUNDS = ["alarm.mp3", "default.mp3", "notification.mp3"];

export class SoundManager {
  private soundInstance: Audio.Sound | null = null;
  private isPlaying: boolean = false;
  private retryCount: number = 0;
  private maxRetries: number = 3;

  constructor() {
    this.setupAudioSession();
  }

  private async setupAudioSession() {
    try {
      await Audio.setAudioModeAsync(SOUND_CONFIG.ANDROID_AUDIO_MODE);
      console.log("Audio session configured successfully");
    } catch (error) {
      console.error("Error setting up audio session:", error);
    }
  }

  async playAlarmSound(): Promise<boolean> {
    try {
      console.log("Starting alarm sound playback...");

      // Stop any existing sound
      await this.stopSound();

      // Try to load and play the selected sound
      const success = await this.loadAndPlaySound();

      if (success) {
        this.isPlaying = true;
        this.retryCount = 0;
        console.log("Alarm sound started successfully");
        return true;
      } else {
        // Fallback to vibration
        console.log("Sound failed, falling back to vibration");
        return this.playVibrationFallback();
      }
    } catch (error) {
      console.error("Error playing alarm sound:", error);
      return this.playVibrationFallback();
    }
  }

  private async loadAndPlaySound(): Promise<boolean> {
    try {
      const soundId = await getSelectedSound();
      console.log("Attempting to play sound:", soundId);

      // Try the selected sound first
      for (const soundFile of [`${soundId}.mp3`, ...FALLBACK_SOUNDS]) {
        try {
          console.log(`Trying sound file: ${soundFile}`);

          // Create sound instance
          const { sound } = await Audio.Sound.createAsync(
            this.getSoundUri(soundFile),
            {
              shouldPlay: SOUND_CONFIG.SHOULD_PLAY,
              isLooping: SOUND_CONFIG.LOOPING,
              volume: 0, // Start with 0 volume for fade in
            },
          );

          this.soundInstance = sound;

          // Fade in effect
          await this.fadeInSound();

          // Set status update listener
          this.setupSoundListener();

          return true;
        } catch (soundError) {
          console.warn(`Failed to load ${soundFile}:`, soundError);
          continue; // Try next sound file
        }
      }

      return false; // All sound files failed
    } catch (error) {
      console.error("Error in loadAndPlaySound:", error);
      return false;
    }
  }

  private getSoundUri(soundFile: string): any {
    // Use static require for build compatibility
    const soundMap: { [key: string]: any } = {
      "alarm.mp3": require("../assets/sounds/alarm.mp3"),
      "chime.mp3": require("../assets/sounds/alarm.mp3"), // Fallback to alarm.mp3
      "bell.mp3": require("../assets/sounds/alarm.mp3"), // Fallback to alarm.mp3
      "gong.mp3": require("../assets/sounds/alarm.mp3"), // Fallback to alarm.mp3
      "digital.mp3": require("../assets/sounds/alarm.mp3"), // Fallback to alarm.mp3
    };

    return soundMap[soundFile] || soundMap["alarm.mp3"];
  }

  private async fadeInSound(): Promise<void> {
    if (!this.soundInstance) return;

    try {
      const steps = 10;
      const stepDuration = SOUND_CONFIG.FADE_IN_DURATION / steps;

      for (let i = 0; i <= steps; i++) {
        const volume = (i / steps) * SOUND_CONFIG.VOLUME;
        await this.soundInstance.setVolumeAsync(volume);
        await new Promise((resolve) => setTimeout(resolve, stepDuration));
      }
    } catch (error) {
      console.error("Error fading in sound:", error);
      // Set full volume as fallback
      await this.soundInstance.setVolumeAsync(SOUND_CONFIG.VOLUME);
    }
  }

  private setupSoundListener(): void {
    if (!this.soundInstance) return;

    this.soundInstance.setOnPlaybackStatusUpdate(async (status) => {
      if (status.isLoaded && !status.isPlaying && this.isPlaying) {
        console.log("Sound stopped unexpectedly, attempting to restart...");
        if (this.retryCount < this.maxRetries) {
          this.retryCount++;
          await this.loadAndPlaySound();
        } else {
          console.log("Max retries reached, falling back to vibration");
          this.playVibrationFallback();
        }
      }
    });
  }

  private async playVibrationFallback(): Promise<boolean> {
    try {
      console.log("Playing vibration fallback pattern");

      // Strong vibration pattern for alarm
      const vibrationPattern = [0, 500, 200, 500, 200, 500];

      // Loop vibration for 30 seconds
      const vibrationInterval = setInterval(() => {
        Vibration.vibrate(vibrationPattern);
      }, 2000);

      // Stop vibration after 30 seconds
      setTimeout(() => {
        clearInterval(vibrationInterval);
      }, 30000);

      return true;
    } catch (error) {
      console.error("Error playing vibration fallback:", error);
      return false;
    }
  }

  async stopSound(): Promise<void> {
    try {
      this.isPlaying = false;

      if (this.soundInstance) {
        // Fade out before stopping
        await this.fadeOutSound();

        await this.soundInstance.stopAsync();
        await this.soundInstance.unloadAsync();
        this.soundInstance = null;
      }

      // Stop any vibration
      // Note: Vibration.stop() is not available in all versions
      // Vibration API may not have stop method

      console.log("Sound stopped successfully");
    } catch (error) {
      console.error("Error stopping sound:", error);
      // Force cleanup
      this.soundInstance = null;
      // Note: Vibration.stop() is not available in all versions
    }
  }

  private async fadeOutSound(): Promise<void> {
    if (!this.soundInstance) return;

    try {
      const currentVolume = await this.soundInstance.getStatusAsync();
      const startVolume = currentVolume.isLoaded
        ? currentVolume.volume || 1
        : 1;

      const steps = 10;
      const stepDuration = 200 / steps;

      for (let i = steps; i >= 0; i--) {
        const volume = (i / steps) * startVolume;
        await this.soundInstance.setVolumeAsync(volume);
        await new Promise((resolve) => setTimeout(resolve, stepDuration));
      }
    } catch (error) {
      console.error("Error fading out sound:", error);
    }
  }

  async testSound(): Promise<boolean> {
    try {
      console.log("Testing sound playback...");

      // Play a short test sound
      const { sound } = await Audio.Sound.createAsync(
        this.getSoundUri("alarm.mp3"),
        { shouldPlay: true, isLooping: false, volume: 0.5 },
      );

      // Auto-stop after 3 seconds
      setTimeout(async () => {
        await sound.stopAsync();
        await sound.unloadAsync();
      }, 3000);

      return true;
    } catch (error) {
      console.error("Error testing sound:", error);
      return false;
    }
  }

  // Emergency sound playback with maximum system priority
  async playEmergencySound(): Promise<boolean> {
    try {
      console.log("Playing emergency sound with maximum priority...");

      // Configure audio for emergency playback
      await Audio.setAudioModeAsync({
        ...SOUND_CONFIG.ANDROID_AUDIO_MODE,
        playThroughEarpieceAndroid: false,
        shouldDuckAndroid: false, // Don't duck other sounds
      });

      // Try multiple sound sources
      const emergencySounds = ["alarm.mp3", "default.mp3"];

      for (const soundFile of emergencySounds) {
        try {
          const { sound } = await Audio.Sound.createAsync(
            this.getSoundUri(soundFile),
            {
              shouldPlay: true,
              isLooping: true,
              volume: SOUND_CONFIG.MAX_VOLUME,
            },
          );

          this.soundInstance = sound;
          this.isPlaying = true;

          // Also trigger vibration
          Vibration.vibrate([0, 1000, 500, 1000]);

          return true;
        } catch (error) {
          console.warn(`Emergency sound ${soundFile} failed:`, error);
          continue;
        }
      }

      // Final fallback - continuous vibration
      return this.playEmergencyVibration();
    } catch (error) {
      console.error("Error in emergency sound playback:", error);
      return this.playEmergencyVibration();
    }
  }

  private async playEmergencyVibration(): Promise<boolean> {
    try {
      console.log("Playing emergency vibration pattern");

      // Continuous strong vibration pattern
      const emergencyPattern = [0, 1000, 500, 1000, 500, 1000];

      const vibrationInterval = setInterval(() => {
        Vibration.vibrate(emergencyPattern);
      }, 3000);

      // Continue for 1 minute
      setTimeout(() => {
        clearInterval(vibrationInterval);
      }, 60000);

      return true;
    } catch (error) {
      console.error("Error playing emergency vibration:", error);
      return false;
    }
  }

  // Check audio permissions and availability
  async checkAudioAvailability(): Promise<boolean> {
    try {
      const audioStatus = await Audio.setAudioModeAsync(
        SOUND_CONFIG.ANDROID_AUDIO_MODE,
      );
      console.log("Audio mode status:", audioStatus);

      // Test audio availability
      const { sound } = await Audio.Sound.createAsync(
        this.getSoundUri("alarm.mp3"),
        { shouldPlay: false, volume: 0 },
      );

      const status = await sound.getStatusAsync();
      await sound.unloadAsync();

      return status.isLoaded || false;
    } catch (error) {
      console.error("Audio availability check failed:", error);
      return false;
    }
  }

  // Get current playback status
  async getPlaybackStatus(): Promise<any> {
    try {
      if (!this.soundInstance) {
        return { isLoaded: false, isPlaying: false };
      }

      const status = await this.soundInstance.getStatusAsync();
      const isLoaded = status.isLoaded || false;
      const isPlaying = "isPlaying" in status ? status.isPlaying : false;
      const volume = "volume" in status ? status.volume : 0;
      const duration = "duration" in status ? status.duration : 0;
      const position = "positionMillis" in status ? status.positionMillis : 0;

      return {
        isLoaded,
        isPlaying,
        volume,
        duration,
        position,
      };
    } catch (error) {
      console.error("Error getting playback status:", error);
      return { isLoaded: false, isPlaying: false };
    }
  }

  // Cleanup method
  async cleanup(): Promise<void> {
    await this.stopSound();
    this.soundInstance = null;
    this.isPlaying = false;
    this.retryCount = 0;
  }
}

// Global sound manager instance
let globalSoundManager: SoundManager | null = null;

export function getSoundManager(): SoundManager {
  if (!globalSoundManager) {
    globalSoundManager = new SoundManager();
  }
  return globalSoundManager;
}

// Convenience functions for backward compatibility
export async function playAlarmSound(): Promise<boolean> {
  const soundManager = getSoundManager();
  return await soundManager.playAlarmSound();
}

export async function stopAlarmSound(): Promise<void> {
  const soundManager = getSoundManager();
  await soundManager.stopSound();
}

export async function testSoundPlayback(): Promise<boolean> {
  const soundManager = getSoundManager();
  return await soundManager.testSound();
}

export async function checkAudioPermissions(): Promise<boolean> {
  const soundManager = getSoundManager();
  return await soundManager.checkAudioAvailability();
}
