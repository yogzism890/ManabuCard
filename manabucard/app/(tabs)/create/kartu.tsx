

const CreateCardScreen = () => {
  const { apiRequest, isAuthenticated } = useAuth();

  const [collections, setCollections] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [loading, setLoading] = useState(false);

  return <View></View>;
};