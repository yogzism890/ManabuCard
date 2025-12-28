import React, { useEffect, useState } from 'react';


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

  return <View></View>;
};