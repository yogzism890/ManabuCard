import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Semua field wajib diisi.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Password tidak sama.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password minimal 6 karakter.");
      return;
    }

    // DUMMY REGISTER (belum terhubung API)
    Alert.alert("Berhasil", "Akun berhasil dibuat!");

    // Setelah register → ke login
    router.push("/auth/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/auth/login")}>
        <Text style={styles.link}>
          Sudah punya akun? <Text style={styles.linkBold}>Log in</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#3A7DFF",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  link: { marginTop: 15, textAlign: "center", color: "#777" },
  linkBold: { color: "#3A7DFF", fontWeight: "bold" },
});
