import React from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
const CARD_W = (width - 54) / 2;

const LandingScreen = () => {
  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["#FFF8E7", "#FFF0F5", "#E8F4FF"]}
          style={styles.gradientBackground}
        >
          {/* Floating decorative emojis */}
          <Animated.Text
            entering={FadeIn.delay(200)}
            style={[styles.floatingEmoji, styles.emoji1]}
          >
            ⭐
          </Animated.Text>
          <Animated.Text
            entering={FadeIn.delay(400)}
            style={[styles.floatingEmoji, styles.emoji3]}
          >
            💡
          </Animated.Text>
          <Animated.Text
            entering={FadeIn.delay(500)}
            style={[styles.floatingEmoji, styles.emoji4]}
          >
            📚
          </Animated.Text>

          {/* Decorative circles */}
          <View style={[styles.decorativeCircle, styles.circle1]} />
          <View style={[styles.decorativeCircle, styles.circle2]} />
          <View style={[styles.decorativeCircle, styles.circle3]} />

          {/* Top mini header */}
          <Animated.View
            entering={FadeInDown.delay(80).duration(600)}
            style={styles.topHeader}
          >
            <View style={styles.topBadge}>
              <Text style={styles.topBadgeText}>ManabuCard</Text>
              <Text style={styles.topDot}>•</Text>
              <Text style={styles.topBadgeTextMuted}>Flashcard Pintar</Text>
            </View>

            <View style={styles.topHint}>
              <Text style={styles.topHintText}>Mulai cepat</Text>
              <Text style={styles.topHintEmoji}>⚡</Text>
            </View>
          </Animated.View>

          {/* Hero Section */}
          <Animated.View
            entering={FadeInDown.delay(120).duration(650)}
            style={styles.heroSection}
          >
            <View style={styles.heroIconContainer}>
              <View style={styles.heroIcon}>
                <Image
                  source={require("../../assets/images/logo.png")}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.heroIconBorder} />
            </View>

            <View style={styles.heroTitleContainer}>
              <Text style={styles.heroEmoji}>✨</Text>
              <Text style={styles.heroTitle}>Halo, Faiz!</Text>
            </View>

            <Text style={styles.heroSubtitle}>
              Belajar jadi lebih seru dan mudah dengan kartu pintar ManabuCard.
              Tingkatkan ingatanmu dengan pengulangan cerdas! 🎯
            </Text>

            {/* Primary CTA (Link as button) */}
            <Link href="/(tabs)/review" asChild>
              <TouchableOpacity activeOpacity={0.9} style={styles.heroButton}>
                <LinearGradient
                  colors={["#3A7DFF", "#5B93FF", "#7DA9FF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.heroButtonGradient}
                >
                  <View style={styles.heroButtonLeft}>
                    <Text style={styles.heroButtonText}>Mulai Belajar</Text>
                    <Text style={styles.heroButtonSub}>Review kartu sekarang</Text>
                  </View>
                  <View style={styles.heroButtonIconWrap}>
                    <Text style={styles.heroButtonIcon}>🚀</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Link>

            {/* Secondary CTA */}
            <Link href="/(tabs)/create" asChild>
              <TouchableOpacity activeOpacity={0.9} style={styles.heroGhostBtn}>
                <Text style={styles.heroGhostText}>Buat Kartu Baru ✨</Text>
              </TouchableOpacity>
            </Link>
          </Animated.View>

          {/* Features Section */}
          <View style={styles.section}>
            <Animated.View
              entering={FadeInDown.delay(220).duration(600)}
              style={styles.sectionHeader}
            >
              <Text style={styles.sectionTitle}>Fitur Utama</Text>
              <Text style={styles.sectionSubtitle}>
                Dirancang biar belajarmu lebih konsisten
              </Text>
            </Animated.View>

            <View style={styles.featureGrid}>
              <Animated.View
                entering={FadeInDown.delay(260).duration(600)}
                style={styles.featureCardWrapper}
              >
                <View style={[styles.featureCard, styles.glassCard]}>
                  <View style={styles.featureIconBubble}>
                    <Text style={styles.featureIcon}>📚</Text>
                  </View>
                  <Text style={styles.featureTitle}>Koleksi Pintar</Text>
                  <Text style={styles.featureDescription}>
                    Kelompokkan kartu belajar dalam koleksi yang rapi.
                  </Text>
                </View>
              </Animated.View>

              <Animated.View
                entering={FadeInDown.delay(300).duration(600)}
                style={styles.featureCardWrapper}
              >
                <View style={[styles.featureCard, styles.glassCard]}>
                  <View style={styles.featureIconBubble}>
                    <Text style={styles.featureIcon}>🔄</Text>
                  </View>
                  <Text style={styles.featureTitle}>Ulang Cerdas</Text>
                  <Text style={styles.featureDescription}>
                    Sistem tahu kapan kamu perlu mengulang.
                  </Text>
                </View>
              </Animated.View>

              <Animated.View
                entering={FadeInDown.delay(340).duration(600)}
                style={styles.featureCardWrapper}
              >
                <View style={[styles.featureCard, styles.glassCard]}>
                  <View style={styles.featureIconBubble}>
                    <Text style={styles.featureIcon}>📊</Text>
                  </View>
                  <Text style={styles.featureTitle}>Pantau Progress</Text>
                  <Text style={styles.featureDescription}>
                    Lihat perkembangan belajarmu secara jelas.
                  </Text>
                </View>
              </Animated.View>

              <Animated.View
                entering={FadeInDown.delay(380).duration(600)}
                style={styles.featureCardWrapper}
              >
                <View style={[styles.featureCard, styles.glassCard]}>
                  <View style={styles.featureIconBubble}>
                    <Text style={styles.featureIcon}>🎯</Text>
                  </View>
                  <Text style={styles.featureTitle}>Belajar Santai</Text>
                  <Text style={styles.featureDescription}>
                    Atur ritme belajar sesuai kemampuanmu.
                  </Text>
                </View>
              </Animated.View>
            </View>
          </View>

          {/* How It Works Section */}
          <View style={styles.section}>
            <Animated.View
              entering={FadeInDown.delay(430).duration(600)}
              style={styles.sectionHeader}
            >
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionEmoji}>💡</Text>
                <Text style={styles.sectionTitle}>Cara Kerja</Text>
              </View>
              <Text style={styles.sectionSubtitle}>3 langkah simpel</Text>
            </Animated.View>

            <View style={styles.stepContainer}>
              {[
                {
                  n: 1,
                  t: "Buat Koleksi",
                  d: "Mulai dengan topik yang ingin kamu kuasai.",
                  e: "🎨",
                },
                {
                  n: 2,
                  t: "Tambah Kartu",
                  d: "Isi pertanyaan & jawaban singkat yang mudah diingat.",
                  e: "✏️",
                },
                {
                  n: 3,
                  t: "Belajar & Ulang",
                  d: "Review rutin, sistem bantu ingatanmu lebih kuat.",
                  e: "🚀",
                },
              ].map((s, idx) => (
                <Animated.View
                  key={s.n}
                  entering={FadeInDown.delay(500 + idx * 60).duration(600)}
                  style={[styles.step, styles.glassCard]}
                >
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{s.n}</Text>
                  </View>

                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>
                      {s.e} {s.t}
                    </Text>
                    <Text style={styles.stepDescription}>{s.d}</Text>
                  </View>
                </Animated.View>
              ))}
            </View>
          </View>

          {/* CTA Section */}
          <Animated.View
            entering={FadeInDown.delay(700).duration(650)}
            style={styles.ctaSection}
          >
            <View style={[styles.ctaCard, styles.glassCard]}>
              <Text style={styles.ctaEmoji}>🎉</Text>
              <Text style={styles.ctaTitle}>Siap jadi lebih jago?</Text>
              <Text style={styles.ctaSubtitle}>
                Mulai dari 1 koleksi kecil hari ini, lalu konsisten tiap hari.
              </Text>

              <Link href="/(tabs)/create" asChild>
                <TouchableOpacity activeOpacity={0.9} style={styles.primaryButton}>
                  <LinearGradient
                    colors={["#3A7DFF", "#5B93FF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.primaryButtonGradient}
                  >
                    <Text style={styles.primaryButtonText}>Buat Kartu</Text>
                    <Text style={styles.buttonEmoji}>✨</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Link>

              <Link href="/(tabs)/review" asChild>
                <TouchableOpacity activeOpacity={0.9} style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Mulai Review 🚀</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </Animated.View>

          <View style={{ height: 36 }} />
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFF8E7" },
  container: { flex: 1, backgroundColor: "#FFF8E7" },
  gradientBackground: { flex: 1 },

  // Floating emojis
  floatingEmoji: {
    position: "absolute",
    fontSize: 32,
    opacity: 0.22,
    zIndex: 1,
  },
  emoji1: { top: height * 0.08, left: width * 0.08 },
  emoji3: { top: height * 0.55, left: width * 0.1 },
  emoji4: { top: height * 0.75, right: width * 0.12 },

  // Decorative circles
  decorativeCircle: {
    position: "absolute",
    borderRadius: 1000,
    opacity: 0.07,
    zIndex: 0,
  },
  circle1: {
    width: 220,
    height: 220,
    backgroundColor: "#FFE8E8",
    top: height * 0.13,
    left: -70,
  },
  circle2: {
    width: 190,
    height: 190,
    backgroundColor: "#E8F5FF",
    top: height * 0.45,
    right: -55,
  },
  circle3: {
    width: 170,
    height: 170,
    backgroundColor: "#FFF4E0",
    top: height * 0.72,
    left: -50,
  },

  // Top header
  topHeader: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 10 : 6,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  topBadgeText: {
    fontFamily: "FredokaBold",
    fontSize: 13,
    color: "#0F172A",
  },
  topDot: { marginHorizontal: 6, opacity: 0.45, color: "#0F172A" },
  topBadgeTextMuted: {
    fontFamily: "Fredoka",
    fontSize: 13,
    color: "#475569",
  },
  topHint: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(58,125,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(58,125,255,0.18)",
  },
  topHintText: { fontFamily: "FredokaBold", fontSize: 13, color: "#3A7DFF" },
  topHintEmoji: { marginLeft: 6 },

  // Hero
  heroSection: {
    alignItems: "center",
    paddingTop: 26,
    paddingBottom: 34,
    paddingHorizontal: 20,
  },

  heroIconContainer: { position: "relative", marginBottom: 18 },
  heroIcon: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: "rgba(255,255,255,0.85)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#3A7DFF",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 9,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
  },
  heroIconBorder: {
    position: "absolute",
    width: 122,
    height: 122,
    borderRadius: 61,
    borderWidth: 2,
    borderColor: "rgba(58,125,255,0.35)",
    top: -5,
    left: -5,
  },
  logoImage: { width: 92, height: 92 },

  heroTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  heroEmoji: { fontSize: 30, marginRight: 8 },
  heroTitle: {
    fontSize: 34,
    fontFamily: "FredokaBold",
    color: "#0F172A",
    textAlign: "center",
    letterSpacing: 0.2,
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: "Fredoka",
    color: "#475569",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 18,
    paddingHorizontal: 10,
  },

  heroButton: {
    width: "100%",
    borderRadius: 22,
    overflow: "hidden",
    shadowColor: "#3A7DFF",
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { height: 8, width: 0 },
    elevation: 8,
    marginTop: 6,
  },
  heroButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  heroButtonLeft: { flex: 1 },
  heroButtonText: {
    color: "#fff",
    fontSize: 17,
    fontFamily: "FredokaBold",
  },
  heroButtonSub: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    marginTop: 4,
    fontFamily: "Fredoka",
  },
  heroButtonIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  heroButtonIcon: { fontSize: 20 },

  heroGhostBtn: {
    width: "100%",
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.65)",
    borderWidth: 1,
    borderColor: "rgba(58,125,255,0.18)",
  },
  heroGhostText: {
    fontFamily: "FredokaBold",
    fontSize: 15,
    color: "#3A7DFF",
  },

  // Section base
  section: {
    paddingTop: 10,
    paddingBottom: 26,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitleRow: { flexDirection: "row", alignItems: "center" },
  sectionEmoji: { fontSize: 22, marginRight: 8 },
  sectionTitle: {
    fontSize: 24,
    fontFamily: "FredokaBold",
    color: "#0F172A",
  },
  sectionSubtitle: {
    marginTop: 6,
    fontSize: 13,
    fontFamily: "Fredoka",
    color: "#64748B",
    textAlign: "center",
  },

  // Glass card style
  glassCard: {
    backgroundColor: "rgba(255,255,255,0.62)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.85)",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { height: 6, width: 0 },
    elevation: 3,
  },

  // Features
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 14,
  },
  featureCardWrapper: { width: CARD_W },
  featureCard: {
    borderRadius: 22,
    padding: 18,
    alignItems: "center",
  },
  featureIconBubble: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "rgba(58,125,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(58,125,255,0.16)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureIcon: { fontSize: 30 },
  featureTitle: {
    fontSize: 15,
    fontFamily: "FredokaBold",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 12.5,
    fontFamily: "Fredoka",
    color: "#475569",
    textAlign: "center",
    lineHeight: 18,
  },

  // Steps
  stepContainer: { marginTop: 10, gap: 14 },
  step: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    padding: 16,
  },
  stepNumber: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(58,125,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(58,125,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stepNumberText: {
    fontFamily: "FredokaBold",
    fontSize: 18,
    color: "#3A7DFF",
  },
  stepContent: { flex: 1 },
  stepTitle: {
    fontSize: 16,
    fontFamily: "FredokaBold",
    color: "#0F172A",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 13.5,
    fontFamily: "Fredoka",
    color: "#475569",
    lineHeight: 20,
  },

  // CTA
  ctaSection: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 18,
  },
  ctaCard: {
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
  },
  ctaEmoji: { fontSize: 44, marginBottom: 10 },
  ctaTitle: {
    fontSize: 24,
    fontFamily: "FredokaBold",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 14.5,
    fontFamily: "Fredoka",
    color: "#475569",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 16,
    paddingHorizontal: 8,
  },

  primaryButton: {
    width: "100%",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#3A7DFF",
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: { height: 8, width: 0 },
    elevation: 7,
    marginBottom: 12,
  },
  primaryButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16.5,
    fontFamily: "FredokaBold",
    marginRight: 8,
  },
  buttonEmoji: { fontSize: 18 },

  secondaryButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.75)",
    borderWidth: 1,
    borderColor: "rgba(58,125,255,0.22)",
  },
  secondaryButtonText: {
    color: "#3A7DFF",
    fontSize: 16,
    fontFamily: "FredokaBold",
  },
});

export default LandingScreen;
