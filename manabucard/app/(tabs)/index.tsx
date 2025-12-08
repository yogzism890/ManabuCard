import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { Link } from 'expo-router'; // Penting untuk navigasi ke sesi belajar

// --- Tipe Data ---
interface KoleksiSummary {
  id: string;
  name: string;
  cardCount: number;
  dueToday: number; // Jumlah kartu yang jatuh tempo hari ini
}

// --- KONSTANTA API ---
const API_BASE_URL = 'http://192.168.100.9:3000/api';
const MOCK_AUTH_TOKEN = 'YOUR_AUTH_TOKEN_HERE'; // Ganti dengan token asli

const fetchCollections = async (): Promise<KoleksiSummary[]> => {
  const response = await fetch(`${API_BASE_URL}/koleksi`, {
    headers: { 'Authorization': `Bearer ${MOCK_AUTH_TOKEN}` },
  });
  if (!response.ok) throw new Error('Gagal mengambil koleksi.');
  const data = await response.json();

  // Data sudah termasuk cardCount dan dueToday dari backend
  return data.map((koleksi: any) => ({
    id: koleksi.id,
    name: koleksi.name,
    cardCount: koleksi.cardCount,
    dueToday: koleksi.dueToday,
  }));
};
// ------------------------------

/** Komponen Card untuk setiap Koleksi */
const CollectionCard: React.FC<{ koleksi: KoleksiSummary }> = ({ koleksi }) => {
  const isDue = koleksi.dueToday > 0;

  return (
    // Gunakan <Link> untuk navigasi ke rute dinamis study/[id].tsx
    <Link href={`/study/${koleksi.id}`} asChild>
      <TouchableOpacity style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardName}>{koleksi.name}</Text>
          {/* Tampilkan tag jika ada kartu yang jatuh tempo */}
          {isDue && (
            <View style={styles.dueTag}>
              <Text style={styles.dueText}>{koleksi.dueToday} Due</Text>
            </View>
          )}
        </View>
        <Text style={styles.cardInfo}>{koleksi.cardCount} total cards</Text>
        
        {/* Pesan Aksi */}
        <Text style={[styles.cardAction, isDue ? styles.cardActionDue : {}]}>
            {isDue ? 'START REVIEW NOW →' : 'Review Finished / Start New Session →'}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};


const StudyHomeScreen = () => {
  const [collections, setCollections] = useState<KoleksiSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadCollections = async () => {
    try {
      const data = await fetchCollections();
      setCollections(data);
    } catch (error) {
      console.error("Failed to load collections:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadCollections();
  }, []);
  
  const onRefresh = () => {
    setIsRefreshing(true);
    loadCollections();
  }

  if (isLoading && !isRefreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={{ marginTop: 10 }}>Loading collections...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={collections}
        renderItem={({ item }) => <CollectionCard koleksi={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
            <RefreshControl 
                refreshing={isRefreshing} 
                onRefresh={onRefresh} 
                tintColor="#3498db"
            />
        }
        ListEmptyComponent={
            <Text style={styles.emptyText}>
                Belum ada koleksi. Buat koleksi baru di tab "Buat"!
            </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6c757d',
  },
  listContent: {
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    borderLeftWidth: 6,
    borderLeftColor: '#3498db',
    borderRightWidth: 1,
    borderRightColor: '#e9ecef',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  cardInfo: {
    fontSize: 15,
    color: '#6c757d',
    marginBottom: 12,
    fontWeight: '500',
  },
  cardAction: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3498db',
    marginTop: 8,
  },
  cardActionDue: {
    color: '#e74c3c',
  },
  dueTag: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 10,
  },
  dueText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 60,
    color: '#dee2e6',
    marginBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#6c757d',
    marginBottom: 10,
    fontWeight: '500',
  },
  emptySubtext: {
    textAlign: 'center',
    fontSize: 14,
    color: '#adb5bd',
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#3498db',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  }
});

export default StudyHomeScreen;