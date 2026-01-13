import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAuth } from "../../contexts/AuthContext";
import CustomModal from "../../components/ui/CustomModal";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) router.replace("/(tabs)");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#F8F0FF", "#F0F4FF", "#FFFFFF"]} style={styles.container}>
      {/* Ornamen Latar Belakang */}
      <View style={[styles.circle, { top: -50, right: -100, backgroundColor: "#E0D0FF" }]} />
      <View style={[styles.circle, { bottom: -50, left: -100, backgroundColor: "#D0E0FF" }]} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
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
            <Text style={styles.title}>Halo Kembali!</Text>
            <Text style={styles.subtitle}>Masuk untuk melanjutkan progresmu</Text>
          </View>

          <View style={styles.form}>
            {/* Input dengan Border "Highlight" (Bukan Garis Hitam) */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail" size={20} color="#9100FF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Anda"
                placeholderTextColor="#A0A0A0"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color="#9100FF" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Password"
                placeholderTextColor="#A0A0A0"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#CCC" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Lupa Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Tombol yang "Pas" dengan Gambar Navigasi */}
          <TouchableOpacity 
            style={styles.mainBtn} 
            onPress={handleLogin}
            activeOpacity={0.8}
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
                  <Text style={styles.btnText}>Masuk Sekarang</Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Belum punya akun? </Text>
            <TouchableOpacity onPress={() => router.push("/auth/register")}>
              <Text style={styles.linkText}>Daftar ✨</Text>
            </TouchableOpacity>
          </View>

        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  circle: { position: "absolute", width: 300, height: 300, borderRadius: 150, opacity: 0.4 },
  keyboardView: { width: "100%", alignItems: "center" },

  // KARTU UTAMA (Seamless Glass)
  glassCard: {
    width: width * 0.88,
    backgroundColor: "rgba(255, 255, 255, 0.65)", // Transparansi kaca
    borderRadius: 35, // Radius besar agar tidak kaku
    padding: 30,
    alignItems: "center",
    // Border Putih Tipis (Efek Highlight)
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.8)",
    // Shadow lembut warna ungu
    // shadowColor: "#9100FF",
    // shadowOffset: { width: 0, height: 15 },
    // shadowOpacity: 0.1,
    // shadowRadius: 25,
    // elevation: 10,
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

  form: { width: "100%", marginBottom: 25 },
  
  // INPUT SEAMLESS (Tanpa border hitam kaku)
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 22, // Membulat sempurna
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(145, 0, 255, 0.08)", // Border ungu sangat tipis
  },
  inputIcon: { marginRight: 15 },
  input: { fontSize: 15, fontWeight: "600", color: "#1A1A1A" },

  forgotBtn: { alignSelf: "flex-end", marginTop: -5 },
  forgotText: { fontSize: 13, color: "#9100FF", fontWeight: "700" },

  // TOMBOL CAPSULE (Sesuai gambar nav bar)
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