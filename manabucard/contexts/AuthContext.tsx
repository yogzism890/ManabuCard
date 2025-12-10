import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/apiConfig';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  apiRequest: (endpoint: string, options?: RequestInit) => Promise<any>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load stored auth data on app start
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('auth_token');
        const storedUser = await AsyncStorage.getItem('auth_user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading stored auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    // Temporary mock authentication for testing
    if (email === 'dummy@example.com' && password === 'password123') {
      const mockUser = { id: 'dummy-user-1', email: 'dummy@example.com' };
      const mockToken = 'mock-jwt-token-for-testing';

      setToken(mockToken);
      setUser(mockUser);
      await AsyncStorage.setItem('auth_token', mockToken);
      await AsyncStorage.setItem('auth_user', JSON.stringify(mockUser));

      return { success: true, message: 'Login berhasil!' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return { success: false, message: `Login gagal: ${response.status} ${response.statusText}` };
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return { success: false, message: 'Server mengembalikan respons yang tidak valid' };
      }

      const data = await response.json();

      if (data.token) {
        // Store auth data
        await AsyncStorage.setItem('auth_token', data.token);
        await AsyncStorage.setItem('auth_user', JSON.stringify(data.user));

        setToken(data.token);
        setUser(data.user);

        return { success: true, message: data.message || 'Login berhasil' };
      } else {
        return { success: false, message: data.error || 'Login gagal' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Terjadi kesalahan koneksi' };
    }
  };

  const register = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return { success: false, message: `Registrasi gagal: ${response.status} ${response.statusText}` };
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return { success: false, message: 'Server mengembalikan respons yang tidak valid' };
      }

      const data = await response.json();

      if (data.success) {
        return { success: true, message: data.message || 'Registrasi berhasil' };
      } else {
        return { success: false, message: data.message || 'Registrasi gagal' };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: 'Terjadi kesalahan koneksi' };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('auth_user');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
    // Mock API responses for testing
    if (endpoint === '/koleksi') {
      return [
        {
          id: 'sample-collection-1',
          nama: 'Sample Collection',
          deskripsi: 'A sample collection for testing',
          createdAt: new Date().toISOString(),
        }
      ];
    }

    if (endpoint.startsWith('/koleksi/') && endpoint.endsWith('/kartu')) {
      const collectionId = endpoint.split('/')[2];
      return [
        {
          id: 'card-1',
          front: 'Hello',
          back: 'Halo',
          difficulty: 1,
          reviewDueAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        {
          id: 'card-2',
          front: 'Thank you',
          back: 'Terima kasih',
          difficulty: 1,
          reviewDueAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        {
          id: 'card-3',
          front: 'Good morning',
          back: 'Selamat pagi',
          difficulty: 2,
          reviewDueAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        {
          id: 'card-4',
          front: 'Goodbye',
          back: 'Selamat tinggal',
          difficulty: 1,
          reviewDueAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        {
          id: 'card-5',
          front: 'How are you?',
          back: 'Apa kabar?',
          difficulty: 2,
          reviewDueAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
      ];
    }

    const headers: any = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    apiRequest,
    isAuthenticated: !!token && !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
