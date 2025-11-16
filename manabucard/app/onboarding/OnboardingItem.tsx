import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated from "react-native-reanimated";
import LottieView from "lottie-react-native";

const { width } = Dimensions.get("window");

export default function OnboardingItem({ item }: any) {
  return (
    <View style={[styles.container, { width }]}>
      <LottieView
        source={item.animation}
        autoPlay
        loop
        style={{ width: 280, height: 280 }}
      />

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: "FredokaBold",
    fontSize: 32,
    marginTop: 20,
    color: "#222",
    textAlign: "center",
  },
  description: {
    marginTop: 10,
    fontSize: 17,
    color: "#555",
    fontFamily: "Fredoka",
    textAlign: "center",
  },
});
