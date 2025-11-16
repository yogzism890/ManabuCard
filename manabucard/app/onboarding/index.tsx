import React, { useRef, useState } from "react";
import { View, TouchableOpacity, Text, Dimensions, StyleSheet } from "react-native";
import PagerView from "react-native-pager-view";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { onboardingData } from "./data";
import OnboardingItem from "./OnboardingItem";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const pagerRef = useRef<PagerView>(null);
  const router = useRouter();
  const [page, setPage] = useState(0);

  return (
    <View style={styles.container}>
      <PagerView
        style={styles.pager}
        initialPage={0}
        onPageSelected={(e) => setPage(e.nativeEvent.position)}
        ref={pagerRef}
      >
        {onboardingData.map((item) => (
          <View key={item.id}>
            <OnboardingItem item={item} />
          </View>
        ))}
      </PagerView>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (page === onboardingData.length - 1) {
            router.push("/welcome");
          } else {
            pagerRef.current?.setPage(page + 1);
          }
        }}
      >
        <Text style={styles.buttonText}>{page === 2 ? "Mulai Sekarang" : "Lanjut"}</Text>
      </TouchableOpacity>

      {/* Skip */}
      <TouchableOpacity onPress={() => router.push("/welcome")}>
        <Text style={styles.skip}>Lewati</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAF4", justifyContent: "center" },
  pager: { flex: 1 },
  button: {
    backgroundColor: "#3A7DFF",
    paddingVertical: 14,
    width: width * 0.7,
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "FredokaBold",
    fontSize: 18,
  },
  skip: {
    fontFamily: "Fredoka",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 15,
    color: "#555",
  },
});
