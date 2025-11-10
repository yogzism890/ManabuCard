import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Gambar karakter */}
      <Image source={require("../assets/images/buddy1.png")} style={styles.image} />

      {/* Judul */}
      <Text style={styles.title}>Hi Buddy!</Text>

      {/* Tombol start */}
      <TouchableOpacity style={styles.button} onPress={() => router.push("/(tabs)" as any)}>
        <Text style={styles.buttonText}>{`Let's start`}</Text>
      </TouchableOpacity>

      {/* Footer */}
      <Text style={styles.footer}>
        Already using ManabuCard?{" "}
        <Text style={styles.link} onPress={() => router.push("/login" as any)}>
          Log in
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F4EC",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#555",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  footer: {
    marginTop: 18,
    color: "#555",
  },
  link: {
    color: "#000",
    fontWeight: "bold",
  },
});
