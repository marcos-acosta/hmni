import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/lib/auth-context';
import { LogStickerProvider } from '@/lib/log-sticker-context';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <LogStickerProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="design/[id]" options={{ title: 'Design' }} />
            <Stack.Screen name="sticker/[id]" options={{ title: 'Sticker' }} />
            <Stack.Screen name="user/[id]" options={{ title: 'User' }} />
            <Stack.Screen name="log/camera" options={{ title: 'Take Photo' }} />
            <Stack.Screen name="log/match-design" options={{ title: 'Match Design' }} />
            <Stack.Screen name="log/new-design" options={{ title: 'New Design' }} />
            <Stack.Screen name="log/match-sticker" options={{ title: 'Match Sticker' }} />
            <Stack.Screen name="log/note" options={{ title: 'Add Note' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </LogStickerProvider>
    </AuthProvider>
  );
}
