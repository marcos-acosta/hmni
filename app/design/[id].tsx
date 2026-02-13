import { Image } from 'expo-image';
import { Link, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { StickerMap } from '@/components/sticker-map';
import { ThemedText } from '@/components/themed-text';
import { fetchDesign, fetchDesignStickers } from '@/lib/api';
import type { Design, Sticker } from '@/lib/types';

export default function DesignDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [design, setDesign] = useState<(Design & { creatorUsername?: string }) | null>(null);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let stale = false;
      Promise.all([fetchDesign(id), fetchDesignStickers(id)]).then(([d, s]) => {
        if (!stale) {
          setDesign(d);
          setStickers(s);
          setLoading(false);
        }
      });
      return () => { stale = true; };
    }, [id])
  );

  if (loading) {
    return <View style={styles.center}><ActivityIndicator /></View>;
  }

  if (!design) {
    return (
      <View style={styles.center}>
        <ThemedText>Design not found.</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Image source={design.imageUrl} style={styles.heroImage} contentFit="cover" />
      <View style={styles.info}>
        <ThemedText type="title">{design.name}</ThemedText>
        <ThemedText style={styles.description}>{design.description}</ThemedText>
        {design.creatorUsername && (
          <Link href={`/user/${design.creatorId}`} asChild>
            <Pressable>
              <ThemedText type="link">by {design.creatorUsername}</ThemedText>
            </Pressable>
          </Link>
        )}
      </View>

      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Spotted ({stickers.length})
      </ThemedText>

      {stickers.length > 0 ? (
        <>
          <FlatList
            data={stickers}
            keyExtractor={(s) => s.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.gallery}
            scrollEnabled
            renderItem={({ item }) => (
              <Link href={`/sticker/${item.id}`} asChild>
                <Pressable style={styles.stickerCard}>
                  <Image source={item.photoUri} style={styles.stickerImage} contentFit="cover" />
                  <ThemedText numberOfLines={1} style={styles.stickerLocation}>
                    {item.locationName}
                  </ThemedText>
                </Pressable>
              </Link>
            )}
          />
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Map
          </ThemedText>
          <StickerMap stickers={stickers} style={styles.map} interactive={true} />
        </>
      ) : (
        <ThemedText style={styles.empty}>No stickers spotted yet.</ThemedText>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingBottom: 32 },
  heroImage: { width: '100%', height: 250 },
  info: { padding: 16 },
  description: { marginTop: 4, marginBottom: 8, opacity: 0.7 },
  sectionTitle: { paddingHorizontal: 16, marginTop: 16, marginBottom: 8 },
  gallery: { paddingHorizontal: 16 },
  stickerCard: { width: 140, marginRight: 10 },
  stickerImage: { width: 140, height: 140, borderRadius: 8 },
  stickerLocation: { fontSize: 12, marginTop: 4, opacity: 0.7 },
  map: { height: 200, marginHorizontal: 16, borderRadius: 12, overflow: 'hidden' },
  empty: { opacity: 0.5, paddingHorizontal: 16 },
});
