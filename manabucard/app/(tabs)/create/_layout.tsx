import { Stack } from 'expo-router';

export default function CreateLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="collection"
        options={{ title: 'Buat Koleksi' }}
      />
      <Stack.Screen
        name="card"
        options={{ title: 'Buat Kartu' }}
      />
    </Stack>
  );
}
