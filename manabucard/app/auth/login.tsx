import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      alert("Email & password wajib diisi");
      return;
    }

    // Dummy login
    if (email === "test@mail.com" && password === "123456") {
      alert("Login berhasil!");
      router.replace("/(tabs)");
    } else {
      alert("Email atau password salah (dummy)");
    }
  };

  return (
    <LinearGradient colors={["#F8FAF4", "#EEF2E6"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ width: "100%", alignItems: "center" }}
      >
        <Animated.View
          entering={FadeInDown.duration(600)}
          style={styles.card}
        >
          {/*  LOGO  */}
          <Animated.Image
            entering={FadeInDown.delay(150).duration(500)}
            source={require("@/assets/images/manabulogo.png")}
            style={styles.logo}
          />

          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Log in to continue</Text>

          {/* Email */}
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password */}
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Button */}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log in</Text>
          </TouchableOpacity>

          {/* Footer */}
          <Text style={styles.footer}>
            Don’t have an account?{" "}
            <Text
              style={styles.link}
              onPress={() => router.push("/auth/register")}
            >
              Register
            </Text>
          </Text>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "85%",
    paddingHorizontal: 28,
    paddingVertical: 36,
    backgroundColor: "white",
    borderRadius: 26,
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { height: 5, width: 0 },
    elevation: 8,
  },

  /* ⭐ STYLE LOGO */
  logo: {
    width: 120,
    height: 120,
    marginBottom: 15,
    borderRadius: 26,
  },

  title: {
    fontSize: 36,
    fontFamily: "FredokaBold",
    color: "#222",
  },

  subtitle: {
    fontSize: 16,
    fontFamily: "Fredoka",
    color: "#555",
    marginBottom: 32,
  },

  inputBox: {
    width: "100%",
    backgroundColor: "#F5F7F0",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 14,
  },

  input: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Fredoka",
  },

  button: {
    backgroundColor: "#3A7DFF",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 18,
    marginTop: 10,
    marginBottom: 14,
    elevation: 4,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "FredokaBold",
    fontSize: 18,
  },

  footer: {
    color: "#777",
    fontSize: 15,
    fontFamily: "Fredoka",
  },

  link: {
    color: "#3A7DFF",
    fontFamily: "FredokaBold",
  },
});
