import React, { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Import komponen kustom
import FlipCard from '../../components/FlipCard';
import CustomModal from '../../components/ui/CustomModal';
import { useAuth } from '../../contexts/AuthContext';

const { width } = Dimensions.get('window');

const ReviewScreen = () => {
  const { apiRequest } = useAuth();
  const [collections, setCollections] = useState<any[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<any | null>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  const showModal = (title: string, message: string, type: any = 'info') => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  useFocusEffect(useCallback(() => { loadCollections(); }, []));

  const loadCollections = async () => {
    try {
      setIsLoading(true);
      const data = await apiRequest('/koleksi');
      setCollections(data.map((item: any) => ({
        id: item.id,
        nama: item.name,
        kartuCount: item.cardCount || 0,
      })));
    } catch (error) {
      showModal('Error', 'Gagal memuat koleksi', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const selectCollection = async (collection: any) => {
    try {
      setIsLoading(true);
      const data = await apiRequest(`/koleksi/${collection.id}/kartu`);
      setSelectedCollection(collection);
      setCards(data);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (error) {
      showModal('Error', 'Gagal memuat kartu', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = async (quality: 'hard' | 'good' | 'easy') => {
    if (isUpdating || cards.length === 0) return;
    const currentCard = cards[currentIndex];
    let daysToAdd = quality === 'hard' ? 1 : quality === 'good' ? 3 : 7;
    const newReviewDueAt = new Date();
    newReviewDueAt.setDate(newReviewDueAt.getDate() + daysToAdd);

    try {
      setIsUpdating(true);
      await apiRequest(`/kartu/${currentCard.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ newDifficulty: 1, newReviewDueAt: newReviewDueAt.toISOString() }),
      });

      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
      } else {
        showModal('Selesai!', 'Semua kartu telah direview.', 'success');
        setSelectedCollection(null);
      }
    } catch (error) {
      showModal('Gagal', 'Gagal menyimpan progres', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#9100FF" />
    </View>
  );

  const currentCard = cards[currentIndex];
  const progress = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0;

  return (
    <LinearGradient colors={["#F8F0FF", "#F0F4FF", "#FFFFFF"]} style={styles.container}>
      {/* Ornamen Dekoratif seperti di Landing Screen */}
      <View style={[styles.decorativeCircle, styles.circle1]} />
      
      {/* Header Area */}
      <View style={styles.headerArea}>
        {selectedCollection ? (
          <View style={styles.reviewHeader}>
            <TouchableOpacity onPress={() => setSelectedCollection(null)} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={20} color="#9100FF" />
            </TouchableOpacity>
            <View style={styles.titleWrapper}>
              <Text style={styles.reviewTitle} numberOfLines={1}>{selectedCollection.nama}</Text>
              <Text style={styles.reviewSubtitle}>{currentIndex + 1} dari {cards.length} kartu</Text>
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.mainTitle}>Review Kartu</Text>
            <Text style={styles.mainSubtitle}>Asah ingatanmu dengan koleksi yang ada</Text>
          </>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {!selectedCollection ? (
          // DAFTAR KOLEKSI
          collections.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="documents-outline" size={48} color="#9100FF" style={{ opacity: 0.3 }} />
              <Text style={styles.emptyText}>Belum ada koleksi untuk dipelajari.</Text>
            </View>
          ) : (
            collections.map((item) => (
              <TouchableOpacity key={item.id} style={styles.glassCard} onPress={() => selectCollection(item)}>
                <View style={styles.cardIcon}>
                  <Ionicons name="folder-open" size={24} color="#9100FF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.collectionName}>{item.nama}</Text>
                  <Text style={styles.collectionCount}>{item.kartuCount} Kartu</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#CCC" />
              </TouchableOpacity>
            ))
          )
        ) : (
          // TAMPILAN SESI REVIEW
          <View style={styles.sessionWrapper}>
            <View style={styles.progressContainer}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
            </View>

            <TouchableOpacity 
              activeOpacity={0.9} 
              onPress={() => setIsFlipped(!isFlipped)} 
              style={styles.cardWrapper}
            >
              <FlipCard
                frontText={currentCard?.front}
                backText={isFlipped ? currentCard?.back : 'Ketuk untuk melihat jawaban'}
                isFlipped={isFlipped}
              />
            </TouchableOpacity>

            {isFlipped ? (
              <View style={styles.actionGrid}>
                <TouchableOpacity style={[styles.actionBtn, styles.btnHard]} onPress={() => handleAnswer('hard')}>
                  <Text style={styles.actionText}>Sulit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.btnGood]} onPress={() => handleAnswer('good')}>
                  <Text style={styles.actionText}>Bisa</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.btnEasy]} onPress={() => handleAnswer('easy')}>
                  <Text style={styles.actionText}>Mudah</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.hintBox}>
                <Ionicons name="information-circle-outline" size={18} color="#9100FF" />
                <Text style={styles.hintText}>Ketuk kartu untuk mengungkapkan jawaban</Text>
              </View>
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // Decorative
  decorativeCircle: { position: "absolute", width: 300, height: 300, borderRadius: 150, backgroundColor: "#E0D0FF", top: -50, right: -100, opacity: 0.4 },

  headerArea: { marginBottom: 30 },
  mainTitle: { fontSize: 28, fontFamily: 'Poppins-Bold', color: '#1A1A1A' },
  mainSubtitle: { fontSize: 14, color: '#666', fontFamily: 'Poppins-Regular' },

  // Review Header
  reviewHeader: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.8)', justifyContent: 'center', alignItems: 'center', marginRight: 15, borderWidth: 1, borderColor: 'rgba(145, 0, 255, 0.1)' },
  titleWrapper: { flex: 1 },
  reviewTitle: { fontSize: 18, fontFamily: 'Poppins-Bold', color: '#1A1A1A' },
  reviewSubtitle: { fontSize: 12, color: '#9100FF', fontFamily: 'Poppins-Regular' },

  // List Koleksi
  glassCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.6)', padding: 16, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)' },
  cardIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(145, 0, 255, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  collectionName: { fontSize: 16, fontFamily: 'Poppins-SemiBold', color: '#1A1A1A' },
  collectionCount: { fontSize: 12, color: '#777' },

  // Session
  sessionWrapper: { alignItems: 'center' },
  progressContainer: { width: '100%', marginBottom: 30 },
  progressBarBg: { width: '100%', height: 8, backgroundColor: 'rgba(145, 0, 255, 0.1)', borderRadius: 10, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#9100FF', borderRadius: 10 },
  cardWrapper: { width: '100%', height: width * 0.65, marginBottom: 20 },

  hintBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(145, 0, 255, 0.05)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  hintText: { fontSize: 13, color: '#9100FF', fontFamily: 'Poppins-Medium' },

  // SRS Buttons
  actionGrid: { flexDirection: 'row', gap: 10, width: '100%' },
  actionBtn: { flex: 1, paddingVertical: 15, borderRadius: 18, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 4 },
  btnHard: { backgroundColor: '#FF5252' },
  btnGood: { backgroundColor: '#448AFF' },
  btnEasy: { backgroundColor: '#9100FF' },
  actionText: { color: '#FFF', fontFamily: 'Poppins-Bold', fontSize: 14 },

  emptyBox: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#999', marginTop: 15, fontFamily: 'Poppins-Regular' }
});

export default ReviewScreen;