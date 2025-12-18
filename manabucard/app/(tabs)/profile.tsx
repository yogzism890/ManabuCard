import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, Alert, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';

// --- Tipe Data ---
interface UserStats {
  totalCollections: number;
  totalCards: number;
  cardsDueToday: number;
}

const { width, height } = Dimensions.get('window');
const isSmall = width < 360;
const isTablet = width > 768;

const ProfileScreen = () => {
  const router = useRouter();
  const { user, logout, apiRequest } = useAuth();
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
      const collections = await apiRequest('/koleksi');

      let totalCards = 0;
      let cardsDueToday = 0;
      const now = new Date();

      for (const collection of collections) {
        const cards = await apiRequest(`/koleksi/${collection.id}/kartu`);
        totalCards += cards.length;
        cardsDueToday += cards.filter((card: any) => new Date(card.reviewDueAt) <= now).length;
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
        <Text style={styles.loadingText}>⏳ Memuat...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#FFF8E7", "#FFF0F5", "#E8F4FF"]} style={styles.container}>
      
      {/* Floating decorative emojis */}
      <Animated.Text entering={FadeIn.delay(200)} style={[styles.floatingEmoji, styles.emoji1]}>
        ⭐
      </Animated.Text>
      <Animated.Text entering={FadeIn.delay(300)} style={[styles.floatingEmoji, styles.emoji2]}>
        🎯
      </Animated.Text>
      <Animated.Text entering={FadeIn.delay(400)} style={[styles.floatingEmoji, styles.emoji3]}>
        💡
      </Animated.Text>

      {/* Decorative circles */}
      <View style={[styles.decorativeCircle, styles.circle1]} />
      <View style={[styles.decorativeCircle, styles.circle2]} />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER CARD WITH AVATAR */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.headerCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: `https://ui-avatars.com/api/?name=${user?.email || 'User'}&background=3A7DFF&color=fff&size=200` }}
              style={styles.avatar}
            />
            <View style={styles.avatarBorder} />
          </View>
          
          <View style={styles.headerTextContainer}>
            <View style={styles.greetingRow}>
              <Text style={styles.waveEmoji}>👋</Text>
              <Text style={styles.headerTitle}>Halo!</Text>
            </View>
            <Text style={styles.headerEmail}>{user?.email || 'Pengguna'}</Text>
            <View style={styles.badgeContainer}>
              <View style={styles.badge}>
                <Text style={styles.badgeIcon}>🌟</Text>
                <Text style={styles.badgeText}>Member Aktif</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* SECTION TITLE */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.sectionTitleContainer}>
          <Text style={styles.sectionIcon}>📊</Text>
          <Text style={styles.sectionTitle}>Statistik Belajarmu</Text>
        </Animated.View>

        {/* STATS CARDS */}
        <View style={styles.statsWrapper}>
          {/* Total Collections */}
          <Animated.View entering={FadeInDown.delay(250).duration(600)} style={styles.statCardWrapper}>
            <View style={[styles.statCard, { backgroundColor: '#E8F4FF' }]}>
              <View style={styles.statIconBubble}>
                <Text style={styles.statEmoji}>📚</Text>
              </View>
              <Text style={styles.statNumber}>{stats.totalCollections}</Text>
              <Text style={styles.statLabel}>Koleksi</Text>
              <View style={styles.statAccent} />
            </View>
          </Animated.View>

          {/* Total Cards */}
          <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.statCardWrapper}>
            <View style={[styles.statCard, { backgroundColor: '#FFE8F5' }]}>
              <View style={styles.statIconBubble}>
                <Text style={styles.statEmoji}>🎴</Text>
              </View>
              <Text style={styles.statNumber}>{stats.totalCards}</Text>
              <Text style={styles.statLabel}>Total Kartu</Text>
              <View style={styles.statAccent} />
            </View>
          </Animated.View>

          {/* Cards Due Today */}
          <Animated.View entering={FadeInDown.delay(350).duration(600)} style={styles.statCardWrapper}>
            <View style={[styles.statCard, { backgroundColor: '#FFF4E0' }]}>
              <View style={styles.statIconBubble}>
                <Text style={styles.statEmoji}>⏰</Text>
              </View>
              <Text style={styles.statNumber}>{stats.cardsDueToday}</Text>
              <Text style={styles.statLabel}>Jatuh Tempo</Text>
              <View style={styles.statAccent} />
            </View>
          </Animated.View>
        </View>

        {/* MOTIVATIONAL CARD */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.motivationCard}>
          <Text style={styles.motivationEmoji}>🚀</Text>
          <Text style={styles.motivationText}>
            Kamu sudah belajar {stats.totalCards} kartu! Terus semangat ya! 💪
          </Text>
        </Animated.View>

        {/* ACTION BUTTONS */}
        <Animated.View entering={FadeInDown.delay(450).duration(600)} style={styles.actionsContainer}>
          {/* Refresh Button */}
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={loadUserStats}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={["#3A7DFF", "#5B93FF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.refreshGradient}
            >
              <Text style={styles.refreshIcon}>🔄</Text>
              <Text style={styles.refreshText}>Refresh Statistik</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
            activeOpacity={0.85}
          >
            <Text style={styles.logoutText}>Keluar</Text>
            <Text style={styles.logoutIcon}>👋</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Bottom spacing */}
        <View style={{ height: 30 }} />
      </ScrollView>
    </LinearGradient>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Floating emojis
  floatingEmoji: {
    position: "absolute",
    fontSize: 32,
    opacity: 0.25,
    zIndex: 1,
  },
  emoji1: {
    top: height * 0.12,
    left: width * 0.08,
  },
  emoji2: {
    top: height * 0.25,
    right: width * 0.08,
  },
  emoji3: {
    top: height * 0.08,
    right: width * 0.25,
  },

  // Decorative circles
  decorativeCircle: {
    position: "absolute",
    borderRadius: 1000,
    opacity: 0.08,
    zIndex: 0,
  },
  circle1: {
    width: 200,
    height: 200,
    backgroundColor: "#FFE8E8",
    top: height * 0.1,
    left: -60,
  },
  circle2: {
    width: 180,
    height: 180,
    backgroundColor: "#E8F5FF",
    bottom: height * 0.15,
    right: -50,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8E7',
  },

  loadingText: {
    fontSize: 20,
    fontFamily: 'FredokaBold',
    color: '#666',
  },

  scrollContent: {
    padding: 22,
    paddingTop: 60,
  },

  /* ========== HEADER CARD ========== */
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#3A7DFF',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    marginBottom: 28,
    overflow: 'hidden',
  },

  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },

  avatarBorder: {
    position: 'absolute',
    width: 98,
    height: 98,
    borderRadius: 49,
    borderWidth: 3,
    borderColor: '#3A7DFF',
    top: -4,
    left: -4,
  },

  headerTextContainer: {
    alignItems: 'center',
  },

  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  waveEmoji: {
    fontSize: 28,
    marginRight: 8,
  },

  headerTitle: {
    fontSize: 26,
    fontFamily: 'FredokaBold',
    color: '#2D2D2D',
  },

  headerEmail: {
    fontSize: 15,
    fontFamily: 'Fredoka',
    color: '#777',
    marginBottom: 12,
  },

  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(58, 125, 255, 0.1)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(58, 125, 255, 0.2)',
  },

  badgeIcon: {
    fontSize: 16,
    marginRight: 4,
  },

  badgeText: {
    fontSize: 13,
    fontFamily: 'FredokaBold',
    color: '#3A7DFF',
  },

  /* ========== SECTION TITLE ========== */
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  sectionIcon: {
    fontSize: 24,
    marginRight: 8,
  },

  sectionTitle: {
    fontSize: 20,
    fontFamily: 'FredokaBold',
    color: '#2D2D2D',
  },

  /* ========== STATS CARDS ========== */
  statsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 14,
    marginBottom: 20,
  },

  statCardWrapper: {
    width: width < 360 ? '100%' : width > 768 ? '32%' : '31%',
  },

  statCard: {
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    position: 'relative',
    overflow: 'hidden',
  },

  statAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },

  statIconBubble: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },

  statEmoji: {
    fontSize: 26,
  },

  statNumber: {
    fontSize: isTablet ? 40 : 36,
    fontFamily: 'FredokaBold',
    color: '#2D2D2D',
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 14,
    fontFamily: 'Fredoka',
    color: '#666',
  },

  /* ========== MOTIVATION CARD ========== */
  motivationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  motivationEmoji: {
    fontSize: 36,
    marginRight: 12,
  },

  motivationText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Fredoka',
    color: '#555',
    lineHeight: 22,
  },

  /* ========== ACTION BUTTONS ========== */
  actionsContainer: {
    gap: 14,
  },

  refreshButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#3A7DFF',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { height: 6, width: 0 },
    elevation: 6,
  },

  refreshGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },

  refreshIcon: {
    fontSize: 20,
    marginRight: 8,
  },

  refreshText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'FredokaBold',
  },

  logoutButton: {
    backgroundColor: '#FF6B9D',
    paddingVertical: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B9D',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { height: 6, width: 0 },
    elevation: 6,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },

  logoutText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'FredokaBold',
    marginRight: 8,
  },

  logoutIcon: {
    fontSize: 20,
  },
});