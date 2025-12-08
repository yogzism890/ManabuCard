import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import Button from '../../components/ui/Button';

const WelcomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Selamat Datang di ManabuCard</Text>
        <Text style={styles.subtitle}>Aplikasi Belajar Kartu Pintar</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          ManabuCard membantu Anda belajar dengan sistem kartu pintar (flashcards) yang efektif.
          Buat koleksi kartu Anda sendiri dan mulai belajar kapan saja!
        </Text>

        <View style={styles.features}>
          <Text style={styles.featureTitle}>Fitur Utama:</Text>
          <Text style={styles.feature}>• Buat dan kelola koleksi kartu</Text>
          <Text style={styles.feature}>• Sistem ulangan berbasis interval</Text>
          <Text style={styles.feature}>• Pelacakan kemajuan belajar</Text>
          <Text style={styles.feature}>• Antarmuka yang mudah digunakan</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Link href="/(tabs)/create" asChild>
          <TouchableOpacity>
            <Button title="Mulai Membuat Kartu" onPress={() => {}} />
          </TouchableOpacity>
        </Link>

        <Link href="/(tabs)" asChild>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Lihat Koleksi Saya</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  content: {
    marginBottom: 40,
  },
  description: {
    fontSize: 16,
    color: '#34495e',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  features: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  feature: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 8,
    lineHeight: 22,
  },
  actions: {
    gap: 15,
  },
  secondaryButton: {
    backgroundColor: '#ecf0f1',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;
