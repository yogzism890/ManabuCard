import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { useLocalSearchParams, router } from 'expo-router';
const CreateCardScreen = () => {
  const { apiRequest, isAuthenticated } = useAuth();
  const [collections, setCollections] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasAddedCard, setHasAddedCard] = useState(false);
  const [error, setError] = useState<{
    nama: boolean;
  }>({
    nama: false,
  });


  const { collectionId, collectionName } = useLocalSearchParams();
  useEffect(() => {
    if (collectionId) {
      setSelectedId(collectionId as string);
    }
  }, [collectionId]);



  useEffect(() => {
    const load = async () => {
      const data = await apiRequest('/koleksi');
      setCollections(data);
    };
    if (isAuthenticated) load();
  }, [isAuthenticated]);

  const handleCreateCard = async () => {
    if (!selectedId || !front || !back) {
      Alert.alert("Lengkapi data");
      return;
    }

    setLoading(true);
    try {
      await apiRequest('/kartu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          koleksiId: selectedId,
          front,
          back,
        }),
      });

      Alert.alert("Sukses", "Kartu berhasil ditambahkan");

      setFront('');
      setBack('');

      setHasAddedCard(true);

    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };


  const handleFinish = () => {
    // reset form
    setFront('');
    setBack('');
    setSelectedId('');

    // balik ke halaman buat koleksi (fresh)
    router.replace('/create/collection');
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>🃏 Buat Kartu Baru</Text>

      <Picker selectedValue={selectedId} onValueChange={setSelectedId}>
        <Picker.Item label="Pilih Koleksi" value="" />
        {collections.map(c => (
          <Picker.Item key={c.id} label={c.name} value={c.id} />
        ))}
      </Picker>

      <Input label="Front" value={front} onChangeText={setFront} />
      <Input label="Back" value={back} onChangeText={setBack} multiline />

      <View style={styles.buttonGroup}>
        <Button
          title="Simpan Kartu"
          onPress={handleCreateCard}
          isLoading={loading}
        />

        {hasAddedCard && (
          <Button
            title="Selesai"
            onPress={handleFinish}
            style={styles.finishButton}
            textStyle={styles.finishButtonText}
          />
        )}
      </View>


    </View>
  );
};

export default CreateCardScreen;

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },

  buttonGroup: {
    marginTop: 20,
    gap: 14,
  },

  finishButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#3498db',
  },

  finishButtonText: {
    color: '#3498db',
    fontWeight: 'bold',
  },


});
