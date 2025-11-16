import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import PagerView from "react-native-pager-view";
import LottieView from "lottie-react-native";
import { onboardingData } from "./data";
import { useRouter } from "expo-router";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  SharedValue,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

function OnboardingPage({
  item,
  index,
  progress,
}: {
  item: any;
  index: number;
  progress: SharedValue<number>;
}) {
  const animStyle = useAnimatedStyle(() => {
    const translateX = interpolate(progress.value, [index - 1, index, index + 1], [width * 0.4, 0, -width * 0.4]);
    const opacity = interpolate(progress.value, [index - 1, index, index + 1], [0, 1, 0]);

    return { transform: [{ translateX }], opacity };
  });

  return (
    <View style={styles.page}>
      <Animated.View style={[styles.animationContainer, animStyle]}>
        <LottieView
          source={item.animation}
          autoPlay
          loop
          style={{ width: width * 0.75, height: width * 0.75 }}
        />
      </Animated.View>

      <Animated.Text style={[styles.title, animStyle]}>{item.title}</Animated.Text>
      <Animated.Text style={[styles.desc, animStyle]}>{item.description}</Animated.Text>
    </View>
  );
}

function Dot({ i, progress }: { i: number; progress: SharedValue<number> }) {
  const style = useAnimatedStyle(() => {
    const widthDot = interpolate(progress.value, [i - 1, i, i + 1], [8, 22, 8]);
    const opacity = interpolate(progress.value, [i - 1, i, i + 1], [0.5, 1, 0.5]);

    return { width: widthDot, opacity };
  });

  return <Animated.View style={[styles.dot, style]} />;
}

export default function Onboarding() {
  const router = useRouter();
  const pagerRef = useRef<PagerView>(null);
  const [page, setPage] = useState(0);
  const progress = useSharedValue(0);

  const handleNext = () => {
    if (page < onboardingData.length - 1) {
      pagerRef.current?.setPage(page + 1);
    } else {
      router.replace("/(tabs)");
    }
  };

  const handleSkip = () => router.replace("/(tabs)");

  return (
    <View style={styles.container}>
      <PagerView
        style={{ flex: 1 }}
        ref={pagerRef}
        onPageSelected={(e) => {
          const idx = e.nativeEvent.position;
          setPage(idx);
          progress.value = withTiming(idx, { duration: 350 });
        }}
      >
        {onboardingData.map((item, index) => (
          <View key={item.id}>
            <OnboardingPage item={item} index={index} progress={progress} />
          </View>
        ))}
      </PagerView>

      <View style={styles.dotsContainer}>
        {onboardingData.map((_, i) => (
          <Dot key={i} i={i} progress={progress} />
        ))}
      </View>

      <View style={styles.bottomButtons}>
        {page < onboardingData.length - 1 ? (
          <>
            <TouchableOpacity onPress={handleSkip}>
              <Text style={styles.skip}>Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleNext} style={styles.nextBtn}>
              <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={handleNext} style={styles.startBtn}>
            <Text style={styles.startText}>Get Started</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAF4" },
  page: { alignItems: "center", justifyContent: "center", paddingHorizontal: 26, height: "100%" },
  animationContainer: { marginBottom: 8 },
  title: { fontSize: 32, fontFamily: "FredokaBold", textAlign: "center", color: "#222" },
  desc: { fontSize: 16, fontFamily: "Fredoka", textAlign: "center", marginTop: 10, color: "#555" },

  dotsContainer: {
    flexDirection: "row",
    alignSelf: "center",
    position: "absolute",
    bottom: 92,
  },
  dot: { height: 8, marginHorizontal: 6, borderRadius: 10, backgroundColor: "#3A7DFF" },

  bottomButtons: {
    position: "absolute",
    bottom: 18,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  skip: { fontSize: 16, fontFamily: "FredokaBold", color: "#777" },
  nextBtn: { backgroundColor: "#3A7DFF", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  nextText: { color: "#fff", fontFamily: "FredokaBold" },

  startBtn: { backgroundColor: "#3A7DFF", width: "100%", paddingVertical: 14, borderRadius: 28 },
  startText: { textAlign: "center", color: "#fff", fontFamily: "FredokaBold", fontSize: 18 },
});
