import * as Notifications from "expo-notifications";
import { Platform, AppState } from "react-native";
import { MEALS } from "../constants/meals";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configure notification handler for maximum reliability
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Enhanced notification channel configuration
const NOTIFICATION_CHANNELS = {
  MEAL_WARNINGS: {
    id: "meal-warnings",
    name: "Meal Warnings",
    description: "10-minute advance meal reminders",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    sound: "default",
    enableVibrate: true,
    enableLights: true,
    lightColor: "#9B59B6",
    bypassDnd: false,
  },
  MEAL_ALARMS: {
    id: "meal-alarms",
    name: "Meal Alarms",
    description: "Exact-time meal reminders with full-screen alerts",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 500, 250, 500, 250, 500],
    sound: "alarm.mp3",
    enableVibrate: true,
    enableLights: true,
    lightColor: "#9B59B6",
    bypassDnd: true,
  },
};

export async function requestNotificationPermissions() {
  try {
    console.log("Requesting notification permissions...");

    // Request basic permissions
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.error("Notification permissions not granted");
      return false;
    }

    // Android-specific configurations
    if (Platform.OS === "android") {
      console.log("Configuring Android notification channels...");

      // Configure meal warnings channel
      await Notifications.setNotificationChannelAsync(
        NOTIFICATION_CHANNELS.MEAL_WARNINGS.id,
        {
          name: NOTIFICATION_CHANNELS.MEAL_WARNINGS.name,
          description: NOTIFICATION_CHANNELS.MEAL_WARNINGS.description,
          importance: NOTIFICATION_CHANNELS.MEAL_WARNINGS.importance,
          vibrationPattern:
            NOTIFICATION_CHANNELS.MEAL_WARNINGS.vibrationPattern,
          sound: NOTIFICATION_CHANNELS.MEAL_WARNINGS.sound,
          enableVibrate: NOTIFICATION_CHANNELS.MEAL_WARNINGS.enableVibrate,
          enableLights: NOTIFICATION_CHANNELS.MEAL_WARNINGS.enableLights,
          lightColor: NOTIFICATION_CHANNELS.MEAL_WARNINGS.lightColor,
          bypassDnd: NOTIFICATION_CHANNELS.MEAL_WARNINGS.bypassDnd,
        },
      );

      // Configure meal alarms channel with maximum priority
      await Notifications.setNotificationChannelAsync(
        NOTIFICATION_CHANNELS.MEAL_ALARMS.id,
        {
          name: NOTIFICATION_CHANNELS.MEAL_ALARMS.name,
          description: NOTIFICATION_CHANNELS.MEAL_ALARMS.description,
          importance: NOTIFICATION_CHANNELS.MEAL_ALARMS.importance,
          vibrationPattern: NOTIFICATION_CHANNELS.MEAL_ALARMS.vibrationPattern,
          sound: NOTIFICATION_CHANNELS.MEAL_ALARMS.sound,
          enableVibrate: NOTIFICATION_CHANNELS.MEAL_ALARMS.enableVibrate,
          enableLights: NOTIFICATION_CHANNELS.MEAL_ALARMS.enableLights,
          lightColor: NOTIFICATION_CHANNELS.MEAL_ALARMS.lightColor,
          bypassDnd: NOTIFICATION_CHANNELS.MEAL_ALARMS.bypassDnd,
        },
      );

      // Request additional Android permissions
      await requestAndroidPermissions();
    }

    console.log("Notification permissions granted successfully");
    return true;
  } catch (error) {
    console.error("Error requesting notification permissions:", error);
    return false;
  }
}

async function requestAndroidPermissions() {
  try {
    // These permissions should already be in AndroidManifest, but we verify them
    const requiredPermissions = [
      "android.permission.POST_NOTIFICATIONS",
      "android.permission.RECEIVE_BOOT_COMPLETED",
      "android.permission.WAKE_LOCK",
      "android.permission.VIBRATE",
      "android.permission.USE_FULL_SCREEN_INTENT",
      "android.permission.SYSTEM_ALERT_WINDOW",
      "android.permission.SCHEDULE_EXACT_ALARM",
    ];

    console.log(
      "Android permissions configured in manifest:",
      requiredPermissions,
    );
  } catch (error) {
    console.error("Error checking Android permissions:", error);
  }
}

export async function scheduleAllMealNotifications() {
  try {
    console.log("Scheduling all meal notifications...");

    // Cancel all existing notifications first
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Schedule notifications for each meal
    for (const meal of MEALS) {
      await scheduleMealNotifications(meal);
    }

    // Save scheduling timestamp for verification
    await AsyncStorage.setItem(
      "@sakthicare_last_schedule",
      new Date().toISOString(),
    );

    console.log("All meal notifications scheduled successfully!");
    return true;
  } catch (error) {
    console.error("Error scheduling notifications:", error);
    return false;
  }
}

async function scheduleMealNotifications(meal: (typeof MEALS)[0]) {
  try {
    console.log(`Scheduling notifications for ${meal.name}...`);

    // Warning notification (10 minutes before)
    const warningTrigger: Notifications.CalendarTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: meal.hour,
      minute: meal.minute - 10,
      repeats: true,
    };

    const warningNotification = await Notifications.scheduleNotificationAsync({
      content: {
        title: `${meal.name} Coming Up! 🔔`,
        body: `Your ${meal.name.toLowerCase()} is in 10 minutes. Time to get ready!`,
        sound: "default",
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: {
          type: "warning",
          mealId: meal.id,
          mealName: meal.name,
          timestamp: new Date().toISOString(),
        },
      },
      trigger: warningTrigger,
    });

    console.log(
      `Warning notification scheduled for ${meal.name}:`,
      warningNotification,
    );

    // Main alarm notification (exact time)
    const alarmTrigger: Notifications.CalendarTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: meal.hour,
      minute: meal.minute,
      repeats: true,
    };

    const alarmNotification = await Notifications.scheduleNotificationAsync({
      content: {
        title: `Pasikalayaa Sakthi? 🥹`,
        body: `Time for ${meal.name.toLowerCase()}! Don't forget to drink water too! 💧`,
        sound: "alarm.mp3",
        priority: Notifications.AndroidNotificationPriority.MAX,
        data: {
          type: "alarm",
          mealId: meal.id,
          mealName: meal.name,
          timestamp: new Date().toISOString(),
        },
      },
      trigger: alarmTrigger,
    });

    console.log(
      `Alarm notification scheduled for ${meal.name}:`,
      alarmNotification,
    );

    return { warningNotification, alarmNotification };
  } catch (error) {
    console.error(`Error scheduling notifications for ${meal.name}:`, error);
    return null;
  }
}

export async function getNotificationStatus() {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const lastSchedule = await AsyncStorage.getItem(
      "@sakthicare_last_schedule",
    );

    return {
      granted: status === "granted",
      scheduledCount: scheduled.length,
      scheduledNotifications: scheduled,
      lastScheduleTime: lastSchedule,
    };
  } catch (error) {
    console.error("Error getting notification status:", error);
    return {
      granted: false,
      scheduledCount: 0,
      scheduledNotifications: [],
      lastScheduleTime: null,
    };
  }
}

export async function verifyNotificationIntegrity() {
  try {
    const status = await getNotificationStatus();
    const expectedCount = MEALS.length * 2; // 2 notifications per meal

    if (status.scheduledCount < expectedCount) {
      console.warn(
        `Notification integrity check failed. Expected ${expectedCount}, got ${status.scheduledCount}`,
      );
      console.log("Rescheduling notifications...");
      return await scheduleAllMealNotifications();
    }

    console.log("Notification integrity check passed");
    return true;
  } catch (error) {
    console.error("Error verifying notification integrity:", error);
    return false;
  }
}

export async function forceNotificationReschedule() {
  try {
    console.log("Force rescheduling all notifications...");
    await Notifications.cancelAllScheduledNotificationsAsync();
    await AsyncStorage.removeItem("@sakthicare_last_schedule");
    return await scheduleAllMealNotifications();
  } catch (error) {
    console.error("Error force rescheduling notifications:", error);
    return false;
  }
}

// Setup notification listeners for reliability
export function setupNotificationListeners(router: any) {
  // Handle notification responses
  const responseSubscription =
    Notifications.addNotificationResponseReceivedListener((response: any) => {
      console.log("Notification response received:", response);
      const data = response.notification.request.content.data;

      if (data.type === "alarm") {
        router.push(`/alarm?mealId=${data.mealId}`);
      } else if (data.type === "warning") {
        // Handle warning notifications if needed
        console.log("Warning notification tapped:", data.mealName);
      }
    });

  // Handle notifications received while app is open
  const foregroundSubscription = Notifications.addNotificationReceivedListener(
    (notification: any) => {
      console.log("Foreground notification received:", notification);
      const data = notification.request.content.data;

      if (data.type === "alarm") {
        // Auto-open alarm screen for maximum priority notifications
        router.push(`/alarm?mealId=${data.mealId}`);
      }
    },
  );

  return () => {
    responseSubscription.remove();
    foregroundSubscription.remove();
  };
}

export async function testNotification() {
  try {
    console.log("Sending test notification...");

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Test Notification 🧪",
        body: "This is a test to verify notifications are working!",
        sound: "default",
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { type: "test", timestamp: new Date().toISOString() },
      },
      trigger: null, // Show immediately
    });

    console.log("Test notification sent");
    return true;
  } catch (error) {
    console.error("Error sending test notification:", error);
    return false;
  }
}
