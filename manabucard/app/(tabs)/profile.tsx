import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '../../components/ui/Button';

// --- KONSTANTA API ---
const API_BASE_URL = 'http://192.168.1.7:3000/api';
const MOCK_AUTH_TOKEN = 'YOUR_AUTH_TOKEN_HERE';

// --- Tipe Data ---
interface UserStats {
  totalCollections: number;
  totalCards: number;
  cardsDueToday: number;
}

const ProfileScreen = () => {
  const router = useRouter();
  const [stats, setStats] = useState<UserStats>({
    totalCollections: 0,
    totalCards: 0,
    cardsDueToday: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      const collectionsResponse = await fetch(`${API_BASE_URL}/koleksi`, {
        headers: { Authorization: `Bearer ${MOCK_AUTH_TOKEN}` },
      });
      const collections = collectionsResponse.ok ? await collectionsResponse.json() : [];

      let totalCards = 0;
      let cardsDueToday = 0;
      const now = new Date();

      for (const collection of collections) {
        const cardsResponse = await fetch(
          `${API_BASE_URL}/koleksi/${collection.id}/kartu`,
          { headers: { Authorization: `Bearer ${MOCK_AUTH_TOKEN}` } }
        );

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
    Alert.alert('Logout', 'Apakah Anda yakin ingin logout?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Logout',
        onPress: () => router.replace('/auth/login'),
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 18, color: '#444' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profil Pengguna</Text>
        <Text style={styles.subtitle}>Statistik Belajar Anda</Text>
      </View>

      {/* Statistik */}
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

      {/* Tombol Aksi */}
      <View style={styles.actionsContainer}>
        <Button
          title="Refresh Statistik"
          onPress={loadUserStats}
          variant="secondary"
        />

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

/* ===============================
          STYLING BARU
   =============================== */

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F5F7FA',
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: 35,
    marginTop: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E2A38',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    color: '#7A8C9A',
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 35,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 25,
    borderRadius: 18,
    alignItems: 'center',

    // Soft shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },

  statNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: '#2D9CDB',
    marginBottom: 6,
  },

  statLabel: {
    fontSize: 14,
    color: '#6F7F8F',
    textAlign: 'center',
  },

  actionsContainer: {
    gap: 15,
    marginTop: 10,
  },

  logoutButton: {
    backgroundColor: '#E63946',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },

  logoutText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});
