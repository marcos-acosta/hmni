import { Image } from 'expo-image';
import { Link, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { StickerMap } from '@/components/sticker-map';
import { ThemedText } from '@/components/themed-text';
import { fetchDesign, fetchDesignStickers, fetchDesignSightings } from '@/lib/api';
import type { Design, Sighting, Sticker } from '@/lib/types';

type StickerWithPhoto = Sticker & { photoUri?: string };
type SightingWithMeta = Sighting & { username?: string };

export default function DesignDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [design, setDesign] = useState<(Design & { creatorUsername?: string }) | null>(null);
  const [stickers, setStickers] = useState<StickerWithPhoto[]>([]);
  const [sightings, setSightings] = useState<SightingWithMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let stale = false;
      Promise.all([fetchDesign(id), fetchDesignStickers(id), fetchDesignSightings(id)]).then(([d, s, si]) => {
        if (!stale) {
          setDesign(d);
          setStickers(s);
          setSightings(si);
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
        {design.text ? (
          <ThemedText style={styles.designText}>{design.text}</ThemedText>
        ) : null}
        {design.creatorUsername && (
          <Link href={`/user/${design.creatorId}`} asChild>
            <Pressable>
              <ThemedText type="link">by {design.creatorUsername}</ThemedText>
            </Pressable>
          </Link>
        )}
      </View>

      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Spotted ({sightings.length})
      </ThemedText>

      {sightings.length > 0 ? (
        <>
          <FlatList
            data={sightings}
            keyExtractor={(s) => s.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.gallery}
            scrollEnabled
            renderItem={({ item }) => (
              <Link href={`/sticker/${item.stickerId}`} asChild>
                <Pressable style={styles.stickerCard}>
                  <Image source={item.photoUri} style={styles.stickerImage} contentFit="cover" />
                  <ThemedText numberOfLines={1} style={styles.stickerLocation}>
                    {item.username}
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
  description: { marginTop: 4, marginBottom: 4, opacity: 0.7 },
  designText: { marginBottom: 8, fontWeight: '600', opacity: 0.8 },
  sectionTitle: { paddingHorizontal: 16, marginTop: 16, marginBottom: 8 },
  gallery: { paddingHorizontal: 16 },
  stickerCard: { width: 140, marginRight: 10 },
  stickerImage: { width: 140, height: 140, borderRadius: 8 },
  stickerLocation: { fontSize: 12, marginTop: 4, opacity: 0.7 },
  map: { height: 200, marginHorizontal: 16, borderRadius: 12, overflow: 'hidden' },
  empty: { opacity: 0.5, paddingHorizontal: 16 },
});
