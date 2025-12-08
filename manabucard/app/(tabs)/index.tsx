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
            <Link href="/create" asChild>
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
    backgroundColor: '#f8f9fa',
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  heroIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  heroIconText: {
    fontSize: 60,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  heroButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  heroButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  featuresSection: {
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 40,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    width: (width - 60) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 12,
  },
  featureDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
  },
  howItWorksSection: {
    backgroundColor: '#fff',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  stepContainer: {
    marginTop: 40,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  stepNumber: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#7f8c8d',
    lineHeight: 24,
    flex: 1,
  },
  ctaSection: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 16,
  },
  ctaSubtitle: {
    fontSize: 18,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#3498db',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LandingScreen;
