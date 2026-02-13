import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useLogSticker } from '@/lib/log-sticker-context';

export default function LogScreen() {
  const insets = useSafeAreaInsets();
  const { reset } = useLogSticker();

  function handleStart() {
    reset();
    router.push('/log/camera');
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ThemedText type="title" style={styles.heading}>
        Log a Sticker
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Photograph a sticker you spotted in the wild, match it to a design, and add it to the map.
      </ThemedText>
      <Pressable style={styles.button} onPress={handleStart}>
        <ThemedText style={styles.buttonText}>Log a Sticker</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  heading: { marginBottom: 12 },
  subtitle: { textAlign: 'center', opacity: 0.6, marginBottom: 32 },
  button: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
  },
});
