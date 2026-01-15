import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import { ProgressBarChart, WeeklyProgressChart, MasteryChart } from "../../components/ProgressChart";

interface UserStats {
  totalCollections: number;
  totalCards: number;
  cardsDueToday: number;
}

const { width } = Dimensions.get("window");
const isSmall = width < 360;
const isTablet = width > 768;

const ACCENT = "#9100FF";

const ProfileScreen = () => {
  const router = useRouter();
  const { user, logout, apiRequest } = useAuth();

  const [stats, setStats] = useState<UserStats>({
    totalCollections: 0,
    totalCards: 0,
    cardsDueToday: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUserStats = async () => {
    setIsLoading(true);
    try {
      const collections = await apiRequest("/koleksi");

      let totalCards = 0;
      let cardsDueToday = 0;
      const now = new Date();

      for (const collection of collections) {
        const cards = await apiRequest(`/koleksi/${collection.id}/kartu`);
        totalCards += cards.length;
        cardsDueToday += cards.filter((card: any) => {
          const due = card?.reviewDueAt ? new Date(card.reviewDueAt) : null;
          return due ? due <= now : false;
        }).length;
      }

      setStats({
        totalCollections: collections.length,
        totalCards,
        cardsDueToday,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
      Alert.alert("Error", "Gagal memuat statistik pengguna.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Apakah Anda yakin ingin logout?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/auth/login");
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>⏳ Memuat...</Text>
      </View>
    );
  }

  const avatarName = encodeURIComponent(user?.email || "User");
  // ui-avatars background pakai hex tanpa "#"
  const avatarBg = ACCENT.replace("#", "");

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.page}>
        {/* Background */}
        <LinearGradient
          colors={["#F7F7FB", "#F7F7FB"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.blob1} />
        <View style={styles.blob2} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animated.View entering={FadeInDown.delay(90).duration(650)} style={styles.headerCard}>
            <View style={styles.headerTopRow}>
              <View style={styles.badge}>
                <View style={styles.badgeDot} />
                <Text style={styles.badgeText}>Member Aktif</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.iconBtn}
                onPress={loadUserStats}
              >
                <Feather name="refresh-cw" size={18} color="#111827" />
              </TouchableOpacity>
            </View>

            <View style={styles.avatarRow}>
              <View style={styles.avatarWrap}>
                <Image
                  source={{
                    uri: `https://ui-avatars.com/api/?name=${avatarName}&background=${avatarBg}&color=fff&size=200`,
                  }}
                  style={styles.avatar}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.hello}> Hallo!
                  <Text style={styles.wave}>👋 </Text>
                </Text>
                <Text style={styles.email} numberOfLines={1}>
                  {user?.email || "Pengguna"}
                </Text>

                <View style={styles.miniRow}>
                  <View style={styles.miniPill}>
                    <Feather name="star" size={14} color={ACCENT} />
                    <Text style={styles.miniPillText}>Progress</Text>
                  </View>

                  <View style={styles.miniPill}>
                    <Feather name="zap" size={14} color={ACCENT} />
                    <Text style={styles.miniPillText}>Konsisten</Text>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Section title */}
          <Animated.View entering={FadeInDown.delay(170).duration(650)} style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Statistik Belajarmu</Text>
            <Text style={styles.sectionSub}>Ringkasan aktivitas kamu hari ini</Text>
          </Animated.View>

          {/* Stats */}
          <View style={styles.statsGrid}>
            <Animated.View entering={FadeInDown.delay(220).duration(650)} style={styles.statCard}>
              <View style={styles.statTop}>
                <View style={styles.statIcon}>
                  <Feather name="book" size={18} color={ACCENT} />
                </View>
                <Text style={styles.statLabel}>Koleksi</Text>
              </View>
              <Text style={styles.statNumber}>{stats.totalCollections}</Text>
              <View style={styles.statBar} />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(270).duration(650)} style={styles.statCard}>
              <View style={styles.statTop}>
                <View style={styles.statIcon}>
                  <Feather name="layers" size={18} color={ACCENT} />
                </View>
                <Text style={styles.statLabel}>Total Kartu</Text>
              </View>
              <Text style={styles.statNumber}>{stats.totalCards}</Text>
              <View style={styles.statBar} />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(320).duration(650)} style={styles.statCardFull}>
              <View style={styles.statTop}>
                <View style={styles.statIcon}>
                  <Feather name="clock" size={18} color={ACCENT} />
                </View>
                <Text style={styles.statLabel}>Jatuh Tempo Hari Ini</Text>
              </View>
              <Text style={styles.statNumber}>{stats.cardsDueToday}</Text>
              <Text style={styles.statHint}>
                Saran: review minimal {Math.min(stats.cardsDueToday, 10)} kartu untuk menjaga streak.
              </Text>
              <View style={styles.statBar} />
            </Animated.View>
          </View>

          {/* Motivation */}
          <Animated.View entering={FadeInDown.delay(380).duration(650)} style={styles.motivation}>
            <View style={styles.motiIcon}>
              <Feather name="trending-up" size={18} color="#10B981" />
            </View>
            <Text style={styles.motiText}>
              Kamu sudah punya <Text style={styles.motiStrong}>{stats.totalCards}</Text> kartu.
              Gas terus biar makin jago! 🚀
            </Text>
          </Animated.View>

          {/* Section title - Progress Chart */}
          <Animated.View entering={FadeInDown.delay(410).duration(650)} style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Progress Hafalan</Text>
            <Text style={styles.sectionSub}>Visualisasi perkembangan belajarmu</Text>
          </Animated.View>

          {/* Progress Bar Chart - Collection Stats */}
          <Animated.View entering={FadeInDown.delay(440).duration(650)}>
            <ProgressBarChart
              title="Statistik Koleksi"
              subtitle="Jumlah kartu per koleksi"
              data={[
                { label: "Koleksi", value: stats.totalCollections, maxValue: Math.max(stats.totalCollections, 1), color: ACCENT },
                { label: "Kartu", value: stats.totalCards, maxValue: Math.max(stats.totalCollections, 1), color: "#10B981" },
                { label: "Review", value: stats.cardsDueToday, maxValue: Math.max(stats.totalCollections, 1), color: "#F59E0B" },
              ]}
            />
          </Animated.View>

          {/* Weekly Progress Chart */}
          <Animated.View entering={FadeInDown.delay(470).duration(650)} style={{ marginTop: 12 }}>
            <WeeklyProgressChart
              dailyData={[
                { day: "Min", cardsStudied: 5, cardsReviewed: 3 },
                { day: "Sen", cardsStudied: 8, cardsReviewed: 5 },
                { day: "Sel", cardsStudied: 12, cardsReviewed: 7 },
                { day: "Rab", cardsStudied: 6, cardsReviewed: 4 },
                { day: "Kam", cardsStudied: 10, cardsReviewed: 6 },
                { day: "Jum", cardsStudied: 7, cardsReviewed: 5 },
                { day: "Sab", cardsStudied: 4, cardsReviewed: 2 },
              ]}
            />
          </Animated.View>

          {/* Mastery Chart */}
          <Animated.View entering={FadeInDown.delay(500).duration(650)} style={{ marginTop: 12 }}>
            <MasteryChart
              newCards={Math.floor(stats.totalCards * 0.2)}
              learning={Math.floor(stats.totalCards * 0.3)}
              review={Math.floor(stats.totalCards * 0.35)}
              mastered={Math.floor(stats.totalCards * 0.15)}
            />
          </Animated.View>

          {/* Actions */}
          <Animated.View entering={FadeInDown.delay(450).duration(650)} style={styles.actions}>
            <TouchableOpacity activeOpacity={0.9} style={styles.primaryBtn} onPress={loadUserStats}>
              <LinearGradient
                colors={[ACCENT, "#B44CFF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryGrad}
              >
                <Feather name="refresh-cw" size={18} color="#fff" />
                <Text style={styles.primaryText}>Refresh Statistik</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.9} style={styles.secondaryBtn} onPress={handleLogout}>
              <Feather name="log-out" size={18} color={ACCENT} />
              <Text style={styles.secondaryText}>Keluar</Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={{ height: 16 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F7F7FB" },
  page: { flex: 1, backgroundColor: "#F7F7FB" },

  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 22,
    gap: 14,
  },

  blob1: {
    position: "absolute",
    top: -90,
    left: -80,
    width: 250,
    height: 250,
    borderRadius: 999,
    backgroundColor: "rgba(145,0,255,0.10)",
  },
  blob2: {
    position: "absolute",
    bottom: -110,
    right: -90,
    width: 280,
    height: 280,
    borderRadius: 999,
    backgroundColor: "rgba(255,196,107,0.10)",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F7FB",
  },
  loadingText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#6B7280",
  },

  headerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
    gap: 14,
  },

  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(145,0,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(145,0,255,0.14)",
    gap: 8,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: ACCENT,
  },
  badgeText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12.5,
    color: "#111827",
  },

  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.90)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
  },

  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  avatarWrap: {
    width: 78,
    height: 78,
    borderRadius: 22,
    backgroundColor: "rgba(145,0,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(145,0,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 66,
    height: 66,
    borderRadius: 20,
    backgroundColor: "#EEE",
  },

  hello: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    color: "#111827",
  },
  wave: { fontSize: 18 },
  email: {
    marginTop: 2,
    fontFamily: "Poppins_400Regular",
    fontSize: 13.5,
    color: "#6B7280",
    maxWidth: isTablet ? 520 : 230,
  },

  miniRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    flexWrap: "wrap",
  },
  miniPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(17,24,39,0.03)",
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
  },
  miniPillText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12.5,
    color: "#111827",
  },

  sectionHead: {
    marginTop: 2,
    gap: 4,
  },
  sectionTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    color: "#111827",
  },
  sectionSub: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "#6B7280",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  statCard: {
    width: isTablet ? (width - 20 * 2 - 12) / 2 : (width - 20 * 2 - 12) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
    overflow: "hidden",
  },

  statCardFull: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
    overflow: "hidden",
  },

  statTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 14,
    backgroundColor: "rgba(145,0,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(145,0,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },

  statLabel: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13,
    color: "#111827",
  },

  statNumber: {
    fontFamily: "Poppins_700Bold",
    fontSize: isSmall ? 24 : 28,
    color: "#111827",
    marginBottom: 4,
  },

  statHint: {
    marginTop: 2,
    fontFamily: "Poppins_400Regular",
    fontSize: 12.8,
    color: "#6B7280",
    lineHeight: 18,
  },

  statBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "rgba(145,0,255,0.22)",
  },

  motivation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(16,185,129,0.10)",
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.16)",
    borderRadius: 18,
    padding: 14,
  },
  motiIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  motiText: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "#111827",
    lineHeight: 19,
  },
  motiStrong: {
    fontFamily: "Poppins_700Bold",
    color: "#111827",
  },

  actions: { gap: 12 },

  primaryBtn: { borderRadius: 18, overflow: "hidden" },
  primaryGrad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  primaryText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14.5,
    color: "#fff",
  },

  secondaryBtn: {
    height: 50,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "rgba(145,0,255,0.35)",
    backgroundColor: "rgba(145,0,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  secondaryText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14.5,
    color: ACCENT,
  },
});
