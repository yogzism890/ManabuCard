import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, StyleProp, ViewStyle, ImageStyle, TextStyle } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#F8FAF4", "#EEF2E6"]}
      style={styles.container}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: 270,
    resizeMode: "contain",
    marginTop: 40,
  },

  card: {
    marginTop: 10,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 28,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 25,
    width: "85%",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { height: 4, width: 0 },
  },

  title: {
    fontSize: 40,
    fontWeight: "800",
    color: "#222",
    marginBottom: 20,
    fontFamily: "FredokaOne-Regular", // childish font (optional)
  },

  button: {
    backgroundColor: "#3A7DFF",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 28,
    marginBottom: 20,
    elevation: 4,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  footer: {
    color: "#777",
    fontSize: 15,
  },

  link: {
    color: "#000",
    fontWeight: "bold",
  },
});
