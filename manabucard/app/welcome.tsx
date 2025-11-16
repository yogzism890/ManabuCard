import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, StyleProp, ViewStyle, ImageStyle, TextStyle } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#F8FAF4", "#EEF2E6"]}
      style={styles.container as StyleProp<ViewStyle>}
    >
      {/* Gambar Karakter */}
      <Image
        source={require("../assets/images/img_welcome.png")}
        style={styles.image}
      />

      {/* Card Konten */}
      <View style={styles.card}>
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
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create<{
  container: ViewStyle;
  image: ImageStyle;
  card: ViewStyle;
  title: TextStyle;
  button: ViewStyle;
  buttonText: TextStyle;
  footer: TextStyle;
  link: TextStyle;
}>({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    position: "absolute",
    bottom: 120,
    width: "88%",
    height: 320,
    resizeMode: "contain",
    opacity: 0.95,
  },

  card: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 28,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 25,
    width: "80%",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: {
      height: 4,
      width: 0
    },
  },

  title: {
    fontSize: 38,
    fontWeight: "800",
    color: "#222",
    marginBottom: 24,
  },

  button: {
    backgroundColor: "#444",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 28,
    elevation: 3,
    marginBottom: 20,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  footer: {
    color: "#666",
    fontSize: 15,
  },

  link: {
    color: "#000",
    fontWeight: "bold",
  },
});
