import React, { useEffect } from "react";
import { Text, TouchableOpacity, StyleSheet, Image, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  FadeInDown,
} from "react-native-reanimated";

// Dapatkan dimensi layar untuk penempatan logo yang responsif
const { height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  // scale & opacity anim for the card
  const scale = useSharedValue(0.2);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Animasi munculnya kartu
    scale.value = withTiming(1, { duration: 600 });
    opacity.value = withTiming(1, { duration: 600 });
  }, []);

  const cardAnim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    // Latar belakang gradasi yang lebih halus
    <LinearGradient colors={["#F0F4F7", "#E0E7EB"]} style={styles.container}>
      
      
      <Animated.Image
        entering={FadeInDown.delay(100).duration(800)}
        source={require('@/assets/images/manabulogo.png')} 
      />

      {/* 2. Kartu Selamat Datang - Menggunakan Animasi Skala */}
      <Animated.View style={[styles.card, cardAnim]}>
        
        {/* Title */}
        <Animated.Text entering={FadeInDown.delay(200).duration(600)} style={styles.title}>
          Hi Faiz
        </Animated.Text>
        
        {/* Subtitle/Greeting tambahan untuk konteks */}
        <Animated.Text entering={FadeInDown.delay(300).duration(600)} style={styles.subtitle}>
          Selamat datang kembali di ManabuCard!
        </Animated.Text>


        {/* Start button - Tetap dengan warna biru #3A7DFF */}
        <Animated.View entering={FadeInDown.delay(500).duration(600)}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/onboarding" as any)} 
            activeOpacity={0.8} // Tambahkan efek saat disentuh
          >
            <Text style={styles.buttonText}>Let’s Start</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer login - Link "Log in" dibuat lebih menonjol */}
        <Animated.Text entering={FadeInDown.delay(700).duration(600)} style={styles.footer}>
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
  // Style untuk Logo
  logo: {
    width: 100, // Ukuran logo disesuaikan
    height: 100, // Ukuran logo disesuaikan
    resizeMode: 'contain',
    marginBottom: height * 0.04, // Jarak responsif ke kartu
  },
  card: {
    alignItems: "center",
    paddingHorizontal: 30, // Sedikit diperlebar
    paddingVertical: 40,   // Sedikit ditinggikan
    backgroundColor: "#FFFFFF", // Warna putih murni
    borderRadius: 20, // Sedikit lebih melengkung
    width: "88%", // Sedikit diperlebar
    // Bayangan (Shadow) yang lebih lembut dan modern (Neumorphism-like)
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { height: 10, width: 0 },
    elevation: 8,
  },
  title: {
    fontSize: 38, // Sedikit dikecilkan agar seimbang
    fontFamily: "FredokaBold",
    color: "#222",
    marginBottom: 8,
  },
  // Style baru untuk Subtitle
  subtitle: {
    fontSize: 16,
    fontFamily: "Fredoka",
    color: "#777",
    textAlign: 'center',
    marginBottom: 35, // Jarak ke tombol
  },
  button: {
    backgroundColor: "#3A7DFF", // Tetap warna biru
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 12, // Sedikit lebih kotak untuk kesan modern
    marginBottom: 20,
    // Bayangan tombol agar terlihat 'mengangkat'
    shadowColor: "#3A7DFF",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { height: 4, width: 0 },
    elevation: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "FredokaBold",
    letterSpacing: 0.5, // Tambahkan sedikit jarak antar huruf
  },
  footer: {
    color: "#777",
    fontSize: 14,
    fontFamily: "Fredoka",
  },
  link: {
    color: "#3A7DFF", // Mengubah warna link menjadi biru (warna aksen)
    fontFamily: "FredokaBold",
  },
});