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
  FadeIn,
} from "react-native-reanimated";

const { height, width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  // Animasi untuk elemen
  const opacity = useSharedValue(0);
  
  // Animasi untuk logo (floating effect)
  const logoTranslateY = useSharedValue(0);
  const logoRotate = useSharedValue(0);
  
  // Animasi untuk floating cards di background
  const floatingCard1 = useSharedValue(0);
  const floatingCard2 = useSharedValue(0);
  const floatingCard3 = useSharedValue(0);
  const floatingCard4 = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
    
    // Animasi floating logo dengan sedikit rotasi
    logoTranslateY.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 2500 }),
        withTiming(0, { duration: 2500 })
      ),
      -1,
      false
    );
    
    logoRotate.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 2500 }),
        withTiming(5, { duration: 2500 }),
        withTiming(0, { duration: 2500 })
      ),
      -1,
      false
    );
    
    // Animasi floating cards background dengan variasi
    floatingCard1.value = withRepeat(
      withSequence(
        withTiming(-20, { duration: 3200 }),
        withTiming(0, { duration: 3200 })
      ),
      -1,
      false
    );
    
    floatingCard2.value = withRepeat(
      withSequence(
        withTiming(-25, { duration: 3800 }),
        withTiming(0, { duration: 3800 })
      ),
      -1,
      false
    );
    
    floatingCard3.value = withRepeat(
      withSequence(
        withTiming(-18, { duration: 3000 }),
        withTiming(0, { duration: 3000 })
      ),
      -1,
      false
    );
    
    floatingCard4.value = withRepeat(
      withSequence(
        withTiming(-22, { duration: 3500 }),
        withTiming(0, { duration: 3500 })
      ),
      -1,
      false
    );
  }, []);
  
  const logoAnim = useAnimatedStyle(() => ({
    transform: [
      { translateY: logoTranslateY.value },
      { rotate: `${logoRotate.value}deg` }
    ],
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
  
  const floatingAnim4 = useAnimatedStyle(() => ({
    transform: [{ translateY: floatingCard4.value }],
  }));

  return (
    <LinearGradient colors={["#FFF8E7", "#FFF0F5", "#E8F4FF"]} style={styles.container}>
      
      {/* Floating Flashcards Background - Lebih banyak & lebih playful */}
      <Animated.View style={[styles.floatingCard, styles.floatingCard1, floatingAnim1]}>
        <View style={[styles.miniCard, { backgroundColor: '#FFE8E8', transform: [{ rotate: '-15deg' }] }]}>
          <Text style={styles.starIcon}>⭐</Text>
        </View>
      </Animated.View>
      
      <Animated.View style={[styles.floatingCard, styles.floatingCard2, floatingAnim2]}>
        <View style={[styles.miniCard, { backgroundColor: '#FFE8F5', transform: [{ rotate: '12deg' }] }]}>
          <Text style={styles.starIcon}>💡</Text>
        </View>
      </Animated.View>
      
      <Animated.View style={[styles.floatingCard, styles.floatingCard3, floatingAnim3]}>
        <View style={[styles.miniCard, { backgroundColor: '#FFF4E0', transform: [{ rotate: '8deg' }] }]}>
          <Text style={styles.starIcon}>🎯</Text>
        </View>
      </Animated.View>
      
      <Animated.View style={[styles.floatingCard, styles.floatingCard4, floatingAnim4]}>
        <View style={[styles.miniCard, { backgroundColor: '#E8F5E9', transform: [{ rotate: '-10deg' }] }]}>
          <Text style={styles.starIcon}>🌟</Text>
        </View>
      </Animated.View>

      {/* Main Content Area - No Card Container */}
      <View style={styles.contentContainer}>
        
        {/* Logo dengan efek floating & rotate */}
        <Animated.Image
          entering={FadeInDown.delay(100).duration(800)}
          style={[styles.logo, logoAnim]}
          source={require('@/assets/images/manabulogo.png')} 
        />

        {/* Title with playful wave emoji */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.titleContainer}>
          <Text style={styles.waveEmoji}>👋</Text>
          <Text style={styles.title}>Hi Faiz</Text>
        </Animated.View>
        
        {/* Subtitle - lebih playful */}
        <Animated.Text entering={FadeInDown.delay(300).duration(600)} style={styles.subtitle}>
          Yuk mulai petualangan belajar{'\n'}yang seru dan menyenangkan! 🎉
        </Animated.Text>
        
        {/* Feature highlights - dengan emoji yang lebih besar & colorful */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <View style={[styles.featureBubble, { backgroundColor: '#FFE8E8' }]}>
              <Text style={styles.featureIcon}>📚</Text>
            </View>
            <Text style={styles.featureText}>Belajar{'\n'}Interaktif</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureBubble, { backgroundColor: '#E8F5FF' }]}>
              <Text style={styles.featureIcon}>🎨</Text>
            </View>
            <Text style={styles.featureText}>Desain{'\n'}Menarik</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureBubble, { backgroundColor: '#FFF4E0' }]}>
              <Text style={styles.featureIcon}>🚀</Text>
            </View>
            <Text style={styles.featureText}>Progres{'\n'}Cepat</Text>
          </View>
        </Animated.View>

        {/* Decorative stars */}
        <Animated.View entering={FadeIn.delay(600).duration(800)} style={styles.starsContainer}>
          <Text style={styles.decorativeStar}>✨</Text>
          <Text style={styles.decorativeText}>Siap jadi pintar?</Text>
          <Text style={styles.decorativeStar}>✨</Text>
        </Animated.View>
      </View>

      {/* Bottom Section - Button & Login */}
      <View style={styles.bottomSection}>
        
        {/* Start button - lebih besar & rounded */}
        <Animated.View entering={FadeInDown.delay(500).duration(600)} style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/onboarding" as any)} 
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#3A7DFF', '#5B93FF', '#7DA9FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Mulai Belajar</Text>
              <Text style={styles.buttonIcon}>🚀</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer login - lebih childish */}
        <Animated.View entering={FadeInDown.delay(700).duration(600)} style={styles.footerContainer}>
          <Text style={styles.footer}>
            Sudah punya akun? {" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/auth/login" as any)}>
            <Text style={styles.link}>Masuk di sini! 👉</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Content Container - No card background
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: height * 0.08,
  },
  
  logo: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  
  // Floating cards decoration - lebih banyak & tersebar
  floatingCard: {
    position: 'absolute',
    opacity: 0.5,
  },
  floatingCard1: {
    top: height * 0.12,
    left: width * 0.05,
  },
  floatingCard2: {
    top: height * 0.28,
    right: width * 0.05,
  },
  floatingCard3: {
    top: height * 0.08,
    right: width * 0.22,
  },
  floatingCard4: {
    top: height * 0.22,
    left: width * 0.15,
  },
  miniCard: {
    width: 65,
    height: 85,
    backgroundColor: '#E0F0FF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { height: 4, width: 0 },
    elevation: 5,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  starIcon: {
    fontSize: 32,
  },
  
  // Title styles - lebih playful
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  waveEmoji: {
    fontSize: 42,
    marginRight: 10,
  },
  title: {
    fontSize: 48,
    fontFamily: "FredokaBold",
    color: "#2D2D2D",
    textShadowColor: 'rgba(58, 125, 255, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 17,
    fontFamily: "Fredoka",
    color: "#666",
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 26,
  },
  
  // Features section - dengan bubble background
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureBubble: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { height: 3, width: 0 },
    elevation: 4,
  },
  featureIcon: {
    fontSize: 32,
  },
  featureText: {
    fontSize: 12,
    fontFamily: "Fredoka",
    color: "#888",
    textAlign: 'center',
    lineHeight: 16,
  },
  
  // Decorative stars section
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  decorativeStar: {
    fontSize: 20,
    marginHorizontal: 8,
  },
  decorativeText: {
    fontSize: 15,
    fontFamily: "FredokaBold",
    color: "#FF6B9D",
  },
  
  // Bottom section
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  
  // Button styles - lebih besar & rounded
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: "#3A7DFF",
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { height: 8, width: 0 },
    elevation: 10,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 50,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "FredokaBold",
    letterSpacing: 0.5,
    marginRight: 8,
  },
  buttonIcon: {
    fontSize: 24,
  },
  
  // Footer styles - lebih friendly
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  footer: {
    color: "#888",
    fontSize: 15,
    fontFamily: "Fredoka",
  },
  link: {
    color: "#3A7DFF",
    fontSize: 15,
    fontFamily: "FredokaBold",
  },
});