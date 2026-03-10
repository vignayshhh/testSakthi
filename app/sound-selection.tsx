import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { SOUNDS } from "../constants/sounds";
import { getSelectedSound, setSelectedSound } from "../utils/storage";

export default function SoundSelectionScreen() {
  const router = useRouter();
  const [selectedSoundId, setSelectedSoundId] = useState("chime");
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    loadSelectedSound();
  }, []);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  async function loadSelectedSound() {
    const soundId = await getSelectedSound();
    setSelectedSoundId(soundId);
  }

  async function handleSelectSound(soundId: string) {
    setSelectedSoundId(soundId);
    await setSelectedSound(soundId);
    await playPreview(soundId);
  }

  async function playPreview(soundId: string) {
    try {
      // Stop any currently playing sound
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      // Create and play new sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        require("../assets/sounds/alarm.mp3"),
        { shouldPlay: true, isLooping: false, volume: 0.5 },
      );
      setSound(newSound);
    } catch (error) {
      console.error("Error playing preview:", error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#BB8FCE" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Sound</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>Choose your preferred alarm sound</Text>

        {SOUNDS.map((soundOption) => (
          <TouchableOpacity
            key={soundOption.id}
            style={[
              styles.soundCard,
              selectedSoundId === soundOption.id && styles.selectedCard,
            ]}
            onPress={() => handleSelectSound(soundOption.id)}
          >
            <View style={styles.soundInfo}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="musical-note"
                  size={32}
                  color={
                    selectedSoundId === soundOption.id ? "#9B59B6" : "#BB8FCE"
                  }
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.soundName}>{soundOption.name}</Text>
                <Text style={styles.soundDescription}>
                  {soundOption.description}
                </Text>
              </View>
            </View>
            {selectedSoundId === soundOption.id && (
              <Ionicons name="checkmark-circle" size={28} color="#9B59B6" />
            )}
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A0A2E",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2D1B4E",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#BB8FCE",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#BB8FCE",
    marginBottom: 24,
    textAlign: "center",
  },
  soundCard: {
    backgroundColor: "#2D1B4E",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedCard: {
    borderColor: "#9B59B6",
    backgroundColor: "#3D2B5E",
  },
  soundInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1A0A2E",
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    marginLeft: 16,
    flex: 1,
  },
  soundName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
  },
  soundDescription: {
    fontSize: 14,
    color: "#888",
  },
});
