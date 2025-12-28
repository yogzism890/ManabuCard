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
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📁 Buat Koleksi Baru</Text>

      <Input
        label="Nama Koleksi"
        value={name}
        onChangeText={setName}
      />

      <Input
        label="Deskripsi"
        value={desc}
        onChangeText={setDesc}
        multiline
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



//card
import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CreateCardScreen = () => {
  const { apiRequest, isAuthenticated } = useAuth();

  const [collections, setCollections] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [loading, setLoading] = useState(false);

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
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
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

      <Button
        title="Simpan Kartu"
        onPress={handleCreateCard}
        isLoading={loading}
      />
    </View>
  );
};


