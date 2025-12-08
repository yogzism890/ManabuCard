import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
// Perbaikan 1: Impor 'useRouter' untuk navigasi kembali ke home
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';

// ASUMSI: Import komponen FlipCard Anda
import FlipCard from '../../components/FlipCard';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';

// --- KONSTANTA API ---
// GANTI DENGAN IP DAN TOKEN ASLI ANDA 
const MOCK_AUTH_TOKEN = 'YOUR_AUTH_TOKEN_HERE'; 
// ----------------------

// --- Tipe Data ---

interface Kartu {
  id: string;
  front: string;
  back: string;
  difficulty: number; // Nilai SRS saat ini
}

// --- MOCK DATA ---
const MOCK_STUDY_CARDS: Kartu[] = [
  { id: 'c1', front: 'Diligent', back: 'Rajin, tekun', difficulty: 1 },
  { id: 'c2', front: 'To acquire', back: 'Memperoleh, mendapatkan', difficulty: 2 },
  { id: 'c3', front: 'Crucial', back: 'Sangat penting, menentukan', difficulty: 1 },
  { id: 'c4', front: 'Substantial', back: 'Banyak, besar, penting', difficulty: 3 },
  { id: 'c5', front: 'Exhausted', back: 'Sangat lelah', difficulty: 0 },
];

/** Fungsi fetching kartu berdasarkan studyMode dari API */
const fetchStudyCards = async (apiRequest: any, koleksiId: string, studyMode: 'due' | 'new' | 'all' = 'due'): Promise<Kartu[]> => {
  console.log(`Fetching cards for Collection ID: ${koleksiId} with mode: ${studyMode}`);
  const cards = await apiRequest(`/koleksi/${koleksiId}/kartu?mode=${studyMode}`);

  let filteredCards: any[];

  if (studyMode === 'due') {
    // Filter kartu yang jatuh tempo (reviewDueAt <= sekarang)
    const now = new Date();
    filteredCards = cards.filter((card: any) => new Date(card.reviewDueAt) <= now);
  } else if (studyMode === 'new') {
    // Hanya kartu dengan difficulty = 0
    filteredCards = cards.filter((card: any) => card.difficulty === 0);
  } else if (studyMode === 'all') {
    // Semua kartu dalam koleksi, mengabaikan reviewDueAt
    filteredCards = cards;
  } else {
    // Default ke 'due'
    const now = new Date();
    filteredCards = cards.filter((card: any) => new Date(card.reviewDueAt) <= now);
  }

  return filteredCards.map((card: any) => ({
    id: card.id,
    front: card.front,
    back: card.back,
    difficulty: card.difficulty,
  }));
};

/** Memperbarui status SRS (difficulty dan reviewDueAt) di database */
async function updateKartuSRSData(apiRequest: any, cardId: string, newDifficulty: number, newReviewDueAt: Date): Promise<void> {
  // ... (Fungsi ini tidak diubah dan sudah benar)
  await apiRequest(`/kartu/${cardId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      newDifficulty: newDifficulty,
      newReviewDueAt: newReviewDueAt.toISOString()
    }),
  });
}


const StudySessionScreen = () => {
    // Perbaikan 2: Inisialisasi useRouter
    const router = useRouter();
    const { id: koleksiId } = useLocalSearchParams();
    const { apiRequest } = useAuth();
    const [cards, setCards] = useState<Kartu[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showWelcome, setShowWelcome] = useState(true);

    const idString = Array.isArray(koleksiId) ? koleksiId[0] : koleksiId;
    const currentCard = cards[currentCardIndex];
    const totalCards = cards.length;

    // --- Logika SRS (Hanya didefinisikan sekali di dalam komponen) ---
    const calculateNextReviewDate = useCallback((currentDiff: number, grade: 'hard' | 'good' | 'easy'): { diff: number, nextDate: Date } => {
        let nextDifficulty = currentDiff;
        let daysToAdd = 1;

        if (grade === 'easy') {
            // Naikkan difficulty (ease factor) untuk 'easy', max 5
            nextDifficulty = Math.min(5, currentDiff + 1);
            // Hitung daysToAdd dengan faktor pengulangan eksponensial
            daysToAdd = Math.max(7, nextDifficulty * 4);
            if (nextDifficulty > 2) {
                daysToAdd *= nextDifficulty; // Pengulangan eksponensial
            }
        } else if (grade === 'good') {
            // Difficulty tetap untuk 'good'
            daysToAdd = Math.max(3, currentDiff * 2);
            if (currentDiff > 2) {
                daysToAdd *= currentDiff; // Pengulangan eksponensial
            }
        } else if (grade === 'hard') {
            // Turunkan difficulty (ease factor) untuk 'hard', min 0
            nextDifficulty = Math.max(0, currentDiff - 1);
            daysToAdd = 1; // Review cepat untuk 'hard'
        }

        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + daysToAdd);

        return { diff: nextDifficulty, nextDate: nextDate };
    }, []);

    // Perbaikan 3: Hapus definisi handleAnswer yang redundant (di akhir kode asli)
    const handleAnswer = useCallback(async (grade: 'hard' | 'good' | 'easy') => {
        if (!currentCard) return;

        // 1. Hitung data SRS baru
        const { diff: newDifficulty, nextDate: newReviewDueAt } =
            calculateNextReviewDate(currentCard.difficulty, grade);

        try {
            // 2. Panggil API untuk memperbarui status kartu
            await updateKartuSRSData(apiRequest, currentCard.id, newDifficulty, newReviewDueAt);

            // 3. Pindah ke kartu berikutnya (Hanya jika update sukses)
            if (currentCardIndex < totalCards - 1) {
                setCurrentCardIndex(prev => prev + 1);
                setIsFlipped(false);
            } else {
                // Sesi selesai
                Alert.alert("Sesi Selesai!", "Semua kartu yang jatuh tempo telah di-review.", [
                    { text: "Kembali ke Home", onPress: () => router.push('/') }
                ]);
            }
        } catch (error) {
            Alert.alert("Error", "Gagal menyimpan hasil review. Cek koneksi atau server log.");
        }

    }, [currentCard, currentCardIndex, totalCards, calculateNextReviewDate, router, apiRequest]);


    // Memuat Kartu
    useEffect(() => {
        if (!idString) return;
        const loadCards = async (studyMode: 'due' | 'new' | 'all' = 'due') => {
            try {
                const fetchedCards = await fetchStudyCards(idString, studyMode);
                setCards(fetchedCards);
            } catch (error) {
                console.error("Error loading study session:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadCards(); // Default menggunakan 'due'
    }, [idString]);


    // --- Tampilan Welcome ---
    if (showWelcome) {
        return (
            <View style={styles.welcomeContainer}>
                <Stack.Screen options={{
                    title: 'Mulai Belajar',
                    headerStyle: { backgroundColor: '#3498db' },
                    headerTintColor: '#fff',
                    headerTitleStyle: { fontWeight: 'bold', fontSize: 18 }
                }} />

                <View style={styles.welcomeContent}>
                    <Text style={styles.welcomeIcon}>🎯</Text>
                    <Text style={styles.welcomeTitle}>Siap Belajar?</Text>
                    <Text style={styles.welcomeSubtitle}>
                        Koleksi ini memiliki {totalCards} kartu yang siap di-review
                    </Text>

                    <View style={styles.welcomeStats}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{totalCards}</Text>
                            <Text style={styles.statLabel}>Kartu</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>⏱️</Text>
                            <Text style={styles.statLabel}>SRS</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>📈</Text>
                            <Text style={styles.statLabel}>Progress</Text>
                        </View>
                    </View>

                    <Text style={styles.welcomeDescription}>
                        Sistem ulangan berbasis interval akan membantu Anda mengingat materi lebih lama.
                        Jawab dengan jujur untuk hasil terbaik!
                    </Text>

                    <View style={styles.welcomeActions}>
                        <Button
                            title="Mulai Belajar"
                            onPress={() => setShowWelcome(false)}
                            style={styles.startButton}
                        />
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.backButton}
                        >
                            <Text style={styles.backButtonText}>Kembali</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    // --- Tampilan Loading ---
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3498db" />
                <Text style={styles.loadingText}>Memuat kartu sesi belajar...</Text>
            </View>
        );
    }

    // --- Tampilan Kosong ---
    if (totalCards === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📚</Text>
                <Text style={styles.emptyText}>Tidak ada kartu yang jatuh tempo!</Text>
                <Text style={styles.emptySubtext}>
                    Semua kartu dalam koleksi ini sudah di-review atau belum ada kartu sama sekali.
                </Text>
            </View>
        );
    }

    // --- Tampilan Sesi Belajar ---
    const progressPercentage = ((currentCardIndex + 1) / totalCards) * 100;

    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                title: `Belajar - ${idString}`,
                headerStyle: { backgroundColor: '#3498db' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold', fontSize: 18 }
            }} />

            {/* Progress Section */}
            <View style={styles.progressSection}>
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                        Kartu {currentCardIndex + 1} dari {totalCards}
                    </Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
                    </View>
                </View>
            </View>

            {/* Card Section */}
            <View style={styles.cardSection}>
                <View style={styles.cardWrapper}>
                    <TouchableOpacity
                        onPress={() => setIsFlipped(prev => !prev)}
                        activeOpacity={0.9}
                        style={styles.cardTouchable}
                    >
                        <FlipCard
                            frontText={currentCard.front}
                            backText={isFlipped ? currentCard.back : 'Ketuk untuk melihat jawaban'}
                            isFlipped={isFlipped}
                        />
                    </TouchableOpacity>

                    {!isFlipped && (
                        <View style={styles.instructionContainer}>
                            <Text style={styles.tapInstruction}>👆 Ketuk kartu untuk melihat jawaban</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Answer Buttons Section */}
            {isFlipped && (
                <View style={styles.buttonsSection}>
                    <View style={styles.buttonsContainer}>
                        <Text style={styles.buttonsTitle}>Seberapa mudah mengingat kartu ini?</Text>
                        <View style={styles.buttonsRow}>
                            <Button
                                title="Sulit"
                                onPress={() => handleAnswer('hard')}
                                variant="srs_hard"
                                style={styles.answerButton}
                            />
                            <Button
                                title="Bisa"
                                onPress={() => handleAnswer('good')}
                                variant="secondary"
                                style={styles.answerButton}
                            />
                            <Button
                                title="Mudah"
                                onPress={() => handleAnswer('easy')}
                                variant="srs_easy"
                                style={styles.answerButton}
                            />
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    loadingText: {
        marginTop: 20,
        fontSize: 16,
        color: '#6c757d',
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 40,
    },
    emptyIcon: {
        fontSize: 80,
        marginBottom: 20,
        opacity: 0.7,
    },
    emptyText: {
        fontSize: 22,
        color: '#495057',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    emptySubtext: {
        fontSize: 16,
        color: '#6c757d',
        textAlign: 'center',
        lineHeight: 24,
    },
    progressContainer: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    progressText: {
        fontSize: 18,
        color: '#2c3e50',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    progressBar: {
        height: 6,
        backgroundColor: '#e9ecef',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#3498db',
        borderRadius: 3,
    },
    mainCardArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    cardTouchable: {
        width: '100%',
        aspectRatio: 16 / 9,
        maxWidth: 350,
        marginBottom: 20,
    },
    tapInstruction: {
        textAlign: 'center',
        fontSize: 16,
        color: '#3498db',
        fontStyle: 'italic',
        marginTop: 10,
    },
    answerButtonsContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
    },
    answerButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: 350,
        gap: 12,
    },
    answerButton: {
        flex: 1,
        height: 50,
    },
    progressSection: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    cardSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    cardWrapper: {
        width: '100%',
        maxWidth: 350,
        alignItems: 'center',
    },
    instructionContainer: {
        marginTop: 15,
        alignItems: 'center',
    },
    buttonsSection: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
        paddingBottom: 30,
    },
    buttonsContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    buttonsTitle: {
        fontSize: 16,
        color: '#2c3e50',
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 15,
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 12,
    },
    welcomeContainer: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    welcomeContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 20,
    },
    welcomeIcon: {
        fontSize: 80,
        marginBottom: 20,
    },
    welcomeTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2c3e50',
        textAlign: 'center',
        marginBottom: 10,
    },
    welcomeSubtitle: {
        fontSize: 16,
        color: '#7f8c8d',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    welcomeStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    statItem: {
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        minWidth: 70,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#3498db',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 12,
        color: '#7f8c8d',
        fontWeight: '600',
    },
    welcomeDescription: {
        fontSize: 16,
        color: '#34495e',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    welcomeActions: {
        width: '100%',
        gap: 15,
        paddingHorizontal: 20,
    },
    startButton: {
        height: 50,
    },
    backButton: {
        backgroundColor: '#ecf0f1',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#3498db',
        fontSize: 16,
        fontWeight: 'bold',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default StudySessionScreen;
