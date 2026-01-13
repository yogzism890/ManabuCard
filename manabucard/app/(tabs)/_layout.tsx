import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // Kita sembunyikan label bawaan
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="home" label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="review"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="search" label="Belajar" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="bar-chart" label="Tambah" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="person" label="Profile" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

// Komponen kustom untuk Icon dan Label saat aktif
const TabIcon = ({ icon, label, focused }: { icon: any, label: string, focused: boolean }) => {
  return (
    <View style={[styles.iconContainer, focused && styles.activeTab]}>
      <Ionicons 
        name={icon} 
        size={22} 
        color={focused ? "#fff" : "#ccc"} 
      />
      {focused && (
        <Text style={styles.labelText}>{label}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    elevation: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Fallback transparan
    borderRadius: 30,
    height: 70,
    borderTopWidth: 0,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#9100FF', // Warna ungu seperti di gambar
    minWidth: 110,
  },
  labelText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 14,
  },
});