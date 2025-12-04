import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Ikon bawaan Expo

// Data sementara (Mock Data) untuk kategori hafalan
const categories = [
  { id: 1, title: 'Essential Verbs', count: 50, color: '#FF6B6B', icon: 'walk-outline' },
  { id: 2, title: 'Travel & Places', count: 30, color: '#4ECDC4', icon: 'airplane-outline' },
  { id: 3, title: 'Daily Conversation', count: 45, color: '#FFE66D', icon: 'chatbubbles-outline' },
  { id: 4, title: 'Business English', count: 25, color: '#1A535C', icon: 'briefcase-outline' },
];

export default function HomeScreen() {
  
  // Fungsi ketika kategori diklik
  const handleCategoryPress = (categoryTitle: string, id: number) => {
    // Arahkan ke halaman detail dengan membawa param id
    // Pastikan file app/study/[id].tsx sudah dibuat
    router.push({
      pathname: "/study/[id]",
      params: { id: id }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 1. Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, Learner! 👋</Text>
            <Text style={styles.subGreeting}>Siap menambah kosakata hari ini?</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={40} color="#333" />
          </TouchableOpacity>
        </View>

        {/* 2. Progress Card (Statistik) */}
        <View style={styles.progressCard}>
          <View>
            <Text style={styles.progressLabel}>Target Harian</Text>
            <Text style={styles.progressValue}>12 / 20 <Text style={{fontSize: 14}}>Kata</Text></Text>
          </View>
          {/* Progress Bar Sederhana */}
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: '60%' }]} />
          </View>
          <Text style={styles.motivationText}>Hebat! Sedikit lagi mencapai target.</Text>
        </View>

        {/* 3. Categories / Decks Section */}
        <Text style={styles.sectionTitle}>Pilih Topik Hafalan</Text>
        
        <View style={styles.gridContainer}>
          {categories.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.card, { borderLeftColor: item.color }]}
              // PERBAIKAN DI SINI: Mengirimkan item.title DAN item.id
              onPress={() => handleCategoryPress(item.title, item.id)}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                {/* @ts-ignore - Ionicons glyph map types */}
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardCount}>{item.count} Kartu</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Warna background abu-abu sangat muda
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subGreeting: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  profileButton: {
    padding: 4,
  },
  progressCard: {
    backgroundColor: '#4F46E5', // Warna ungu/biru modern
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  progressLabel: {
    color: '#E0E7FF',
    fontSize: 14,
    marginBottom: 4,
  },
  progressValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    marginBottom: 10,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  motivationText: {
    color: '#E0E7FF',
    fontSize: 12,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 15,
  },
  gridContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 6, // Memberikan aksen warna di kiri
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  cardCount: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
});