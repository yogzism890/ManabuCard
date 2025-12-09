import React, { useEffect } from "react";
import { Text, TouchableOpacity, StyleSheet, View, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  FadeInDown,
  withRepeat,
  withSequence,
} from "react-native-reanimated";

const { height, width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  // Animasi untuk kartu
  const scale = useSharedValue(0.2);
  const opacity = useSharedValue(0);
  
  // Animasi untuk logo (floating effect)
  const logoTranslateY = useSharedValue(0);
  
  // Animasi untuk floating cards di background
  const floatingCard1 = useSharedValue(0);
  const floatingCard2 = useSharedValue(0);
  const floatingCard3 = useSharedValue(0);

  useEffect(() => {
    // Animasi kartu utama
    scale.value = withTiming(1, { duration: 600 });
    opacity.value = withTiming(1, { duration: 600 });
    
    // Animasi floating logo
    logoTranslateY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 2000 }),
        withTiming(0, { duration: 2000 })
      ),
      -1,
      false
    );
    
    // Animasi floating cards background
    floatingCard1.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 3000 }),
        withTiming(0, { duration: 3000 })
      ),
      -1,
      false
    );
    
    floatingCard2.value = withRepeat(
      withSequence(
        withTiming(-20, { duration: 3500 }),
        withTiming(0, { duration: 3500 })
      ),
      -1,
      false
    );
    
    floatingCard3.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 2800 }),
        withTiming(0, { duration: 2800 })
      ),
      -1,
      false
    );
  }, []);

  const cardAnim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  
  const logoAnim = useAnimatedStyle(() => ({
    transform: [{ translateY: logoTranslateY.value }],
  }));
  
  const floatingAnim1 = useAnimatedStyle(() => ({
    transform: [{ translateY: floatingCard1.value }],
  }));
  
  const floatingAnim2 = useAnimatedStyle(() => ({
    transform: [{ translateY: floatingCard2.value }],
  }));
  
  const floatingAnim3 = useAnimatedStyle(() => ({
    transform: [{ translateY: floatingCard3.value }],
  }));

  return (
    <LinearGradient colors={["#E8F5F7", "#F0F9FA", "#FEFEFE"]} style={styles.container}>
      
      {/* Floating Flashcards Background Decoration */}
      <Animated.View style={[styles.floatingCard, styles.floatingCard1, floatingAnim1]}>
        <View style={styles.miniCard}>
          <Text style={styles.starIcon}>⭐</Text>
        </View>
      </Animated.View>
      
      <Animated.View style={[styles.floatingCard, styles.floatingCard2, floatingAnim2]}>
        <View style={[styles.miniCard, { backgroundColor: '#FFE8E8' }]}>
          <Text style={styles.starIcon}>💡</Text>
        </View>
      </Animated.View>
      
      <Animated.View style={[styles.floatingCard, styles.floatingCard3, floatingAnim3]}>
        <View style={[styles.miniCard, { backgroundColor: '#FFF4E0' }]}>
          <Text style={styles.starIcon}>🎯</Text>
        </View>
      </Animated.View>

      {/* Logo dengan efek floating */}
      <Animated.Image
        entering={FadeInDown.delay(100).duration(800)}
        style={[styles.logo, logoAnim]}
        source={require('@/assets/images/manabulogo.png')} 
      />

      {/* Main Welcome Card */}
      <Animated.View style={[styles.card, cardAnim]}>
        
        {/* Decorative accent on top of card */}
        <View style={styles.cardAccent} />
        
        {/* Title with icon */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.titleContainer}>
          <Text style={styles.waveEmoji}>👋</Text>
          <Text style={styles.title}>Hi Faiz</Text>
        </Animated.View>
        
        {/* Subtitle */}
        <Animated.Text entering={FadeInDown.delay(300).duration(600)} style={styles.subtitle}>
          Selamat datang kembali di ManabuCard!
        </Animated.Text>
        
        {/* Feature highlights */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📚</Text>
            <Text style={styles.featureText}>Belajar Interaktif</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🎨</Text>
            <Text style={styles.featureText}>Desain Menarik</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🚀</Text>
            <Text style={styles.featureText}>Progres Cepat</Text>
          </View>
        </Animated.View>

        {/* Start button dengan efek shimmer */}
        <Animated.View entering={FadeInDown.delay(500).duration(600)} style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/onboarding" as any)} 
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#3A7DFF', '#5B93FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Mulai Belajar</Text>
              <Text style={styles.buttonIcon}>→</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer login */}
        <Animated.View entering={FadeInDown.delay(700).duration(600)} style={styles.footerContainer}>
          <Text style={styles.footer}>
            Already using ManabuCard?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/auth/login" as any)}>
            <Text style={styles.link}>Log in</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
      
      {/* Bottom wave decoration */}
      <View style={styles.bottomWave}>
        <Text style={styles.bottomWaveText}>✨ Mulai perjalanan belajarmu ✨</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: height * 0.03,
  },
  
  // Floating cards decoration
  floatingCard: {
    position: 'absolute',
    opacity: 0.6,
  },
  floatingCard1: {
    top: height * 0.15,
    left: width * 0.08,
  },
  floatingCard2: {
    top: height * 0.25,
    right: width * 0.08,
  },
  floatingCard3: {
    top: height * 0.12,
    right: width * 0.25,
  },
  miniCard: {
    width: 60,
    height: 80,
    backgroundColor: '#E0F0FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { height: 4, width: 0 },
    elevation: 4,
  },
  starIcon: {
    fontSize: 24,
  },
  
  // Main card styles
  card: {
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 36,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    width: "90%",
    maxWidth: 420,
    shadowColor: "#3A7DFF",
    shadowOpacity: 0.15,
    shadowRadius: 24,
    shadowOffset: { height: 12, width: 0 },
    elevation: 12,
    overflow: 'hidden',
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#3A7DFF',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  waveEmoji: {
    fontSize: 32,
    marginRight: 8,
  },
  title: {
    fontSize: 36,
    fontFamily: "FredokaBold",
    color: "#1A1A1A",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Fredoka",
    color: "#666",
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  
  // Features section
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 11,
    fontFamily: "Fredoka",
    color: "#888",
    textAlign: 'center',
  },
  
  // Button styles
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#3A7DFF",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { height: 6, width: 0 },
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 50,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "FredokaBold",
    letterSpacing: 0.5,
    marginRight: 8,
  },
  buttonIcon: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "FredokaBold",
  },
  
  // Footer styles
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  footer: {
    color: "#888",
    fontSize: 14,
    fontFamily: "Fredoka",
  },
  link: {
    color: "#3A7DFF",
    fontSize: 14,
    fontFamily: "FredokaBold",
    textDecorationLine: 'underline',
  },
  
  // Bottom decoration
  bottomWave: {
    position: 'absolute',
    bottom: 30,
  },
  bottomWaveText: {
    fontSize: 13,
    fontFamily: "Fredoka",
    color: "#999",
    opacity: 0.7,
  },
});