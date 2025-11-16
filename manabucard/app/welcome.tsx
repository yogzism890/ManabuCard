import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, StyleProp, ViewStyle, ImageStyle, TextStyle } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={["#F8FAF4", "#EEF2E6"]} style={styles.container}>
      {/* Card Box */}
      <Animated.View entering={FadeInDown.duration(600)} style={styles.card}>
        <Text style={styles.title}>Hi Buddy!</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(tabs)" as any)}
        >
          <Text style={styles.buttonText}>Let’s start</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Already using ManabuCard?{" "}
          <Text style={styles.link} onPress={() => router.push("/login" as any)}>
            Log in
          </Text>
        </Text>
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