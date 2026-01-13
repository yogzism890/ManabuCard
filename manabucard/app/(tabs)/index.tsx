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
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const CARD_W = (width - 60) / 2; // Penyesuaian lebar kartu agar seimbang

const LandingScreen = () => {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["#F8F0FF", "#F0F4FF", "#FFFFFF"]} // Warna lebih soft ke arah ungu/biru
          style={styles.gradientBackground}
        >
          {/* Ornamen Dekoratif (Bukan kotak, tapi lingkaran blur) */}
          <View style={[styles.decorativeCircle, styles.circle1]} />
          <View style={[styles.decorativeCircle, styles.circle2]} />

          {/* Top Header */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.topHeader}>
            <View style={styles.topBadge}>
              <Ionicons name="sparkles" size={16} color="#9100FF" style={{ marginRight: 6 }} />
              <Text style={styles.topBadgeText}>ManabuCard v1.0</Text>
            </View>
            <TouchableOpacity style={styles.profileMini}>
              <Ionicons name="person-circle-outline" size={28} color="#1A1A1A" />
            </TouchableOpacity>
          </Animated.View>

          {/* Hero Section */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.heroSection}>
            <View style={styles.logoWrapper}>
              <Image
                source={require("../../assets/images/logo.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.heroTitle}>Halo, Faiz 👋</Text>
            <Text style={styles.heroSubtitle}>
              Siap menguasai hal baru hari ini? Tingkatkan ingatanmu dengan metode flashcard yang asik.
            </Text>

            {/* Tombol Utama (Ungu Navigasi) */}
            <Link href="/(tabs)/review" asChild>
              <TouchableOpacity activeOpacity={0.8} style={styles.mainButton}>
                <LinearGradient
                  colors={["#9100FF", "#7100CC"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.mainButtonGradient}
                >
                  <Text style={styles.mainButtonText}>Mulai Belajar Sekarang</Text>
                  <Ionicons name="chevron-forward" size={20} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </Link>
          </Animated.View>

          {/* Features Grid (Style Kaca Tanpa Border Kaku) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fitur Utama</Text>
            <View style={styles.featureGrid}>
              <FeatureCard
                delay={300}
                icon="layers-outline"
                title="Koleksi"
                desc="Atur kartu per topik"
              />
              <FeatureCard
                delay={400}
                icon="infinite-outline"
                title="Spaced Repetition"
                desc="Review di waktu tepat"
              />
              <FeatureCard
                delay={500}
                icon="analytics-outline"
                title="Statistik"
                desc="Pantau grafik progres"
              />
              <FeatureCard
                delay={600}
                icon="color-wand-outline"
                title="Kustom"
                desc="Desain sesukamu"
              />
            </View>
          </View>

          {/* How it Works (List Elegan) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cara Kerja</Text>
            <View style={styles.stepWrapper}>
              <StepItem 
                n={1} 
                title="Buat Kartu" 
                desc="Masukkan pertanyaan dan jawaban singkat." 
                delay={700}
              />
              <StepItem 
                n={2} 
                title="Review Rutin" 
                desc="Buka aplikasi setiap hari untuk sesi singkat." 
                delay={800}
              />
              <StepItem 
                n={3} 
                title="Kuasai Materi" 
                desc="Ingatanmu akan bertahan lebih lama secara otomatis." 
                delay={900}
              />
            </View>
          </View>

          <View style={{ height: 120 }} /> 
          {/* Padding bawah agar tidak tertutup TabBar melayang */}
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

// Komponen Card Kecil
function FeatureCard({ delay, icon, title, desc }: any) {
  return (
    <Animated.View entering={FadeInDown.delay(delay)} style={styles.featureCardWrapper}>
      <View style={styles.glassCard}>
        <View style={styles.iconCircle}>
          <Ionicons name={icon} size={24} color="#9100FF" />
        </View>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{desc}</Text>
      </View>
    </Animated.View>
  );
}

// Komponen List Step
function StepItem({ n, title, desc, delay }: any) {
  return (
    <Animated.View entering={FadeInDown.delay(delay)} style={styles.stepItem}>
      <View style={styles.stepBadge}>
        <Text style={styles.stepNumber}>{n}</Text>
      </View>
      <View style={styles.stepTextContent}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepDesc}>{desc}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8F0FF" },
  container: { flex: 1 },
  gradientBackground: { flex: 1, paddingHorizontal: 20 },

  // Dekorasi Lingkaran Blur (Menghapus kesan kaku)
  decorativeCircle: {
    position: "absolute",
    borderRadius: 200,
    opacity: 0.4,
  },
  circle1: { width: 300, height: 300, backgroundColor: "#E0D0FF", top: -50, right: -100 },
  circle2: { width: 200, height: 200, backgroundColor: "#D0E0FF", top: 400, left: -100 },

  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  topBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(145, 0, 255, 0.1)",
  },
  topBadgeText: { fontSize: 12, fontFamily: "Poppins-SemiBold", color: "#9100FF" },
  profileMini: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },

  heroSection: { alignItems: "center", marginBottom: 40 },
  logoWrapper: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#9100FF",
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  logoImage: { width: 70, height: 70 },
  heroTitle: { fontSize: 28, fontFamily: "Poppins-Bold", color: "#1A1A1A" },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginTop: 10,
    paddingHorizontal: 10,
  },

  mainButton: { width: "100%", marginTop: 25, borderRadius: 20, overflow: "hidden" },
  mainButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 10,
  },
  mainButtonText: { color: "#fff", fontSize: 16, fontFamily: "Poppins-Bold" },

  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 20, fontFamily: "Poppins-Bold", color: "#1A1A1A", marginBottom: 15 },

  featureGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  featureCardWrapper: { width: CARD_W, marginBottom: 15 },
  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.8)",
    minHeight: 160,
  },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: "rgba(145, 0, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureTitle: { fontSize: 14, fontFamily: "Poppins-SemiBold", color: "#1A1A1A" },
  featureDesc: { fontSize: 11, fontFamily: "Poppins-Regular", color: "#777", marginTop: 4 },

  stepWrapper: { gap: 12 },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  stepBadge: {
    width: 35,
    height: 35,
    borderRadius: 12,
    backgroundColor: "#9100FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  stepNumber: { color: "#fff", fontFamily: "Poppins-Bold", fontSize: 14 },
  stepTextContent: { flex: 1 },
  stepTitle: { fontSize: 15, fontFamily: "Poppins-SemiBold", color: "#1A1A1A" },
  stepDesc: { fontSize: 12, fontFamily: "Poppins-Regular", color: "#666" },
});

export default LandingScreen;