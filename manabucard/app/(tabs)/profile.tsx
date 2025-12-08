import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '../../components/ui/Button';

// --- KONSTANTA API ---
const API_BASE_URL = 'http://192.168.100.9:3000/api';
const MOCK_AUTH_TOKEN = 'YOUR_AUTH_TOKEN_HERE';

// --- Tipe Data ---
interface UserStats {
  totalCollections: number;
  totalCards: number;
  cardsDueToday: number;
}

const ProfileScreen = () => {
  const router = useRouter();
  const [stats, setStats] = useState<UserStats>({ totalCollections: 0, totalCards: 0, cardsDueToday: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      // Ambil koleksi
      const collectionsResponse = await fetch(`${API_BASE_URL}/koleksi`, {
        headers: { 'Authorization': `Bearer ${MOCK_AUTH_TOKEN}` },
      });
      const collections = collectionsResponse.ok ? await collectionsResponse.json() : [];

      // Hitung total kartu dan kartu jatuh tempo
      let totalCards = 0;
      let cardsDueToday = 0;
      const now = new Date();

      for (const collection of collections) {
        const cardsResponse = await fetch(`${API_BASE_URL}/koleksi/${collection.id}/kartu`, {
          headers: { 'Authorization': `Bearer ${MOCK_AUTH_TOKEN}` },
        });
        if (cardsResponse.ok) {
          const cards = await cardsResponse.json();
          totalCards += cards.length;
          cardsDueToday += cards.filter((card: any) => new Date(card.reviewDueAt) <= now).length;
        }
      }

      setStats({
        totalCollections: collections.length,
        totalCards,
        cardsDueToday,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      Alert.alert('Error', 'Gagal memuat statistik pengguna.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Apakah Anda yakin ingin logout?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Logout',
          onPress: () => {
            // Reset token atau navigasi ke login
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profil Pengguna</Text>
        <Text style={styles.subtitle}>Statistik Belajar Anda</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalCollections}</Text>
          <Text style={styles.statLabel}>Koleksi</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalCards}</Text>
          <Text style={styles.statLabel}>Kartu Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.cardsDueToday}</Text>
          <Text style={styles.statLabel}>Kartu Jatuh Tempo</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <Button title="Refresh Statistik" onPress={loadUserStats} variant="secondary" />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 80,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  actionsContainer: {
    gap: 15,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
