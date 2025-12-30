import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { router } from 'expo-router';


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
    <View style={styles.container}>
      <Text style={styles.title}>📁 Buat Koleksi Baru</Text>

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
      />

      <Input
        label="Deskripsi"
        value={desc}
        onChangeText={setDesc}
        multiline
        placeholder="(Opsional)"
      />

      <Button
        title="Buat Koleksi"
        onPress={handleCreate}
        isLoading={loading}
      />
    </View>
  );
};

export default CreateCollectionScreen;

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
});