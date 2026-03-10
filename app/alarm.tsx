import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  BackHandler,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getPrincessMode } from "../utils/storage";
import { PRINCESS_LINES } from "../constants/princessLines";
import { getMealIcon } from "../utils/time";
import { getSoundManager } from "../utils/sound-manager";

export default function AlarmScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [princessMode, setPrincessModeState] = useState(false);
  const [princessLine, setPrincessLine] = useState("");
  const [soundManager] = useState(() => getSoundManager());
  const [showSkipDialog, setShowSkipDialog] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const mealId = params.mealId || "dinner";
  const icon = getMealIcon(mealId as string, true);

  useEffect(() => {
    initializeAlarm();
    startAnimations();

    // Prevent back button from dismissing alarm
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true,
    );

    return () => {
      backHandler.remove();
      soundManager.cleanup();
    };
  }, [soundManager, initializeAlarm, startAnimations]);

  async function initializeAlarm() {
    // Load princess mode and get random line
    const mode = await getPrincessMode();
    setPrincessModeState(mode);
    if (mode) {
      const randomLine =
        PRINCESS_LINES[Math.floor(Math.random() * PRINCESS_LINES.length)];
      setPrincessLine(randomLine);
    }

    // Play alarm sound with maximum reliability
    await soundManager.playAlarmSound();
  }

  function startAnimations() {
    // Pulse animation for icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Scale animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }

  async function handleGotIt() {
    await soundManager.stopSound();
    router.back();
  }

  async function handleIgnore() {
    await soundManager.stopSound();
    setShowSkipDialog(true);
    // NO AUTO-CLOSE - user must tap OKAY button
  }

  function closeSkipDialog() {
    setShowSkipDialog(false);
    router.back();
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* Pulsing Icon */}
        <Animated.View
          style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}
        >
          <View style={styles.iconCircle}>
            <Ionicons name={icon as any} size={80} color="#FFF" />
          </View>
        </Animated.View>

        {/* Title */}
        <Text style={styles.title}>Pasikalayaa Sakthi? 🥹👉👈</Text>

        {/* Reminder Cards */}
        <View style={styles.reminderCard}>
          <Ionicons name="restaurant" size={24} color="#BB8FCE" />
          <Text style={styles.reminderText}>Time to eat</Text>
        </View>

        <View style={styles.reminderCard}>
          <Ionicons name="water" size={24} color="#3498DB" />
          <Text style={styles.reminderText}>Remember to drink water</Text>
        </View>

        {/* Princess Mode Line */}
        {princessMode && princessLine && (
          <View style={styles.princessCard}>
            <Ionicons name="sparkles" size={20} color="#BB8FCE" />
            <Text style={styles.princessLineText}>{princessLine}</Text>
          </View>
        )}

        {/* Buttons */}
        <TouchableOpacity style={styles.gotItButton} onPress={handleGotIt}>
          <Text style={styles.gotItText}>Got it!</Text>
          <Ionicons name="checkmark" size={24} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.ignoreButton} onPress={handleIgnore}>
          <Ionicons name="close" size={20} color="#BB8FCE" />
          <Text style={styles.ignoreText}>Ignore</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Skip Dialog - Manual Close Only */}
      <Modal
        visible={showSkipDialog}
        transparent
        animationType="fade"
        onRequestClose={closeSkipDialog}
      >
        <View style={styles.dialogOverlay}>
          <View style={styles.dialogCard}>
            <Text style={styles.dialogTitle}>Meal Skipped</Text>
            <Text style={styles.dialogMessage}>
              🙈 Vignesh kitta pottu kuduthaachu
            </Text>
            <TouchableOpacity
              style={styles.okayButton}
              onPress={closeSkipDialog}
            >
              <Text style={styles.okayText}>OKAY 😅</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A0A2E",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  content: {
    width: "100%",
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#9B59B6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#9B59B6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#BB8FCE",
    textAlign: "center",
    marginBottom: 32,
  },
  reminderCard: {
    backgroundColor: "#2D1B4E",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  reminderText: {
    fontSize: 18,
    color: "#FFF",
    marginLeft: 12,
    fontWeight: "500",
  },
  princessCard: {
    backgroundColor: "#2D1B4E",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#9B59B6",
    width: "100%",
  },
  princessLineText: {
    fontSize: 17,
    color: "#BB8FCE",
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 24,
    marginTop: 8,
  },
  gotItButton: {
    backgroundColor: "#9B59B6",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 16,
  },
  gotItText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
    marginRight: 8,
  },
  ignoreButton: {
    borderWidth: 2,
    borderColor: "#BB8FCE",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  ignoreText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#BB8FCE",
    marginLeft: 8,
  },
  dialogOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  dialogCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 32,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  dialogTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A0A2E",
    marginBottom: 16,
  },
  dialogMessage: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 26,
  },
  okayButton: {
    backgroundColor: "#9B59B6",
    borderRadius: 12,
    padding: 16,
    width: "100%",
  },
  okayText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
    textAlign: "center",
  },
});
