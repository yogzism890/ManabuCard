import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
// ASUMSI: Sesuaikan path impor komponen Anda
import FlipCard from '../../components/FlipCard'; 

// --- 1. Definisi Data ---
interface Kartu {
  id: string;
  front: string;
  back: string;
  difficulty: number;
  reviewDueAt: string; // ISO string dari database
}

// --- 2. Fungsi API Frontend (Harap sesuaikan dengan struktur folder Anda) ---
const API_BASE_URL = 'http://192.168.100.9:3000/api'; // Next.js API URL

/** Mengambil daftar kartu yang jatuh tempo untuk Koleksi ID tertentu */
async function fetchCardsForKoleksi(koleksiId: string): Promise<Kartu[]> {
  // ASUMSI: Anda perlu mengirim token otentikasi di header
  const response = await fetch(`${API_BASE_URL}/koleksi/${koleksiId}/kartu`, {
    headers: { 'Authorization': 'Bearer YOUR_AUTH_TOKEN_HERE' },
  });

  if (!response.ok) {
    throw new Error('Gagal memuat kartu untuk sesi belajar.');
  }
  return response.json();
}

/** Memperbarui status SRS (difficulty dan reviewDueAt) di database */
async function updateKartuSRSData(cardId: string, newDifficulty: number, newReviewDueAt: Date): Promise<void> {
  // ASUMSI: Anda perlu mengirim token otentikasi di header
  const response = await fetch(`${API_BASE_URL}/kartu/${cardId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_AUTH_TOKEN_HERE',
    },
    body: JSON.stringify({ 
      newDifficulty: newDifficulty, 
      newReviewDueAt: newReviewDueAt.toISOString() 
    }),
  });

  if (!response.ok) {
    // throw new Error('Gagal memperbarui status kartu.');
    console.error('Update SRS failed for card:', cardId);
  }
}

// --- 3. Komponen Layar Sesi Belajar ---
const StudySessionScreen = () => {
  const { id: koleksiId } = useLocalSearchParams();
  const [cards, setCards] = useState<Kartu[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verifikasi ID koleksi
  const idString = Array.isArray(koleksiId) ? koleksiId[0] : koleksiId;

  // Memuat Kartu saat komponen dimuat
  useEffect(() => {
    if (!idString) return;

    const loadCards = async () => {
      try {
        const fetchedCards = await fetchCardsForKoleksi(idString);
        setCards(fetchedCards);
      } catch (error) {
        console.error("Error loading study session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCards();
  }, [idString]);

  // Kartu yang sedang ditampilkan
  const currentCard = cards[currentCardIndex];
  const totalCards = cards.length;

  /** Logika Sederhana SRS untuk menentukan tanggal review berikutnya */
  const calculateNextReviewDate = (currentDiff: number, grade: 'hard' | 'good' | 'easy'): { diff: number, nextDate: Date } => {
    let nextDifficulty = currentDiff;
    let daysToAdd = 1;

    // Logika SRS Sederhana (Contoh)
    if (grade === 'easy') {
      nextDifficulty = Math.min(5, currentDiff + 1);
      // Semakin sulit (difficulty rendah), semakin cepat di-review
      daysToAdd = Math.max(3, nextDifficulty * 3); 
    } else if (grade === 'good') {
      daysToAdd = 3;
    } else if (grade === 'hard') {
      nextDifficulty = Math.max(0, currentDiff - 1);
      daysToAdd = 1;
    }

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + daysToAdd); // Tambahkan hari

    return { diff: nextDifficulty, nextDate: nextDate };
  };

  /** Menangani respons pengguna (Hard/Good/Easy) */
  const handleAnswer = useCallback(async (grade: 'hard' | 'good' | 'easy') => {
    if (!currentCard) return;

    // 1. Hitung data SRS baru
    const { diff: newDifficulty, nextDate: newReviewDueAt } = 
      calculateNextReviewDate(currentCard.difficulty, grade);

    // 2. Panggil API untuk memperbarui status kartu
    await updateKartuSRSData(currentCard.id, newDifficulty, newReviewDueAt);

    // 3. Pindah ke kartu berikutnya
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false); // Reset kartu untuk yang baru
    } else {
      // Sesi selesai
      alert("Sesi belajar selesai! Bagus!");
      // TODO: Arahkan kembali pengguna ke layar welcome/home
    }
  }, [currentCard, currentCardIndex, totalCards]);


  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Memuat kartu...</Text>
      </View>
    );
  }

  if (totalCards === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Tidak ada kartu yang jatuh tempo saat ini!</Text>
      </View>
    );
  }
  
  // Tampilkan antarmuka sesi belajar
  return (
    <View style={styles.container}>
      {/* Judul Halaman dari Expo Router */}
      <Stack.Screen options={{ title: `Belajar Koleksi ${idString}` }} />

      <Text style={styles.progressText}>
        Card {currentCardIndex + 1} / {totalCards}
      </Text>

      {/* Area Kartu FlipCard */}
      <TouchableOpacity 
        onPress={() => setIsFlipped(prev => !prev)} 
        activeOpacity={1}
        style={styles.cardContainer}
      >
        <FlipCard
          frontText={currentCard.front}
          backText={currentCard.back}
          isFlipped={isFlipped}
        />
      </TouchableOpacity>
      
      {/* Tombol Penilaian hanya muncul setelah kartu dibalik */}
      {isFlipped && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.hard]} 
            onPress={() => handleAnswer('hard')}
          >
            <Text style={styles.buttonText}>Hard</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.good]} 
            onPress={() => handleAnswer('good')}
          >
            <Text style={styles.buttonText}>Good</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.easy]} 
            onPress={() => handleAnswer('easy')}
          >
            <Text style={styles.buttonText}>Easy</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isFlipped && (
        <Text style={styles.tapToFlip}>Ketuk kartu untuk melihat jawaban</Text>
      )}
    </View>
  );
};

// ... Tambahkan Stylesheet
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
  },
  cardContainer: {
    width: '100%',
    aspectRatio: 16 / 9, // Rasio umum untuk kartu
    marginBottom: 30,
    maxWidth: 400,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 400,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    width: '30%',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  hard: {
    backgroundColor: '#e74c3c', // Merah
  },
  good: {
    backgroundColor: '#f39c12', // Kuning/Jingga
  },
  easy: {
    backgroundColor: '#2ecc71', // Hijau
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