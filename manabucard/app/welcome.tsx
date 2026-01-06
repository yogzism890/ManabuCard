import React, { useEffect } from "react";
import { Text, TouchableOpacity, StyleSheet, View, Dimensions, Image } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  FadeInDown,
  withRepeat,
  withSequence,
  interpolate,
} from "react-native-reanimated";

const { height, width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const logoTranslateY = useSharedValue(0);
  const floatingValue = useSharedValue(0);

  useEffect(() => {
    floatingValue.value = withRepeat(
      withSequence(withTiming(1, { duration: 3000 }), withTiming(0, { duration: 3000 })),
      -1,
      true
    );
    logoTranslateY.value = withRepeat(
      withSequence(withTiming(-12, { duration: 2000 }), withTiming(0, { duration: 2000 })),
      -1,
      true
    );
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: logoTranslateY.value }],
  }));

  const createFloatingStyle = (offset: number) => useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(floatingValue.value, [0, 1], [0, offset]) }],
  }));

  return (
    <LinearGradient colors={["#F8FAFF", "#FFF9FD"]} style={styles.container}>
      {/* Background Decorative Circles */}
      <Animated.View style={[styles.circle, styles.circleBlue, createFloatingStyle(-25)]} />
      <Animated.View style={[styles.circle, styles.circlePink, createFloatingStyle(35)]} />

      <View style={styles.contentContainer}>
        {/* Logo Section */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={[styles.logoWrapper, animatedLogoStyle]}>
          <View style={styles.logoBackground}>
            <Image style={styles.logo} source={require('@/assets/images/manabulogo.png')} />
          </View>
        </Animated.View>

        {/* Text Section */}
        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.textGroup}>
          <Text style={styles.greeting}>START YOUR JOURNEY ✨</Text>
          <Text style={styles.title}>Belajar Jadi{"\n"}<Text style={styles.highlightText}>Lebih Asyik</Text></Text>
          <Text style={styles.subtitle}>
            Tingkatkan kemampuanmu dengan metode belajar yang seru dan interaktif setiap hari.
          </Text>
        </Animated.View>

        {/* Feature Grid */}
        <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.featureGrid}>
          <FeatureCard emoji="🎯" label="Terukur" color="#F0F5FF" />
          <FeatureCard emoji="🔥" label="Intensif" color="#FFF5F0" />
          <FeatureCard emoji="🌈" label="Kreatif" color="#F5F0FF" />
        </Animated.View>
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomSection}>
        <Animated.View entering={FadeInDown.delay(800).springify()}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/onboarding" as any)}
            style={styles.mainButton}
          >
            <LinearGradient colors={['#4E86FF', '#2D62ED']} style={styles.gradientButton}>
              <Text style={styles.buttonText}>Ayo Mulai!</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(1000)} style={styles.footer}>
          <Text style={styles.footerText}>Sudah punya akun? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/login" as any)}>
            <Text style={styles.loginLink}>Masuk</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const FeatureCard = ({ emoji, label, color }: { emoji: string; label: string; color: string }) => (
  <View style={[styles.card, { backgroundColor: color }]}>
    <Text style={styles.cardEmoji}>{emoji}</Text>
    <Text style={styles.cardLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  circle: { position: 'absolute', borderRadius: 1000, opacity: 0.3 },
  circleBlue: { width: 280, height: 280, backgroundColor: '#4E86FF', top: -40, right: -80 },
  circlePink: { width: 220, height: 220, backgroundColor: '#FF8ED4', bottom: 150, left: -60 },
  contentContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  logoWrapper: { marginBottom: 32 },
  logoBackground: {
    width: 140,
    height: 140,
    backgroundColor: '#FFF',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
  logo: { width: 90, height: 90, resizeMode: 'contain' },
  textGroup: { alignItems: 'center', marginBottom: 40 },
  greeting: {
    fontSize: 13,
    fontFamily: "Poppins_700Bold",
    color: "#4E86FF",
    letterSpacing: 2,
    marginBottom: 10,
  },
  title: {
    fontSize: 34,
    fontFamily: "Poppins_700Bold",
    color: "#1F2937",
    textAlign: 'center',
    lineHeight: 44,
  },
  highlightText: { color: "#4E86FF" },
  subtitle: {
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
    color: "#6B7280",
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
  featureGrid: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  card: {
    width: width * 0.24,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  cardEmoji: { fontSize: 24, marginBottom: 6 },
  cardLabel: { fontSize: 12, fontFamily: "Poppins_600SemiBold", color: "#374151" },
  bottomSection: { paddingHorizontal: 32, paddingBottom: 60 },
  mainButton: { borderRadius: 18, overflow: 'hidden' },
  gradientButton: { paddingVertical: 18, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 17, fontFamily: "Poppins_700Bold" },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 22 },
  footerText: { color: '#9CA3AF', fontFamily: "Poppins_400Regular", fontSize: 14 },
  loginLink: { color: '#4E86FF', fontFamily: "Poppins_600SemiBold", fontSize: 14 },
});