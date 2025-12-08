import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, Alert, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE_URL } from '../../constants/apiConfig';
import Button from '../../components/ui/Button';

// --- Tipe Data ---
interface UserStats {
  totalCollections: number;
  totalCards: number;
  cardsDueToday: number;
}

const { width } = Dimensions.get('window');
const isSmall = width < 360;
const isTablet = width > 768;

const ProfileScreen = () => {
  const router = useRouter();
  const { user, logout, token } = useAuth();
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
        headers: { Authorization: `Bearer ${token}` },
      });
      const collections = collectionsResponse.ok ? await collectionsResponse.json() : [];

      let totalCards = 0;
      let cardsDueToday = 0;
      const now = new Date();

      for (const collection of collections) {
        const cardsResponse = await fetch(
          `${API_BASE_URL}/koleksi/${collection.id}/kartu`,
          { headers: { Authorization: `Bearer ${token}` } }
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
        onPress: async () => {
          await logout();
          router.replace('/auth/login');
        },
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
      {/* HEADER PREMIUM */}
      <View style={styles.headerCard}>
        <Image
          source={{ uri: `https://ui-avatars.com/api/?name=${user?.email || 'User'}&background=0D8ABC&color=fff` }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.headerTitle}>Halo, {user?.email || 'Pengguna'}</Text>
          <Text style={styles.headerSubtitle}>Selamat datang kembali 👋</Text>
        </View>
      </View>

      {/* JUDUL */}
      <View style={{ marginTop: 30 }}>
        <Text style={styles.sectionTitle}>Statistik Belajar</Text>
      </View>

      {/* STAT CARD RESPONSIVE */}
      <View style={styles.statsWrapper}>
        <View style={styles.statCard}>
          <Ionicons name="albums-outline" size={28} color="#2D9CDB" />
          <Text style={styles.statNumber}>{stats.totalCollections}</Text>
          <Text style={styles.statLabel}>Koleksi</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="layers-outline" size={28} color="#EE6C4D" />
          <Text style={styles.statNumber}>{stats.totalCards}</Text>
          <Text style={styles.statLabel}>Kartu Total</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="time-outline" size={28} color="#8E44AD" />
          <Text style={styles.statNumber}>{stats.cardsDueToday}</Text>
          <Text style={styles.statLabel}>Jatuh Tempo</Text>
        </View>
      </View>

      {/* ACTION BUTTONS */}
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

/* =========================================
      PREMIUM RESPONSIVE UI STYLES
   ========================================= */

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 22,
    backgroundColor: '#F5F7FA',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* ========== HEADER CARD ========== */
  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E2A38',
  },

  headerSubtitle: {
    fontSize: 14,
    color: '#7A8C9A',
  },

  /* ========== SECTION TITLE ========== */
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E2A38',
  },

  /* ========== RESPONSIVE STAT CARD GRID ========== */
  statsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 15,
    gap: 15,
  },

  statCard: {
    width: width < 360 ? '100%' : width > 768 ? '32%' : '31%',
    backgroundColor: '#fff',
    paddingVertical: 25,
    borderRadius: 18,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  statNumber: {
    fontSize: isTablet ? 40 : 32,
    fontWeight: '900',
    color: '#1E2A38',
    marginTop: 6,
  },

  statLabel: {
    fontSize: 14,
    color: '#6F7F8F',
    marginTop: 4,
  },

  /* ========== BUTTON AREA ========== */
  actionsContainer: {
    marginTop: 25,
    gap: 15,
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
