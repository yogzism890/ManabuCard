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

  // scale & opacity anim for the card
  const scale = useSharedValue(0.2);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 600 });
    opacity.value = withTiming(1, { duration: 600 });
  }, []);

  const cardAnim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <LinearGradient colors={["#F8FAF4", "#EEF2E6"]} style={styles.container}>
      <Animated.View style={[styles.card, cardAnim]}>
        {/* Title */}
        <Animated.Text entering={FadeInDown.delay(200).duration(600)} style={styles.title}>
          Hi Faiz
        </Animated.Text>

        {/* Start button */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/onboarding" as any)} 
          >
            <Text style={styles.buttonText}>Let’s Start</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer login */}
        <Animated.Text entering={FadeInDown.delay(600).duration(600)} style={styles.footer}>
          Already using ManabuCard?{" "}
          <Text style={styles.link} onPress={() => router.push("/auth/login" as any)}>
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
    paddingVertical: 32,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 28,
    width: "85%",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
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
    paddingVertical: 15,
    paddingHorizontal: 65,
    borderRadius: 30,
    marginBottom: 18,
    elevation: 6,
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
