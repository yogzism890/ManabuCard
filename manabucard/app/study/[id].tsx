import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';

import FlipCard from '../../components/FlipCard';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';

interface Kartu {
  id: string;
  front: string;
  back: string;
  difficulty: number;
}

const StudySessionScreen = () => {
  const router = useRouter();
  const { id: koleksiId } = useLocalSearchParams();
  const { apiRequest, isAuthenticated } = useAuth();
  
  const [cards, setCards] = useState<Kartu[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [collectionName, setCollectionName] = useState<string>('');

  const idString = Array.isArray(koleksiId) ? koleksiId[0] : koleksiId;
  const currentCard = cards[currentCardIndex];
  const totalCards = cards.length;

  // Fungsi untuk mengambil detail koleksi
  const fetchCollectionDetail = useCallback(async (id: string) => {
    try {
      const data = await apiRequest(`/koleksi/${id}`);
      setCollectionName(data.name || 'Koleksi');
    } catch (error) {
      console.error('Error fetching collection detail:', error);
      setCollectionName('Koleksi');
    }
  }, [apiRequest]);

  // Fungsi untuk mengambil kartu
  const fetchStudyCards = useCallback(async (koleksiId: string) => {
    try {
      const data = await apiRequest(`/koleksi/${koleksiId}/kartu`);
      
      if (Array.isArray(data)) {
        const formattedCards = data.map((card: any) => ({
          id: card.id,
          front: card.front,
          back: card.back,
          difficulty: card.difficulty || 0,
        }));
        setCards(formattedCards);
      } else {
        setCards([]);
      }
    } catch (error) {
      console.error('Error fetching cards:', error);
      setCards([]);
    }
  }, [apiRequest]);

  // Logika SRS
  const calculateNextReviewDate = useCallback((currentDiff: number, grade: 'hard' | 'good' | 'easy'): { diff: number, nextDate: Date } => {
    let nextDifficulty = currentDiff;
    let daysToAdd = 1;

    if (grade === 'easy') {
      nextDifficulty = Math.min(5, currentDiff + 1);
      daysToAdd = Math.max(7, nextDifficulty * 4);
      if (nextDifficulty > 2) {
        daysToAdd *= nextDifficulty;
      }
    } else if (grade === 'good') {
      daysToAdd = Math.max(3, currentDiff * 2);
      if (currentDiff > 2) {
        daysToAdd *= currentDiff;
      }
    } else if (grade === 'hard') {
      nextDifficulty = Math.max(0, currentDiff - 1);
      daysToAdd = 1;
    }

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + daysToAdd);

    return { diff: nextDifficulty, nextDate: nextDate };
  }, []);

  // Update SRS data
  const updateKartuSRSData = useCallback(async (cardId: string, newDifficulty: number, newReviewDueAt: Date) => {
    await apiRequest(`/kartu/${cardId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newDifficulty: newDifficulty,
        newReviewDueAt: newReviewDueAt.toISOString()
      }),
    });
  }, [apiRequest]);

  // Handle answer
  const handleAnswer = useCallback(async (grade: 'hard' | 'good' | 'easy') => {
    if (!currentCard) return;

    try {
      const { diff: newDifficulty, nextDate: newReviewDueAt } =
        calculateNextReviewDate(currentCard.difficulty, grade);

      await updateKartuSRSData(currentCard.id, newDifficulty, newReviewDueAt);

      if (currentCardIndex < totalCards - 1) {
        setCurrentCardIndex(prev => prev + 1);
        setIsFlipped(false);
      } else {


        Alert.alert("Sesi Selesai!", "Semua kartu telah di-review.", [
          { text: "Kembali ke Home", onPress: () => router.push('/(tabs)/review') }
        ]);
      }
    } catch (error) {
      Alert.alert("Error", "Gagal menyimpan hasil review.");
      console.error('Error updating card:', error);
    }
  }, [currentCard, currentCardIndex, totalCards, calculateNextReviewDate, updateKartuSRSData, router]);

  // Load data
  useEffect(() => {
    if (!isAuthenticated || !idString) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        await Promise.all([
          fetchCollectionDetail(idString),
          fetchStudyCards(idString)
        ]);
      } catch (error) {
        console.error('Error loading study session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [idString, isAuthenticated, fetchCollectionDetail, fetchStudyCards]);

  // Welcome Screen
  if (showWelcome) {
    return (
      <View style={styles.welcomeContainer}>
        <Stack.Screen options={{
          title: 'Mulai Belajar',
          headerStyle: { backgroundColor: '#6366f1' },
          headerTintColor: '#fff',
        }} />

        <View style={styles.welcomeContent}>
          <Text style={styles.welcomeIcon}>🎯</Text>
          <Text style={styles.welcomeTitle}>Siap Belajar?</Text>
          <Text style={styles.welcomeSubtitle}>
            {collectionName} memiliki {totalCards} kartu siap di-review
          </Text>

          <View style={styles.welcomeStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalCards}</Text>
              <Text style={styles.statLabel}>Kartu</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>🧠</Text>
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
              disabled={totalCards === 0}
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

  // Loading Screen
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Memuat sesi belajar...</Text>
      </View>
    );
  }

  // Empty State
  if (totalCards === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Stack.Screen options={{ title: 'Belajar' }} />
        <Text style={styles.emptyIcon}>📚</Text>
        <Text style={styles.emptyText}>Tidak ada kartu tersedia!</Text>
        <Text style={styles.emptySubtext}>
          Koleksi ini belum memiliki kartu atau semua kartu sudah di-review.
        </Text>
        <TouchableOpacity 
          style={styles.emptyButton}
          onPress={() => router.push('/(tabs)/create')}
        >
          <Text style={styles.emptyButtonText}>Tambah Kartu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Study Session
  const progressPercentage = ((currentCardIndex + 1) / totalCards) * 100;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{
        title: collectionName || 'Belajar',
        headerStyle: { backgroundColor: '#6366f1' },
        headerTintColor: '#fff',
      }} />

      {/* Progress Section */}
      <View style={styles.progressSection}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {currentCardIndex + 1} dari {totalCards}
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
              backText={isFlipped ? currentCard.back : 'Tap to reveal'}
              isFlipped={isFlipped}
            />
          </TouchableOpacity>

          {!isFlipped && (
            <View style={styles.instructionContainer}>
              <Text style={styles.tapInstruction}>👆 Tap card to reveal answer</Text>
            </View>
          )}
        </View>
      </View>

      {/* Answer Buttons */}
      {isFlipped && (
        <View style={styles.buttonsSection}>
          <View style={styles.buttonsContainer}>
            <Text style={styles.buttonsTitle}>Seberapa mudah?</Text>
            <View style={styles.buttonsRow}>
              <Button
                title="Sulit"
                onPress={() => handleAnswer('hard')}
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
    backgroundColor: '#f8f9ff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#64748b',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
    opacity: 0.7,
  },
  emptyText: {
    fontSize: 22,
    color: '#1e293b',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  emptyButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  emptyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressSection: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(99, 102, 241, 0.1)',
  },
  progressContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  progressText: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 2,
  },
  cardSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },
  cardTouchable: {
    width: '100%',
    aspectRatio: 16 / 10,
    marginBottom: 20,
  },
  instructionContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  tapInstruction: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6366f1',
    fontStyle: 'italic',
  },
  buttonsSection: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(99, 102, 241, 0.1)',
    paddingBottom: 30,
  },
  buttonsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  buttonsTitle: {
    fontSize: 16,
    color: '#1e293b',
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
  answerButton: {
    flex: 1,
    height: 50,
  },
  welcomeContainer: {
    flex: 1,
    backgroundColor: '#f8f9ff',
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
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
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
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 12,
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
    color: '#6366f1',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  welcomeDescription: {
    fontSize: 16,
    color: '#475569',
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
    backgroundColor: '#f1f5f9',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StudySessionScreen;
