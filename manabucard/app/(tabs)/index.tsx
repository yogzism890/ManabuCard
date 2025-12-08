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

  // Hitung cardCount dan dueToday untuk setiap koleksi
  const collectionsWithStats = await Promise.all(
    data.map(async (koleksi: any) => {
      const cardsResponse = await fetch(`${API_BASE_URL}/kartu?koleksiId=${koleksi.id}`, {
        headers: { 'Authorization': `Bearer ${MOCK_AUTH_TOKEN}` },
      });
      const cards = cardsResponse.ok ? await cardsResponse.json() : [];
      const now = new Date();
      const dueToday = cards.filter((card: any) => new Date(card.reviewDueAt) <= now).length;
      return {
        id: koleksi.id,
        name: koleksi.nama,
        cardCount: cards.length,
        dueToday,
      };
    })
  );

  return collectionsWithStats;
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
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 15,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#3498db', // Garis biru menarik
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  cardInfo: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  cardAction: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3498db',
    marginTop: 5,
  },
  cardActionDue: {
    color: '#e74c3c', // Merah jika ada yang jatuh tempo
  },
  dueTag: {
    backgroundColor: '#e74c3c',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  dueText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#7f8c8d',
  }
});

export default StudyHomeScreen;