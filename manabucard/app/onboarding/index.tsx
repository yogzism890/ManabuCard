import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import PagerView from "react-native-pager-view";
import LottieView from "lottie-react-native";
import { onboardingData } from "./data";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  SharedValue,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

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
    const opacity = interpolate(progress.value, [index - 1, index, index + 1], [0, 1, 0]);
    const scale = interpolate(progress.value, [index - 1, index, index + 1], [0.9, 1, 0.9]);
    return { opacity, transform: [{ scale }] };
  });

  return (
    <View style={styles.page}>
      {/* Decorative background circles - Diubah ke Ungu/Biru Muda */}
      <View style={[styles.decorativeCircle, styles.circle1, { backgroundColor: "#E0D0FF" }]} />
      <View style={[styles.decorativeCircle, styles.circle2, { backgroundColor: "#D0E0FF" }]} />

      {/* Lottie Animation with glass bubble */}
      <Animated.View style={[styles.animationContainer, animStyle]}>
        <View style={styles.animationBubble}>
          <LottieView
            source={item.animation}
            autoPlay
            loop
            style={{ width: width * 0.75, height: width * 0.75 }}
          />
        </View>
      </Animated.View>

      {/* Content */}
      <Animated.View style={[styles.contentContainer, animStyle]}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.glassDescription}>
          <Text style={styles.desc}>{item.description}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

function Dot({ i, progress }: { i: number; progress: SharedValue<number> }) {
  const style = useAnimatedStyle(() => {
    const dotWidth = interpolate(progress.value, [i - 1, i, i + 1], [8, 24, 8]);
    const opacity = interpolate(progress.value, [i - 1, i, i + 1], [0.3, 1, 0.3]);
    return { width: dotWidth, opacity };
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

  return (
    <LinearGradient colors={["#F8F0FF", "#F0F4FF", "#FFFFFF"]} style={styles.container}>
      <PagerView
        style={{ flex: 1 }}
        ref={pagerRef}
        onPageScroll={(e) => {
          progress.value = e.nativeEvent.position + e.nativeEvent.offset;
        }}
        onPageSelected={(e) => setPage(e.nativeEvent.position)}
      >
        {onboardingData.map((item, index) => (
          <View key={item.id}>
            <OnboardingPage item={item} index={index} progress={progress} />
          </View>
        ))}
      </PagerView>

      {/* Dots & Navigation */}
      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          {onboardingData.map((_, i) => (
            <Dot key={i} i={i} progress={progress} />
          ))}
        </View>

        <TouchableOpacity 
          onPress={handleNext} 
          style={styles.mainBtn}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#9100FF", "#7100CC"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btnGradient}
          >
            <Text style={styles.btnText}>
              {page === onboardingData.length - 1 ? "Mulai Sekarang" : "Lanjut"}
            </Text>
            <Ionicons 
              name={page === onboardingData.length - 1 ? "rocket" : "arrow-forward"} 
              size={20} 
              color="#fff" 
            />
          </LinearGradient>
        </TouchableOpacity>
        
        {page < onboardingData.length - 1 && (
          <TouchableOpacity onPress={() => router.replace("/auth/login")} style={styles.skipBtn}>
            <Text style={styles.skipText}>Lewati</Text>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  page: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 30 },
  
  decorativeCircle: { position: "absolute", borderRadius: 200, opacity: 0.4 },
  circle1: { width: 250, height: 250, top: -50, left: -100 },
  circle2: { width: 180, height: 180, top: 100, right: -80 },

  animationContainer: { marginBottom: 40 },
  animationBubble: {
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 50,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },

  contentContainer: { alignItems: "center" },
  title: { 
    fontSize: 28, 
    fontFamily: "Poppins-Bold", 
    color: "#1A1A1A", 
    textAlign: "center",
    marginBottom: 15 
  },
  glassDescription: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    padding: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  desc: { 
    fontSize: 15, 
    fontFamily: "Poppins-Regular", 
    color: "#666", 
    textAlign: "center", 
    lineHeight: 22 
  },

  footer: { position: "absolute", bottom: 50, left: 0, right: 0, alignItems: "center" },
  dotsContainer: { flexDirection: "row", marginBottom: 30 },
  dot: { height: 8, marginHorizontal: 4, borderRadius: 4, backgroundColor: "#9100FF" },

  mainBtn: { width: width * 0.8, borderRadius: 20, overflow: "hidden", elevation: 8, shadowColor: "#9100FF", shadowOpacity: 0.3, shadowRadius: 15, shadowOffset: { height: 10, width: 0 } },
  btnGradient: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 18, gap: 10 },
  btnText: { color: "#fff", fontSize: 16, fontFamily: "Poppins-Bold" },
  
  skipBtn: { marginTop: 20 },
  skipText: { color: "#888", fontFamily: "Poppins-Medium", fontSize: 14 }
});