import React, { useEffect } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  FadeInDown,
} from "react-native-reanimated";

export default function WelcomeScreen() {
  const router = useRouter();

  // Animations
  const scale = useSharedValue(0.3);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 600 });
    opacity.value = withTiming(1, { duration: 700 });
  }, []);

  const cardAnim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <LinearGradient colors={["#F8FAF4", "#EEF2E6"]} style={styles.container}>
      <Animated.View style={[styles.card, cardAnim]}>
        {/* Title */}
        <Animated.Text entering={FadeInDown.delay(300).duration(500)} style={styles.title}>
          Hi Buddy!
        </Animated.Text>

        {/* Button */}
        <Animated.View entering={FadeInDown.delay(550).duration(500)}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/(tabs)" as any)}
          >
            <Text style={styles.buttonText}>Let’s start</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer */}
        <Animated.Text entering={FadeInDown.delay(750).duration(500)} style={styles.footer}>
          Already using ManabuCard?{" "}
          <Text style={styles.link} onPress={() => router.push("/login" as any)}>
            Log in
          </Text>
        </Animated.Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    alignItems: "center",
    paddingHorizontal: 27,
    paddingVertical: 30,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 28,
    width: "85%",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { height: 4, width: 0 },
  },

  title: {
    fontSize: 42,
    fontFamily: "FredokaBold",
    color: "#222",
    marginBottom: 24,
  },

  button: {
    backgroundColor: "#3A7DFF",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 20,
    elevation: 4,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "FredokaBold",
  },

  footer: {
    color: "#777",
    fontSize: 15,
    fontFamily: "Fredoka",
  },

  link: {
    color: "#000",
    fontFamily: "FredokaBold",
  },
});
