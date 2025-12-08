import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
// Perbaikan 1: Impor 'useRouter' untuk navigasi kembali ke home
import { useLocalSearchParams, Stack, useRouter } from 'expo-router'; 

// ASUMSI: Import komponen FlipCard Anda
import FlipCard from '../../components/FlipCard'; 
import Button from '../../components/ui/Button'; 

// --- KONSTANTA API ---
// GANTI DENGAN IP DAN TOKEN ASLI ANDA
const API_BASE_URL = 'http://192.168.100.9:3000/api'; 
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

/** Fungsi fetching kartu yang jatuh tempo dari API */
const fetchStudyCards = async (koleksiId: string): Promise<Kartu[]> => {
  console.log(`Fetching due cards for Collection ID: ${koleksiId}`);
  const response = await fetch(`${API_BASE_URL}/koleksi/${koleksiId}/kartu`, {
    headers: { 'Authorization': `Bearer ${MOCK_AUTH_TOKEN}` },
  });
  if (!response.ok) throw new Error('Gagal mengambil kartu.');
  const cards = await response.json();

  return cards.map((card: any) => ({
    id: card.id,
    front: card.front,
    back: card.back,
    difficulty: card.difficulty,
  }));
};

/** Memperbarui status SRS (difficulty dan reviewDueAt) di database */
async function updateKartuSRSData(cardId: string, newDifficulty: number, newReviewDueAt: Date): Promise<void> {
  // ... (Fungsi ini tidak diubah dan sudah benar)
  const response = await fetch(`${API_BASE_URL}/kartu/${cardId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MOCK_AUTH_TOKEN}`, 
    },
    body: JSON.stringify({ 
      newDifficulty: newDifficulty, 
      newReviewDueAt: newReviewDueAt.toISOString() 
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: 'Gagal update SRS: No error body.' }));
    console.error('Update SRS failed for card:', cardId, 'Status:', response.status, 'Body:', errorBody);
    throw new Error('Gagal memperbarui status kartu di server.');
  }
}


const StudySessionScreen = () => {
    // Perbaikan 2: Inisialisasi useRouter
    const router = useRouter(); 
    const { id: koleksiId } = useLocalSearchParams();
    const [cards, setCards] = useState<Kartu[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const idString = Array.isArray(koleksiId) ? koleksiId[0] : koleksiId;
    const currentCard = cards[currentCardIndex];
    const totalCards = cards.length;

    // --- Logika SRS (Hanya didefinisikan sekali di dalam komponen) ---
    const calculateNextReviewDate = useCallback((currentDiff: number, grade: 'hard' | 'good' | 'easy'): { diff: number, nextDate: Date } => {
        let nextDifficulty = currentDiff;
        let daysToAdd = 1; 

        if (grade === 'easy') {
            nextDifficulty = Math.min(5, currentDiff + 1);
            daysToAdd = Math.max(7, nextDifficulty * 4); 
        } else if (grade === 'good') {
            daysToAdd = Math.max(3, currentDiff * 2); 
        } else if (grade === 'hard') {
            nextDifficulty = Math.max(0, currentDiff - 1);
            daysToAdd = 1;
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
            await updateKartuSRSData(currentCard.id, newDifficulty, newReviewDueAt);
            
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
        
    }, [currentCard, currentCardIndex, totalCards, calculateNextReviewDate, router]);


    // Memuat Kartu
    useEffect(() => {
        if (!idString) return;
        const loadCards = async () => {
            try {
                const fetchedCards = await fetchStudyCards(idString);
                setCards(fetchedCards);
            } catch (error) {
                console.error("Error loading study session:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadCards();
    }, [idString]);


    // --- Tampilan Loading / Kosong ---
    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#3498db" />
                <Text style={{ marginTop: 10 }}>Memuat kartu sesi belajar...</Text>
            </View>
        );
    }

    if (totalCards === 0) {
        return (
            <View style={styles.center}>
                <Text style={styles.emptyText}>Tidak ada kartu yang jatuh tempo di koleksi ini!</Text>
            </View>
        );
    }
    
    // --- Tampilan Sesi Belajar ---
    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: `Sesi Belajar: ${idString}` }} />

            <Text style={styles.progressText}>
                Progress: Card {currentCardIndex + 1} / {totalCards}
            </Text>

            {/* Area Kartu FlipCard yang bisa di-tap */}
            <TouchableOpacity 
                onPress={() => setIsFlipped(prev => !prev)} 
                activeOpacity={1}
                style={styles.cardContainer}
            >
                <FlipCard
                    frontText={currentCard.front}
                    backText={isFlipped ? currentCard.back : 'Ketuk untuk melihat jawaban'} 
                    isFlipped={isFlipped}
                />
            </TouchableOpacity>
            
            {/* Tombol Penilaian (SRS Buttons) */}
            {isFlipped && (
                <View style={styles.buttonContainer}>
                    <Button 
                        title="Hard (Sulit)" 
                        onPress={() => handleAnswer('hard')} 
                        variant="srs_hard"
                        style={styles.srsButton}
                    />
                    <Button 
                        title="Good (Bisa)" 
                        onPress={() => handleAnswer('good')} 
                        variant="secondary"
                        style={styles.srsButton}
                    />
                    <Button 
                        title="Easy (Mudah)" 
                        onPress={() => handleAnswer('easy')} 
                        variant="srs_easy"
                        style={styles.srsButton}
                    />
                </View>
            )}

            {!isFlipped && (
                <Text style={styles.tapToFlip}>Ketuk kartu untuk mengungkapkan jawaban</Text>
            )}
        </View>
    );
};

// ... (Gaya/Stylesheets tetap sama) ...
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
        alignItems: 'center',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressText: {
        fontSize: 16,
        color: '#888',
        marginBottom: 20,
        alignSelf: 'flex-start'
    },
    cardContainer: {
        width: '100%',
        aspectRatio: 16 / 9, 
        marginBottom: 30,
        maxWidth: 400,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: 400,
    },
    srsButton: {
        width: '32%', 
    },
    tapToFlip: {
        marginTop: 10,
        color: '#3498db',
        fontStyle: 'italic',
    },
    emptyText: {
        fontSize: 18,
        color: '#7f8c8d',
    }
});

export default StudySessionScreen;