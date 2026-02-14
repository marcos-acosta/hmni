import { Image } from 'expo-image';
import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { StickerMap } from '@/components/sticker-map';
import { ThemedText } from '@/components/themed-text';
import { fetchSticker } from '@/lib/api';
import type { Sighting, Sticker } from '@/lib/types';

type StickerDetail = Sticker & {
  designName?: string;
  sightings: (Sighting & { username?: string })[];
};

export default function StickerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [sticker, setSticker] = useState<StickerDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSticker(id).then((s) => {
      setSticker(s as StickerDetail | null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator /></View>;
  }

  if (!sticker) {
    return (
      <View style={styles.center}>
        <ThemedText>Sticker not found.</ThemedText>
      </View>
    );
  }

  const heroPhoto = sticker.sightings[0]?.photoUri;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {heroPhoto && (
        <Image source={heroPhoto} style={styles.photo} contentFit="cover" />
      )}

      {sticker.designName && (
        <Link href={`/design/${sticker.designId}`} asChild>
          <Pressable>
            <ThemedText type="link" style={styles.link}>
              Design: {sticker.designName}
            </ThemedText>
          </Pressable>
        </Link>
      )}

      <ThemedText style={styles.location}>{sticker.locationName}</ThemedText>

      <StickerMap
        stickers={[sticker]}
        style={styles.map}
        interactive={false}
        centerCoordinate={[sticker.longitude, sticker.latitude]}
        zoomLevel={14}
      />

      <ThemedText type="subtitle" style={styles.sightingsTitle}>
        Sightings ({sticker.sightings.length})
      </ThemedText>

      {sticker.sightings.map((sighting) => (
        <View key={sighting.id} style={styles.sightingCard}>
          {sighting.photoUri ? (
            <Image source={sighting.photoUri} style={styles.sightingPhoto} contentFit="cover" />
          ) : null}
          <View style={styles.sightingInfo}>
            {sighting.username && (
              <Link href={`/user/${sighting.userId}`} asChild>
                <Pressable>
                  <ThemedText type="link" style={styles.sightingUser}>
                    {sighting.username}
                  </ThemedText>
                </Pressable>
              </Link>
            )}
            {sighting.locationDescription ? (
              <ThemedText style={styles.sightingLocation}>{sighting.locationDescription}</ThemedText>
            ) : null}
            {sighting.note ? (
              <ThemedText style={styles.sightingNote}>{sighting.note}</ThemedText>
            ) : null}
            <ThemedText style={styles.sightingDate}>
              {new Date(sighting.loggedAt).toLocaleDateString()}
            </ThemedText>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, paddingBottom: 32 },
  photo: { width: '100%', height: 300, borderRadius: 12, marginBottom: 16 },
  link: { marginBottom: 8 },
  location: { fontWeight: '600', marginBottom: 8 },
  map: { height: 180, borderRadius: 12, overflow: 'hidden', marginBottom: 16 },
  sightingsTitle: { marginTop: 8, marginBottom: 12 },
  sightingCard: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  sightingPhoto: { width: 80, height: 80, borderRadius: 8 },
  sightingInfo: { flex: 1, justifyContent: 'center' },
  sightingUser: { fontWeight: '600', marginBottom: 2 },
  sightingLocation: { opacity: 0.7, marginBottom: 2 },
  sightingNote: { fontStyle: 'italic', opacity: 0.7, marginBottom: 2 },
  sightingDate: { opacity: 0.5, fontSize: 13 },
});
