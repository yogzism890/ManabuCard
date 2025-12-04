import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import FlipCard from '../../components/FlipCard';

// Mock Data (Nanti diganti API)
const mockCards = [
  { id: 1, front: 'Apple', back: 'Apel' },
  { id: 2, front: 'To Run', back: 'Berlari' },
  { id: 3, front: 'Beautiful', back: 'Cantik/Indah' },
  { id: 4, front: 'Cat', back: 'Kucing' },
];

export default function StudyScreen() {
  const { id } = useLocalSearchParams(); // Mengambil ID dari URL
  const router = useRouter();
  
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentCard = mockCards[currentIndex];
  const progress = ((currentIndex + 1) / mockCards.length) * 100;

  const handleNext = () => {
    if (currentIndex < mockCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Logic jika kartu habis (Selesai)
      alert("Hore! Anda telah menyelesaikan set ini.");
      router.back();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Mengatur Header Navigasi secara dinamis */}
      <Stack.Screen 
        options={{ 
          title: `Set #${id}`, // Menampilkan ID di header
          headerBackTitle: 'Back',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#F9FAFB' }
        }} 
      />

      <View style={styles.content}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.counterText}>{currentIndex + 1} / {mockCards.length}</Text>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* Flip Card Component */}
        <View style={styles.cardArea}>
          <FlipCard 
            frontText={currentCard.front} 
            backText={currentCard.back} 
            resetTrigger={currentIndex} // Reset animasi saat index berubah
          />
        </View>

        {/* Control Buttons */}
        <View style={styles.controls}>
          <TouchableOpacity 
            style={[styles.btn, styles.btnSecondary]} 
            onPress={handlePrev}
            disabled={currentIndex === 0}
          >
            <Ionicons name="arrow-back" size={24} color={currentIndex === 0 ? "#ccc" : "#4F46E5"} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={handleNext}>
            <Text style={styles.btnText}>Next Card</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" style={{marginLeft: 8}} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between', // Atur jarak atas-tengah-bawah
  },
  progressContainer: {
    marginBottom: 20,
  },
  counterText: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#6B7280',
    fontWeight: '600',
  },
  track: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 4,
  },
  cardArea: {
    flex: 1,
    justifyContent: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  btn: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    flexDirection: 'row',
  },
  btnSecondary: {
    width: 56,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  btnPrimary: {
    flex: 1,
    marginLeft: 16,
    backgroundColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});