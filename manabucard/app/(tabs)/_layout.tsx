import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3498db',
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Manabucard',
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="school" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="review"
        options={{
          title: 'Ulangi',
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="reload-circle" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          title: 'Buat',
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="add-circle" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
