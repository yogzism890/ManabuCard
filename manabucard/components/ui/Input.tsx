import React from 'react';
import { TextInput, StyleSheet, View, Text, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, style, ...rest }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, style, error && styles.errorBorder]}
        placeholderTextColor="#95a5a6"
        {...rest}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 6,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: '#2c3e50',
    backgroundColor: '#fff',
  },
  errorBorder: {
    borderColor: '#e74c3c', // Merah untuk error
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;