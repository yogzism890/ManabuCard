import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary' | 'srs_easy' | 'srs_hard'; // Variasi gaya
  isLoading?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  variant = 'primary', 
  isLoading = false,
  disabled = false,
}) => {
  const buttonStyles = [
    styles.button,
    styles[variant],
    style,
    (disabled || isLoading) && styles.disabled,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.text, styles[`${variant}Text`], textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  // --- Variants ---
  primary: {
    backgroundColor: '#3498db', // Biru primer
  },
  secondary: {
    backgroundColor: '#95a5a6', // Abu-abu
  },
  srs_easy: {
    backgroundColor: '#2ecc71', // Hijau (Easy)
  },
  srs_hard: {
    backgroundColor: '#e74c3c', // Merah (Hard)
  },
  // --- Text Styles ---
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  primaryText: { color: '#fff' },
  secondaryText: { color: '#fff' },
  srs_easyText: { color: '#fff' },
  srs_hardText: { color: '#fff' },
  // --- Disabled State ---
  disabled: {
    opacity: 0.6,
  },
});

export default Button;