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
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAuth } from "../../contexts/AuthContext";
import CustomModal from "../../components/ui/CustomModal";

const { width } = Dimensions.get("window");

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
    <LinearGradient colors={["#F8F0FF", "#F0F4FF", "#FFFFFF"]} style={styles.container}>
      {/* Ornamen Latar Belakang */}
      <View style={[styles.circle, { top: -50, right: -100, backgroundColor: "#E0D0FF" }]} />
      <View style={[styles.circle, { bottom: -50, left: -100, backgroundColor: "#D0E0FF" }]} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeInDown.duration(800)} style={styles.glassCard}>
            
            {/* Logo dengan Bayangan Lembut */}
            <View style={styles.logoWrapper}>
              <View style={styles.logoInner}>
                <Animated.Image
                  source={require("@/assets/images/manabulogo.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
            </View>

            <View style={styles.textHeader}>
              <Text style={styles.title}>Bergabung Sekarang!</Text>
              <Text style={styles.subtitle}>Buat akun untuk memulai perjalanan belajarmu</Text>
            </View>

            <View style={styles.form}>
              {/* Input Email */}
              <View style={styles.inputContainer}>
                <Ionicons name="mail" size={20} color="#9100FF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email Anda"
                  placeholderTextColor="#A0A0A0"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              {/* Input Password */}
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color="#9100FF" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Password"
                  placeholderTextColor="#A0A0A0"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#CCC" />
                </TouchableOpacity>
              </View>

              {/* Input Konfirmasi Password */}
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color="#9100FF" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Konfirmasi Password"
                  placeholderTextColor="#A0A0A0"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="#CCC" />
                </TouchableOpacity>
              </View>

              {/* Info Password */}
              <View style={styles.passwordInfo}>
                <Ionicons name="information-circle" size={14} color="#777" />
                <Text style={styles.passwordInfoText}>
                  Password minimal 6 karakter
                </Text>
              </View>
            </View>

            {/* Tombol Register Capsule */}
            <TouchableOpacity 
              style={styles.mainBtn} 
              onPress={handleRegister}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <LinearGradient
                colors={["#9100FF", "#7100CC"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btnGradient}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.btnText}>Daftar Sekarang</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Sudah punya akun? </Text>
              <TouchableOpacity onPress={() => router.push("/auth/login")}>
                <Text style={styles.linkText}>Masuk ✨</Text>
              </TouchableOpacity>
            </View>

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
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  circle: { position: "absolute", width: 300, height: 300, borderRadius: 150, opacity: 0.4 },
  keyboardView: { flex: 1, width: "100%" },
  scrollContent: { 
    flexGrow: 1, 
    justifyContent: "center", 
    alignItems: "center",
    paddingVertical: 40,
  },

  // KARTU UTAMA (Seamless Glass)
  glassCard: {
    width: width * 0.88,
    backgroundColor: "rgba(255, 255, 255, 0.65)",
    borderRadius: 35,
    padding: 30,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },

  logoWrapper: { marginBottom: 20 },
  logoInner: {
    width: 80,
    height: 80,
    borderRadius: 25,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  logo: { width: 50, height: 50 },

  textHeader: { alignItems: "center", marginBottom: 30 },
  title: { fontSize: 28, fontWeight: "800", color: "#1A1A1A" },
  subtitle: { fontSize: 14, color: "#777", marginTop: 6, textAlign: "center" },

  form: { width: "100%", marginBottom: 20 },
  
  // INPUT SEAMLESS
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(145, 0, 255, 0.08)",
  },
  inputIcon: { marginRight: 15 },
  input: { fontSize: 15, fontWeight: "600", color: "#1A1A1A", flex: 1 },

  passwordInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -8,
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  passwordInfoText: {
    fontSize: 12,
    color: "#777",
    marginLeft: 6,
    flex: 1,
  },

  // TOMBOL CAPSULE
  mainBtn: { 
    width: "100%", 
    borderRadius: 25, 
    overflow: "hidden", 
    elevation: 8,
    shadowColor: "#9100FF",
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
  },
  btnGradient: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", 
    paddingVertical: 18, 
    gap: 12 
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "800" },

  footer: { flexDirection: "row", alignItems: "center", marginTop: 25 },
  footerText: { fontSize: 14, color: "#666" },
  linkText: { fontSize: 14, color: "#9100FF", fontWeight: "800" },
});