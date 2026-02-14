import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { fetchDesignStickers } from '@/lib/api';
import { useLogSticker } from '@/lib/log-sticker-context';
import type { Sticker } from '@/lib/types';

type StickerWithPhoto = Sticker & { photoUri?: string; sightingCount?: number };

const NEARBY_THRESHOLD_M = 200;

function distanceMeters(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function MatchStickerScreen() {
  const { designId, latitude, longitude, setStickerId } = useLogSticker();
  const [nearby, setNearby] = useState<StickerWithPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!designId) {
      setLoading(false);
      return;
    }
    fetchDesignStickers(designId).then((stickers) => {
      if (latitude != null && longitude != null) {
        const filtered = stickers.filter(
          (s) => distanceMeters(latitude, longitude, s.latitude, s.longitude) <= NEARBY_THRESHOLD_M,
        );
        setNearby(filtered);
      }
      setLoading(false);
    });
  }, [designId, latitude, longitude]);

  function pickSticker(id: string) {
    setStickerId(id);
    router.push('/log/note');
  }

  const skipped = useRef(false);

  useEffect(() => {
    if (!loading && nearby.length === 0 && !skipped.current) {
      skipped.current = true;
      router.replace('/log/note');
    }
  }, [loading, nearby.length]);

  function newSticker() {
    router.push('/log/note');
  }

  if (loading || nearby.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FlatList
      data={nearby}
      keyExtractor={(s) => s.id}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={styles.header}>
          <ThemedText type="subtitle">Same sticker?</ThemedText>
          <ThemedText style={styles.hint}>
            We found this design nearby. Is it one of these?
          </ThemedText>
        </View>
      }
      renderItem={({ item }) => (
        <Pressable style={styles.card} onPress={() => pickSticker(item.id)}>
          {item.photoUri ? (
            <Image source={item.photoUri} style={styles.cardImage} contentFit="cover" />
          ) : (
            <View style={[styles.cardImage, styles.placeholder]} />
          )}
          <View style={styles.cardInfo}>
            <ThemedText style={styles.cardLocation}>{item.locationName}</ThemedText>
            <ThemedText style={styles.cardCount}>
              {item.sightingCount ?? 1} sighting{(item.sightingCount ?? 1) !== 1 ? 's' : ''}
            </ThemedText>
          </View>
        </Pressable>
      )}
      ListFooterComponent={
        <Pressable style={styles.newButton} onPress={newSticker}>
          <ThemedText style={styles.newButtonText}>+ New Sticker</ThemedText>
        </Pressable>
      }
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 16 },
  header: { marginBottom: 16 },
  hint: { opacity: 0.6, marginTop: 4 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
    gap: 12,
  },
  cardImage: { width: 60, height: 60, borderRadius: 8 },
  placeholder: { backgroundColor: '#ddd' },
  cardInfo: { flex: 1 },
  cardLocation: { fontWeight: '600', fontSize: 15 },
  cardCount: { opacity: 0.5, fontSize: 13, marginTop: 2 },
  newButton: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0a7ea4',
    alignItems: 'center',
  },
  newButtonText: {
    color: '#0a7ea4',
    fontWeight: '600',
    fontSize: 16,
  },
});
