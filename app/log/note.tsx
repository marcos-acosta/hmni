import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@/lib/auth-context';
import { useLogSticker } from '@/lib/log-sticker-context';
import { getDesignById } from '@/lib/mock-data';

export default function NoteScreen() {
  const { photoUri, designId, newDesignName, note, setNote, submit } = useLogSticker();
  const { user } = useAuth();
  const textColor = useThemeColor({}, 'text');

  const designLabel = designId
    ? getDesignById(designId)?.name ?? 'Unknown'
    : newDesignName ?? 'New Design';

  function handleSubmit() {
    if (!user) return;
    const sticker = submit(user.id);
    router.dismissAll();
    router.push(`/sticker/${sticker.id}`);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type="subtitle">Summary</ThemedText>

      <View style={styles.summaryRow}>
        {photoUri && <Image source={photoUri} style={styles.thumb} contentFit="cover" />}
        <View style={styles.summaryInfo}>
          <ThemedText style={styles.designLabel}>{designLabel}</ThemedText>
        </View>
      </View>

      <ThemedText type="subtitle" style={styles.label}>
        Note (optional)
      </ThemedText>
      <TextInput
        style={[styles.input, { color: textColor, borderColor: textColor + '33' }]}
        placeholder="Where did you spot this? Any context?"
        placeholderTextColor={textColor + '66'}
        value={note}
        onChangeText={setNote}
        multiline
        numberOfLines={3}
      />

      <Pressable style={styles.button} onPress={handleSubmit}>
        <ThemedText style={styles.buttonText}>Log Sticker</ThemedText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  summaryRow: { flexDirection: 'row', marginTop: 12, marginBottom: 20, gap: 12 },
  thumb: { width: 80, height: 80, borderRadius: 8 },
  summaryInfo: { flex: 1, justifyContent: 'center' },
  designLabel: { fontWeight: '600', fontSize: 16 },
  label: { marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
