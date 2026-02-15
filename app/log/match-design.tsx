import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { DesignCard } from '@/components/design-card';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useLogSticker } from '@/lib/log-sticker-context';
import { useDesignSearch } from '@/lib/use-design-search';

export default function MatchDesignScreen() {
  const { photoUri, setDesignId } = useLogSticker();
  const { query, setQuery, results, searching } = useDesignSearch(10);
  const textColor = useThemeColor({}, 'text');

  function pickDesign(id: string) {
    setDesignId(id);
    router.push('/log/match-sticker');
  }

  return (
    <FlatList
      data={results}
      keyExtractor={(d) => d.id}
      numColumns={2}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={styles.header}>
          {photoUri && (
            <Image source={photoUri} style={styles.preview} contentFit="cover" />
          )}
          <ThemedText type="subtitle">Which design is this?</ThemedText>
          <TextInput
            style={[styles.input, { color: textColor, borderColor: textColor + '33' }]}
            placeholder="Search designs..."
            placeholderTextColor={textColor + '66'}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Pressable style={styles.newButton} onPress={() => router.push('/log/new-design')}>
            <ThemedText style={styles.newButtonText}>+ New Design</ThemedText>
          </Pressable>
          {searching && <ActivityIndicator style={styles.loader} />}
        </View>
      }
      renderItem={({ item }) => (
        <DesignCard design={item} onPress={() => pickDesign(item.id)} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 8 },
  header: { alignItems: 'center', padding: 16 },
  preview: { width: 120, height: 120, borderRadius: 12, marginBottom: 12 },
  input: {
    alignSelf: 'stretch',
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  newButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0a7ea4',
  },
  newButtonText: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
  loader: { marginTop: 12 },
});
