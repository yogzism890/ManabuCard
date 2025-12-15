import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { useAuth } from "../../contexts/AuthContext";
import CustomModal from "../../components/ui/CustomModal";

const { width, height } = Dimensions.get("window");

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<'success' | 'error' | 'info' | 'warning'>('info');
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [modalConfirmText, setModalConfirmText] = useState("OK");
  const [onModalConfirm, setOnModalConfirm] = useState<(() => void) | undefined>();

  // Helper function to show modal
  const showModal = (
    title: string,
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    showConfirm: boolean = false,
    confirmText: string = "OK",
    onConfirm?: () => void
  ) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setShowConfirmButton(showConfirm);
    setModalConfirmText(confirmText);
    setOnModalConfirm(onConfirm);
    setModalVisible(true);
  };

  // Helper function to hide modal
  const hideModal = () => {
    setModalVisible(false);
  };

  const handleRegister = async () => {
    // 1. Validasi Input
    if (!email || !password || !confirmPassword) {
      showModal("Gagal", "Semua field wajib diisi!", "error");
      return;
    }

    if (password.length < 6) {
      showModal("Gagal", "Password minimal 6 karakter!", "error");
      return;
    }

    if (password !== confirmPassword) {
      showModal("Gagal", "Password konfirmasi tidak sama!", "error");
      return;
    }

    // 2. Mulai Proses Register
    setIsLoading(true);
    try {
      const result = await register(email, password);

      if (result.success) {
        // SUKSES dengan confirm button
        showModal(
          "Sukses", 
          result.message, 
          "success", 
          true, 
          "OK", 
          () => router.replace("/auth/login")
        );
      } else {
        // GAGAL
        showModal("Gagal", result.message, "error");
      }

    } catch (error) {
      console.error("Register Error:", error);
      showModal("Error", "Terjadi kesalahan tak terduga", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#FFF8E7", "#FFF0F5", "#E8F4FF"]} style={styles.container}>
      
      {/* Floating decorative elements */}
      <Animated.Text entering={FadeIn.delay(200)} style={[styles.floatingEmoji, styles.emoji1]}>
        🎨
      </Animated.Text>
      <Animated.Text entering={FadeIn.delay(300)} style={[styles.floatingEmoji, styles.emoji2]}>
        ✨
      </Animated.Text>
      <Animated.Text entering={FadeIn.delay(400)} style={[styles.floatingEmoji, styles.emoji3]}>
        🚀
      </Animated.Text>
      <Animated.Text entering={FadeIn.delay(500)} style={[styles.floatingEmoji, styles.emoji4]}>
        📚
      </Animated.Text>

      {/* Decorative circles */}
      <View style={[styles.decorativeCircle, styles.circle1]} />
      <View style={[styles.decorativeCircle, styles.circle2]} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(600)} style={styles.card}>
            
            {/* Top accent bar */}
            <View style={styles.cardAccent} />

            {/* Logo with bubble */}
            <Animated.View
              entering={FadeInDown.delay(150).duration(500)}
              style={styles.logoContainer}
            >
              <View style={styles.logoBubble}>
                <Animated.Image
                  source={require("@/assets/images/manabulogo.png")}
                  style={styles.logo}
                />
              </View>
            </Animated.View>

            {/* Title with sparkle emoji */}
            <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.titleContainer}>
              <Text style={styles.sparkleEmoji}>✨</Text>
              <Text style={styles.title}>Daftar Yuk!</Text>
            </Animated.View>

            <Animated.Text entering={FadeInDown.delay(250).duration(500)} style={styles.subtitle}>
              Bergabung dengan ManabuCard sekarang
            </Animated.Text>

            {/* Email Input with icon */}
            <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.inputWrapper}>
              <View style={styles.inputBox}>
                <Text style={styles.inputIcon}>📧</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#aaa"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </Animated.View>

            {/* Password Input with icon */}
            <Animated.View entering={FadeInDown.delay(350).duration(500)} style={styles.inputWrapper}>
              <View style={styles.inputBoxRow}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Password"
                  placeholderTextColor="#aaa"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeIcon}>{showPassword ? "👁️" : "🙈"}</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Confirm Password Input with icon */}
            <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.inputWrapper}>
              <View style={styles.inputBoxRow}>
                <Text style={styles.inputIcon}>🔐</Text>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Konfirmasi Password"
                  placeholderTextColor="#aaa"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeIcon}>{showConfirmPassword ? "👁️" : "🙈"}</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Password Hint */}
            <Animated.View entering={FadeInDown.delay(450).duration(500)} style={styles.hintContainer}>
              <Text style={styles.hintText}>💡 Password minimal 6 karakter</Text>
            </Animated.View>

            {/* Register Button */}
            <Animated.View entering={FadeInDown.delay(500).duration(500)} style={styles.buttonWrapper}>
              <TouchableOpacity 
                style={styles.button}
                onPress={handleRegister}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={["#3A7DFF", "#5B93FF", "#7DA9FF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Text style={styles.buttonText}>Daftar Sekarang</Text>
                      <Text style={styles.buttonEmoji}>🎉</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Divider */}
            <Animated.View entering={FadeInDown.delay(550).duration(500)} style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>atau</Text>
              <View style={styles.divider} />
            </Animated.View>

            {/* Footer - Login Link */}
            <Animated.View entering={FadeInDown.delay(600).duration(500)} style={styles.footerContainer}>
              <Text style={styles.footer}>
                Sudah punya akun?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/auth/login")}>
                <Text style={styles.link}>Masuk di sini! 👉</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Custom Modal */}
      <CustomModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
        onClose={hideModal}
        showConfirmButton={showConfirmButton}
        confirmButtonText={modalConfirmText}
        onConfirm={onModalConfirm}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Floating emojis
  floatingEmoji: {
    position: "absolute",
    fontSize: 32,
    opacity: 0.3,
    zIndex: 1,
  },
  emoji1: {
    top: height * 0.1,
    left: width * 0.08,
  },
  emoji2: {
    top: height * 0.18,
    right: width * 0.08,
  },
  emoji3: {
    top: height * 0.06,
    right: width * 0.25,
  },
  emoji4: {
    bottom: height * 0.12,
    left: width * 0.1,
  },

  // Decorative circles
  decorativeCircle: {
    position: "absolute",
    borderRadius: 1000,
    opacity: 0.1,
    zIndex: 0,
  },
  circle1: {
    width: 200,
    height: 200,
    backgroundColor: "#FFE8F5",
    top: height * 0.08,
    left: -60,
  },
  circle2: {
    width: 180,
    height: 180,
    backgroundColor: "#E8F5FF",
    bottom: height * 0.1,
    right: -50,
  },

  keyboardView: {
    flex: 1,
    width: "100%",
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },

  card: {
    width: "90%",
    maxWidth: 420,
    paddingHorizontal: 28,
    paddingVertical: 36,
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    alignItems: "center",
    shadowColor: "#3A7DFF",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { height: 10, width: 0 },
    elevation: 10,
    overflow: "hidden",
  },

  cardAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: "#3A7DFF",
  },

  // Logo styles
  logoContainer: {
    marginBottom: 20,
  },
  logoBubble: {
    backgroundColor: "rgba(58, 125, 255, 0.08)",
    borderRadius: 35,
    padding: 15,
    borderWidth: 3,
    borderColor: "rgba(58, 125, 255, 0.15)",
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 20,
  },

  // Title styles
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sparkleEmoji: {
    fontSize: 32,
    marginRight: 8,
  },
  title: {
    fontSize: 32,
    fontFamily: "FredokaBold",
    color: "#2D2D2D",
  },

  subtitle: {
    fontSize: 15,
    fontFamily: "Fredoka",
    color: "#777",
    marginBottom: 24,
    textAlign: "center",
  },

  // Input styles
  inputWrapper: {
    width: "100%",
    marginBottom: 14,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FC",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: "#E8EBF0",
  },
  inputBoxRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FC",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: "#E8EBF0",
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontFamily: "Fredoka",
  },
  eyeButton: {
    padding: 4,
    marginLeft: 8,
  },
  eyeIcon: {
    fontSize: 20,
  },

  // Hint text
  hintContainer: {
    width: "100%",
    marginBottom: 20,
  },
  hintText: {
    fontSize: 13,
    fontFamily: "Fredoka",
    color: "#888",
    textAlign: "left",
  },

  // Button styles
  buttonWrapper: {
    width: "100%",
    marginBottom: 20,
  },
  button: {
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#3A7DFF",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { height: 6, width: 0 },
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "FredokaBold",
    fontSize: 18,
    marginRight: 6,
  },
  buttonEmoji: {
    fontSize: 20,
  },

  // Divider
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#999",
    fontFamily: "Fredoka",
    fontSize: 13,
  },

  // Footer
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  footer: {
    color: "#888",
    fontSize: 15,
    fontFamily: "Fredoka",
  },
  link: {
    color: "#3A7DFF",
    fontFamily: "FredokaBold",
    fontSize: 15,
  },
});