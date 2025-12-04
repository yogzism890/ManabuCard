import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';

// Import komponen UI yang sudah Anda buat
import Button from '../../components/ui/Button'; 
import Input from '../../components/ui/Input';

// Asumsi: Di sini Anda akan menggunakan state untuk menyimpan data form.
// Saat backend diaktifkan, Anda akan memanggil API POST untuk menyimpan data.

const CreateScreen = () => {
  // State untuk Koleksi Baru
  const [newCollectionName, setNewCollectionName] = useState('');
  const [collectionDesc, setCollectionDesc] = useState('');
  
  // State untuk Kartu Baru
  const [cardFront, setCardFront] = useState('');
  const [cardBack, setCardBack] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState(''); // ID koleksi yang dipilih

  const handleCreateCollection = () => {
    if (newCollectionName.trim() === '') {
      alert("Nama Koleksi wajib diisi!");
      return;
    }
    
    // --- LATER: Panggil API POST /api/koleksi di sini ---
    console.log(`Membuat Koleksi Baru: ${newCollectionName} - ${collectionDesc}`);
    // Setelah sukses, mungkin reset state dan beri notifikasi
  };

  const handleCreateCard = () => {
    if (cardFront.trim() === '' || cardBack.trim() === '') {
      alert("Sisi depan dan belakang kartu wajib diisi!");
      return;
    }
    
    // --- LATER: Panggil API POST /api/kartu di sini ---
    console.log(`Membuat Kartu: ${cardFront} -> ${cardBack} (untuk Koleksi: ${selectedCollectionId || 'Default'})`);
    // Setelah sukses, reset state kartu
    setCardFront('');
    setCardBack('');
  };

  // ASUMSI: Daftar koleksi saat ini (ganti dengan data API sungguhan nanti)
  const mockCollections = [
    { id: '1', name: 'Daily Verbs' },
    { id: '2', name: 'IT Terms' },
    // Anda akan fetch data ini dari API /api/koleksi di fase backend
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* --- Bagian 1: Buat Koleksi Baru --- */}
        <View style={styles.section}>
          <Text style={styles.header}>Tambahkan Koleksi Baru</Text>
          <Input 
            label="Nama Koleksi" 
            placeholder="Contoh: Vocabulary Harian"
            value={newCollectionName}
            onChangeText={setNewCollectionName}
          />
          <Input 
            label="Deskripsi (Opsional)" 
            placeholder="Kumpulan kata kerja dasar..."
            value={collectionDesc}
            onChangeText={setCollectionDesc}
            multiline
          />
          <Button 
            title="Buat Koleksi" 
            onPress={handleCreateCollection} 
            style={styles.buttonSpacing}
          />
        </View>

        <View style={styles.separator} />

        {/* --- Bagian 2: Buat Kartu Baru --- */}
        <View style={styles.section}>
          <Text style={styles.header}>Tambahkan Kartu ke Koleksi</Text>

          {/* SEMENTARA: Anda bisa mengganti ini dengan komponen Picker/Dropdown */}
          <Text style={styles.label}>Pilih Koleksi Target:</Text>
          <View style={styles.collectionPicker}>
            <Text style={{color: '#3498db'}}>
              {mockCollections.find(c => c.id === selectedCollectionId)?.name || 'Pilih Koleksi...'}
            </Text>
          </View>
          
          <Input 
            label="Sisi Depan (Front)" 
            placeholder="Contoh: To hesitate"
            value={cardFront}
            onChangeText={setCardFront}
          />
          <Input 
            label="Sisi Belakang (Back)" 
            placeholder="Contoh: Ragu-ragu / Definition"
            value={cardBack}
            onChangeText={setCardBack}
            multiline
            numberOfLines={4}
          />
          
          <Button 
            title="Simpan Kartu" 
            onPress={handleCreateCard} 
            variant="secondary"
            isLoading={false}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  section: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  separator: {
    height: 1,
    backgroundColor: '#ecf0f1',
    marginVertical: 10,
    marginHorizontal: -20, // Memperluas pemisah
  },
  buttonSpacing: {
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 5,
    fontWeight: '500',
  },
  collectionPicker: {
    borderWidth: 1,
    borderColor: '#3498db',
    borderRadius: 6,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    backgroundColor: '#ecf0f1',
  }
});

export default CreateScreen;