import React, { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    KeyboardAvoidingView, 
    Platform,
    Alert, // Diperlukan untuk notifikasi
    ActivityIndicator // Diperlukan untuk loading state
} from 'react-native';

// Import komponen UI yang sudah Anda buat
import Button from '../../components/ui/Button'; 
import Input from '../../components/ui/Input';

// --- KONSTANTA API (DIBIARKAN SAMA) ---
const API_BASE_URL = 'http://192.168.100.9:3000/api'; 
const MOCK_AUTH_TOKEN = 'YOUR_AUTH_TOKEN_HERE'; 
// MOCK_USER_ID tidak diperlukan jika backend Anda mengambil userId dari token

// --- Tipe Data ---
interface Koleksi {
  id: string;
  nama: string;
}

// ----------------------------------------------------
// FUNGSI API (DIBIARKAN SAMA, HANYA DITEMPATKAN DI ATAS KOMPONEN)
// ----------------------------------------------------

async function fetchUserCollections(): Promise<Koleksi[]> {
    const response = await fetch(`${API_BASE_URL}/koleksi`, {
        headers: { 'Authorization': `Bearer ${MOCK_AUTH_TOKEN}` },
    });
    if (!response.ok) throw new Error('Gagal mengambil daftar koleksi.');
    const data = await response.json();
    return data.map((item: any) => ({ id: item.id, nama: item.name }));
}

async function postNewCollection(nama: string): Promise<Koleksi> {
    const response = await fetch(`${API_BASE_URL}/koleksi`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${MOCK_AUTH_TOKEN}`,
        },
        body: JSON.stringify({ 
            nama: nama, 
            // Deskripsi tidak dikirim karena tidak ada di skema Prisma yang Anda berikan
        }),
    });
    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: 'No error body' }));
        throw new Error(`Gagal membuat koleksi. Status: ${response.status}. Pesan: ${errorBody.message}`);
    }
    return response.json();
}

async function postNewCard(koleksiId: string, front: string, back: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/kartu`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${MOCK_AUTH_TOKEN}`,
        },
        body: JSON.stringify({ koleksiId, front, back }),
    });
    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: 'No error body' }));
        throw new Error(`Gagal membuat kartu. Status: ${response.status}. Pesan: ${errorBody.message}`);
    }
}
// ----------------------------------------------------


const CreateScreen = () => {
    // State Data
    const [collections, setCollections] = useState<Koleksi[]>([]); 
    const [selectedCollectionId, setSelectedCollectionId] = useState(''); 
    
    // State Form
    const [newCollectionName, setNewCollectionName] = useState('');
    const [collectionDesc, setCollectionDesc] = useState('');
    const [cardFront, setCardFront] = useState('');
    const [cardBack, setCardBack] = useState('');

    // State Loading
    const [isCollectionsLoading, setIsCollectionsLoading] = useState(true);
    const [isPosting, setIsPosting] = useState(false);

    // Fungsi untuk memuat koleksi
    const loadCollections = useCallback(async () => {
        setIsCollectionsLoading(true);
        try {
            const data = await fetchUserCollections();
            setCollections(data);
            if (data.length > 0 && !selectedCollectionId) {
                // Set default selection ke koleksi pertama jika belum ada yang terpilih
                setSelectedCollectionId(data[0].id); 
            }
        } catch (e) {
            console.error(e);
            Alert.alert("Error", e instanceof Error ? e.message : "Gagal memuat koleksi.");
        } finally {
            setIsCollectionsLoading(false);
        }
    }, [selectedCollectionId]);

    // Muat saat komponen pertama kali dirender
    useEffect(() => {
        loadCollections();
    }, [loadCollections]);


    // --- HANDLER INTEGRASI API ---

    const handleCreateCollection = async () => {
        if (newCollectionName.trim() === '') {
            Alert.alert("Perhatian", "Nama Koleksi wajib diisi!");
            return;
        }
        setIsPosting(true);
        try {
            await postNewCollection(newCollectionName); // Deskripsi diabaikan (karena tidak ada di skema Anda)
            Alert.alert("Sukses!", `Koleksi "${newCollectionName}" berhasil dibuat.`);
            
            // Refresh daftar koleksi dan reset form
            setNewCollectionName('');
            setCollectionDesc('');
            await loadCollections(); // Muat ulang daftar koleksi
        } catch (e) {
            Alert.alert("Error", e instanceof Error ? e.message : "Gagal membuat koleksi.");
        } finally {
            setIsPosting(false);
        }
    };

    const handleCreateCard = async () => {
        if (!selectedCollectionId) {
            Alert.alert("Perhatian", "Pilih Koleksi target terlebih dahulu.");
            return;
        }
        if (cardFront.trim() === '' || cardBack.trim() === '') {
            Alert.alert("Perhatian", "Sisi depan dan belakang kartu wajib diisi!");
            return;
        }
        setIsPosting(true);
        try {
            await postNewCard(selectedCollectionId, cardFront, cardBack);
            Alert.alert("Sukses!", "Kartu baru berhasil ditambahkan.");

            // Reset form kartu
            setCardFront('');
            setCardBack('');
        } catch (e) {
            Alert.alert("Error", e instanceof Error ? e.message : "Gagal membuat kartu.");
        } finally {
            setIsPosting(false);
        }
    };
    
    // Temukan nama koleksi yang dipilih untuk ditampilkan (jika ada)
    const selectedCollectionName = collections.find(c => c.id === selectedCollectionId)?.nama;

    // --- TAMPILAN ---
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
                        isLoading={isPosting} // Gunakan state loading
                    />
                </View>

                <View style={styles.separator} />

                {/* --- Bagian 2: Buat Kartu Baru --- */}
                <View style={styles.section}>
                    <Text style={styles.header}>Tambahkan Kartu ke Koleksi</Text>

                    {/* Implementasi Pilihan Koleksi (Masih sederhana) */}
                    <Text style={styles.label}>Pilih Koleksi Target:</Text>
                    {isCollectionsLoading ? (
                         <ActivityIndicator size="small" color="#3498db" />
                    ) : collections.length === 0 ? (
                        <Text style={{ color: '#e74c3c' }}>Harap buat Koleksi terlebih dahulu.</Text>
                    ) : (
                        // Ganti ini dengan Picker/Dropdown di aplikasi nyata. Untuk saat ini, hanya menampilkan yang terpilih.
                        <TouchableOpacity 
                            onPress={() => Alert.alert("Pilih Koleksi", "Di sini akan ada komponen Dropdown atau Modal Picker.")}
                            style={styles.collectionPicker}
                        >
                            <Text style={{color: '#3498db', fontWeight: 'bold'}}>
                                {selectedCollectionName || 'PILIH KOLEKSI...'}
                            </Text>
                        </TouchableOpacity>
                    )}
                    
                    <Input 
                        label="Sisi Depan (Front)" 
                        placeholder="Contoh: To hesitate"
                        value={cardFront}
                        onChangeText={setCardFront}
                        editable={!isPosting}
                    />
                    <Input 
                        label="Sisi Belakang (Back)" 
                        placeholder="Contoh: Ragu-ragu / Definition"
                        value={cardBack}
                        onChangeText={setCardBack}
                        multiline
                        numberOfLines={4}
                        editable={!isPosting}
                    />
                    
                    <Button 
                        title="Simpan Kartu" 
                        onPress={handleCreateCard} 
                        variant="secondary"
                        isLoading={isPosting}
                        disabled={collections.length === 0 || isPosting}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

// ... (Stylesheets tetap sama) ...
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
        marginHorizontal: -20,
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
        borderColor: '#bdc3c7',
        borderRadius: 6,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
    }
});

export default CreateScreen;