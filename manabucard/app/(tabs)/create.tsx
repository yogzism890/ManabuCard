import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
    TouchableOpacity,
    Modal,
    FlatList
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../contexts/AuthContext';


// Import komponen UI
import Button from '../../components/ui/Button'; 
import Input from '../../components/ui/Input';

// --- Tipe Data ---
interface Koleksi {
    id: string;
    name: string;
    cardCount: number;
    dueToday: number;
}

interface ApiKoleksi {
    id: string;
    name: string;
    cardCount: number;
    dueToday: number;
}

const CreateScreen = () => {
    const { apiRequest, isAuthenticated } = useAuth();

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

    // State Modal
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Fungsi untuk memuat koleksi
    const loadCollections = useCallback(async () => {
        if (!isAuthenticated) return;
        
        setIsCollectionsLoading(true);
        try {
            console.log('Loading collections...');
            const data = await apiRequest('/koleksi');
            console.log('Collections data:', data);
            
            if (Array.isArray(data)) {
                const formattedData = data.map((item: any) => ({
                    id: item.id,
                    name: item.name || item.nama,
                    cardCount: item.cardCount || 0,
                    dueToday: item.dueToday || 0
                }));
                
                setCollections(formattedData);
                
                if (formattedData.length > 0 && !selectedCollectionId) {
                    setSelectedCollectionId(formattedData[0].id);
                }
            } else {
                console.error('Expected array but got:', typeof data);
                setCollections([]);
            }
        } catch (e) {
            console.error('Error loading collections:', e);
            Alert.alert("Error", e instanceof Error ? e.message : "Gagal memuat koleksi.");
        } finally {
            setIsCollectionsLoading(false);
        }
    }, [selectedCollectionId, apiRequest, isAuthenticated]);

    // Muat saat komponen pertama kali dirender
    useEffect(() => {
        if (isAuthenticated) {
            loadCollections();
        }
    }, [loadCollections, isAuthenticated]);

    // --- HANDLER INTEGRASI API ---

    const handleCreateCollection = async () => {
        if (!isAuthenticated) {
            Alert.alert("Error", "Anda belum login. Silakan login terlebih dahulu.");
            return;
        }

        if (newCollectionName.trim() === '') {
            Alert.alert("Perhatian", "Nama Koleksi wajib diisi!");
            return;
        }
        
        setIsPosting(true);
        try {
            console.log('Creating collection:', { nama: newCollectionName, deskripsi: collectionDesc });
            
            const response = await apiRequest('/koleksi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nama: newCollectionName,
                    deskripsi: collectionDesc,
                }),
            });
            
            console.log('Collection created successfully:', response);
            
            Alert.alert("Sukses!", `Koleksi "${newCollectionName}" berhasil dibuat.`);
            
            // Reset form dan refresh daftar
            setNewCollectionName('');
            setCollectionDesc('');
            await loadCollections();
            
        } catch (e) {
            console.error('Error creating collection:', e);
            Alert.alert("Error", e instanceof Error ? e.message : "Gagal membuat koleksi.");
        } finally {
            setIsPosting(false);
        }
    };

    const handleCreateCard = async () => {
        if (!isAuthenticated) {
            Alert.alert("Error", "Anda belum login. Silakan login terlebih dahulu.");
            return;
        }

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
            console.log('Creating card:', { 
                koleksiId: selectedCollectionId, 
                front: cardFront, 
                back: cardBack 
            });
            
            const response = await apiRequest('/kartu', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    koleksiId: selectedCollectionId, 
                    front: cardFront, 
                    back: cardBack 
                }),
            });
            
            console.log('Card created successfully:', response);
            Alert.alert("Sukses!", "Kartu baru berhasil ditambahkan.");

            // Reset form kartu
            setCardFront('');
            setCardBack('');
            
        } catch (e) {
            console.error('Error creating card:', e);
            Alert.alert("Error", e instanceof Error ? e.message : "Gagal membuat kartu.");
        } finally {
            setIsPosting(false);
        }
    };
    
    // Temukan nama koleksi yang dipilih untuk ditampilkan
    const selectedCollectionName = collections.find(c => c.id === selectedCollectionId)?.name;

    // --- TAMPILAN ---
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.container}>

                {/* Header Section */}
                <View style={styles.headerSection}>
                    <View style={styles.headerIcon}>
                        <Text style={styles.headerIconText}>📚</Text>
                    </View>
                    <Text style={styles.headerTitle}>Buat Konten Belajar</Text>
                    <Text style={styles.headerSubtitle}>
                        Mulai dengan membuat koleksi kartu pintar Anda
                    </Text>
                    {!isAuthenticated && (
                        <View style={styles.warningBox}>
                            <Text style={styles.warningText}>
                                ⚠️ Anda belum login. Silakan login terlebih dahulu untuk menggunakan fitur ini.
                            </Text>
                        </View>
                    )}
                </View>

                {/* --- Bagian 1: Buat Koleksi Baru --- */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionIcon}>📁</Text>
                        <Text style={styles.sectionTitle}>Koleksi Baru</Text>
                    </View>
                    <Text style={styles.sectionDescription}>
                        Buat wadah untuk mengorganisir kartu-kartu belajar Anda
                    </Text>

                    <View style={styles.formContainer}>
                        <Input
                            label="Nama Koleksi"
                            placeholder="Contoh: Vocabulary Harian"
                            value={newCollectionName}
                            onChangeText={setNewCollectionName}
                            editable={!isPosting && isAuthenticated}
                        />
                        <Input
                            label="Deskripsi (Opsional)"
                            placeholder="Kumpulan kata kerja dasar..."
                            value={collectionDesc}
                            onChangeText={setCollectionDesc}
                            multiline
                            editable={!isPosting && isAuthenticated}
                        />
                        <Button
                            title="Buat Koleksi"
                            onPress={handleCreateCollection}
                            style={styles.primaryButton}
                            isLoading={isPosting}
                            disabled={!isAuthenticated || isPosting}
                        />
                    </View>
                </View>

                <View style={styles.separator} />

                {/* --- Bagian 2: Buat Kartu Baru --- */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionIcon}>🃏</Text>
                        <Text style={styles.sectionTitle}>Kartu Baru</Text>
                    </View>
                    <Text style={styles.sectionDescription}>
                        Tambahkan kartu belajar baru ke dalam koleksi Anda
                    </Text>

                    {/* Implementasi Pilihan Koleksi */}
                    <Text style={styles.label}>Pilih Koleksi Target:</Text>
                    {!isAuthenticated ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>🔒</Text>
                            <Text style={styles.emptyText}>Login Diperlukan</Text>
                            <Text style={styles.emptySubtext}>
                                Anda harus login untuk melihat dan memilih koleksi
                            </Text>
                        </View>
                    ) : isCollectionsLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="small" color="#3498db" />
                            <Text style={styles.loadingText}>Memuat koleksi...</Text>
                        </View>
                    ) : collections.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>📁</Text>
                            <Text style={styles.emptyText}>Belum ada koleksi</Text>
                            <Text style={styles.emptySubtext}>
                                Buat koleksi terlebih dahulu untuk menambahkan kartu
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.collectionPicker}>
                            <Picker
                                selectedValue={selectedCollectionId}
                                onValueChange={(itemValue: string) => setSelectedCollectionId(itemValue)}
                                style={{ color: '#3498db', fontWeight: 'bold' }}
                                enabled={isAuthenticated && !isPosting}
                            >
                                <Picker.Item label="PILIH KOLEKSI..." value="" />
                                {collections.map((collection) => (
                                    <Picker.Item
                                        key={collection.id}
                                        label={`${collection.name} (${collection.cardCount} kartu)`}
                                        value={collection.id}
                                    />
                                ))}
                            </Picker>
                        </View>
                    )}

                    <View style={styles.formContainer}>
                        <Input
                            label="Sisi Depan (Front)"
                            placeholder="Contoh: To hesitate"
                            value={cardFront}
                            onChangeText={setCardFront}
                            editable={!isPosting && isAuthenticated}
                        />
                        <Input
                            label="Sisi Belakang (Back)"
                            placeholder="Contoh: Ragu-ragu / Definition"
                            value={cardBack}
                            onChangeText={setCardBack}
                            multiline
                            numberOfLines={4}
                            editable={!isPosting && isAuthenticated}
                        />

                        <Button
                            title="Simpan Kartu"
                            onPress={handleCreateCard}
                            variant="secondary"
                            isLoading={isPosting}
                            disabled={collections.length === 0 || !isAuthenticated || isPosting}
                            style={styles.secondaryButton}
                        />
                    </View>
                </View>
            </ScrollView>

            {/* Modal untuk memilih koleksi */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeader}>Pilih Koleksi</Text>
                        <FlatList
                            data={collections}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() => {
                                        setSelectedCollectionId(item.id);
                                        setIsModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.modalItemText}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <Button
                            title="Tutup"
                            onPress={() => setIsModalVisible(false)}
                            style={styles.modalCloseButton}
                        />
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 30,
        paddingVertical: 20,
    },
    headerIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#3498db',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#3498db',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    headerIconText: {
        fontSize: 40,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2c3e50',
        textAlign: 'center',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#7f8c8d',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    warningBox: {
        marginTop: 15,
        padding: 12,
        backgroundColor: '#fff3cd',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ffeaa7',
    },
    warningText: {
        fontSize: 14,
        color: '#856404',
        textAlign: 'center',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionIcon: {
        fontSize: 24,
        marginRight: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    sectionDescription: {
        fontSize: 14,
        color: '#7f8c8d',
        lineHeight: 20,
        marginBottom: 20,
    },
    formContainer: {
        gap: 15,
    },
    primaryButton: {
        marginTop: 10,
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 14,
        color: '#7f8c8d',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        marginBottom: 15,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 10,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 5,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#7f8c8d',
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 20,
    },
    secondaryButton: {
        marginTop: 15,
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
    separator: {
        height: 1,
        backgroundColor: '#ecf0f1',
        marginVertical: 10,
        marginHorizontal: -20,
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
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        maxHeight: '60%',
    },
    modalHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ecf0f1',
    },
    modalItemText: {
        fontSize: 16,
        color: '#34495e',
    },
    modalCloseButton: {
        marginTop: 15,
    }
});

export default CreateScreen;
