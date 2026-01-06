import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import { 
  useFonts, 
  Poppins_400Regular, 
  Poppins_600SemiBold, 
  Poppins_700Bold 
} from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";

// Mencegah splash screen tertutup otomatis sebelum font selesai dimuat
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Sembunyikan splash screen setelah font siap atau jika terjadi error
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Jika font belum dimuat dan tidak ada error, jangan tampilkan apa-apa dulu
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcome" />   {/* tampil pertama kali */}
        <Stack.Screen name="(tabs)" />    {/* berisi Home, Quiz, dst */}
        <Stack.Screen name="auth/login" />     {/* untuk login nanti */}
        <Stack.Screen name="onboarding/index" />
      </Stack>
    </AuthProvider>
  );
}