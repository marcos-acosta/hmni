import { Image } from 'expo-image';
import { Link, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { StickerMap } from '@/components/sticker-map';
import { ThemedText } from '@/components/themed-text';
import { getDesignById, getStickerById, getUserById } from '@/lib/mock-data';

export default function StickerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const sticker = getStickerById(id);

  if (!sticker) {
    return (
      <View style={styles.center}>
        <ThemedText>Sticker not found.</ThemedText>
      </View>
    );
  }

  const design = getDesignById(sticker.designId);
  const user = getUserById(sticker.userId);
  const date = new Date(sticker.loggedAt).toLocaleDateString();

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Image source={sticker.photoUri} style={styles.photo} contentFit="cover" />

      {design && (
        <Link href={`/design/${design.id}`} asChild>
          <Pressable>
            <ThemedText type="link" style={styles.link}>
              Design: {design.name}
            </ThemedText>
          </Pressable>
        </Link>
      )}

      {user && (
        <Link href={`/user/${user.id}`} asChild>
          <Pressable>
            <ThemedText type="link" style={styles.link}>
              Logged by {user.username}
            </ThemedText>
          </Pressable>
        </Link>
      )}

      <ThemedText style={styles.date}>{date}</ThemedText>
      <ThemedText style={styles.location}>{sticker.locationName}</ThemedText>

      {sticker.note ? (
        <ThemedText style={styles.note}>{sticker.note}</ThemedText>
      ) : null}

      <StickerMap
        stickers={[sticker]}
        style={styles.map}
        interactive={false}
        centerCoordinate={[sticker.longitude, sticker.latitude]}
        zoomLevel={14}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, paddingBottom: 32 },
  photo: { width: '100%', height: 300, borderRadius: 12, marginBottom: 16 },
  link: { marginBottom: 8 },
  date: { opacity: 0.5, marginBottom: 4 },
  location: { fontWeight: '600', marginBottom: 8 },
  note: { marginTop: 8, fontStyle: 'italic', opacity: 0.7, marginBottom: 16 },
  map: { height: 180, borderRadius: 12, overflow: 'hidden', marginTop: 8 },
});
