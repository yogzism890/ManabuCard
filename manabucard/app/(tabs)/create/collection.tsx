import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

import { useAuth } from "../../../contexts/AuthContext";
import Input from "../../../components/ui/Input";

const { width } = Dimensions.get("window");

export default function CreateCollectionScreen() {
  const { apiRequest, isAuthenticated } = useAuth();

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ nama: boolean }>({ nama: false });

  const canSubmit = useMemo(() => name.trim().length > 0 && !loading, [name, loading]);

  const handleCreate = async () => {
    if (!isAuthenticated) {
      Alert.alert("Error", "Silakan login terlebih dahulu");
      return;
    }

    const errorStatus = { nama: name.trim() === "" };
    setError(errorStatus);
    if (Object.values(errorStatus).some(Boolean)) return;

    setLoading(true);
    try {
      const newCollection = await apiRequest("/koleksi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: name.trim(),
          deskripsi: desc.trim(),
        }),
      });

      Alert.alert("Sukses", "Koleksi berhasil dibuat");

      setName("");
      setDesc("");

      router.replace({
        pathname: "/create/card",
        params: {
          collectionId: newCollection.id,
          collectionName: newCollection.nama,
        },
      });
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <LinearGradient colors={["#F6F7FB", "#F6F7FB"]} style={styles.page}>
        {/* Subtle decorations */}
        <View style={styles.blob1} />
        <View style={styles.blob2} />
        <Animated.View entering={FadeIn.delay(150)} style={styles.sparkle}>
          <Feather name="sparkles" size={18} color="rgba(58,125,255,0.35)" />
        </Animated.View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.header}>
            <View style={styles.headerTopRow}>
              <View style={styles.badge}>
                <Feather name="folder" size={14} color="#3A7DFF" />
                <Text style={styles.badgeText}>Create Collection</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.helpBtn}
                onPress={() =>
                  Alert.alert(
                    "Tips",
                    "Nama koleksi sebaiknya singkat dan jelas. Contoh: Matematika, Bahasa Inggris, Biologi."
                  )
                }
              >
                <Feather name="info" size={18} color="#111827" />
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>Buat Koleksi Baru</Text>
            <Text style={styles.subtitle}>
              Atur kartu belajarmu biar rapi dan gampang direview.
            </Text>
          </Animated.View>

          {/* Form Card */}
          <Animated.View entering={FadeInDown.delay(170).duration(600)} style={styles.card}>
            {/* Info inline */}
            <View style={styles.info}>
              <View style={styles.infoIcon}>
                <Feather name="zap" size={16} color="#3A7DFF" />
              </View>
              <Text style={styles.infoText}>
                Koleksi = grup kartu berdasarkan topik/mata pelajaran.
              </Text>
            </View>

            {/* Field: Name */}
            <View style={styles.field}>
              <Text style={styles.label}>Nama Koleksi</Text>
              <View style={styles.inputRow}>
                <View style={styles.leftIcon}>
                  <Feather name="edit-3" size={18} color="#6B7280" />
                </View>

                <View style={{ flex: 1 }}>
                  <Input
                    label="" // supaya label kamu tidak dobel (jika Input punya label internal)
                    value={name}
                    onChangeText={(text) => {
                      setName(text);
                      if (text.trim() !== "") setError({ nama: false });
                    }}
                    error={error.nama ? "Nama koleksi tidak boleh kosong" : ""}
                    placeholder="Contoh: Bahasa Inggris"
                  />
                </View>
              </View>
            </View>

            {/* Field: Desc */}
            <View style={styles.field}>
              <Text style={styles.label}>Deskripsi (Opsional)</Text>
              <View style={styles.inputRow}>
                <View style={styles.leftIcon}>
                  <Feather name="file-text" size={18} color="#6B7280" />
                </View>

                <View style={{ flex: 1 }}>
                  <Input
                    label=""
                    value={desc}
                    onChangeText={setDesc}
                    multiline
                    placeholder="Contoh: Kosa kata + grammar penting untuk ujian."
                  />
                </View>
              </View>
            </View>

            {/* Preview */}
            {name.trim() !== "" && (
              <Animated.View entering={FadeInDown.duration(350)} style={styles.preview}>
                <View style={styles.previewHeader}>
                  <Feather name="eye" size={16} color="#3A7DFF" />
                  <Text style={styles.previewTitle}>Preview</Text>
                </View>

                <Text style={styles.previewName}>{name.trim()}</Text>
                {desc.trim() !== "" && (
                  <Text style={styles.previewDesc}>{desc.trim()}</Text>
                )}
              </Animated.View>
            )}

            {/* Submit */}
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.primaryBtn, !canSubmit && styles.primaryBtnDisabled]}
              onPress={handleCreate}
              disabled={!canSubmit}
            >
              <LinearGradient
                colors={canSubmit ? ["#3A7DFF", "#5B93FF"] : ["#CBD5E1", "#CBD5E1"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryBtnGrad}
              >
                <Text style={styles.primaryBtnText}>
                  {loading ? "Membuat..." : "Buat Koleksi"}
                </Text>
                <View style={styles.primaryBtnIcon}>
                  <Feather
                    name={loading ? "loader" : "arrow-right"}
                    size={18}
                    color="#fff"
                  />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Tips */}
            <View style={styles.tips}>
              <Text style={styles.tipsTitle}>Tips cepat</Text>
              <View style={styles.tipRow}>
                <Feather name="check" size={16} color="#10B981" />
                <Text style={styles.tipText}>Nama singkat & spesifik.</Text>
              </View>
              <View style={styles.tipRow}>
                <Feather name="check" size={16} color="#10B981" />
                <Text style={styles.tipText}>Deskripsi untuk tujuan koleksi.</Text>
              </View>
              <View style={styles.tipRow}>
                <Feather name="check" size={16} color="#10B981" />
                <Text style={styles.tipText}>Boleh buat banyak koleksi.</Text>
              </View>
            </View>
          </Animated.View>

          <View style={{ height: 22 }} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F6F7FB" },
  page: { flex: 1 },

  content: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 26,
  },

  // decorations
  blob1: {
    position: "absolute",
    top: -80,
    left: -70,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "rgba(58,125,255,0.10)",
  },
  blob2: {
    position: "absolute",
    bottom: -90,
    right: -80,
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: "rgba(255,196,107,0.12)",
  },
  sparkle: {
    position: "absolute",
    top: 18,
    right: 18,
    width: 34,
    height: 34,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.75)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
  },

  // header
  header: {
    paddingTop: 6,
    paddingBottom: 12,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
  },
  badgeText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12.5,
    color: "#111827",
  },
  helpBtn: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 26,
    color: "#111827",
  },
  subtitle: {
    marginTop: 6,
    fontFamily: "Poppins_400Regular",
    fontSize: 13.5,
    color: "#6B7280",
    lineHeight: 20,
  },

  // card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },

  // info
  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "rgba(58,125,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(58,125,255,0.16)",
    marginBottom: 14,
  },
  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 12.8,
    color: "#374151",
    lineHeight: 18,
  },

  // field
  field: { marginTop: 10 },
  label: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13.5,
    color: "#111827",
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  leftIcon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Platform.OS === "android" ? 2 : 0,
  },

  // preview
  preview: {
    marginTop: 14,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "rgba(17,24,39,0.03)",
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  previewTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13,
    color: "#3A7DFF",
  },
  previewName: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    color: "#111827",
  },
  previewDesc: {
    marginTop: 6,
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 19,
  },

  // button
  primaryBtn: {
    marginTop: 16,
    borderRadius: 18,
    overflow: "hidden",
  },
  primaryBtnDisabled: {
    opacity: 0.85,
  },
  primaryBtnGrad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  primaryBtnText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
    color: "#fff",
    marginRight: 10,
  },
  primaryBtnIcon: {
    width: 34,
    height: 34,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  // tips
  tips: {
    marginTop: 14,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "rgba(255,196,107,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,196,107,0.20)",
  },
  tipsTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 13.5,
    color: "#111827",
    marginBottom: 8,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 6,
  },
  tipText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12.8,
    color: "#374151",
  },
});
