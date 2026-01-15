import React, { useEffect, useMemo, useState } from "react";
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
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";

import { useAuth } from "../../../contexts/AuthContext";
import Input from "../../../components/ui/Input";

const { width } = Dimensions.get("window");
const ACCENT = "#9100FF";

const CreateCardScreen = () => {
  const { apiRequest, isAuthenticated } = useAuth();

  const [collections, setCollections] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasAddedCard, setHasAddedCard] = useState(false);

  const [error, setError] = useState<{
    koleksi: boolean;
    front: boolean;
    back: boolean;
  }>({
    koleksi: false,
    front: false,
    back: false,
  });

  const { collectionId, collectionName } = useLocalSearchParams<{
    collectionId?: string;
    collectionName?: string;
  }>();

  useEffect(() => {
    if (collectionId) setSelectedId(String(collectionId));
  }, [collectionId]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiRequest("/koleksi");
        setCollections(Array.isArray(data) ? data : []);
      } catch (e: any) {
        Alert.alert("Error", e?.message ?? "Gagal memuat koleksi");
      }
    };
    if (isAuthenticated) load();
  }, [isAuthenticated]);

  const canSubmit = useMemo(() => {
    return selectedId !== "" && front.trim() !== "" && back.trim() !== "" && !loading;
  }, [selectedId, front, back, loading]);

  const handleCreateCard = async () => {
    const errorStatus = {
      koleksi: selectedId === "",
      front: front.trim() === "",
      back: back.trim() === "",
    };

    setError(errorStatus);
    if (Object.values(errorStatus).some(Boolean)) return;

    setLoading(true);
    try {
      await apiRequest("/kartu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          koleksiId: selectedId,
          front: front.trim(),
          back: back.trim(),
        }),
      });

      Alert.alert("Sukses", "Kartu berhasil ditambahkan");
      setFront("");
      setBack("");
      setHasAddedCard(true);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Gagal menambah kartu");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    setFront("");
    setBack("");
    setSelectedId("");
    router.replace("/create/collection");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.page}>
        {/* Background */}
        <LinearGradient colors={["#F7F7FB", "#F7F7FB"]} style={StyleSheet.absoluteFill} />
        <View style={styles.blob1} />
        <View style={styles.blob2} />
        <Animated.View entering={FadeIn.delay(120)} style={styles.sparkle}>
          <Feather name="star" size={16} color="rgba(145,0,255,0.35)" />
        </Animated.View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animated.View entering={FadeInDown.delay(80).duration(600)} style={styles.header}>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <View style={styles.badgeDot} />
                <Text style={styles.badgeText}>Create Card</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.helpBtn}
                onPress={() =>
                  Alert.alert(
                    "Tips",
                    "Gunakan pertanyaan singkat di Front dan jawaban ringkas di Back agar mudah diingat."
                  )
                }
              >
                <Feather name="info" size={18} color="#111827" />
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>Buat Kartu Baru</Text>
            <Text style={styles.subtitle}>
              {collectionName
                ? `Tambah kartu ke koleksi: ${collectionName}`
                : "Pilih koleksi, isi Front & Back, lalu simpan."}
            </Text>
          </Animated.View>

          {/* Card */}
          <Animated.View entering={FadeInDown.delay(140).duration(600)} style={styles.card}>
            {/* Koleksi */}
            <View style={styles.field}>
              <Text style={styles.label}>Koleksi</Text>

              <View style={[styles.inputShell, styles.pickerShell]}>
                <Feather name="folder" size={18} color="#6B7280" />
                <View style={styles.pickerWrap}>
                  <Picker
                    selectedValue={selectedId}
                    onValueChange={(v) => {
                      setSelectedId(String(v));
                      if (String(v) !== "") setError((p) => ({ ...p, koleksi: false }));
                    }}
                    style={styles.picker}
                    dropdownIconColor="#6B7280"
                  >
                    <Picker.Item label="Pilih Koleksi" value="" />
                    {collections.map((c) => {
                      const label = c?.nama ?? c?.name ?? `Koleksi ${c?.id ?? ""}`;
                      return <Picker.Item key={c.id} label={String(label)} value={String(c.id)} />;
                    })}
                  </Picker>
                </View>
              </View>

              {error.koleksi && <Text style={styles.errorText}>Koleksi wajib dipilih</Text>}
            </View>

            {/* Front */}
            <View style={styles.field}>
              <Text style={styles.label}>Front (Pertanyaan)</Text>
              <View style={styles.inputShell}>
                <Feather name="edit-3" size={18} color="#6B7280" />
                <View style={styles.inputFlex}>
                  <Input
                    label=""
                    value={front}
                    onChangeText={(t) => {
                      setFront(t);
                      if (t.trim() !== "") setError((p) => ({ ...p, front: false }));
                    }}
                    error={error.front ? "Front tidak boleh kosong" : ""}
                    placeholder="Contoh: Apa itu photosynthesis?"
                  />
                </View>
              </View>
            </View>

            {/* Back */}
            <View style={styles.field}>
              <Text style={styles.label}>Back (Jawaban)</Text>
              <View style={[styles.inputShell, styles.inputShellTop]}>
                <Feather name="file-text" size={18} color="#6B7280" />
                <View style={styles.inputFlex}>
                  <Input
                    label=""
                    value={back}
                    onChangeText={(t) => {
                      setBack(t);
                      if (t.trim() !== "") setError((p) => ({ ...p, back: false }));
                    }}
                    error={error.back ? "Back tidak boleh kosong" : ""}
                    multiline
                    placeholder="Contoh: Proses tumbuhan membuat makanan memakai cahaya matahari."
                  />
                </View>
              </View>
            </View>

            {/* Buttons */}
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.primaryBtn, !canSubmit && styles.primaryBtnDisabled]}
              onPress={handleCreateCard}
              disabled={!canSubmit}
            >
              <LinearGradient
                colors={canSubmit ? [ACCENT, "#B44CFF"] : ["#CBD5E1", "#CBD5E1"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryGrad}
              >
                <Text style={styles.primaryText}>
                  {loading ? "Menyimpan..." : "Simpan Kartu"}
                </Text>
                <View style={styles.primaryIcon}>
                  <Feather name={loading ? "loader" : "arrow-right"} size={18} color="#fff" />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {hasAddedCard && (
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.secondaryBtn}
                onPress={handleFinish}
              >
                <Text style={styles.secondaryText}>Selesai</Text>
                <Feather name="check-circle" size={18} color={ACCENT} />
              </TouchableOpacity>
            )}
          </Animated.View>

          <View style={{ height: 18 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CreateCardScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F7F7FB" },
  page: { flex: 1, backgroundColor: "#F7F7FB" },

  content: {
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 22,
    gap: 14,
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
  header: { paddingTop: 4 },
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
  badgeDot: { width: 8, height: 8, borderRadius: 999, backgroundColor: ACCENT },
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
    maxWidth: 560,
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
    gap: 14,
  },

  // fields
  field: { gap: 8 },
  label: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13.5,
    color: "#111827",
  },
  errorText: {
    marginTop: 6,
    fontFamily: "Poppins_400Regular",
    fontSize: 12.5,
    color: "#EF4444",
  },

  // input shell
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
    alignItems: "flex-start",
    paddingTop: 12,
  },
  inputFlex: { flex: 1, paddingTop: 2 },

  // picker
  pickerShell: { paddingVertical: Platform.OS === "android" ? 0 : 4 },
  pickerWrap: { flex: 1, overflow: "hidden", borderRadius: 14 },
  picker: {
    width: "100%",
    height: Platform.OS === "android" ? 48 : 44,
    color: "#111827",
  },

  // primary button
  primaryBtn: { borderRadius: 18, overflow: "hidden" },
  primaryBtnDisabled: { opacity: 0.85 },
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

  // secondary button
  secondaryBtn: {
    marginTop: 2,
    height: 50,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "rgba(145,0,255,0.35)",
    backgroundColor: "rgba(145,0,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  secondaryText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14.5,
    color: ACCENT,
  },
});
