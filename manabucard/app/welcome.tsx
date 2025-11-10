import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Karakter di belakang teks */}
      <Image
        source={require("../assets/images/img_welcome.png")}
        style={styles.image}
      />

      {/* Konten di atas karakter */}
      <View style={styles.content}>
        <Text style={styles.title}>Hi Buddy!</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(tabs)" as any)}
        >
          <Text style={styles.buttonText}>{'Let\'s start'}</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Already using ManabuCard?{" "}
          <Text style={styles.link} onPress={() => router.push("/login" as any)}>
            Log in
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F4EC", // warna dasar lembut
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    position: "absolute",
    bottom: 200, // geser sedikit ke bawah biar kayak latar
    width: 450,
    height: 450,
    resizeMode: "contain",
    zIndex: 0, // di belakang teks
  },
  content: {
    alignItems: "center",
    zIndex: 1, // teks dan tombol di atas gambar
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
