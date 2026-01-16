import React, { useState, useCallback, useMemo } from "react";
import { useFocusEffect } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import FlipCard, { FlipCardProps } from "../../components/FlipCard";
import CustomModal from "../../components/ui/CustomModal";
import { useAuth } from "../../contexts/AuthContext";
import { ReviewMode } from "../../types/card";

const { width } = Dimensions.get("window");
const ACCENT = "#9100FF";

const ReviewScreen = () => {
  const { apiRequest } = useAuth();

  const [collections, setCollections] = useState<any[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<any | null>(null);

  // All cards from API
  const [allCards, setAllCards] = useState<any[]>([]);
  // Filtered cards for review
  const [cards, setCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Review mode selection
  const [reviewMode, setReviewMode] = useState<ReviewMode>("ALL");
  const [showModeSelector, setShowModeSelector] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  const showModal = (title: string, message: string, type: any = "info") => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  useFocusEffect(
    useCallback(() => {
      loadCollections();
    }, [])
  );

  const loadCollections = async () => {
    try {
      setIsLoading(true);
      const data = await apiRequest("/koleksi");
      setCollections(
        (data || []).map((item: any) => ({
          id: item.id,
          nama: item.name ?? item.nama ?? "Koleksi",
          kartuCount: item.cardCount || 0,
        }))
      );
    } catch {
      showModal("Error", "Gagal memuat koleksi", "error");
    } finally {
      setIsLoading(false);
    }
  };
  const deleteCollection = async (id: string) => {
  // Gunakan Alert bawaan untuk konfirmasi
  Alert.alert(
    "Hapus Koleksi",
    "Apakah Anda yakin ingin menghapus koleksi ini? Semua kartu di dalamnya juga akan terhapus.",
    [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            setIsLoading(true);
            await apiRequest(`/koleksi/${id}`, {
              method: "DELETE",
            });
            showModal("Sukses", "Koleksi berhasil dihapus", "success");
            loadCollections(); // Refresh list setelah hapus
          } catch (error: any) {
            showModal("Gagal", error?.message || "Gagal menghapus koleksi", "error");
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]
  );
};

  const selectCollection = async (collection: any) => {
    try {
      setIsLoading(true);
      const data = await apiRequest(`/koleksi/${collection.id}/kartu`);
      setSelectedCollection(collection);
      setAllCards(Array.isArray(data) ? data : []);
      setCurrentIndex(0);
      setIsFlipped(false);
      setReviewMode("ALL");
      setShowModeSelector(true);
    } catch {
      showModal("Error", "Gagal memuat kartu", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter cards based on review mode
  const filterCardsByMode = useCallback((mode: ReviewMode) => {
    setReviewMode(mode);
    
    if (mode === "ALL") {
      setCards(allCards);
    } else {
      const filtered = allCards.filter((card: any) => card.type === mode);
      setCards(filtered);
    }
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [allCards]);

  const goBackToList = () => {
    setSelectedCollection(null);
    setAllCards([]);
    setCards([]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowModeSelector(false);
  };

  const handleAnswer = async (quality: "hard" | "good" | "easy") => {
    if (isUpdating || cards.length === 0) return;

    const currentCard = cards[currentIndex];
    const daysToAdd = quality === "hard" ? 1 : quality === "good" ? 3 : 7;

    const newReviewDueAt = new Date();
    newReviewDueAt.setDate(newReviewDueAt.getDate() + daysToAdd);

    try {
      setIsUpdating(true);
      await apiRequest(`/kartu/${currentCard.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          newDifficulty: 1,
          newReviewDueAt: newReviewDueAt.toISOString(),
        }),
      });

      if (currentIndex < cards.length - 1) {
        setCurrentIndex((v) => v + 1);
        setIsFlipped(false);
      } else {
        showModal("Selesai!", "Semua kartu telah direview.", "success");
        goBackToList();
      }
    } catch {
      showModal("Gagal", "Gagal menyimpan progres", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const currentCard = cards[currentIndex];
  const progress = useMemo(() => {
    if (!cards.length) return 0;
    return ((currentIndex + 1) / cards.length) * 100;
  }, [cards.length, currentIndex]);

  // Card count by type
  const textCardsCount = useMemo(() => {
    return allCards.filter((c: any) => c.type === "TEXT" || !c.type).length;
  }, [allCards]);

  const imageCardsCount = useMemo(() => {
    return allCards.filter((c: any) => c.type === "IMAGE").length;
  }, [allCards]);

  // Prepare FlipCard props
  const flipCardProps: FlipCardProps = {
    type: currentCard?.type === "IMAGE" ? "IMAGE" : "TEXT",
    frontText: currentCard?.frontText || currentCard?.front || "",
    backText: currentCard?.backText || currentCard?.back || "",
    frontImageUrl: currentCard?.frontImageUrl || null,
    backImageUrl: currentCard?.backImageUrl || null,
    isFlipped: isFlipped,
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={ACCENT} />
        <Text style={styles.loadingText}>Memuat...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.page}>
        <LinearGradient
          colors={["#F7F7FB", "#F7F7FB"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.blob1} />
        <View style={styles.blob2} />

        {/* Header */}
        <View style={styles.headerArea}>
          {selectedCollection ? (
            <View style={styles.reviewHeader}>
              <TouchableOpacity
                onPress={goBackToList}
                style={styles.backBtn}
                activeOpacity={0.85}
              >
                <Ionicons name="arrow-back" size={20} color={ACCENT} />
              </TouchableOpacity>

              <View style={styles.titleWrapper}>
                <Text style={styles.reviewTitle} numberOfLines={1}>
                  {selectedCollection.nama}
                </Text>
                <Text style={styles.reviewSubtitle}>
                  {currentIndex + 1} dari {cards.length} kartu
                </Text>
              </View>

              <TouchableOpacity
                onPress={loadCollections}
                style={styles.iconBtn}
                activeOpacity={0.85}
              >
                <Ionicons name="refresh" size={18} color="#111827" />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.mainTitle}>Review Kartu</Text>
              <Text style={styles.mainSubtitle}>
                Pilih koleksi, lalu review kartu untuk menghafal .
              </Text>
            </>
          )}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {!selectedCollection ? (
            // LIST KOLEKSI
            collections.length === 0 ? (
              <View style={styles.emptyBox}>
                <View style={styles.emptyIcon}>
                  <Ionicons
                    name="documents-outline"
                    size={34}
                    color={ACCENT}
                    style={{ opacity: 0.85 }}
                  />
                </View>
                <Text style={styles.emptyTitle}>Belum ada koleksi</Text>
                <Text style={styles.emptyText}>
                  Buat koleksi dulu, nanti kamu bisa mulai review di sini.
                </Text>

                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={loadCollections}
                  style={styles.emptyBtn}
                >
                  <LinearGradient
                    colors={[ACCENT, "#B44CFF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.emptyBtnGrad}
                  >
                    <Ionicons name="refresh" size={18} color="#fff" />
                    <Text style={styles.emptyBtnText}>Coba Lagi</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ gap: 12 }}>
                {collections.map((item) => (
  <TouchableOpacity
    key={item.id}
    style={styles.collectionCard}
    onPress={() => selectCollection(item)}
    activeOpacity={0.88}
  >
    <View style={styles.cardIcon}>
      <Ionicons name="folder-open" size={22} color={ACCENT} />
    </View>

    <View style={{ flex: 1 }}>
      <Text style={styles.collectionName} numberOfLines={1}>
        {item.nama}
      </Text>
      <Text style={styles.collectionCount}>
        {item.kartuCount} kartu
      </Text>
    </View>
    <TouchableOpacity
      style={styles.deleteInsideBtn}
      onPress={() => deleteCollection(item.id)}
    >
      <Ionicons name="trash-outline" size={18} color="#EF4444" />
    </TouchableOpacity>
  </TouchableOpacity>
))}
              </View>
            )
          ) : (
            // REVIEW SESSION
            <View style={styles.sessionWrapper}>
              {/* Mode Selector */}
              {showModeSelector && (
                <View style={styles.modeSelector}>
                  <Text style={styles.modeLabel}>Mode Review:</Text>
                  <View style={styles.modeButtons}>
                    <TouchableOpacity
                      style={[
                        styles.modeBtn,
                        reviewMode === "ALL" && styles.modeBtnActive,
                      ]}
                      onPress={() => filterCardsByMode("ALL")}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={[
                          styles.modeBtnText,
                          reviewMode === "ALL" && styles.modeBtnTextActive,
                        ]}
                      >
                        Semua
                      </Text>
                      <Text style={styles.modeCount}>
                        {allCards.length}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.modeBtn,
                        reviewMode === "TEXT" && styles.modeBtnActive,
                      ]}
                      onPress={() => filterCardsByMode("TEXT")}
                      activeOpacity={0.85}
                    >
                      <Ionicons
                        name="document-text"
                        size={16}
                        color={reviewMode === "TEXT" ? "#fff" : ACCENT}
                      />
                      <Text
                        style={[
                          styles.modeBtnText,
                          reviewMode === "TEXT" && styles.modeBtnTextActive,
                        ]}
                      >
                        Teks
                      </Text>
                      <Text style={styles.modeCount}>{textCardsCount}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.modeBtn,
                        reviewMode === "IMAGE" && styles.modeBtnActive,
                      ]}
                      onPress={() => filterCardsByMode("IMAGE")}
                      activeOpacity={0.85}
                    >
                      <Ionicons
                        name="image"
                        size={16}
                        color={reviewMode === "IMAGE" ? "#fff" : ACCENT}
                      />
                      <Text
                        style={[
                          styles.modeBtnText,
                          reviewMode === "IMAGE" && styles.modeBtnTextActive,
                        ]}
                      >
                        Gambar
                      </Text>
                      <Text style={styles.modeCount}>{imageCardsCount}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Empty State for filtered cards */}
              {cards.length === 0 && allCards.length > 0 && (
                <View style={styles.emptyFiltered}>
                  <Ionicons name="images-outline" size={40} color="#9CA3AF" />
                  <Text style={styles.emptyFilteredTitle}>
                    Tidak ada kartu {reviewMode === "TEXT" ? "Teks" : reviewMode === "IMAGE" ? "Gambar" : ""}
                  </Text>
                  <Text style={styles.emptyFilteredText}>
                    Coba pilih mode yang berbeda atau kembali ke "Semua"
                  </Text>
                  <TouchableOpacity
                    style={styles.changeModeBtn}
                    onPress={() => filterCardsByMode("ALL")}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.changeModeBtnText}>Lihat Semua Kartu</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Cards available */}
              {cards.length > 0 && (
                <>
                  {/* Progress */}
                  <View style={styles.progressContainer}>
                    <View style={styles.progressTopRow}>
                      <Text style={styles.progressLabel}>Progress</Text>
                      <Text style={styles.progressValue}>
                        {Math.round(progress)}%
                      </Text>
                    </View>

                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressFill, { width: `${progress}%` }]} />
                    </View>
                  </View>

                  {/* Card */}
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setIsFlipped((v) => !v)}
                    style={styles.cardWrapper}
                  >
                    <FlipCard {...flipCardProps} />
                  </TouchableOpacity>

                  {/* Actions */}
                  {isFlipped ? (
                    <View style={styles.actionGrid}>
                      <TouchableOpacity
                        disabled={isUpdating}
                        style={[styles.actionBtn, styles.btnHard]}
                        onPress={() => handleAnswer("hard")}
                        activeOpacity={0.9}
                      >
                        <Text style={styles.actionSmall}>+1 hari</Text>
                        <Text style={styles.actionText}>Sulit</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        disabled={isUpdating}
                        style={[styles.actionBtn, styles.btnGood]}
                        onPress={() => handleAnswer("good")}
                        activeOpacity={0.9}
                      >
                        <Text style={styles.actionSmall}>+3 hari</Text>
                        <Text style={styles.actionText}>Bisa</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        disabled={isUpdating}
                        style={[styles.actionBtn, styles.btnEasy]}
                        onPress={() => handleAnswer("easy")}
                        activeOpacity={0.9}
                      >
                        <Text style={styles.actionSmall}>+7 hari</Text>
                        <Text style={styles.actionText}>Mudah</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.hintBox}>
                      <Ionicons
                        name="information-circle-outline"
                        size={18}
                        color={ACCENT}
                      />
                      <Text style={styles.hintText}>
                        Ketuk kartu untuk mengungkap jawaban
                      </Text>
                    </View>
                  )}

                  {isUpdating && (
                    <View style={styles.updatingRow}>
                      <ActivityIndicator size="small" color={ACCENT} />
                      <Text style={styles.updatingText}>Menyimpan progres...</Text>
                    </View>
                  )}
                </>
              )}
            </View>
          )}
        </ScrollView>

        <CustomModal
          visible={modalVisible}
          title={modalTitle}
          message={modalMessage}
          type={modalType}
          onClose={() => setModalVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
};

export default ReviewScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F7F7FB" },
  page: { flex: 1, backgroundColor: "#F7F7FB" },

  blob1: {
    position: "absolute",
    top: -90,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: "rgba(145,0,255,0.10)",
  },
  blob2: {
    position: "absolute",
    bottom: -110,
    right: -90,
    width: 300,
    height: 300,
    borderRadius: 999,
    backgroundColor: "rgba(255,196,107,0.10)",
  },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
    color: "#6B7280",
  },

  headerArea: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 6 : 0,
    paddingBottom: 12,
    gap: 6,
  },
  mainTitle: {
    fontSize: 26,
    fontFamily: "Poppins_700Bold",
    color: "#111827",
  },
  mainSubtitle: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    color: "#6B7280",
    lineHeight: 18,
  },

  reviewHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.92)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.92)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
  },
  titleWrapper: { flex: 1 },
  reviewTitle: {
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
    color: "#111827",
  },
  reviewSubtitle: {
    marginTop: 1,
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: ACCENT,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 18,
  },

  // Koleksi card
  collectionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
    gap: 12,
  },
  cardIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "rgba(145,0,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(145,0,255,0.14)",
    justifyContent: "center",
    alignItems: "center",
  },
  collectionName: {
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
    color: "#111827",
  },
  collectionCount: {
    marginTop: 2,
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "#6B7280",
  },
  chev: {
    width: 34,
    height: 34,
    borderRadius: 14,
    backgroundColor: "rgba(17,24,39,0.03)",
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Empty
  emptyBox: {
    marginTop: 70,
    alignItems: "center",
    paddingHorizontal: 22,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(145,0,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(145,0,255,0.14)",
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
    color: "#111827",
  },
  emptyText: {
    marginTop: 6,
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 18,
  },
  emptyBtn: { marginTop: 14, borderRadius: 16, overflow: "hidden" },
  emptyBtnGrad: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  emptyBtnText: {
    fontSize: 13.5,
    fontFamily: "Poppins_600SemiBold",
    color: "#fff",
  },

  // Session
  sessionWrapper: { paddingTop: 6, alignItems: "center" },

  // Mode Selector
  modeSelector: {
    width: "100%",
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  modeLabel: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13,
    color: "#111827",
    marginBottom: 10,
  },
  modeButtons: {
    flexDirection: "row",
    gap: 10,
  },
  modeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "rgba(145,0,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(145,0,255,0.14)",
  },
  modeBtnActive: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },
  modeBtnText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    color: ACCENT,
  },
  modeBtnTextActive: {
    color: "#fff",
  },
  modeCount: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 11,
    color: "rgba(145,0,255,0.6)",
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  // Empty Filtered
  emptyFiltered: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyFilteredTitle: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
    color: "#111827",
  },
  emptyFilteredText: {
    marginTop: 6,
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 18,
  },
  changeModeBtn: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: ACCENT,
  },
  changeModeBtnText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: "#fff",
  },

  progressContainer: { width: "100%", marginBottom: 14 },
  progressTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12.5,
    color: "#111827",
  },
  progressValue: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12.5,
    color: ACCENT,
  },
  progressBarBg: {
    width: "100%",
    height: 10,
    backgroundColor: "rgba(145,0,255,0.10)",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: ACCENT,
    borderRadius: 999,
  },

  cardWrapper: {
    width: "100%",
    height: width * 0.72,
    marginTop: 8,
    marginBottom: 14,
  },

  hintBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(145,0,255,0.06)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(145,0,255,0.12)",
  },
  hintText: {
    fontSize: 12.8,
    fontFamily: "Poppins_500Medium",
    color: ACCENT,
  },

  // Action Buttons (SRS)
  actionGrid: { flexDirection: "row", gap: 10, width: "100%" },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
  },
  actionSmall: {
    fontSize: 11,
    fontFamily: "Poppins_500Medium",
    color: "rgba(255,255,255,0.85)",
    marginBottom: 2,
  },
  actionText: {
    color: "#FFF",
    fontFamily: "Poppins_700Bold",
    fontSize: 14,
  },

  btnHard: {
    backgroundColor: "#FF4D6D",
    borderColor: "rgba(255,77,109,0.35)",
  },
  btnGood: {
    backgroundColor: "#7C3AED",
    borderColor: "rgba(124,58,237,0.35)",
  },
  btnEasy: {
    backgroundColor: ACCENT,
    borderColor: "rgba(145,0,255,0.35)",
  },

  updatingRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  updatingText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12.5,
    color: "#6B7280",
  },
  deleteInsideBtn: {
  width: 36,
  height: 36,
  borderRadius: 12,
  backgroundColor: "rgba(239, 68, 68, 0.05)", // Merah sangat transparan
  justifyContent: "center",
  alignItems: "center",
  marginLeft: 4,
},
});

