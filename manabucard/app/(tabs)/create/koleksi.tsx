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
