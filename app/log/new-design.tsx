import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useLogSticker } from '@/lib/log-sticker-context';

export default function NewDesignScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { setNewDesign } = useLogSticker();
  const textColor = useThemeColor({}, 'text');

  function handleNext() {
    if (!name.trim()) return;
    setNewDesign(name.trim(), description.trim());
    router.push('/log/note');
  }

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.label}>
        Design Name
      </ThemedText>
      <TextInput
        style={[styles.input, { color: textColor, borderColor: textColor + '33' }]}
        placeholder="e.g. Pigeon Party"
        placeholderTextColor={textColor + '66'}
        value={name}
        onChangeText={setName}
      />

      <ThemedText type="subtitle" style={styles.label}>
        Description
      </ThemedText>
      <TextInput
        style={[styles.input, styles.textArea, { color: textColor, borderColor: textColor + '33' }]}
        placeholder="Describe the design..."
        placeholderTextColor={textColor + '66'}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
      />

      <Pressable
        style={[styles.button, !name.trim() && styles.buttonDisabled]}
        onPress={handleNext}
        disabled={!name.trim()}>
        <ThemedText style={styles.buttonText}>Next</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  label: { marginBottom: 6, marginTop: 16 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
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
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
