import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';


const CreateCollectionScreen = ({ navigation }: any) => {
  const { apiRequest, isAuthenticated } = useAuth();

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!isAuthenticated) {
      Alert.alert("Error", "Silakan login terlebih dahulu");
      return;
    }

    if (!name.trim()) {
      Alert.alert("Perhatian", "Nama koleksi wajib diisi");
      return;
    }

    setLoading(true);
    try {
      await apiRequest('/koleksi', {
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

      // pindah ke halaman buat kartu
      navigation.navigate('CreateCard');

    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

