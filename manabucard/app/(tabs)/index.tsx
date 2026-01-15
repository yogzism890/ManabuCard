import React, { useMemo } from  "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  ImageBackground,
} from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";


const { width } = Dimensions.get("window");
const ACCENT = "#9100FF";
const CARD_GAP = 14;
const CARD_W = (width - 40 - CARD_GAP) / 2; // 20 kiri + 20 kanan + gap 14

const LandingScreen = () => {
  const heroSeed = useMemo(() => Math.floor(Math.random() * 999999), []);
  const heroImage = `https://picsum.photos/seed/${heroSeed}/900/600`;
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <LinearGradient
          colors={["#F8F0FF", "#F0F4FF", "#FFFFFF"]}
          style={styles.gradientBackground}
        >
          {/* Decorative blobs */}
          <View style={[styles.blob, styles.blob1]} />
          <View style={[styles.blob, styles.blob2]} />

          {/* Top Header */}
          <Animated.View entering={FadeInDown.delay(80)} style={styles.topHeader}>
            <View style={styles.topBadge}>
              <Ionicons
                name="sparkles"
                size={16}
                color={ACCENT}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.topBadgeText}>ManabuCard v1.0</Text>
            </View>

            <TouchableOpacity style={styles.profileMini} activeOpacity={0.85}>
              <Ionicons
                name="person-circle-outline"
                size={30}
                color="#111827"
              />
            </TouchableOpacity>
          </Animated.View>

          {/* Hero */}
          <Animated.View entering={FadeInDown.delay(160)} style={styles.heroCard}>
            <ImageBackground
              source={{ uri: heroImage }}
              style={styles.heroBg}
              imageStyle={styles.heroBgImage}
            >
              {/* gradient overlay biar teks kebaca */}
              <LinearGradient
                colors={["rgba(145,0,255,0.92)", "rgba(145,0,255,0.55)", "rgba(255,255,255,0.05)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroOverlay}
              >
                {/* top row: title + plus */}
                <View style={styles.heroTopRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.heroSmall}>ManabuCard</Text>
                    <Text style={styles.heroBig}>Let’s learn</Text>
                    <Text style={styles.heroBigStrong}>something new</Text>
                  </View>

                  <TouchableOpacity activeOpacity={0.85} style={styles.heroPlusBtn}>
                    <Ionicons name="add" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>

                {/* subtitle */}
                <Text style={styles.heroSub}>
                  Pilih koleksi dan mulai review dalam 3 menit.
                </Text>

                {/* CTA row */}
                <View style={styles.heroCtaRow}>
                  <Link href="/(tabs)/review" asChild>
                    <TouchableOpacity activeOpacity={0.9} style={styles.heroPrimaryBtn}>
                      <Text style={styles.heroPrimaryText}>Mulai Review</Text>
                      <Ionicons name="chevron-forward" size={16} color="#fff" />
                    </TouchableOpacity>
                  </Link>

                  <Link href="/(tabs)/create" asChild>
                    <TouchableOpacity activeOpacity={0.9} style={styles.heroGhostBtn}>
                      <Text style={styles.heroGhostText}>Buat Kartu</Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              </LinearGradient>
            </ImageBackground>
          </Animated.View>

          {/* Features */}
          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>Fitur Utama</Text>
              <Text style={styles.sectionSub}>Semua yang kamu butuhkan untuk belajar</Text>
            </View>

            <View style={styles.featureGrid}>
              <FeatureCard
                delay={240}
                icon="layers-outline"
                title="Koleksi"
                desc="Atur kartu per topik"
              />
              <FeatureCard
                delay={320}
                icon="infinite-outline"
                title="Spaced Repetition"
                desc="Review di waktu tepat"
              />
              <FeatureCard
                delay={400}
                icon="analytics-outline"
                title="Statistik"
                desc="Pantau progresmu"
              />
              <FeatureCard
                delay={480}
                icon="color-wand-outline"
                title="Kustom"
                desc="Desain sesukamu"
              />
            </View>
          </View>

          {/* How it Works */}
          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>Cara Kerja</Text>
              <Text style={styles.sectionSub}>3 langkah simpel</Text>
            </View>

            <View style={styles.stepWrapper}>
              <StepItem
                n={1}
                title="Buat Kartu"
                desc="Masukkan pertanyaan dan jawaban singkat."
                delay={560}
              />
              <StepItem
                n={2}
                title="Review Rutin"
                desc="Buka aplikasi setiap hari untuk sesi singkat."
                delay={640}
              />
              <StepItem
                n={3}
                title="Kuasai Materi"
                desc="Ingatanmu bertahan lebih lama secara otomatis."
                delay={720}
              />
            </View>
          </View>

          {/* Bottom spacing for floating tab bar */}
          <View style={{ height: 110 }} />
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

function FeatureCard({ delay, icon, title, desc }: any) {
  return (
    <Animated.View entering={FadeInDown.delay(delay)} style={styles.featureCardWrapper}>
      <View style={styles.featureCard}>
        <View style={styles.iconCircle}>
          <Ionicons name={icon} size={22} color={ACCENT} />
        </View>

        <Text style={styles.featureTitle} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.featureDesc} numberOfLines={2}>
          {desc}
        </Text>
      </View>
    </Animated.View>
  );
}

function StepItem({ n, title, desc, delay }: any) {
  return (
    <Animated.View entering={FadeInDown.delay(delay)} style={styles.stepItem}>
      <View style={styles.stepBadge}>
        <Text style={styles.stepNumber}>{n}</Text>
      </View>

      <View style={styles.stepTextContent}>
        <Text style={styles.stepTitle} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.stepDesc}>{desc}</Text>
      </View>

      <View style={styles.stepArrow}>
        <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8F0FF" },

  scrollContent: {
    flexGrow: 1,
  },

  gradientBackground: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 10 : 6,
  },

  // Blobs
  blob: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.35,
  },
  blob1: {
    width: 320,
    height: 320,
    backgroundColor: "rgba(145,0,255,0.14)",
    top: -80,
    right: -120,
  },
  blob2: {
    width: 240,
    height: 240,
    backgroundColor: "rgba(59,130,246,0.10)",
    top: 420,
    left: -130,
  },

  // Top header
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 18,
  },
  topBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.85)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
  },
  topBadgeText: {
    fontSize: 12,
    fontFamily: "Poppins_600SemiBold",
    color: ACCENT,
  },
  profileMini: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Hero
  heroSection: { alignItems: "center", marginBottom: 26 },
  logoWrapper: {
    width: 104,
    height: 104,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.92)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  logoImage: { width: 72, height: 72 },

  heroTitle: {
    fontSize: 28,
    fontFamily: "Poppins_700Bold",
    color: "#111827",
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 13.5,
    fontFamily: "Poppins_400Regular",
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
    paddingHorizontal: 10,
  },

  mainButton: {
    width: "100%",
    marginTop: 18,
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: ACCENT,
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
  mainButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 10,
  },
  mainButtonText: {
    color: "#fff",
    fontSize: 15.5,
    fontFamily: "Poppins_700Bold",
  },
  mainButtonIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },

  secondaryBtn: {
    width: "100%",
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.78)",
    borderWidth: 1,
    borderColor: "rgba(145,0,255,0.16)",
  },
  secondaryBtnText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: ACCENT,
  },

  // Section
  section: { marginTop: 10, marginBottom: 18 },
  sectionHead: { marginBottom: 12 },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    color: "#111827",
  },
  sectionSub: {
    marginTop: 4,
    fontSize: 12.5,
    fontFamily: "Poppins_400Regular",
    color: "#6B7280",
  },

  // Features grid
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: CARD_GAP,
  },
  featureCardWrapper: { width: CARD_W },
  featureCard: {
    backgroundColor: "rgba(255,255,255,0.68)",
    borderRadius: 22,
    padding: 16,
    minHeight: 150,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.85)",
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "rgba(145,0,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(145,0,255,0.14)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 13.5,
    fontFamily: "Poppins_600SemiBold",
    color: "#111827",
  },
  featureDesc: {
    marginTop: 4,
    fontSize: 11.5,
    fontFamily: "Poppins_400Regular",
    color: "#6B7280",
    lineHeight: 16,
  },

  // Steps
  stepWrapper: { gap: 10 },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.62)",
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.85)",
  },
  stepBadge: {
    width: 36,
    height: 36,
    borderRadius: 14,
    backgroundColor: ACCENT,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepNumber: { color: "#fff", fontFamily: "Poppins_700Bold", fontSize: 13 },
  stepTextContent: { flex: 1 },
  stepTitle: { fontSize: 14, fontFamily: "Poppins_600SemiBold", color: "#111827" },
  stepDesc: {
    marginTop: 2,
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "#6B7280",
    lineHeight: 17,
  },
  stepArrow: {
    width: 32,
    height: 32,
    borderRadius: 14,
    backgroundColor: "rgba(17,24,39,0.03)",
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroCard: {
  borderRadius: 26,
  overflow: "hidden",
  marginBottom: 18,
  borderWidth: 1,
  borderColor: "rgba(17,24,39,0.06)",
  shadowColor: "#000",
  shadowOpacity: 0.10,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 12 },
  elevation: 4,
},

heroBg: {
  width: "100%",
  height: 220,
},

heroBgImage: {
  borderRadius: 26,
},

heroOverlay: {
  flex: 1,
  padding: 18,
  justifyContent: "space-between",
},

heroTopRow: {
  flexDirection: "row",
  alignItems: "flex-start",
  gap: 12,
},

heroPlusBtn: {
  width: 36,
  height: 36,
  borderRadius: 14,
  backgroundColor: "rgba(255,255,255,0.22)",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.22)",
  alignItems: "center",
  justifyContent: "center",
},

heroSmall: {
  fontFamily: "Poppins_500Medium",
  fontSize: 12,
  color: "rgba(255,255,255,0.85)",
  marginBottom: 6,
},

heroBig: {
  fontFamily: "Poppins_600SemiBold",
  fontSize: 22,
  color: "#fff",
  lineHeight: 26,
},

heroBigStrong: {
  fontFamily: "Poppins_700Bold",
  fontSize: 24,
  color: "#fff",
  lineHeight: 28,
  marginTop: 2,
},

heroSub: {
  fontFamily: "Poppins_400Regular",
  fontSize: 12.5,
  color: "rgba(255,255,255,0.88)",
  marginTop: 10,
  lineHeight: 18,
},

heroCtaRow: {
  flexDirection: "row",
  gap: 10,
  marginTop: 12,
},

heroPrimaryBtn: {
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  paddingVertical: 12,
  borderRadius: 16,
  backgroundColor: "rgba(0,0,0,0.22)",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.18)",
},

heroPrimaryText: {
  fontFamily: "Poppins_700Bold",
  fontSize: 13.5,
  color: "#fff",
},

heroGhostBtn: {
  paddingHorizontal: 14,
  paddingVertical: 12,
  borderRadius: 16,
  backgroundColor: "rgba(255,255,255,0.22)",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.22)",
  alignItems: "center",
  justifyContent: "center",
},

heroGhostText: {
  fontFamily: "Poppins_600SemiBold",
  fontSize: 13.5,
  color: "#fff",
},
});

export default LandingScreen;
