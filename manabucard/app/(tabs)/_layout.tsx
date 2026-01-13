import React from "react";
import { Tabs } from "expo-router";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

const ACTIVE = "'#9100FF"; // samakan dengan theme kamu (biru)
const INACTIVE = "rgba(255,255,255,0.65)";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,

        tabBarStyle: styles.tabBar,

        // biar tiap item punya ruang dan pill-nya nggak sempit
        tabBarItemStyle: styles.tabBarItem,

        tabBarBackground: () => (
          <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={focused ? "home" : "home-outline"}
              label="Home"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="review"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={focused ? "book" : "book-outline"}
              label="Review"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={focused ? "add-circle" : "add-circle-outline"}
              label="Create"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={focused ? "person" : "person-outline"}
              label="Profile"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({
  icon,
  label,
  focused,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  focused: boolean;
}) {
  const pillAnim = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(focused ? 1 : 0.96, { duration: 180 }) }],
      backgroundColor: withTiming(
        focused ? "rgba(58,125,255,0.95)" : "rgba(255,255,255,0.06)",
        { duration: 180 }
      ),
    };
  }, [focused]);

  const labelAnim = useAnimatedStyle(() => {
    return {
      opacity: withTiming(focused ? 1 : 0, { duration: 160 }),
      transform: [{ translateX: withTiming(focused ? 0 : -6, { duration: 160 }) }],
      maxWidth: withTiming(focused ? 80 : 0, { duration: 160 }),
    };
  }, [focused]);

  return (
    <Animated.View style={[styles.pill, pillAnim]}>
      <Ionicons
        name={icon}
        size={22}
        color={focused ? "#fff" : INACTIVE}
      />

      <Animated.View style={[styles.labelWrap, labelAnim]}>
        <Text numberOfLines={1} style={styles.label}>
          {label}
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: Platform.OS === "ios" ? 18 : 16,

    height: 68,
    borderRadius: 999,

    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",

    backgroundColor: "rgba(0,0,0,0.35)",
    overflow: "hidden",

    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 8,

    // Shadow iOS
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },

    // Elevation Android
    elevation: 10,
  },

  tabBarItem: {
    marginVertical: 6,
  },

  pill: {
    height: 46,
    borderRadius: 999,
    paddingHorizontal: 14,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  labelWrap: {
    overflow: "hidden",
    marginLeft: 8,
  },

  label: {
    color: "#fff",
    fontSize: 13,
    // kalau kamu sudah load poppins:
    fontFamily: "Poppins-SemiBold",
    // fallback jika belum:
    // fontWeight: "600",
  },
});
