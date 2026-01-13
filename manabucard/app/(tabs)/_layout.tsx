import React from "react";
import { Tabs } from "expo-router";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

const ACTIVE = "#9100FF";
const INACTIVE_ICON = "#9CA3AF";  // abu icon
const INACTIVE_TEXT = "#9CA3AF";  // abu text
const ACTIVE_TEXT = "#FFFFFF";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={focused ? "home" : "home-outline"} label="Home" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="review"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={focused ? "storefront" : "storefront-outline"} label="Belajar" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={focused ? "heart" : "heart-outline"} label="Tambah" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={focused ? "person" : "person-outline"} label="Profile" focused={focused} />
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
  const anim = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(focused ? 1 : 0.98, { duration: 160 }) }],
      backgroundColor: withTiming(focused ? ACTIVE : "transparent", { duration: 160 }),
    };
  }, [focused]);

  return (
    <Animated.View style={[styles.item, anim]}>
      <Ionicons
        name={icon}
        size={22}
        color={focused ? "#fff" : INACTIVE_ICON}
      />
      <Text style={[styles.label, { color: focused ? ACTIVE_TEXT : INACTIVE_TEXT }]}>
        {label}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: Platform.OS === "ios" ? 18 : 16,
    height: 60,
    borderRadius: 99,

    backgroundColor: "rgba(255,255,255,0.96)",
    borderTopWidth: 0,
    borderWidth: 0,
    borderColor: "rgba(15, 23, 42, 0.06)",

    paddingHorizontal: 10,
    paddingVertical: 10,

    // shadow halus seperti gambar
    shadowColor: "#0000",
    shadowOpacity: 0.10,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 100 },
    elevation: 10,
  },

  tabBarItem: {
    // bikin jarak aman & capsule tidak kepotong
    marginVertical: 10,
  },

  item: {
    height: 54,
    borderRadius: 999,
    paddingHorizontal: 14,

    alignItems: "center",
    justifyContent: "center",

    // ikon & teks vertikal seperti gambar
    flexDirection: "column",

    // biar capsule aktif tidak nabrak
    minWidth: 78,
  },

  label: {
    marginTop: 4,
    fontSize: 11.5,
    fontFamily: "Poppins-SemiBold",
  },
});
