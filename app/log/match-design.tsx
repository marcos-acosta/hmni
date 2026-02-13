import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { fetchDesigns } from '@/lib/api';
import { useLogSticker } from '@/lib/log-sticker-context';
import type { Design } from '@/lib/types';

export default function MatchDesignScreen() {
  const { photoUri, setDesignId } = useLogSticker();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDesigns().then((d) => {
      setDesigns(d);
      setLoading(false);
    });
  }, []);

  function pickDesign(id: string) {
    setDesignId(id);
    router.push('/log/note');
  }

  return (
    <FlatList
      data={designs}
      keyExtractor={(d) => d.id}
      numColumns={2}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={styles.header}>
          {photoUri && (
            <Image source={photoUri} style={styles.preview} contentFit="cover" />
          )}
          <ThemedText type="subtitle">Which design is this?</ThemedText>
          <Pressable style={styles.newButton} onPress={() => router.push('/log/new-design')}>
            <ThemedText style={styles.newButtonText}>+ New Design</ThemedText>
          </Pressable>
          {loading && <ActivityIndicator style={styles.loader} />}
        </View>
      }
      renderItem={({ item }) => (
        <Pressable style={styles.designCard} onPress={() => pickDesign(item.id)}>
          <Image source={item.imageUrl} style={styles.designImage} contentFit="cover" />
          <ThemedText numberOfLines={1} style={styles.designName}>
            {item.name}
          </ThemedText>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 8 },
  header: { alignItems: 'center', padding: 16 },
  preview: { width: 120, height: 120, borderRadius: 12, marginBottom: 12 },
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
  designCard: {
    flex: 1,
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  designImage: {
    aspectRatio: 1,
    width: '100%',
    borderRadius: 8,
  },
  designName: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
    paddingHorizontal: 2,
  },
});
