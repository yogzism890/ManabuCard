
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { Link } from 'expo-router';
import { IconButton } from 'react-native-paper';


// Import komponen yang sudah ada
import FlipCard from '../../components/FlipCard';
import Button from '../../components/ui/Button';
import CustomModal from '../../components/ui/CustomModal';
import { useAuth } from '../../contexts/AuthContext';

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

// --- KOMPONEN UTAMA ---

const ReviewScreen = () => {
  const { apiRequest, isAuthenticated } = useAuth();
  const [collections, setCollections] = useState<Koleksi[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Koleksi | null>(null);
  const [cards, setCards] = useState<Kartu[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<'success' | 'error' | 'info' | 'warning'>('info');
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [modalConfirmText, setModalConfirmText] = useState("OK");
  const [onModalConfirm, setOnModalConfirm] = useState<(() => void) | undefined>();

  // Helper function to show modal
  const showModal = (
    title: string,
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    showConfirm: boolean = false,
    confirmText: string = "OK",
    onConfirm?: () => void
  ) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setShowConfirmButton(showConfirm);
    setModalConfirmText(confirmText);
    setOnModalConfirm(onConfirm);
    setModalVisible(true);
  };

  // Helper function to hide modal
  const hideModal = () => {
    setModalVisible(false);
  };

  // Load collections on component mount
  useFocusEffect(
  useCallback(() => {
    loadCollections();
  }, [])
);

const handleDeleteCard = (cardId: string) => {
  showModal(
    'Hapus Kartu',
    'Apakah Anda yakin ingin menghapus kartu ini?',
    'warning',
    true,
    'Hapus',
    async () => {
      hideModal();
      try {
        setIsUpdating(true);

        // DELETE request ke backend
        await apiRequest(`/kartu/${cardId}`, { method: 'DELETE' });

        // Update state: hapus kartu dari array
        setCards(prev => prev.filter(card => card.id !== cardId));

        // Update currentIndex agar tetap valid
        setCurrentIndex(prev => {
          const newIndex = prev - 1;
          return newIndex < 0 ? 0 : newIndex;
        });

      } catch (error) {
        console.error('Error deleting card:', error);
        showModal('Gagal', 'Terjadi kesalahan saat menghapus kartu', 'error');
      } finally {
        setIsUpdating(false);
      }
    }
  );
};



  const loadCollections = async () => {
    try {
      setIsLoading(true);
      const data = await apiRequest('/koleksi');
      const userCollections = data.map((item: any) => ({
        id: item.id,
        nama: item.name,
        _count: {
          kartu: item.cardCount || 0,
        },
      }));
      setCollections(userCollections);
    } catch (error) {
      console.error('Error fetching collections:', error);
      showModal('Error', 'Gagal memuat koleksi', 'error');
    } finally {
      setIsLoading(false);
    }
  };


  const selectCollection = async (collection: Koleksi) => {
    try {
      setIsLoading(true);
      const data = await apiRequest(`/koleksi/${collection.id}/kartu`);
      const collectionCards = data.map((card: any) => ({
        id: card.id,
        front: card.front,
        back: card.back,
        difficulty: card.difficulty,
        reviewDueAt: card.reviewDueAt,
        koleksiId: card.koleksiId,
      }));
      setSelectedCollection(collection);
      setCards(collectionCards);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (error) {
      console.error('Error fetching collection cards:', error);
      showModal('Error', 'Gagal memuat kartu koleksi', 'error');
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
    let qualityMessage = '';

    // Enhanced SRS calculation with better intervals and feedback
    switch (quality) {
      case 'hard':
        // Decrease difficulty, short interval for review
        newDifficulty = Math.max(0, newDifficulty - 1);
        daysToAdd = Math.max(1, Math.floor(newDifficulty * 0.5) + 1);
        qualityMessage = 'Kartu akan muncul lagi besok untuk diperkuat';
        break;
      case 'good':
        // Keep difficulty, moderate interval
        daysToAdd = Math.max(1, Math.floor(newDifficulty * 1.3) + 1);
        qualityMessage = `Kartu akan muncul lagi dalam ${daysToAdd} hari`;
        break;
      case 'easy':
        // Increase difficulty, long interval
        newDifficulty = Math.min(5, newDifficulty + 1);
        daysToAdd = Math.max(1, Math.floor(newDifficulty * 2.2) + 3);
        qualityMessage = `Kartu akan muncul lagi dalam ${daysToAdd} hari`;
        break;
    }

    const newReviewDueAt = new Date();
    newReviewDueAt.setDate(newReviewDueAt.getDate() + daysToAdd);

    try {
      setIsUpdating(true);

      // Add small delay for better UX feedback
      await new Promise(resolve => setTimeout(resolve, 300));

      await apiRequest(`/kartu/${currentCard.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newDifficulty: newDifficulty,
          newReviewDueAt: newReviewDueAt.toISOString()
        }),
      });


      // Show quality feedback briefly
      showModal('Progress Disimpan', qualityMessage, 'success');

      // Move to next card or finish after a brief delay
      setTimeout(() => {
        if (currentIndex < cards.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setIsFlipped(false);
        } else {

          // All cards reviewed, show completion summary
          const completionMessage = `🎉 Selesai!\n\nSemua ${cards.length} kartu dari koleksi "${selectedCollection?.nama}" telah direview.\n\nKartu-kartu akan muncul lagi sesuai jadwal yang telah ditentukan.`;

          showModal(
            'Review Selesai!',
            completionMessage,
            'success',
            true,
            'Kembali',
            backToCollections
          );
        }
      }, 500);


    } catch (error) {
      console.error('SRS Update Error:', error);
      showModal(
        'Gagal Menyimpan',
        'Terjadi kesalahan saat menyimpan progress. Silakan coba lagi.',
        'error',
        true,
        'Coba Lagi',
        () => handleAnswer(quality)
      );
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

            <Link href="/(tabs)/create" asChild>
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

          <Link href="/(tabs)/create/card" asChild>
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


      {/* Custom Modal */}
      <CustomModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
        showConfirmButton={showConfirmButton}
        confirmButtonText={modalConfirmText}
        onConfirm={() => {
          hideModal();
          if (onModalConfirm) {
            onModalConfirm();
          }
        }}
        onClose={hideModal}
      />
    </View>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    margin: 10,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 20,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.1)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 17,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  collectionsList: {
    gap: 20,
    paddingBottom: 30,
  },
  collectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.08)',
  },
  collectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  collectionName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
    marginRight: 15,
  },
  collectionCount: {
    fontSize: 15,
    color: '#6366f1',
    backgroundColor: '#eef2ff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 25,
    fontWeight: '700',
    minWidth: 70,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  collectionDescription: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
    marginTop: 5,
    fontWeight: '400',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    paddingTop: 15,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.05)',
  },
  backButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 12,
  },
  backButtonText: {
    color: '#6366f1',
    fontSize: 17,
    fontWeight: '600',
  },
  collectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
  },
  progressContainer: {
    marginBottom: 25,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.05)',
  },
  progressText: {
    fontSize: 17,
    color: '#64748b',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 3,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 35,
  },
  cardTouchable: {
    width: '100%',
    aspectRatio: 16 / 9,
    maxWidth: 400,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
  },
  tapHint: {
    marginTop: 20,
    color: '#6366f1',
    fontStyle: 'italic',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 400,
    marginBottom: 25,
    gap: 10,
  },
  srsButton: {
    flex: 1,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  updatingIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginHorizontal: 20,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.05)',
  },
  updatingText: {
    marginLeft: 12,
    color: '#6366f1',
    fontSize: 15,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 70,
    paddingHorizontal: 25,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    margin: 10,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.05)',
  },
  emptyIcon: {
    fontSize: 90,
    marginBottom: 25,
  },
  emptyTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 18,
  },
  emptySubtitle: {
    fontSize: 17,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 45,
    fontWeight: '400',
  },
  emptyActions: {
    width: '100%',
    maxWidth: 320,
    gap: 15,
  },
  createButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 35,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  refreshButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#6366f1',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 35,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  refreshButtonText: {
    color: '#6366f1',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default ReviewScreen;
