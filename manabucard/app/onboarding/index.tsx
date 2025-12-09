import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import PagerView from "react-native-pager-view";
import LottieView from "lottie-react-native";
import { onboardingData } from "./data";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  SharedValue,
  withSpring,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

// Floating decorative elements
function FloatingEmoji({ emoji, style }: { emoji: string; style: any }) {
  return (
    <Animated.Text style={[styles.floatingEmoji, style]}>
      {emoji}
    </Animated.Text>
  );
}

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
    const translateX = interpolate(
      progress.value,
      [index - 1, index, index + 1],
      [width * 0.4, 0, -width * 0.4]
    );
    const opacity = interpolate(
      progress.value,
      [index - 1, index, index + 1],
      [0, 1, 0]
    );
    const scale = interpolate(
      progress.value,
      [index - 1, index, index + 1],
      [0.8, 1, 0.8]
    );

    return {
      transform: [{ translateX }, { scale }],
      opacity,
    };
  });

  // Animation untuk lottie
  const lottieAnimStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      progress.value,
      [index - 1, index, index + 1],
      [0.7, 1, 0.7]
    );
    const translateY = interpolate(
      progress.value,
      [index - 1, index, index + 1],
      [50, 0, -50]
    );

    return {
      transform: [{ scale }, { translateY }],
    };
  });

  return (
    <View style={styles.page}>
      {/* Decorative background circles */}
      <View style={[styles.decorativeCircle, styles.circle1, { backgroundColor: item.circleColor1 || '#FFE8E8' }]} />
      <View style={[styles.decorativeCircle, styles.circle2, { backgroundColor: item.circleColor2 || '#E8F5FF' }]} />

      {/* Lottie Animation with bubble effect */}
      <Animated.View style={[styles.animationContainer, lottieAnimStyle]}>
        <View style={styles.animationBubble}>
          <LottieView
            source={item.animation}
            autoPlay
            loop
            style={{ width: width * 0.7, height: width * 0.7 }}
          />
        </View>
      </Animated.View>

      {/* Title with emoji */}
      <Animated.View style={[styles.contentContainer, animStyle]}>
        <View style={styles.titleWrapper}>
          <Text style={styles.titleEmoji}>{item.emoji || "✨"}</Text>
          <Text style={styles.title}>{item.title}</Text>
        </View>

        {/* Description with card background */}
        <View style={styles.descriptionCard}>
          <Text style={styles.desc}>{item.description}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

function Dot({ i, progress }: { i: number; progress: SharedValue<number> }) {
  const style = useAnimatedStyle(() => {
    const widthDot = interpolate(
      progress.value,
      [i - 1, i, i + 1],
      [10, 30, 10]
    );
    const opacity = interpolate(
      progress.value,
      [i - 1, i, i + 1],
      [0.3, 1, 0.3]
    );
    const scale = interpolate(
      progress.value,
      [i - 1, i, i + 1],
      [1, 1.2, 1]
    );

    return {
      width: widthDot,
      opacity,
      transform: [{ scale }],
    };
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
      router.replace("/auth/login");
    }
  };

  const handleSkip = () => router.replace("/auth/login");

  return (
    <LinearGradient
      colors={["#FFF8E7", "#FFF0F5", "#E8F4FF"]}
      style={styles.container}
    >
      {/* Floating decorative emojis */}
      <FloatingEmoji emoji="⭐" style={styles.floatingEmoji1} />
      <FloatingEmoji emoji="🎨" style={styles.floatingEmoji2} />
      <FloatingEmoji emoji="🚀" style={styles.floatingEmoji3} />
      <FloatingEmoji emoji="💡" style={styles.floatingEmoji4} />

      <PagerView
        style={{ flex: 1 }}
        ref={pagerRef}
        onPageSelected={(e) => {
          const idx = e.nativeEvent.position;
          setPage(idx);
          progress.value = withSpring(idx, {
            damping: 20,
            stiffness: 90,
          });
        }}
      >
        {onboardingData.map((item, index) => (
          <View key={item.id}>
            <OnboardingPage item={item} index={index} progress={progress} />
          </View>
        ))}
      </PagerView>

      {/* Dots Indicator with bubble container */}
      <View style={styles.dotsWrapper}>
        <View style={styles.dotsContainer}>
          {onboardingData.map((_, i) => (
            <Dot key={i} i={i} progress={progress} />
          ))}
        </View>
      </View>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        {page < onboardingData.length - 1 ? (
          <>
            <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
              <Text style={styles.skip}>Lewati 👉</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleNext} style={styles.nextBtn}>
              <LinearGradient
                colors={["#3A7DFF", "#5B93FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.nextGradient}
              >
                <Text style={styles.nextText}>Lanjut</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={handleNext} style={styles.startBtnWrapper}>
            <LinearGradient
              colors={["#3A7DFF", "#5B93FF", "#7DA9FF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.startBtn}
            >
              <Text style={styles.startText}>Ayo Mulai!</Text>
              <Text style={styles.startEmoji}>🚀</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Floating emojis
  floatingEmoji: {
    position: "absolute",
    fontSize: 28,
    opacity: 0.4,
    zIndex: 1,
  },
  floatingEmoji1: {
    top: height * 0.12,
    left: width * 0.08,
  },
  floatingEmoji2: {
    top: height * 0.18,
    right: width * 0.08,
  },
  floatingEmoji3: {
    top: height * 0.08,
    right: width * 0.25,
  },
  floatingEmoji4: {
    top: height * 0.25,
    left: width * 0.15,
  },

  // Page styles
  page: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 26,
    height: "100%",
    position: "relative",
  },

  // Decorative circles
  decorativeCircle: {
    position: "absolute",
    borderRadius: 1000,
    opacity: 0.12,
    zIndex: -1,
  },
  circle1: {
    width: 180,
    height: 180,
    top: height * 0.08,
    left: -60,
  },
  circle2: {
    width: 200,
    height: 200,
    top: height * 0.12,
    right: -70,
  },

  // Animation container
  animationContainer: {
    marginBottom: 20,
  },
  animationBubble: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 40,
    padding: 20,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.8)",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { height: 10, width: 0 },
    elevation: 8,
  },

  // Content
  contentContainer: {
    alignItems: "center",
    width: "100%",
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    zIndex: 10,
  },
  titleEmoji: {
    fontSize: 36,
    marginRight: 10,
  },
  title: {
    fontSize: 28,
    fontFamily: "FredokaBold",
    textAlign: "center",
    color: "#2D2D2D",
    textShadowColor: "rgba(58, 125, 255, 0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    flexShrink: 1,
  },

  descriptionCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 1)",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { height: 6, width: 0 },
    elevation: 5,
    zIndex: 10,
    maxWidth: "90%",
  },
  desc: {
    fontSize: 16,
    fontFamily: "Fredoka",
    textAlign: "center",
    color: "#666",
    lineHeight: 24,
  },

  // Dots
  dotsWrapper: {
    position: "absolute",
    bottom: 110,
    alignSelf: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    height: 10,
    marginHorizontal: 4,
    borderRadius: 10,
    backgroundColor: "#3A7DFF",
  },

  // Bottom buttons
  bottomButtons: {
    position: "absolute",
    bottom: 30,
    left: 24,
    right: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  skipBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  skip: {
    fontSize: 16,
    fontFamily: "FredokaBold",
    color: "#888",
  },

  nextBtn: {
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: "#3A7DFF",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { height: 4, width: 0 },
    elevation: 6,
  },
  nextGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  nextText: {
    color: "#fff",
    fontFamily: "FredokaBold",
    fontSize: 16,
    marginRight: 6,
  },
  nextArrow: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "FredokaBold",
  },

  startBtnWrapper: {
    flex: 1,
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#3A7DFF",
    shadowOpacity: 0.4,
    shadowRadius: 15,
    shadowOffset: { height: 8, width: 0 },
    elevation: 10,
  },
  startBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  startText: {
    color: "#fff",
    fontFamily: "FredokaBold",
    fontSize: 20,
    marginRight: 8,
  },
  startEmoji: {
    fontSize: 24,
  },
});