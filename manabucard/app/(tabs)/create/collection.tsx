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

const ACCENT = "#9100FF";

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
      <View style={styles.page}>
        {/* Background */}
        <LinearGradient
          colors={["#F7F7FB", "#F7F7FB"]}
          style={StyleSheet.absoluteFill}
        />

        {/* Soft blobs */}
        <View style={styles.blob1} />
        <View style={styles.blob2} />
        <Animated.View entering={FadeIn.delay(120)} style={styles.sparkle}>
          <Feather name="star" size={16} color="rgba(145,0,255,0.35)" />
        </Animated.View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View entering={FadeInDown.delay(80).duration(600)} style={styles.header}>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <View style={styles.badgeDot} />
                <Text style={styles.badgeText}>Create Collection</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.helpBtn}
                onPress={() =>
                  Alert.alert(
                    "Tips",
                    "Nama koleksi sebaiknya singkat & jelas. Contoh: Matematika, Bahasa Inggris, Biologi."
                  )
                }
              >
                <Feather name="info" size={18} color="#111827" />
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>Buat Koleksi Baru</Text>
            <Text style={styles.subtitle}>
              Atur kartu belajarmu jadi lebih rapi, gampang dicari, dan enak direview.
            </Text>
          </Animated.View>

          {/* Card */}
          <Animated.View entering={FadeInDown.delay(140).duration(600)} style={styles.card}>
            {/* Info */}
            <View style={styles.info}>
              <View style={styles.infoIcon}>
                <Feather name="zap" size={16} color={ACCENT} />
              </View>
              <Text style={styles.infoText}>
                Koleksi membantu kamu mengelompokkan kartu berdasarkan topik / mata pelajaran.
              </Text>
            </View>

            {/* Field: Nama */}
            <View style={styles.field}>
              <Text style={styles.label}>Nama Koleksi</Text>
              <View style={styles.inputShell}>
                <Feather name="edit-3" size={18} color="#6B7280" />
                <View style={styles.inputFlex}>
                  <Input
                    label="" // supaya label tidak dobel
                    value={name}
                    onChangeText={(t) => {
                      setName(t);
                      if (t.trim() !== "") setError({ nama: false });
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
              <View style={[styles.inputShell, styles.inputShellTop]}>
                <Feather name="file-text" size={18} color="#6B7280" />
                <View style={styles.inputFlex}>
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
              <Animated.View entering={FadeInDown.duration(300)} style={styles.preview}>
                <View style={styles.previewHead}>
                  <Feather name="eye" size={16} color={ACCENT} />
                  <Text style={styles.previewTitle}>Preview</Text>
                </View>

                <Text style={styles.previewName}>{name.trim()}</Text>
                {desc.trim() !== "" && (
                  <Text style={styles.previewDesc}>{desc.trim()}</Text>
                )}
              </Animated.View>
            )}

            {/* Button */}
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.primaryBtn, !canSubmit && styles.primaryBtnDisabled]}
              onPress={handleCreate}
              disabled={!canSubmit}
            >
              <LinearGradient
                colors={canSubmit ? [ACCENT, "#B44CFF"] : ["#CBD5E1", "#CBD5E1"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryGrad}
              >
                <Text style={styles.primaryText}>
                  {loading ? "Membuat..." : "Buat Koleksi"}
                </Text>
                <View style={styles.primaryIcon}>
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
                <View style={[styles.tipCheck, { backgroundColor: "rgba(16,185,129,0.12)" }]}>
                  <Feather name="check" size={14} color="#10B981" />
                </View>
                <Text style={styles.tipText}>Nama singkat & spesifik.</Text>
              </View>

              <View style={styles.tipRow}>
                <View style={[styles.tipCheck, { backgroundColor: "rgba(16,185,129,0.12)" }]}>
                  <Feather name="check" size={14} color="#10B981" />
                </View>
                <Text style={styles.tipText}>Deskripsi untuk tujuan koleksi.</Text>
              </View>

              <View style={styles.tipRow}>
                <View style={[styles.tipCheck, { backgroundColor: "rgba(16,185,129,0.12)" }]}>
                  <Feather name="check" size={14} color="#10B981" />
                </View>
                <Text style={styles.tipText}>Boleh buat banyak koleksi.</Text>
              </View>
            </View>
          </Animated.View>

          <View style={{ height: 18 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F7F7FB" },
  page: { flex: 1, backgroundColor: "#F7F7FB" },

  content: {
    paddingHorizontal: 20,
    paddingTop: -10,
    paddingBottom: 22,
    gap: 14, // bikin jarak antar section konsisten
  },

  // decorations
  blob1: {
    position: "absolute",
    top: -90,
    left: -80,
    width: 250,
    height: 250,
    borderRadius: 999,
    backgroundColor: "rgba(145,0,255,0.10)",
  },
  blob2: {
    position: "absolute",
    bottom: -110,
    right: -90,
    width: 280,
    height: 280,
    borderRadius: 999,
    backgroundColor: "rgba(255,196,107,0.10)",
  },
  sparkle: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 36,
    height: 36,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.80)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.95)",
  },

  // header
  header: {
    paddingTop: 4,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    gap: 8,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: ACCENT,
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
    backgroundColor: "rgba(255,255,255,0.90)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
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
    maxWidth: 520,
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
    gap: 14, // konsisten jarak dalam card
  },

  // info
  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "rgba(145,0,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(145,0,255,0.14)",
  },
  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.75)",
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

  // fields
  field: {
    gap: 8,
  },
  label: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13.5,
    color: "#111827",
  },

  // input shell (rapi + konsisten)
  inputShell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    paddingLeft: 14,
    paddingRight: 10,
    paddingVertical: Platform.OS === "android" ? 6 : 10,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
  },
  inputShellTop: {
    alignItems: "flex-start", // multiline biar icon naik
    paddingTop: 10,
  },
  inputFlex: {
    flex: 1,
    paddingTop: 2,
  },

  // preview
  preview: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: "rgba(17,24,39,0.03)",
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
  },
  previewHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  previewTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13,
    color: ACCENT,
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
    borderRadius: 18,
    overflow: "hidden",
  },
  primaryBtnDisabled: {
    opacity: 0.85,
  },
  primaryGrad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  primaryText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
    color: "#fff",
    marginRight: 10,
  },
  primaryIcon: {
    width: 34,
    height: 34,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  // tips
  tips: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: "rgba(255,196,107,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,196,107,0.22)",
    gap: 8,
  },
  tipsTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 13.5,
    color: "#111827",
    marginBottom: 2,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  tipCheck: {
    width: 26,
    height: 26,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tipText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12.8,
    color: "#374151",
  },
});
