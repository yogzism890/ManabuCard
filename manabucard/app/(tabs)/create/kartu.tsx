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


  return <View></View>;
};