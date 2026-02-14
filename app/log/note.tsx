import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@/lib/auth-context';
import { useLogSticker } from '@/lib/log-sticker-context';
import { fetchDesign } from '@/lib/api';

export default function NoteScreen() {
  const { photoUri, designId, newDesignName, stickerId, locationDescription, setLocationDescription, note, setNote, submit } = useLogSticker();
  const { user } = useAuth();
  const textColor = useThemeColor({}, 'text');
  const [designLabel, setDesignLabel] = useState(newDesignName ?? 'New Design');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (designId) {
      fetchDesign(designId).then((d) => {
        if (d) setDesignLabel(d.name);
      });
    }
  }, [designId]);

  async function handleSubmit() {
    if (!user || submitting) return;
    setSubmitting(true);
    try {
      const { stickerId } = await submit();
      router.dismissAll();
      router.push(`/sticker/${stickerId}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <ThemedText type="subtitle">Summary</ThemedText>

      <View style={styles.summaryRow}>
        {photoUri && <Image source={photoUri} style={styles.thumb} contentFit="cover" />}
        <View style={styles.summaryInfo}>
          <ThemedText style={styles.designLabel}>{designLabel}</ThemedText>
        </View>
      </View>

      {!stickerId && (
        <>
          <ThemedText type="subtitle" style={styles.label}>
            Location Description
          </ThemedText>
          <TextInput
            style={[styles.input, styles.singleLine, { color: textColor, borderColor: textColor + '33' }]}
            placeholder="e.g. on a dumpster, on a lamp post"
            placeholderTextColor={textColor + '66'}
            value={locationDescription}
            onChangeText={setLocationDescription}
          />
        </>
      )}

      <ThemedText type="subtitle" style={styles.label}>
        Notes (optional)
      </ThemedText>
      <TextInput
        style={[styles.input, { color: textColor, borderColor: textColor + '33' }]}
        placeholder="Any additional context?"
        placeholderTextColor={textColor + '66'}
        value={note}
        onChangeText={setNote}
        multiline
        numberOfLines={3}
      />

      <Pressable
        style={[styles.button, submitting && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        <ThemedText style={styles.buttonText}>
          {submitting ? 'Logging...' : 'Log Sticker'}
        </ThemedText>
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
  singleLine: {
    minHeight: 0,
  },
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
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
