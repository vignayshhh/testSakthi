import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function LaunchScreen() {
  const router = useRouter();
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const glowAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Rotation animation - 7 seconds
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 7000,
      useNativeDriver: true,
    }).start();

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Scale animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Glow pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1.15,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Navigate to home after 7 seconds
    const timer = setTimeout(() => {
      router.replace("/home");
    }, 7000);

    return () => clearTimeout(timer);
  }, [router, fadeAnim, glowAnim, rotateAnim, scaleAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      {/* Icon container with glow circle behind it */}
      <View style={styles.iconWrapper}>
        {/* Pulsing glow circle - ONLY around icon */}
        <Animated.View
          style={[
            styles.glowCircle,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.4],
              }),
              transform: [{ scale: glowAnim }],
            },
          ]}
        />

        {/* Icon with rotation - on top of glow */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              opacity: fadeAnim,
              transform: [{ rotate: spin }, { scale: scaleAnim }],
            },
          ]}
        >
          <Ionicons name="infinite" size={120} color="#E8D5F5" />
        </Animated.View>
      </View>

      {/* Text below icon - separated and brighter */}
      <Animated.View style={{ opacity: fadeAnim, marginTop: 60 }}>
        <Text style={styles.title}>SakthiCare</Text>
        <Text style={styles.tagline}>
          Daily Thanni Kudikka and{"\n"}
          Saapda Marandhuraadha Sakthiii
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A0A2E",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  iconWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 200,
  },
  glowCircle: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#9B59B6",
    shadowColor: "#BB8FCE",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    elevation: 20,
  },
  iconContainer: {
    position: "absolute",
    zIndex: 10,
  },
  title: {
    fontSize: 48,
    fontWeight: "700",
    color: "#E8D5F5", // Much brighter/whiter purple
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    fontWeight: "300",
    color: "#D4BDEB", // Brighter tagline color
    textAlign: "center",
    lineHeight: 24,
  },
});
