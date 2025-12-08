import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />   {/* tampil pertama kali */}
      <Stack.Screen name="(tabs)" />    {/* berisi Home, Quiz, dst */}
      <Stack.Screen name="auth/login" />     {/* untuk login nanti */}
      <Stack.Screen name="onboarding/index" />
    </Stack>
  );
}
