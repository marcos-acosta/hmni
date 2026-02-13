import { Image } from 'expo-image';
import { Link, useLocalSearchParams } from 'expo-router';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { StickerMap } from '@/components/sticker-map';
import { ThemedText } from '@/components/themed-text';
import { getDesignById, getStickersForDesign, getUserById } from '@/lib/mock-data';

export default function DesignDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const design = getDesignById(id);

  if (!design) {
    return (
      <View style={styles.center}>
        <ThemedText>Design not found.</ThemedText>
      </View>
    );
  }

  const creator = getUserById(design.creatorId);
  const stickers = getStickersForDesign(design.id);

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Image source={design.imageUrl} style={styles.heroImage} contentFit="cover" />
      <View style={styles.info}>
        <ThemedText type="title">{design.name}</ThemedText>
        <ThemedText style={styles.description}>{design.description}</ThemedText>
        {creator && (
          <Link href={`/user/${creator.id}`} asChild>
            <Pressable>
              <ThemedText type="link">by {creator.username}</ThemedText>
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
          <StickerMap stickers={stickers} style={styles.map} interactive={false} />
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
