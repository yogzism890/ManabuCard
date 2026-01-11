import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

const CreateCollectionScreen = ({ navigation }: any) => {
  const { apiRequest, isAuthenticated } = useAuth();

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{
    nama: boolean;
  }>({
    nama: false,
  });

  const handleCreate = async () => {
    if (!isAuthenticated) {
      Alert.alert("Error", "Silakan login terlebih dahulu");
      return;
    }

    const errorStatus = {
      nama: name.trim() === '',
    };

    setError(errorStatus);

    const hasError = Object.values(errorStatus).includes(true);
    if (hasError) return;

    setLoading(true);
    try {
      const newCollection = await apiRequest('/koleksi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: name,
          deskripsi: desc,
        }),
      });

      Alert.alert("Sukses", "Koleksi berhasil dibuat");

      setName('');
      setDesc('');

      router.replace({
        pathname: '/create/card',
        params: {
          collectionId: newCollection.id,
          collectionName: newCollection.nama,
        },
      });

    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#FFF8E7", "#FFF0F5", "#E8F4FF"]} style={styles.container}>
      
      {/* Floating decorative emojis */}
      <Animated.Text entering={FadeIn.delay(200)} style={[styles.floatingEmoji, styles.emoji1]}>
        📚
      </Animated.Text>
      <Animated.Text entering={FadeIn.delay(300)} style={[styles.floatingEmoji, styles.emoji2]}>
        ✨
      </Animated.Text>
      <Animated.Text entering={FadeIn.delay(400)} style={[styles.floatingEmoji, styles.emoji3]}>
        🎨
      </Animated.Text>

      {/* Decorative circles */}
      <View style={[styles.decorativeCircle, styles.circle1]} />
      <View style={[styles.decorativeCircle, styles.circle2]} />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.headerCard}>
          <View style={styles.iconContainer}>
            <View style={styles.iconBubble}>
              <Text style={styles.iconEmoji}>📁</Text>
            </View>
          </View>
          
          <View style={styles.titleContainer}>
            <Text style={styles.titleEmoji}>✨</Text>
            <Text style={styles.title}>Buat Koleksi Baru</Text>
          </View>
          
          <Text style={styles.subtitle}>
            Yuk buat koleksi untuk mengatur kartu belajarmu! 🎉
          </Text>
        </Animated.View>

        {/* Form Card */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.formCard}>
          
          {/* Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>💡</Text>
            <Text style={styles.infoText}>
              Koleksi membantu kamu mengelompokkan kartu berdasarkan topik atau mata pelajaran
            </Text>
          </View>

          {/* Name Input */}
          <Animated.View entering={FadeInDown.delay(250).duration(600)} style={styles.inputWrapper}>
            <View style={styles.inputLabelContainer}>
              <Text style={styles.inputEmoji}>📝</Text>
              <Text style={styles.inputLabel}>Nama Koleksi</Text>
            </View>
            <Input
              label="Nama Koleksi"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (text.trim() !== '') {
                  setError({ nama: false });
                }
              }}
              error={error.nama ? 'Nama koleksi tidak boleh kosong' : ''}
              placeholder="Contoh: Bahasa Inggris"
            />
          </Animated.View>

          {/* Description Input */}
          <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.inputWrapper}>
            <View style={styles.inputLabelContainer}>
              <Text style={styles.inputEmoji}>📄</Text>
              <Text style={styles.inputLabel}>Deskripsi (Opsional)</Text>
            </View>
            <Input
              label="Deskripsi (Opsional)"
              value={desc}
              onChangeText={setDesc}
              multiline
              placeholder="Ceritakan tentang koleksi ini..."
            />
          </Animated.View>

          {/* Preview Card */}
          {name.trim() !== '' && (
            <Animated.View entering={FadeInDown.duration(400)} style={styles.previewCard}>
              <View style={styles.previewHeader}>
                <Text style={styles.previewIcon}>👀</Text>
                <Text style={styles.previewTitle}>Preview Koleksi</Text>
              </View>
              <View style={styles.previewContent}>
                <Text style={styles.previewName}>{name}</Text>
                {desc.trim() !== '' && (
                  <Text style={styles.previewDesc}>{desc}</Text>
                )}
              </View>
            </Animated.View>
          )}

          {/* Create Button */}
          <Animated.View entering={FadeInDown.delay(350).duration(600)} style={styles.buttonWrapper}>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={handleCreate}
              disabled={loading}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#3A7DFF', '#5B93FF', '#7DA9FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.createButtonGradient}
              >
                {loading ? (
                  <Text style={styles.createButtonText}>Membuat... ⏳</Text>
                ) : (
                  <>
                    <Text style={styles.createButtonText}>Buat Koleksi</Text>
                    <Text style={styles.createButtonIcon}>🚀</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Tips Card */}
          <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>💭 Tips:</Text>
            <Text style={styles.tipsText}>
              • Buat nama koleksi yang jelas dan mudah diingat{'\n'}
              • Gunakan deskripsi untuk menjelaskan isi koleksi{'\n'}
              • Kamu bisa membuat banyak koleksi sesuai kebutuhan!
            </Text>
          </Animated.View>
        </Animated.View>

        {/* Bottom spacing */}
        <View style={{ height: 30 }} />
      </ScrollView>
    </LinearGradient>
  );
};

export default CreateCollectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Floating emojis
  floatingEmoji: {
    position: "absolute",
    fontSize: 32,
    opacity: 0.25,
    zIndex: 1,
  },
  emoji1: {
    top: height * 0.12,
    left: width * 0.08,
  },
  emoji2: {
    top: height * 0.25,
    right: width * 0.08,
  },
  emoji3: {
    top: height * 0.08,
    right: width * 0.25,
  },

  // Decorative circles
  decorativeCircle: {
    position: "absolute",
    borderRadius: 1000,
    opacity: 0.08,
    zIndex: 0,
  },
  circle1: {
    width: 200,
    height: 200,
    backgroundColor: "#FFE8E8",
    top: height * 0.1,
    left: -60,
  },
  circle2: {
    width: 180,
    height: 180,
    backgroundColor: "#E8F5FF",
    bottom: height * 0.15,
    right: -50,
  },

  scrollContent: {
    padding: 20,
    paddingTop: 30,
  },

  // Header Card
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#3A7DFF',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },

  iconContainer: {
    marginBottom: 16,
  },

  iconBubble: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(58, 125, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(58, 125, 255, 0.2)',
  },

  iconEmoji: {
    fontSize: 42,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  titleEmoji: {
    fontSize: 28,
    marginRight: 8,
  },

  title: {
    fontSize: 26,
    fontFamily: 'FredokaBold',
    color: '#2D2D2D',
  },

  subtitle: {
    fontSize: 15,
    fontFamily: 'Fredoka',
    color: '#777',
    textAlign: 'center',
    lineHeight: 22,
  },

  // Form Card
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },

  // Info Box
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(58, 125, 255, 0.08)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'rgba(58, 125, 255, 0.15)',
  },

  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },

  infoText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Fredoka',
    color: '#555',
    lineHeight: 20,
  },

  // Input
  inputWrapper: {
    marginBottom: 20,
  },

  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  inputEmoji: {
    fontSize: 20,
    marginRight: 8,
  },

  inputLabel: {
    fontSize: 16,
    fontFamily: 'FredokaBold',
    color: '#2D2D2D',
  },

  // Preview Card
  previewCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'rgba(58, 125, 255, 0.2)',
    shadowColor: '#3A7DFF',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  previewIcon: {
    fontSize: 20,
    marginRight: 8,
  },

  previewTitle: {
    fontSize: 15,
    fontFamily: 'FredokaBold',
    color: '#3A7DFF',
  },

  previewContent: {
    paddingLeft: 28,
  },

  previewName: {
    fontSize: 18,
    fontFamily: 'FredokaBold',
    color: '#2D2D2D',
    marginBottom: 6,
  },

  previewDesc: {
    fontSize: 14,
    fontFamily: 'Fredoka',
    color: '#666',
    lineHeight: 20,
  },

  // Button
  buttonWrapper: {
    marginBottom: 20,
  },

  createButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#3A7DFF',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { height: 6, width: 0 },
    elevation: 8,
  },

  createButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },

  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'FredokaBold',
    marginRight: 8,
  },

  createButtonIcon: {
    fontSize: 20,
  },

  // Tips Card
  tipsCard: {
    backgroundColor: 'rgba(255, 244, 224, 0.8)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#FFF4E0',
  },

  tipsTitle: {
    fontSize: 16,
    fontFamily: 'FredokaBold',
    color: '#2D2D2D',
    marginBottom: 8,
  },

  tipsText: {
    fontSize: 13,
    fontFamily: 'Fredoka',
    color: '#666',
    lineHeight: 20,
  },
});