import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MEALS } from "../constants/meals";
import { getNextMeal } from "../utils/time";
import { getPrincessMode, setPrincessMode } from "../utils/storage";
import {
  requestNotificationPermissions,
  scheduleAllMealNotifications,
  getNotificationStatus,
  setupNotificationListeners,
  verifyNotificationIntegrity,
  testNotification,
} from "../utils/notifications";
import {
  showDiagnosticsAlert,
  runQuickTest,
} from "../utils/system-diagnostics";

export default function HomeScreen() {
  const router = useRouter();
  const [nextMealId, setNextMealId] = useState("");
  const [princessMode, setPrincessModeState] = useState(false);
  const [notificationGranted, setNotificationGranted] = useState(false);
  const [scheduledCount, setScheduledCount] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    initializeApp();

    const cleanupListeners = setupNotificationListeners(router);

    const interval = setInterval(() => {
      setNextMealId(getNextMeal());
    }, 60000); // Update every minute

    // Verify notification integrity every 5 minutes
    const integrityInterval = setInterval(async () => {
      await verifyNotificationIntegrity();
    }, 300000);

    return () => {
      clearInterval(interval);
      clearInterval(integrityInterval);
      cleanupListeners?.();
    };
  }, [router]);

  useEffect(() => {
    // Pulsing animation for next meal card
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [pulseAnim]);

  async function initializeApp() {
    // Load princess mode
    const mode = await getPrincessMode();
    setPrincessModeState(mode);

    // Determine next meal
    setNextMealId(getNextMeal());

    // Request notification permissions
    const granted = await requestNotificationPermissions();
    if (granted) {
      await scheduleAllMealNotifications();
      const status = await getNotificationStatus();
      setNotificationGranted(status.granted);
      setScheduledCount(status.scheduledCount);
    }
  }

  async function togglePrincessMode(value: boolean) {
    setPrincessModeState(value);
    await setPrincessMode(value);
  }

  async function testAlarm() {
    // Test both notification and alarm screen
    await testNotification();
    router.push("/alarm?test=true&mealId=dinner");
  }

  async function runDiagnostics() {
    await showDiagnosticsAlert();
  }

  async function runQuickSystemTest() {
    const success = await runQuickTest();
    if (success) {
      Alert.alert("✅ Quick Test", "All systems are working correctly!");
    } else {
      Alert.alert(
        "❌ Quick Test",
        "Some issues detected. Check diagnostics for details.",
      );
    }
  }

  function openSoundSelection() {
    router.push("/sound-selection");
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="infinite" size={32} color="#BB8FCE" />
            <Text style={styles.headerTitle}>Pasikalayaa Sakthi</Text>
          </View>
          <TouchableOpacity
            style={styles.soundButton}
            onPress={openSoundSelection}
          >
            <Ionicons name="musical-notes" size={24} color="#BB8FCE" />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>Daily Schedule</Text>

        {/* Princess Mode Toggle */}
        <View style={styles.princessCard}>
          <View style={styles.princessHeader}>
            <Ionicons name="sparkles" size={24} color="#BB8FCE" />
            <Text style={styles.princessTitle}>Princess Mode</Text>
          </View>
          <Text style={styles.princessDescription}>
            Get wholesome motivational messages with each reminder
          </Text>

          {/* Custom Beautiful Toggle */}
          <TouchableOpacity
            style={[
              styles.customToggle,
              princessMode && styles.customToggleActive,
            ]}
            onPress={() => togglePrincessMode(!princessMode)}
            activeOpacity={0.8}
          >
            <Animated.View
              style={[
                styles.toggleThumb,
                princessMode && styles.toggleThumbActive,
              ]}
            >
              <Ionicons
                name={princessMode ? "heart" : "heart-outline"}
                size={20}
                color={princessMode ? "#FFF" : "#888"}
              />
            </Animated.View>
            <Text
              style={[
                styles.toggleText,
                princessMode && styles.toggleTextActive,
              ]}
            >
              {princessMode ? "ON" : "OFF"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Meal Cards */}
        {MEALS.map((meal, index) => {
          const isNext = meal.id === nextMealId;

          return (
            <Animated.View
              key={meal.id}
              style={[
                styles.mealCard,
                isNext && styles.mealCardNext,
                isNext && {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <View style={styles.mealLeft}>
                <View
                  style={[styles.iconCircle, { backgroundColor: meal.color }]}
                >
                  <Ionicons name={meal.icon as any} size={32} color="#FFF" />
                </View>
                <View style={styles.mealInfo}>
                  <Text style={styles.mealName}>{meal.name}</Text>
                  <Text style={styles.mealTime}>{meal.time}</Text>
                  <Text style={styles.mealDescription}>{meal.description}</Text>
                </View>
              </View>
              <View style={styles.waterBadge}>
                <Ionicons name="water" size={24} color="#3498DB" />
              </View>
            </Animated.View>
          );
        })}

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#BB8FCE" />
          <Text style={styles.infoText}>
            You&apos;ll receive a gentle notification 10 minutes before each
            meal, followed by a reminder at the exact time. Stay hydrated and
            nourished!
          </Text>
        </View>

        {/* Notification Status */}
        <View style={styles.statusCard}>
          <Ionicons
            name={notificationGranted ? "checkmark-circle" : "close-circle"}
            size={24}
            color={notificationGranted ? "#27AE60" : "#E74C3C"}
          />
          <Text style={styles.statusText}>
            Notifications {notificationGranted ? "Active" : "Inactive"}
            {scheduledCount > 0 && ` (${scheduledCount} scheduled)`}
          </Text>
        </View>

        {/* Test Alarm Button */}
        <TouchableOpacity style={styles.testButton} onPress={testAlarm}>
          <Ionicons name="alarm" size={24} color="#FFF" />
          <Text style={styles.testButtonText}>Test Alarm Screen</Text>
        </TouchableOpacity>

        {/* Diagnostics Buttons */}
        <TouchableOpacity
          style={styles.diagnosticsButton}
          onPress={runQuickSystemTest}
        >
          <Ionicons name="checkmark-circle" size={24} color="#FFF" />
          <Text style={styles.testButtonText}>Quick System Test</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.diagnosticsButton}
          onPress={runDiagnostics}
        >
          <Ionicons name="medical" size={24} color="#FFF" />
          <Text style={styles.testButtonText}>Full Diagnostics</Text>
        </TouchableOpacity>

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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#BB8FCE",
    marginLeft: 12,
  },
  soundButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2D1B4E",
    alignItems: "center",
    justifyContent: "center",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 20,
  },
  princessCard: {
    backgroundColor: "#2D1B4E",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#9B59B6",
  },
  princessHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  princessTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#BB8FCE",
    marginLeft: 8,
  },
  princessDescription: {
    fontSize: 14,
    color: "#BB8FCE",
    marginBottom: 16,
    opacity: 0.8,
  },
  customToggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A0A2E",
    borderRadius: 30,
    padding: 4,
    width: 100,
    height: 44,
    borderWidth: 2,
    borderColor: "#444",
  },
  customToggleActive: {
    backgroundColor: "#9B59B6",
    borderColor: "#BB8FCE",
  },
  toggleThumb: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  toggleThumbActive: {
    backgroundColor: "#FFF",
    marginLeft: 48,
    marginRight: 0,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#666",
    position: "absolute",
    right: 12,
  },
  toggleTextActive: {
    color: "#FFF",
    left: 12,
    right: "auto",
  },
  mealCard: {
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
  mealCardNext: {
    borderColor: "#9B59B6",
    backgroundColor: "#3D2B5E",
    shadowColor: "#BB8FCE",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  mealLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  mealInfo: {
    marginLeft: 16,
    flex: 1,
  },
  mealName: {
    fontSize: 22,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
  },
  mealTime: {
    fontSize: 16,
    fontWeight: "400",
    color: "#BB8FCE",
    marginBottom: 4,
  },
  mealDescription: {
    fontSize: 14,
    color: "#888",
  },
  waterBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1A3A52",
    alignItems: "center",
    justifyContent: "center",
  },
  infoCard: {
    backgroundColor: "#2D1B4E",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#BB8FCE",
    marginLeft: 12,
    lineHeight: 20,
  },
  statusCard: {
    backgroundColor: "#2D1B4E",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 16,
    color: "#FFF",
    marginLeft: 12,
    fontWeight: "500",
  },
  testButton: {
    backgroundColor: "#9B59B6",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  testButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    marginLeft: 12,
  },
  diagnosticsButton: {
    backgroundColor: "#3498DB",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 16,
  },
});
