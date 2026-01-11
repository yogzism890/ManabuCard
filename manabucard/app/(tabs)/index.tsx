import React from 'react';
import {
  Image,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';



const { width, height } = Dimensions.get('window');

const LandingScreen = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Background Gradient */}
      <LinearGradient
        colors={["#FFF8E7", "#FFF0F5", "#E8F4FF"]}
        style={styles.gradientBackground}
      >
        {/* Floating decorative emojis */}
        <Animated.Text entering={FadeIn.delay(200)} style={[styles.floatingEmoji, styles.emoji1]}>
          ⭐
        </Animated.Text>
        <Animated.Text entering={FadeIn.delay(300)} style={[styles.floatingEmoji, styles.emoji2]}>
          🎨
        </Animated.Text>
        <Animated.Text entering={FadeIn.delay(400)} style={[styles.floatingEmoji, styles.emoji3]}>
          💡
        </Animated.Text>
        <Animated.Text entering={FadeIn.delay(500)} style={[styles.floatingEmoji, styles.emoji4]}>
          📚
        </Animated.Text>

        {/* Decorative circles */}
        <View style={[styles.decorativeCircle, styles.circle1]} />
        <View style={[styles.decorativeCircle, styles.circle2]} />
        <View style={[styles.decorativeCircle, styles.circle3]} />

        {/* Hero Section */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.heroSection}>
          <View style={styles.heroIconContainer}>
            <View style={styles.heroIcon}>
              <Image
                source={require('../../assets/images/manabulogo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.heroIconBorder} />
          </View>

          <View style={styles.heroTitleContainer}>
            <Text style={styles.heroEmoji}>✨</Text>
            <Text style={styles.heroTitle}>Hallo!</Text>
          </View>

          <Text style={styles.heroSubtitle}>
            Belajar jadi lebih seru dan mudah dengan kartu pintar ManabuCard! 🎉
          </Text>

          <TouchableOpacity style={styles.heroButton} activeOpacity={0.85}>
            <Link href="/(tabs)/review" asChild>
              <LinearGradient
                colors={['#3A7DFF', '#5B93FF', '#7DA9FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroButtonGradient}
              >
                <Text style={styles.heroButtonText}>Mulai</Text>
                <Text style={styles.heroButtonIcon}>🚀</Text>
              </LinearGradient>
            </Link>
          </TouchableOpacity>
        </Animated.View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Fitur Keren</Text>
          </Animated.View>

          <View style={styles.featureGrid}>
            <Animated.View entering={FadeInDown.delay(250).duration(600)} style={styles.featureCardWrapper}>
              <View style={[styles.featureCard, { backgroundColor: '#E8F4FF' }]}>
                <View style={styles.featureIconBubble}>
                  <Text style={styles.featureIcon}>📚</Text>
                </View>
                <Text style={styles.featureTitle}>Koleksi Pintar</Text>
                <Text style={styles.featureDescription}>
                  Kelompokkan kartu belajarmu dalam koleksi yang rapi
                </Text>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.featureCardWrapper}>
              <View style={[styles.featureCard, { backgroundColor: '#FFE8F5' }]}>
                <View style={styles.featureIconBubble}>
                  <Text style={styles.featureIcon}>🔄</Text>
                </View>
                <Text style={styles.featureTitle}>Pengulangan Cerdas</Text>
                <Text style={styles.featureDescription}>
                  Sistem pintar yang tahu kapan kamu harus mengulang
                </Text>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(350).duration(600)} style={styles.featureCardWrapper}>
              <View style={[styles.featureCard, { backgroundColor: '#FFF4E0' }]}>
                <View style={styles.featureIconBubble}>
                  <Text style={styles.featureIcon}>📊</Text>
                </View>
                <Text style={styles.featureTitle}>Pantau Progress</Text>
                <Text style={styles.featureDescription}>
                  Lihat perkembangan belajarmu dengan grafik menarik
                </Text>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.featureCardWrapper}>
              <View style={[styles.featureCard, { backgroundColor: '#E8F5E9' }]}>
                <View style={styles.featureIconBubble}>
                  <Text style={styles.featureIcon}>🎯</Text>
                </View>
                <Text style={styles.featureTitle}>Belajar Santai</Text>
                <Text style={styles.featureDescription}>
                  Sesuaikan kecepatan belajar sesuai kemampuanmu
                </Text>
              </View>
            </Animated.View>
          </View>
        </View>

        {/* How It Works Section */}
        <View style={styles.howItWorksSection}>
          <Animated.View entering={FadeInDown.delay(450).duration(600)} style={styles.sectionHeader}>
            <Text style={styles.sectionEmoji}>💡</Text>
            <Text style={styles.sectionTitle}>Cara Kerjanya</Text>
          </Animated.View>

          <View style={styles.stepContainer}>
            <Animated.View entering={FadeInDown.delay(500).duration(600)} style={styles.step}>
              <View style={styles.stepNumberContainer}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>🎨 Buat Koleksi</Text>
                <Text style={styles.stepDescription}>
                  Mulai dengan membuat koleksi untuk topik yang mau kamu pelajari
                </Text>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(550).duration(600)} style={styles.step}>
              <View style={styles.stepNumberContainer}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>✏️ Tambah Kartu</Text>
                <Text style={styles.stepDescription}>
                  Buat kartu dengan pertanyaan dan jawaban yang seru
                </Text>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.step}>
              <View style={styles.stepNumberContainer}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>🚀 Belajar & Ulangi</Text>
                <Text style={styles.stepDescription}>
                  Sistem akan bantu kamu mengingat dengan cara yang fun!
                </Text>
              </View>
            </Animated.View>
          </View>
        </View>

        {/* CTA Section */}
        <Animated.View entering={FadeInDown.delay(650).duration(600)} style={styles.ctaSection}>
          <Text style={styles.ctaEmoji}>🎉</Text>
          <Text style={styles.ctaTitle}>Siap Jadi Lebih Pintar?</Text>
          <Text style={styles.ctaSubtitle}>
            Yuk gabung dengan ribuan pelajar yang sudah belajar pakai ManabuCard!
          </Text>

          <View style={styles.ctaButtons}>
            <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85}>
              <Link href="/(tabs)/create" asChild>
                <LinearGradient
                  colors={['#3A7DFF', '#5B93FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.primaryButtonGradient}
                >
                  <Text style={styles.primaryButtonText}>Buat Kartu</Text>
                  <Text style={styles.buttonEmoji}>✨</Text>
                </LinearGradient>
              </Link>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.85}>
              <Link href="/(tabs)/review" asChild>
                <Text style={styles.secondaryButtonText}>Mulai Belajar 🚀</Text>
              </Link>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E7',
  },

  gradientBackground: {
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
    top: height * 0.08,
    left: width * 0.08,
  },
  emoji2: {
    top: height * 0.35,
    right: width * 0.08,
  },
  emoji3: {
    top: height * 0.55,
    left: width * 0.1,
  },
  emoji4: {
    top: height * 0.75,
    right: width * 0.12,
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
    top: height * 0.15,
    left: -60,
  },
  circle2: {
    width: 180,
    height: 180,
    backgroundColor: "#E8F5FF",
    top: height * 0.45,
    right: -50,
  },
  circle3: {
    width: 160,
    height: 160,
    backgroundColor: "#FFF4E0",
    top: height * 0.7,
    left: -40,
  },

  // Hero Section
  heroSection: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },

  logoImage: {
  width: 120,
  height: 120,
  },


  heroIconContainer: {
    position: 'relative',
    marginBottom: 28,
  },

  heroIcon: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3A7DFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },

  heroIconBorder: {
    position: 'absolute',
    width: 118,
    height: 118,
    borderRadius: 59,
    borderWidth: 3,
    borderColor: '#3A7DFF',
    top: -4,
    left: -4,
  },

  heroIconText: {
    fontSize: 55,
  },

  heroTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  heroEmoji: {
    fontSize: 32,
    marginRight: 8,
  },

  heroTitle: {
    fontSize: 32,
    fontFamily: 'FredokaBold',
    color: '#2D2D2D',
    textAlign: 'center',
  },

  heroSubtitle: {
    fontSize: 17,
    fontFamily: 'Fredoka',
    color: '#666',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 32,
    paddingHorizontal: 20,
  },

  heroButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#3A7DFF',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { height: 6, width: 0 },
    elevation: 8,
  },

  heroButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 16,
  },

  heroButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'FredokaBold',
    marginRight: 8,
  },

  heroButtonIcon: {
    fontSize: 20,
  },

  // Features Section
  featuresSection: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },

  sectionEmoji: {
    fontSize: 28,
    marginRight: 10,
  },

  sectionTitle: {
    fontSize: 26,
    fontFamily: 'FredokaBold',
    color: '#2D2D2D',
  },

  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 14,
  },

  featureCardWrapper: {
    width: (width - 54) / 2,
  },

  featureCard: {
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { height: 6, width: 0 },
    elevation: 5,
  },

  featureIconBubble: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },

  featureIcon: {
    fontSize: 32,
  },

  featureTitle: {
    fontSize: 16,
    fontFamily: 'FredokaBold',
    color: '#2D2D2D',
    textAlign: 'center',
    marginBottom: 8,
  },

  featureDescription: {
    fontSize: 13,
    fontFamily: 'Fredoka',
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },

  // How It Works Section
  howItWorksSection: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },

  stepContainer: {
    marginTop: 20,
    gap: 24,
  },

  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { height: 4, width: 0 },
    elevation: 3,
  },

  stepNumberContainer: {
    marginRight: 16,
  },

  stepNumber: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3A7DFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3A7DFF',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { height: 4, width: 0 },
    elevation: 6,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },

  stepNumberText: {
    color: '#ffffff',
    fontSize: 22,
    fontFamily: 'FredokaBold',
  },

  stepContent: {
    flex: 1,
  },

  stepTitle: {
    fontSize: 18,
    fontFamily: 'FredokaBold',
    color: '#2D2D2D',
    marginBottom: 6,
  },

  stepDescription: {
    fontSize: 15,
    fontFamily: 'Fredoka',
    color: '#666',
    lineHeight: 22,
  },

  // CTA Section
  ctaSection: {
    paddingVertical: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  ctaEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },

  ctaTitle: {
    fontSize: 28,
    fontFamily: 'FredokaBold',
    color: '#2D2D2D',
    textAlign: 'center',
    marginBottom: 12,
  },

  ctaSubtitle: {
    fontSize: 16,
    fontFamily: 'Fredoka',
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },

  ctaButtons: {
    width: '100%',
    gap: 14,
  },

  primaryButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#3A7DFF',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { height: 6, width: 0 },
    elevation: 8,
  },

  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },

  primaryButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontFamily: 'FredokaBold',
    marginRight: 8,
  },

  buttonEmoji: {
    fontSize: 20,
  },

  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#3A7DFF',
    paddingVertical: 16,
    borderRadius: 20,
    shadowColor: '#3A7DFF',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { height: 4, width: 0 },
    elevation: 6,
    alignItems: 'center',
  },

  secondaryButtonText: {
    color: '#3A7DFF',
    fontSize: 17,
    fontFamily: 'FredokaBold',
  },
});

export default LandingScreen;