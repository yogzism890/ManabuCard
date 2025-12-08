import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons'; // Contoh penggunaan icon

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3498db', // Warna aktif (biru)
        headerShown: true, // Tampilkan header navigasi
      }}
    >
      <Tabs.Screen
        name="index" // Ini merujuk ke app/(tabs)/index.tsx (Home/Belajar)
        options={{
          title: 'Manabucard',
          tabBarIcon: ({ color }) => <Ionicons name="school" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="review" // Ini merujuk ke app/(tabs)/review.tsx
        options={{
          title: 'Ulangi',
          tabBarIcon: ({ color }) => <Ionicons name="reload-circle" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="create" // Ini merujuk ke app/(tabs)/create.tsx (Buat Kartu)
        options={{
          title: 'Buat',
          tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile" // Ini merujuk ke app/(tabs)/profile.tsx
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}