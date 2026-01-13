import React from "react";
import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");

type Props = {
  item: {
    animation: any;
    title: string;
    description: string;
  };
  index?: number; // 0-based
  total?: number;
};

export default function OnboardingItem({ item, index = 0, total = 3 }: Props) {
  const step = index + 1;
  const progress = total > 0 ? step / total : 0;

  return (
    <SafeAreaView style={[styles.safe, { width }]} edges={["top", "bottom"]}>
      <View style={styles.container}>
        {/* Header info */}
        <View style={styles.topRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{`Step ${step}/${total}`}</Text>
          </View>

          <Text style={styles.smallHint}>Swipe untuk lanjut</Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack} accessible accessibilityLabel="Progress onboarding">
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>

        {/* Lottie Card */}
        <View style={styles.lottieCard}>
          <LottieView source={item.animation} autoPlay loop style={styles.lottie} />
        </View>

        {/* Text content */}
        <View style={styles.textWrap}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>

          <Text style={styles.description} numberOfLines={4}>
            {item.description}
          </Text>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 10 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 18,
    justifyContent: "space-between",
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Platform.OS === "android" ? 4 : 0,
  },
  badge: {
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#DDE3FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    fontFamily: "FredokaBold",
    fontSize: 13,
    color: "#3B4CCA",
    letterSpacing: 0.2,
  },
  smallHint: {
    fontFamily: "Fredoka",
    fontSize: 13,
    color: "#6B7280",
  },

  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#EEF2F7",
    overflow: "hidden",
    marginTop: 10,
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#3B82F6",
  },

  lottieCard: {
    alignSelf: "center",
    width: Math.min(width - 44, 360),
    height: Math.min(height * 0.42, 340),
    borderRadius: 24,
    backgroundColor: "#F7F9FF",
    borderWidth: 1,
    borderColor: "#E8ECFF",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  lottie: {
    width: 300,
    height: 300,
  },

  textWrap: {
    paddingBottom: 8,
  },
  title: {
    fontFamily: "FredokaBold",
    fontSize: 30,
    color: "#0F172A",
    textAlign: "center",
    lineHeight: 36,
    marginTop: 14,
  },
  description: {
    marginTop: 10,
    fontSize: 16,
    color: "#475569",
    fontFamily: "Fredoka",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 6,
  },
});
