import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');

const LandingScreen = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroIcon}>
          <Text style={styles.heroIconText}>🧠</Text>
        </View>
        <Text style={styles.heroTitle}>Selamat Datang di Manabu</Text>
        <Text style={styles.heroSubtitle}>
          Platform pembelajaran cerdas dengan kartu pintar untuk meningkatkan daya ingat Anda
        </Text>
        <TouchableOpacity style={styles.heroButton}>
          <Link href="/review" asChild>
            <Text style={styles.heroButtonText}>Mulai Belajar →</Text>
          </Link>
        </TouchableOpacity>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Fitur Utama</Text>

        <View style={styles.featureGrid}>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>📚</Text>
            <Text style={styles.featureTitle}>Koleksi Pintar</Text>
            <Text style={styles.featureDescription}>
              Kelompokkan kartu belajar Anda dalam koleksi yang terorganisir
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🔄</Text>
            <Text style={styles.featureTitle}>Spaced Repetition</Text>
            <Text style={styles.featureDescription}>
              Algoritma cerdas untuk mengulang materi pada waktu yang tepat
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>📊</Text>
            <Text style={styles.featureTitle}>Progress Tracking</Text>
            <Text style={styles.featureDescription}>
              Pantau perkembangan belajar Anda dengan statistik detail
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🎯</Text>
            <Text style={styles.featureTitle}>Personalized Learning</Text>
            <Text style={styles.featureDescription}>
              Sesuaikan kecepatan belajar dengan tingkat penguasaan Anda
            </Text>
          </View>
        </View>
      </View>

      {/* How It Works Section */}
      <View style={styles.howItWorksSection}>
        <Text style={styles.sectionTitle}>Cara Kerja</Text>

        <View style={styles.stepContainer}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepTitle}>Buat Koleksi</Text>
            <Text style={styles.stepDescription}>
              Mulai dengan membuat koleksi kartu belajar untuk topik yang ingin Anda pelajari
            </Text>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepTitle}>Tambah Kartu</Text>
            <Text style={styles.stepDescription}>
              Buat kartu dengan pertanyaan di satu sisi dan jawaban di sisi lainnya
            </Text>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepTitle}>Belajar & Ulangi</Text>
            <Text style={styles.stepDescription}>
              Sistem akan menjadwalkan ulangan pada interval yang optimal untuk daya ingat maksimal
            </Text>
          </View>
        </View>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Siap Meningkatkan Daya Ingat Anda?</Text>
        <Text style={styles.ctaSubtitle}>
          Bergabunglah dengan ribuan pelajar yang telah berhasil menggunakan Manabu
        </Text>

        <View style={styles.ctaButtons}>
          <TouchableOpacity style={styles.primaryButton}>
            <Link href="/review" asChild>
              <Text style={styles.primaryButtonText}>Buat Konten Baru</Text>
            </Link>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
            <Link href="/review" asChild>
              <Text style={styles.secondaryButtonText}>Mulai Belajar</Text>
            </Link>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 70,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderRadius: 0,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(99, 102, 241, 0.05)',
  },
  heroIcon: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 35,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  heroIconText: {
    fontSize: 65,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 18,
  },
  heroSubtitle: {
    fontSize: 19,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 45,
    paddingHorizontal: 25,
    fontWeight: '500',
  },
  heroButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 45,
    paddingVertical: 18,
    borderRadius: 35,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  heroButtonText: {
    color: '#ffffff',
    fontSize: 19,
    fontWeight: 'bold',
  },
  featuresSection: {
    paddingVertical: 70,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9ff',
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 50,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 28,
    marginBottom: 24,
    width: (width - 60) / 2,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.08)',
  },
  featureIcon: {
    fontSize: 45,
    marginBottom: 18,
  },
  featureTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 14,
  },
  featureDescription: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '400',
  },
  howItWorksSection: {
    backgroundColor: '#ffffff',
    paddingVertical: 70,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.05)',
  },
  stepContainer: {
    marginTop: 50,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 50,
  },
  stepNumber: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 25,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  stepNumberText: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
  },
  stepDescription: {
    fontSize: 17,
    color: '#64748b',
    lineHeight: 26,
    flex: 1,
    fontWeight: '400',
  },
  ctaSection: {
    paddingVertical: 70,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
  },
  ctaTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 18,
  },
  ctaSubtitle: {
    fontSize: 19,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 50,
    paddingHorizontal: 25,
    fontWeight: '500',
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  primaryButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 36,
    paddingVertical: 18,
    borderRadius: 35,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#6366f1',
    paddingHorizontal: 36,
    paddingVertical: 18,
    borderRadius: 35,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  secondaryButtonText: {
    color: '#6366f1',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default LandingScreen;
