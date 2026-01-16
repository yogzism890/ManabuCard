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
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";

import { useAuth } from "../../../contexts/AuthContext";
import Input from "../../../components/ui/Input";
import { uploadImage, validateImageCard, validateTextCard } from "../../../utils/uploadUtils";
import { CardType } from "../../../types/card";

const { width } = Dimensions.get("window");
const ACCENT = "#9100FF";

type ModeType = "TEXT" | "IMAGE";

const CreateCardScreen = () => {
  const { apiRequest, isAuthenticated } = useAuth();

  const [collections, setCollections] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState("");
  
  // Card type selection
  const [cardType, setCardType] = useState<ModeType>("TEXT");
  
  // Text fields
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  
  // Image fields
  const [frontImageUri, setFrontImageUri] = useState<string | null>(null);
  const [backImageUri, setBackImageUri] = useState<string | null>(null);
  const [frontImageUrl, setFrontImageUrl] = useState<string | null>(null);
  const [backImageUrl, setBackImageUrl] = useState<string | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [hasAddedCard, setHasAddedCard] = useState(false);

  // Errors
  const [error, setError] = useState<{
    koleksi: boolean;
    front: boolean;
    back: boolean;
    image: string | null;
  }>({
    koleksi: false,
    front: false,
    back: false,
    image: null,
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

  // Pick image from gallery
  const pickImage = async (side: "front" | "back") => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert("Izin Diperlukan", "Aplikasi memerlukan akses galeri untuk memilih gambar.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        if (side === "front") {
          setFrontImageUri(uri);
          setFrontImageUrl(null);
          setError((prev) => ({ ...prev, image: null }));
        } else {
          setBackImageUri(uri);
          setBackImageUrl(null);
        }
      }
    } catch (e) {
      Alert.alert("Error", "Gagal memilih gambar");
    }
  };

  // Remove selected image
  const removeImage = (side: "front" | "back") => {
    if (side === "front") {
      setFrontImageUri(null);
      setFrontImageUrl(null);
    } else {
      setBackImageUri(null);
      setBackImageUrl(null);
    }
  };

  const canSubmit = useMemo(() => {
    if (loading || uploading) return false;
    if (selectedId === "") return false;
    
    if (cardType === "TEXT") {
      return front.trim() !== "" && back.trim() !== "";
    } else {
      return frontImageUri !== null;
    }
  }, [selectedId, front, back, frontImageUri, loading, uploading, cardType]);

  const handleCreateCard = async () => {
    // Validate
    const errorStatus = {
      koleksi: selectedId === "",
      front: false,
      back: false,
      image: null as string | null,
    };

    if (cardType === "TEXT") {
      const textValidation = validateTextCard(front, back);
      if (!textValidation.valid) {
        Alert.alert("Validasi", textValidation.error || "Field tidak boleh kosong");
        return;
      }
    } else {
      const imageValidation = validateImageCard(frontImageUri, backImageUri);
      if (!imageValidation.valid) {
        Alert.alert("Validasi", imageValidation.error || "Gambar wajib dipilih");
        return;
      }
    }

    setLoading(true);

    try {
      let finalFrontImageUrl = frontImageUrl;
      let finalBackImageUrl = backImageUrl;

      // Upload images if selected
      if (frontImageUri && !frontImageUrl) {
        setUploading(true);
        finalFrontImageUrl = await uploadImage(apiRequest, frontImageUri);
        if (!finalFrontImageUrl) {
          setLoading(false);
          setUploading(false);
          return;
        }
        setFrontImageUrl(finalFrontImageUrl);
      }

      if (backImageUri && !backImageUrl) {
        setUploading(true);
        finalBackImageUrl = await uploadImage(apiRequest, backImageUri);
        if (!finalBackImageUrl) {
          setLoading(false);
          setUploading(false);
          return;
        }
        setBackImageUrl(finalBackImageUrl);
      }

      setUploading(false);

      // Create card payload
      const payload: any = {
        koleksiId: selectedId,
        type: cardType,
      };

      if (cardType === "TEXT") {
        payload.frontText = front.trim();
        payload.backText = back.trim();
      } else {
        payload.frontImageUrl = finalFrontImageUrl;
        if (backImageUri || backImageUrl) {
          payload.backImageUrl = finalBackImageUrl;
        }
      }

      await apiRequest("/kartu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      Alert.alert("Sukses", "Kartu berhasil ditambahkan");

      // Reset form
      setFront("");
      setBack("");
      setFrontImageUri(null);
      setBackImageUri(null);
      setFrontImageUrl(null);
      setBackImageUrl(null);
      setHasAddedCard(true);
      
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Gagal menambah kartu");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handleFinish = () => {
    setFront("");
    setBack("");
    setFrontImageUri(null);
    setBackImageUri(null);
    setSelectedId("");
    router.replace("/create/collection");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.page}>
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
                    cardType === "TEXT"
                      ? "Gunakan pertanyaan singkat di Front dan jawaban ringkas di Back."
                      : "Pilih gambar yang jelas dan mudah dipahami untuk membantu menghafal."
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
                : cardType === "IMAGE"
                  ? "Buat kartu dengan gambar untuk visual yang lebih kuat"
                  : "Pilih koleksi, isi Front & Back, lalu simpan."}
            </Text>
          </Animated.View>

          {/* Card */}
          <Animated.View entering={FadeInDown.delay(140).duration(600)} style={styles.card}>
            {/* Card Type Selector */}
            <View style={styles.field}>
              <Text style={styles.label}>Tipe Kartu</Text>
              <View style={styles.typeSelector}>
                <TouchableOpacity
                  style={[
                    styles.typeBtn,
                    cardType === "TEXT" && styles.typeBtnActive,
                  ]}
                  onPress={() => setCardType("TEXT")}
                  activeOpacity={0.85}
                >
                  <Feather
                    name="file-text"
                    size={18}
                    color={cardType === "TEXT" ? "#fff" : ACCENT}
                  />
                  <Text
                    style={[
                      styles.typeBtnText,
                      cardType === "TEXT" && styles.typeBtnTextActive,
                    ]}
                  >
                    Teks
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeBtn,
                    cardType === "IMAGE" && styles.typeBtnActive,
                  ]}
                  onPress={() => setCardType("IMAGE")}
                  activeOpacity={0.85}
                >
                  <Feather
                    name="image"
                    size={18}
                    color={cardType === "IMAGE" ? "#fff" : ACCENT}
                  />
                  <Text
                    style={[
                      styles.typeBtnText,
                      cardType === "IMAGE" && styles.typeBtnTextActive,
                    ]}
                  >
                    Gambar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

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
            </View>

            {cardType === "TEXT" ? (
              <>
                {/* Front - Text */}
                <View style={styles.field}>
                  <Text style={styles.label}>Front (Pertanyaan)</Text>
                  <View style={styles.inputShell}>
                    <Feather name="edit-3" size={18} color="#6B7280" />
                    <View style={styles.inputFlex}>
                      <Input
                        label=""
                        value={front}
                        onChangeText={setFront}
                        placeholder="Contoh: Eye"
                      />
                    </View>
                  </View>
                </View>

                {/* Back - Text */}
                <View style={styles.field}>
                  <Text style={styles.label}>Back (Jawaban)</Text>
                  <View style={[styles.inputShell, styles.inputShellTop]}>
                    <Feather name="file-text" size={18} color="#6B7280" />
                    <View style={styles.inputFlex}>
                      <Input
                        label=""
                        value={back}
                        onChangeText={setBack}
                        multiline
                        placeholder="Contoh: Proses tumbuhan membuat makanan..."
                      />
                    </View>
                  </View>
                </View>
              </>
            ) : (
              <>
                {/* Front - Image */}
                <View style={styles.field}>
                  <Text style={styles.label}>Gambar Depan (Wajib)</Text>
                  {frontImageUri ? (
                    <View style={styles.imagePreviewContainer}>
                      <Image source={{ uri: frontImageUri }} style={styles.imagePreview} />
                      <TouchableOpacity
                        style={styles.removeImageBtn}
                        onPress={() => removeImage("front")}
                        activeOpacity={0.8}
                      >
                        <Feather name="x" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.imagePickerBtn}
                      onPress={() => pickImage("front")}
                      activeOpacity={0.85}
                    >
                      <Feather name="image" size={28} color={ACCENT} />
                      <Text style={styles.imagePickerText}>Pilih Gambar Depan</Text>
                      <Text style={styles.imagePickerSubText}>Wajib diisi</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Back - Image (Optional) */}
                <View style={styles.field}>
                  <Text style={styles.label}>Gambar Belakang (Opsional)</Text>
                  {backImageUri ? (
                    <View style={styles.imagePreviewContainer}>
                      <Image source={{ uri: backImageUri }} style={styles.imagePreview} />
                      <TouchableOpacity
                        style={styles.removeImageBtn}
                        onPress={() => removeImage("back")}
                        activeOpacity={0.8}
                      >
                        <Feather name="x" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.imagePickerBtnSecondary}
                      onPress={() => pickImage("back")}
                      activeOpacity={0.85}
                    >
                      <Feather name="image" size={24} color="#6B7280" />
                      <Text style={styles.imagePickerTextSecondary}>Tambah Gambar Belakang</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              activeOpacity={0.9}
              style={[
                styles.primaryBtn,
                (!canSubmit || uploading) && styles.primaryBtnDisabled,
              ]}
              onPress={handleCreateCard}
              disabled={!canSubmit || uploading}
            >
              <LinearGradient
                colors={canSubmit ? [ACCENT, "#B44CFF"] : ["#CBD5E1", "#CBD5E1"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryGrad}
              >
                <Text style={styles.primaryText}>
                  {loading || uploading ? (uploading ? "Mengupload..." : "Menyimpan...") : "Simpan Kartu"}
                </Text>
                <View style={styles.primaryIcon}>
                  <Feather
                    name={loading || uploading ? "loader" : "arrow-right"}
                    size={18}
                    color="#fff"
                  />
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
  field: { gap: 8 },
  label: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13.5,
    color: "#111827",
  },
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
  pickerShell: { paddingVertical: Platform.OS === "android" ? 0 : 4 },
  pickerWrap: { flex: 1, overflow: "hidden", borderRadius: 14 },
  picker: {
    width: "100%",
    height: Platform.OS === "android" ? 48 : 44,
    color: "#111827",
  },
  
  // Type selector
  typeSelector: {
    flexDirection: "row",
    gap: 12,
  },
  typeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "rgba(145,0,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(145,0,255,0.14)",
  },
  typeBtnActive: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },
  typeBtnText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13.5,
    color: ACCENT,
  },
  typeBtnTextActive: {
    color: "#fff",
  },

  // Image picker
  imagePickerBtn: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 28,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "rgba(145,0,255,0.08)",
    borderWidth: 2,
    borderColor: "rgba(145,0,255,0.2)",
    borderStyle: "dashed",
  },
  imagePickerText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: ACCENT,
  },
  imagePickerSubText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: "#6B7280",
  },
  imagePickerBtnSecondary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.1)",
  },
  imagePickerTextSecondary: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: "#374151",
  },
  imagePreviewContainer: {
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
  },
  imagePreview: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
  },
  removeImageBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(239,68,68,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Buttons
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

