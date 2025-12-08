import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
  FlatList,
} from 'react-native';
import { Link } from 'expo-router';

// Import komponen yang sudah ada
import FlipCard from '../../components/FlipCard';
import Button from '../../components/ui/Button';

// --- KONSTANTA API ---
const API_BASE_URL = 'http://192.168.100.9:3000/api';
const MOCK_AUTH_TOKEN = 'YOUR_AUTH_TOKEN_HERE';

// --- Tipe Data ---
interface Koleksi {
  id: string;
  nama: string;
  _count?: {
    kartu: number;
  };
}

interface Kartu {
  id: string;
  front: string;
  back: string;
  difficulty: number;
  reviewDueAt: string;
  koleksiId: string;
}

// --- FUNGSI API ---
async function fetchUserCollections(): Promise<Koleksi[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/koleksi`, {
      headers: { 'Authorization': `Bearer ${MOCK_AUTH_TOKEN}` },
    });

    if (!response.ok) throw new Error('Gagal mengambil daftar koleksi.');

    const data = await response.json();
    return data.map((item: any) => ({
      id: item.id,
      nama: item.name,
      _count: {
        kartu: item.cardCount || 0,
      },
    }));
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw error;
  }
}

async function fetchCollectionCards(collectionId: string): Promise<Kartu[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/koleksi/${collectionId}/kartu`, {
      headers: { 'Authorization': `Bearer ${MOCK_AUTH_TOKEN}` },
    });

    if (!response.ok) throw new Error('Gagal mengambil kartu koleksi.');

    const data = await response.json();
    return data.map((card: any) => ({
      id: card.id,
      front: card.front,
      back: card.back,
      difficulty: card.difficulty,
      reviewDueAt: card.reviewDueAt,
      koleksiId: card.koleksiId,
    }));
  } catch (error) {
    console.error('Error fetching collection cards:', error);
    throw error;
  }
}

async function updateCardSRS(cardId: string, newDifficulty: number, newReviewDueAt: Date): Promise<void> {
  try {
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
      const errorBody = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`Gagal update SRS: ${errorBody.message}`);
    }
  } catch (error) {
    console.error('Error updating card SRS:', error);
    throw error;
  }
}

// --- KOMPONEN UTAMA ---
const ReviewScreen = () => {
  const [collections, setCollections] = useState<Koleksi[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Koleksi | null>(null);
  const [cards, setCards] = useState<Kartu[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load collections on component mount
  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      setIsLoading(true);
      const userCollections = await fetchUserCollections();
      setCollections(userCollections);
    } catch (error) {
      Alert.alert('Error', 'Gagal memuat koleksi');
    } finally {
      setIsLoading(false);
    }
  };

  const selectCollection = async (collection: Koleksi) => {
    try {
      setIsLoading(true);
      const collectionCards = await fetchCollectionCards(collection.id);
      setSelectedCollection(collection);
      setCards(collectionCards);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (error) {
      Alert.alert('Error', 'Gagal memuat kartu koleksi');
    } finally {
      setIsLoading(false);
    }
  };

  const backToCollections = () => {
    setSelectedCollection(null);
    setCards([]);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleAnswer = async (quality: 'hard' | 'good' | 'easy') => {
    if (isUpdating || cards.length === 0) return;

    const currentCard = cards[currentIndex];
    let newDifficulty = currentCard.difficulty;
    let daysToAdd = 1;

    // Simple SRS calculation based on quality
    switch (quality) {
      case 'hard':
        newDifficulty = Math.max(0, newDifficulty - 1);
        daysToAdd = 1;
        break;
      case 'good':
        // Keep difficulty the same
        daysToAdd = Math.max(1, Math.floor(newDifficulty * 1.5));
        break;
      case 'easy':
        newDifficulty = Math.min(5, newDifficulty + 1);
        daysToAdd = Math.max(1, Math.floor(newDifficulty * 2.5));
        break;
    }

    const newReviewDueAt = new Date();
    newReviewDueAt.setDate(newReviewDueAt.getDate() + daysToAdd);

    try {
      setIsUpdating(true);
      await updateCardSRS(currentCard.id, newDifficulty, newReviewDueAt);

      // Move to next card or finish
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
      } else {
        // All cards reviewed, go back to collections
        Alert.alert(
          'Selesai!',
          `Semua kartu dari koleksi "${selectedCollection?.nama}" telah direview.`,
          [{ text: 'OK', onPress: backToCollections }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan progress review');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCardPress = () => {
    setIsFlipped(!isFlipped);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={{ marginTop: 10 }}>
          {selectedCollection ? 'Memuat kartu...' : 'Memuat koleksi...'}
        </Text>
      </View>
    );
  }

  // Show collections list
  if (!selectedCollection) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Pilih Koleksi untuk Review</Text>
          <Text style={styles.headerSubtitle}>
            Pilih koleksi yang ingin Anda review kartunya
          </Text>
        </View>

        {collections.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyTitle}>Belum ada koleksi</Text>
            <Text style={styles.emptySubtitle}>
              Buat koleksi dan kartu terlebih dahulu untuk mulai belajar
            </Text>

            <Link href="/create" asChild>
              <TouchableOpacity style={styles.createButton}>
                <Text style={styles.createButtonText}>Buat Koleksi Baru</Text>
              </TouchableOpacity>
            </Link>
          </View>
        ) : (
          <View style={styles.collectionsList}>
            {collections.map((collection) => (
              <TouchableOpacity
                key={collection.id}
                style={styles.collectionCard}
                onPress={() => selectCollection(collection)}
              >
                <View style={styles.collectionHeader}>
                  <Text style={styles.collectionName}>{collection.nama}</Text>
                  <Text style={styles.collectionCount}>
                    {collection._count?.kartu || 0} kartu
                  </Text>
                </View>
                <Text style={styles.collectionDescription}>
                  Ketuk untuk mulai review kartu dari koleksi ini
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    );
  }

  // Show cards review
  if (cards.length === 0) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={backToCollections}>
            <Text style={styles.backButtonText}>← Kembali</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selectedCollection.nama}</Text>
        </View>

        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyTitle}>Tidak ada kartu</Text>
          <Text style={styles.emptySubtitle}>
            Koleksi ini belum memiliki kartu. Tambahkan kartu terlebih dahulu.
          </Text>

          <Link href="/create" asChild>
            <TouchableOpacity style={styles.createButton}>
              <Text style={styles.createButtonText}>Tambah Kartu</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.reviewHeader}>
        <TouchableOpacity style={styles.backButton} onPress={backToCollections}>
          <Text style={styles.backButtonText}>← Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.collectionTitle}>{selectedCollection.nama}</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {currentIndex + 1} dari {cards.length}
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      {/* Card */}
      <View style={styles.cardContainer}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.cardTouchable}
          onPress={handleCardPress}
        >
          <FlipCard
            frontText={currentCard.front}
            backText={isFlipped ? currentCard.back : 'Ketuk untuk melihat jawaban'}
            isFlipped={isFlipped}
          />
        </TouchableOpacity>

        {!isFlipped && (
          <Text style={styles.tapHint}>Ketuk kartu untuk mengungkapkan jawaban</Text>
        )}
      </View>

      {/* SRS Buttons */}
      {isFlipped && (
        <View style={styles.buttonContainer}>
          <Button
            title="Sulit"
            onPress={() => handleAnswer('hard')}
            variant="srs_hard"
            style={styles.srsButton}
            disabled={isUpdating}
          />
          <Button
            title="Bisa"
            onPress={() => handleAnswer('good')}
            variant="secondary"
            style={styles.srsButton}
            disabled={isUpdating}
          />
          <Button
            title="Mudah"
            onPress={() => handleAnswer('easy')}
            variant="srs_easy"
            style={styles.srsButton}
            disabled={isUpdating}
          />
        </View>
      )}

      {isUpdating && (
        <View style={styles.updatingIndicator}>
          <ActivityIndicator size="small" color="#3498db" />
          <Text style={styles.updatingText}>Menyimpan progress...</Text>
        </View>
      )}
    </View>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
  },
  collectionsList: {
    gap: 16,
    paddingBottom: 20,
  },
  collectionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  collectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  collectionName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    marginRight: 12,
  },
  collectionCount: {
    fontSize: 14,
    color: '#3498db',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontWeight: '600',
    minWidth: 60,
    textAlign: 'center',
  },
  collectionDescription: {
    fontSize: 15,
    color: '#7f8c8d',
    lineHeight: 22,
    marginTop: 4,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 16,
  },
  backButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '600',
  },
  collectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#ecf0f1',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3498db',
    borderRadius: 2,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  cardTouchable: {
    width: '100%',
    aspectRatio: 16 / 9,
    maxWidth: 400,
  },
  tapHint: {
    marginTop: 15,
    color: '#3498db',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
  },
  srsButton: {
    width: '32%',
  },
  updatingIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  updatingText: {
    marginLeft: 10,
    color: '#7f8c8d',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  emptyActions: {
    width: '100%',
    maxWidth: 300,
    gap: 12,
  },
  createButton: {
    backgroundColor: '#3498db',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  refreshButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#3498db',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReviewScreen;
